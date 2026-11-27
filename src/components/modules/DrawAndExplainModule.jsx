import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PenTool,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  CheckCircle2,
  Upload,
  User,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Stethoscope,
  Info,
  ChevronDown,
  RefreshCw,
  Sparkles,
  AlertCircle,
  FileImage,
  Layers,
  Eye
} from 'lucide-react';

// Template options with user-provided images
const TEMPLATES = [
  {
    id: 'adult_32',
    name: 'Adult Teeth – 32 Teeth',
    category: 'Panoramic OPG',
    imageSrc: '/dental-templates/adult-teeth-32.jpg',
    description: 'Complete 32-teeth adult dentition panoramic radiograph'
  },
  {
    id: 'child_4_10',
    name: 'Child Teeth – Age 4–10 Years',
    category: 'Pediatric OPG',
    imageSrc: '/dental-templates/child-teeth-4-10.jpg',
    description: 'Mixed dentition panoramic radiograph showing permanent tooth buds'
  },
  {
    id: 'tooth_anatomy',
    name: 'Tooth Anatomy – Roots & Pulp',
    category: 'Anatomy Cross-Section',
    imageSrc: '/dental-templates/tooth-anatomy-roots-pulp.jpg',
    description: 'Detailed crown, pulp chamber, root canals, and apex anatomy'
  },
  {
    id: 'blank',
    name: 'Blank White Sheet',
    category: 'Freehand Canvas',
    imageSrc: null,
    description: 'Clean clinical whiteboard for custom diagrams and patient explanations'
  }
];

const COLORS = [
  { label: 'Red (Caries / Infection / Canal)', value: '#E11D48' },
  { label: 'Blue (Crown / Treatment Planned)', value: '#1769D2' },
  { label: 'Green (Healthy / Restored)', value: '#10B981' },
  { label: 'Amber (Calculus / Plaque / Alert)', value: '#F59E0B' },
  { label: 'Purple (RCT / Endodontic File)', value: '#8B5CF6' },
  { label: 'Dark Navy (Annotations / Margin)', value: '#092C60' }
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 2 },
  { label: 'Medium', size: 4 },
  { label: 'Thick', size: 7 },
  { label: 'Bold', size: 12 }
];

export default function DrawAndExplainModule() {
  const {
    patients,
    activePatientId,
    setActivePatientId,
    activePatient,
    doctors,
    saveDentalImage,
    updateDentalImage,
    activeDrawingToLoad,
    setActiveDrawingToLoad,
    showToast
  } = useApp();

  // Selection state
  const [selectedPatientId, setSelectedPatientId] = useState(
    activeDrawingToLoad?.patientId || activePatientId || (patients[0]?.id ?? '')
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState('adult_32');
  const [customXrayUrl, setCustomXrayUrl] = useState(null);
  const [customXrayName, setCustomXrayName] = useState('');

  // Tool states
  const [tool, setTool] = useState('pen'); // 'pen' | 'eraser'
  const [color, setColor] = useState('#E11D48');
  const [brushSize, setBrushSize] = useState(4);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100%, 1.25, 1.5, 0.75
  const [includeOnRx, setIncludeOnRx] = useState(true);

  // Metadata form
  const [drawingTitle, setDrawingTitle] = useState('Adult Teeth Panoramic Assessment');
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'DOC-01');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [editingDrawingId, setEditingDrawingId] = useState(null);
  const [patientSelectError, setPatientSelectError] = useState(false);

  // Canvas references (Two-Layer Architecture)
  const bgCanvasRef = useRef(null);
  const drawCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef({ x: 0, y: 0 });

  // Undo / Redo history stack (stores imageData of drawCanvas)
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Canvas dimensions
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 560;

  // Selected patient object
  const currentPatient = patients.find(p => p.id === selectedPatientId) || null;

  // Synchronize when activeDrawingToLoad arrives from Patient Profile
  useEffect(() => {
    if (activeDrawingToLoad) {
      if (activeDrawingToLoad.patientId) {
        setSelectedPatientId(activeDrawingToLoad.patientId);
        setActivePatientId(activeDrawingToLoad.patientId);
      }
      if (activeDrawingToLoad.title) {
        setDrawingTitle(activeDrawingToLoad.title);
      }
      if (activeDrawingToLoad.notes) {
        setClinicalNotes(activeDrawingToLoad.notes);
      }
      if (activeDrawingToLoad.id) {
        setEditingDrawingId(activeDrawingToLoad.id);
      }
      if (activeDrawingToLoad.templateId) {
        setSelectedTemplateId(activeDrawingToLoad.templateId);
      }
      if (activeDrawingToLoad.customXrayUrl) {
        setCustomXrayUrl(activeDrawingToLoad.customXrayUrl);
      }

      // If existing composite/annotation image is passed, load onto drawCanvas
      if (activeDrawingToLoad.imageData) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const drawCanvas = drawCanvasRef.current;
          if (drawCanvas) {
            const ctx = drawCanvas.getContext('2d');
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            saveHistorySnapshot();
          }
        };
        img.src = activeDrawingToLoad.imageData;
      }

      showToast(`Loaded "${activeDrawingToLoad.title || 'Clinical Drawing'}" for editing`);
      // Reset activeDrawingToLoad in context so it doesn't re-trigger
      setActiveDrawingToLoad(null);
    }
  }, [activeDrawingToLoad]);

  // Save snapshot to history stack
  const saveHistorySnapshot = useCallback(() => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyStep + 1);
      return [...upToCurrent, imageData];
    });
    setHistoryStep(prev => prev + 1);
  }, [historyStep, CANVAS_WIDTH, CANVAS_HEIGHT]);

  // Draw background image (or blank grid) on bgCanvas
  const renderBackground = useCallback(() => {
    const bgCanvas = bgCanvasRef.current;
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Fill white
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Check if custom X-ray is selected
    if (customXrayUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        drawScaledImage(ctx, img);
      };
      img.src = customXrayUrl;
      return;
    }

    const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplateId);
    if (!currentTemplate || !currentTemplate.imageSrc) {
      // Blank White Sheet - draw subtle clinical grid
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_WIDTH; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_WIDTH, y);
        ctx.stroke();
      }

      // Draw faint watermark
      ctx.save();
      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INDUS DENTAL • CLINICAL WHITEBOARD', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
      ctx.restore();
      return;
    }

    // Load template image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      drawScaledImage(ctx, img);
    };
    img.src = currentTemplate.imageSrc;
  }, [selectedTemplateId, customXrayUrl]);

  // Helper to draw image preserving aspect ratio centered on canvas
  const drawScaledImage = (ctx, img) => {
    // Fill canvas background with subtle dark or neutral tone for X-rays
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const scale = Math.min(CANVAS_WIDTH / img.width, CANVAS_HEIGHT / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (CANVAS_WIDTH - w) / 2;
    const y = (CANVAS_HEIGHT - h) / 2;

    ctx.drawImage(img, x, y, w, h);

    // Add subtle border around image
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
  };

  // Re-render background whenever template or custom X-ray changes
  useEffect(() => {
    renderBackground();
  }, [renderBackground]);

  // Initialize initial history snapshot on mount
  useEffect(() => {
    const drawCanvas = drawCanvasRef.current;
    if (drawCanvas && history.length === 0) {
      const ctx = drawCanvas.getContext('2d');
      const initialSnapshot = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      setHistory([initialSnapshot]);
      setHistoryStep(0);
    }
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, history.length]);

  // Drawing event handlers
  const getCoordinates = (e) => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return { x: 0, y: 0 };
    const rect = drawCanvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCoordinates(e);
    lastPointRef.current = coords;

    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = color;
    }
    ctx.fill();
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext('2d');

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    }

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      saveHistorySnapshot();
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyStep <= 0) return;
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext('2d');
    const newStep = historyStep - 1;
    ctx.putImageData(history[newStep], 0, 0);
    setHistoryStep(newStep);
  };

  const handleRedo = () => {
    if (historyStep >= history.length - 1) return;
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext('2d');
    const newStep = historyStep + 1;
    ctx.putImageData(history[newStep], 0, 0);
    setHistoryStep(newStep);
  };

  // Clear drawing annotations ONLY (leaves background intact)
  const handleClearDrawing = () => {
    const drawCanvas = drawCanvasRef.current;
    if (!drawCanvas) return;
    const ctx = drawCanvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    saveHistorySnapshot();
    showToast('Annotations cleared. Background template preserved.');
  };

  // Handle template selection
  const handleTemplateChange = (tmplId) => {
    setSelectedTemplateId(tmplId);
    setCustomXrayUrl(null);
    setCustomXrayName('');

    const tmpl = TEMPLATES.find(t => t.id === tmplId);
    if (tmpl) {
      setDrawingTitle(`${tmpl.name} Assessment`);
    }
  };

  // Handle custom X-ray file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Supported formats check: JPG, JPEG, PNG, WEBP
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      showToast('Please upload a valid image (JPG, JPEG, PNG, WEBP)', 'error');
      return;
    }

    // Size check (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      showToast('File size exceeds 15MB limit', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      setCustomXrayUrl(dataUrl);
      setCustomXrayName(file.name);
      setDrawingTitle(`Patient X-ray: ${file.name.replace(/\.[^/.]+$/, '')}`);
      showToast(`Uploaded ${file.name} successfully! Ready for annotation.`);
    };
    reader.readAsDataURL(file);

    // Reset file input so re-selecting same file works
    e.target.value = '';
  };

  // Generate composite image (Background + Drawing annotations combined)
  const generateCompositeImage = () => {
    const bgCanvas = bgCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    if (!bgCanvas || !drawCanvas) return null;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = CANVAS_WIDTH;
    tempCanvas.height = CANVAS_HEIGHT;
    const ctx = tempCanvas.getContext('2d');

    // 1. Draw background
    ctx.drawImage(bgCanvas, 0, 0);

    // 2. Draw annotations on top
    ctx.drawImage(drawCanvas, 0, 0);

    // 3. Add clinical watermark at bottom
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillRect(0, CANVAS_HEIGHT - 32, CANVAS_WIDTH, 32);

    ctx.fillStyle = '#092C60';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    const patientText = currentPatient ? `Patient: ${currentPatient.name} (${currentPatient.id})` : 'INDUS Dental Clinical';
    const dateText = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const doctorObj = doctors.find(d => d.id === selectedDoctorId);
    const doctorText = doctorObj
      ? (doctorObj.name.startsWith('Dr.') ? doctorObj.name : `Dr. ${doctorObj.name}`)
      : 'INDUS Dental Care';

    ctx.fillText(`${patientText} • ${doctorText} • ${dateText} • INDUS Dental CRM`, 16, CANVAS_HEIGHT - 12);
    ctx.restore();

    return tempCanvas.toDataURL('image/png', 0.95);
  };

  // Save to Patient Profile
  const handleSaveToPatientProfile = () => {
    if (!selectedPatientId) {
      setPatientSelectError(true);
      showToast('Please select a patient before saving to profile!', 'error');
      return;
    }
    setPatientSelectError(false);

    const compositeData = generateCompositeImage();
    if (!compositeData) {
      showToast('Error generating image preview', 'error');
      return;
    }

    const assignedDoc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];
    const templateName = customXrayName
      ? `Patient X-ray (${customXrayName})`
      : (TEMPLATES.find(t => t.id === selectedTemplateId)?.name || 'Clinical Canvas');

    const payload = {
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientUhid: currentPatient.id,
      patientPhone: currentPatient.phone,
      title: drawingTitle.trim() || `${templateName} - Clinical Annotation`,
      templateName,
      templateId: selectedTemplateId,
      customXrayUrl: customXrayUrl || null,
      customXrayName: customXrayName || null,
      doctorId: assignedDoc.id,
      doctorName: assignedDoc.name,
      notes: clinicalNotes.trim(),
      includeOnRx,
      imageData: compositeData
    };

    if (editingDrawingId) {
      updateDentalImage(editingDrawingId, payload);
    } else {
      saveDentalImage(payload);
    }

    // Update activePatientId to match saved patient
    setActivePatientId(currentPatient.id);
  };

  // Download Image
  const handleDownloadImage = () => {
    const compositeData = generateCompositeImage();
    if (!compositeData) return;

    const patientNameClean = currentPatient ? currentPatient.name.replace(/\s+/g, '_') : 'Patient';
    const titleClean = drawingTitle.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const fileName = `INDUS_${patientNameClean}_${titleClean}_${new Date().toISOString().split('T')[0]}.png`;

    const link = document.createElement('a');
    link.href = compositeData;
    link.download = fileName;
    link.click();
    showToast(`Downloaded ${fileName}`);
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-12">
      {/* ── TOP HEADER CARD ── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-black text-[#102A50] tracking-tight">
              Draw & Explain – Digital Clinical Canvas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#1769D2] text-white shadow-xs">
              Patient-Linked Visual Tool
            </span>
            {editingDrawingId && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Editing Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Annotate high-resolution dental radiographs, explain treatment plans, mark root canals, and save directly to Patient Profile.
          </p>
        </div>

        {/* Prescription toggle & Save Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 px-3 py-2 bg-[#EEF5FF] border border-blue-200 rounded-xl text-xs font-bold text-[#1769D2] cursor-pointer hover:bg-blue-100/70 transition-colors">
            <input
              type="checkbox"
              checked={includeOnRx}
              onChange={(e) => setIncludeOnRx(e.target.checked)}
              className="rounded accent-[#1769D2] w-4 h-4 cursor-pointer"
            />
            <span>Include on Live Rx</span>
          </label>

          <button
            type="button"
            onClick={handleDownloadImage}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Download PNG image"
          >
            <Download size={15} />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={handleSaveToPatientProfile}
            className="px-4 py-2 bg-[#16A779] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 size={16} />
            <span>Save to Patient Profile</span>
          </button>
        </div>
      </div>

      {/* ── PATIENT & PROCEDURE SELECTION BAR (MANDATORY PATIENT LINK) ── */}
      <div className={`p-4 rounded-2xl border transition-all ${
        patientSelectError ? 'bg-rose-50 border-rose-300 shadow-md ring-2 ring-rose-200' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-center">
          {/* 1. Patient Selector (Mandatory) */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <User size={13} className="text-[#1769D2]" />
              <span>Linked Patient * (Required)</span>
              {patientSelectError && (
                <span className="text-rose-600 font-bold normal-case text-[10px]">— Select a patient</span>
              )}
            </label>
            <div className="relative">
              <select
                value={selectedPatientId}
                onChange={(e) => {
                  setSelectedPatientId(e.target.value);
                  setActivePatientId(e.target.value);
                  setPatientSelectError(false);
                }}
                className={`w-full text-xs font-bold rounded-xl px-3 py-2 pr-8 appearance-none outline-none border transition-colors ${
                  patientSelectError
                    ? 'border-rose-400 bg-white text-rose-900 focus:ring-2 focus:ring-rose-200'
                    : 'border-slate-200 bg-[#F8FAFC] text-[#102A50] focus:border-[#1769D2] focus:bg-white'
                }`}
              >
                <option value="">— Select Patient —</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) • 📞 {p.phone}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 2. Drawing Title */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText size={13} className="text-[#1769D2]" />
              <span>Drawing Title / Procedure Notes</span>
            </label>
            <input
              type="text"
              value={drawingTitle}
              onChange={(e) => setDrawingTitle(e.target.value)}
              placeholder="e.g. Tooth #46 RCT Canal Marking"
              className="w-full text-xs font-semibold rounded-xl px-3 py-2 border border-slate-200 bg-[#F8FAFC] text-[#102A50] focus:border-[#1769D2] focus:bg-white outline-none"
            />
          </div>

          {/* 3. Treating Doctor */}
          <div>
            <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Stethoscope size={13} className="text-[#1769D2]" />
              <span>Treating Doctor</span>
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full text-xs font-bold rounded-xl px-3 py-2 border border-slate-200 bg-[#F8FAFC] text-[#102A50] focus:border-[#1769D2] focus:bg-white outline-none cursor-pointer"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty || 'Dental Surgeon'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Patient Mini Info Badge */}
        {currentPatient && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-extrabold text-[#102A50]">{currentPatient.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#12B89A] text-slate-950">
                {currentPatient.id}
              </span>
              <span>•</span>
              <span>{currentPatient.gender || 'Patient'}, {currentPatient.age} yrs</span>
              <span>•</span>
              <span>📞 {currentPatient.phone}</span>
              <span>•</span>
              <span>Blood: <b className="text-[#102A50]">{currentPatient.bloodGroup || 'B+'}</b></span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              ✓ Ready to save to Patient Profile
            </span>
          </div>
        )}
      </div>

      {/* ── MAIN CANVAS WORKSPACE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* ── TOOLBAR: Templates, Upload, Colors, Brush, Tools, Zoom ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          {/* Left Group: Template Dropdown & Patient X-ray Upload */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Template Dropdown (Exact 4 options requested) */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Template:</span>
              <div className="relative">
                <select
                  value={customXrayUrl ? 'custom' : selectedTemplateId}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      handleTemplateChange(e.target.value);
                    }
                  }}
                  className="text-xs font-extrabold bg-[#F8FAFC] border border-slate-300 rounded-xl px-3 py-1.5 pr-7 text-[#092C60] outline-none cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  {TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                  {customXrayUrl && (
                    <option value="custom">★ Uploaded Patient X-ray ({customXrayName || 'Custom'})</option>
                  )}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Patient X-ray Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1769D2] border border-blue-200 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Upload patient radiograph / RVG / OPG (JPG, PNG, WEBP)"
            >
              <Upload size={14} />
              <span>Upload Patient X-ray</span>
            </button>

            {customXrayUrl && (
              <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Custom X-ray: {customXrayName || 'Loaded'}
              </span>
            )}
          </div>

          {/* Center Group: Color Palette */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Color:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-200">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setColor(c.value);
                    setTool('pen');
                  }}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative ${
                    color === c.value && tool === 'pen' ? 'scale-125 ring-2 ring-blue-500 ring-offset-2 z-10' : 'hover:scale-110 opacity-90'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Right Group: Brush Size, Tools, Undo/Redo, Zoom */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Brush Size Selector */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              {BRUSH_SIZES.map(b => (
                <button
                  key={b.size}
                  type="button"
                  onClick={() => setBrushSize(b.size)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                    brushSize === b.size ? 'bg-[#1769D2] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                  title={`${b.label} (${b.size}px)`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* Pen Tool */}
            <button
              type="button"
              onClick={() => setTool('pen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                tool === 'pen' ? 'bg-[#1769D2] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Pen Drawing Tool"
            >
              <PenTool size={13} />
              <span>Pen</span>
            </button>

            {/* Eraser Tool (Erases only user markings) */}
            <button
              type="button"
              onClick={() => setTool('eraser')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                tool === 'eraser' ? 'bg-[#1769D2] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Eraser Tool (Erases annotations only, keeps image intact)"
            >
              <Eraser size={13} />
              <span>Eraser</span>
            </button>

            {/* Clear Annotations */}
            <button
              type="button"
              onClick={handleClearDrawing}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="Clear all user annotations (preserves background template)"
            >
              <Trash2 size={14} />
              <span className="hidden md:inline">Clear</span>
            </button>

            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={handleUndo}
                disabled={historyStep <= 0}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Undo last stroke"
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={handleRedo}
                disabled={historyStep >= history.length - 1}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                title="Redo stroke"
              >
                <RotateCw size={14} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.75, Math.round((prev - 0.25) * 100) / 100))}
                disabled={zoomLevel <= 0.75}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-bold text-slate-600 px-1 min-w-[42px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(2, Math.round((prev + 0.25) * 100) / 100))}
                disabled={zoomLevel >= 2}
                className="p-1.5 rounded-lg text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              {zoomLevel !== 1 && (
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="px-1.5 py-0.5 text-[10px] font-bold text-[#1769D2] hover:underline cursor-pointer"
                  title="Reset to 100%"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── TWO-LAYER CANVAS VIEWPORT ── */}
        <div className="relative w-full overflow-auto bg-slate-900/90 rounded-2xl p-4 flex justify-center items-center min-h-[580px] shadow-inner">
          <div
            style={{
              width: CANVAS_WIDTH,
              height: CANVAS_HEIGHT,
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out'
            }}
            className="relative shadow-2xl rounded-xl overflow-hidden shrink-0 border border-slate-700 bg-slate-950"
          >
            {/* Layer 1: Background Canvas (Template Image or Custom X-ray) */}
            <canvas
              ref={bgCanvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="absolute inset-0 pointer-events-none"
            />

            {/* Layer 2: Transparent Drawing Canvas (User annotations on top) */}
            <canvas
              ref={drawCanvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className={`absolute inset-0 touch-none select-none ${
                tool === 'eraser' ? 'cursor-crosshair' : 'cursor-crosshair'
              }`}
            />
          </div>
        </div>

        {/* ── CLINICAL INSTRUCTIONS & QUICK LEGEND ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-extrabold text-[#102A50] uppercase text-[11px]">Clinical Markings:</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]"></span> Caries / Canal Infection
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1769D2]"></span> Crown / Treatment Plan
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Healthy / Restored
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]"></span> Root Canal Obturation
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Eraser and Clear only wipe annotations, leaving the radiograph completely intact.
          </div>
        </div>
      </div>
    </div>
  );
}
