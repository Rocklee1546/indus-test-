import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, XCircle, AlertTriangle } from 'lucide-react';

export default function LostLeadModal() {
  const {
    lostLeadData,
    setLostLeadData,
    isLostLeadModalOpen,
    setIsLostLeadModalOpen,
    updateLeadStatus
  } = useApp();

  const [lostReason, setLostReason] = useState('Budget constraints / treatment cost above expectation');
  const [details, setDetails] = useState('');

  if (!isLostLeadModalOpen || !lostLeadData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateLeadStatus(lostLeadData.leadId, 'Lost Lead', {
      lostReason,
      note: details || 'Lead closed and archived.'
    });
    setIsLostLeadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <XCircle size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">Mark Lead as Lost</h2>
              <p className="text-xs text-rose-100">{lostLeadData.leadName}</p>
            </div>
          </div>
          <button
            onClick={() => setIsLostLeadModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-rose-50 border border-rose-200/60 rounded-2xl text-xs text-rose-800 leading-relaxed flex items-start gap-2">
            <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
            <span>
              This will close any active conversion follow-ups for this lead while preserving all communication history for future recall.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Lost Reason *</label>
            <select
              value={lostReason}
              onChange={(e) => setLostReason(e.target.value)}
              className="w-full text-xs font-semibold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
            >
              <option value="Budget constraints / treatment cost above expectation">
                Budget constraints / treatment cost above expectation
              </option>
              <option value="Chose competitor clinic in Coimbatore">
                Chose competitor clinic in Coimbatore
              </option>
              <option value="Unreachable after multiple call and WhatsApp attempts">
                Unreachable after multiple call and WhatsApp attempts
              </option>
              <option value="Relocated from Coimbatore / Out of city">
                Relocated from Coimbatore / Out of city
              </option>
              <option value="Postponed treatment indefinitely">
                Postponed treatment indefinitely
              </option>
              <option value="Treatment not offered at clinic">
                Treatment not offered at clinic
              </option>
              <option value="Other">Other reason</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional Remarks (Optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Patient mentioned looking for government college free treatment..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsLostLeadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <XCircle size={14} />
              <span>Confirm & Archive Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
