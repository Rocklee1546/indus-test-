import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Activity,
  Plus,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function BranchManagementModule() {
  const { branches, setSelectedBranch, setActiveModule, showToast } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Branch Management – 6 Coimbatore Locations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
              All Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single shared patient database, synchronized clinical EMR, and cross-branch chair schedules
          </p>
        </div>

        <button
          onClick={() => showToast('New branch configuration interface opened')}
          className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} />
          <span>Add 7th Branch (Expansion)</span>
        </button>
      </div>

      {/* 6 Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {branches.map(b => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-[#1769D2]">
                  {b.id}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {b.status}
                </span>
              </div>

              <h2 className="text-base font-extrabold text-[#102A50] mt-3 group-hover:text-[#1769D2] transition-colors">
                {b.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{b.address}</span>
              </p>

              <div className="space-y-1 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400" />
                  <span>{b.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>{b.operatingHours}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-slate-400" />
                  <span>Manager: <b className="text-slate-800">{b.manager}</b></span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                <div className="p-2 bg-[#F8FAFC] rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold">Chairs</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">{b.chairs} Operatories</div>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold">Staff</div>
                  <div className="text-xs font-black text-[#1769D2] mt-0.5">{b.staffCount} Team</div>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold">Monthly Rev</div>
                  <div className="text-xs font-black text-emerald-700 mt-0.5">₹{(b.monthlyRevenue / 100000).toFixed(1)}L</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                {b.activePatients} Registered Patients
              </span>
              <button
                onClick={() => {
                  setSelectedBranch(b.id);
                  setActiveModule('dashboard');
                }}
                className="text-xs font-extrabold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Filter Dashboard</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
