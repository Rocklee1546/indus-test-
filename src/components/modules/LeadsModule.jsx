import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Star,
  XCircle,
  MoreVertical,
  UserCheck,
  CalendarPlus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Trash2,
  Download,
  CalendarRange,
  X,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import {
  QUICK_DATE_OPTIONS,
  parseLeadDateToYMD,
  computeQuickDateRange,
  isDateWithinRange
} from '../../utils/dateFilterUtils';

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

// ── Official Platform Brand Icons for Lead Sources ────────────────────────
function MetaIcon({ className = "w-3.5 h-3.5 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="Meta Ads">
      <path
        d="M23.998 12c0-3.95-2.07-6.5-5.22-6.5-2.28 0-4.04 1.35-5.28 3.32-1.24-1.97-3-3.32-5.28-3.32-3.15 0-5.22 2.55-5.22 6.5 0 4.15 2.65 8.5 6.64 11.51 1.25.94 2.58 1.49 3.86 1.49 1.28 0 2.61-.55 3.86-1.49 3.99-3.01 6.64-7.36 6.64-11.51zm-10.4 4.54c-.95 1.54-2.12 2.54-3.35 2.54-1.6 0-2.65-1.58-2.65-4.14 0-2.3 1.05-3.88 2.65-3.88 1.23 0 2.4 1 3.35 2.54v2.94zm2.8 0v-2.94c.95-1.54 2.12-2.54 3.35-2.54 1.6 0 2.65 1.58 2.65 3.88 0 2.56-1.05 4.14-2.65 4.14-1.23 0-2.4-1-3.35-2.54z"
        fill="#0668E1"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-3.5 h-3.5 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" title="WhatsApp">
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        d="M17.2 14.3c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.18-1.34-.8-.72-1.35-1.6-1.51-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.19-.52-.33z"
        fill="white"
      />
    </svg>
  );
}

function GoogleAdsIcon({ className = "w-3.5 h-3.5 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" title="Google Ads">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );
}

function WebsiteIcon({ className = "w-3.5 h-3.5 shrink-0" }) {
  return (
    <div className="w-3.5 h-3.5 rounded-full bg-blue-100 text-[#1670E8] flex items-center justify-center shrink-0" title="Website">
      <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    </div>
  );
}

function WalkInIcon({ className = "w-3.5 h-3.5 shrink-0" }) {
  return (
    <div className="w-3.5 h-3.5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs" title="Walk In">
      <svg className="w-2 h-2" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="4" r="3" />
        <path d="M14.5 9.5 16 8l3 3-1.5 1.5-2-2-1 3.5 2.5 4-1.7 1-2.8-4.5-.5-2.5-2 2V19h-2v-6.5l3.5-3.5 1 .5Z" />
      </svg>
    </div>
  );
}

function ReferralIcon({ className = "w-3.5 h-3.5 shrink-0" }) {
  return (
    <div className="w-3.5 h-3.5 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs" title="Referral">
      <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  );
}

function LeadSourceBadge({ source }) {
  const s = (source || '').trim();
  const sLower = s.toLowerCase();

  let icon = null;
  let label = s;

  if (sLower.includes('meta') || sLower.includes('facebook') || sLower.includes('fb') || sLower.includes('instagram')) {
    icon = <MetaIcon className="w-3.5 h-3.5 shrink-0" />;
    label = s || 'Meta Ads';
  } else if (sLower.includes('whatsapp') || sLower.includes('wa')) {
    icon = <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />;
    label = s || 'WhatsApp';
  } else if (sLower.includes('google')) {
    icon = <GoogleAdsIcon className="w-3.5 h-3.5 shrink-0" />;
    label = s || 'Google Ads';
  } else if (sLower.includes('website') || sLower.includes('web')) {
    icon = <WebsiteIcon className="w-3.5 h-3.5 shrink-0" />;
    label = s || 'Website';
  } else if (sLower.includes('walk')) {
    icon = <WalkInIcon className="w-3.5 h-3.5 shrink-0" />;
    label = s || 'Walk In';
  } else if (sLower.includes('referral') || sLower.includes('doctor')) {
    icon = <ReferralIcon className="w-3.5 h-3.5 shrink-0" />;
    label = s || 'Referral';
  } else {
    icon = <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />;
    label = s;
  }

  return (
    <div className="inline-flex items-center gap-1.5 font-semibold text-[#102D55] text-xs whitespace-nowrap">
      {icon}
      <span>{label}</span>
    </div>
  );
}

// ── Next Follow-up: Day on Top, Time Down ──────────────────────────────────
function getLeadFollowupInfo(lead, followups = []) {
  // 1. Linked active followup in AppContext
  const linked = (followups || []).find(
    f => f.leadId === lead.id && f.status !== 'Completed' && f.status !== 'Cancelled'
  );

  let targetDate = '';
  let targetTime = '03:00 PM';

  if (linked && linked.scheduledDate) {
    targetDate = linked.scheduledDate;
    targetTime = linked.scheduledTime || '03:00 PM';
  } else if (lead.nextFollowup && lead.nextFollowup !== 'Completed' && lead.nextFollowup !== 'Closed') {
    if (lead.nextFollowup.includes('T')) {
      const parts = lead.nextFollowup.split('T');
      targetDate = parts[0];
      let t = parts[1] || '03:00 PM';
      if (t.includes(':') && !t.includes('AM') && !t.includes('PM')) {
        const [hh, mm] = t.split(':');
        const hNum = parseInt(hh, 10);
        if (!isNaN(hNum)) {
          const ampm = hNum >= 12 ? 'PM' : 'AM';
          const h12 = hNum % 12 || 12;
          t = `${h12.toString().padStart(2, '0')}:${mm.slice(0, 2)} ${ampm}`;
        }
      }
      targetTime = t;
    } else {
      targetDate = lead.nextFollowup;
    }
  }

  if (!targetDate) {
    return { hasFollowup: false, text: '—' };
  }

  const now = new Date();
  const todayYMD = now.toISOString().split('T')[0];
  const tomorrowObj = new Date(now);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowYMD = tomorrowObj.toISOString().split('T')[0];

  // Match Today (real or mock system dates 2026-11-20 / 2026-11-21)
  const isToday =
    targetDate === todayYMD ||
    targetDate.toLowerCase().includes('today') ||
    targetDate === '2026-11-20' ||
    targetDate === '2026-11-21';

  // Match Tomorrow (real or mock system date 2026-11-22)
  const isTomorrow =
    targetDate === tomorrowYMD ||
    targetDate.toLowerCase().includes('tomorrow') ||
    targetDate === '2026-11-22';

  const cleanTime = targetTime.includes('AM') || targetTime.includes('PM') ? targetTime : `${targetTime} PM`;

  if (isToday) {
    return {
      hasFollowup: true,
      isToday: true,
      dayDate: 'Today',
      time: cleanTime
    };
  }

  if (isTomorrow) {
    return {
      hasFollowup: true,
      isTomorrow: true,
      dayDate: 'Tomorrow',
      time: cleanTime
    };
  }

  // Format date like: "06 Nov 2026"
  try {
    const dObj = new Date(targetDate);
    if (!isNaN(dObj.getTime())) {
      const day = dObj.getDate().toString().padStart(2, '0');
      const month = dObj.toLocaleString('en-US', { month: 'short' });
      const year = dObj.getFullYear();
      return {
        hasFollowup: true,
        dayDate: `${day} ${month} ${year}`,
        time: cleanTime
      };
    }
  } catch (e) {}

  return {
    hasFollowup: true,
    dayDate: targetDate,
    time: cleanTime
  };
}

export default function LeadsModule() {
  const {
    leads,
    filteredLeads,
    followups,
    patients,
    setIsAddLeadOpen,
    setLeadToConvert,
    updateLeadStatus,
    deleteLead,
    setSelectedLeadId,
    setIsLeadDetailsOpen,
    setWhatsAppData,
    setIsWhatsAppModalOpen,
    setLostLeadData,
    setIsLostLeadModalOpen,
    setLeadToBookAppt,
    setIsBookApptSlotOpen,
    setPatient360Data,
    enabledTreatments,
    setActivePatientId,
    leadStatuses,
    leadStatusFilter,
    setLeadStatusFilter
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(() => leadStatusFilter || 'ALL');

  React.useEffect(() => {
    if (leadStatusFilter && leadStatusFilter !== statusFilter) {
      setStatusFilter(leadStatusFilter);
    }
  }, [leadStatusFilter]);

  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [treatmentFilter, setTreatmentFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'pipeline'

  // Dynamic treatments prioritized by Settings configuration and active leads
  const uniqueTreatments = React.useMemo(() => {
    const list = [];
    const seen = new Set();
    (enabledTreatments || []).forEach(t => {
      if (t.name && !seen.has(t.name.trim())) {
        seen.add(t.name.trim());
        list.push(t.name.trim());
      }
    });
    leads.forEach(l => {
      if (l.treatment && !l.isDeleted && !seen.has(l.treatment.trim())) {
        seen.add(l.treatment.trim());
        list.push(l.treatment.trim());
      }
    });
    return list;
  }, [enabledTreatments, leads]);

  // Date Filter State
  const [quickDate, setQuickDate] = useState('ALL');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [appliedDateRange, setAppliedDateRange] = useState({ from: '', to: '' });

  // Export Menu State
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Delete Modal State
  const [leadToDelete, setLeadToDelete] = useState(null);

  // Filter leads based on search, status, priority, source, treatment, and date range
  const filtered = filteredLeads.filter(lead => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      lead.name.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.id.toLowerCase().includes(q) ||
      lead.treatment.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'ALL'
      ? lead.status !== 'Converted to Patient'
      : lead.status === statusFilter;
    
    // Priority / Overdue filter
    let matchesPriority = true;
    if (priorityFilter === 'Overdue') {
      const info = getLeadFollowupInfo(lead, followups);
      matchesPriority = info.hasFollowup && (info.isToday || (info.dayDate && info.dayDate < '2026-11-21'));
    } else if (priorityFilter !== 'ALL') {
      matchesPriority = lead.priority === priorityFilter;
    }

    const matchesSource = sourceFilter === 'ALL' || lead.source === sourceFilter;
    const matchesTreatment = treatmentFilter === 'ALL' || (lead.treatment && lead.treatment.trim() === treatmentFilter);

    const leadYMD = parseLeadDateToYMD(lead);
    const matchesDate = isDateWithinRange(leadYMD, appliedDateRange.from, appliedDateRange.to);

    return matchesSearch && matchesStatus && matchesPriority && matchesSource && matchesTreatment && matchesDate;
  });

  const handleOpenLead = (leadId) => {
    setSelectedLeadId(leadId);
    setIsLeadDetailsOpen(true);
  };

  const handleStatusChange = (lead, newStatus) => {
    if (newStatus === 'Lost Lead') {
      setLostLeadData({ leadId: lead.id, leadName: lead.name });
      setIsLostLeadModalOpen(true);
      return;
    }
    updateLeadStatus(lead.id, newStatus);
  };

  const handleOpenWhatsApp = (lead) => {
    setWhatsAppData({
      recipientName: lead.name,
      phone: lead.phone,
      treatment: lead.treatment,
      leadId: lead.id,
      patientId: null,
      defaultTemplateId: lead.status === 'New' ? 'TMP-01' : 'TMP-04'
    });
    setIsWhatsAppModalOpen(true);
  };

  const handleViewPatientProfile = (patientId) => {
    const p = patients.find(pat => pat.id === patientId);
    if (p) {
      setPatient360Data(p);
    } else {
      setActivePatientId(patientId);
    }
  };

  // Quick Date Handler
  const handleQuickDateChange = (val) => {
    setQuickDate(val);
    if (val === 'CUSTOM') {
      // keep custom input values
    } else if (val === 'ALL') {
      setCustomFromDate('');
      setCustomToDate('');
      setAppliedDateRange({ from: '', to: '' });
    } else {
      const range = computeQuickDateRange(val);
      setCustomFromDate(range.from);
      setCustomToDate(range.to);
      setAppliedDateRange(range);
    }
  };

  const handleApplyCustomDate = () => {
    setAppliedDateRange({ from: customFromDate, to: customToDate });
  };

  const handleClearDateFilter = () => {
    setQuickDate('ALL');
    setCustomFromDate('');
    setCustomToDate('');
    setAppliedDateRange({ from: '', to: '' });
  };

  // Export Data Handler
  const handleExport = (format) => {
    setIsExportMenuOpen(false);

    const headers = [
      { key: 'id', label: 'Lead ID' },
      { key: 'name', label: 'Lead Name' },
      { key: 'phone', label: 'Mobile Number' },
      { key: 'email', label: 'Email Address' },
      { key: 'treatment', label: 'Interested Treatment' },
      { key: 'source', label: 'Lead Source' },
      { key: 'priority', label: 'Priority' },
      { key: 'status', label: 'Pipeline Status' },
      { key: 'enquiryDate', label: 'Enquiry Created Date' },
      { key: 'nextFollowup', label: 'Next Follow-up Date' },
      { key: 'remarks', label: 'Enquiry Remarks & Notes' }
    ];

    const rows = filtered.map(l => ({
      ...l,
      enquiryDate: parseLeadDateToYMD(l),
      nextFollowup: l.nextFollowup || '—',
      remarks: l.remarks || l.nextAction || ''
    }));

    const dateStamp = new Date().toISOString().split('T')[0];
    if (format === 'excel') {
      exportToExcel(headers, rows, `INDUS_Dental_Leads_${dateStamp}.xlsx`, 'Leads');
    } else if (format === 'pdf') {
      exportToPDF(headers, rows, `INDUS_Dental_Leads_${dateStamp}.pdf`, 'Prospective Leads Directory');
    } else {
      exportToCSV(headers, rows, `INDUS_Dental_Leads_${dateStamp}.csv`);
    }
  };

  // KPI Metrics Calculation (Converted leads are excluded from active lead counts)
  const activeUnconvertedLeads = leads.filter(l => !l.isDeleted && l.status !== 'Converted to Patient');
  const totalLeadsCount = activeUnconvertedLeads.length;
  const newLeadsCount = activeUnconvertedLeads.filter(l => l.status === 'New').length;
  const followupsDueCount = (followups || []).filter(f => f.status !== 'Completed' && f.status !== 'Cancelled').length;
  const convertedCount = leads.filter(l => !l.isDeleted && l.status === 'Converted to Patient').length;

  return (
    <div className="space-y-4 animate-in fade-in pb-10">
      
      {/* ── 1. Lead Management Header – Dark Navy Gradient Banner (IMAGE 2) ─── */}
      <div className="bg-gradient-to-r from-[#0C294F] via-[#0E356A] to-[#124285] p-4 sm:p-5 rounded-2xl text-white shadow-md border border-blue-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Lead Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EFF6FF] text-[#1670E8] shadow-xs">
                {filtered.length} Leads
              </span>
            </div>
            <p className="text-xs text-blue-100/80 font-medium mt-0.5">
              Manage enquiries, follow-ups and patient conversions
            </p>
          </div>

          {/* Cyan Analytics / Trend Icon */}
          <div className="hidden sm:flex w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md items-center justify-center text-[#08B9D0] shrink-0 border border-white/15 shadow-inner">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* View Mode Toggle, Export, Add Lead */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex items-center gap-1 text-xs font-bold border border-white/15">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0B2545] shadow-sm font-extrabold'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'pipeline'
                  ? 'bg-white text-[#0B2545] shadow-sm font-extrabold'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Pipeline Board
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Export filtered leads"
            >
              <Download size={13} className="text-blue-200" />
              <span>Export</span>
              <span className="text-[10px] text-blue-200">▾</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 z-30 animate-in fade-in">
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet size={15} className="text-emerald-600" />
                  <span>Export to Excel (.xlsx)</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#1769D2] transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText size={15} className="text-[#1769D2]" />
                  <span>Export to CSV (.csv)</span>
                </button>
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-rose-50 hover:text-rose-800 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <FileText size={15} className="text-rose-600" />
                  <span>Export to PDF (.pdf)</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="px-3.5 py-1.5 bg-[#1670E8] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/30 flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
          >
            <Plus size={14} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* ── 2. Four Individual Tinted Metric Cards (Matching IMAGE 2) ────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Leads */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE]/80 p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1670E8] text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25 ring-2 ring-blue-200/80">
            <ThreeUsersIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#4B6382]">Total Leads</div>
            <div className="text-2xl font-extrabold text-[#0B2545] tracking-tight mt-0.5 leading-none">
              {totalLeadsCount}
            </div>
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-[#F0F9FF] border border-[#BAE6FD]/80 p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0284C7] border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs ring-2 ring-sky-100">
            <Star size={19} className="fill-[#0284C7] text-[#0284C7]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#4B6382]">New Leads</div>
            <div className="text-2xl font-extrabold text-[#0284C7] tracking-tight mt-0.5 leading-none">
              {newLeadsCount}
            </div>
          </div>
        </div>

        {/* Follow-ups Due */}
        <div className="bg-[#FFF8F0] border border-[#FED7AA]/60 p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0 shadow-2xs">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#4B6382]">Follow-ups Due</div>
            <div className="text-2xl font-extrabold text-[#EA580C] tracking-tight mt-0.5 leading-none">
              {followupsDueCount}
            </div>
          </div>
        </div>

        {/* Converted */}
        <div className="bg-[#F0FDF4] border border-[#BBF7D0]/60 p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#4B6382]">Converted</div>
            <div className="text-2xl font-extrabold text-[#16A34A] tracking-tight mt-0.5 leading-none">
              {convertedCount}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Search and Filter Section (Matching IMAGE 2) ─────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2.5">
        {/* Top Filter Controls: Search & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="text-[#7186A5] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFD] border border-slate-200 rounded-xl pl-8.5 pr-3 py-1.5 text-[#102D55] placeholder:text-[#7186A5] focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              if (setLeadStatusFilter) setLeadStatusFilter(e.target.value);
            }}
            className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-2.5 py-1.5 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">All Active Leads ({activeUnconvertedLeads.length})</option>
            {leadStatuses.map(s => {
              const count = s === 'Converted to Patient'
                ? convertedCount
                : leads.filter(l => !l.isDeleted && l.status === s).length;
              return (
                <option key={s} value={s}>{s} ({count})</option>
              );
            })}
          </select>

          {/* Priority Dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-2.5 py-1.5 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">All Priorities</option>
            <option value="Hot">🔥 Hot</option>
            <option value="Warm">⚡ Warm</option>
            <option value="Cold">❄️ Cold</option>
            <option value="Overdue">⏰ Overdue</option>
          </select>

          {/* Source Dropdown */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-2.5 py-1.5 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">All Sources</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Walk In">Walk In</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Referral">Referral</option>
            <option value="Website">Website</option>
            <option value="Google Ads">Google Ads</option>
          </select>

          {/* Treatment Dropdown */}
          <select
            value={treatmentFilter}
            onChange={(e) => setTreatmentFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-2.5 py-1.5 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors max-w-[170px] truncate"
          >
            <option value="ALL">All Treatments</option>
            {uniqueTreatments.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Priority Quick Filter Pills (Matching IMAGE 2) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setPriorityFilter('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'ALL'
                  ? 'bg-[#1670E8] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-[#4B6382] hover:bg-slate-50'
              }`}
            >
              <span>All Leads ({totalLeadsCount})</span>
              <span className="text-[10px]">▾</span>
            </button>
            <button
              onClick={() => setPriorityFilter('Hot')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priorityFilter === 'Hot'
                  ? 'bg-[#EF4444] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-[#4B6382] hover:bg-slate-50'
              }`}
            >
              Hot
            </button>
            <button
              onClick={() => setPriorityFilter('Warm')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priorityFilter === 'Warm'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-[#4B6382] hover:bg-slate-50'
              }`}
            >
              Warm
            </button>
            <button
              onClick={() => setPriorityFilter('Cold')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priorityFilter === 'Cold'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-[#4B6382] hover:bg-slate-50'
              }`}
            >
              Cold
            </button>
            <button
              onClick={() => setPriorityFilter('Overdue')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                priorityFilter === 'Overdue'
                  ? 'bg-[#DC2626] text-white shadow-xs'
                  : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]'
              }`}
            >
              Overdue
            </button>
          </div>

          {/* Quick Date Range Pills */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[#7186A5] font-bold uppercase text-[10px] tracking-wider mr-1 flex items-center gap-1">
              <CalendarRange size={11} className="text-[#1670E8]" />
              <span>Date:</span>
            </span>

            {QUICK_DATE_OPTIONS.slice(0, 5).map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleQuickDateChange(opt.id)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  quickDate === opt.id
                    ? 'bg-[#1670E8] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date Inputs (when Custom Range selected or applied) */}
        {(quickDate === 'CUSTOM' || appliedDateRange.from) && (
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 bg-blue-50/60 p-2 rounded-xl border border-blue-100 flex-wrap">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500">From:</span>
              <input
                type="date"
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500">To:</span>
              <input
                type="date"
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-800 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleApplyCustomDate}
              className="px-2.5 py-1 bg-[#1670E8] hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            >
              Apply
            </button>

            <button
              type="button"
              onClick={handleClearDateFilter}
              className="p-1 hover:bg-slate-200 rounded-md text-slate-500 transition-colors cursor-pointer"
              title="Clear date filter"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── 4. Main Leads Table (Compact Fitted Screen Layout) ──────────────── */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFD] border-b border-slate-200/80 text-[#7186A5] font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-3 min-w-[130px]">LEAD</th>
                  <th className="py-3 px-2.5 min-w-[110px] whitespace-nowrap">CONTACT</th>
                  <th className="py-3 px-2.5 min-w-[130px]">TREATMENT</th>
                  <th className="py-3 px-2.5 min-w-[95px] whitespace-nowrap">SOURCE</th>
                  <th className="py-3 px-2 min-w-[65px]">PRIORITY</th>
                  <th className="py-3 px-2.5 min-w-[130px]">STATUS</th>
                  <th className="py-3 px-2.5 min-w-[100px] whitespace-nowrap">NEXT FOLLOW-UP</th>
                  <th className="py-3 px-3 min-w-[130px] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(lead => {
                  const followupInfo = getLeadFollowupInfo(lead, followups);
                  // Clean single-line phone number (guaranteeing no wrapping)
                  const cleanPhone = (lead.phone || '').replace(/\s+/g, '');

                  return (
                    <tr key={lead.id} className="hover:bg-[#F8FAFD] transition-colors border-b border-slate-100/90">
                      
                      {/* 1. LEAD */}
                      <td className="py-3 px-3">
                        <div
                          className="font-bold text-xs sm:text-sm text-[#102D55] hover:text-[#1670E8] flex items-center gap-1 cursor-pointer"
                          onClick={() => handleOpenLead(lead.id)}
                        >
                          <span className="truncate">{lead.name}</span>
                          <ChevronRight size={12} className="text-slate-400 shrink-0" />
                        </div>
                        <div className="text-[10px] text-[#7186A5] font-medium mt-0.5 truncate">
                          {lead.id} • {lead.date}
                        </div>
                      </td>

                      {/* 2. CONTACT: Single Line Phone Number, Never Wraps */}
                      <td className="py-3 px-2.5 whitespace-nowrap">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="inline-flex items-center gap-1.5 font-semibold text-xs text-[#102D55] hover:text-[#1670E8] transition-colors whitespace-nowrap"
                          title={`Call ${cleanPhone}`}
                        >
                          <Phone size={11} className="text-[#7186A5] shrink-0" />
                          <span className="whitespace-nowrap tracking-wide">{cleanPhone}</span>
                        </a>
                      </td>

                      {/* 3. TREATMENT: Light Blue Rounded Pill */}
                      <td className="py-3 px-2.5">
                        <span
                          className="bg-[#EFF6FF] text-[#1670E8] border border-[#BFDBFE]/60 px-2 py-0.5 rounded-lg text-[11px] font-semibold inline-block truncate max-w-[160px] shadow-2xs"
                          title={lead.treatment}
                        >
                          {lead.treatment}
                        </span>
                      </td>

                      {/* 4. SOURCE: Brand Icon + Label */}
                      <td className="py-3 px-2.5 whitespace-nowrap">
                        <LeadSourceBadge source={lead.source} />
                      </td>

                      {/* 5. PRIORITY: Rounded Pill */}
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          lead.priority === 'Hot' ? 'bg-[#FEE2E2] text-[#EF4444] border border-[#FCA5A5]/50' :
                          lead.priority === 'Warm' ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D]/50' :
                          'bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]/50'
                        }`}>
                          {lead.priority}
                        </span>
                      </td>

                      {/* 6. STATUS: State Colors Matching IMAGE 2 */}
                      <td className="py-3 px-2.5">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer border shadow-2xs transition-colors w-full max-w-[145px] ${
                            lead.status === 'Converted to Patient'
                              ? 'bg-[#E6F8F0] text-[#16A34A] border-[#BBF7D0]'
                              : lead.status === 'Lost Lead'
                              ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FCA5A5]'
                              : lead.status === 'Appointment Booked'
                              ? 'bg-[#F3ECFF] text-[#7E22CE] border-[#E9D5FF]'
                              : lead.status === 'Follow-up Required'
                              ? 'bg-[#FFF4E8] text-[#EA580C] border-[#FED7AA]'
                              : lead.status === 'Contacted'
                              ? 'bg-[#EFF6FF] text-[#1670E8] border-[#BFDBFE]'
                              : lead.status === 'Interested'
                              ? 'bg-[#E0F2FE] text-[#0284C7] border-[#BAE6FD]'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          {leadStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>

                      {/* 7. NEXT FOLLOW-UP: Day on Top, Time Down */}
                      <td className="py-3 px-2.5 whitespace-nowrap">
                        {followupInfo.hasFollowup ? (
                          <div className="flex items-start gap-1.5 whitespace-nowrap">
                            <Clock
                              size={12}
                              className={`mt-0.5 shrink-0 ${
                                followupInfo.isToday
                                  ? 'text-[#EA580C]'
                                  : followupInfo.isTomorrow
                                  ? 'text-[#1670E8]'
                                  : 'text-[#7186A5]'
                              }`}
                            />
                            <div className="leading-tight">
                              <div className="text-xs font-bold leading-tight">
                                {followupInfo.isToday ? (
                                  <span className="text-[#EA580C]">Today</span>
                                ) : followupInfo.isTomorrow ? (
                                  <span className="text-[#1670E8]">Tomorrow</span>
                                ) : (
                                  <span className="text-[#102D55]">{followupInfo.dayDate}</span>
                                )}
                              </div>
                              <div className="text-[10px] font-semibold text-[#7186A5] mt-0.5 leading-tight">
                                {followupInfo.time}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 font-bold">—</span>
                        )}
                      </td>

                      {/* 8. ACTIONS: Icon Buttons & Convert/Profile */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Call Button */}
                          <button
                            onClick={() => handleOpenLead(lead.id)}
                            className="w-7 h-7 rounded-full border border-blue-200 bg-white hover:bg-blue-50 text-[#1670E8] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            title="Call / View Details"
                          >
                            <Phone size={11} />
                          </button>

                          {/* WhatsApp Button */}
                          <button
                            onClick={() => handleOpenWhatsApp(lead)}
                            className="w-7 h-7 rounded-full border border-emerald-200 bg-white hover:bg-emerald-50 text-[#25D366] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                            title="WhatsApp Lead"
                          >
                            <WhatsAppIcon className="w-3 h-3" />
                          </button>

                          {/* Convert or Converted Patient Profile */}
                          {lead.status === 'Converted to Patient' ? (
                            <button
                              onClick={() => handleViewPatientProfile(lead.convertedPatientId || 'IND-0294')}
                              className="px-2 py-1 rounded-lg bg-[#E6F8F0] border border-[#BBF7D0] text-[#16A34A] hover:bg-emerald-100 font-extrabold text-[10px] flex items-center gap-1 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                              title="View Patient Profile"
                            >
                              <UserCheck size={11} className="text-[#16A34A]" />
                              <span>{lead.convertedPatientId || 'IND-0294'}</span>
                            </button>
                          ) : lead.status === 'Lost Lead' ? (
                            <span className="text-[10px] font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded-lg border border-rose-200/50">
                              Lost
                            </span>
                          ) : (
                            <button
                              onClick={() => setLeadToConvert(lead)}
                              className="px-2 py-1 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                              title="Convert to Registered Patient"
                            >
                              <UserCheck size={11} />
                              <span>Convert</span>
                            </button>
                          )}

                          {/* Delete Lead */}
                          <button
                            onClick={() => setLeadToDelete(lead)}
                            className="w-6 h-6 rounded-full text-[#7186A5] hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 mx-auto flex items-center justify-center mb-2">
                        <Users2 size={24} />
                      </div>
                      <div className="font-bold text-sm text-slate-600">No leads found matching current filters</div>
                      <div className="text-xs text-slate-400 mt-1">Try clearing date or status filters</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Pipeline Board View */
        <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin">
          <div className="flex gap-4 min-w-max items-start">
            {leadStatuses.map(status => {
              const columnLeads = filtered.filter(l => l.status === status);
              return (
                <div
                  key={status}
                  className="w-[275px] shrink-0 bg-[#F8FAFD] rounded-2xl p-3.5 border border-slate-200/80 flex flex-col shadow-2xs"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/80">
                    <span className="font-extrabold text-xs text-[#102D55] truncate">{status}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white border border-slate-200 text-slate-600 shadow-xs">
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2.5 flex-1 min-h-[140px]">
                    {columnLeads.map(lead => (
                      <div
                        key={lead.id}
                        className="w-full bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0 flex-1">
                            <div
                              onClick={() => handleOpenLead(lead.id)}
                              className="font-extrabold text-xs text-[#102D55] hover:text-[#1670E8] cursor-pointer truncate"
                              title={lead.name}
                            >
                              {lead.name}
                            </div>
                            <div className="text-[10px] text-[#7186A5] font-semibold">{lead.id}</div>
                          </div>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                            lead.priority === 'Hot' ? 'bg-[#FEE2E2] text-[#EF4444]' :
                            lead.priority === 'Warm' ? 'bg-[#FEF3C7] text-[#D97706]' : 'bg-[#DBEAFE] text-[#2563EB]'
                          }`}>
                            {lead.priority}
                          </span>
                        </div>

                        <div className="text-[11px] font-bold text-[#1670E8] bg-[#EFF6FF] px-2 py-1 rounded-md truncate">
                          {lead.treatment}
                        </div>

                        <div className="text-[10px] text-[#7186A5] font-semibold flex items-center gap-1">
                          <Phone size={10} className="text-slate-400 shrink-0" />
                          <span>{(lead.phone || '').replace(/\s+/g, '')}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-1">
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleOpenLead(lead.id)}
                              className="p-1 hover:bg-slate-100 rounded text-[#7186A5] hover:text-[#1670E8] transition-colors"
                              title="Call Lead"
                            >
                              <Phone size={12} />
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              onClick={() => handleOpenWhatsApp(lead)}
                              className="p-1 hover:bg-emerald-50 rounded text-[#7186A5] hover:text-emerald-600 transition-colors"
                              title="WhatsApp"
                            >
                              <MessageSquare size={12} />
                            </button>
                            <span className="text-slate-200">|</span>
                            <button
                              onClick={() => setLeadToDelete(lead)}
                              className="p-1 hover:bg-rose-50 rounded text-[#7186A5] hover:text-rose-600 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Column-specific smart action */}
                          <div className="shrink-0">
                            {lead.status === 'Converted to Patient' ? (
                              <button
                                onClick={() => handleViewPatientProfile(lead.convertedPatientId || 'IND-0294')}
                                className="text-[10px] font-bold text-[#16A34A] hover:underline flex items-center gap-0.5 cursor-pointer"
                              >
                                <span>Profile</span>
                                <ExternalLink size={10} />
                              </button>
                            ) : lead.status === 'Lost Lead' ? (
                              <span className="text-[9px] font-bold text-rose-600 truncate max-w-[80px]">
                                Lost
                              </span>
                            ) : (
                              <button
                                onClick={() => setLeadToConvert(lead)}
                                className="text-[10px] font-bold text-[#16A34A] hover:underline cursor-pointer"
                              >
                                Convert →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {columnLeads.length === 0 && (
                      <div className="h-28 flex items-center justify-center text-[11px] text-slate-400 font-medium italic border border-dashed border-slate-200/80 rounded-xl bg-white/40">
                        No leads
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={() => {
          if (leadToDelete) {
            deleteLead(leadToDelete.id);
            setLeadToDelete(null);
          }
        }}
        title="Delete Lead"
        message="Are you sure you want to delete this lead?"
        itemName={leadToDelete ? `${leadToDelete.name} (${leadToDelete.id}) • ${leadToDelete.treatment}` : ''}
        detailMessage="This lead will be removed from the active Leads list and pipeline. If this lead has already been converted to a patient, the patient's profile and appointments will remain completely safe."
        confirmButtonText="Delete Lead"
      />
    </div>
  );
}
