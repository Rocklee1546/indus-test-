import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
  Receipt,
  BarChart3,
  PieChart,
  Settings,
  ArrowRight,
  ShieldCheck,
  Star
} from 'lucide-react';

// ── 3-Person Team Group Icon for Total Leads ─────────────────────────────
function ThreeUsersIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Center Figure (Front) */}
      <circle cx="12" cy="6.5" r="3" />
      <path d="M12 11c-2.8 0-5.2 1.5-5.8 4-.1.6.4 1.1 1 1.1h9.6c.6 0 1.1-.5 1-1.1-.6-2.5-3-4-5.8-4z" />
      {/* Left Figure */}
      <circle cx="5" cy="8.5" r="2.2" opacity="0.9" />
      <path d="M5 12.2c-1.8 0-3.4 1-3.8 2.6-.1.5.3.8.8.8h2.6c-.1-.4-.2-.8-.2-1.2 0-1 .3-1.8.9-2.5-.1.1-.2.2-.3.3z" opacity="0.9" />
      {/* Right Figure */}
      <circle cx="19" cy="8.5" r="2.2" opacity="0.9" />
      <path d="M19 12.2c.1 0 .2 0 .3-.3.6.7.9 1.5.9 2.5 0 .4-.1.8-.2 1.2h2.6c.5 0 .9-.3.8-.8-.4-1.6-2-2.6-3.8-2.6h-.6z" opacity="0.9" />
    </svg>
  );
}

// ── High-Quality 3D Molar Tooth Illustration with Blue Checkmark Shield ─────────
function MolarToothWithShield({ className = "w-18 h-24" }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 drop-shadow-md select-none pointer-events-none ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="molarBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#F5F9FF" />
            <stop offset="75%" stopColor="#D8EBFE" />
            <stop offset="100%" stopColor="#B3D7FE" />
          </linearGradient>
          <radialGradient id="molarHighlight" cx="32%" cy="18%" r="42%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="shieldGlossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#258BF5" />
            <stop offset="50%" stopColor="#1769D2" />
            <stop offset="100%" stopColor="#0B4699" />
          </linearGradient>
          <filter id="molarShieldShadow" x="-25%" y="-20%" width="150%" height="150%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#092C60" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* Anatomical Molar Crown and Dual Root Structure */}
        <path
          d="M 50 12 
             C 38 6, 18 8, 13 24 
             C 7 40, 9 58, 17 72 
             C 23 84, 27 100, 31 114 
             C 32 118, 38 119, 41 115 
             C 45 107, 47 92, 50 82 
             C 53 92, 55 107, 59 115 
             C 62 119, 68 118, 69 114 
             C 73 100, 77 84, 83 72 
             C 91 58, 93 40, 87 24 
             C 82 8, 62 6, 50 12 Z"
          fill="url(#molarBodyGrad)"
          stroke="#EBF3FE"
          strokeWidth="1.5"
        />

        {/* Glossy Specular Light Overlay */}
        <path
          d="M 50 12 
             C 38 6, 18 8, 13 24 
             C 7 40, 9 58, 17 72 
             C 23 84, 27 100, 31 114 
             C 32 118, 38 119, 41 115 
             C 45 107, 47 92, 50 82 
             C 53 92, 55 107, 59 115 
             C 62 119, 68 118, 69 114 
             C 73 100, 77 84, 83 72 
             C 91 58, 93 40, 87 24 
             C 82 8, 62 6, 50 12 Z"
          fill="url(#molarHighlight)"
        />

        {/* Top Left & Right Cusp Contours */}
        <ellipse cx="31" cy="22" rx="14" ry="10" fill="#FFFFFF" fillOpacity="0.55" />
        <ellipse cx="69" cy="22" rx="14" ry="10" fill="#FFFFFF" fillOpacity="0.35" />

        {/* 3D Blue Shield with Crisp White Checkmark */}
        <g filter="url(#molarShieldShadow)">
          <path
            d="M 50 38 
               L 67 44 
               C 67 61, 59 74, 50 81 
               C 41 74, 33 61, 33 44 
               Z"
            fill="url(#shieldGlossGrad)"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
          <path
            d="M 43 59 L 48 64 L 59 51"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}

// ── Second 3D Molar Tooth on Far Right Background (Matching Reference) ─────────
function BackgroundMolarTooth({ className = "w-18 h-24" }) {
  return (
    <div className={`relative shrink-0 select-none pointer-events-none drop-shadow-sm ${className}`}>
      <svg viewBox="0 0 100 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bgMolarGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
            <stop offset="45%" stopColor="#F5F9FF" stopOpacity="0.92" />
            <stop offset="85%" stopColor="#DCEBFE" stopOpacity="0.82" />
            <stop offset="100%" stopColor="#BEDBFE" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="bgMolarLight" cx="30%" cy="18%" r="45%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M 50 12 
             C 38 6, 18 8, 13 24 
             C 7 40, 9 58, 17 72 
             C 23 84, 27 100, 31 114 
             C 32 118, 38 119, 41 115 
             C 45 107, 47 92, 50 82 
             C 53 92, 55 107, 59 115 
             C 62 119, 68 118, 69 114 
             C 73 100, 77 84, 83 72 
             C 91 58, 93 40, 87 24 
             C 82 8, 62 6, 50 12 Z"
          fill="url(#bgMolarGrad)"
          stroke="#EBF3FE"
          strokeWidth="1.2"
        />
        <path
          d="M 50 12 
             C 38 6, 18 8, 13 24 
             C 7 40, 9 58, 17 72 
             C 23 84, 27 100, 31 114 
             C 32 118, 38 119, 41 115 
             C 45 107, 47 92, 50 82 
             C 53 92, 55 107, 59 115 
             C 62 119, 68 118, 69 114 
             C 73 100, 77 84, 83 72 
             C 91 58, 93 40, 87 24 
             C 82 8, 62 6, 50 12 Z"
          fill="url(#bgMolarLight)"
        />
        <ellipse cx="31" cy="22" rx="14" ry="10" fill="#FFFFFF" fillOpacity="0.5" />
        <ellipse cx="69" cy="22" rx="14" ry="10" fill="#FFFFFF" fillOpacity="0.3" />
      </svg>
    </div>
  );
}

// ── Welcome Banner ──────────────────────────────────────────────────────────
function WelcomeBanner() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xs border border-blue-100/50"
      style={{
        boxShadow: '0 2px 12px 0 rgba(23,105,210,0.08)',
      }}
    >
      <img
        src="/indus-welcome-banner.jpg"
        alt="Welcome to INDUS Dental – Your Healthy Smile, Our Priority"
        className="w-full h-auto block"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
        }}
        draggable={false}
      />
    </div>
  );
}

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
    treatments,
    enabledTreatments,
    setActiveModule,
    setSettingsTab,
    setLeadStatusFilter,
    setIsAddPatientOpen,
    setIsBookCheckInOpen,
    setIsAddLeadOpen
  } = useApp();

  const [chartViewMode, setChartViewMode] = useState('bars'); // 'bars' | 'donut'
  const [activeMetricTab, setActiveMetricTab] = useState('all'); // 'all' | 'enquiries' | 'appointments' | 'converted'

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

  // ── Live: Treatment Based Performance (Synchronized directly with Settings) ──────────
  const treatmentStats = useMemo(() => {
    // Single source of truth: enabledTreatments from Settings
    // Dental Implants (#1) and Clear Aligners (#2) are prioritized first
    const catalog = enabledTreatments && enabledTreatments.length > 0 
      ? enabledTreatments 
      : (treatments || []).filter(t => t.enabled !== false);

    return catalog.map(t => {
      const tNameLower = (t.name || '').toLowerCase();
      // Calculate matching active leads
      const matchingLeads = activeLeads.filter(l => {
        if (!l.treatment) return false;
        const lNameLower = l.treatment.toLowerCase();
        return lNameLower === tNameLower || lNameLower.includes(tNameLower) || tNameLower.includes(lNameLower);
      });

      const enquiries = matchingLeads.length;
      const apptLeads = matchingLeads.filter(l => l.status === 'Appointment Booked' || l.status === 'Converted to Patient').length;
      
      // Also match appointments
      const matchingAppts = appointments.filter(a => {
        if (a.status === 'Cancelled' || !a.treatmentType) return false;
        const aNameLower = a.treatmentType.toLowerCase();
        return aNameLower === tNameLower || aNameLower.includes(tNameLower) || tNameLower.includes(aNameLower);
      }).length;

      const appointmentsCount = Math.max(apptLeads, matchingAppts);
      const converted = matchingLeads.filter(l => l.status === 'Converted to Patient').length;
      const conversionRate = enquiries > 0 ? Math.round((converted / enquiries) * 100) : 0;

      return {
        id: t.id,
        name: t.name,
        category: t.category || 'General Dentistry',
        enquiries,
        appointments: appointmentsCount,
        converted,
        conversionRate
      };
    });
  }, [enabledTreatments, treatments, activeLeads, appointments]);

  // ── Live: Today's Follow-ups (linked to valid records, pending, today) ─────
  const todaysFollowups = useMemo(() => {
    const todayStr = (() => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    })();
    return followups
      .filter(f => {
        if (f.status === 'Completed' || f.status === 'Cancelled') return false;
        const fDate = (f.scheduledDate || f.dueDate || f.date || '').substring(0, 10);
        if (fDate !== todayStr) return false;
        if (f.leadId) return leads.some(l => l.id === f.leadId && !l.isDeleted);
        if (f.patientId) return patients.some(p => p.id === f.patientId && !p.isDeleted && !p.isArchived);
        return false;
      })
      .slice(0, 3)
      .map(f => {
        // Resolve name from registry to handle stale targetName
        let resolvedName = f.targetName || '';
        let resolvedPhone = f.phone || '';
        if (f.leadId) {
          const lead = leads.find(l => l.id === f.leadId);
          if (lead) { resolvedName = lead.name || resolvedName; resolvedPhone = lead.phone || resolvedPhone; }
        }
        if (f.patientId) {
          const patient = patients.find(p => p.id === f.patientId);
          if (patient) { resolvedName = patient.name || resolvedName; resolvedPhone = patient.phone || resolvedPhone; }
        }
        return { ...f, targetName: resolvedName, phone: resolvedPhone };
      });
  }, [followups, leads, patients]);

  // ── Live: Recent Leads (3 most recent by createdAt/date) ───────────────────
  const recentLeads = useMemo(() => {
    return [...activeLeads]
      .sort((a, b) => {
        const da = new Date(a.createdAt || a.date || 0).getTime();
        const db = new Date(b.createdAt || b.date || 0).getTime();
        return db - da;
      })
      .slice(0, 3);
  }, [activeLeads]);

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* 1. Welcome Banner (1536:191, 8.04:1 aspect ratio) */}
      <WelcomeBanner />

      {/* 2. Top Metric Cards – 6 Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Total Leads */}
        <div
          onClick={() => setActiveModule('leads')}
          className="bg-white rounded-2xl p-3.5 pb-2 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#1769D2] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 ring-2 ring-blue-200/80">
              <ThreeUsersIcon className="w-5 h-5 text-white" />
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
            <div className="w-10 h-10 rounded-full bg-teal-50 text-[#12B89A] border border-teal-200 flex items-center justify-center shrink-0 shadow-xs ring-2 ring-teal-100">
              <Star size={18} className="fill-[#12B89A] text-[#12B89A]" />
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

      {/* 3. Middle Row: Lead Pipeline & Treatment Based Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Creative Interactive Lead Pipeline Journey (Col 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1769D2] flex items-center justify-center shadow-2xs">
                <TrendingUp size={16} />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-[#102A50] tracking-tight flex items-center gap-2">
                  <span>Lead Pipeline</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-50 text-[#1769D2]">
                    Interactive Journey
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Click any stage to filter and manage patient enquiries
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (setLeadStatusFilter) setLeadStatusFilter('ALL');
                setActiveModule('leads');
              }}
              className="text-xs font-bold text-[#1769D2] hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer group"
            >
              <span>View Details</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </button>
          </div>

          {/* Interactive Lead Journey Flow */}
          <div className="relative py-2">
            {/* Background Journey Path Rail (Connecting line spanning all 5 stages) */}
            <div className="hidden sm:block absolute top-[34px] left-6 right-6 h-1 bg-gradient-to-r from-[#1769D2] via-[#7C3AED] to-[#10B981] rounded-full opacity-20 pointer-events-none" />

            {/* Stages Track */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5 relative z-10">
              {[
                {
                  id: 'new',
                  statusKey: 'New',
                  step: '01',
                  name: 'New Leads',
                  count: newLeadsCount,
                  color: '#1769D2',
                  bg: '#EBF4FF',
                  border: '#BFDBFE',
                  ring: 'rgba(23, 105, 210, 0.25)',
                  icon: UserPlus,
                  tag: 'Fresh'
                },
                {
                  id: 'contacted',
                  statusKey: 'Contacted',
                  step: '02',
                  name: 'Contacted',
                  count: contactedCount,
                  color: '#0284C7',
                  bg: '#F0F9FF',
                  border: '#BAE6FD',
                  ring: 'rgba(2, 132, 199, 0.25)',
                  icon: Phone,
                  tag: 'Engaged'
                },
                {
                  id: 'followup',
                  statusKey: 'Follow-up Required',
                  step: '03',
                  name: 'Follow-up',
                  count: followupCount,
                  color: '#7C3AED',
                  bg: '#F5F3FF',
                  border: '#DDD6FE',
                  ring: 'rgba(124, 58, 237, 0.25)',
                  icon: Clock,
                  tag: 'Recall'
                },
                {
                  id: 'appointment',
                  statusKey: 'Appointment Booked',
                  step: '04',
                  name: 'Appointment',
                  count: apptBookedCount,
                  color: '#0D9488',
                  bg: '#F0FDFA',
                  border: '#99F6E4',
                  ring: 'rgba(13, 148, 136, 0.25)',
                  icon: Calendar,
                  tag: 'Booked'
                },
                {
                  id: 'converted',
                  statusKey: 'Converted to Patient',
                  step: '05',
                  name: 'Converted',
                  count: convertedPatientsCount,
                  color: '#10B981',
                  bg: '#ECFDF5',
                  border: '#A7F3D0',
                  ring: 'rgba(16, 185, 129, 0.25)',
                  icon: CheckCircle2,
                  tag: 'Patient'
                }
              ].map((stage, idx, arr) => {
                const Icon = stage.icon;
                const isLast = idx === arr.length - 1;
                return (
                  <div key={stage.id} className="relative flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (setLeadStatusFilter) setLeadStatusFilter(stage.statusKey);
                        setActiveModule('leads');
                      }}
                      className="w-full group text-left rounded-2xl p-2 sm:p-2.5 transition-all duration-300 cursor-pointer flex flex-col items-center border hover:-translate-y-1"
                      style={{
                        backgroundColor: stage.bg,
                        borderColor: stage.border
                      }}
                      title={`Click to filter leads by: ${stage.name}`}
                    >
                      {/* Milestone Icon Node with Step Badge */}
                      <div className="relative mb-2">
                        <div
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110"
                          style={{
                            backgroundColor: stage.color,
                            boxShadow: `0 4px 12px ${stage.ring}`
                          }}
                        >
                          <Icon size={15} />
                        </div>
                        {/* Step Pill */}
                        <span
                          className="absolute -top-1.5 -right-1.5 text-[8px] font-black px-1 py-0.2 rounded-full bg-white text-slate-700 shadow-2xs border border-slate-200"
                        >
                          {stage.step}
                        </span>
                      </div>

                      {/* Stage Name */}
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-slate-700 truncate w-full text-center">
                        {stage.name}
                      </span>

                      {/* Count Display */}
                      <div className="text-lg sm:text-2xl font-black text-[#102A50] mt-0.5 leading-none">
                        {stage.count}
                      </div>

                      {/* Subtle status tag */}
                      <span
                        className="text-[9px] font-bold mt-1 px-1.5 py-0.2 rounded-full uppercase tracking-wider"
                        style={{ color: stage.color }}
                      >
                        {stage.tag}
                      </span>
                    </button>

                    {/* Connecting Directional Arrow between stages (Desktop/Tablet) */}
                    {!isLast && (
                      <div className="hidden sm:flex absolute -right-2 top-[34px] -translate-y-1/2 z-20 pointer-events-none">
                        <div className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-2xs text-slate-400">
                          <ArrowRight size={10} className="stroke-[2.5]" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Redesigned Overall Lead Conversion Rate Area */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Progress Ring + Headline */}
            <div className="flex items-center gap-3">
              {/* Compact SVG Progress Ring */}
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="#F1F5F9"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="url(#convGrad)"
                    strokeWidth="3.5"
                    strokeDasharray={2 * Math.PI * 16}
                    strokeDashoffset={2 * Math.PI * 16 * (1 - (conversionRate / 100))}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  <defs>
                    <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1769D2" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-[#102A50]">
                  {conversionRate}%
                </div>
              </div>

              <div>
                <div className="text-xs font-black text-[#102A50] flex items-center gap-1.5">
                  <span>Overall Lead Conversion Rate</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {convertedPatientsCount} of {totalLeads} registered enquiries converted to clinical patients
                </p>
              </div>
            </div>

            {/* Right: Slim Progress Bar Indicator */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="w-24 sm:w-32 h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 relative">
                <div
                  className="h-full bg-gradient-to-r from-[#1769D2] to-[#10B981] rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(conversionRate, 5)}%` }}
                />
              </div>
              <button
                onClick={() => {
                  if (setLeadStatusFilter) setLeadStatusFilter('Converted to Patient');
                  setActiveModule('leads');
                }}
                className="text-[11px] font-extrabold text-[#10B981] hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
              >
                <span>{convertedPatientsCount} Converted</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Treatment Based Performance (Col 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#1769D2] to-[#12B89A] text-white flex items-center justify-center shadow-xs">
                  <Sparkles size={14} />
                </div>
                <h2 className="text-sm font-extrabold text-[#102A50]">
                  Treatment Based Performance
                </h2>
              </div>

              {/* View Mode Toggle & Settings Shortcut */}
              <div className="flex items-center gap-1.5">
                <div className="bg-slate-100 p-0.5 rounded-xl flex items-center gap-0.5 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setChartViewMode('bars')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      chartViewMode === 'bars'
                        ? 'bg-white text-[#1769D2] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Comparative Grouped Bars"
                  >
                    <BarChart3 size={13} />
                    <span>Bars</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartViewMode('donut')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      chartViewMode === 'donut'
                        ? 'bg-white text-[#1769D2] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Donut Mix"
                  >
                    <PieChart size={13} />
                    <span>Donut</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (setSettingsTab) setSettingsTab('treatments');
                    setActiveModule('settings');
                  }}
                  className="p-1 rounded-xl text-slate-400 hover:text-[#1769D2] hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Configure Treatments in Settings"
                >
                  <Settings size={15} />
                </button>
              </div>
            </div>

            {/* Clean Legend Bar / Filter */}
            <div className="flex items-center justify-between mb-2 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveMetricTab(activeMetricTab === 'enquiries' ? 'all' : 'enquiries')}
                  className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer text-[10px] font-bold ${
                    activeMetricTab === 'enquiries'
                      ? 'bg-blue-50 text-[#1769D2] ring-1 ring-[#1769D2]/30'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#1769D2]"></span>
                  <span>Enquiries</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetricTab(activeMetricTab === 'appointments' ? 'all' : 'appointments')}
                  className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer text-[10px] font-bold ${
                    activeMetricTab === 'appointments'
                      ? 'bg-teal-50 text-[#12B89A] ring-1 ring-[#12B89A]/30'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#12B89A]"></span>
                  <span>Appointments</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMetricTab(activeMetricTab === 'converted' ? 'all' : 'converted')}
                  className={`px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer text-[10px] font-bold ${
                    activeMetricTab === 'converted'
                      ? 'bg-emerald-50 text-[#16A779] ring-1 ring-[#16A779]/30'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#16A779]"></span>
                  <span>Converted</span>
                </button>
              </div>

              {activeMetricTab !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveMetricTab('all')}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer underline"
                >
                  Show all
                </button>
              )}
            </div>

            {/* CHART CONTENT - Fixed Height: 195px for seamless switching */}
            {chartViewMode === 'bars' ? (
              /* Compact Grouped Bars */
              <div className="h-[195px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {treatmentStats.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No enabled treatments found. Configure treatments in Settings &gt; Treatment Management.
                  </div>
                ) : (
                  treatmentStats.map((t, idx) => {
                    const maxVal = Math.max(...treatmentStats.map(item => Math.max(item.enquiries, item.appointments, item.converted, 1)));
                    const enqWidth = Math.round((t.enquiries / maxVal) * 100);
                    const apptWidth = Math.round((t.appointments / maxVal) * 100);
                    const convWidth = Math.round((t.converted / maxVal) * 100);

                    return (
                      <div
                        key={t.id}
                        className="p-1.5 px-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100/90 hover:border-slate-200 hover:bg-slate-50/80 transition-all"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[10px] font-black text-slate-400 w-3.5">{idx + 1}.</span>
                            <span className="font-extrabold text-[#102A50] text-[11px] truncate">{t.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold shrink-0">
                            {t.conversionRate > 0 && (
                              <span className="text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-extrabold text-[9px]">
                                {t.conversionRate}%
                              </span>
                            )}
                            <span className="text-[#1769D2] font-semibold">{t.enquiries} enq</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[#12B89A] font-semibold">{t.appointments} appt</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-[#16A779] font-semibold">{t.converted} conv</span>
                          </div>
                        </div>

                        {/* Visual Progress Tracks */}
                        {activeMetricTab === 'all' ? (
                          <div className="grid grid-cols-3 gap-1.5">
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-[#1769D2] rounded-full transition-all duration-300" style={{ width: `${Math.max(enqWidth, t.enquiries > 0 ? 12 : 0)}%` }} />
                              </div>
                              <span className="text-[9px] font-bold text-[#1769D2] w-2.5 text-right">{t.enquiries}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-[#12B89A] rounded-full transition-all duration-300" style={{ width: `${Math.max(apptWidth, t.appointments > 0 ? 12 : 0)}%` }} />
                              </div>
                              <span className="text-[9px] font-bold text-[#12B89A] w-2.5 text-right">{t.appointments}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex-1 bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full bg-[#16A779] rounded-full transition-all duration-300" style={{ width: `${Math.max(convWidth, t.converted > 0 ? 12 : 0)}%` }} />
                              </div>
                              <span className="text-[9px] font-bold text-[#16A779] w-2.5 text-right">{t.converted}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="flex-1 bg-slate-200/60 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  activeMetricTab === 'enquiries' ? 'bg-[#1769D2]' :
                                  activeMetricTab === 'appointments' ? 'bg-[#12B89A]' : 'bg-[#16A779]'
                                }`}
                                style={{
                                  width: `${Math.max(
                                    activeMetricTab === 'enquiries' ? enqWidth :
                                    activeMetricTab === 'appointments' ? apptWidth : convWidth,
                                    (activeMetricTab === 'enquiries' ? t.enquiries : activeMetricTab === 'appointments' ? t.appointments : t.converted) > 0 ? 10 : 0
                                  )}%`
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-extrabold text-[#102A50] w-3 text-right">
                              {activeMetricTab === 'enquiries' ? t.enquiries :
                               activeMetricTab === 'appointments' ? t.appointments : t.converted}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              /* Donut Visualization - Exact 195px height, centered vertically and horizontally */
              <div className="h-[195px] flex items-center justify-center gap-4 px-2">
                <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                    {(() => {
                      const totalEnquiries = Math.max(treatmentStats.reduce((sum, item) => sum + item.enquiries, 0), 1);
                      const colors = ['#1769D2', '#12B89A', '#7955D9', '#F28B42', '#092C60', '#64748b'];
                      const circumference = 2 * Math.PI * 38; // ~238.76
                      let accumulatedOffset = 0;

                      return treatmentStats.slice(0, 6).map((t, idx) => {
                        if (t.enquiries === 0) return null;
                        const sliceLength = (t.enquiries / totalEnquiries) * circumference;
                        const strokeDasharray = `${sliceLength} ${circumference - sliceLength}`;
                        const strokeDashoffset = -accumulatedOffset;
                        accumulatedOffset += sliceLength;
                        const color = colors[idx % colors.length];

                        return (
                          <circle
                            key={t.id}
                            cx="50"
                            cy="50"
                            r="38"
                            fill="none"
                            stroke={color}
                            strokeWidth="12"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-500"
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                    <span className="text-lg font-black text-[#102A50] leading-none">
                      {treatmentStats.reduce((sum, t) => sum + t.enquiries, 0)}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Enquiries</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-1 text-xs font-semibold text-slate-600 flex-1 max-h-[175px] overflow-y-auto pr-1 scrollbar-thin">
                  {treatmentStats.map((t, idx) => {
                    const colors = ['#1769D2', '#12B89A', '#7955D9', '#F28B42', '#092C60', '#64748b'];
                    const color = colors[idx % colors.length];
                    const totalEnquiries = Math.max(treatmentStats.reduce((sum, item) => sum + item.enquiries, 0), 1);
                    const pct = Math.round((t.enquiries / totalEnquiries) * 100);

                    return (
                      <div key={t.id} className="flex items-center justify-between gap-1.5 py-0.5 px-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                          <span className="truncate text-[11px] font-medium text-slate-700">{t.name}</span>
                        </span>
                        <span className="font-bold text-[#102A50] text-right shrink-0 text-[11px]">
                          {t.enquiries} <span className="text-[9px] text-slate-400 font-normal">({pct}%)</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end text-xs mt-2">
            <button
              onClick={() => {
                if (setSettingsTab) setSettingsTab('treatments');
                setActiveModule('settings');
              }}
              className="font-bold text-[#1769D2] hover:underline flex items-center gap-1 cursor-pointer text-xs"
            >
              <span>Manage in Settings</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Row: Today's Follow-ups + Recent Leads + Promo Tile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Follow-ups (Col 4) */}
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
              {todaysFollowups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                    <Clock size={18} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-bold text-slate-500">No follow-ups due today</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">All caught up!</p>
                </div>
              ) : (
                todaysFollowups.map((f) => {
                  const name = f.targetName || f.patientName || f.leadName || 'Unknown';
                  const initials = name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
                  const avatarColors = [
                    ['bg-blue-100 text-[#1769D2]', 'hover:bg-[#EEF5FF]'],
                    ['bg-emerald-100 text-emerald-700', 'hover:bg-emerald-50'],
                    ['bg-purple-100 text-[#7955D9]', 'hover:bg-purple-50'],
                    ['bg-orange-100 text-orange-700', 'hover:bg-orange-50'],
                    ['bg-teal-100 text-teal-700', 'hover:bg-teal-50'],
                  ];
                  const colorPair = avatarColors[Math.abs(name.charCodeAt(0)) % avatarColors.length];
                  const timeLabel = f.scheduledTime || '';
                  const reason = f.category || f.type || f.notes || 'Follow-up';
                  const phone = f.phone || '';
                  const isWhatsApp = f.channel === 'WhatsApp' || f.preferredContact === 'WhatsApp';
                  return (
                    <div
                      key={f.id}
                      className={`p-3 rounded-2xl bg-[#F8FAFC] ${colorPair[1]} border border-slate-100 flex items-center justify-between transition-colors`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${colorPair[0]} flex items-center justify-center font-black text-xs shrink-0`}>
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-[#102A50] truncate">{name}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[130px]">{reason}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {timeLabel && <span className="text-[11px] font-bold text-slate-400">{timeLabel}</span>}
                        {isWhatsApp ? (
                          <button
                            onClick={() => setActiveModule('whatsapp')}
                            className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <MessageSquare size={13} />
                          </button>
                        ) : phone ? (
                          <a
                            href={`tel:${phone}`}
                            className="w-7 h-7 rounded-xl bg-blue-50 text-[#1769D2] hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Phone size={13} />
                          </a>
                        ) : (
                          <button
                            onClick={() => setActiveModule('followups')}
                            className="w-7 h-7 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Calendar size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Recent Leads (Col 5) */}
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

            {/* Table layout: Name, Source, Status, Date */}
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
                  {recentLeads.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400 text-xs">No leads yet. Add your first lead!</td>
                    </tr>
                  ) : (
                    recentLeads.map((lead) => {
                      const src = lead.source || '';
                      const srcIcon = src === 'Meta Ads' ? { letter: 'M', color: 'text-blue-500' }
                        : src === 'Walk In' ? { letter: 'W', color: 'text-indigo-600' }
                        : src === 'WhatsApp' ? { letter: 'W', color: 'text-emerald-500' }
                        : src === 'Referral' ? { letter: 'R', color: 'text-amber-500' }
                        : src === 'Google Ads' ? { letter: 'G', color: 'text-rose-500' }
                        : src === 'Website' ? { letter: 'W', color: 'text-blue-500' }
                        : { letter: src.charAt(0).toUpperCase(), color: 'text-slate-500' };
                      const statusStyle = lead.status === 'New'
                        ? 'bg-blue-100 text-[#1769D2]'
                        : lead.status === 'Contacted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : lead.status === 'Follow-up Required'
                        ? 'bg-orange-100 text-orange-800'
                        : lead.status === 'Appointment Booked'
                        ? 'bg-purple-100 text-purple-800'
                        : lead.status === 'Converted to Patient'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-slate-100 text-slate-600';
                      const statusLabel = lead.status === 'Follow-up Required' ? 'Follow-up'
                        : lead.status === 'Converted to Patient' ? 'Converted'
                        : lead.status === 'Appointment Booked' ? 'Appt Booked'
                        : lead.status || 'New';
                      const dateStr = lead.createdAt || lead.date || '';
                      let displayDate = dateStr;
                      if (dateStr) {
                        try {
                          const d = new Date(dateStr);
                          const today = new Date();
                          const isToday = d.toDateString() === today.toDateString();
                          displayDate = isToday
                            ? `Today, ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
                            : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                        } catch {}
                      }
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 font-bold text-[#102A50] truncate max-w-[80px]">{lead.name}</td>
                          <td className="py-2.5 text-slate-600">
                            <span className="flex items-center gap-1">
                              <span className={`font-bold ${srcIcon.color}`}>{srcIcon.letter}</span>
                              <span className="truncate max-w-[70px]">{src}</span>
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusStyle}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td className="py-2.5 text-slate-400 text-[11px] whitespace-nowrap">{displayDate}</td>
                        </tr>
                      );
                    })
                  )}
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
