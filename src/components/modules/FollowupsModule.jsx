import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getTodayDateStr } from '../../utils/dateFilterUtils';
import {
  Clock,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  CalendarDays,
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
  Layers,
  LayoutGrid,
  Star,
  Users,
  UserPlus
} from 'lucide-react';
import { PATIENT_FOLLOWUP_CATEGORIES } from '../modals/AddPatientFollowupModal';

// ── Official WhatsApp Brand Icon ──────────────────────────────────────────
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

// ── 3-Person Team Group Icon for Prospective Leads ────────────────────────
function ThreeUsersIcon({ className = "w-5 h-5 text-white" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="6.5" r="3" />
      <path d="M12 11c-2.8 0-5.2 1.5-5.8 4-.1.6.4 1.1 1 1.1h9.6c.6 0 1.1-.5 1-1.1-.6-2.5-3-4-5.8-4z" />
      <circle cx="5" cy="8.5" r="2.2" opacity="0.9" />
      <path d="M5 12.2c-1.8 0-3.4 1-3.8 2.6-.1.5.3.8.8.8h2.6c-.1-.4-.2-.8-.2-1.2 0-1 .3-1.8.9-2.5-.1.1-.2.2-.3.3z" opacity="0.9" />
      <circle cx="19" cy="8.5" r="2.2" opacity="0.9" />
      <path d="M19 12.2c.1 0 .2 0 .3-.3.6.7.9 1.5.9 2.5 0 .4-.1.8-.2 1.2h2.6c.5 0 .9-.3.8-.8-.4-1.6-2-2.6-3.8-2.6h-.6z" opacity="0.9" />
    </svg>
  );
}

// ── Category Badge Color Helper ───────────────────────────────────────────
function getCategoryBadgeClass(category = '') {
  const c = category.toLowerCase();
  if (c.includes('interested')) {
    return 'bg-[#FFF4E8] text-[#D97706] border border-[#FED7AA]/60';
  }
  if (c.includes('first contact') || c.includes('initial')) {
    return 'bg-[#EFF6FF] text-[#1670E8] border border-[#BFDBFE]/60';
  }
  if (c.includes('new lead')) {
    return 'bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD]/60';
  }
  if (c.includes('reminder') || c.includes('confirmation')) {
    return 'bg-[#F3ECFF] text-[#7E22CE] border border-[#E9D5FF]/60';
  }
  if (c.includes('check-up') || c.includes('recall') || c.includes('post-treatment')) {
    return 'bg-[#E6F8F0] text-[#16A34A] border border-[#BBF7D0]/60';
  }
  return 'bg-slate-100 text-slate-700 border border-slate-200';
}

export default function FollowupsModule() {
  const {
    followups,
    filteredFollowups,
    leads,
    patients,
    doctors,
    activeDoctors,
    appointments,
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
    showToast,
    followupStatusFilter,
    setFollowupStatusFilter,
    followupActiveTab,
    setFollowupActiveTab
  } = useApp();

  // Primary Tab: 'leads' vs 'patients'
  const [activeTab, setActiveTab] = useState(followupActiveTab || 'leads');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(followupStatusFilter || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [doctorFilter, setDoctorFilter] = useState('ALL');

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // IST-safe today string
  const todayStr = getTodayDateStr();

  // Sync when dashboard navigates here with filter preset
  useEffect(() => {
    if (followupActiveTab && followupActiveTab !== activeTab) {
      setActiveTab(followupActiveTab);
    }
    if (followupStatusFilter && followupStatusFilter !== 'ALL') {
      setStatusFilter(followupStatusFilter);
      // Clear preset after consuming so back-navigation doesn't re-apply
      setFollowupStatusFilter('ALL');
    }
    if (followupActiveTab) {
      setFollowupActiveTab('leads'); // reset to default
    }
  }, [followupActiveTab, followupStatusFilter]);

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
    return filteredFollowups.filter(f => {
      if (!(f.personType === 'lead' || !!f.leadId)) return false;
      // Skip follow-ups whose lead has been deleted
      if (f.leadId) {
        const leadRecord = leads.find(l => l.id === f.leadId);
        if (!leadRecord || leadRecord.isDeleted) return false;
      }
      return true;
    });
  }, [filteredFollowups, leads]);

  const patientFollowupsRaw = useMemo(() => {
    return filteredFollowups.filter(f => (f.personType === 'patient' || !!f.patientId) && !f.leadId);
  }, [filteredFollowups]);

  // ── Consolidated Lead Cards ───────────────────────────────────────────────
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
      const leadRecord = items[0].leadId ? leads.find(l => l.id === items[0].leadId) : null;
      // Skip cards for deleted leads
      if (leadRecord?.isDeleted) return;
      const resolvedName = leadRecord?.name || items[0].targetName || 'Unknown Lead';
      const resolvedPhone = leadRecord?.phone || items[0].phone || '';
      const resolvedTreatment = leadRecord?.treatment || items[0].treatment || '';

      if (!leadRecord && !items[0].targetName) return;

      const pendingItems = items.filter(i => i.status !== 'Completed' && i.status !== 'Cancelled');
      const dueTodayItem = pendingItems.find(i => evaluateFollowup(i) === 'Due Today');
      const overdueItem = pendingItems.find(i => evaluateFollowup(i) === 'Overdue');
      const primaryItem = dueTodayItem || overdueItem || pendingItems[0] || items[0];

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

  // ── Consolidated Patient Cards ────────────────────────────────────────────
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

      const patientRecord = items[0].patientId ? patients.find(p => p.id === items[0].patientId) : null;
      const resolvedPatientName = patientRecord?.name || items[0].targetName || 'Unknown Patient';
      const resolvedPhone = patientRecord?.phone || items[0].phone || '';

      // Doctor resolution from central Doctor Management
      const resolveCardDoctor = (item) => {
        if (!item) return { id: null, name: 'Unassigned' };
        if (item.doctorId) {
          const doc = (doctors || []).find(d => d.id === item.doctorId);
          if (doc) return { id: doc.id, name: doc.name };
        }
        if (item.appointmentId) {
          const appt = (appointments || []).find(a => a.id === item.appointmentId);
          if (appt) {
            if (appt.doctorId) {
              const doc = (doctors || []).find(d => d.id === appt.doctorId);
              if (doc) return { id: doc.id, name: doc.name };
            }
            if (appt.doctorName) {
              const doc = (doctors || []).find(d => d.name.toLowerCase() === appt.doctorName.toLowerCase());
              if (doc) return { id: doc.id, name: doc.name };
              return { id: null, name: appt.doctorName };
            }
          }
        }
        if (item.doctorName) {
          const doc = (doctors || []).find(d => d.name.toLowerCase() === item.doctorName.toLowerCase() || d.name.toLowerCase().includes(item.doctorName.toLowerCase()) || item.doctorName.toLowerCase().includes(d.name.toLowerCase()));
          if (doc) return { id: doc.id, name: doc.name };
          return { id: null, name: item.doctorName };
        }
        if (item.assignedTo) {
          const doc = (doctors || []).find(d => item.assignedTo.toLowerCase().includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(item.assignedTo.toLowerCase()));
          if (doc) return { id: doc.id, name: doc.name };
        }
        return { id: null, name: 'Unassigned' };
      };

      if (isAppointment) {
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
        const docInfo = resolveCardDoctor(items[0]);
        const doctorName = docInfo.name;
        const doctorId = docInfo.id;

        let cardCategory = 'Appointment Reminder';
        if (todayStr === prevDay) {
          cardCategory = "Tomorrow's Appointment Reminder";
        } else if (todayStr === appointmentDate) {
          cardCategory = "Today's Appointment Reminder";
        }

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
          doctorId,
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
        const primaryItem = items[0];
        const computedStatus = evaluateFollowup(primaryItem);
        const docInfo = resolveCardDoctor(primaryItem);

        cards.push({
          id: `PAT-CARD-${groupKey}`,
          groupKey,
          isAppointment: false,
          patientId: primaryItem.patientId,
          targetName: resolvedPatientName,
          phone: resolvedPhone,
          treatment: primaryItem.treatment,
          doctorId: docInfo.id,
          doctorName: docInfo.name,
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
  }, [patientFollowupsRaw, todayStr, doctors, appointments]);

  // Tab badge counts (Task count must strictly include only incomplete follow-ups)
  const leadCounts = useMemo(() => {
    const incompleteCards = consolidatedLeadCards.filter(c => c.computedStatus !== 'Completed' && c.computedStatus !== 'Cancelled');
    const dueToday = consolidatedLeadCards.filter(c => c.computedStatus === 'Due Today').length;
    const overdue = consolidatedLeadCards.filter(c => c.computedStatus === 'Overdue').length;
    const completed = consolidatedLeadCards.filter(c => c.computedStatus === 'Completed').length;
    const tasks = incompleteCards.length;

    return {
      total: tasks, // Only incomplete tasks
      tasks,
      dueToday,
      overdue,
      completed,
      pending: tasks
    };
  }, [consolidatedLeadCards]);

  const patientCounts = useMemo(() => {
    const incompleteCards = consolidatedPatientCards.filter(c => c.computedStatus !== 'Completed' && c.computedStatus !== 'Cancelled');
    const dueToday = consolidatedPatientCards.filter(c => c.computedStatus === 'Due Today').length;
    const overdue = consolidatedPatientCards.filter(c => c.computedStatus === 'Overdue').length;
    const completed = consolidatedPatientCards.filter(c => c.computedStatus === 'Completed').length;
    const tasks = incompleteCards.length;

    return {
      total: tasks, // Only incomplete tasks
      tasks,
      dueToday,
      overdue,
      completed,
      pending: tasks
    };
  }, [consolidatedPatientCards]);

  const totalCenterDueToday = leadCounts.dueToday + patientCounts.dueToday;
  const totalCenterOverdue = leadCounts.overdue + patientCounts.overdue;

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
        (statusFilter === 'Due Today'
          ? card.computedStatus === 'Due Today'
          : card.computedStatus === statusFilter || card.primaryItem?.status === statusFilter);

      const matchesCategory =
        categoryFilter === 'ALL' ||
        card.cardCategory === categoryFilter ||
        card.items.some(it => it.category === categoryFilter);

      const matchesDoctor =
        doctorFilter === 'ALL' ||
        card.doctorId === doctorFilter ||
        card.doctorName === doctorFilter ||
        (card.doctorName || '').toLowerCase().includes(doctorFilter.toLowerCase());

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

  // Lead Follow-up Completion
  const handleCompleteLeadFollowup = (card) => {
    setFollowupOutcomeData(card.primaryItem);
    setIsFollowupOutcomeOpen(true);
  };

  // Patient Follow-up Completion
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

  // Delete handlers
  const handleDeleteFollowup = (card) => setDeleteConfirm(card);

  const confirmDeleteFollowup = () => {
    if (deleteConfirm) {
      const idsToDelete = deleteConfirm.items ? deleteConfirm.items.map(i => i.id) : [deleteConfirm.id];
      deleteFollowup(idsToDelete);
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in pb-10">
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
                <p className="text-xs text-slate-500 mt-0.5">This action will remove this card.</p>
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

      {/* ── 1. Page Header (Matching Reference Image 1) ─────────────────────── */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          {/* Prominent blue calendar icon in rounded-square container */}
          <div className="w-12 h-12 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1670E8] flex items-center justify-center shrink-0 shadow-2xs">
            <CalendarDays size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#102A50] tracking-tight">
                Follow-Up & Recall Management Centre
              </h1>

              {/* Due Today Pill */}
              <span className="bg-[#FFF4E8] text-[#EA580C] border border-[#FED7AA] font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                <Clock size={12} className="text-[#EA580C]" />
                <span>Due Today · {totalCenterDueToday}</span>
              </span>

              {/* Overdue Pill */}
              {totalCenterOverdue > 0 && (
                <span className="bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <AlertTriangle size={12} className="text-[#DC2626]" />
                  <span>Overdue · {totalCenterOverdue}</span>
                </span>
              )}
            </div>

            <p className="text-xs text-[#7186A5] font-medium mt-1">
              Track patient follow-ups, manage recalls and keep your patients on schedule
            </p>
          </div>
        </div>

        {/* Right Watermark Accent matching Reference Image 1 */}
        <div className="hidden lg:flex items-center gap-2.5 select-none opacity-85 shrink-0 pl-4 border-l border-slate-100">
          <svg className="w-9 h-9 text-[#1670E8]/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 2.5 9.5 1 3.5 2.5 4.5 3.5 4.5s1.5-2 2-4c.5 2 1 4 2 4s2.5-1 3.5-4.5C18.5 14 20 11 20 8c0-3.5-3.5-6-8-6z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-left">
            <div className="font-serif italic text-xs font-semibold text-[#102A50]">Healthy Smiles...</div>
            <div className="font-serif italic text-[11px] text-[#1670E8]">Our Priority</div>
          </div>
        </div>
      </div>

      {/* ── 2. Two Distinct Primary Category Cards with Dynamic Selection Highlight ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card 1: 1. Prospective Lead Follow-Ups */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('leads');
            setCategoryFilter('ALL');
            setStatusFilter('ALL');
          }}
          className={`p-5 rounded-3xl text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
            activeTab === 'leads'
              ? 'bg-gradient-to-r from-[#0C294F] via-[#0E3A75] to-[#1253A4] text-white shadow-xl shadow-blue-900/20 ring-2 ring-blue-300'
              : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:bg-slate-50/60 text-slate-800'
          }`}
        >
          {/* Subtle faint tooth watermark on selected gradient */}
          {activeTab === 'leads' && (
            <svg className="absolute -bottom-3 -right-3 w-24 h-24 text-white/5 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 2.5 9.5 1 3.5 2.5 4.5 3.5 4.5s1.5-2 2-4c.5 2 1 4 2 4s2.5-1 3.5-4.5C18.5 14 20 11 20 8c0-3.5-3.5-6-8-6z" />
            </svg>
          )}

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              {/* Circular icon container */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                activeTab === 'leads'
                  ? 'bg-blue-600/90 border border-white/25 text-white shadow-md'
                  : 'bg-blue-50 text-[#1670E8] border border-blue-200/70 shadow-2xs'
              }`}>
                <ThreeUsersIcon className={`w-5 h-5 ${activeTab === 'leads' ? 'text-white' : 'text-[#1670E8]'}`} />
              </div>
              <div>
                <h3 className={`font-extrabold text-sm sm:text-base tracking-wide transition-colors ${
                  activeTab === 'leads' ? 'text-white' : 'text-[#102A50]'
                }`}>
                  1. Prospective Lead Follow-Ups
                </h3>
                <p className={`text-xs font-medium mt-0.5 transition-colors ${
                  activeTab === 'leads' ? 'text-blue-100/90' : 'text-[#7186A5]'
                }`}>
                  Enquiries, treatment quotes & appointment confirmations
                </p>
              </div>
            </div>

            {/* Task Count Badge */}
            <span className={`font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'leads'
                ? 'bg-white text-[#102A50]'
                : 'bg-slate-100 text-[#102A50]'
            }`}>
              <span>{leadCounts.total} Tasks</span>
              <ChevronRight size={13} className="text-[#102A50]" />
            </span>
          </div>

          {/* Bottom Status Row */}
          <div className={`flex items-center gap-3 mt-4 pt-3 text-xs font-semibold relative z-10 flex-wrap transition-all ${
            activeTab === 'leads' ? 'border-t border-white/15' : 'border-t border-slate-100'
          }`}>
            {activeTab === 'leads' ? (
              <>
                <span className="text-sky-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Due Today: <b className="font-extrabold text-white">{leadCounts.dueToday || '-'}</b>
                </span>
                <span className="text-white/30">•</span>
                <span className="text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Overdue: <b className="font-extrabold text-white">{leadCounts.overdue || 0}</b>
                </span>
                <span className="text-white/30">•</span>
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Completed: <b className="font-extrabold text-white">{leadCounts.completed || 0}</b>
                </span>
              </>
            ) : (
              <>
                <span className="text-[#1670E8] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1670E8]"></span>
                  Due Today: <b className="font-extrabold text-[#102A50]">{leadCounts.dueToday || '-'}</b>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Overdue: <b className="font-extrabold text-rose-700">{leadCounts.overdue || 0}</b>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Completed: <b className="font-extrabold text-emerald-800">{leadCounts.completed || 0}</b>
                </span>
              </>
            )}
          </div>
        </button>

        {/* Card 2: 2. Existing Patient Follow-Ups */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('patients');
            setCategoryFilter('ALL');
            setStatusFilter('ALL');
          }}
          className={`p-5 rounded-3xl text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
            activeTab === 'patients'
              ? 'bg-gradient-to-r from-[#0C294F] via-[#0E3A75] to-[#1253A4] text-white shadow-xl shadow-blue-900/20 ring-2 ring-blue-300'
              : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:bg-slate-50/60 text-slate-800'
          }`}
        >
          {/* Subtle faint tooth watermark on selected gradient */}
          {activeTab === 'patients' && (
            <svg className="absolute -bottom-3 -right-3 w-24 h-24 text-white/5 pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C7.5 2 4 4.5 4 8c0 3 1.5 6 2.5 9.5 1 3.5 2.5 4.5 3.5 4.5s1.5-2 2-4c.5 2 1 4 2 4s2.5-1 3.5-4.5C18.5 14 20 11 20 8c0-3.5-3.5-6-8-6z" />
            </svg>
          )}

          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-3">
              {/* Circular icon container */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all ${
                activeTab === 'patients'
                  ? 'bg-emerald-600/90 border border-white/25 text-white shadow-md'
                  : 'bg-emerald-50 text-[#16A34A] border border-emerald-200/70 shadow-2xs'
              }`}>
                <UserPlus size={22} className={activeTab === 'patients' ? 'text-white' : 'text-[#16A34A]'} />
              </div>
              <div>
                <h3 className={`font-extrabold text-sm sm:text-base tracking-wide transition-colors ${
                  activeTab === 'patients' ? 'text-white' : 'text-[#102A50]'
                }`}>
                  2. Existing Patient Follow-Ups
                </h3>
                <p className={`text-xs font-medium mt-0.5 transition-colors ${
                  activeTab === 'patients' ? 'text-blue-100/90' : 'text-[#7186A5]'
                }`}>
                  Post-treatment check-ups, routine visits & next visit reminders
                </p>
              </div>
            </div>

            {/* Task Count Badge */}
            <span className={`font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 shrink-0 transition-all ${
              activeTab === 'patients'
                ? 'bg-white text-[#102A50]'
                : 'bg-slate-100 text-[#102A50]'
            }`}>
              <span>{patientCounts.total} Tasks</span>
              {activeTab === 'patients' && <ChevronRight size={13} className="text-[#102A50]" />}
            </span>
          </div>

          {/* Bottom Status Row */}
          <div className={`flex items-center gap-3 mt-4 pt-3 text-xs font-semibold relative z-10 flex-wrap transition-all ${
            activeTab === 'patients' ? 'border-t border-white/15' : 'border-t border-slate-100'
          }`}>
            {activeTab === 'patients' ? (
              <>
                <span className="text-sky-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Due Today: <b className="font-extrabold text-white">{patientCounts.dueToday || '-'}</b>
                </span>
                <span className="text-white/30">•</span>
                <span className="text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  Overdue: <b className="font-extrabold text-white">{patientCounts.overdue || 0}</b>
                </span>
                <span className="text-white/30">•</span>
                <span className="text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Completed: <b className="font-extrabold text-white">{patientCounts.completed || 0}</b>
                </span>
              </>
            ) : (
              <>
                <span className="text-[#1670E8] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1670E8]"></span>
                  Due Today: <b className="font-extrabold text-[#102A50]">{patientCounts.dueToday || '-'}</b>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Overdue: <b className="font-extrabold text-rose-700">{patientCounts.overdue || 0}</b>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Completed: <b className="font-extrabold text-emerald-800">{patientCounts.completed || 0}</b>
                </span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* ── 3. Search & Filter Bar (Matching Reference Image 1) ─────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="text-[#7186A5] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeTab === 'leads' ? "Search lead name, phone, Lead ID, treatment..." : "Search patient name, phone, UHID, treatment..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-[#F8FAFD] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-[#102D55] placeholder:text-[#7186A5] focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        {/* Categories Dropdown with Icon */}
        <div className="relative">
          {activeTab === 'patients' ? (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-3.5 py-2 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
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
              className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-3.5 py-2 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="ALL">All Lead Categories</option>
              <option value="New Lead Follow-up">New Lead Follow-up</option>
              <option value="First Contact Follow-up">First Contact Follow-up</option>
              <option value="Interested Lead Follow-up">Interested Lead Follow-up</option>
            </select>
          )}
        </div>

        {/* Status Filter Dropdown with Star Icon */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-3.5 py-2 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
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
            className="text-xs font-bold bg-[#F8FAFD] border border-slate-200 rounded-xl px-3.5 py-2 text-[#102D55] outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="ALL">All Doctors</option>
            {(activeDoctors && activeDoctors.length > 0 ? activeDoctors : (doctors || []).filter(d => (d.status || 'Active') === 'Active')).map(doc => (
              <option key={doc.id} value={doc.name}>{doc.name}</option>
            ))}
          </select>
        )}

        {/* Patient Tab Action */}
        {activeTab === 'patients' && (
          <button
            onClick={() => setIsAddPatientFollowupOpen(true)}
            className="px-3.5 py-2 bg-[#1670E8] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Schedule Follow-Up</span>
          </button>
        )}
      </div>

      {/* ── 4. Task Cards Grid (Matching Reference Image 1) ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
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
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between shadow-xs hover:shadow-md ${
                  card.computedStatus === 'Overdue'
                    ? 'border-rose-200 shadow-rose-100/30'
                    : card.computedStatus === 'Due Today'
                    ? 'border-amber-200 shadow-amber-100/30'
                    : 'border-slate-200/80'
                }`}
              >
                <div>
                  {/* Card Header: Category Badge + Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getCategoryBadgeClass(card.cardCategory)} truncate max-w-[200px]`}>
                      {card.cardCategory}
                    </span>

                    {/* Status Badge */}
                    {card.computedStatus === 'Due Today' ? (
                      <span className="bg-[#FEF3C7] text-[#D97706] border border-[#FCD34D] font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                        <Clock size={11} className="text-[#D97706]" />
                        <span>Due Today</span>
                      </span>
                    ) : card.computedStatus === 'Overdue' ? (
                      <span className="bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5] font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                        <AlertTriangle size={11} className="text-[#DC2626]" />
                        <span>Overdue</span>
                      </span>
                    ) : isCompleted ? (
                      <span className="bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] font-extrabold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-2xs">
                        <CheckCircle2 size={11} />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-700 font-bold text-[11px] px-2.5 py-0.5 rounded-full shrink-0">
                        {card.computedStatus}
                      </span>
                    )}
                  </div>

                  {/* Target Name + Lead/UHID Pill */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <button
                        onClick={() => handleOpenProfile(card)}
                        className="font-extrabold text-base text-[#102A50] hover:text-[#1670E8] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                      >
                        <span>{card.targetName}</span>
                        <ExternalLink size={12} className="text-slate-400" />
                      </button>
                      <div className="text-xs font-bold text-[#1670E8] mt-0.5">
                        {card.treatment}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-[#1670E8] px-2.5 py-0.5 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]/60 shrink-0">
                        {card.leadId ? `Lead ID: ${card.leadId}` : `UHID: ${card.patientId || 'IND'}`}
                      </span>
                      {activeTab === 'patients' && !card.isAppointment && (
                        card.doctorName && card.doctorName !== 'Unassigned' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1670E8] border border-blue-100 truncate max-w-[120px]">
                            {card.doctorName}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                            Unassigned
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* ── APPOINTMENT CARD: Combined Schedule & Dual Reminder Box ── */}
                  {card.isAppointment ? (
                    <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFD] border border-slate-200/80 space-y-2">
                      {/* Appointment Header */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#102A50]">
                          <Calendar size={13} className="text-[#1670E8]" />
                          <span>Appt: {card.appointmentDate} at {card.appointmentTime}</span>
                        </div>
                        {card.doctorName && card.doctorName !== 'Unassigned' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1670E8] border border-blue-100 truncate max-w-[130px]">
                            {card.doctorName}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                            Unassigned
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
                              : 'bg-blue-50 text-[#1670E8]'
                          }`}>
                            {card.reminderSame?.status === 'Completed' ? '✓ Done' : todayStr === card.appointmentDate ? 'Due Today' : todayStr > card.appointmentDate ? 'Past' : `Scheduled for ${card.appointmentDate}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* ── REGULAR CLINICAL RECALL OR CONSOLIDATED LEAD CARD ── */
                    <div className="mt-2.5 p-2.5 rounded-xl bg-[#F8FAFD] border border-slate-100/90 text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                      <FileText size={12} className="text-[#7186A5] mt-0.5 shrink-0" />
                      <div className="flex-1 space-y-1">
                        {card.items && card.items.length > 1 ? (
                          <div>
                            <div className="flex items-center gap-1 font-bold text-[11px] text-slate-700 mb-1">
                              <Layers size={11} className="text-[#1670E8]" />
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
                          <div className="pt-1 border-t border-slate-200/60 font-bold text-[10px] text-emerald-700">
                            Outcome: {card.primaryItem.outcome} {card.primaryItem.outcomeNotes ? `(${card.primaryItem.outcomeNotes})` : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata: Phone, Slot, Assigned */}
                  <div className="mt-3 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <a
                        href={`tel:${card.phone}`}
                        className="flex items-center gap-1.5 font-bold text-slate-700 hover:text-[#1670E8] transition-colors"
                      >
                        <Phone size={11} className="text-slate-400" />
                        <span>{card.phone}</span>
                      </a>
                      <div className="font-extrabold text-[#102A50] text-[11px] flex items-center gap-1">
                        <Calendar size={11} className="text-[#1670E8]" />
                        <span>Slot: {card.appointmentDate || card.scheduledDate} ({card.appointmentTime || card.scheduledTime || '11:00 AM'})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                      <span>Assigned: {card.assignedTo || 'Sneha, R | Front Desk'}</span>
                      <span className="text-slate-400">Coimbatore Clinic</span>
                    </div>
                  </div>
                </div>

                {/* ── Action Buttons Row (Matching Reference Image 1) ── */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {/* Call button */}
                    <button
                      onClick={() => showToast(`Calling ${card.targetName} (${card.phone})...`)}
                      className="w-8 h-8 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1670E8] hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title="Call Lead"
                    >
                      <Phone size={13} />
                    </button>

                    {/* WhatsApp button */}
                    <button
                      onClick={() => handleOpenWhatsApp(card)}
                      className="w-8 h-8 rounded-full bg-[#E6F8F0] border border-[#BBF7D0] text-[#16A34A] hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title="WhatsApp Lead"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                    </button>

                    {/* Reschedule button */}
                    {!isCompleted && (
                      <button
                        onClick={() => handleReschedule(card)}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      >
                        <RotateCcw size={11} className="text-slate-400" />
                        <span>Reschedule</span>
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteFollowup(card)}
                      className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200/80 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                      title="Delete Follow-Up"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Book button */}
                    <button
                      onClick={() => handleBookAppointmentFromFollowup(card)}
                      className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1670E8] hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                      title="Book Appointment"
                    >
                      <CalendarPlus size={12} />
                      <span>Book</span>
                    </button>

                    {/* Done button */}
                    {!isCompleted ? (
                      <button
                        onClick={() => activeTab === 'leads' ? handleCompleteLeadFollowup(card) : handleCompletePatientFollowup(card)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        <span>Done</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 px-2 py-1">
                        <CheckCircle2 size={13} />
                        <span>Done</span>
                      </span>
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
