import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Stethoscope,
  Printer,
  Save,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  Activity,
  FileText,
  User,
  ShieldAlert,
  ChevronDown,
  Layers,
  Clock,
  PenTool
} from 'lucide-react';

export default function OPDConsultationModule() {
  const {
    activePatient,
    currentUser,
    doctors,
    branches,
    selectedBranch,
    savePrescription,
    showToast,
    setActiveModule
  } = useApp();

  const [activeTab, setActiveTab] = useState('vitals');

  // Consultation state
  const [pulse, setPulse] = useState('76');
  const [bloodPressure, setBloodPressure] = useState('120/80');
  const [temp, setTemp] = useState('98.4');
  const [vitalsRemarks, setVitalsRemarks] = useState('Normal resting vitals');

  const [printVitalsOnRx, setPrintVitalsOnRx] = useState(true);
  const [printHistoryOnRx, setPrintHistoryOnRx] = useState(true);

  // Symptoms & Diagnosis
  const [symptoms, setSymptoms] = useState('Severe throbbing pain in lower right jaw, sensitive to cold water.');
  const [diagnosis, setDiagnosis] = useState('Acute Irreversible Pulpitis w/ Periapical Tenderness - Tooth 46');

  // Medicines List
  const [medicines, setMedicines] = useState([
    {
      name: 'Augmentin 625mg (Amoxicillin + Clavulanic Acid)',
      dosage: '1 tablet',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 Days',
      food: 'After Meals',
      instructions: 'Complete full course to eliminate infection.'
    },
    {
      name: 'Ketorol-DT 10mg (Ketorolac Tromethamine)',
      dosage: '1 tablet dispersed in water',
      frequency: 'SOS (Max 3/day)',
      duration: '3 Days',
      food: 'After Meals',
      instructions: 'Take only when severe toothache occurs.'
    },
    {
      name: 'Pan-D (Pantoprazole 40mg + Domperidone 30mg)',
      dosage: '1 capsule',
      frequency: '1-0-0 (Once daily)',
      duration: '5 Days',
      food: 'Before Breakfast',
      instructions: 'Take 30 mins before morning breakfast.'
    },
    {
      name: 'Clohex-Plus 0.2% Antiseptic Oral Rinse',
      dosage: '10 ml undiluted',
      frequency: 'Morning & Night',
      duration: '7 Days',
      food: 'After brushing',
      instructions: 'Rinse vigorously for 1 minute then spit out.'
    }
  ]);

  const [adviceList, setAdviceList] = useState([
    'Avoid chewing hard foods on lower right side for 48 hours.',
    'Warm saline mouth rinses 3-4 times daily starting tomorrow.',
    'Return for Root Canal obturation & permanent crown measurement next week.'
  ]);

  const [followupDate, setFollowupDate] = useState('2026-11-13');
  const [includeDrawingOnRx, setIncludeDrawingOnRx] = useState(true);

  const handleAddMedicine = () => {
    setMedicines(prev => [
      ...prev,
      {
        name: 'Metrogyl 400mg (Metronidazole)',
        dosage: '1 tablet',
        frequency: '1-0-1',
        duration: '5 Days',
        food: 'After Meals',
        instructions: 'Take with food.'
      }
    ]);
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSignAndPrint = () => {
    savePrescription({
      patientId: activePatient.id,
      patientName: activePatient.name,
      age: activePatient.age,
      gender: activePatient.gender,
      uhid: activePatient.id,
      branchId: activePatient.preferredBranch || 'RS_PURAM',
      branchName: 'INDUS Dental Clinic, Coimbatore',
      doctorName: currentUser.name || 'Dr. Priya Sharma',
      doctorQual: 'MDS, FICOI (Reg: TN-DENT-84920)',
      diagnosis,
      vitals: {
        pulse: `${pulse} bpm`,
        bp: `${bloodPressure} mmHg`,
        temp: `${temp} °F`
      },
      medicines,
      advice: adviceList,
      nextVisit: followupDate,
      includeDrawing: includeDrawingOnRx
    });

    window.print();
  };

  return (
    <div className="space-y-4 animate-in fade-in pb-10">
      {/* 1. Top Patient Header Bar (Matching Image 5) */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1769D2] text-white flex items-center justify-center font-extrabold text-sm shadow-md">
            {activePatient?.name ? activePatient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'MG'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#102A50]">{activePatient?.name || 'Mr Gokul'}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#1769D2]">
                OPD
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {activePatient?.age || 23}y • {activePatient?.gender || 'Male'} • {activePatient?.phone || '8072103756'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
              <span>UHID: <b className="text-[#102A50]">{activePatient?.id || 'IND-0292'}</b></span>
              <span>•</span>
              <span>Branch: <b>{activePatient?.preferredBranch || 'R.S. Puram'}</b></span>
              <span>•</span>
              <span className="text-rose-600 font-bold">Alert: Penicillin Allergy</span>
            </div>
          </div>
        </div>

        {/* Top Actions: Templates, Save draft, Sign & Print (Matching Image 5) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Prescription template saved for future use')}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#102A50] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Save Template
          </button>
          <button
            onClick={() => showToast('Clinical draft saved')}
            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#102A50] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Save draft
          </button>
          <button
            onClick={handleSignAndPrint}
            className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer size={15} />
            <span>Sign & Print</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* 2. Main Work Area: Left (Consultation Pad) + Right (Live Rx Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Clinical Pad Form (Col 7 - Matching Image 5) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Clinical Nav Pills (Matching Image 5) */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
            {[
              { id: 'vitals', label: '1. Vitals' },
              { id: 'history', label: '2. Medical History' },
              { id: 'symptoms', label: '3. Symptoms & Exam' },
              { id: 'medicines', label: '4. Medicines (Rx)' },
              { id: 'advice', label: '5. Precautions & Advice' },
              { id: 'drawing', label: '6. Draw & Explain' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#1769D2] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Section 1: Vitals (Matching Image 5) */}
          {activeTab === 'vitals' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1769D2]"></span>
                  <h3 className="font-bold text-xs text-[#102A50] uppercase tracking-wider">1. Vitals</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    ✓ All normal
                  </span>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                    <span>Print Rx</span>
                    <input
                      type="checkbox"
                      checked={printVitalsOnRx}
                      onChange={(e) => setPrintVitalsOnRx(e.target.checked)}
                      className="rounded accent-[#1769D2] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Vitals Input Cards (Pulse, BP, Temp - Matching Image 5) */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400">Pulse</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="text"
                      value={pulse}
                      onChange={(e) => setPulse(e.target.value)}
                      className="text-lg font-black text-[#102A50] bg-transparent outline-none w-14"
                    />
                    <span className="text-xs text-slate-400 font-bold">bpm</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400">Blood Pressure</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="text"
                      value={bloodPressure}
                      onChange={(e) => setBloodPressure(e.target.value)}
                      className="text-lg font-black text-[#102A50] bg-transparent outline-none w-20"
                    />
                    <span className="text-xs text-slate-400 font-bold">mmHg</span>
                  </div>
                </div>

                <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-400">Temperature</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <input
                      type="text"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="text-lg font-black text-[#102A50] bg-transparent outline-none w-14"
                    />
                    <span className="text-xs text-slate-400 font-bold">°F</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Vitals Notes</label>
                <input
                  type="text"
                  value={vitalsRemarks}
                  onChange={(e) => setVitalsRemarks(e.target.value)}
                  placeholder="Any remarks..."
                  className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
                />
              </div>
            </div>
          )}

          {/* Section 2: Medical History (Matching Image 5) */}
          {activeTab === 'history' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-xs text-[#102A50] uppercase tracking-wider">2. Past Medical History</h3>
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer">
                  <span>Print Rx</span>
                  <input
                    type="checkbox"
                    checked={printHistoryOnRx}
                    onChange={(e) => setPrintHistoryOnRx(e.target.checked)}
                    className="rounded accent-[#1769D2] cursor-pointer"
                  />
                </label>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900">
                Known Allergies: Penicillin & Beta-lactams. Avoid prescribing Amoxicillin/Augmentin if anaphylactic history.
              </div>

              {/* Quick Lifestyle Tags (Matching Image 5) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-2">Quick Medical Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {['+ Smoking', '+ Alcohol', '+ Tobacco chewing', '+ Stress', '+ Diabetic', '+ Hypertensive', '+ Bleeding Tendency'].map(t => (
                    <button
                      key={t}
                      type="button"
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-[#1769D2] text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Symptoms & Diagnosis */}
          {activeTab === 'symptoms' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaints & Clinical Findings</label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Provisional / Final Dental Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-blue-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-500">Need 32-tooth odontogram markup?</span>
                <button
                  onClick={() => setActiveModule('emr')}
                  className="text-xs font-bold text-[#1769D2] hover:underline cursor-pointer"
                >
                  Open Dental Chart (EMR) →
                </button>
              </div>
            </div>
          )}

          {/* Section 4: Medicines (Rx Builder) */}
          {activeTab === 'medicines' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-xs text-[#102A50] uppercase tracking-wider">Prescribed Medicines</h3>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="text-xs font-bold text-[#1769D2] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {medicines.map((med, idx) => (
                  <div key={idx} className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => {
                          const next = [...medicines];
                          next[idx].name = e.target.value;
                          setMedicines(next);
                        }}
                        className="flex-1 font-bold text-[#102A50] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5"
                      />
                      <button
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Frequency (e.g. 1-0-1)"
                        value={med.frequency}
                        onChange={(e) => {
                          const next = [...medicines];
                          next[idx].frequency = e.target.value;
                          setMedicines(next);
                        }}
                        className="font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 5 Days)"
                        value={med.duration}
                        onChange={(e) => {
                          const next = [...medicines];
                          next[idx].duration = e.target.value;
                          setMedicines(next);
                        }}
                        className="font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1"
                      />
                      <input
                        type="text"
                        placeholder="Food instruction"
                        value={med.food}
                        onChange={(e) => {
                          const next = [...medicines];
                          next[idx].food = e.target.value;
                          setMedicines(next);
                        }}
                        className="font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Precautions & Advice */}
          {activeTab === 'advice' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Doctor Advice & Post-Op Instructions</label>
                <div className="space-y-2">
                  {adviceList.map((adv, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={adv}
                        onChange={(e) => {
                          const next = [...adviceList];
                          next[idx] = e.target.value;
                          setAdviceList(next);
                        }}
                        className="flex-1 text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
                      />
                      <button
                        onClick={() => setAdviceList(adviceList.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setAdviceList([...adviceList, 'Next clinical instruction...'])}
                    className="text-xs font-bold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Advice Point</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Next Follow-Up / Review Date</label>
                <input
                  type="date"
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                />
              </div>
            </div>
          )}

          {/* Section 6: Draw & Explain Link */}
          {activeTab === 'drawing' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-3">
              <PenTool size={32} className="text-[#1769D2] mx-auto" />
              <h3 className="font-bold text-sm text-[#102A50]">Digital Clinical Drawing & Patient Explanation</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Annotate tooth caries, root apex, crowns or patient dental X-rays to visually explain proposed treatments.
              </p>
              <label className="inline-flex items-center gap-2 p-2 bg-[#EEF5FF] rounded-xl text-xs font-bold text-[#1769D2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDrawingOnRx}
                  onChange={(e) => setIncludeDrawingOnRx(e.target.checked)}
                  className="rounded accent-[#1769D2]"
                />
                <span>Include this drawing on prescription (On this Rx)</span>
              </label>
              <div>
                <button
                  onClick={() => setActiveModule('draw_explain')}
                  className="px-5 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Open Full Screen Drawing Canvas →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Rx Synchronized Letterhead (Col 5 - Matching Image 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="border-b-2 border-[#1769D2] pb-4 mb-4">
            {/* INDUS Dental Letterhead Banner */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#092C60] text-white flex items-center justify-center font-bold text-xs">
                    IND
                  </div>
                  <h1 className="text-base font-black text-[#092C60] tracking-tight">
                    INDUS <span className="text-[#1769D2]">DENTAL</span>
                  </h1>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  Centralised Multi-Branch Dental Hospital • Coimbatore
                </p>
                <p className="text-[9px] text-slate-400">
                  Ph: +91 422 254 8890 • www.indusdental.in
                </p>
              </div>

              <div className="text-right">
                <h3 className="text-xs font-extrabold text-[#102A50]">{currentUser.name || 'Dr. Priya Sharma'}</h3>
                <p className="text-[10px] text-slate-600 font-semibold">Chief Dental Surgeon</p>
                <p className="text-[9px] text-slate-400">Reg No: TN-DENT-84920</p>
              </div>
            </div>

            {/* Patient Demographics Bar (Matching Image 5) */}
            <div className="mt-3 pt-2 border-t border-slate-200/60 grid grid-cols-2 text-[10px] font-semibold text-slate-600">
              <div>
                <span>Patient: </span>
                <b className="text-slate-900">{activePatient?.name || 'Mr Gokul'}</b> ({activePatient?.age || 23}y / {activePatient?.gender || 'M'})
              </div>
              <div className="text-right">
                <span>UHID: </span>
                <b className="text-[#1769D2]">{activePatient?.id || 'IND-0292'}</b> • <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Rx Clinical Details Body */}
          <div className="space-y-3 flex-1 text-xs overflow-y-auto max-h-[460px] pr-1">
            {/* Vitals Preview */}
            {printVitalsOnRx && (
              <div className="p-2 bg-slate-50 rounded-xl text-[10px] text-slate-600 flex justify-between">
                <span>Pulse: <b>{pulse} bpm</b></span>
                <span>BP: <b>{bloodPressure} mmHg</b></span>
                <span>Temp: <b>{temp} °F</b></span>
              </div>
            )}

            {/* Diagnosis */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis</span>
              <p className="font-extrabold text-xs text-[#102A50] mt-0.5">{diagnosis}</p>
            </div>

            {/* Prescription Table */}
            <div>
              <span className="text-[10px] font-bold text-[#1769D2] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <span>℞ Prescribed Medicines</span>
              </span>
              <div className="space-y-1.5">
                {medicines.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-xl border border-slate-100 bg-[#F8FAFC]">
                    <div className="font-extrabold text-[11px] text-[#102A50]">{idx + 1}. {m.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium flex justify-between mt-0.5">
                      <span>{m.frequency} • {m.duration}</span>
                      <span className="text-blue-600 font-semibold">{m.food}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Doctor Advice</span>
              <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5">
                {adviceList.map((adv, idx) => <li key={idx}>{adv}</li>)}
              </ul>
            </div>

            {/* Next Review */}
            <div className="text-[10px] font-bold text-[#1769D2]">
              Next Appointment: <span>{followupDate}</span>
            </div>
          </div>

          {/* Bottom Signature & Sign Action */}
          <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-between">
            <div className="text-center">
              <div className="font-serif italic font-black text-xs text-blue-900">Dr. Priya Sharma</div>
              <div className="text-[9px] text-slate-400">Doctor Signature (Verified)</div>
            </div>
            <button
              onClick={handleSignAndPrint}
              className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Printer size={13} />
              <span>Print Prescription</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
