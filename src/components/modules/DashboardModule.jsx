import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserPlus,
  Clock,
  CalendarDays,
  CheckCircle2,
  Phone,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Building2,
  Stethoscope,
  Activity,
  Receipt
} from 'lucide-react';

export default function DashboardModule() {
  const {
    currentUser,
    branches,
    selectedBranch,
    leads,
    filteredLeads,
    followups,
    filteredFollowups,
    appointments,
    filteredAppointments,
    patients,
    setActiveModule,
    setIsAddPatientOpen,
    setIsBookCheckInOpen,
    setIsAddLeadOpen
  } = useApp();

  // Connected Dynamic Metrics derived directly from central CRM state (excluding soft-deleted)
  const activeLeads = leads.filter(l => !l.isDeleted);
  const activePatients = patients.filter(p => !p.isDeleted && !p.isArchived);

  const totalLeads = activeLeads.length;
  const newLeadsCount = activeLeads.filter(l => l.status === 'New').length;
  const contactedCount = activeLeads.filter(l => l.status === 'Contacted').length;
  const followupCount = activeLeads.filter(l => l.status === 'Follow-up Required').length;
  const apptBookedCount = activeLeads.filter(l => l.status === 'Appointment Booked').length;
  const convertedLeadsCount = activeLeads.filter(l => l.status === 'Converted to Patient').length;
  const convertedPatientsCount = convertedLeadsCount;
  const followupsTodayCount = followups.filter(f => f.status !== 'Completed' && f.status !== 'Cancelled').length;
  const appointmentsTodayCount = appointments.filter(a => a.status !== 'Cancelled').length;
  const registeredPatientsCount = activePatients.length;
  const conversionRate = Math.round((convertedLeadsCount / (activeLeads.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* 1. Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#EEF5FF] via-[#E2EDFC] to-[#EEF5FF] p-6 lg:p-8 overflow-hidden border border-blue-100/80 shadow-xs">
        {/* Soft Dental Clinic Background Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 lg:opacity-35 pointer-events-none bg-no-repeat bg-right bg-contain flex items-center justify-end pr-8">
          <svg className="w-80 h-80 text-[#1769D2]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 4.5C10.2 3.2 7.8 2.5 5.5 3.2C3.2 3.9 2 6 2 8.8C2 12.2 3.3 15.2 4.8 18.2C5.6 19.8 7.2 21 8.8 20.2C10.2 19.5 10.8 17.5 11.2 15.5C11.5 14.2 11.7 13.2 12 13.2C12.3 13.2 12.5 14.2 12.8 15.5C13.2 17.5 13.8 19.5 15.2 20.2C16.8 21 18.4 19.8 19.2 18.2C20.7 15.2 22 12.2 22 8.8C22 6 20.8 3.9 18.5 3.2C16.2 2.5 13.8 3.2 12 4.5Z" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#102A50] tracking-tight">
              Welcome Back, {currentUser.name}!
            </h1>
            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
              <span>Let's turn more leads into healthy smiles</span>
              <Sparkles size={16} className="text-amber-500 inline" />
            </p>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="text-right">
              <span className="block text-2xl font-black text-[#1769D2] font-serif italic tracking-wide">
                Healthy Smile
              </span>
              <span className="block text-base font-bold text-slate-500 font-serif italic -mt-1">
                Happy Life
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards – 6 Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Leads */}
        <div
          onClick={() => setActiveModule('leads')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#EBF2FF] text-[#1769D2] flex items-center justify-center shrink-0 shadow-xs">
              <Users size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate leading-tight">
                Total Leads
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#102A50] leading-none">
                  {totalLeads}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                  ↑ 12%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 -mx-1">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-card-1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1769D2" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#1769D2" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,13 C12,14 24,9 38,12 C52,15 65,7 78,10 C88,12 94,4 100,2 L100,16 L0,16 Z" fill="url(#grad-card-1)" />
              <path d="M0,13 C12,14 24,9 38,12 C52,15 65,7 78,10 C88,12 94,4 100,2" fill="none" stroke="#1769D2" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: New Leads */}
        <div
          onClick={() => setActiveModule('leads')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-[#12B89A] flex items-center justify-center shrink-0 shadow-xs">
              <UserPlus size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate leading-tight">
                New Leads
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#102A50] leading-none">
                  {newLeadsCount}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                  ↑ 8%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 -mx-1">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-card-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#12B89A" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#12B89A" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,14 C15,15 26,11 40,11 C55,11 68,5 82,7 C90,8 96,3 100,1 L100,16 L0,16 Z" fill="url(#grad-card-2)" />
              <path d="M0,14 C15,15 26,11 40,11 C55,11 68,5 82,7 C90,8 96,3 100,1" fill="none" stroke="#12B89A" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Follow-ups Due Today */}
        <div
          onClick={() => setActiveModule('followups')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-[#F28B42] flex items-center justify-center shrink-0 shadow-xs">
              <Clock size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate leading-tight">
                Follow-ups Today
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#102A50] leading-none">
                  {followupsTodayCount}
                </span>
                <span className="text-[10px] font-extrabold text-[#F28B42] flex items-center gap-0.5">
                  ↑ 2%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 -mx-1">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-card-3" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F28B42" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#F28B42" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,14 C14,14 26,12 42,13 C58,14 70,6 84,8 C91,9 96,4 100,2 L100,16 L0,16 Z" fill="url(#grad-card-3)" />
              <path d="M0,14 C14,14 26,12 42,13 C58,14 70,6 84,8 C91,9 96,4 100,2" fill="none" stroke="#F28B42" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Appointments Today */}
        <div
          onClick={() => setActiveModule('appointments')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#7955D9] flex items-center justify-center shrink-0 shadow-xs">
              <CalendarDays size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate leading-tight">
                Appointments Today
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#102A50] leading-none">
                  {appointmentsTodayCount}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                  ↑ 6%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 -mx-1">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-card-4" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7955D9" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#7955D9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,15 C16,16 28,10 44,12 C60,14 72,7 86,9 C92,10 97,4 100,2 L100,16 L0,16 Z" fill="url(#grad-card-4)" />
              <path d="M0,15 C16,16 28,10 44,12 C60,14 72,7 86,9 C92,10 97,4 100,2" fill="none" stroke="#7955D9" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 5: Registered Patients */}
        <div
          onClick={() => setActiveModule('patients')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#092C60] flex items-center justify-center shrink-0 shadow-xs">
              <Activity size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate leading-tight">
                Registered Patients
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#102A50] leading-none">
                  {registeredPatientsCount}
                </span>
                <span className="text-[10px] font-extrabold text-blue-600 flex items-center gap-0.5">
                  ↑ 10%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 -mx-1">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-card-reg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#092C60" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#092C60" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,14 C15,15 28,11 44,12 C60,13 74,6 88,8 C94,9 98,3 100,1 L100,16 L0,16 Z" fill="url(#grad-card-reg)" />
              <path d="M0,14 C15,15 28,11 44,12 C60,13 74,6 88,8 C94,9 98,3 100,1" fill="none" stroke="#092C60" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 6: Converted Leads */}
        <div
          onClick={() => setActiveModule('leads')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16A779] flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-bold text-slate-500 block truncate leading-tight">
                Converted Leads
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-black text-[#102A50] leading-none">
                  {convertedLeadsCount}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 flex items-center gap-0.5">
                  ↑ 15%
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2.5 -mx-1">
            <svg className="w-full h-4 overflow-visible" viewBox="0 0 100 16" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-card-5" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16A779" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#16A779" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,14 C15,15 28,11 44,12 C60,13 74,6 88,8 C94,9 98,3 100,1 L100,16 L0,16 Z" fill="url(#grad-card-5)" />
              <path d="M0,14 C15,15 28,11 44,12 C60,13 74,6 88,8 C94,9 98,3 100,1" fill="none" stroke="#16A779" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Middle Row: Lead Pipeline & Lead Source Performance (Matching Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lead Pipeline (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#102A50] flex items-center gap-2">
                <TrendingUp size={16} className="text-[#1769D2]" />
                <span>Lead Pipeline</span>
              </h2>
              <button
                onClick={() => setActiveModule('leads')}
                className="text-xs font-bold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </div>

            {/* Pipeline Steps Horizontal Flow (Live Synced with CRM Leads State) */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {/* Step 1: New Leads */}
              <div
                onClick={() => setActiveModule('leads')}
                className="bg-[#EEF5FF] p-3 rounded-2xl text-center border border-blue-100 flex flex-col items-center justify-center cursor-pointer hover:border-blue-300 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#1769D2] text-white flex items-center justify-center mb-1">
                  <UserPlus size={13} />
                </div>
                <div className="text-[11px] font-bold text-slate-600">New Leads</div>
                <div className="text-lg font-black text-[#102A50] mt-0.5">{newLeadsCount}</div>
              </div>

              {/* Step 2: Contacted */}
              <div
                onClick={() => setActiveModule('leads')}
                className="bg-sky-50 p-3 rounded-2xl text-center border border-sky-100 flex flex-col items-center justify-center cursor-pointer hover:border-sky-300 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center mb-1">
                  <Phone size={13} />
                </div>
                <div className="text-[11px] font-bold text-slate-600">Contacted</div>
                <div className="text-lg font-black text-[#102A50] mt-0.5">{contactedCount}</div>
              </div>

              {/* Step 3: Follow-up */}
              <div
                onClick={() => setActiveModule('followups')}
                className="bg-purple-50 p-3 rounded-2xl text-center border border-purple-100 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#7955D9] text-white flex items-center justify-center mb-1">
                  <Clock size={13} />
                </div>
                <div className="text-[11px] font-bold text-slate-600">Follow-up</div>
                <div className="text-lg font-black text-[#102A50] mt-0.5">{followupCount}</div>
              </div>

              {/* Step 4: Appointment */}
              <div
                onClick={() => setActiveModule('appointments')}
                className="bg-teal-50 p-3 rounded-2xl text-center border border-teal-100 flex flex-col items-center justify-center cursor-pointer hover:border-teal-300 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#12B89A] text-white flex items-center justify-center mb-1">
                  <Calendar size={13} />
                </div>
                <div className="text-[11px] font-bold text-slate-600">Appointment</div>
                <div className="text-lg font-black text-[#102A50] mt-0.5">{apptBookedCount}</div>
              </div>

              {/* Step 5: Converted */}
              <div
                onClick={() => setActiveModule('patients')}
                className="bg-emerald-50 p-3 rounded-2xl text-center border border-emerald-100 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-300 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-[#16A779] text-white flex items-center justify-center mb-1">
                  <CheckCircle2 size={13} />
                </div>
                <div className="text-[11px] font-bold text-slate-600">Converted</div>
                <div className="text-lg font-black text-[#102A50] mt-0.5">{convertedPatientsCount}</div>
              </div>
            </div>
          </div>

          {/* Dynamic Conversion Rate Pill */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center">
            <div className="px-4 py-1.5 rounded-full bg-[#EEF5FF] text-[#1769D2] font-bold text-xs flex items-center gap-1.5 shadow-xs">
              <TrendingUp size={14} />
              <span>{conversionRate}% Overall Lead Conversion Rate</span>
            </div>
          </div>
        </div>

        {/* Right: Lead Source Performance Donut (Col 5 - Matching Image 1) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-[#102A50] flex items-center gap-2">
              <Activity size={16} className="text-[#1769D2]" />
              <span>Lead Source Performance</span>
            </h2>
            <button
              onClick={() => setActiveModule('analytics')}
              className="text-xs font-bold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Report</span>
              <span>→</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            {/* SVG Donut Graphic with 248 Total Leads in center */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                {/* Google Ads (38%) */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1769D2" strokeWidth="14" strokeDasharray="90 238" strokeDashoffset="0" />
                {/* Meta Ads (32%) */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#12B89A" strokeWidth="14" strokeDasharray="76 238" strokeDashoffset="-90" />
                {/* Website (15%) */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#7955D9" strokeWidth="14" strokeDasharray="36 238" strokeDashoffset="-166" />
                {/* WhatsApp (10%) */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F28B42" strokeWidth="14" strokeDasharray="24 238" strokeDashoffset="-202" />
                {/* Others (5%) */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#64748b" strokeWidth="14" strokeDasharray="12 238" strokeDashoffset="-226" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-[#102A50] leading-none">248</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Total Leads</span>
              </div>
            </div>

            {/* Legend - Matching Image 1 */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-600 flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1769D2]"></span>
                  Google Ads
                </span>
                <span className="font-bold text-[#102A50]">38%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#12B89A]"></span>
                  Meta Ads
                </span>
                <span className="font-bold text-[#102A50]">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7955D9]"></span>
                  Website
                </span>
                <span className="font-bold text-[#102A50]">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F28B42]"></span>
                  WhatsApp
                </span>
                <span className="font-bold text-[#102A50]">10%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  Others
                </span>
                <span className="font-bold text-[#102A50]">5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Today's Follow-ups + Recent Leads + Promo Tile (Matching Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Follow-ups (Col 4 - Matching Image 1) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#102A50] flex items-center gap-2">
                <Clock size={16} className="text-[#1769D2]" />
                <span>Today's Follow-ups</span>
              </h2>
              <button
                onClick={() => setActiveModule('followups')}
                className="text-xs font-bold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Item 1: Sneha R - Call for Implant Treatment */}
              <div className="p-3 rounded-2xl bg-[#F8FAFC] hover:bg-[#EEF5FF] border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1769D2] flex items-center justify-center font-black text-xs">
                    S
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#102A50]">Sneha R</div>
                    <div className="text-[11px] text-slate-500">Call for Implant Treatment</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">10:30 AM</span>
                  <a
                    href="tel:9843088771"
                    className="w-7 h-7 rounded-xl bg-blue-50 text-[#1769D2] hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Phone size={13} />
                  </a>
                </div>
              </div>

              {/* Item 2: Rajesh Kumar - Share Treatment Plan */}
              <div className="p-3 rounded-2xl bg-[#F8FAFC] hover:bg-emerald-50 border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#102A50]">Rajesh Kumar</div>
                    <div className="text-[11px] text-slate-500">Share Treatment Plan</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">11:15 AM</span>
                  <button
                    onClick={() => setActiveModule('whatsapp')}
                    className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
              </div>

              {/* Item 3: Priya M - Confirm Appointment */}
              <div className="p-3 rounded-2xl bg-[#F8FAFC] hover:bg-purple-50 border border-slate-100 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-[#7955D9] flex items-center justify-center font-black text-xs">
                    P
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#102A50]">Priya M</div>
                    <div className="text-[11px] text-slate-500">Confirm Appointment</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">12:00 PM</span>
                  <button
                    onClick={() => setIsBookCheckInOpen(true)}
                    className="w-7 h-7 rounded-xl bg-purple-50 text-[#7955D9] hover:bg-purple-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Calendar size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leads (Col 5 - Matching Image 1) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-[#102A50] flex items-center gap-2">
                <Users size={16} className="text-[#1769D2]" />
                <span>Recent Leads</span>
              </h2>
              <button
                onClick={() => setActiveModule('leads')}
                className="text-xs font-bold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>

            {/* Table layout matching Image 1: Name, Source, Status, Date */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="pb-2 font-bold">Name</th>
                    <th className="pb-2 font-bold">Source</th>
                    <th className="pb-2 font-bold">Status</th>
                    <th className="pb-2 font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Arun Kumar */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-[#102A50]">Arun Kumar</td>
                    <td className="py-2.5 text-slate-600 flex items-center gap-1">
                      <span className="text-rose-500 font-bold">G</span> Google Ads
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-[#1769D2]">
                        New
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">Today, 09:45 AM</td>
                  </tr>

                  {/* Divya S */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-[#102A50]">Divya S</td>
                    <td className="py-2.5 text-slate-600 flex items-center gap-1">
                      <span className="text-emerald-500 font-bold">W</span> WhatsApp
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Contacted
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">Today, 09:20 AM</td>
                  </tr>

                  {/* Vikram Raj */}
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 font-bold text-[#102A50]">Vikram Raj</td>
                    <td className="py-2.5 text-slate-600 flex items-center gap-1">
                      <span className="text-blue-500 font-bold">M</span> Meta Ads
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                        Follow-up
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">Today, 08:50 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Promo / Feature Card: Capture More Dental Leads (Col 3 - Matching Image 1) */}
        <div className="lg:col-span-3 rounded-3xl bg-gradient-to-br from-[#EEF5FF] via-[#E0EEFF] to-[#D5E6FF] p-6 border border-blue-200/80 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-[#1769D2] text-white flex items-center justify-center mb-3 shadow-md">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4.5C10.2 3.2 7.8 2.5 5.5 3.2C3.2 3.9 2 6 2 8.8C2 12.2 3.3 15.2 4.8 18.2C5.6 19.8 7.2 21 8.8 20.2C10.2 19.5 10.8 17.5 11.2 15.5C11.5 14.2 11.7 13.2 12 13.2C12.3 13.2 12.5 14.2 12.8 15.5C13.2 17.5 13.8 19.5 15.2 20.2C16.8 21 18.4 19.8 19.2 18.2C20.7 15.2 22 12.2 22 8.8C22 6 20.8 3.9 18.5 3.2C16.2 2.5 13.8 3.2 12 4.5Z" />
              </svg>
            </div>
            <h3 className="text-sm font-extrabold text-[#102A50] leading-snug">
              Capture More Dental Leads
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Automate your follow-ups, recall reminders, and convert enquiries into patient smiles.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button
              onClick={() => setActiveModule('whatsapp')}
              className="w-full py-2.5 bg-[#092C60] hover:bg-[#102A50] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Explore Campaigns</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
