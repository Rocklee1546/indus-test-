import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Video, MapPin, Clock, Calendar, UserCheck, AlertCircle, ArrowRight } from 'lucide-react';
import PatientSearchSelector from '../common/PatientSearchSelector';

export default function BookCheckInModal() {
  const {
    isBookCheckInOpen,
    setIsBookCheckInOpen,
    checkInPatientModalData,
    setCheckInPatientModalData,
    doctors,
    activeDoctors,
    addAppointment,
    selectedBranch,
    openBookAppointment,
    getActiveVisitForPatient,
    setActiveModule,
    showToast
  } = useApp();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'DOC-01');
  const [selectedChair, setSelectedChair] = useState('Chair 1');
  const [visitType, setVisitType] = useState('In Clinic');
  const [whenMode, setWhenMode] = useState('now');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  const availableDoctors = activeDoctors && activeDoctors.length > 0 ? activeDoctors : doctors;

  useEffect(() => {
    if (isBookCheckInOpen) {
      setSelectedPatient(checkInPatientModalData || null);
      setSymptoms('');
      setNotes('');
      setWhenMode('now');
      // If patient has a preferred or assigned doctor, auto-select
      const initialDoc = availableDoctors.find(d => 
        d.id === checkInPatientModalData?.assignedDoctorId || 
        d.name === checkInPatientModalData?.referredDoctor
      ) || availableDoctors[0];
      setSelectedDoctorId(initialDoc?.id || 'DOC-01');
      setSelectedChair('Chair 1');
      setVisitType('In Clinic');
    }
  }, [isBookCheckInOpen, checkInPatientModalData, availableDoctors]);

  if (!isBookCheckInOpen) return null;

  const currentDoctor = availableDoctors.find(d => d.id === selectedDoctorId) || availableDoctors[0] || doctors[0];
  const activeVisit = selectedPatient ? getActiveVisitForPatient(selectedPatient.id, selectedPatient.name) : null;

  const quickSymptoms = [
    'Throbbing Tooth Pain', 'Bleeding Gums', 'Routine Checkup',
    'Swelling / Abscess', 'Crown Fixing', 'Tooth Sensitivity',
    'Broken Tooth', 'Clear Aligner Review'
  ];

  const handleClose = () => {
    setIsBookCheckInOpen(false);
    setCheckInPatientModalData(null);
    setSelectedPatient(null);
  };

  const handleContinueToSlot = () => {
    // For "Later" mode — open BookAppointmentModal
    handleClose();
    openBookAppointment(selectedPatient || null);
  };

  const handleCheckIn = () => {
    if (!selectedPatient) {
      showToast('⚠️ Please search and select a patient first.', 'error');
      return;
    }

    // Duplicate Check-In Prevention: Check whether patient already has an active visit
    const existingActiveVisit = getActiveVisitForPatient(selectedPatient.id, selectedPatient.name);
    if (existingActiveVisit) {
      showToast(`⚠️ ${selectedPatient.name} is already checked in (${existingActiveVisit.queueToken || 'Active Visit'}). Redirecting to waiting queue...`, 'info');
      handleClose();
      setActiveModule('appointments');
      return;
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0];

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      phone: selectedPatient.phone,
      branchId: selectedPatient.preferredBranch || selectedBranch || 'RS_PURAM',
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      treatmentType: symptoms.trim() || 'General Consultation',
      date: todayDate,
      time: nowTime,
      duration: '15m',
      chair: selectedChair,
      type: 'Walk-in',
      status: 'Waiting',
      symptoms: symptoms.trim() || 'General dental consultation',
      bookingSource: 'Instant Walk-in Check-in',
      assignedStaff: 'Front Desk',
      checkInTime: nowTime,
      notes: notes.trim() || 'Walk-in instant check-in.'
    });

    handleClose();
    // Navigate to Appointment Management page after successful check-in
    setActiveModule('appointments');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden max-h-[94vh] flex flex-col">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-extrabold text-[#102A50]">Instant Check-In / Walk-In</h2>
            </div>
            <p className="text-xs text-slate-500">
              {selectedPatient
                ? <>For: <span className="font-bold text-[#1769D2]">{selectedPatient.name}</span> ({selectedPatient.id})</>
                : 'Search a patient, pick a doctor and check them in.'}
            </p>
          </div>
          <button onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer">
            <X size={15} />
          </button>
        </div>

        {/* ── Patient Search (always visible, NOT inside the scroll area) ── */}
        <div className="px-6 pt-5 pb-3 bg-[#F8FAFC] border-b border-slate-200 shrink-0">
          <PatientSearchSelector
            selectedPatient={selectedPatient}
            onSelectPatient={(p) => setSelectedPatient(p)}
            onClearPatient={() => setSelectedPatient(null)}
            label="Step 1 · Select Patient *"
            required={false}
          />
        </div>

        {/* ── Scrollable Visit Details ── */}
        <div className="p-6 space-y-4 overflow-y-auto scrollbar-thin flex-1">

          {/* Doctor & Chair */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attending Doctor</label>
              <select value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100">
                {availableDoctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.role || d.specialty})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chair</label>
              <select value={selectedChair} onChange={e => setSelectedChair(e.target.value)}
                className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100">
                <option>Chair 1</option>
                <option>Chair 2</option>
                <option>Chair 3</option>
                <option>Chair 4</option>
              </select>
            </div>
          </div>

          {/* Visit Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Consultation Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[['In Clinic (Walk-in)', 'In Clinic', MapPin], ['Teleconsultation', 'Teleconsultation', Video]].map(([label, val, Icon]) => (
                <button key={val} type="button" onClick={() => setVisitType(val)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    visitType === val
                      ? 'border-[#1769D2] bg-[#EEF5FF] text-[#1769D2] ring-1 ring-blue-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}>
                  <Icon size={13} /><span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* When */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">When</label>
            <div className="space-y-2">
              <button type="button" onClick={() => setWhenMode('now')}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  whenMode === 'now' ? 'border-[#1769D2] bg-[#EEF5FF] ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-xs text-[#102A50] flex items-center gap-1.5">
                    <Clock size={13} className="text-emerald-600" />
                    Now • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {whenMode === 'now' && <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">Queue Active</span>}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Generates queue token & adds patient to live waiting queue</div>
              </button>

              <button type="button" onClick={() => setWhenMode('later')}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                  whenMode === 'later' ? 'border-[#1769D2] bg-[#EEF5FF] ring-2 ring-blue-100' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#1769D2]" />Book for a later date / time slot
                  </div>
                  <span className="text-xs text-slate-400 font-bold">↗</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Opens appointment calendar with slot selector</div>
              </button>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Symptoms / Chief Complaint <span className="text-slate-400 font-normal">(optional)</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {quickSymptoms.map(chip => (
                <button key={chip} type="button"
                  onClick={() => setSymptoms(prev => prev ? `${prev}, ${chip}` : chip)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-100 text-[10px] font-bold text-slate-600 hover:text-[#1769D2] transition-colors cursor-pointer">
                  + {chip}
                </button>
              ))}
            </div>
            <input type="text" placeholder="e.g. Throbbing pain in lower molar since yesterday"
              value={symptoms} onChange={e => setSymptoms(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reception Notes (optional)</label>
            <input type="text" placeholder="e.g. Came with family, BP measured 120/80"
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full text-xs font-medium bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none" />
          </div>
        </div>

        {/* ── Footer Action Button ── */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 bg-white space-y-2.5">
          {activeVisit && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <div className="min-w-0">
                  <div className="font-extrabold text-amber-900 truncate">
                    Patient already has an active visit
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Token: <b className="text-amber-950">{activeVisit.queueToken || 'In Queue'}</b> • Status: <b className="text-emerald-700">{activeVisit.status}</b> • Dr: <b>{activeVisit.doctorName}</b>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setActiveModule('appointments');
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] cursor-pointer whitespace-nowrap shadow-xs flex items-center gap-1 shrink-0"
              >
                <span>View Queue</span>
                <ArrowRight size={11} />
              </button>
            </div>
          )}

          {whenMode === 'later' ? (
            <button type="button" onClick={handleContinueToSlot}
              className="w-full py-3 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all">
              <Calendar size={15} />
              <span>Continue to Slot Calendar →</span>
            </button>
          ) : activeVisit ? (
            <button
              type="button"
              onClick={() => {
                handleClose();
                setActiveModule('appointments');
              }}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <AlertCircle size={15} />
              <span>View Active Appointment in Queue →</span>
            </button>
          ) : (
            <button type="button" onClick={handleCheckIn}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all">
              <UserCheck size={15} />
              <span>Check-In & Add to Waiting Queue</span>
            </button>
          )}
          {!selectedPatient && (
            <p className="text-center text-[10px] text-amber-600 font-semibold mt-1">
              ⚠️ Search and select a patient above before proceeding.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
