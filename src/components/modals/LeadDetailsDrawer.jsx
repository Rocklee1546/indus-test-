import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  UserCheck,
  CalendarPlus,
  AlertCircle,
  CheckCircle2,
  Tag,
  Shield,
  ArrowRight,
  Send,
  Plus,
  History,
  FileText,
  User,
  Sparkles,
  PhoneCall,
  XCircle,
  ExternalLink,
  ChevronRight,
  Pencil,
  Save,
  Check
} from 'lucide-react';

// ── Tooth Icon SVG for Treatment Interest ─────────────────────────────────────
function ToothIcon({ className = "w-3.5 h-3.5 text-[#1769D2] shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 2.5 9.5 1 3.5 2.5 4.5 3.5 4.5s1.5-2 2-4c.5 2 1 4 2 4s2.5-1 3.5-4.5C18.5 14 20 11 20 8c0-3.5-3.5-6-8-6z" />
    </svg>
  );
}

// ── WhatsApp Brand Icon ───────────────────────────────────────────────────────
function WhatsAppIcon({ className = "w-4 h-4 shrink-0" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#25D366" />
      <path
        d="M17.2 14.3c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7 0.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.18-1.34-.8-.72-1.35-1.6-1.51-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.48-.84-2.02-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.84c.14.18 1.93 2.95 4.68 4.13.65.28 1.16.45 1.56.58.66.21 1.25.18 1.72.11.53-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.19-.52-.33z"
        fill="white"
      />
    </svg>
  );
}

export default function LeadDetailsDrawer() {
  const {
    leads,
    followups,
    patients,
    selectedLeadId,
    setSelectedLeadId,
    isLeadDetailsOpen,
    setIsLeadDetailsOpen,
    updateLeadStatus,
    setLeadToConvert,
    setLeadToBookAppt,
    setIsBookApptSlotOpen,
    setPatient360Data,
    setActivePatientId,
    setWhatsAppData,
    setIsWhatsAppModalOpen,
    setRescheduleData,
    setIsRescheduleModalOpen,
    setLostLeadData,
    setIsLostLeadModalOpen,
    completeFollowupTask,
    addLeadNote,
    logLeadCommunication,
    updateLeadDetails,
    treatments,
    doctors,
    leadStatuses
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline'
  const [newNote, setNewNote] = useState('');
  const [showCallLogger, setShowCallLogger] = useState(false);
  const [callOutcome, setCallOutcome] = useState('Interested in Consultation');
  const [callNotes, setCallNotes] = useState('');
  const [callNextDate, setCallNextDate] = useState('');

  // Lead Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    treatment: '',
    assignedTo: '',
    source: '',
    priority: '',
    remarks: ''
  });
  const [editErrors, setEditErrors] = useState({});

  if (!isLeadDetailsOpen || !selectedLeadId) return null;

  const lead = leads.find(l => l.id === selectedLeadId);
  if (!lead) return null;

  const handleStartEdit = () => {
    setEditFormData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      treatment: lead.treatment || (treatments && treatments[0]?.name) || 'Dental Implants',
      assignedTo: lead.assignedTo || 'Sneha R (Front Desk)',
      source: lead.source || 'Meta Ads',
      priority: lead.priority || 'Hot',
      remarks: lead.remarks || ''
    });
    setEditErrors({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditErrors({});
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const errors = {};

    const cleanName = (editFormData.name || '').trim();
    if (!cleanName) {
      errors.name = 'Full name is required.';
    } else if (cleanName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const cleanPhone = (editFormData.phone || '').replace(/\D/g, '');
    if (!cleanPhone) {
      errors.phone = 'Phone number is required.';
    } else if (cleanPhone.length !== 10) {
      errors.phone = `Phone must be exactly 10 digits (${cleanPhone.length}/10 entered).`;
    }

    const cleanEmail = (editFormData.email || '').trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errors.email = 'Please enter a valid email format (e.g. name@example.com).';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      return;
    }

    if (updateLeadDetails) {
      updateLeadDetails(lead.id, {
        name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        treatment: editFormData.treatment,
        assignedTo: (editFormData.assignedTo || '').trim() || 'Sneha R (Front Desk)',
        source: editFormData.source,
        priority: editFormData.priority,
        remarks: (editFormData.remarks || '').trim()
      });
    }

    setIsEditing(false);
  };

  // Linked follow-up task
  const linkedFollowup = followups.find(
    f => f.leadId === lead.id && f.status !== 'Completed' && f.status !== 'Cancelled'
  );

  // Linked patient profile if converted
  const linkedPatient = lead.convertedPatientId
    ? patients.find(p => p.id === lead.convertedPatientId)
    : null;

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'Lost Lead') {
      setLostLeadData({ leadId: lead.id, leadName: lead.name });
      setIsLostLeadModalOpen(true);
      return;
    }
    updateLeadStatus(lead.id, newStatus);
  };

  const handleOpenWhatsApp = () => {
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

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addLeadNote(lead.id, newNote);
    setNewNote('');
  };

  const handleLogCall = (e) => {
    e.preventDefault();
    logLeadCommunication(lead.id, {
      channel: 'Phone Call',
      outcome: callOutcome,
      notes: callNotes,
      nextActionDate: callNextDate || null
    });
    setShowCallLogger(false);
    setCallNotes('');
    setCallNextDate('');
  };

  const getTimelineIcon = (type) => {
    switch (type) {
      case 'created':
        return <CheckCircle2 size={13} className="text-emerald-500" />;
      case 'status_change':
        return <User size={13} className="text-[#1769D2]" />;
      case 'call':
        return <PhoneCall size={13} className="text-sky-600" />;
      case 'whatsapp':
        return <MessageSquare size={13} className="text-emerald-600" />;
      case 'followup':
        return <Clock size={13} className="text-purple-600" />;
      case 'appointment':
        return <Calendar size={13} className="text-indigo-600" />;
      case 'converted':
        return <CheckCircle2 size={13} className="text-emerald-600" />;
      case 'lost':
        return <XCircle size={13} className="text-rose-600" />;
      case 'note':
      default:
        return <FileText size={13} className="text-slate-500" />;
    }
  };

  // Format follow-up timing display
  const followupDisplayTime = linkedFollowup?.scheduledDate
    ? `${linkedFollowup.scheduledDate} at ${linkedFollowup.scheduledTime || '03:00 PM'}`
    : (lead.nextFollowup ? (lead.nextFollowup.includes('T') ? lead.nextFollowup.replace('T', ' at ') : lead.nextFollowup) : 'Today at 03:00 PM');

  const initials = lead.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase() || 'LD';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* ── 1. Deep Navy Header (Matching Reference Image 1) ───────────────── */}
        <div className="px-6 py-4 bg-[#0B2545] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Cyan Avatar with Initials */}
            <div className="w-11 h-11 rounded-full bg-[#0EA5E9] flex items-center justify-center font-extrabold text-sm text-white shadow-md shrink-0">
              {initials}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-lg tracking-tight text-white truncate leading-tight">
                  {lead.name}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                  lead.priority === 'Hot' ? 'bg-[#EF4444] text-white' :
                  lead.priority === 'Warm' ? 'bg-amber-400 text-slate-900' : 'bg-sky-400 text-slate-900'
                }`}>
                  {lead.priority}
                </span>
              </div>

              <div className="text-xs text-blue-200/90 font-medium flex items-center gap-1.5 mt-0.5 truncate">
                <span>{lead.id}</span>
                <span>•</span>
                <span>Source: {lead.source || 'WhatsApp'}</span>
                <span>•</span>
                <span>{lead.date || 'Today, 09:20 AM'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLeadDetailsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0 ml-2"
            title="Close Drawer"
          >
            <X size={17} />
          </button>
        </div>

        {/* ── 2. Status Control & Communication Bar (Matching Reference) ────── */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Lead Status:</span>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-bold bg-white border border-slate-200 text-[#102A50] rounded-xl px-3 py-1.5 shadow-2xs outline-none cursor-pointer focus:ring-2 focus:ring-blue-100"
            >
              {leadStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenWhatsApp}
              className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Open WhatsApp Composer"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setShowCallLogger(!showCallLogger)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Log Phone Call"
            >
              <Phone size={13} />
              <span>Log Call</span>
            </button>
          </div>
        </div>

        {/* ── 3. Next Action / Follow-up Alert Banner ───────────────────────── */}
        <div className="px-6 py-2.5 bg-[#FFF8EE] border-b border-amber-200/50 flex items-center justify-between shrink-0 text-xs gap-2">
          <div className="flex items-center gap-2 text-amber-950 font-bold truncate">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <span className="text-amber-900 font-extrabold whitespace-nowrap">Next Follow-up:</span>
            <span className="truncate font-semibold text-amber-950">{followupDisplayTime}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
              Due Today
            </span>
            <button
              onClick={() => {
                setRescheduleData({
                  followupId: linkedFollowup ? linkedFollowup.id : null,
                  currentDate: linkedFollowup?.scheduledDate || (lead.nextFollowup ? lead.nextFollowup.split('T')[0] : new Date().toISOString().split('T')[0]),
                  currentTime: linkedFollowup?.scheduledTime || '03:00 PM',
                  currentReason: linkedFollowup?.reason || `Follow-up for ${lead.treatment || 'Consultation'}`,
                  leadId: lead.id,
                  leadName: lead.name,
                  leadTreatment: lead.treatment
                });
                setIsRescheduleModalOpen(true);
              }}
              className="text-xs font-extrabold text-amber-700 hover:text-amber-900 hover:underline cursor-pointer"
            >
              Reschedule →
            </button>
          </div>
        </div>

        {/* ── 4. Main Conversion Actions (Book Appointment & Convert) ────────── */}
        {lead.status === 'Converted to Patient' ? (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div>
                <div className="font-extrabold text-xs text-emerald-900">
                  Successfully Converted to Patient
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Patient UHID: <b className="font-black text-[#102A50]">{lead.convertedPatientId || 'IND-0294'}</b>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                if (linkedPatient) {
                  setPatient360Data(linkedPatient);
                } else {
                  setActivePatientId(lead.convertedPatientId || 'IND-0292');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink size={12} />
            </button>
          </div>
        ) : lead.status === 'Lost Lead' ? (
          <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl shrink-0">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <XCircle size={16} className="text-rose-600" />
              <span>Lead Marked as Lost</span>
            </div>
            <div className="text-xs text-rose-700 mt-1 pl-6">
              <b>Reason:</b> {lead.lostReason || 'Budget / Changed mind'}
            </div>
            <div className="mt-2 pl-6">
              <button
                onClick={() => updateLeadStatus(lead.id, 'Interested', { note: 'Lead reopened from Lost state.' })}
                className="text-[11px] font-bold text-[#1769D2] hover:underline cursor-pointer"
              >
                Re-open Lead to "Interested" →
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-6 mt-4 flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setLeadToBookAppt(lead);
                setIsBookApptSlotOpen(true);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#7047EB] hover:bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <CalendarPlus size={14} />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => setLeadToConvert(lead)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <UserCheck size={14} />
              <span>Convert to Patient</span>
            </button>
          </div>
        )}

        {/* Inline Call Logger Form */}
        {showCallLogger && (
          <form onSubmit={handleLogCall} className="mx-6 mt-3 p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2.5 shrink-0 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-[#102A50] flex items-center gap-1.5">
                <PhoneCall size={14} className="text-[#1769D2]" />
                <span>Log Phone Call Outcome</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCallLogger(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Call Outcome</label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#102A50] outline-none"
                >
                  <option value="Interested in Consultation">Interested in Consultation</option>
                  <option value="Requested Callback Later">Requested Callback Later</option>
                  <option value="Sent Pricing on WhatsApp">Sent Pricing on WhatsApp</option>
                  <option value="No Answer / Busy">No Answer / Busy</option>
                  <option value="Wrong Number / Invalid">Wrong Number / Invalid</option>
                  <option value="Not Interested / High Cost">Not Interested / High Cost</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Next Follow-up (Optional)</label>
                <input
                  type="datetime-local"
                  value={callNextDate}
                  onChange={(e) => setCallNextDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Call discussion notes (e.g. Inquired about pricing and warranty)..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-800 outline-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Call Entry
              </button>
            </div>
          </form>
        )}

        {/* ── 5. Clean Underline Tab Navigation ──────────────────────────────── */}
        <div className="px-6 mt-4 border-b border-slate-200 flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#1769D2] text-[#1769D2]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-b-2 border-[#1769D2] text-[#1769D2]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <span>Activity Timeline ({(lead.timeline || []).length})</span>
          </button>
        </div>

        {/* ── 6. Drawer Scrollable Body Content ──────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          {activeTab === 'overview' ? (
            <>
              {/* Contact Information Card (Matching Reference Image 1) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    Contact Information
                  </div>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1769D2] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Edit Lead Details"
                    >
                      <Pencil size={12} />
                      <span>Edit Lead Details</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Full Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className={`w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs font-bold text-[#102A50] outline-none focus:ring-2 ${
                            editErrors.name ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:ring-blue-100'
                          }`}
                          placeholder="e.g. Sri Ram"
                          required
                        />
                        {editErrors.name && (
                          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{editErrors.name}</span>
                        )}
                      </div>

                      {/* Primary Phone */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Primary Phone (10 digits) *
                        </label>
                        <input
                          type="tel"
                          value={editFormData.phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setEditFormData({ ...editFormData, phone: digits });
                          }}
                          className={`w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs font-bold text-[#102A50] outline-none focus:ring-2 ${
                            editErrors.phone ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:ring-blue-100'
                          }`}
                          placeholder="10-digit mobile number"
                          required
                        />
                        {editErrors.phone && (
                          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{editErrors.phone}</span>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={editFormData.email}
                          onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                          className={`w-full bg-[#F8FAFC] border rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 ${
                            editErrors.email ? 'border-rose-400 focus:ring-rose-100' : 'border-slate-200 focus:ring-blue-100'
                          }`}
                          placeholder="e.g. name@domain.com"
                        />
                        {editErrors.email && (
                          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block">{editErrors.email}</span>
                        )}
                      </div>

                      {/* Treatment Interest */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Treatment Interest
                        </label>
                        <select
                          value={editFormData.treatment}
                          onChange={(e) => setEditFormData({ ...editFormData, treatment: e.target.value })}
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1769D2] outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                        >
                          {(treatments && treatments.length > 0 ? treatments : [
                            { id: 1, name: 'Dental Implants' },
                            { id: 2, name: 'Clear Aligners' },
                            { id: 3, name: 'Root Canal Treatment' },
                            { id: 4, name: 'Teeth Whitening' },
                            { id: 5, name: 'Zirconia Crown / Bridge' },
                            { id: 6, name: 'Pediatric Dental Care' }
                          ]).map(t => (
                            <option key={t.id || t.name} value={t.name}>{t.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Assigned Staff (Type or Select) */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Assigned Staff
                        </label>
                        <input
                          type="text"
                          list="assigned-staff-list"
                          value={editFormData.assignedTo}
                          onChange={(e) => setEditFormData({ ...editFormData, assignedTo: e.target.value })}
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100"
                          placeholder="Type or select staff..."
                        />
                        <datalist id="assigned-staff-list">
                          <option value="Sneha R (Front Desk)" />
                          <option value="Kavitha (Front Desk)" />
                          <option value="Front Desk Reception" />
                          {(doctors || []).map(doc => (
                            <option key={doc.id} value={doc.name} />
                          ))}
                        </datalist>
                      </div>

                      {/* Lead Source */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Lead Source
                        </label>
                        <select
                          value={editFormData.source}
                          onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                        >
                          <option value="Meta Ads">Meta Ads</option>
                          <option value="Walk In">Walk In</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Referral">Referral</option>
                          <option value="Website">Website</option>
                          <option value="Google Ads">Google Ads</option>
                        </select>
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Priority
                        </label>
                        <select
                          value={editFormData.priority}
                          onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                          className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
                        >
                          <option value="Hot">🔥 Hot</option>
                          <option value="Warm">⚡ Warm</option>
                          <option value="Cold">❄️ Cold</option>
                        </select>
                      </div>
                    </div>

                    {/* Enquiry Remarks */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Enquiry Remarks
                      </label>
                      <textarea
                        rows={3}
                        value={editFormData.remarks}
                        onChange={(e) => setEditFormData({ ...editFormData, remarks: e.target.value })}
                        className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-100 resize-none font-medium"
                        placeholder="Enter enquiry remarks or consultation summary..."
                      />
                    </div>

                    {/* Form Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
                      >
                        <Save size={13} />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Primary Phone</span>
                        <div className="font-bold text-[#102A50] mt-0.5 flex items-center gap-1.5">
                          <Phone size={12} className="text-slate-400" />
                          <span>{lead.phone}</span>
                          <a href={`tel:${lead.phone}`} className="text-[#1769D2] hover:text-blue-800 ml-0.5" title="Call">
                            <PhoneCall size={12} />
                          </a>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Email Address</span>
                        <div className="font-semibold text-slate-700 mt-0.5 truncate">
                          {lead.email || 'None provided'}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Treatment Interest</span>
                        <div className="font-bold text-[#1769D2] mt-0.5 flex items-center gap-1.5 truncate">
                          <ToothIcon className="w-3.5 h-3.5 text-[#1769D2]" />
                          <span className="truncate">{lead.treatment}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px] font-medium">Assigned Staff</span>
                        <div className="font-semibold text-slate-700 mt-0.5 flex items-center gap-1.5 truncate">
                          <User size={12} className="text-slate-400" />
                          <span className="truncate">{lead.assignedTo || 'Sneha R (Front Desk)'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enquiry Remarks */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-slate-600 block text-xs font-bold mb-1">Enquiry Remarks:</span>
                      <div className="text-xs text-slate-700 leading-relaxed bg-[#F8FAFC] p-3 rounded-xl border border-slate-100 font-medium">
                        {lead.remarks || 'Enquiry received. Waiting for initial clinical consultation.'}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Follow-up Task Card (Matching Reference Image 1) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold text-[#102A50] flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-500" />
                    <span>Follow-up Task</span>
                  </div>
                  {linkedFollowup ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {linkedFollowup.status || 'Pending'}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">No pending task</span>
                  )}
                </div>

                {linkedFollowup ? (
                  <div className="bg-[#FFFDF7] p-3.5 rounded-xl border border-amber-200/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[#102A50]">{linkedFollowup.category || 'First Contact Follow-up'}</span>
                      <span className="text-xs font-bold text-amber-700">
                        {linkedFollowup.scheduledDate} • {linkedFollowup.scheduledTime}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {linkedFollowup.reason}
                    </p>

                    <div className="pt-2 border-t border-amber-200/50 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Assigned: {linkedFollowup.assignedTo}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setRescheduleData({
                              followupId: linkedFollowup.id,
                              currentDate: linkedFollowup.scheduledDate,
                              currentTime: linkedFollowup.scheduledTime,
                              currentReason: linkedFollowup.reason,
                              leadId: lead.id,
                              leadName: lead.name,
                              leadTreatment: lead.treatment
                            });
                            setIsRescheduleModalOpen(true);
                          }}
                          className="px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer transition-all"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => completeFollowupTask(linkedFollowup.id, 'Completed via Lead Profile')}
                          className="px-3 py-1 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-xs font-bold text-white cursor-pointer shadow-2xs transition-all"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">
                      No pending follow-up task is currently scheduled for this lead.
                    </p>
                    <button
                      onClick={() => {
                        setRescheduleData({
                          followupId: null,
                          currentDate: new Date().toISOString().split('T')[0],
                          currentTime: '03:00 PM',
                          currentReason: `Follow-up for ${lead.treatment || 'Consultation'}`,
                          leadId: lead.id,
                          leadName: lead.name,
                          leadTreatment: lead.treatment
                        });
                        setIsRescheduleModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Next Follow-up</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Activity Timeline Preview in Overview (Matching Reference Image 1) */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold text-[#102A50] flex items-center gap-1.5">
                    <History size={14} className="text-[#1769D2]" />
                    <span>Activity Timeline</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="text-xs font-extrabold text-[#1769D2] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="relative pl-6 space-y-3 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                  {(lead.timeline || []).slice(0, 3).map((event) => (
                    <div key={event.id} className="relative">
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                        {getTimelineIcon(event.type)}
                      </div>

                      <div className="flex items-start justify-between text-xs gap-2">
                        <div>
                          <span className="font-extrabold text-[#102A50] block">{event.title}</span>
                          <span className="text-[11px] text-slate-500 font-medium block">{event.description}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                          {event.time || event.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* ── Activity Timeline Full Tab ─────────────────────────────────── */
            <div className="space-y-4">
              {/* Quick Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a clinical or enquiry note to timeline..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Send size={13} />
                  <span>Add Note</span>
                </button>
              </form>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(lead.timeline || []).map((event) => (
                  <div key={event.id} className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-300 group-hover:border-blue-500 flex items-center justify-center shadow-xs transition-colors">
                      {getTimelineIcon(event.type)}
                    </div>

                    <div className="bg-[#F8FAFC] group-hover:bg-blue-50/30 p-3 rounded-2xl border border-slate-200/80 transition-all space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#102A50]">{event.title}</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {event.description}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1 font-medium">
                        By: {event.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
