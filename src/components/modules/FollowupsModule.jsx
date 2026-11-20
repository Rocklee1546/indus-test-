import React, { useState, useMemo } from 'react';
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
  Trash2,
  Layers
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

  // Delete confirmation state (can hold single card or item)
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper: get previous day YYYY-MM-DD
  const getPrevDay = (dateStr) => {
    try {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const dt = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        dt.setDate(dt.getDate() - 1);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    } catch (e) {
      return dateStr;
    }
  };

  // Dynamic individual item status helper
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

  // Distinct raw lists
  const leadFollowupsRaw = useMemo(() => {
    return filteredFollowups.filter(f => f.personType === 'lead' || !!f.leadId);
  }, [filteredFollowups]);

  const patientFollowupsRaw = useMemo(() => {
    // Avoid duplicate lead conversion cards inside patient tab
    return filteredFollowups.filter(f => (f.personType === 'patient' || !!f.patientId) && !f.leadId);
  }, [filteredFollowups]);

  // ── Consolidated Lead Cards (Combine multiple follow-ups for one lead into a single card) ──
  const consolidatedLeadCards = useMemo(() => {
    const map = new Map();

    leadFollowupsRaw.forEach(item => {
      const key = item.leadId || item.phone || item.targetName;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
    });

    const cards = [];
    map.forEach((items, groupKey) => {
      // Resolve the correct name from leads registry — prevents blank/undefined names
      const leadRecord = items[0].leadId ? leads.find(l => l.id === items[0].leadId) : null;
      const resolvedName = leadRecord?.name || items[0].targetName || 'Unknown Lead';
      const resolvedPhone = leadRecord?.phone || items[0].phone || '';
      const resolvedTreatment = leadRecord?.treatment || items[0].treatment || '';

      // Only show if the lead exists in the registry (no orphaned follow-ups)
      if (!leadRecord && !items[0].targetName) return;

      // Pick primary item: pending items preferred over completed
      const pendingItems = items.filter(i => i.status !== 'Completed' && i.status !== 'Cancelled');
      const dueTodayItem = pendingItems.find(i => evaluateFollowup(i) === 'Due Today');
      const overdueItem = pendingItems.find(i => evaluateFollowup(i) === 'Overdue');
      const primaryItem = dueTodayItem || overdueItem || pendingItems[0] || items[0];

      // Computed status for consolidated lead card
      let computedStatus = 'Pending';
      if (items.every(i => i.status === 'Completed')) {
        computedStatus = 'Completed';
      } else if (items.every(i => i.status === 'Cancelled')) {
        computedStatus = 'Cancelled';
      } else if (pendingItems.some(i => evaluateFollowup(i) === 'Due Today')) {
        computedStatus = 'Due Today';
      } else if (pendingItems.some(i => evaluateFollowup(i) === 'Overdue')) {
        computedStatus = 'Overdue';
      } else if (pendingItems.some(i => i.status === 'Rescheduled')) {
        computedStatus = 'Rescheduled';
      } else {
        computedStatus = 'Pending';
      }

      cards.push({
        id: `LEAD-CARD-${groupKey}`,
        groupKey,
        isAppointment: false,
        leadId: primaryItem.leadId,
        patientId: primaryItem.patientId || null,
        targetName: resolvedName,
        phone: resolvedPhone,
        treatment: resolvedTreatment,
        assignedTo: primaryItem.assignedTo,
        lastContactChannel: primaryItem.lastContactChannel,
        scheduledDate: primaryItem.scheduledDate,
        scheduledTime: primaryItem.scheduledTime,
        cardCategory: primaryItem.category || 'Lead Follow-up',
        computedStatus,
        primaryItem,
        items
      });
    });

    return cards;
  }, [leadFollowupsRaw, leads, todayStr]);

  // ── Consolidated Patient Cards (Combine 1-Day Before & Same-Day Reminders into one card) ──
  const consolidatedPatientCards = useMemo(() => {
    const map = new Map();

    patientFollowupsRaw.forEach(item => {
      let key;
      if (item.appointmentId) {
        key = `appt_${item.appointmentId}`;
      } else if (
        (item.category === 'Appointment Reminder' || item.category === 'Appointment Confirmation') &&
        item.appointmentDate &&
        (item.patientId || item.targetName)
      ) {
        key = `appt_${item.patientId || item.targetName}_${item.appointmentDate}`;
      } else {
        key = `pat_fol_${item.id}`;
      }

      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key).push(item);
    });

    const cards = [];
    map.forEach((items, groupKey) => {
      const isAppointment = groupKey.startsWith('appt_') || items.some(i => i.appointmentId || i.reminderType || i.category === 'Appointment Reminder');

      // Resolve the correct patient name from registry — fixes blank name bug for multi-reminder patients
      const patientRecord = items[0].patientId ? patients.find(p => p.id === items[0].patientId) : null;
      const resolvedPatientName = patientRecord?.name || items[0].targetName || 'Unknown Patient';
      const resolvedPhone = patientRecord?.phone || items[0].phone || '';

      if (isAppointment) {
        // Find 1-Day Before and Same-Day reminders
        const reminder1D = items.find(i =>
          i.reminderType?.includes('1 Day Before') ||
          i.reminderType?.includes('Pre-Visit') ||
          i.id?.endsWith('-1D')
        );
        const reminderSame = items.find(i =>
          i.reminderType?.includes('Same-Day') ||
          i.id?.endsWith('-SAME') ||
          (i !== reminder1D && items.length > 1)
        );

        const appointmentDate =
          reminderSame?.appointmentDate ||
          reminderSame?.scheduledDate ||
          reminder1D?.appointmentDate ||
          items[0].appointmentDate ||
          items[0].scheduledDate;

        const appointmentTime =
          reminderSame?.appointmentTime ||
          reminderSame?.scheduledTime ||
          reminder1D?.appointmentTime ||
          items[0].appointmentTime ||
          items[0].scheduledTime ||
          '10:00 AM';

        const prevDay = reminder1D?.scheduledDate || getPrevDay(appointmentDate);
        const doctorName = items[0].doctorName || items[0].assignedTo;

        // Dynamic Card Category Banner
        let cardCategory = 'Appointment Reminder';
        if (todayStr === prevDay) {
          cardCategory = "Tomorrow's Appointment Reminder";
        } else if (todayStr === appointmentDate) {
          cardCategory = "Today's Appointment Reminder";
        }

        // Card Computed Status
        const allCompleted = items.every(i => i.status === 'Completed');
        let computedStatus = 'Pending';

        if (allCompleted) {
          computedStatus = 'Completed';
        } else if (todayStr === prevDay) {
          computedStatus = reminder1D?.status === 'Completed' ? 'Completed' : 'Due Today';
        } else if (todayStr === appointmentDate) {
          computedStatus = reminderSame?.status === 'Completed' ? 'Completed' : 'Due Today';
        } else if (todayStr > appointmentDate) {
          computedStatus = 'Overdue';
        } else if (todayStr > prevDay && reminder1D && reminder1D.status !== 'Completed') {
          computedStatus = 'Overdue';
        } else {
          computedStatus = 'Pending';
        }

        const primaryItem = (todayStr === appointmentDate && reminderSame) ? reminderSame : (reminder1D || items[0]);

        cards.push({
          id: `APPT-CARD-${groupKey}`,
          groupKey,
          isAppointment: true,
          appointmentId: items[0].appointmentId || null,
          patientId: items[0].patientId,
          targetName: resolvedPatientName,
          phone: resolvedPhone,
          treatment: items[0].treatment || 'Dental Consultation',
          doctorName,
          appointmentDate,
          appointmentTime,
          prevDay,
          reminder1D,
          reminderSame,
          cardCategory,
          computedStatus,
          assignedTo: items[0].assignedTo,
          lastContactChannel: items[0].lastContactChannel,
          primaryItem,
          items
        });
      } else {
        // Regular patient clinical follow-up / recall (e.g. 6-month checkup, post-op)
        const primaryItem = items[0];
        const computedStatus = evaluateFollowup(primaryItem);

        cards.push({
          id: `PAT-CARD-${groupKey}`,
          groupKey,
          isAppointment: false,
          patientId: primaryItem.patientId,
          targetName: resolvedPatientName,
          phone: resolvedPhone,
          treatment: primaryItem.treatment,
          cardCategory: primaryItem.category || 'Patient Follow-up',
          computedStatus,
          scheduledDate: primaryItem.scheduledDate,
          scheduledTime: primaryItem.scheduledTime,
          assignedTo: primaryItem.assignedTo,
          lastContactChannel: primaryItem.lastContactChannel,
          primaryItem,
          items
        });
      }
    });

    return cards;
  }, [patientFollowupsRaw, todayStr]);

  // Tab badge counts (calculated strictly on consolidated cards)
  const leadCounts = useMemo(() => ({
    total: consolidatedLeadCards.length,
    dueToday: consolidatedLeadCards.filter(c => c.computedStatus === 'Due Today').length,
    overdue: consolidatedLeadCards.filter(c => c.computedStatus === 'Overdue').length,
    completed: consolidatedLeadCards.filter(c => c.computedStatus === 'Completed').length,
    pending: consolidatedLeadCards.filter(c => c.computedStatus === 'Pending' || c.computedStatus === 'Due Today' || c.computedStatus === 'Overdue').length
  }), [consolidatedLeadCards]);

  const patientCounts = useMemo(() => ({
    total: consolidatedPatientCards.length,
    dueToday: consolidatedPatientCards.filter(c => c.computedStatus === 'Due Today').length,
    overdue: consolidatedPatientCards.filter(c => c.computedStatus === 'Overdue').length,
    completed: consolidatedPatientCards.filter(c => c.computedStatus === 'Completed').length,
    pending: consolidatedPatientCards.filter(c => c.computedStatus === 'Pending' || c.computedStatus === 'Due Today' || c.computedStatus === 'Overdue').length
  }), [consolidatedPatientCards]);

  const activeCounts = activeTab === 'leads' ? leadCounts : patientCounts;
  const currentCards = activeTab === 'leads' ? consolidatedLeadCards : consolidatedPatientCards;

  // Filter within active consolidated cards
  const filteredCards = useMemo(() => {
    return currentCards.filter(card => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (card.targetName || '').toLowerCase().includes(q) ||
        (card.phone || '').includes(q) ||
        (card.leadId || '').toLowerCase().includes(q) ||
        (card.patientId || '').toLowerCase().includes(q) ||
        (card.treatment || '').toLowerCase().includes(q) ||
        (card.doctorName || '').toLowerCase().includes(q) ||
        card.items.some(it => (it.reason || '').toLowerCase().includes(q) || (it.id || '').toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'ALL' ||
        card.computedStatus === statusFilter ||
        card.primaryItem?.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'ALL' ||
        card.cardCategory === categoryFilter ||
        card.items.some(it => it.category === categoryFilter);

      const matchesDoctor =
        doctorFilter === 'ALL' ||
        (card.doctorName || '').includes(doctorFilter) ||
        (card.assignedTo || '').includes(doctorFilter);

      return matchesSearch && matchesStatus && matchesCategory && matchesDoctor;
    });
  }, [currentCards, searchQuery, statusFilter, categoryFilter, doctorFilter]);

  // Profile opening
  const handleOpenProfile = (card) => {
    if (card.leadId) {
      setSelectedLeadId(card.leadId);
      setIsLeadDetailsOpen(true);
    } else if (card.patientId) {
      const p = patients.find(pat => pat.id === card.patientId);
      if (p) {
        setPatient360Data(p);
      } else {
        setActivePatientId(card.patientId);
      }
    }
  };

  // WhatsApp
  const handleOpenWhatsApp = (card) => {
    const it = card.primaryItem;
    setWhatsAppData({
      recipientName: card.targetName,
      phone: card.phone,
      treatment: card.treatment,
      leadId: card.leadId || null,
      patientId: card.patientId || null,
      defaultTemplateId: card.cardCategory?.includes('Check-up')
        ? 'TMP-10'
        : card.cardCategory?.includes('Reminder') || card.cardCategory?.includes('Confirmation')
        ? 'TMP-05'
        : card.cardCategory?.includes('Post-Treatment')
        ? 'TMP-09'
        : 'TMP-04'
    });
    setIsWhatsAppModalOpen(true);
  };

  // Reschedule
  const handleReschedule = (card) => {
    const it = card.primaryItem;
    setRescheduleData({
      followupId: it.id,
      currentDate: card.appointmentDate || it.scheduledDate,
      currentTime: card.appointmentTime || it.scheduledTime,
      currentReason: it.reason,
      leadId: card.leadId,
      appointmentId: card.appointmentId
    });
    setIsRescheduleModalOpen(true);
  };

  // Lead Follow-up Completion (opens Outcome Modal)
  const handleCompleteLeadFollowup = (card) => {
    setFollowupOutcomeData(card.primaryItem);
    setIsFollowupOutcomeOpen(true);
  };

  // Patient Follow-up Completion (marks all companion items in consolidated card as completed)
  const handleCompletePatientFollowup = (card) => {
    card.items.forEach(it => {
      if (it.status !== 'Completed') {
        completeFollowupTask(it.id, 'Clinical follow-up successfully addressed.');
      }
    });
  };

  // Direct Book Appointment from Follow-up
  const handleBookAppointmentFromFollowup = (card) => {
    if (card.leadId) {
      const lead = leads.find(l => l.id === card.leadId);
      if (lead) {
        setLeadToBookAppt(lead);
        setIsBookApptSlotOpen(true);
      }
    } else if (card.patientId) {
      const patient = patients.find(p => p.id === card.patientId);
      if (patient) {
        openBookAppointment(patient);
      }
    }
  };

  // Delete handlers: deletes all follow-up events in the consolidated card
  const handleDeleteFollowup = (card) => setDeleteConfirm(card);

  const confirmDeleteFollowup = () => {
    if (deleteConfirm) {
      const idsToDelete = deleteConfirm.items ? deleteConfirm.items.map(i => i.id) : [deleteConfirm.id];
      deleteFollowup(idsToDelete);
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
                <p className="text-xs text-slate-500 mt-0.5">This action will remove this patient card.</p>
              </div>
            </div>
            <div className="bg-rose-50 rounded-2xl p-3 mb-5 text-xs text-slate-700 leading-relaxed">
              <div className="font-bold text-[#102A50]">{deleteConfirm.targetName}</div>
              <div className="text-slate-500">{deleteConfirm.cardCategory}</div>
              <div className="text-slate-500">
                {deleteConfirm.treatment} · {deleteConfirm.appointmentDate || deleteConfirm.scheduledDate}
              </div>
              {deleteConfirm.items && deleteConfirm.items.length > 1 && (
                <div className="text-[11px] text-rose-700 mt-1 font-semibold">
                  Includes {deleteConfirm.items.length} reminder schedules.
                </div>
              )}
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
                  Pre-visit reminders, same-day reminders & clinical recalls
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

        {/* Categories (Context-sensitive to active tab) */}
        {activeTab === 'patients' ? (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="Appointment Reminder">Appointment Reminders</option>
            <option value="Tomorrow's Appointment Reminder">Tomorrow's Appointment Reminder</option>
            <option value="Today's Appointment Reminder">Today's Appointment Reminder</option>
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
            <option value="Keerthana">Dr. Keerthana Mohan</option>
          </select>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.length === 0 ? (
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
                : 'No pending reminders or clinical recalls.'}
            </p>
          </div>
        ) : (
          filteredCards.map(card => {
            const isCompleted = card.computedStatus === 'Completed';

            return (
              <div
                key={card.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  card.computedStatus === 'Overdue'
                    ? 'border-rose-200 shadow-rose-100/40 shadow-md'
                    : card.computedStatus === 'Due Today'
                    ? 'border-amber-200 shadow-amber-100/40 shadow-md ring-1 ring-amber-300/60'
                    : 'border-slate-200/80 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Card Header: Category + Status */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 truncate max-w-[200px]">
                      {card.cardCategory}
                    </span>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : card.computedStatus === 'Due Today'
                        ? 'bg-amber-100 text-amber-900 font-extrabold animate-pulse'
                        : card.computedStatus === 'Overdue'
                        ? 'bg-rose-100 text-rose-800 font-extrabold'
                        : 'bg-blue-100 text-[#1769D2]'
                    }`}>
                      {card.computedStatus}
                    </span>
                  </div>

                  {/* Target Name + ID (Rendered ONLY once) */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => handleOpenProfile(card)}
                        className="font-extrabold text-sm text-[#102A50] hover:text-[#1769D2] transition-colors flex items-center gap-1 cursor-pointer text-left"
                      >
                        <span>{card.targetName}</span>
                        <ExternalLink size={11} className="text-slate-400" />
                      </button>
                      <div className="text-[11px] font-bold text-[#1769D2] mt-0.5">
                        {card.treatment}
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-400 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 shrink-0">
                      {card.leadId ? `Lead: ${card.leadId}` : `UHID: ${card.patientId || 'IND'}`}
                    </span>
                  </div>

                  {/* ── APPOINTMENT CARD: Combined Schedule & Dual Reminder Box ── */}
                  {card.isAppointment ? (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 space-y-2">
                      {/* Appointment Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <div className="flex items-center gap-1.5 font-black text-xs text-[#102A50]">
                          <Calendar size={13} className="text-[#1769D2]" />
                          <span>Appt: {card.appointmentDate} at {card.appointmentTime}</span>
                        </div>
                        {card.doctorName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1769D2] border border-blue-100 truncate max-w-[120px]">
                            {card.doctorName}
                          </span>
                        )}
                      </div>

                      {/* Dual Reminder Timeline Schedule */}
                      <div className="space-y-1.5 pt-0.5">
                        {/* Event 1: Pre-Visit Reminder (1 Day Before) */}
                        <div className={`p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                          todayStr === card.prevDay && card.reminder1D?.status !== 'Completed'
                            ? 'bg-amber-50 border border-amber-200 text-amber-950 font-bold shadow-xs'
                            : 'bg-white border border-slate-200/60 text-slate-700'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className={todayStr === card.prevDay ? 'text-amber-600' : 'text-slate-400'} />
                            <div>
                              <span className="font-bold text-[11px]">1 Day Before Reminder:</span>
                              <span className="text-[11px] text-slate-500 ml-1">({card.prevDay})</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                            card.reminder1D?.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : todayStr === card.prevDay
                              ? 'bg-amber-200 text-amber-900 animate-pulse'
                              : todayStr > card.prevDay
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {card.reminder1D?.status === 'Completed' ? '✓ Done' : todayStr === card.prevDay ? 'Due Today' : todayStr > card.prevDay ? 'Past' : 'Upcoming'}
                          </span>
                        </div>

                        {/* Event 2: Same-Day Visit Reminder */}
                        <div className={`p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                          todayStr === card.appointmentDate && card.reminderSame?.status !== 'Completed'
                            ? 'bg-amber-50 border border-amber-200 text-amber-950 font-bold shadow-xs'
                            : 'bg-white border border-slate-200/60 text-slate-700'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} className={todayStr === card.appointmentDate ? 'text-amber-600' : 'text-slate-400'} />
                            <div>
                              <span className="font-bold text-[11px]">Appointment-Day Reminder:</span>
                              <span className="text-[11px] text-slate-500 ml-1">({card.appointmentDate})</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                            card.reminderSame?.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : todayStr === card.appointmentDate
                              ? 'bg-amber-200 text-amber-900 animate-pulse'
                              : todayStr > card.appointmentDate
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-50 text-[#1769D2]'
                          }`}>
                            {card.reminderSame?.status === 'Completed' ? '✓ Done' : todayStr === card.appointmentDate ? 'Due Today' : todayStr > card.appointmentDate ? 'Past' : `Scheduled for ${card.appointmentDate}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── REGULAR CLINICAL RECALL OR CONSOLIDATED LEAD CARD ── */
                    <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-600 leading-relaxed space-y-1.5">
                      {card.items && card.items.length > 1 ? (
                        <div>
                          <div className="flex items-center gap-1 font-bold text-[11px] text-slate-700 mb-1">
                            <Layers size={11} className="text-[#1769D2]" />
                            <span>{card.items.length} Follow-Up Tasks Consolidated:</span>
                          </div>
                          {card.items.map((it, idx) => (
                            <div key={it.id || idx} className="text-[11px] text-slate-600 py-0.5 border-t border-slate-200/40 first:border-0 flex items-start justify-between gap-1">
                              <span>• {it.reason || it.category}</span>
                              <span className="text-[10px] text-slate-400 shrink-0 font-medium">{it.scheduledDate}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>{card.primaryItem?.reason || 'Follow-up consultation required.'}</div>
                      )}

                      {card.primaryItem?.outcome && (
                        <div className="pt-1.5 border-t border-slate-200/60 font-bold text-[10px] text-emerald-700">
                          Outcome: {card.primaryItem.outcome} {card.primaryItem.outcomeNotes ? `(${card.primaryItem.outcomeNotes})` : ''}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metadata: Phone, Slot, Assigned */}
                  <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Phone size={11} className="text-slate-400" />
                        {card.phone}
                      </span>
                      <span className="font-extrabold text-[#102A50]">
                        Slot: {card.appointmentTime || card.scheduledTime || '11:00 AM'} ({card.appointmentDate || card.scheduledDate})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Assigned: {card.assignedTo || 'Front Desk'}</span>
                      <span>Channel: {card.lastContactChannel || 'WhatsApp'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    {/* Call simulation */}
                    <button
                      onClick={() => showToast(`Calling ${card.targetName} (${card.phone})...`)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#102A50] flex items-center justify-center transition-colors cursor-pointer"
                      title="Simulate Phone Call"
                    >
                      <Phone size={13} />
                    </button>

                    {/* WhatsApp */}
                    <button
                      onClick={() => handleOpenWhatsApp(card)}
                      className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors cursor-pointer"
                      title="Send WhatsApp Message"
                    >
                      <MessageSquare size={13} />
                    </button>

                    {/* Reschedule */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleReschedule(card)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                    )}

                    {/* Delete Follow-up (deletes all companion reminder items) */}
                    <button
                      onClick={() => handleDeleteFollowup(card)}
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
                          onClick={() => handleBookAppointmentFromFollowup(card)}
                          className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#1769D2] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Book Appointment from Lead"
                        >
                          <CalendarPlus size={12} />
                          <span>Book</span>
                        </button>

                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompleteLeadFollowup(card)}
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
                      /* Patient Actions: Schedule Appt or Mark Done */
                      <>
                        <button
                          onClick={() => handleBookAppointmentFromFollowup(card)}
                          className="px-2.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Schedule Next Appointment"
                        >
                          <CalendarPlus size={12} />
                          <span>Schedule Appt</span>
                        </button>

                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompletePatientFollowup(card)}
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
