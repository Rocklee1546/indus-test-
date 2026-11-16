import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CalendarDays, ArrowRight, AlertCircle } from 'lucide-react';

export default function RescheduleAppointmentModal() {
  const {
    isRescheduleApptOpen,
    setIsRescheduleApptOpen,
    rescheduleApptData,
    setRescheduleApptData,
    rescheduleAppointment
  } = useApp();

  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isRescheduleApptOpen && rescheduleApptData) {
      setNewDate(rescheduleApptData.date || '');
      setNewTime(rescheduleApptData.time || '');
      setReason('');
      setError('');
    }
  }, [isRescheduleApptOpen, rescheduleApptData]);

  if (!isRescheduleApptOpen || !rescheduleApptData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) { setError('Please select a new date.'); return; }
    if (!newTime) { setError('Please enter a new time.'); return; }
    rescheduleAppointment(rescheduleApptData.id, newDate, newTime, reason);
    setIsRescheduleApptOpen(false);
    setRescheduleApptData(null);
  };

  const quickTimes = ['09:00 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '05:00 PM', '05:30 PM', '06:00 PM'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#102A50]">Reschedule Appointment</h2>
            <p className="text-xs text-slate-500">
              <b className="text-[#1769D2]">{rescheduleApptData.patientName}</b> • {rescheduleApptData.id}
            </p>
          </div>
          <button
            onClick={() => { setIsRescheduleApptOpen(false); setRescheduleApptData(null); }}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Current Booking</div>
            <div className="font-semibold">
              {rescheduleApptData.date} at {rescheduleApptData.time} • {rescheduleApptData.doctorName} • {rescheduleApptData.chair || 'Chair 1'}
            </div>
          </div>

          {/* New Date */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              New Date *
            </label>
            <input
              type="date"
              value={newDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
            />
          </div>

          {/* New Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              New Time Slot *
            </label>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {quickTimes.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNewTime(t)}
                  className={`py-1.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                    newTime === t
                      ? 'border-[#1769D2] bg-[#EEF5FF] text-[#1769D2] ring-1 ring-blue-300'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom time e.g. 02:45 PM"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Reason for Rescheduling (optional)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['Patient request', 'Doctor unavailable', 'Emergency rescheduling', 'Patient travel', 'Lab results pending'].map(r => (
                <button key={r} type="button" onClick={() => setReason(r)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                    reason === r ? 'bg-blue-100 text-[#1769D2] border-blue-300' : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Custom reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button type="button"
              onClick={() => { setIsRescheduleApptOpen(false); setRescheduleApptData(null); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <CalendarDays size={13} />
              <span>Confirm Reschedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
