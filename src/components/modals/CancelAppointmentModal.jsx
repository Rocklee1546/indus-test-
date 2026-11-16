import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, XCircle, AlertCircle } from 'lucide-react';

const CANCEL_REASONS = [
  'Patient request',
  'Patient no-show (pre-cancel)',
  'Doctor unavailable',
  'Emergency',
  'Double booking',
  'Patient hospitalised',
  'Treatment completed elsewhere',
  'Other'
];

export default function CancelAppointmentModal() {
  const {
    isCancelApptOpen,
    setIsCancelApptOpen,
    cancelApptData,
    setCancelApptData,
    cancelAppointment
  } = useApp();

  const [selectedReason, setSelectedReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isCancelApptOpen) {
      setSelectedReason('');
      setAdditionalNotes('');
      setError('');
    }
  }, [isCancelApptOpen]);

  if (!isCancelApptOpen || !cancelApptData) return null;

  const handleCancel = () => {
    if (!selectedReason) {
      setError('Please select a cancellation reason.');
      return;
    }
    cancelAppointment(cancelApptData.id, selectedReason, additionalNotes);
    setIsCancelApptOpen(false);
    setCancelApptData(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-red-50 bg-red-50/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <XCircle size={18} className="text-red-500" />
              <h2 className="text-base font-extrabold text-red-900">Cancel Appointment</h2>
            </div>
            <p className="text-xs text-red-700/70 mt-0.5">
              <b>{cancelApptData.patientName}</b> • {cancelApptData.id} • {cancelApptData.date} at {cancelApptData.time}
            </p>
          </div>
          <button
            onClick={() => { setIsCancelApptOpen(false); setCancelApptData(null); }}
            className="w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Appointment info */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Doctor</div>
                <div className="font-semibold">{cancelApptData.doctorName}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Treatment</div>
                <div className="font-semibold truncate">{cancelApptData.treatmentType || '—'}</div>
              </div>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Reason for Cancellation *
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {CANCEL_REASONS.map(r => (
                <button key={r} type="button" onClick={() => { setSelectedReason(r); setError(''); }}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedReason === r
                      ? 'border-red-400 bg-red-50 text-red-800 ring-1 ring-red-300'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Additional Notes (optional)
            </label>
            <textarea
              rows={2}
              placeholder="Any additional details about this cancellation..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-red-100 outline-none resize-none"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle size={13} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs text-amber-800 font-medium">
              ⚠️ Cancellation is permanent. The appointment slot will be freed for other patients. A WhatsApp/SMS notification may be sent to the patient.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button type="button"
              onClick={() => { setIsCancelApptOpen(false); setCancelApptData(null); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Keep Appointment
            </button>
            <button type="button" onClick={handleCancel}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <XCircle size={13} />
              <span>Cancel Appointment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
