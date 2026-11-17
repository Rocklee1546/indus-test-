import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X, Clock, Sun, Sunset, Moon, ArrowLeft, ArrowRight, Check,
  Video, MapPin, CalendarDays, User, Phone, Stethoscope, AlertCircle
} from 'lucide-react';
import PatientSearchSelector from '../common/PatientSearchSelector';

const DURATIONS = ['5m', '10m', '15m', '20m', '25m', '30m'];

// Generate time slots from 08:00 AM to 09:00 PM in 5-min increments
function generateTimeSlots() {
  const slots = [];
  for (let h = 8; h <= 21; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === 21 && m > 0) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h < 12 ? 'AM' : 'PM';
      const minStr = String(m).padStart(2, '0');
      const period = h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening';
      slots.push({ time: `${hour12}:${minStr} ${ampm}`, period });
    }
  }
  return slots;
}
const ALL_SLOTS = generateTimeSlots();

function getStatusColor(status) {
  switch (status) {
    case 'In Consultation': return 'bg-blue-100 text-blue-800';
    case 'Waiting': return 'bg-amber-100 text-amber-800';
    case 'Checked In': return 'bg-teal-100 text-teal-800';
    case 'Completed': return 'bg-emerald-100 text-emerald-800';
    case 'Booked': return 'bg-purple-100 text-purple-800';
    case 'Confirmed': return 'bg-indigo-100 text-indigo-800';
    case 'Cancelled': return 'bg-red-100 text-red-800';
    case 'No Show': return 'bg-slate-100 text-slate-600';
    default: return 'bg-slate-100 text-slate-700';
  }
}

export default function BookAppointmentModal() {
  const {
    isBookApptSlotOpen,
    setIsBookApptSlotOpen,
    apptToBookPatient,
    setApptToBookPatient,
    doctors,
    activeDoctors,
    appointments,
    addAppointment,
    selectedBranch,
    leadToBookAppt,
    setLeadToBookAppt,
    bookAppointmentFromLead,
    patients,
    leads,
    addPatient,
    updateLeadStatus,
    showToast
  } = useApp();

  const [step, setStep] = useState(1); // 1 = Patient, 2 = Details, 3 = Review

  // Booking Option: 'existing' or 'new'
  const [bookingMode, setBookingMode] = useState('existing');

  // Step 1 State - Existing Patient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Step 1 State - New Patient
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientBranch, setNewPatientBranch] = useState(selectedBranch || 'RS_PURAM');

  // Step 2 State
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'DOC-01');
  const [visitType, setVisitType] = useState('In Clinic');
  const [apptDate, setApptDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('15m');
  const [filterPeriod, setFilterPeriod] = useState('All');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [apptNotes, setApptNotes] = useState('');

  // Validation
  const [validationError, setValidationError] = useState('');

  // Check matching patient or lead for new patient mode
  const cleanPhone = newPatientPhone.replace(/\D/g, '');
  const matchedExistingPatient = useMemo(() => {
    if (cleanPhone.length < 6) return null;
    return patients.find(p => (p.phone || '').replace(/\D/g, '').includes(cleanPhone));
  }, [patients, cleanPhone]);

  const matchedExistingLead = useMemo(() => {
    if (cleanPhone.length < 6) return null;
    return leads.find(l => (l.phone || '').replace(/\D/g, '').includes(cleanPhone) && l.status !== 'Converted to Patient');
  }, [leads, cleanPhone]);

  // Reset on open
  useEffect(() => {
    if (isBookApptSlotOpen) {
      setStep(leadToBookAppt || apptToBookPatient ? 2 : 1);
      setBookingMode('existing');
      setSelectedPatient(apptToBookPatient || null);
      setNewPatientName('');
      setNewPatientPhone('');
      setNewPatientEmail('');
      setNewPatientBranch(selectedBranch || 'RS_PURAM');
      setChiefComplaint(leadToBookAppt ? (leadToBookAppt.treatment || '') : '');
      setApptNotes('');
      setSelectedSlot(null);
      setFilterPeriod('All');
      setDuration('15m');
      setApptDate(new Date().toISOString().split('T')[0]);
      setSelectedDoctorId(doctors[0]?.id || 'DOC-01');
      setVisitType('In Clinic');
      setValidationError('');
    }
  }, [isBookApptSlotOpen, apptToBookPatient, leadToBookAppt, selectedBranch, doctors]);

  const availableDoctors = activeDoctors && activeDoctors.length > 0 ? activeDoctors : doctors;
  const currentDoctor = availableDoctors.find(d => d.id === selectedDoctorId) || availableDoctors[0] || doctors[0];

  // Compute booked slots for selected doctor+date to disable them (Called unconditionally before early return)
  const bookedSlots = useMemo(() => {
    if (!isBookApptSlotOpen) return new Set();
    return new Set(
      appointments
        .filter(a =>
          a.doctorId === selectedDoctorId &&
          a.date === apptDate &&
          a.status !== 'Cancelled' &&
          a.status !== 'No Show'
        )
        .map(a => a.time)
    );
  }, [appointments, selectedDoctorId, apptDate, isBookApptSlotOpen]);

  const filteredSlots = ALL_SLOTS.filter(s =>
    filterPeriod === 'All' || s.period === filterPeriod
  );

  const availableCount = filteredSlots.filter(s => !bookedSlots.has(s.time)).length;

  if (!isBookApptSlotOpen) return null;

  const handleClose = () => {
    setIsBookApptSlotOpen(false);
    setApptToBookPatient(null);
    setLeadToBookAppt(null);
    setSelectedPatient(null);
    setStep(1);
  };

  const handleStep1Next = () => {
    if (leadToBookAppt) {
      setValidationError('');
      setStep(2);
      return;
    }

    if (bookingMode === 'existing') {
      if (!selectedPatient) {
        showToast('⚠️ Please search and select an existing patient to continue.', 'error');
        setValidationError('Please search and select an existing patient to continue.');
        return;
      }
    } else {
      if (!newPatientName.trim()) {
        showToast('⚠️ Please enter the customer / patient name.', 'error');
        setValidationError('Please enter the customer / patient name.');
        return;
      }
      if (!newPatientPhone.trim()) {
        showToast('⚠️ Please enter a valid mobile number.', 'error');
        setValidationError('Please enter a valid mobile number.');
        return;
      }
    }

    setValidationError('');
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedSlot) {
      showToast('⚠️ Please select a time slot before continuing.', 'error');
      setValidationError('Please select a time slot before continuing.');
      return;
    }
    setValidationError('');
    setStep(3);
  };

  const handleConfirm = () => {
    if (leadToBookAppt) {
      bookAppointmentFromLead(leadToBookAppt.id, {
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        treatmentType: chiefComplaint || leadToBookAppt.treatment || 'Consultation',
        date: apptDate,
        time: selectedSlot,
        duration,
        type: visitType,
        notes: apptNotes || 'Booked from Lead Pipeline.',
        status: 'Confirmed'
      });
      handleClose();
      return;
    }

    let targetPatientId = null;
    let targetPatientName = '';
    let targetPhone = '';
    let targetBranch = selectedBranch || 'RS_PURAM';

    if (bookingMode === 'new') {
      // Check if existing patient matches
      if (matchedExistingPatient) {
        targetPatientId = matchedExistingPatient.id;
        targetPatientName = matchedExistingPatient.name;
        targetPhone = matchedExistingPatient.phone;
        targetBranch = matchedExistingPatient.preferredBranch || targetBranch;
      } else {
        // Register new patient
        const newPatient = addPatient({
          name: newPatientName.trim(),
          phone: newPatientPhone.trim(),
          email: newPatientEmail.trim() || null,
          preferredBranch: newPatientBranch,
          gender: 'Not Specified',
          age: '—',
          bloodGroup: 'B+'
        });
        targetPatientId = newPatient.id;
        targetPatientName = newPatient.name;
        targetPhone = newPatient.phone;
        targetBranch = newPatient.preferredBranch;
      }

      // If matched lead exists, convert it!
      if (matchedExistingLead) {
        updateLeadStatus(matchedExistingLead.id, 'Converted to Patient');
        showToast(`Matching lead ${matchedExistingLead.name} converted to patient!`);
      }
    } else if (selectedPatient) {
      targetPatientId = selectedPatient.id;
      targetPatientName = selectedPatient.name;
      targetPhone = selectedPatient.phone;
      targetBranch = selectedPatient.preferredBranch || targetBranch;
    }

    if (targetPatientId) {
      addAppointment({
        patientId: targetPatientId,
        patientName: targetPatientName,
        phone: targetPhone,
        branchId: targetBranch,
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        treatmentType: chiefComplaint || 'General Dental Consultation',
        date: apptDate,
        time: selectedSlot,
        duration,
        type: visitType,
        status: 'Confirmed',
        symptoms: chiefComplaint,
        bookingSource: bookingMode === 'new' ? 'New Patient Booking' : 'Reception Desk',
        assignedStaff: 'Front Desk',
        notes: apptNotes
      });
    }

    handleClose();
  };

  const targetName = leadToBookAppt
    ? leadToBookAppt.name
    : bookingMode === 'new'
    ? (newPatientName || 'New Patient')
    : selectedPatient?.name;

  const targetId = leadToBookAppt
    ? leadToBookAppt.id
    : bookingMode === 'new'
    ? (matchedExistingPatient?.id || 'New Registration (Auto UHID)')
    : selectedPatient?.id;

  const targetPhone = leadToBookAppt
    ? leadToBookAppt.phone
    : bookingMode === 'new'
    ? newPatientPhone
    : selectedPatient?.phone;

  // Step indicators
  const steps = [
    { n: 1, label: 'Patient' },
    { n: 2, label: 'Details' },
    { n: 3, label: 'Confirm' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-[#102A50]">Book Appointment</h2>
            <p className="text-xs text-slate-500">
              {targetName ? (
                <>For: <b className="text-[#1769D2]">{targetName}</b> {targetId && <>({targetId})</>} {targetPhone && <>• {targetPhone}</>}</>
              ) : (
                'Complete the 3 steps to confirm an appointment'
              )}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s.n}>
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                    step > s.n
                      ? 'bg-emerald-500 text-white'
                      : step === s.n
                      ? 'bg-[#1769D2] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {step > s.n ? <Check size={12} /> : s.n}
                  </div>
                  <span className={`text-[11px] font-bold ${
                    step >= s.n ? 'text-[#102A50]' : 'text-slate-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s.n ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* ── STEP 1: PATIENT SELECTION ── */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              {/* Option 1 vs Option 2 Tabs */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setBookingMode('existing'); setValidationError(''); }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    bookingMode === 'existing'
                      ? 'bg-white text-[#1769D2] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User size={14} />
                  <span>Option 1: Existing Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setBookingMode('new'); setValidationError(''); }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    bookingMode === 'new'
                      ? 'bg-white text-[#1769D2] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="text-emerald-600 font-extrabold">+</span>
                  <span>Option 2: New Patient</span>
                </button>
              </div>

              {bookingMode === 'existing' ? (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-800 font-medium">
                    🔍 Search for an existing patient by <b>Name, Mobile Number or UHID</b>. Results will auto-fill below.
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4">
                    <PatientSearchSelector
                      selectedPatient={selectedPatient}
                      onSelectPatient={(p) => {
                        setSelectedPatient(p);
                        setValidationError('');
                      }}
                      onClearPatient={() => setSelectedPatient(null)}
                      label="Search & Select Existing Patient *"
                      required={true}
                    />
                  </div>

                  {selectedPatient && (
                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-emerald-950 text-sm">{selectedPatient.name}</div>
                        <div className="text-emerald-700 font-medium">
                          ID: <span className="font-bold">{selectedPatient.id}</span> • Phone: <span className="font-bold">{selectedPatient.phone}</span>
                        </div>
                        <div className="text-emerald-600 text-[11px] mt-0.5">
                          Branch: {selectedPatient.preferredBranch?.replace('_', ' ') || 'Coimbatore'}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-extrabold uppercase tracking-wider">
                        Patient Verified
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900 font-medium">
                    ✨ Enter new patient details. A unique UHID will be generated, and any matching lead will be automatically converted to a patient upon confirmation.
                  </div>

                  <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/80 p-4 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Anandha Kumar"
                        value={newPatientName}
                        onChange={(e) => { setNewPatientName(e.target.value); setValidationError(''); }}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 98430 12345"
                          value={newPatientPhone}
                          onChange={(e) => { setNewPatientPhone(e.target.value); setValidationError(''); }}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="e.g. anand@gmail.com"
                          value={newPatientEmail}
                          onChange={(e) => setNewPatientEmail(e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Preferred Branch
                      </label>
                      <select
                        value={newPatientBranch}
                        onChange={(e) => setNewPatientBranch(e.target.value)}
                        className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="RS_PURAM">INDUS Dental – RS Puram</option>
                        <option value="GANDHIPURAM">INDUS Dental – Gandhipuram</option>
                        <option value="PEELAMEDU">INDUS Dental – Peelamedu</option>
                        <option value="SAIBABA_COLONY">INDUS Dental – Saibaba Colony</option>
                        <option value="SARAVANAMPATTI">INDUS Dental – Saravanampatti</option>
                        <option value="SINGANALLUR">INDUS Dental – Singanallur</option>
                      </select>
                    </div>
                  </div>

                  {/* Matching Patient warning */}
                  {matchedExistingPatient && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold flex items-center gap-1.5 text-amber-950">
                          <AlertCircle size={14} className="text-amber-600 shrink-0" />
                          <span>Patient already registered with ID: {matchedExistingPatient.id}</span>
                        </div>
                        <div className="text-[11px] text-amber-800 mt-0.5">
                          {matchedExistingPatient.name} • {matchedExistingPatient.phone}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatient(matchedExistingPatient);
                          setBookingMode('existing');
                        }}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold shrink-0 cursor-pointer"
                      >
                        Use Existing Patient
                      </button>
                    </div>
                  )}

                  {/* Matching Lead notice */}
                  {matchedExistingLead && !matchedExistingPatient && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                      <div>
                        <span className="font-bold">Matching Lead Found:</span> {matchedExistingLead.name} – {matchedExistingLead.treatment || 'Dental Enquiry'} ({matchedExistingLead.createdDate || 'Recent'}).
                        <div className="text-[11px] text-blue-700 mt-0.5">
                          This lead will be automatically converted to a registered Patient when appointment is confirmed.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {validationError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: APPOINTMENT DETAILS ── */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              {/* Attending Doctor */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Attending Doctor
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => { setSelectedDoctorId(e.target.value); setSelectedSlot(null); }}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
                >
                  {availableDoctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} – {d.role || d.specialty}</option>
                  ))}
                </select>
              </div>

              {/* Visit Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Visit Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['In Clinic', 'Teleconsultation'].map(vt => (
                    <button
                      key={vt}
                      type="button"
                      onClick={() => setVisitType(vt)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        visitType === vt
                          ? 'border-[#1769D2] bg-[#EEF5FF] text-[#1769D2] ring-1 ring-blue-300'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {vt === 'In Clinic' ? <MapPin size={13} /> : <Video size={13} />}
                      <span>{vt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={apptDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setApptDate(e.target.value); setSelectedSlot(null); }}
                  className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                />
              </div>

              {/* Visit Duration */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Visit Duration
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DURATIONS.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        duration === d
                          ? 'bg-[#1769D2] text-white shadow-xs'
                          : 'bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Select Time Slot
                  </span>
                  <span className="text-[11px] text-emerald-600 font-bold">{availableCount} available</span>
                </div>

                {/* Period Filter */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3">
                  {[
                    { id: 'All', icon: Clock },
                    { id: 'Morning', icon: Sun },
                    { id: 'Afternoon', icon: Sunset },
                    { id: 'Evening', icon: Moon }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilterPeriod(tab.id)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                        filterPeriod === tab.id
                          ? 'bg-[#1769D2] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <tab.icon size={11} />
                      <span className="hidden sm:inline">{tab.id}</span>
                    </button>
                  ))}
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-4 gap-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                  {filteredSlots.map(s => {
                    const isBooked = bookedSlots.has(s.time);
                    const isSelected = selectedSlot === s.time;
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => !isBooked && setSelectedSlot(s.time)}
                        className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                          isBooked
                            ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through'
                            : isSelected
                            ? 'border-[#1769D2] bg-[#EEF5FF] text-[#1769D2] font-bold ring-1 ring-blue-300 cursor-pointer'
                            : 'border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-700 cursor-pointer'
                        }`}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>

                {!selectedSlot && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Strikethrough slots are already booked for {currentDoctor?.name?.split(' ')[0] || 'this doctor'} on the selected date.
                  </p>
                )}
              </div>

              {/* Chief Complaint & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Chief Complaint
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Throbbing molar pain"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Internal Notes (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Allergy to ibuprofen"
                    value={apptNotes}
                    onChange={(e) => setApptNotes(e.target.value)}
                    className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: REVIEW & CONFIRM ── */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5 space-y-3">
                <h3 className="font-extrabold text-sm text-[#102A50] flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#1769D2]" />
                  Appointment Summary
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white rounded-xl p-3 border border-blue-100 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</div>
                    <div className="font-extrabold text-[#102A50]">{targetName || '—'}</div>
                    <div className="text-slate-500">{targetId} • {targetPhone}</div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-blue-100 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Doctor</div>
                    <div className="font-extrabold text-[#102A50]">{currentDoctor?.name}</div>
                    <div className="text-slate-500">{currentDoctor?.specialty}</div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-blue-100 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</div>
                    <div className="font-extrabold text-[#1769D2]">{selectedSlot}</div>
                    <div className="text-slate-500">{apptDate} • {duration}</div>
                  </div>

                  <div className="bg-white rounded-xl p-3 border border-blue-100 space-y-0.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Visit Type</div>
                    <div className="font-extrabold text-[#102A50]">{visitType}</div>
                  </div>
                </div>

                {chiefComplaint && (
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chief Complaint</div>
                    <div className="text-xs font-semibold text-slate-700">{chiefComplaint}</div>
                  </div>
                )}

                {apptNotes && (
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notes</div>
                    <div className="text-xs text-slate-600">{apptNotes}</div>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <Check size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-800">
                    Appointment will be confirmed with status <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">Confirmed</span> and an APT-XXXX ID will be generated.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          {step === 1 ? (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { setStep(step - 1); setValidationError(''); }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Back</span>
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={step === 1 ? handleStep1Next : handleStep2Next}
              className="px-6 py-2 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight size={13} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={14} />
              <span>Confirm Appointment</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
