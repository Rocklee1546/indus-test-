import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, Clock, Calendar, AlertCircle, Phone, ArrowRight, UserCheck } from 'lucide-react';

const OUTCOMES = [
  {
    id: 'Interested',
    label: 'Interested in Treatment',
    desc: 'Lead confirmed interest. Move pipeline to Interested.',
    color: 'border-emerald-300 bg-emerald-50/60 text-emerald-800 ring-emerald-400'
  },
  {
    id: 'Appointment Booked',
    label: 'Appointment Booked',
    desc: 'Proceed to schedule appointment slot for this lead.',
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
    desc: 'Sent treatment brochures/pricing. Follow-up active.',
    color: 'border-purple-300 bg-purple-50/60 text-purple-800 ring-purple-400'
  },
  {
    id: 'No Response',
    label: 'No Response / Did Not Pick',
    desc: 'Multiple rings without answer. Logged attempt.',
    color: 'border-slate-300 bg-slate-50 text-slate-800 ring-slate-400'
  },
  {
    id: 'Not Interested',
    label: 'Not Interested (Lost Lead)',
    desc: 'Lead declined treatment or opted for another clinic.',
    color: 'border-rose-300 bg-rose-50/60 text-rose-800 ring-rose-400'
  }
];

export default function FollowupOutcomeModal() {
  const {
    followupOutcomeData,
    isFollowupOutcomeOpen,
    setIsFollowupOutcomeOpen,
    completeLeadFollowupWithOutcome,
    setLeadToBookAppt,
    setIsBookApptSlotOpen,
    leads
  } = useApp();

  const [selectedOutcome, setSelectedOutcome] = useState('Interested');
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [nextDate, setNextDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [nextTime, setNextTime] = useState('11:00 AM');
  const [error, setError] = useState('');

  if (!isFollowupOutcomeOpen || !followupOutcomeData) return null;

  const handleClose = () => {
    setIsFollowupOutcomeOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOutcome) {
      setError('Please select an outcome.');
      return;
    }

    const nextFollowupData = selectedOutcome === 'Call Again Later' ? {
      date: nextDate,
      time: nextTime,
      reason: outcomeNotes.trim() || 'Callback requested by lead'
    } : null;

    completeLeadFollowupWithOutcome(
      followupOutcomeData.id,
      selectedOutcome,
      outcomeNotes,
      nextFollowupData
    );

    handleClose();

    // If appointment booked, open BookAppointmentModal directly for this lead!
    if (selectedOutcome === 'Appointment Booked' && followupOutcomeData.leadId) {
      const lead = leads.find(l => l.id === followupOutcomeData.leadId);
      if (lead) {
        setLeadToBookAppt(lead);
        setIsBookApptSlotOpen(true);
      }
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

          {/* Conditional inputs based on outcome */}
          {selectedOutcome === 'Call Again Later' && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 animate-in fade-in">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Clock size={14} className="text-amber-600" />
                <span>Schedule Next Follow-Up Call</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Callback Date
                  </label>
                  <input
                    type="date"
                    value={nextDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNextDate(e.target.value)}
                    className="w-full text-xs font-bold bg-white border border-amber-300 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Callback Time
                  </label>
                  <input
                    type="text"
                    value={nextTime}
                    onChange={(e) => setNextTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full text-xs font-bold bg-white border border-amber-300 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {selectedOutcome === 'Appointment Booked' && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
              <Calendar size={16} className="text-[#1769D2] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold">Proceed to Book Appointment</span>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                  Submitting will mark this follow-up completed, set the lead status to <b>Appointment Booked</b>, and launch the appointment slot calendar for {followupOutcomeData.targetName}.
                </p>
              </div>
            </div>
          )}

          {/* Outcome Notes */}
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
              className="w-full py-3 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle size={15} />
              <span>Confirm Outcome & Update Lead Pipeline</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
