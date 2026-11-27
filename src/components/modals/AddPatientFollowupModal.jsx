import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, Stethoscope, AlertCircle, Plus, User } from 'lucide-react';
import PatientSearchSelector from '../common/PatientSearchSelector';

export const PATIENT_FOLLOWUP_CATEGORIES = [
  'Post-Treatment Follow-up',
  'Next Treatment Session',
  'Appointment Confirmation',
  'Missed Appointment',
  'Payment Reminder',
  'Lab Report / Lab Work Ready',
  'Dental Check-up Recall',
  '6-Month Cleaning & Polishing Recall',
  'Review / Feedback Request',
  'Doctor-Recommended Follow-up'
];

export default function AddPatientFollowupModal() {
  const {
    isAddPatientFollowupOpen,
    setIsAddPatientFollowupOpen,
    patientFollowupTargetPatient,
    setPatientFollowupTargetPatient,
    doctors,
    addPatientFollowup,
    currentUser
  } = useApp();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [category, setCategory] = useState(PATIENT_FOLLOWUP_CATEGORIES[0]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || 'DOC-01');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('11:00 AM');
  const [method, setMethod] = useState('WhatsApp');
  const [reason, setReason] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAddPatientFollowupOpen) {
      setSelectedPatient(patientFollowupTargetPatient || null);
      setCategory(PATIENT_FOLLOWUP_CATEGORIES[0]);
      setReason('');
      setClinicalNotes('');
      setError('');
    }
  }, [isAddPatientFollowupOpen, patientFollowupTargetPatient]);

  if (!isAddPatientFollowupOpen) return null;

  const activeDocs = (doctors || []).filter(d => (d.status || 'Active') === 'Active');
  const currentDoctor = activeDocs.find(d => d.id === selectedDoctorId) || activeDocs[0] || doctors[0];

  const handleClose = () => {
    setIsAddPatientFollowupOpen(false);
    setPatientFollowupTargetPatient(null);
    setSelectedPatient(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) {
      setError('Please search and select a patient.');
      return;
    }
    if (!scheduledDate) {
      setError('Please choose a follow-up date.');
      return;
    }

    addPatientFollowup({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      phone: selectedPatient.phone,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      category,
      scheduledDate,
      scheduledTime,
      method,
      reason: reason.trim() || `${category} scheduled`,
      clinicalNotes: clinicalNotes.trim(),
      assignedTo: currentUser?.name || 'Dr. Priya Sharma',
      treatment: selectedPatient.treatment || 'Dental Care'
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
              <h2 className="text-base font-extrabold text-[#102A50]">Schedule Patient Follow-Up</h2>
            </div>
            <p className="text-xs text-slate-500">
              Clinical post-treatment check, recall, or next session for registered patients
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto scrollbar-thin flex-1">
          {/* Patient Selector */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-3.5">
            <PatientSearchSelector
              selectedPatient={selectedPatient}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setError('');
              }}
              onClearPatient={() => setSelectedPatient(null)}
              label="Select Patient *"
              required={true}
            />
          </div>

          {/* Category & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Follow-Up Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {PATIENT_FOLLOWUP_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Assigned Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                {activeDocs.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty || d.role || 'Dental Surgeon'})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time, Method */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-2 text-[#102A50] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="11:00 AM"
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-2 text-[#102A50] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-2 text-[#102A50] outline-none cursor-pointer"
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Call">Phone Call</option>
                <option value="In-Clinic">In-Clinic Review</option>
              </select>
            </div>
          </div>

          {/* Reason / Purpose */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Follow-Up Purpose / Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Check post-op swelling and crown fit after 7 days"
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Doctor's Clinical Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="e.g. Review suture healing; take IOPA radiograph if sensitivity persists..."
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Plus size={15} />
              <span>Schedule Patient Follow-Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
