import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Calendar, CheckCircle2, User, Sparkles } from 'lucide-react';

export default function RescheduleFollowupModal() {
  const {
    rescheduleData,
    setRescheduleData,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    scheduleNextFollowup
  } = useApp();

  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('11:00 AM');
  const [reason, setReason] = useState('Enquiry & Treatment Discussion');
  const [notes, setNotes] = useState('');

  // Sync state when rescheduleData is opened
  useEffect(() => {
    if (rescheduleData) {
      if (rescheduleData.currentDate) {
        setNewDate(rescheduleData.currentDate);
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setNewDate(tomorrow.toISOString().split('T')[0]);
      }
      if (rescheduleData.currentTime) setNewTime(rescheduleData.currentTime);
      if (rescheduleData.currentReason) setReason(rescheduleData.currentReason);
      setNotes('');
    }
  }, [rescheduleData, isRescheduleModalOpen]);

  if (!isRescheduleModalOpen || !rescheduleData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    scheduleNextFollowup({
      leadId: rescheduleData.leadId,
      followupId: rescheduleData.followupId,
      date: newDate,
      time: newTime,
      reason,
      notes
    });
    setIsRescheduleModalOpen(false);
  };

  // Quick Date Helpers
  const setQuickDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setNewDate(d.toISOString().split('T')[0]);
  };

  const quickTimes = ['10:00 AM', '11:30 AM', '02:30 PM', '04:30 PM', '06:00 PM'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#092C60] to-[#1769D2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Schedule Next Follow-Up</h2>
              <p className="text-xs text-blue-100">Synchronized with Lead History & Follow-ups</p>
            </div>
          </div>
          <button
            onClick={() => setIsRescheduleModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Patient / Target Information Card */}
          <div className="p-3 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200/60 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <User size={15} className="text-[#1769D2] shrink-0" />
              <div className="min-w-0">
                <span className="font-extrabold text-[#102A50] block truncate">
                  {rescheduleData.leadName || rescheduleData.targetName || 'Prospective Lead'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {rescheduleData.leadTreatment || rescheduleData.treatment || 'Dental Consultation'}
                </span>
              </div>
            </div>
            {rescheduleData.currentDate && (
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current</span>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md">
                  {rescheduleData.currentDate}
                </span>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#102A50]">Next Follow-up Date *</label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setQuickDate(0)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#1769D2] text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(1)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#1769D2] text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(3)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#1769D2] text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate(7)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#1769D2] text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  +1 Week
                </button>
              </div>
            </div>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#102A50]">Next Follow-up Time *</label>
              <span className="text-[10px] text-slate-400 font-medium">Quick Slots:</span>
            </div>
            <input
              type="text"
              placeholder="e.g. 11:30 AM"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white mb-1.5"
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {quickTimes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewTime(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    newTime === t
                      ? 'bg-[#1769D2] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#1769D2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Purpose / Category */}
          <div>
            <label className="block text-xs font-bold text-[#102A50] mb-1">Purpose / Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none cursor-pointer focus:ring-2 focus:ring-blue-100 focus:bg-white"
            >
              <option value="Enquiry & Treatment Discussion">Enquiry & Treatment Discussion</option>
              <option value="Quote & Pricing Review">Quote & Pricing Review</option>
              <option value="Appointment Booking Confirmation">Appointment Booking Confirmation</option>
              <option value="Implant / Aligner Consultation Follow-up">Implant / Aligner Consultation Follow-up</option>
              <option value="Post-Consultation Check">Post-Consultation Check</option>
              <option value="Family Consultation on Pricing">Family Consultation on Pricing</option>
              <option value="Patient requested evening callback">Patient requested evening callback</option>
              <option value="No response to initial call attempt">No response to initial call attempt</option>
              <option value="Insurance / EMI Options Assistance">Insurance / EMI Options Assistance</option>
            </select>
          </div>

          {/* Notes & Remarks */}
          <div>
            <label className="block text-xs font-bold text-[#102A50] mb-1">
              Remarks & Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Patient requested callback after 5 PM regarding implant warranty..."
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsRescheduleModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Save Next Follow-Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
