import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Users2,
  UserCheck,
  CalendarDays,
  Clock,
  MessageSquare,
  PenTool,
  Receipt,
  ShieldCheck,
  PackageCheck,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Briefcase
} from 'lucide-react';

const PATIENT_MGMT_IDS = ['leads', 'followups', 'appointments', 'patients', 'whatsapp', 'draw_explain'];
const ADMIN_OPS_IDS = ['billing', 'analytics'];

export default function Sidebar() {
  const {
    activeModule,
    setActiveModule,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    leads,
    followups
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();

  // Leads count: only active, unconverted leads (exclude Converted to Patient and hard-deleted)
  const pendingLeadsCount = leads.filter(l =>
    !l.isDeleted &&
    l.status !== 'Converted to Patient'
  ).length;

  // Follow-ups badge in left sidebar:
  // Formula: Total Follow-up Badge = Pending Prospective Lead Follow-Ups + Pending Existing Patient Follow-Ups.
  // Strictly exclude completed and cancelled records.
  const isIncomplete = (f) => f && f.status !== 'Completed' && f.status !== 'Cancelled';

  // 1. Prospective Lead Follow-ups: count only incomplete tasks (consolidated by lead)
  const prospectivePendingKeys = new Set();
  followups.forEach(f => {
    if ((f.personType === 'lead' || !!f.leadId) && isIncomplete(f)) {
      if (f.leadId) {
        const leadRecord = leads.find(l => l.id === f.leadId);
        if (leadRecord?.isDeleted) return;
      }
      const key = f.leadId || f.phone || f.targetName;
      if (key) prospectivePendingKeys.add(key);
    }
  });

  // 2. Existing Patient Follow-ups: count only incomplete tasks (consolidated by appointment or patient)
  const patientPendingKeys = new Set();
  followups.forEach(f => {
    if (f.personType === 'lead' || !!f.leadId) return;
    if ((f.personType === 'patient' || !!f.patientId) && isIncomplete(f)) {
      let key;
      if (f.appointmentId) {
        key = `appt_${f.appointmentId}`;
      } else if (
        (f.category === 'Appointment Reminder' || f.category === 'Appointment Confirmation') &&
        f.appointmentDate &&
        (f.patientId || f.targetName)
      ) {
        key = `appt_${f.patientId || f.targetName}_${f.appointmentDate}`;
      } else {
        key = `pat_fol_${f.id}`;
      }
      patientPendingKeys.add(key);
    }
  });

  const pendingFollowupsCount = prospectivePendingKeys.size + patientPendingKeys.size;

  // Expandable sections state - open by default for immediate accessibility
  const [expandedSections, setExpandedSections] = useState({
    patientMgmt: true,
    adminOps: true
  });

  // Auto-expand the parent section when active module changes
  useEffect(() => {
    if (PATIENT_MGMT_IDS.includes(activeModule)) {
      setExpandedSections(prev => ({ ...prev, patientMgmt: true }));
    } else if (ADMIN_OPS_IDS.includes(activeModule)) {
      setExpandedSections(prev => ({ ...prev, adminOps: true }));
    }
  }, [activeModule]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Patient Management submenu items (Ordered: Leads -> Follow-ups -> Appointments -> Patients -> WhatsApp & Campaigns -> Draw & Explain)
  const patientItems = [
    { id: 'leads', path: '/leads', label: 'Leads', icon: Users2, badge: pendingLeadsCount },
    { id: 'followups', path: '/followups', label: 'Follow-ups', icon: Clock, badge: pendingFollowupsCount },
    { id: 'appointments', path: '/appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'patients', path: '/patients', label: 'Patients', icon: UserCheck },
    { id: 'whatsapp', path: '/whatsapp', label: 'WhatsApp & Campaigns', icon: MessageSquare },
    { id: 'draw_explain', path: '/draw-explain', label: 'Draw & Explain', icon: PenTool },
  ];

  // Administration & Operations submenu items (Ordered: Billing & Payments -> Analytics & Reports)
  const adminItems = [
    { id: 'billing', path: '/billing', label: 'Billing & Payments', icon: Receipt },
    { id: 'analytics', path: '/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  const handleNavClick = (item) => {
    setActiveModule(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  const isSectionActive = (ids) => ids.includes(activeModule);

  // Render a single nav item button
  const renderNavItem = (item, indented = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path || activeModule === item.id;
    return (
      <button
        key={item.id}
        onClick={() => handleNavClick(item)}
        className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer text-left group relative ${
          indented && !isSidebarCollapsed ? 'pl-10' : ''
        } ${
          isActive
            ? 'bg-[#1769D2] text-white shadow-md shadow-blue-600/40 font-bold'
            : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
        }`}
        title={isSidebarCollapsed ? item.label : undefined}
      >
        <Icon
          size={16}
          className={`shrink-0 transition-transform group-hover:scale-110 ${
            isActive ? 'text-white' : 'text-blue-200'
          }`}
        />
        {!isSidebarCollapsed && (
          <span className="truncate flex-1">{item.label}</span>
        )}

        {/* Badge Counter */}
        {!isSidebarCollapsed && item.badge && item.badge > 0 ? (
          <span
            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
              isActive ? 'bg-white text-[#1769D2]' : 'bg-[#1769D2] text-white'
            }`}
          >
            {item.badge}
          </span>
        ) : null}

        {/* Dot indicator when collapsed */}
        {isSidebarCollapsed && item.badge && item.badge > 0 && (
          <span className="w-2 h-2 rounded-full bg-[#12B89A] absolute top-1.5 right-1.5 ring-2 ring-[#092C60]" />
        )}
      </button>
    );
  };

  // Render an expandable section
  const renderSection = (key, label, SectionIcon, items, childIds) => {
    const isExpanded = expandedSections[key];
    const hasActiveChild = isSectionActive(childIds);

    return (
      <div key={key}>
        {/* Section Header */}
        <button
          onClick={() => toggleSection(key)}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-150 cursor-pointer text-left group ${
            hasActiveChild && !isExpanded
              ? 'bg-white/10 text-white'
              : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
          }`}
          title={isSidebarCollapsed ? label : undefined}
        >
          <SectionIcon
            size={17}
            className={`shrink-0 ${hasActiveChild ? 'text-[#12B89A]' : 'text-blue-200/80'}`}
          />
          {!isSidebarCollapsed && (
            <>
              <span className="truncate flex-1 text-[11px] font-bold tracking-wide">{label}</span>
              <ChevronDown
                size={14}
                className={`shrink-0 text-blue-200/60 transition-transform duration-200 ${
                  isExpanded ? 'rotate-0' : '-rotate-90'
                }`}
              />
            </>
          )}
        </button>

        {/* Submenu Items */}
        {(isExpanded || isSidebarCollapsed) && (
          <div className={`space-y-0.5 ${!isSidebarCollapsed ? 'mt-0.5' : ''}`}>
            {items.map(item => renderNavItem(item, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={`h-screen bg-[#092C60] text-white flex flex-col shrink-0 transition-all duration-300 relative z-30 select-none shadow-2xl ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Dental Tooth Logo Badge */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1769D2] to-[#12B89A] flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <svg
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4.5C10.2 3.2 7.8 2.5 5.5 3.2C3.2 3.9 2 6 2 8.8C2 12.2 3.3 15.2 4.8 18.2C5.6 19.8 7.2 21 8.8 20.2C10.2 19.5 10.8 17.5 11.2 15.5C11.5 14.2 11.7 13.2 12 13.2C12.3 13.2 12.5 14.2 12.8 15.5C13.2 17.5 13.8 19.5 15.2 20.2C16.8 21 18.4 19.8 19.2 18.2C20.7 15.2 22 12.2 22 8.8C22 6 20.8 3.9 18.5 3.2C16.2 2.5 13.8 3.2 12 4.5Z" />
            </svg>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex items-center">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                INDUS <span className="text-[#12B89A] font-semibold text-xl">Dental</span>
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin relative z-10">
        {/* Dashboard - Standalone */}
        {renderNavItem({ id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard })}

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Section 1: Patient Management */}
        {renderSection('patientMgmt', 'Patient Management', Users2, patientItems, PATIENT_MGMT_IDS)}

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Section 2: Administration & Operations */}
        {renderSection('adminOps', 'Administration & Operations', Briefcase, adminItems, ADMIN_OPS_IDS)}

        {/* Divider */}
        <div className="border-t border-white/10 my-2" />

        {/* Settings - Standalone */}
        {renderNavItem({ id: 'settings', path: '/settings', label: 'Settings', icon: Settings })}
      </div>

      {/* Decorative Blue Wave Design at Bottom (Matching Reference Image 1) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-36 z-0 select-none">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 256 140"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sidebarWave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B3C7A" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#104E9E" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="sidebarWave2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1256B0" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1E75E2" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id="sidebarWave3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1769D2" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#258BF5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B3C7A" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {/* Layer 1: Deep blue sweeping curve */}
          <path
            d="M-20 140 C40 100, 100 135, 180 85 C220 60, 260 75, 290 60 L290 140 Z"
            fill="url(#sidebarWave1)"
          />
          {/* Layer 2: Mid bright blue crest */}
          <path
            d="M-20 140 C30 115, 80 75, 150 95 C200 110, 240 70, 280 50 L280 140 Z"
            fill="url(#sidebarWave2)"
          />
          {/* Layer 3: Smooth highlight foreground wave */}
          <path
            d="M-10 140 C50 130, 90 90, 160 110 C210 125, 245 105, 280 85 L280 140 Z"
            fill="url(#sidebarWave3)"
          />
        </svg>
      </div>
    </aside>
  );
}
