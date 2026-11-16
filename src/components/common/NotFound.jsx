import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200/80 p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1769D2] mx-auto flex items-center justify-center shadow-inner">
          <FileQuestion size={32} />
        </div>

        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#1769D2] bg-blue-50 px-3 py-1 rounded-full">
            404 • Page Not Found
          </span>
          <h2 className="text-xl font-extrabold text-[#102A50] mt-3">
            Destination Route Not Found
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            The page or link you requested does not exist or has been moved. Use the navigation buttons below to return to INDUS Dental.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Home size={14} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
