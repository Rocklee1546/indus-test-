import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export default function RescheduleFollowupModal() {
  const {
    rescheduleData,
    setRescheduleData,
    isRescheduleModalOpen,
    setIsRescheduleModalOpen,
    rescheduleFollowup
  } = useApp();

  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('11:00 AM');
  const [reason, setReason] = useState('Patient requested evening callback');

  if (!isRescheduleModalOpen || !rescheduleData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    rescheduleFollowup(rescheduleData.followupId, newDate, newTime, reason);
    setIsRescheduleModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#092C60] to-[#1769D2] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Reschedule Follow-up</h2>
              <p className="text-xs text-blue-100">Synchronized with Lead & Follow-ups</p>
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
          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs">
            <span className="font-bold text-amber-950">Current Schedule:</span>
            <div className="text-amber-800 mt-0.5">
              {rescheduleData.currentDate || 'Today'} • {rescheduleData.currentTime || '10:30 AM'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Time</label>
              <input
                type="text"
                placeholder="e.g. 04:30 PM"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Rescheduling</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
            >
              <option value="Patient requested evening callback">Patient requested evening callback</option>
              <option value="Patient travelling / out of town">Patient travelling / out of town</option>
              <option value="Consulting family regarding pricing">Consulting family regarding pricing</option>
              <option value="Doctor slot full, rescheduled to next day">Doctor slot full, rescheduled to next day</option>
              <option value="No response to initial call attempt">No response to initial call attempt</option>
              <option value="Custom staff arrangement">Custom staff arrangement</option>
            </select>
          </div>

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
              <span>Update Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
