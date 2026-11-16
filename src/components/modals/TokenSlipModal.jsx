import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Printer, CheckCircle, Clock, Stethoscope, User, MapPin } from 'lucide-react';

export default function TokenSlipModal() {
  const { tokenSlipData, isTokenSlipOpen, setIsTokenSlipOpen, showToast } = useApp();

  if (!isTokenSlipOpen || !tokenSlipData) return null;

  const handlePrint = () => {
    showToast('Token Slip sent to receipt printer.');
    window.print?.();
  };

  const handleClose = () => {
    setIsTokenSlipOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-[#092C60] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-white font-black text-sm">
              ID
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wide">INDUS Dental Clinic</h2>
              <p className="text-[10px] text-blue-200">OPD Check-In & Token Slip</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Printable Token Body */}
        <div className="p-6 space-y-4 text-center">
          {/* Token Number Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-[#1769D2]/30">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#1769D2]">
              Live Queue Token
            </span>
            <div className="text-4xl font-black text-[#102A50] my-2 tracking-tight">
              {tokenSlipData.tokenNumber || 'Token 001'}
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {tokenSlipData.queueStatus || 'WAITING IN QUEUE'}
            </span>
          </div>

          {/* Details Table */}
          <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-slate-200/80 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <User size={13} className="text-slate-400" /> Patient:
              </span>
              <span className="font-extrabold text-[#102A50] text-right">
                {tokenSlipData.patientName}
                <div className="text-[10px] font-bold text-[#1769D2]">{tokenSlipData.patientId}</div>
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <Stethoscope size={13} className="text-slate-400" /> Attending:
              </span>
              <span className="font-bold text-slate-800 text-right">
                {tokenSlipData.doctorName}
                <div className="text-[10px] text-purple-700 font-bold">{tokenSlipData.chair || 'Chair 1'}</div>
              </span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <Clock size={13} className="text-slate-400" /> Check-in Time:
              </span>
              <span className="font-bold text-slate-800">
                {tokenSlipData.checkInTime || 'Just now'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                <MapPin size={13} className="text-slate-400" /> Clinic:
              </span>
              <span className="font-bold text-slate-800 text-right">
                INDUS Dental • R.S. Puram
              </span>
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="py-2 flex flex-col items-center">
            <div className="flex items-center justify-center gap-0.5 h-9 opacity-70">
              {[4, 2, 5, 1, 3, 6, 2, 4, 3, 1, 5, 2, 6, 1, 3, 5, 2, 4, 1, 3, 6, 2].map((w, i) => (
                <div
                  key={i}
                  className="bg-slate-800 rounded-xs"
                  style={{ width: `${w * 1.5}px`, height: '100%' }}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-400 tracking-widest mt-1">
              IND-{tokenSlipData.tokenNumber?.replace(/\D/g, '') || '001'}-{new Date().getFullYear()}
            </span>
          </div>

          {/* Instructions */}
          <p className="text-[11px] text-slate-500 leading-normal">
            Please be seated in the clinic waiting lounge. Your token will be announced on the display screen.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer size={14} />
              <span>Print Slip</span>
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 transition-all"
            >
              <CheckCircle size={14} />
              <span>Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
