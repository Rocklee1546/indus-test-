import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Circle,
  Square,
  Type,
  FileImage,
  Upload
} from 'lucide-react';

export default function DrawAndExplainModule() {
  const { activePatient, currentUser, showToast } = useApp();

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#e11d48'); // Red by default for clinical marking
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState('pen'); // 'pen', 'eraser', 'circle', 'arrow'
  const [backgroundTemplate, setBackgroundTemplate] = useState('molar_cross_section');
  const [includeOnRx, setIncludeOnRx] = useState(true);

  const colors = [
    { label: 'Red (Caries / Infection)', value: '#e11d48' },
    { label: 'Blue (Crown / Treatment)', value: '#1769d2' },
    { label: 'Green (Healthy / Healed)', value: '#16a779' },
    { label: 'Amber (Calculus / Warning)', value: '#f59e0b' },
    { label: 'Purple (RCT Canal)', value: '#7955d9' },
    { label: 'Black (Outline / Notes)', value: '#0f172a' }
  ];

  // Draw background template on canvas
  const drawBackground = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Template graphics
    if (backgroundTemplate === 'molar_cross_section') {
      // Draw clinical tooth schematic
      ctx.save();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;

      // Crown outline
      ctx.beginPath();
      ctx.moveTo(300, 200);
      ctx.bezierCurveTo(280, 100, 420, 80, 450, 120);
      ctx.bezierCurveTo(480, 80, 620, 100, 600, 200);
      ctx.lineTo(580, 250);
      // Roots
      ctx.bezierCurveTo(570, 360, 560, 440, 540, 460);
      ctx.bezierCurveTo(520, 440, 500, 320, 450, 300);
      ctx.bezierCurveTo(400, 320, 380, 440, 360, 460);
      ctx.bezierCurveTo(340, 440, 330, 360, 320, 250);
      ctx.closePath();
      ctx.stroke();

      // Pulp chamber schematic
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(420, 180);
      ctx.bezierCurveTo(430, 150, 470, 150, 480, 180);
      ctx.lineTo(470, 250);
      // root canals
      ctx.lineTo(510, 400);
      ctx.moveTo(470, 250);
      ctx.lineTo(390, 400);
      ctx.stroke();

      // Labels
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Plus Jakarta Sans, sans-serif';
      ctx.fillText('Crown (Enamel & Dentin)', 220, 140);
      ctx.fillText('Pulp Chamber & Nerve', 490, 190);
      ctx.fillText('Mesial Root Canal', 280, 390);
      ctx.fillText('Distal Root Canal', 530, 390);
      ctx.restore();
    } else if (backgroundTemplate === 'dental_arch') {
      ctx.save();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(450, 260, 180, Math.PI, 0, false);
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px sans-serif';
      ctx.fillText('Upper Dental Arch (Maxilla)', 380, 70);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawBackground();
  }, [backgroundTemplate]);

  // Canvas drawing handlers
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
    } else {
      ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `Indus_Dental_Explanation_${activePatient.id}_Tooth46.png`;
    link.click();
    showToast('Patient explanation diagram downloaded successfully!');
  };

  const handleSaveToRecord = () => {
    showToast('Explanation drawing saved to patient clinical record & attached to Live Rx!');
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Draw & Explain – Digital Clinical Canvas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1769D2] text-white">
              Doctor-Patient Visual Tool
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Draw on tooth schematics, explain procedures, mark root canals, and attach annotations to prescriptions
          </p>
        </div>

        {/* Prescription toggle & Save */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 bg-[#EEF5FF] border border-blue-200 rounded-xl text-xs font-bold text-[#1769D2] cursor-pointer">
            <input
              type="checkbox"
              checked={includeOnRx}
              onChange={(e) => setIncludeOnRx(e.target.checked)}
              className="rounded accent-[#1769D2]"
            />
            <span>Include on Prescription (On this Rx)</span>
          </label>

          <button
            onClick={handleSaveToRecord}
            className="px-4 py-2 bg-[#16A779] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <CheckCircle2 size={15} />
            <span>Save to Patient Profile</span>
          </button>
        </div>
      </div>

      {/* Canvas Toolbars & Canvas Area */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Top Controls: Template Switcher, Color Swatches, Brush Size, Tools */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Background Templates */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Template:</span>
            <select
              value={backgroundTemplate}
              onChange={(e) => setBackgroundTemplate(e.target.value)}
              className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-1.5 text-[#102A50] outline-none cursor-pointer"
            >
              <option value="molar_cross_section">Molar Tooth Anatomy (Pulp & Roots)</option>
              <option value="dental_arch">Upper / Lower Dental Arch</option>
              <option value="blank">Blank Whiteboard</option>
            </select>
          </div>

          {/* Color Palette */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Color:</span>
            <div className="flex items-center gap-1.5">
              {colors.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setColor(c.value);
                    setTool('pen');
                  }}
                  className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                    color === c.value && tool === 'pen' ? 'scale-125 ring-2 ring-slate-400 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Tools: Pen, Eraser, Clear */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                tool === 'pen' ? 'bg-[#1769D2] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <PenTool size={14} />
              <span>Pen</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                tool === 'eraser' ? 'bg-[#1769D2] text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Eraser size={14} />
              <span>Eraser</span>
            </button>
            <button
              onClick={drawBackground}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
              title="Clear Canvas"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          </div>

          {/* Actions: Download / Print */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Download Image</span>
            </button>
          </div>
        </div>

        {/* Canvas Display */}
        <div className="flex justify-center bg-slate-100 p-4 rounded-3xl overflow-x-auto">
          <canvas
            ref={canvasRef}
            width={900}
            height={500}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="bg-white rounded-2xl shadow-md cursor-crosshair border border-slate-300 touch-none max-w-full"
          />
        </div>

        <div className="text-center text-xs text-slate-400">
          Tip: Use Red to highlight decay or lesions, and Blue/Purple to indicate root canal fillings and crowns to the patient.
        </div>
      </div>
    </div>
  );
}
