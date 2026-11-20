import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  Calendar,
  FileText,
  Clock,
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Heart,
  Stethoscope,
  Receipt,
  CheckCircle2,
  ChevronRight,
  CalendarPlus,
  UserCheck,
  Plus,
  Trash2,
  Edit3,
  Printer,
  Check,
  AlertCircle,
  ArrowRight,
  DollarSign,
  CreditCard,
  TrendingUp,
  Layers,
  Activity,
  PenTool,
  AlertTriangle,
  ArrowLeft,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Time slots for appointment booking
const APPT_TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'
];

export default function Patient360Drawer() {
  const {
    patient360Data,
    setPatient360Data,
    patients,
    updatePatient,
    appointments,
    addAppointment,
    openRescheduleAppt,
    openCancelAppt,
    treatmentPlans,
    addTreatmentPlan,
    updateTreatmentPlan,
    deleteTreatmentPlan,
    invoices,
    addInvoice,
    recordPayment,
    doctors,
    branches,
    selectedBranch,
    checkInPatient,
    isPatientCheckedIn,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  // Full-Screen & Resizable Panel State
  const [panelWidth, setPanelWidth] = useState('100%');
  const [isResizing, setIsResizing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(true);

  // Drag handle for resizing
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const calculatedWidth = Math.max(520, Math.min(window.innerWidth, window.innerWidth - e.clientX));
      setPanelWidth(`${calculatedWidth}px`);
      setIsFullScreen(calculatedWidth >= window.innerWidth - 30);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Find the live updated patient from `patients` or fallback to `patient360Data`
  const patient = useMemo(() => {
    if (!patient360Data) return null;
    return patients.find(p => p.id === patient360Data.id) || patient360Data;
  }, [patient360Data, patients]);

  // ─── 1. PERSONAL INFO STATE ───
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: '',
    age: '',
    bloodGroup: 'B+'
  });
  const [personalError, setPersonalError] = useState('');

  // ─── 2. APPOINTMENTS STATE ───
  const [isBookingAppt, setIsBookingAppt] = useState(false);
  const [apptDoctorId, setApptDoctorId] = useState(doctors[0]?.id || 'DOC-01');
  const [apptDate, setApptDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [apptTime, setApptTime] = useState('');
  const [apptTreatment, setApptTreatment] = useState('Routine Dental Checkup');
  const [apptChair, setApptChair] = useState('Chair 1');
  const [apptDuration, setApptDuration] = useState('20m');
  const [apptNotes, setApptNotes] = useState('');
  const [apptError, setApptError] = useState('');

  // ─── 3. MEDICAL HISTORY STATE ───
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [medicalForm, setMedicalForm] = useState({
    conditions: [],
    diabetes: 'No Diabetes',
    bloodPressure: 'Normal (120/80 mmHg)',
    heartConditions: 'None',
    respiratory: 'None',
    currentMedications: '',
    drugAllergies: 'None',
    surgeries: '',
    otherConditions: '',
    notes: ''
  });

  // ─── 4. DENTAL HISTORY STATE ───
  const [isEditingDental, setIsEditingDental] = useState(false);
  const [dentalForm, setDentalForm] = useState({
    previousTreatments: [],
    rootCanal: 'None',
    extractions: 'None',
    crownsBridges: 'None',
    implants: 'None',
    orthodontic: 'None',
    gumProblems: 'None',
    toothSensitivity: 'None',
    surgeries: '',
    lastVisit: '',
    currentComplaints: '',
    notes: ''
  });

  // ─── 5. TREATMENT PLANS STATE ───
  const [isAddingTreatmentPlan, setIsAddingTreatmentPlan] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [planForm, setPlanForm] = useState({
    treatmentName: '',
    toothNumber: 'Full Mouth',
    doctorId: doctors[0]?.id || 'DOC-01',
    estimatedCost: '',
    status: 'In Progress',
    stagesText: 'Diagnosis & Planning, Primary Procedure, Final Evaluation',
    notes: ''
  });

  // ─── 6. BILLING & PAYMENTS STATE ───
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    doctorId: doctors[0]?.id || 'DOC-01',
    description: 'OPD Consultation & Diagnostic RVG',
    qty: 1,
    rate: 800,
    discount: 0,
    amountPaid: 800,
    paymentMethod: 'UPI (GPay)'
  });
  const [activePaymentModalInv, setActivePaymentModalInv] = useState(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [paymentMethodInput, setPaymentMethodInput] = useState('UPI (GPay)');
  const [paymentNotesInput, setPaymentNotesInput] = useState('');
  const [activePrintInvoice, setActivePrintInvoice] = useState(null);

  // Sync state whenever patient changes
  useEffect(() => {
    if (patient) {
      setPersonalForm({
        name: patient.name || '',
        phone: patient.phone || '',
        altPhone: patient.altPhone || '',
        address: patient.address || '',
        age: patient.age || '',
        bloodGroup: patient.bloodGroup || 'B+'
      });
      setIsEditingPersonal(false);
      setPersonalError('');

      const med = patient.medicalHistory || {};
      setMedicalForm({
        conditions: med.conditions || (patient.medicalAlerts && patient.medicalAlerts !== 'None' ? [patient.medicalAlerts] : []),
        diabetes: med.diabetes || (patient.medicalAlerts?.toLowerCase().includes('diabetes') ? 'Type 2 Diabetes (Controlled)' : 'No Diabetes'),
        bloodPressure: med.bloodPressure || 'Normal (120/80 mmHg)',
        heartConditions: med.heartConditions || 'None',
        respiratory: med.respiratory || (patient.medicalAlerts?.toLowerCase().includes('asthma') ? 'Mild Intermittent Asthma' : 'None'),
        currentMedications: med.currentMedications || '',
        drugAllergies: med.drugAllergies || (patient.allergies?.join(', ') || 'No known drug allergies'),
        surgeries: med.surgeries || '',
        otherConditions: med.otherConditions || '',
        notes: med.notes || ''
      });
      setIsEditingMedical(false);

      const dent = patient.dentalHistory || {};
      setDentalForm({
        previousTreatments: dent.previousTreatments || ['Scaling / Cleaning'],
        rootCanal: dent.rootCanal || 'None',
        extractions: dent.extractions || 'None',
        crownsBridges: dent.crownsBridges || 'None',
        implants: dent.implants || 'None',
        orthodontic: dent.orthodontic || 'None',
        gumProblems: dent.gumProblems || 'None',
        toothSensitivity: dent.toothSensitivity || 'None',
        surgeries: dent.surgeries || '',
        lastVisit: dent.lastVisit || patient.lastVisit || '2026-11-01',
        currentComplaints: dent.currentComplaints || '',
        notes: dent.notes || ''
      });
      setIsEditingDental(false);
    }
  }, [patient?.id]);

  if (!patient) return null;

  const isCheckedIn = isPatientCheckedIn ? isPatientCheckedIn(patient.id, patient.name) : false;

  // Filter patient specific data
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);
  const patientTreatmentPlans = treatmentPlans.filter(tp => tp.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);

  // Compute Booked Slots for duplicate check
  const bookedSlotsForDoctorDate = new Set(
    appointments
      .filter(a => a.doctorId === apptDoctorId && a.date === apptDate && a.status !== 'Cancelled')
      .map(a => a.time)
  );

  // ─── TABS NAVIGATION (The 9 unnecessary sections removed) ───
  const tabs = [
    { id: 'overview', label: '1. Overview', icon: User },
    { id: 'personal', label: '2. Personal Info', icon: FileText },
    { id: 'appointments', label: '3. Appointments', icon: Calendar },
    { id: 'medical', label: '4. Medical History', icon: Heart },
    { id: 'dental_history', label: '5. Dental History', icon: Stethoscope },
    { id: 'treatment_plans', label: '6. Treatment Plans', icon: Layers },
    { id: 'billing', label: '7. Billing & Payments', icon: Receipt }
  ];

  // ─── HANDLERS ───

  // Save Personal Info
  const handleSavePersonal = (e) => {
    e.preventDefault();
    if (!personalForm.name.trim()) {
      setPersonalError('Full Name is required.');
      return;
    }
    const cleanPhone = personalForm.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setPersonalError('Please enter a valid 10-digit contact number.');
      return;
    }
    setPersonalError('');

    updatePatient(patient.id, {
      name: personalForm.name.trim(),
      phone: personalForm.phone.trim(),
      altPhone: personalForm.altPhone.trim(),
      address: personalForm.address.trim(),
      age: Number(personalForm.age) || patient.age,
      bloodGroup: personalForm.bloodGroup
    });

    setIsEditingPersonal(false);
  };

  // Save Booked Appointment
  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!apptTime) {
      setApptError('Please select a time slot.');
      return;
    }
    if (bookedSlotsForDoctorDate.has(apptTime)) {
      setApptError('This time slot is already booked for the selected doctor. Please choose another.');
      return;
    }
    setApptError('');

    const currentDoc = doctors.find(d => d.id === apptDoctorId) || doctors[0];

    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      phone: patient.phone,
      gender: patient.gender,
      age: patient.age,
      doctorId: currentDoc.id,
      doctorName: currentDoc.name,
      date: apptDate,
      time: apptTime,
      duration: apptDuration,
      treatmentType: apptTreatment,
      chair: apptChair,
      status: 'Confirmed',
      branchId: patient.preferredBranch || selectedBranch || 'RS_PURAM',
      notes: apptNotes || 'Booked from Patient Profile.'
    });

    setApptTime('');
    setApptNotes('');
    setIsBookingAppt(false);
    showToast(`Appointment booked for ${patient.name} on ${apptDate} at ${apptTime}!`);
  };

  // Save Medical History
  const handleSaveMedical = (e) => {
    e.preventDefault();
    const updatedMedHistory = { ...medicalForm };

    const calculatedAlerts = [
      updatedMedHistory.drugAllergies && updatedMedHistory.drugAllergies !== 'None' ? `Allergy: ${updatedMedHistory.drugAllergies}` : '',
      updatedMedHistory.diabetes && updatedMedHistory.diabetes !== 'No Diabetes' ? updatedMedHistory.diabetes : '',
      updatedMedHistory.bloodPressure && !updatedMedHistory.bloodPressure.includes('Normal') ? updatedMedHistory.bloodPressure : '',
      updatedMedHistory.heartConditions && updatedMedHistory.heartConditions !== 'None' ? updatedMedHistory.heartConditions : '',
      updatedMedHistory.respiratory && updatedMedHistory.respiratory !== 'None' ? updatedMedHistory.respiratory : ''
    ].filter(Boolean).join(', ') || 'None';

    updatePatient(patient.id, {
      medicalHistory: updatedMedHistory,
      allergies: updatedMedHistory.drugAllergies && updatedMedHistory.drugAllergies !== 'None' ? [updatedMedHistory.drugAllergies] : ['No known drug allergies'],
      medicalAlerts: calculatedAlerts
    });

    setIsEditingMedical(false);
  };

  // Save Dental History
  const handleSaveDental = (e) => {
    e.preventDefault();
    updatePatient(patient.id, {
      dentalHistory: { ...dentalForm }
    });
    setIsEditingDental(false);
  };

  // Save Treatment Plan
  const handleSaveTreatmentPlan = (e) => {
    e.preventDefault();
    if (!planForm.treatmentName.trim()) {
      showToast('Please enter treatment plan name', 'error');
      return;
    }

    const assignedDoc = doctors.find(d => d.id === planForm.doctorId) || doctors[0];
    const stages = planForm.stagesText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (editingPlanId) {
      updateTreatmentPlan(editingPlanId, {
        treatmentName: planForm.treatmentName.trim(),
        toothNumber: planForm.toothNumber.trim(),
        doctorId: assignedDoc.id,
        doctorName: assignedDoc.name,
        estimatedCost: Number(planForm.estimatedCost) || 0,
        status: planForm.status,
        stages: stages.length > 0 ? stages : ['Diagnosis', 'Procedure', 'Completion'],
        notes: planForm.notes
      });
      setEditingPlanId(null);
    } else {
      addTreatmentPlan({
        patientId: patient.id,
        patientName: patient.name,
        treatmentName: planForm.treatmentName.trim(),
        toothNumber: planForm.toothNumber.trim(),
        doctorId: assignedDoc.id,
        doctorName: assignedDoc.name,
        estimatedCost: Number(planForm.estimatedCost) || 0,
        status: planForm.status,
        stages: stages.length > 0 ? stages : ['Diagnosis', 'Procedure', 'Completion'],
        currentStageIndex: 0,
        notes: planForm.notes
      });
    }

    setIsAddingTreatmentPlan(false);
    setPlanForm({
      treatmentName: '',
      toothNumber: 'Full Mouth',
      doctorId: doctors[0]?.id || 'DOC-01',
      estimatedCost: '',
      status: 'In Progress',
      stagesText: 'Diagnosis & Planning, Primary Procedure, Final Evaluation',
      notes: ''
    });
  };

  // Save New Invoice
  const handleSaveInvoice = (e) => {
    e.preventDefault();
    const assignedDoc = doctors.find(d => d.id === invoiceForm.doctorId) || doctors[0];
    const subtotal = (Number(invoiceForm.qty) || 1) * (Number(invoiceForm.rate) || 0);
    const grandTotal = Math.max(0, subtotal - (Number(invoiceForm.discount) || 0));
    const paidAmount = Math.min(grandTotal, Number(invoiceForm.amountPaid) || 0);
    const balance = Math.max(0, grandTotal - paidAmount);

    addInvoice({
      patientId: patient.id,
      patientName: patient.name,
      branchId: patient.preferredBranch || 'RS_PURAM',
      doctorName: assignedDoc.name,
      items: [
        {
          description: invoiceForm.description,
          qty: Number(invoiceForm.qty) || 1,
          rate: Number(invoiceForm.rate) || 0,
          amount: subtotal
        }
      ],
      subtotal,
      discount: Number(invoiceForm.discount) || 0,
      tax: 0,
      grandTotal,
      paidAmount,
      balance,
      paymentMethod: invoiceForm.paymentMethod,
      paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      status: balance === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending'
    });

    setIsAddingInvoice(false);
  };

  // Record Payment Submit
  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!activePaymentModalInv) return;
    const ok = recordPayment(
      activePaymentModalInv.id,
      paymentAmountInput,
      paymentMethodInput,
      paymentNotesInput
    );
    if (ok) {
      setActivePaymentModalInv(null);
      setPaymentAmountInput('');
      setPaymentNotesInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div
        style={{ width: panelWidth }}
        className={`relative bg-[#F8FAFC] h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden ${
          isResizing ? 'select-none transition-none' : 'transition-[width] duration-150'
        }`}
      >
        {/* ── Left Resize Drag Handle ── */}
        <div
          onMouseDown={startResizing}
          className={`absolute left-0 top-0 bottom-0 w-2.5 hover:w-3 cursor-ew-resize z-40 transition-colors flex items-center justify-center group ${
            isResizing ? 'bg-[#1769D2]' : 'bg-transparent hover:bg-[#1769D2]/30'
          }`}
          title="Drag left edge to resize panel width"
        >
          <div className={`w-1 h-10 rounded-full transition-colors ${isResizing ? 'bg-white' : 'bg-slate-300 group-hover:bg-[#1769D2]'}`} />
        </div>

        {/* ── DRAWER HEADER ── */}
        <div className="bg-[#092C60] text-white px-6 py-4 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Clear Back Option */}
            <button
              onClick={() => setPatient360Data(null)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors mr-1 shrink-0 border border-white/15"
              title="Back to Patients Database"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#1769D2] flex items-center justify-center font-black text-lg text-white shadow-md shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white truncate">{patient.name}</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-[#12B89A] text-slate-950 shrink-0">
                  {patient.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/10 text-blue-200 shrink-0">
                  {patient.gender || 'Patient'}, {patient.age} yrs
                </span>
              </div>
              <p className="text-xs text-blue-200/80 flex items-center gap-2 mt-0.5 truncate">
                <span>📞 {patient.phone}</span>
                <span>•</span>
                <span>📍 {patient.preferredBranch?.replace('_', ' ') || 'Coimbatore'}</span>
                <span>•</span>
                <span>Blood: <b className="text-white">{patient.bloodGroup || 'B+'}</b></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isCheckedIn ? (
              <span className="px-3 py-1.5 bg-emerald-500/25 border border-emerald-400 text-emerald-300 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="hidden sm:inline">In Clinic (Checked In)</span>
              </span>
            ) : (
              <button
                onClick={() => checkInPatient(patient)}
                className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <UserCheck size={14} />
                <span className="hidden sm:inline">Check-In</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('appointments');
                setIsBookingAppt(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <CalendarPlus size={14} />
              <span className="hidden sm:inline">Book Appt</span>
            </button>

            {/* Fullscreen / Resize Toggle */}
            <button
              onClick={() => {
                if (isFullScreen) {
                  setPanelWidth('75%');
                  setIsFullScreen(false);
                } else {
                  setPanelWidth('100%');
                  setIsFullScreen(true);
                }
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title={isFullScreen ? 'Restore Panel Width' : 'Full-Screen Layout'}
            >
              {isFullScreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              onClick={() => setPatient360Data(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Close Profile"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── STREAMLINED TABS BAR (7 Essential Sections) ── */}
        <div className="bg-white border-b border-slate-200 px-4 flex items-center gap-1 overflow-x-auto scrollbar-thin shrink-0 py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#1769D2] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <tab.icon size={13} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT BODY ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* ══════════════════════════════════════════════════════════
              TAB 1: OVERVIEW
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Medical Alert Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                    Clinical Allergies & Medical Warnings
                  </h4>
                  <p className="text-xs font-semibold text-amber-800 mt-0.5">
                    {patient.allergies?.join(', ') || 'No known drug allergies'}. Alert: {patient.medicalAlerts || 'None'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('medical')}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                >
                  Edit Alerts
                </button>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400">Total Visits</div>
                  <div className="text-xl font-black text-[#102A50] mt-1">{patient.totalVisits || patientAppointments.length || 1}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Registered Patient</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400">Total Billed</div>
                  <div className="text-xl font-black text-[#1769D2] mt-1">₹{(patient.totalBilled || 0).toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Verified Billing</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400">Outstanding</div>
                  <div className={`text-xl font-black mt-1 ${(patient.outstandingBalance || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{(patient.outstandingBalance || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Due balance</div>
                </div>
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400">Last Visit</div>
                  <div className="text-xs font-bold text-slate-800 mt-2 truncate">{patient.lastVisit || 'Today'}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{patient.preferredBranch?.replace('_', ' ') || 'R.S. Puram'}</div>
                </div>
              </div>

              {/* Active Treatment Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                    <Stethoscope size={15} className="text-[#1769D2]" />
                    <span>Active Treatment Plans ({patientTreatmentPlans.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('treatment_plans')}
                    className="text-xs font-bold text-[#1769D2] hover:underline"
                  >
                    View All Plans →
                  </button>
                </div>
                {patientTreatmentPlans.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    No active treatment plans recorded. Click "Treatment Plans" tab to add one.
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {patientTreatmentPlans.slice(0, 2).map(tp => (
                      <div key={tp.id} className="p-3 bg-[#EEF5FF] rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#102A50]">{tp.treatmentName} {tp.toothNumber && `(${tp.toothNumber})`}</div>
                          <div className="text-[11px] text-slate-500">{tp.doctorName} • Est. ₹{tp.estimatedCost.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            tp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                            tp.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {tp.status}
                          </span>
                          <div className="text-[10px] text-blue-600 font-semibold mt-1">
                            Stage {(tp.currentStageIndex || 0) + 1} of {tp.stages?.length || 3}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Appointments Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xs text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={15} className="text-[#1769D2]" />
                    <span>Recent & Upcoming Appointments ({patientAppointments.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-bold text-[#1769D2] hover:underline"
                  >
                    Manage Slots →
                  </button>
                </div>
                {patientAppointments.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                    No appointments scheduled. Click "Book Appt" to select a slot.
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {patientAppointments.slice(0, 3).map(a => (
                      <div key={a.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#102A50]">{a.treatmentType}</div>
                          <div className="text-[11px] text-slate-500">
                            {a.doctorName} • {a.date} at {a.time}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          a.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                          a.status === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                          a.status === 'Waiting' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 2: PERSONAL INFO (Editable & Saveable)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'personal' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-[#102A50]">Patient Personal Information</h3>
                  <p className="text-xs text-slate-500">View and update demographics, phone numbers, and address.</p>
                </div>
                {!isEditingPersonal ? (
                  <button
                    type="button"
                    onClick={() => {
                      setPersonalForm({
                        name: patient.name || '',
                        phone: patient.phone || '',
                        altPhone: patient.altPhone || '',
                        address: patient.address || '',
                        age: patient.age || '',
                        bloodGroup: patient.bloodGroup || 'B+'
                      });
                      setIsEditingPersonal(true);
                    }}
                    className="px-3.5 py-1.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 size={13} />
                    <span>Edit Personal Details</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Editing Mode
                  </span>
                )}
              </div>

              {personalError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{personalError}</span>
                </div>
              )}

              {!isEditingPersonal ? (
                /* VIEW MODE */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Full Name</div>
                    <div className="font-extrabold text-slate-800 text-sm mt-1">{patient.name}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Contact Number</div>
                    <div className="font-extrabold text-[#1769D2] text-sm mt-1">📞 {patient.phone}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Alternate Contact Number</div>
                    <div className="font-semibold text-slate-700 mt-1">{patient.altPhone || 'Not provided'}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Age & Gender</div>
                    <div className="font-semibold text-slate-700 mt-1">{patient.age} yrs • {patient.gender || 'Not specified'}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Blood Group</div>
                    <div className="font-bold text-rose-600 mt-1">{patient.bloodGroup || 'B+'}</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Preferred Branch</div>
                    <div className="font-semibold text-slate-700 mt-1">{patient.preferredBranch?.replace('_', ' ') || 'R.S. Puram'}</div>
                  </div>
                  <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-[11px] font-bold text-slate-400 uppercase">Residential Address</div>
                    <div className="font-medium text-slate-700 mt-1">{patient.address || 'Address not on record.'}</div>
                  </div>
                </div>
              ) : (
                /* EDIT FORM */
                <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={personalForm.name}
                        onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Contact Number (Mobile) *
                      </label>
                      <input
                        type="tel"
                        value={personalForm.phone}
                        onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                        placeholder="10 digit mobile"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Alternate Contact Number
                      </label>
                      <input
                        type="tel"
                        value={personalForm.altPhone}
                        onChange={(e) => setPersonalForm({ ...personalForm, altPhone: e.target.value })}
                        placeholder="Optional alternate"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Age (Years)
                        </label>
                        <input
                          type="number"
                          value={personalForm.age}
                          onChange={(e) => setPersonalForm({ ...personalForm, age: e.target.value })}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Blood Group
                        </label>
                        <select
                          value={personalForm.bloodGroup}
                          onChange={(e) => setPersonalForm({ ...personalForm, bloodGroup: e.target.value })}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Address
                      </label>
                      <textarea
                        rows={2}
                        value={personalForm.address}
                        onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                        placeholder="Residential address"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingPersonal(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check size={14} />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 3: APPOINTMENTS (Functional Calendar & Slot Booking)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-sm text-[#102A50]">Patient Appointments & Slots</h3>
                  <p className="text-xs text-slate-500">Book new visits, view schedule, reschedule or cancel.</p>
                </div>
                <button
                  onClick={() => setIsBookingAppt(!isBookingAppt)}
                  className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <CalendarPlus size={14} />
                  <span>{isBookingAppt ? 'Close Booking Form' : '+ Book New Appointment'}</span>
                </button>
              </div>

              {/* INLINE APPOINTMENT BOOKING FORM */}
              {isBookingAppt && (
                <div className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-extrabold text-xs text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                      <CalendarPlus size={15} className="text-[#1769D2]" />
                      <span>Book Slot for {patient.name} ({patient.id})</span>
                    </h4>
                    <span className="text-[11px] text-slate-500 font-semibold">Auto-linked to Patient UHID</span>
                  </div>

                  {apptError && (
                    <div className="p-2.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center gap-2">
                      <AlertCircle size={14} />
                      <span>{apptError}</span>
                    </div>
                  )}

                  <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Select Treating Doctor *
                        </label>
                        <select
                          value={apptDoctorId}
                          onChange={(e) => setApptDoctorId(e.target.value)}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Appointment Date *
                        </label>
                        <input
                          type="date"
                          value={apptDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setApptDate(e.target.value)}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Treatment / Chief Complaint
                        </label>
                        <input
                          type="text"
                          value={apptTreatment}
                          onChange={(e) => setApptTreatment(e.target.value)}
                          placeholder="e.g. Root Canal, Consultation, Crown"
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Chair
                          </label>
                          <select
                            value={apptChair}
                            onChange={(e) => setApptChair(e.target.value)}
                            className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          >
                            <option value="Chair 1">Chair 1 (Main)</option>
                            <option value="Chair 2">Chair 2 (Surgical)</option>
                            <option value="Chair 3">Chair 3 (Pedo)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Duration
                          </label>
                          <select
                            value={apptDuration}
                            onChange={(e) => setApptDuration(e.target.value)}
                            className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          >
                            <option value="15m">15 mins</option>
                            <option value="20m">20 mins</option>
                            <option value="30m">30 mins</option>
                            <option value="45m">45 mins</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Available Time Slots Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Available Time Slots for {apptDate} *
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {bookedSlotsForDoctorDate.size} booked for doctor
                        </span>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                        {APPT_TIME_SLOTS.map(slot => {
                          const isBooked = bookedSlotsForDoctorDate.has(slot);
                          const isSelected = apptTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => {
                                setApptTime(slot);
                                setApptError('');
                              }}
                              className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer ${
                                isBooked
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-[#1769D2] text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-blue-50 border border-slate-200'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                      {apptTime && (
                        <div className="text-[11px] font-bold text-emerald-700 mt-1">
                          ✓ Selected slot: <span className="underline">{apptTime}</span> on {apptDate}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Reception / Pre-op Notes
                      </label>
                      <input
                        type="text"
                        value={apptNotes}
                        onChange={(e) => setApptNotes(e.target.value)}
                        placeholder="Optional remarks"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsBookingAppt(false)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Check size={14} />
                        <span>Confirm Slot Booking</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* LIST OF PATIENT APPOINTMENTS */}
              <div className="space-y-3">
                {patientAppointments.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                    <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">No appointments on record for {patient.name}.</p>
                    <button
                      onClick={() => setIsBookingAppt(true)}
                      className="mt-3 px-4 py-2 bg-[#1769D2] text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Book First Appointment
                    </button>
                  </div>
                ) : (
                  patientAppointments.map(appt => (
                    <div key={appt.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#102A50]">{appt.treatmentType}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                            appt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                            appt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                            appt.status === 'Waiting' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-blue-100 text-blue-800 border-blue-200'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                          <span>👨‍⚕️ <b>{appt.doctorName}</b></span>
                          <span>•</span>
                          <span>📅 <b>{appt.date}</b> at <b>{appt.time}</b></span>
                          <span>•</span>
                          <span>{appt.chair || 'Chair 1'} ({appt.duration})</span>
                        </div>
                        {appt.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5">"{appt.notes}"</div>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{appt.id}</div>
                      </div>

                      {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openRescheduleAppt(appt)}
                            className="px-3 py-1.5 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-[#1769D2] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => openCancelAppt(appt)}
                            className="px-3 py-1.5 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 4: MEDICAL HISTORY (Editable & Saveable)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'medical' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-[#102A50]">Patient Medical History</h3>
                  <p className="text-xs text-slate-500">Systemic conditions, drug allergies, medications, and warnings.</p>
                </div>
                {!isEditingMedical ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingMedical(true)}
                    className="px-3.5 py-1.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 size={13} />
                    <span>Edit Medical History</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Editing Mode
                  </span>
                )}
              </div>

              {/* Critical Alert Banners */}
              {medicalForm.drugAllergies && medicalForm.drugAllergies !== 'None' && medicalForm.drugAllergies !== 'No known drug allergies' && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs flex items-center gap-2 text-rose-800 font-bold">
                  <ShieldAlert size={16} className="text-rose-600 shrink-0" />
                  <span>ALERT: Known Drug Allergy — {medicalForm.drugAllergies}</span>
                </div>
              )}

              {!isEditingMedical ? (
                /* VIEW MEDICAL HISTORY */
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Diabetes Status</div>
                      <div className="font-bold text-slate-800 mt-0.5">{medicalForm.diabetes}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure / Hypertension</div>
                      <div className="font-bold text-slate-800 mt-0.5">{medicalForm.bloodPressure}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Cardiac / Heart Conditions</div>
                      <div className="font-bold text-slate-800 mt-0.5">{medicalForm.heartConditions}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Asthma / Respiratory Conditions</div>
                      <div className="font-bold text-slate-800 mt-0.5">{medicalForm.respiratory}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Current Medications</div>
                      <div className="font-semibold text-slate-700 mt-0.5">{medicalForm.currentMedications || 'None recorded'}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Known Drug Allergies</div>
                      <div className="font-bold text-rose-600 mt-0.5">{medicalForm.drugAllergies || 'No known allergies'}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Previous Surgeries</div>
                      <div className="font-semibold text-slate-700 mt-0.5">{medicalForm.surgeries || 'None'}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Other Medical Conditions</div>
                      <div className="font-semibold text-slate-700 mt-0.5">{medicalForm.otherConditions || 'None'}</div>
                    </div>
                  </div>

                  {medicalForm.conditions?.length > 0 && (
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                      <div className="text-[10px] font-bold text-[#1769D2] uppercase mb-1.5">Tagged Conditions</div>
                      <div className="flex flex-wrap gap-1.5">
                        {medicalForm.conditions.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-100 text-[#102A50] rounded-md font-bold text-[10px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {medicalForm.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Clinical Medical Notes</div>
                      <div className="text-slate-700 mt-0.5 leading-relaxed">{medicalForm.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                /* EDIT MEDICAL FORM */
                <form onSubmit={handleSaveMedical} className="space-y-4 text-xs">
                  {/* Systemic Checkboxes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                      Check All Existing Conditions
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Hypertension / High BP',
                        'Diabetes Mellitus',
                        'Cardiac / Heart Disease',
                        'Asthma / Respiratory',
                        'Bleeding / Clotting Disorder',
                        'Thyroid Disorder',
                        'Kidney / Renal Disease',
                        'Epilepsy / Seizures',
                        'Hepatitis / Jaundice'
                      ].map(cond => {
                        const isChecked = medicalForm.conditions?.includes(cond);
                        return (
                          <label key={cond} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...(medicalForm.conditions || []), cond]
                                  : (medicalForm.conditions || []).filter(c => c !== cond);
                                setMedicalForm({ ...medicalForm, conditions: next });
                              }}
                              className="rounded text-blue-600"
                            />
                            <span className="font-semibold text-slate-700 text-[11px]">{cond}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Diabetes *
                      </label>
                      <select
                        value={medicalForm.diabetes}
                        onChange={(e) => setMedicalForm({ ...medicalForm, diabetes: e.target.value })}
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      >
                        <option value="No Diabetes">No Diabetes</option>
                        <option value="Type 1 Diabetes">Type 1 Diabetes</option>
                        <option value="Type 2 Diabetes (Well-controlled)">Type 2 Diabetes (Well-controlled)</option>
                        <option value="Type 2 Diabetes (Uncontrolled / High HbA1c)">Type 2 Diabetes (Uncontrolled / High HbA1c)</option>
                        <option value="Pre-diabetes / Borderline">Pre-diabetes / Borderline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Blood Pressure / Hypertension *
                      </label>
                      <select
                        value={medicalForm.bloodPressure}
                        onChange={(e) => setMedicalForm({ ...medicalForm, bloodPressure: e.target.value })}
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      >
                        <option value="Normal (120/80 mmHg)">Normal (120/80 mmHg)</option>
                        <option value="Pre-hypertension (120-139 / 80-89)">Pre-hypertension (120-139 / 80-89)</option>
                        <option value="Stage 1 Hypertension (140-159 / 90-99)">Stage 1 Hypertension (140-159 / 90-99)</option>
                        <option value="Stage 2 Hypertension (160+ / 100+)">Stage 2 Hypertension (160+ / 100+)</option>
                        <option value="Hypotension (Low BP)">Hypotension (Low BP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Heart Conditions
                      </label>
                      <input
                        type="text"
                        value={medicalForm.heartConditions}
                        onChange={(e) => setMedicalForm({ ...medicalForm, heartConditions: e.target.value })}
                        placeholder="e.g. None, Pacemaker, Angina"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Asthma / Respiratory Conditions
                      </label>
                      <input
                        type="text"
                        value={medicalForm.respiratory}
                        onChange={(e) => setMedicalForm({ ...medicalForm, respiratory: e.target.value })}
                        placeholder="e.g. None, Mild Asthma"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Current Medications
                      </label>
                      <input
                        type="text"
                        value={medicalForm.currentMedications}
                        onChange={(e) => setMedicalForm({ ...medicalForm, currentMedications: e.target.value })}
                        placeholder="e.g. Metformin 500mg, Telmisartan 40mg"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-rose-600 uppercase mb-1">
                        Known Drug Allergies *
                      </label>
                      <input
                        type="text"
                        value={medicalForm.drugAllergies}
                        onChange={(e) => setMedicalForm({ ...medicalForm, drugAllergies: e.target.value })}
                        placeholder="e.g. Penicillin, Sulfa, None"
                        className="w-full font-semibold border border-rose-200 rounded-xl px-3 py-2 text-rose-800 focus:ring-2 focus:ring-rose-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Previous Surgeries
                      </label>
                      <input
                        type="text"
                        value={medicalForm.surgeries}
                        onChange={(e) => setMedicalForm({ ...medicalForm, surgeries: e.target.value })}
                        placeholder="e.g. Appendectomy 2018"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Other Medical Conditions
                      </label>
                      <input
                        type="text"
                        value={medicalForm.otherConditions}
                        onChange={(e) => setMedicalForm({ ...medicalForm, otherConditions: e.target.value })}
                        placeholder="Optional details"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Additional Clinical Notes
                    </label>
                    <textarea
                      rows={2}
                      value={medicalForm.notes}
                      onChange={(e) => setMedicalForm({ ...medicalForm, notes: e.target.value })}
                      placeholder="Special medical precautions for dental procedures"
                      className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingMedical(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check size={14} />
                      <span>Save Medical History</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 5: DENTAL HISTORY (Editable & Saveable)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'dental_history' && (
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-[#102A50]">Patient Dental History</h3>
                  <p className="text-xs text-slate-500">Prior oral treatments, root canals, restorations, and complaints.</p>
                </div>
                {!isEditingDental ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingDental(true)}
                    className="px-3.5 py-1.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 size={13} />
                    <span>Edit Dental History</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Editing Mode
                  </span>
                )}
              </div>

              {!isEditingDental ? (
                /* VIEW DENTAL HISTORY */
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Previous Root Canal Treatment</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.rootCanal}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Dental Extractions</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.extractions}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Crowns / Bridges</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.crownsBridges}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Dental Implants</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.implants}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Braces / Orthodontic Treatment</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.orthodontic}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Gum / Periodontal Problems</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.gumProblems}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Tooth Sensitivity</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.toothSensitivity}</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Last Dental Visit</div>
                      <div className="font-bold text-slate-800 mt-0.5">{dentalForm.lastVisit || 'Not specified'}</div>
                    </div>
                  </div>

                  {dentalForm.previousTreatments?.length > 0 && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Previous Dental Procedures Done</div>
                      <div className="flex flex-wrap gap-1.5">
                        {dentalForm.previousTreatments.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-[#1769D2] border border-blue-200 rounded-md font-bold text-[10px]">
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {dentalForm.currentComplaints && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="text-[10px] font-bold text-amber-800 uppercase">Current Dental Complaints</div>
                      <div className="text-amber-950 font-medium mt-0.5">{dentalForm.currentComplaints}</div>
                    </div>
                  )}

                  {dentalForm.notes && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Dental History Notes</div>
                      <div className="text-slate-700 mt-0.5">{dentalForm.notes}</div>
                    </div>
                  )}
                </div>
              ) : (
                /* EDIT DENTAL FORM */
                <form onSubmit={handleSaveDental} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
                      Previous Procedures
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        'Root Canal Treatment',
                        'Scaling / Cleaning',
                        'Composite Fillings',
                        'Dental Extractions',
                        'Crowns / Bridges',
                        'Dental Implants',
                        'Braces / Aligners',
                        'Teeth Whitening'
                      ].map(proc => {
                        const isChecked = dentalForm.previousTreatments?.includes(proc);
                        return (
                          <label key={proc} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? [...(dentalForm.previousTreatments || []), proc]
                                  : (dentalForm.previousTreatments || []).filter(p => p !== proc);
                                setDentalForm({ ...dentalForm, previousTreatments: next });
                              }}
                              className="rounded text-blue-600"
                            />
                            <span className="font-semibold text-slate-700 text-[11px]">{proc}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Previous Root Canal Treatment
                      </label>
                      <input
                        type="text"
                        value={dentalForm.rootCanal}
                        onChange={(e) => setDentalForm({ ...dentalForm, rootCanal: e.target.value })}
                        placeholder="e.g. Tooth #46 (2025), None"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Dental Extractions
                      </label>
                      <input
                        type="text"
                        value={dentalForm.extractions}
                        onChange={(e) => setDentalForm({ ...dentalForm, extractions: e.target.value })}
                        placeholder="e.g. Wisdom teeth in 2021, None"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Crowns / Bridges
                      </label>
                      <input
                        type="text"
                        value={dentalForm.crownsBridges}
                        onChange={(e) => setDentalForm({ ...dentalForm, crownsBridges: e.target.value })}
                        placeholder="e.g. Ceramic crown on #46, None"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Dental Implants
                      </label>
                      <input
                        type="text"
                        value={dentalForm.implants}
                        onChange={(e) => setDentalForm({ ...dentalForm, implants: e.target.value })}
                        placeholder="e.g. 1 Straumann BLX fixture, None"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Braces / Orthodontic Treatment
                      </label>
                      <input
                        type="text"
                        value={dentalForm.orthodontic}
                        onChange={(e) => setDentalForm({ ...dentalForm, orthodontic: e.target.value })}
                        placeholder="e.g. Metal braces in 2018, Clear Aligners"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Gum Problems
                      </label>
                      <input
                        type="text"
                        value={dentalForm.gumProblems}
                        onChange={(e) => setDentalForm({ ...dentalForm, gumProblems: e.target.value })}
                        placeholder="e.g. Bleeding on brushing, None"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Tooth Sensitivity
                      </label>
                      <input
                        type="text"
                        value={dentalForm.toothSensitivity}
                        onChange={(e) => setDentalForm({ ...dentalForm, toothSensitivity: e.target.value })}
                        placeholder="e.g. Cold sensitivity on lower molars"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Last Dental Visit Date
                      </label>
                      <input
                        type="text"
                        value={dentalForm.lastVisit}
                        onChange={(e) => setDentalForm({ ...dentalForm, lastVisit: e.target.value })}
                        placeholder="e.g. 2026-11-01 or 6 months ago"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Current Dental Complaints
                    </label>
                    <input
                      type="text"
                      value={dentalForm.currentComplaints}
                      onChange={(e) => setDentalForm({ ...dentalForm, currentComplaints: e.target.value })}
                      placeholder="e.g. Pain during chewing in lower right molar"
                      className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Additional Dental Notes
                    </label>
                    <textarea
                      rows={2}
                      value={dentalForm.notes}
                      onChange={(e) => setDentalForm({ ...dentalForm, notes: e.target.value })}
                      placeholder="Doctor notes regarding prior dental visits"
                      className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsEditingDental(false)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check size={14} />
                      <span>Save Dental History</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 6: TREATMENT PLANS (Active, Progress, Add & Edit)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'treatment_plans' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-sm text-[#102A50]">Comprehensive Treatment Plans</h3>
                  <p className="text-xs text-slate-500">Track multi-stage dental procedures, assigned doctors, and progress.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingPlanId(null);
                    setPlanForm({
                      treatmentName: '',
                      toothNumber: 'Full Mouth',
                      doctorId: doctors[0]?.id || 'DOC-01',
                      estimatedCost: '',
                      status: 'In Progress',
                      stagesText: 'Diagnosis & Planning, Primary Procedure, Final Evaluation',
                      notes: ''
                    });
                    setIsAddingTreatmentPlan(!isAddingTreatmentPlan);
                  }}
                  className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isAddingTreatmentPlan ? 'Close Form' : '+ Add Treatment Plan'}</span>
                </button>
              </div>

              {/* ADD / EDIT PLAN FORM */}
              {isAddingTreatmentPlan && (
                <div className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-3 animate-in fade-in">
                  <h4 className="font-extrabold text-xs text-[#102A50] uppercase tracking-wider">
                    {editingPlanId ? 'Edit Treatment Plan' : 'Create New Treatment Plan'}
                  </h4>

                  <form onSubmit={handleSaveTreatmentPlan} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Treatment Name *
                        </label>
                        <input
                          type="text"
                          value={planForm.treatmentName}
                          onChange={(e) => setPlanForm({ ...planForm, treatmentName: e.target.value })}
                          placeholder="e.g. Root Canal Treatment + Zirconia Crown"
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Tooth Number / Region
                        </label>
                        <input
                          type="text"
                          value={planForm.toothNumber}
                          onChange={(e) => setPlanForm({ ...planForm, toothNumber: e.target.value })}
                          placeholder="e.g. #46, #11-#21, Full Mouth"
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Assigned Doctor
                        </label>
                        <select
                          value={planForm.doctorId}
                          onChange={(e) => setPlanForm({ ...planForm, doctorId: e.target.value })}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Estimated Cost (₹)
                        </label>
                        <input
                          type="number"
                          value={planForm.estimatedCost}
                          onChange={(e) => setPlanForm({ ...planForm, estimatedCost: e.target.value })}
                          placeholder="e.g. 12500"
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Status
                        </label>
                        <select
                          value={planForm.status}
                          onChange={(e) => setPlanForm({ ...planForm, status: e.target.value })}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Treatment Stages (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={planForm.stagesText}
                          onChange={(e) => setPlanForm({ ...planForm, stagesText: e.target.value })}
                          placeholder="Stage 1, Stage 2, Stage 3"
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                        Clinical Notes / Observations
                      </label>
                      <textarea
                        rows={2}
                        value={planForm.notes}
                        onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
                        placeholder="Details on diagnosis, materials, and warranty"
                        className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsAddingTreatmentPlan(false)}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Check size={14} />
                        <span>Save Treatment Plan</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* LIST OF TREATMENT PLANS */}
              <div className="space-y-3">
                {patientTreatmentPlans.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                    <Layers size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">No treatment plans found for {patient.name}.</p>
                    <button
                      onClick={() => setIsAddingTreatmentPlan(true)}
                      className="mt-3 px-4 py-2 bg-[#1769D2] text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Create First Plan
                    </button>
                  </div>
                ) : (
                  patientTreatmentPlans.map(tp => {
                    const stages = tp.stages || ['Stage 1', 'Stage 2'];
                    const currentIdx = tp.currentStageIndex || 0;
                    const progressPercent = Math.round(((currentIdx + (tp.status === 'Completed' ? 1 : 0.5)) / stages.length) * 100);

                    return (
                      <div key={tp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-[#102A50]">{tp.treatmentName}</h4>
                              {tp.toothNumber && (
                                <span className="px-2 py-0.5 bg-blue-50 text-[#1769D2] font-bold text-[10px] rounded-md border border-blue-200">
                                  {tp.toothNumber}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                tp.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                tp.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                tp.status === 'On Hold' ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
                              }`}>
                                {tp.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              Doctor: <b>{tp.doctorName}</b> • Est. Cost: <b className="text-slate-800">₹{(tp.estimatedCost || 0).toLocaleString()}</b>
                            </div>
                            {tp.notes && (
                              <div className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg">
                                {tp.notes}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditingPlanId(tp.id);
                                setPlanForm({
                                  treatmentName: tp.treatmentName,
                                  toothNumber: tp.toothNumber || '',
                                  doctorId: tp.doctorId,
                                  estimatedCost: tp.estimatedCost,
                                  status: tp.status,
                                  stagesText: tp.stages?.join(', ') || '',
                                  notes: tp.notes || ''
                                });
                                setIsAddingTreatmentPlan(true);
                              }}
                              className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteTreatmentPlan(tp.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Plan"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* STAGES PROGRESS TRACKER */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-slate-600">
                              Stage {Math.min(currentIdx + 1, stages.length)} of {stages.length}: {stages[currentIdx] || 'Completed'}
                            </span>
                            <span className="font-bold text-[#1769D2]">{Math.min(100, progressPercent)}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                tp.status === 'Completed' ? 'bg-emerald-500' : 'bg-[#1769D2]'
                              }`}
                              style={{ width: `${Math.min(100, progressPercent)}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between mt-3 gap-2">
                            <div className="flex items-center gap-1 flex-wrap">
                              {stages.map((stg, sIdx) => (
                                <span
                                  key={sIdx}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    sIdx < currentIdx || tp.status === 'Completed'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : sIdx === currentIdx
                                      ? 'bg-blue-100 text-[#1769D2] border border-blue-300 ring-1 ring-blue-300'
                                      : 'bg-slate-50 text-slate-400 border border-slate-200'
                                  }`}
                                >
                                  {sIdx < currentIdx || tp.status === 'Completed' ? '✓ ' : `${sIdx + 1}. `}
                                  {stg}
                                </span>
                              ))}
                            </div>

                            {tp.status !== 'Completed' && (
                              <button
                                onClick={() => {
                                  if (currentIdx + 1 >= stages.length) {
                                    updateTreatmentPlan(tp.id, { currentStageIndex: stages.length - 1, status: 'Completed' });
                                  } else {
                                    updateTreatmentPlan(tp.id, { currentStageIndex: currentIdx + 1 });
                                  }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                <span>Advance Stage →</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              TAB 7: BILLING & PAYMENTS (Active Invoices & Receipt Print)
          ══════════════════════════════════════════════════════════ */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              {/* Financial KPI Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Total Billed</div>
                  <div className="text-xl font-black text-[#102A50] mt-1">
                    ₹{(patient.totalBilled || patientInvoices.reduce((a, b) => a + (b.grandTotal || 0), 0)).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{patientInvoices.length} invoices generated</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Total Collected / Paid</div>
                  <div className="text-xl font-black text-emerald-600 mt-1">
                    ₹{patientInvoices.reduce((a, b) => a + (Number(b.paidAmount) || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Verified Collections</div>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase">Outstanding Balance</div>
                  <div className={`text-xl font-black mt-1 ${(patient.outstandingBalance || 0) > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ₹{(patient.outstandingBalance || 0).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Pending collection</div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="font-bold text-sm text-[#102A50]">Patient Invoices & Payment Ledger</h3>
                  <p className="text-xs text-slate-500">Record payments, issue new tax invoices, and print receipts.</p>
                </div>
                <button
                  onClick={() => setIsAddingInvoice(!isAddingInvoice)}
                  className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{isAddingInvoice ? 'Close Invoice Form' : '+ Add New Bill / Invoice'}</span>
                </button>
              </div>

              {/* INLINE INVOICE BUILDER */}
              {isAddingInvoice && (
                <div className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm space-y-3 animate-in fade-in">
                  <h4 className="font-extrabold text-xs text-[#102A50] uppercase tracking-wider">
                    Generate New Invoice for {patient.name}
                  </h4>

                  <form onSubmit={handleSaveInvoice} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Treating Doctor
                        </label>
                        <select
                          value={invoiceForm.doctorId}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, doctorId: e.target.value })}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Treatment / Service Description *
                        </label>
                        <input
                          type="text"
                          value={invoiceForm.description}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                          placeholder="e.g. Molar Root Canal Treatment"
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={invoiceForm.qty}
                            onChange={(e) => setInvoiceForm({ ...invoiceForm, qty: Number(e.target.value) || 1 })}
                            className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Rate (₹)
                          </label>
                          <input
                            type="number"
                            value={invoiceForm.rate}
                            onChange={(e) => setInvoiceForm({ ...invoiceForm, rate: Number(e.target.value) || 0 })}
                            className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Discount (₹)
                          </label>
                          <input
                            type="number"
                            value={invoiceForm.discount}
                            onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: Number(e.target.value) || 0 })}
                            className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                            Initial Amount Paid (₹)
                          </label>
                          <input
                            type="number"
                            value={invoiceForm.amountPaid}
                            onChange={(e) => setInvoiceForm({ ...invoiceForm, amountPaid: Number(e.target.value) || 0 })}
                            className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                          Payment Method
                        </label>
                        <select
                          value={invoiceForm.paymentMethod}
                          onChange={(e) => setInvoiceForm({ ...invoiceForm, paymentMethod: e.target.value })}
                          className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                        >
                          <option value="UPI (GPay)">UPI (Google Pay / PhonePe)</option>
                          <option value="Credit Card (HDFC)">Credit Card (POS Terminal)</option>
                          <option value="Debit Card">Debit Card</option>
                          <option value="Cash">Cash at Reception</option>
                          <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT/IMPS)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="text-xs font-bold text-slate-600">
                        Total Bill: ₹{Math.max(0, (invoiceForm.qty * invoiceForm.rate) - invoiceForm.discount).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingInvoice(false)}
                          className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <Check size={14} />
                          <span>Generate Invoice</span>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* INVOICES LIST */}
              <div className="space-y-3">
                {patientInvoices.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                    <Receipt size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-xs text-slate-500 font-medium">No invoices generated yet for this patient.</p>
                    <button
                      onClick={() => setIsAddingInvoice(true)}
                      className="mt-3 px-4 py-2 bg-[#1769D2] text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Create First Invoice
                    </button>
                  </div>
                ) : (
                  patientInvoices.map(inv => (
                    <div key={inv.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-[#102A50]">{inv.id}</span>
                            <span className="text-xs text-slate-500">• {inv.date}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                              inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              inv.status === 'Partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {inv.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Doctor: <b>{inv.doctorName}</b> • Branch: {inv.branchId || 'RS_PURAM'}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-black text-slate-900">₹{inv.grandTotal.toLocaleString()}</div>
                          <div className="text-xs text-emerald-600 font-bold">Paid: ₹{(inv.paidAmount || 0).toLocaleString()}</div>
                          {inv.balance > 0 && (
                            <div className="text-xs text-rose-600 font-bold">Balance: ₹{inv.balance.toLocaleString()}</div>
                          )}
                        </div>
                      </div>

                      {/* Items Breakdown Table */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                        {inv.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>{item.description} (x{item.qty})</span>
                            <span className="font-bold text-slate-800">₹{(item.amount || item.rate * item.qty).toLocaleString()}</span>
                          </div>
                        ))}
                        {inv.discount > 0 && (
                          <div className="flex justify-between text-emerald-700 pt-1 border-t border-slate-200 text-[11px]">
                            <span>Discount</span>
                            <span>-₹{inv.discount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Payment info & Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="text-[11px] text-slate-500">
                          Payment Mode: <b className="text-slate-700">{inv.paymentMethod || 'UPI'}</b> {inv.paymentRef ? `(${inv.paymentRef})` : ''}
                        </div>

                        <div className="flex items-center gap-2">
                          {inv.balance > 0 && (
                            <button
                              onClick={() => {
                                setActivePaymentModalInv(inv);
                                setPaymentAmountInput(inv.balance.toString());
                              }}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <CreditCard size={12} />
                              <span>Record Payment</span>
                            </button>
                          )}
                          <button
                            onClick={() => setActivePrintInvoice(inv)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Printer size={12} />
                            <span>View / Print Receipt</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RECORD PAYMENT POPUP MODAL ── */}
      {activePaymentModalInv && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-[#102A50]">Record Payment</h4>
              <button
                onClick={() => setActivePaymentModalInv(null)}
                className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              For Invoice <b>{activePaymentModalInv.id}</b> • Balance: <b className="text-rose-600">₹{activePaymentModalInv.balance.toLocaleString()}</b>
            </p>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  max={activePaymentModalInv.balance}
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  className="w-full font-bold text-sm border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethodInput}
                  onChange={(e) => setPaymentMethodInput(e.target.value)}
                  className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                >
                  <option value="UPI (GPay / PhonePe)">UPI (Google Pay / PhonePe)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash at Desk</option>
                  <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Transaction Reference / Notes
                </label>
                <input
                  type="text"
                  value={paymentNotesInput}
                  onChange={(e) => setPaymentNotesInput(e.target.value)}
                  placeholder="e.g. UPI-992184 or Cash receipt"
                  className="w-full font-semibold border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActivePaymentModalInv(null)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-xl text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRINT INVOICE / RECEIPT POPUP MODAL ── */}
      {activePrintInvoice && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-[#1769D2]" />
                <h3 className="font-extrabold text-sm text-[#102A50]">Tax Invoice & Official Receipt</h3>
              </div>
              <button
                onClick={() => setActivePrintInvoice(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                <X size={15} />
              </button>
            </div>

            {/* Printable Receipt Paper */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4 text-xs font-sans">
              <div className="flex items-start justify-between border-b pb-3 border-slate-100">
                <div>
                  <h2 className="text-base font-black text-[#102A50]">INDUS DENTAL</h2>
                  <p className="text-[10px] text-slate-500 font-medium">Multi-Speciality Dental Hospitals</p>
                  <p className="text-[10px] text-slate-400">142 D.B. Road, R.S. Puram, Coimbatore - 641002</p>
                  <p className="text-[10px] text-slate-400">GSTIN: 33AAAAI0000A1Z5 • Tel: +91 98430 12845</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-[#1769D2]">{activePrintInvoice.id}</span>
                  <div className="text-[10px] text-slate-500">Date: {activePrintInvoice.date}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    activePrintInvoice.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activePrintInvoice.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Patient Info Header */}
              <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Patient Details</div>
                  <div className="font-bold text-slate-800">{patient.name}</div>
                  <div className="text-[11px] text-slate-600">UHID: {patient.id} • Ph: {patient.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Consulting Doctor</div>
                  <div className="font-bold text-slate-800">{activePrintInvoice.doctorName}</div>
                  <div className="text-[11px] text-slate-600">Branch: {activePrintInvoice.branchId || 'R.S. Puram'}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="py-1.5">Description</th>
                    <th className="py-1.5 text-center">Qty</th>
                    <th className="py-1.5 text-right">Rate</th>
                    <th className="py-1.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activePrintInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="text-[11px]">
                      <td className="py-2 text-slate-800 font-medium">{item.description}</td>
                      <td className="py-2 text-center text-slate-600">{item.qty}</td>
                      <td className="py-2 text-right text-slate-600">₹{item.rate?.toLocaleString()}</td>
                      <td className="py-2 text-right font-bold text-slate-800">₹{(item.amount || item.rate * item.qty).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="space-y-1 pt-2 border-t border-slate-200 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span>₹{activePrintInvoice.subtotal?.toLocaleString()}</span>
                </div>
                {activePrintInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-₹{activePrintInvoice.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Amount:</span>
                  <span>₹{activePrintInvoice.grandTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-emerald-700">
                  <span>Amount Paid:</span>
                  <span>₹{(activePrintInvoice.paidAmount || 0).toLocaleString()} ({activePrintInvoice.paymentMethod || 'UPI'})</span>
                </div>
                {activePrintInvoice.balance > 0 && (
                  <div className="flex justify-between text-xs font-bold text-rose-600">
                    <span>Outstanding Due:</span>
                    <span>₹{activePrintInvoice.balance?.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-dashed border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Computer-generated tax receipt. No physical signature required.</span>
                <span className="font-bold text-slate-600">INDUS DENTAL ACCOUNTS</span>
              </div>
            </div>

            {/* Print Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActivePrintInvoice(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Printer size={14} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
