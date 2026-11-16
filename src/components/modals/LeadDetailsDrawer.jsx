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
  ExternalLink
} from 'lucide-react';

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
    leadStatuses
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'timeline', 'calls'
  const [newNote, setNewNote] = useState('');
  const [showCallLogger, setShowCallLogger] = useState(false);
  const [callOutcome, setCallOutcome] = useState('Interested in Consultation');
  const [callNotes, setCallNotes] = useState('');
  const [callNextDate, setCallNextDate] = useState('');

  if (!isLeadDetailsOpen || !selectedLeadId) return null;

  const lead = leads.find(l => l.id === selectedLeadId);
  if (!lead) return null;

  // Find linked follow-up task
  const linkedFollowup = followups.find(
    f => f.leadId === lead.id && f.status !== 'Completed' && f.status !== 'Cancelled'
  );

  // Find linked patient profile if converted
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
        return <Plus size={13} className="text-blue-500" />;
      case 'status_change':
        return <ArrowRight size={13} className="text-[#1769D2]" />;
      case 'call':
        return <PhoneCall size={13} className="text-sky-600" />;
      case 'whatsapp':
        return <MessageSquare size={13} className="text-emerald-600" />;
      case 'followup':
        return <Clock size={13} className="text-amber-500" />;
      case 'appointment':
        return <Calendar size={13} className="text-purple-600" />;
      case 'converted':
        return <CheckCircle2 size={13} className="text-emerald-600" />;
      case 'lost':
        return <XCircle size={13} className="text-rose-600" />;
      case 'note':
      default:
        return <FileText size={13} className="text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#092C60] to-[#102A50] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1769D2] to-[#12B89A] flex items-center justify-center font-bold text-white shadow-md">
              {lead.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base tracking-tight text-white">{lead.name}</h2>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                  lead.priority === 'Hot' ? 'bg-rose-500 text-white' :
                  lead.priority === 'Warm' ? 'bg-amber-400 text-slate-900' : 'bg-blue-400 text-slate-900'
                }`}>
                  {lead.priority}
                </span>
              </div>
              <div className="text-xs text-blue-200/80 flex items-center gap-1.5 mt-0.5">
                <span>{lead.id}</span>
                <span>•</span>
                <span>Source: {lead.source}</span>
                <span>•</span>
                <span>{lead.date}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsLeadDetailsOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Pipeline Status Bar */}
        <div className="px-6 py-3 bg-[#EEF5FF] border-b border-blue-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status:</span>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="text-xs font-black bg-white border border-blue-200 text-[#102A50] rounded-xl px-3 py-1.5 shadow-xs outline-none cursor-pointer focus:ring-2 focus:ring-blue-300"
            >
              {leadStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Open WhatsApp Composer"
            >
              <MessageSquare size={14} />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => setShowCallLogger(!showCallLogger)}
              className="px-3 py-1.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Log Phone Call"
            >
              <Phone size={14} />
              <span>Log Call</span>
            </button>
          </div>
        </div>

        {/* Next Action Highlight Banner */}
        <div className="px-6 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-amber-900 font-semibold truncate">
            <Clock size={14} className="text-amber-600 shrink-0" />
            <span className="font-bold text-amber-950">Next Action:</span>
            <span className="truncate">{lead.nextAction || 'Follow-up as per schedule'}</span>
          </div>
          {linkedFollowup && (
            <button
              onClick={() => {
                setRescheduleData({
                  followupId: linkedFollowup.id,
                  currentDate: linkedFollowup.scheduledDate,
                  currentTime: linkedFollowup.scheduledTime,
                  currentReason: linkedFollowup.reason,
                  leadId: lead.id
                });
                setIsRescheduleModalOpen(true);
              }}
              className="text-[11px] font-black text-[#1769D2] hover:underline shrink-0 cursor-pointer ml-2"
            >
              Reschedule
            </button>
          )}
        </div>

        {/* Conversion Status Alert: Converted / Lost / Actionable */}
        {lead.status === 'Converted to Patient' && (
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
              <span>View Patient Profile</span>
              <ExternalLink size={12} />
            </button>
          </div>
        )}

        {lead.status === 'Lost Lead' && (
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
        )}

        {/* Quick Conversion Action Bar (when NOT converted yet) */}
        {lead.status !== 'Converted to Patient' && lead.status !== 'Lost Lead' && (
          <div className="mx-6 mt-4 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between shrink-0">
            <div className="text-xs font-bold text-slate-700">Next Stage Actions:</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setLeadToBookAppt(lead);
                  setIsBookApptSlotOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#7955D9] hover:bg-purple-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all"
              >
                <CalendarPlus size={13} />
                <span>Book Appointment</span>
              </button>
              <button
                onClick={() => setLeadToConvert(lead)}
                className="px-3 py-1.5 rounded-xl bg-[#16A779] hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-xs cursor-pointer transition-all"
              >
                <UserCheck size={13} />
                <span>Convert to Patient</span>
              </button>
            </div>
          </div>
        )}

        {/* Inline Call Logger Panel */}
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
                className="text-slate-400 hover:text-slate-600 text-xs"
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
              placeholder="Call discussion notes (e.g. Inquired about EMI and warranty)..."
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

        {/* Tab Navigation */}
        <div className="px-6 mt-4 border-b border-slate-200 flex items-center gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#1769D2] text-[#1769D2]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview & Schedule
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`pb-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-[#1769D2] text-[#1769D2]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History size={14} />
            <span>Activity Timeline ({(lead.timeline || []).length})</span>
          </button>
        </div>

        {/* Drawer Body Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
          {activeTab === 'overview' ? (
            <>
              {/* Contact & Demographics Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Contact Information
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Primary Phone</span>
                    <div className="font-bold text-[#102A50] mt-0.5 flex items-center gap-1.5">
                      <span>{lead.phone}</span>
                      <a href={`tel:${lead.phone}`} className="text-blue-600 hover:text-blue-800">
                        <Phone size={12} />
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Email Address</span>
                    <div className="font-bold text-slate-700 mt-0.5 truncate">
                      {lead.email || 'None provided'}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Interested Treatment</span>
                    <span className="inline-block font-extrabold text-[#1769D2] bg-blue-50 px-2 py-0.5 rounded-lg mt-0.5">
                      {lead.treatment}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Assigned Staff</span>
                    <div className="font-bold text-slate-700 mt-0.5">
                      {lead.assignedTo || 'Sneha R (Front Desk)'}
                    </div>
                  </div>
                </div>

                {lead.remarks && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-500 block text-[11px] font-bold">Enquiry Remarks:</span>
                    <p className="text-xs text-slate-700 mt-0.5 leading-relaxed bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-100">
                      {lead.remarks}
                    </p>
                  </div>
                )}
              </div>

              {/* Connected Follow-up Task Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock size={13} className="text-amber-500" />
                    <span>Connected Follow-up Task</span>
                  </div>
                  {linkedFollowup ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      {linkedFollowup.status}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">No pending task</span>
                  )}
                </div>

                {linkedFollowup ? (
                  <div className="bg-[#FFFDF7] p-3 rounded-xl border border-amber-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-800">{linkedFollowup.category}</span>
                      <span className="text-[11px] font-bold text-amber-800">
                        {linkedFollowup.scheduledDate} • {linkedFollowup.scheduledTime}
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {linkedFollowup.reason}
                    </p>

                    <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-semibold">
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
                              leadId: lead.id
                            });
                            setIsRescheduleModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-700 cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => completeFollowupTask(linkedFollowup.id, 'Completed via Lead Profile')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[11px] font-bold text-white cursor-pointer shadow-xs"
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
                      onClick={() => updateLeadStatus(lead.id, 'Follow-up Required', { force: true })}
                      className="px-3 py-1.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <Plus size={13} />
                      <span>Schedule Follow-up Task</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Tab: Activity Timeline */
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
                    {/* Circle icon */}
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
