import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr } from '../../utils/dateFilterUtils';
import {
  X,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
  Phone,
  ArrowRight,
  UserCheck,
  Stethoscope,
  XCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

const OUTCOMES = [
  {
    id: 'Interested',
    label: 'Interested in Treatment',
    desc: 'Lead confirmed interest. Schedule consultation callback.',
    color: 'border-emerald-300 bg-emerald-50/60 text-emerald-800 ring-emerald-400'
  },
  {
    id: 'Appointment Booked',
    label: 'Appointment Booked',
    desc: 'Schedule appointment slot directly for this lead.',
    color: 'border-blue-300 bg-blue-50/60 text-blue-800 ring-blue-400'
  },
  {
    id: 'Call Again Later',
    label: 'Call Again Later',
    desc: 'Lead requested callback at another date and time.',
    color: 'border-amber-300 bg-amber-50/60 text-amber-800 ring-amber-400'
  },
  {
    id: 'Requested More Information',
    label: 'Requested More Info',
    desc: 'Sent treatment details/pricing. Next check-in required.',
    color: 'border-purple-300 bg-purple-50/60 text-purple-800 ring-purple-400'
  },
  {
    id: 'No Response',
    label: 'No Response / Did Not Pick',
    desc: 'Multiple rings without answer. Schedule recall attempt.',
    color: 'border-slate-300 bg-slate-50 text-slate-800 ring-slate-400'
  },
  {
    id: 'Not Interested',
    label: 'Not Interested (Lost Lead)',
    desc: 'Lead declined treatment or opted for another clinic.',
    color: 'border-rose-300 bg-rose-50/60 text-rose-800 ring-rose-400'
  }
];

const LOST_REASONS = [
  'Price / Treatment cost too high',
  'Opted for competitor dental clinic',
  'No longer requires treatment',
  'Relocated / Out of Coimbatore',
  'Unhappy with clinic location / distance',
  'Other / Not specified'
];

export default function FollowupOutcomeModal() {
  const {
    followupOutcomeData,
    isFollowupOutcomeOpen,
    setIsFollowupOutcomeOpen,
    completeLeadFollowupWithOutcome,
    activeDoctors,
    doctors
  } = useApp();

  const [selectedOutcome, setSelectedOutcome] = useState('Interested');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  
  // Schedule Next Follow-up fields (for the 4 recurring outcomes)
  const [nextDate, setNextDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [nextTime, setNextTime] = useState('11:00 AM');

  // Appointment Booked fields
  const [apptDate, setApptDate] = useState(() => getTodayDateStr());
  const [apptTime, setApptTime] = useState('11:30 AM');
  const [apptDoctorId, setApptDoctorId] = useState('');

  // Lost Lead fields
  const [lostReason, setLostReason] = useState(LOST_REASONS[0]);

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableDoctors = (activeDoctors && activeDoctors.length > 0)
    ? activeDoctors
    : (doctors || []).filter(d => (d.status || 'Active') === 'Active');

  useEffect(() => {
    if (isFollowupOutcomeOpen && followupOutcomeData) {
      setSelectedOutcome('Interested');
      setOutcomeNotes('');
      const d = new Date();
      d.setDate(d.getDate() + 1);
      setNextDate(d.toISOString().split('T')[0]);
      setNextTime('11:00 AM');
      setApptDate(getTodayDateStr());
      setApptTime('11:30 AM');
      if (availableDoctors.length > 0) {
        setApptDoctorId(availableDoctors[0].id);
      }
      setLostReason(LOST_REASONS[0]);
      setError('');
      setIsSubmitting(false);
    }
  }, [isFollowupOutcomeOpen, followupOutcomeData]);

  if (!isFollowupOutcomeOpen || !followupOutcomeData) return null;

  const handleClose = () => {
    setIsFollowupOutcomeOpen(false);
    setError('');
    setIsSubmitting(false);
  };

  const isRecurringOutcome = [
    'Interested',
    'Call Again Later',
    'Requested More Information',
    'No Response'
  ].includes(selectedOutcome);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!selectedOutcome) {
      setError('Please select an outcome.');
      return;
    }

    // 1. Mandatory validation for the 4 recurring outcomes
    if (isRecurringOutcome) {
      if (!nextDate || !nextDate.trim()) {
        setError('Please select a valid Next Follow-up Date.');
        return;
      }
      if (!nextTime || !nextTime.trim()) {
        setError('Please select a valid Next Follow-up Time.');
        return;
      }
    }

    // 2. Mandatory validation for Appointment Booked
    if (selectedOutcome === 'Appointment Booked') {
      if (!apptDate) {
        setError('Please select an Appointment Date.');
        return;
      }
      if (!apptTime) {
        setError('Please select an Appointment Time.');
        return;
      }
    }

    // 3. Mandatory validation for Lost Lead
    if (selectedOutcome === 'Not Interested' && !lostReason && !outcomeNotes.trim()) {
      setError('Please specify a reason for marking the lead as lost.');
      return;
    }

    setIsSubmitting(true);

    try {
      const nextFollowupData = isRecurringOutcome ? {
        date: nextDate,
        time: nextTime,
        notes: outcomeNotes.trim(),
        reason: `${selectedOutcome} callback`
      } : null;

      const selectedDoc = availableDoctors.find(d => d.id === apptDoctorId) || availableDoctors[0];

      const appointmentData = selectedOutcome === 'Appointment Booked' ? {
        date: apptDate,
        time: apptTime,
        doctorId: selectedDoc?.id || 'DOC-01',
        doctorName: selectedDoc?.name || 'Dr. Priya Sharma',
        treatmentType: followupOutcomeData.treatment || 'General Dental Consultation',
        notes: outcomeNotes.trim()
      } : null;

      const finalNotes = selectedOutcome === 'Not Interested'
        ? `Reason: ${lostReason}${outcomeNotes.trim() ? ` | Notes: ${outcomeNotes.trim()}` : ''}`
        : outcomeNotes.trim();

      completeLeadFollowupWithOutcome(
        followupOutcomeData.id,
        selectedOutcome,
        finalNotes,
        nextFollowupData,
        appointmentData
      );

      handleClose();
    } catch (err) {
      setError('An error occurred while saving the outcome. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-extrabold text-[#102A50]">Complete Lead Follow-up</h2>
            <p className="text-xs text-slate-500">
              For: <b className="text-[#1769D2]">{followupOutcomeData.targetName}</b> ({followupOutcomeData.leadId || 'Lead'})
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto scrollbar-thin flex-1">
          {/* Outcome Selection Grid */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select Follow-up Call / WhatsApp Outcome *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OUTCOMES.map(o => {
                const isSelected = selectedOutcome === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => { setSelectedOutcome(o.id); setError(''); }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${o.color} border-2 ring-2 shadow-xs`
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>{o.label}</span>
                      {isSelected && <CheckCircle size={14} className="shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{o.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. SCHEDULE NEXT FOLLOW-UP SECTION (Mandatory for the 4 recurring outcomes) */}
          {isRecurringOutcome && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#102A50] flex items-center gap-1.5">
                  <Clock size={15} className="text-[#1769D2]" />
                  <span>Schedule Next Follow-Up *</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                  Keeps Lead Active
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                This lead remains active in the pipeline. Please set the date and time for the next callback or message.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Next Follow-up Date *
                  </label>
                  <input
                    type="date"
                    value={nextDate}
                    min={getTodayDateStr()}
                    onChange={(e) => { setNextDate(e.target.value); setError(''); }}
                    className="w-full text-xs font-bold bg-white border border-blue-300 rounded-xl px-3 py-2 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Next Follow-up Time *
                  </label>
                  <input
                    type="text"
                    value={nextTime}
                    onChange={(e) => { setNextTime(e.target.value); setError(''); }}
                    placeholder="e.g. 11:30 AM"
                    className="w-full text-xs font-bold bg-white border border-blue-300 rounded-xl px-3 py-2 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* Quick Preset Buttons for Next Time */}
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span className="text-[10px] text-slate-500 font-medium">Quick slots:</span>
                {['10:30 AM', '12:00 PM', '03:00 PM', '05:30 PM', '07:00 PM'].map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setNextTime(slot)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                      nextTime === slot ? 'bg-[#1769D2] text-white border-[#1769D2]' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. APPOINTMENT BOOKING SECTION */}
          {selectedOutcome === 'Appointment Booked' && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <Calendar size={15} className="text-emerald-700" />
                  <span>Book Clinic Appointment *</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Direct Booking
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-tight">
                An appointment will be registered in Appointments and the lead status updated to <b>Appointment Booked</b>.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={apptDate}
                    min={getTodayDateStr()}
                    onChange={(e) => { setApptDate(e.target.value); setError(''); }}
                    className="w-full text-xs font-bold bg-white border border-emerald-300 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Appointment Time *
                  </label>
                  <input
                    type="text"
                    value={apptTime}
                    onChange={(e) => { setApptTime(e.target.value); setError(''); }}
                    placeholder="e.g. 11:30 AM"
                    className="w-full text-xs font-bold bg-white border border-emerald-300 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Treating Doctor *
                </label>
                <select
                  value={apptDoctorId}
                  onChange={(e) => setApptDoctorId(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-emerald-300 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
                >
                  {availableDoctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty || doc.role || 'Dental Surgeon'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* 3. NOT INTERESTED (LOST LEAD) SECTION */}
          {selectedOutcome === 'Not Interested' && (
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-rose-900 flex items-center gap-1.5">
                  <XCircle size={15} className="text-rose-600" />
                  <span>Mark as Lost Lead</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Closes Follow-ups
                </span>
              </div>
              <p className="text-[11px] text-rose-800 leading-tight">
                This will move the lead to <b>Lost Lead</b> and close remaining pending tasks. The lead record remains saved for auditing.
              </p>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Reason for Lost Lead *
                </label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  className="w-full text-xs font-bold bg-white border border-rose-300 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
                >
                  {LOST_REASONS.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Outcome Notes / Summary */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Follow-up Conversation Notes / Summary
            </label>
            <textarea
              rows={2}
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              placeholder="e.g. Discussed implant cost and warranty. Patient wants evening slot next Monday..."
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all ${
                isSubmitting ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <CheckCircle size={15} />
              <span>
                {selectedOutcome === 'Appointment Booked'
                  ? 'Confirm Booking & Complete Follow-up'
                  : isRecurringOutcome
                  ? 'Confirm Outcome & Schedule Next Follow-up'
                  : 'Confirm Outcome & Close Follow-up'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
