import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Filter,
  User,
  ArrowRight,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  CalendarPlus,
  FileText,
  Stethoscope,
  Trash2
} from 'lucide-react';
import { PATIENT_FOLLOWUP_CATEGORIES } from '../modals/AddPatientFollowupModal';

export default function FollowupsModule() {
  const {
    followups,
    filteredFollowups,
    leads,
    patients,
    setSelectedLeadId,
    setIsLeadDetailsOpen,
    setPatient360Data,
    setActivePatientId,
    setWhatsAppData,
    setIsWhatsAppModalOpen,
    setRescheduleData,
    setIsRescheduleModalOpen,
    setFollowupOutcomeData,
    setIsFollowupOutcomeOpen,
    setIsAddPatientFollowupOpen,
    openBookAppointment,
    setLeadToBookAppt,
    setIsBookApptSlotOpen,
    completeFollowupTask,
    deleteFollowup,
    showToast
  } = useApp();
  // Primary Tab: 'leads' vs 'patients'
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' or 'patients'

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Dynamic status evaluation helper
  const evaluateFollowup = (item) => {
    if (item.status === 'Completed' || item.status === 'Cancelled') {
      return item.status;
    }
    const itemDate = item.scheduledDate || (item.scheduledDateTime ? item.scheduledDateTime.split('T')[0] : '');
    if (!itemDate) return item.status || 'Pending';

    if (itemDate < todayStr) return 'Overdue';
    if (itemDate === todayStr) return 'Due Today';
    return item.status === 'Rescheduled' ? 'Rescheduled' : 'Pending';
  };

  // Separate pools
  const leadFollowupsList = filteredFollowups.filter(f => f.personType === 'lead' || !!f.leadId);
  const patientFollowupsList = filteredFollowups.filter(f => f.personType === 'patient' || !!f.patientId);

  // Active list based on active tab
  const currentPool = activeTab === 'leads' ? leadFollowupsList : patientFollowupsList;

  // Filter within active pool
  const filteredItems = currentPool.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (item.targetName || '').toLowerCase().includes(q) ||
      (item.phone || '').includes(q) ||
      (item.id || '').toLowerCase().includes(q) ||
      (item.leadId || '').toLowerCase().includes(q) ||
      (item.patientId || '').toLowerCase().includes(q) ||
      (item.treatment || '').toLowerCase().includes(q) ||
      (item.reason || '').toLowerCase().includes(q);

    const computedStatus = evaluateFollowup(item);
    const matchesStatus = statusFilter === 'ALL' || computedStatus === statusFilter || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesDoctor = doctorFilter === 'ALL' || (item.assignedTo || '').includes(doctorFilter);

    return matchesSearch && matchesStatus && matchesCategory && matchesDoctor;
  });

  // Tab badge counts
  const leadCounts = {
    total: leadFollowupsList.length,
    dueToday: leadFollowupsList.filter(f => evaluateFollowup(f) === 'Due Today').length,
    overdue: leadFollowupsList.filter(f => evaluateFollowup(f) === 'Overdue').length,
    completed: leadFollowupsList.filter(f => f.status === 'Completed').length,
    pending: leadFollowupsList.filter(f => f.status === 'Pending' || evaluateFollowup(f) === 'Due Today' || evaluateFollowup(f) === 'Overdue').length
  };

  const patientCounts = {
    total: patientFollowupsList.length,
    dueToday: patientFollowupsList.filter(f => evaluateFollowup(f) === 'Due Today').length,
    overdue: patientFollowupsList.filter(f => evaluateFollowup(f) === 'Overdue').length,
    completed: patientFollowupsList.filter(f => f.status === 'Completed').length,
    pending: patientFollowupsList.filter(f => f.status === 'Pending' || evaluateFollowup(f) === 'Due Today' || evaluateFollowup(f) === 'Overdue').length
  };

  const activeCounts = activeTab === 'leads' ? leadCounts : patientCounts;

  const handleOpenProfile = (item) => {
    if (item.leadId) {
      setSelectedLeadId(item.leadId);
      setIsLeadDetailsOpen(true);
    } else if (item.patientId) {
      const p = patients.find(pat => pat.id === item.patientId);
      if (p) {
        setPatient360Data(p);
      } else {
        setActivePatientId(item.patientId);
      }
    }
  };

  const handleOpenWhatsApp = (item) => {
    setWhatsAppData({
      recipientName: item.targetName,
      phone: item.phone,
      treatment: item.treatment,
      leadId: item.leadId || null,
      patientId: item.patientId || null,
      defaultTemplateId: item.category?.includes('Check-up')
        ? 'TMP-10'
        : item.category?.includes('Confirmation')
        ? 'TMP-05'
        : item.category?.includes('Post-Treatment')
        ? 'TMP-09'
        : 'TMP-04'
    });
    setIsWhatsAppModalOpen(true);
  };

  const handleReschedule = (item) => {
    setRescheduleData({
      followupId: item.id,
      currentDate: item.scheduledDate,
      currentTime: item.scheduledTime,
      currentReason: item.reason,
      leadId: item.leadId
    });
    setIsRescheduleModalOpen(true);
  };

  // Lead Follow-up Completion opens Outcome Modal
  const handleCompleteLeadFollowup = (item) => {
    setFollowupOutcomeData(item);
    setIsFollowupOutcomeOpen(true);
  };

  // Patient Follow-up Completion
  const handleCompletePatientFollowup = (item) => {
    completeFollowupTask(item.id, 'Clinical follow-up successfully addressed.');
  };

  // Direct Book Appointment from Follow-up
  const handleBookAppointmentFromFollowup = (item) => {
    if (item.leadId) {
      const lead = leads.find(l => l.id === item.leadId);
      if (lead) {
        setLeadToBookAppt(lead);
        setIsBookApptSlotOpen(true);
      }
    } else if (item.patientId) {
      const patient = patients.find(p => p.id === item.patientId);
      if (patient) {
        openBookAppointment(patient);
      }
    }
  };

  // Delete handlers
  const handleDeleteFollowup = (item) => setDeleteConfirm(item);
  const confirmDeleteFollowup = () => {
    if (deleteConfirm) {
      deleteFollowup(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full mx-4 border border-rose-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 flex items-center justify-center">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#102A50] text-sm">Delete Follow-Up?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="bg-rose-50 rounded-2xl p-3 mb-5 text-xs text-slate-700 leading-relaxed">
              <div className="font-bold text-[#102A50]">{deleteConfirm.targetName}</div>
              <div className="text-slate-500">{deleteConfirm.category}</div>
              <div className="text-slate-500">{deleteConfirm.treatment} · {deleteConfirm.scheduledDate}</div>
              <div className="text-slate-500 mt-1">{deleteConfirm.reason}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFollowup}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Delete Follow-Up
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Follow-Up & Recall Management Centre
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
              {activeCounts.dueToday} Due Today
            </span>
            {activeCounts.overdue > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {activeCounts.overdue} Overdue
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Two distinct channels: Prospective Lead Nurturing vs Registered Patient Care & Clinical Recalls
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          {activeTab === 'patients' && (
            <button
              onClick={() => setIsAddPatientFollowupOpen(true)}
              className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={15} />
              <span>Schedule Patient Follow-Up</span>
            </button>
          )}
        </div>
      </div>

      {/* TWO DISTINCT PRIMARY TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Tab 1: Lead Follow-ups */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('leads');
            setCategoryFilter('ALL');
            setStatusFilter('ALL');
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'leads'
              ? 'bg-gradient-to-r from-[#092C60] to-[#1769D2] text-white border-transparent shadow-lg shadow-blue-900/20 ring-2 ring-[#1769D2]'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                activeTab === 'leads' ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#1769D2]'
              }`}>
                🎯
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">
                  1. Prospective Lead Follow-Ups
                </h3>
                <p className={`text-[11px] ${activeTab === 'leads' ? 'text-blue-100' : 'text-slate-500'}`}>
                  Enquiries, treatment quotes & appointment conversions
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
              activeTab === 'leads' ? 'bg-white text-[#102A50]' : 'bg-slate-100 text-slate-700'
            }`}>
              {leadCounts.total} Tasks
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/15 text-[11px] font-semibold">
            <span className={activeTab === 'leads' ? 'text-blue-100' : 'text-slate-600'}>
              Due Today: <b className="font-extrabold text-white">{leadCounts.dueToday}</b>
            </span>
            <span>•</span>
            <span className={activeTab === 'leads' ? 'text-rose-200' : 'text-rose-600'}>
              Overdue: <b className="font-extrabold">{leadCounts.overdue}</b>
            </span>
            <span>•</span>
            <span className={activeTab === 'leads' ? 'text-emerald-200' : 'text-emerald-700'}>
              Completed: <b className="font-extrabold">{leadCounts.completed}</b>
            </span>
          </div>
        </button>

        {/* Tab 2: Patient Follow-ups */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('patients');
            setCategoryFilter('ALL');
            setStatusFilter('ALL');
          }}
          className={`p-4 rounded-3xl border text-left transition-all cursor-pointer relative overflow-hidden ${
            activeTab === 'patients'
              ? 'bg-gradient-to-r from-[#005B60] to-[#12B89A] text-white border-transparent shadow-lg shadow-teal-900/20 ring-2 ring-[#12B89A]'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                activeTab === 'patients' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}>
                🦷
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide">
                  2. Existing Patient Follow-Ups
                </h3>
                <p className={`text-[11px] ${activeTab === 'patients' ? 'text-teal-100' : 'text-slate-500'}`}>
                  Post-treatment check, 6-month recall, next sessions & lab notices
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
              activeTab === 'patients' ? 'bg-white text-teal-950' : 'bg-slate-100 text-slate-700'
            }`}>
              {patientCounts.total} Tasks
            </span>
          </div>

          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/15 text-[11px] font-semibold">
            <span className={activeTab === 'patients' ? 'text-teal-100' : 'text-slate-600'}>
              Due Today: <b className="font-extrabold text-white">{patientCounts.dueToday}</b>
            </span>
            <span>•</span>
            <span className={activeTab === 'patients' ? 'text-rose-200' : 'text-rose-600'}>
              Overdue: <b className="font-extrabold">{patientCounts.overdue}</b>
            </span>
            <span>•</span>
            <span className={activeTab === 'patients' ? 'text-emerald-200' : 'text-emerald-700'}>
              Completed: <b className="font-extrabold">{patientCounts.completed}</b>
            </span>
          </div>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'leads' ? "Search lead name, phone, Lead ID, treatment..." : "Search patient name, phone, UHID, treatment..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Categories (Context-sensitive to active tab!) */}
        {activeTab === 'patients' ? (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All 10 Patient Categories</option>
            {PATIENT_FOLLOWUP_CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        ) : (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Lead Categories</option>
            <option value="New Lead Follow-up">New Lead Follow-up</option>
            <option value="First Contact Follow-up">First Contact Follow-up</option>
            <option value="Interested Lead Follow-up">Interested Lead Follow-up</option>
          </select>
        )}

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          <option value="Due Today">Due Today</option>
          <option value="Overdue">Overdue</option>
          <option value="Pending">Pending / Upcoming</option>
          <option value="Completed">Completed</option>
        </select>

        {/* Doctor Filter (for patient tab) */}
        {activeTab === 'patients' && (
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Doctors</option>
            <option value="Priya">Dr. Priya Sharma</option>
            <option value="Arun">Dr. Arun Agarwal</option>
            <option value="Kavitha">Dr. Kavitha</option>
          </select>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Clock size={36} className="mx-auto text-slate-300 mb-2" />
            <h4 className="font-extrabold text-sm text-[#102A50]">
              No {activeTab === 'leads' ? 'Lead' : 'Patient'} Follow-Ups Found
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                ? 'Try adjusting your filters or search keywords.'
                : activeTab === 'leads'
                ? 'All prospective lead follow-ups are up to date.'
                : 'No post-treatment recalls pending.'}
            </p>
          </div>
        ) : (
          filteredItems.map(item => {
            const computedStatus = evaluateFollowup(item);
            const isCompleted = item.status === 'Completed';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  computedStatus === 'Overdue'
                    ? 'border-rose-200 shadow-rose-100/40 shadow-md'
                    : computedStatus === 'Due Today'
                    ? 'border-amber-200 shadow-amber-100/40 shadow-md'
                    : 'border-slate-200/80 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Header: Category + Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 truncate max-w-[190px]">
                      {item.category || (activeTab === 'leads' ? 'Lead Follow-up' : 'Patient Follow-up')}
                    </span>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : computedStatus === 'Due Today'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : computedStatus === 'Overdue'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-[#1769D2]'
                    }`}>
                      {computedStatus}
                    </span>
                  </div>

                  {/* Target Name + ID */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => handleOpenProfile(item)}
                        className="font-extrabold text-sm text-[#102A50] hover:text-[#1769D2] transition-colors flex items-center gap-1 cursor-pointer text-left"
                      >
                        <span>{item.targetName}</span>
                        <ExternalLink size={11} className="text-slate-400" />
                      </button>
                      <div className="text-[11px] font-bold text-[#1769D2] mt-0.5">
                        {item.treatment}
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 shrink-0">
                      {item.leadId ? `Lead: ${item.leadId}` : `UHID: ${item.patientId}`}
                    </span>
                  </div>

                  {/* Reason / Notes */}
                  <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-600 leading-relaxed">
                    {item.reason}
                    {item.outcome && (
                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 font-bold text-[10px] text-emerald-700">
                        Outcome: {item.outcome} {item.outcomeNotes ? `(${item.outcomeNotes})` : ''}
                      </div>
                    )}
                  </div>

                  {/* Metadata: Phone, Slot, Assigned */}
                  <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Phone size={11} className="text-slate-400" />
                        {item.phone}
                      </span>
                      <span className="font-extrabold text-[#102A50]">
                        Slot: {item.scheduledTime || '11:00 AM'} ({item.scheduledDate})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assigned: {item.assignedTo}</span>
                      <span>Channel: {item.lastContactChannel || 'WhatsApp'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Call simulation */}
                    <button
                      onClick={() => showToast(`Calling ${item.targetName} (${item.phone})...`)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#102A50] flex items-center justify-center transition-colors cursor-pointer"
                      title="Simulate Phone Call"
                    >
                      <Phone size={13} />
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => handleOpenWhatsApp(item)}
                      className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Send WhatsApp Message"
                    >
                      <MessageSquare size={13} />
                    </button>

                    {/* Reschedule */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleReschedule(item)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                    )}

                    {/* Delete Follow-up */}
                    <button
                      onClick={() => handleDeleteFollowup(item)}
                      title="Delete Follow-Up"
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Main Action based on Lead vs Patient */}
                  <div className="flex items-center gap-1">
                    {activeTab === 'leads' ? (
                      /* Lead Actions: Book Appointment or Complete with Outcome */
                      <>
                        <button
                          onClick={() => handleBookAppointmentFromFollowup(item)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1769D2] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Book Appointment from Lead"
                        >
                          <CalendarPlus size={12} />
                          <span>Book</span>
                        </button>

                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompleteLeadFollowup(item)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            <span>Done</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 px-2 py-1">
                            <CheckCircle2 size={13} />
                            <span>Fulfilled</span>
                          </span>
                        )}
                      </>
                    ) : (
                      /* Patient Actions: Book Next Session or Mark Completed */
                      <>
                        <button
                          onClick={() => handleBookAppointmentFromFollowup(item)}
                          className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Schedule Next Appointment"
                        >
                          <CalendarPlus size={12} />
                          <span>Schedule Appt</span>
                        </button>

                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompletePatientFollowup(item)}
                            className="px-3 py-1.5 rounded-xl bg-[#092C60] hover:bg-blue-900 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            <span>Mark Done</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 px-2 py-1">
                            <CheckCircle2 size={13} />
                            <span>Completed</span>
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
