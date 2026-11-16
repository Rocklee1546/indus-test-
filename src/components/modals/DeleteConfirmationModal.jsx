import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  message = 'Are you sure you want to delete this record?',
  itemName = '',
  detailMessage = 'This record will be removed from the active view. Authorised administrators can recover archived data if needed.',
  confirmButtonText = 'Delete',
  isDeleting = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={24} />
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-[#102A50]">{title}</h3>
          <p className="text-sm font-semibold text-slate-800 mt-1">{message}</p>
          {itemName && (
            <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
              {itemName}
            </div>
          )}
          {detailMessage && (
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {detailMessage}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={14} />
            <span>{confirmButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
