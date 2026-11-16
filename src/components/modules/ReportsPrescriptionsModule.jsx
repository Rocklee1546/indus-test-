import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Printer,
  Search,
  MessageSquare,
  Sparkles,
  Download,
  Stethoscope,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function ReportsPrescriptionsModule() {
  const { prescriptions, showToast, setActivePatientId, setActiveModule } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = prescriptions.filter(p =>
    p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Prescriptions & Clinical Documents
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              {filtered.length} Finalized Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-locked digital prescriptions signed by authorized dental surgeons across Coimbatore
          </p>
        </div>

        <button
          onClick={() => setActiveModule('opd')}
          className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Stethoscope size={15} />
          <span>Write New Rx in OPD Pad</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prescriptions by patient name, UHID, diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      {/* Prescriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(rx => (
          <div key={rx.id} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-black text-xs text-[#1769D2]">{rx.id}</span>
                <div className="text-[11px] text-slate-400 font-semibold">{rx.date} • {rx.branchName}</div>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ✓ Signed & Finalized
              </span>
            </div>

            <div>
              <div className="font-extrabold text-sm text-[#102A50]">{rx.patientName} ({rx.age}y / {rx.gender})</div>
              <div className="text-xs text-slate-500 mt-0.5">Doctor: <b className="text-slate-800">{rx.doctorName}</b></div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis</span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">{rx.diagnosis}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Medicines ({rx.medicines.length})</span>
              <div className="space-y-1">
                {rx.medicines.map((m, idx) => (
                  <div key={idx} className="text-xs flex justify-between p-1.5 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-800">{m.name}</span>
                    <span className="text-slate-500">{m.frequency} • {m.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Next Review: <b className="text-[#102A50]">{rx.nextVisit}</b></span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    showToast('Prescription link sent to patient WhatsApp');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Printer size={13} />
                  <span>Print Rx</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
