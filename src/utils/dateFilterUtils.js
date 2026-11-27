// Date filtering utilities for Leads & Patients

export const QUICK_DATE_OPTIONS = [
  { id: 'ALL', label: 'All Dates' },
  { id: 'TODAY', label: 'Today' },
  { id: 'YESTERDAY', label: 'Yesterday' },
  { id: 'LAST_7_DAYS', label: 'Last 7 Days' },
  { id: 'LAST_30_DAYS', label: 'Last 30 Days' },
  { id: 'THIS_MONTH', label: 'This Month' },
  { id: 'CUSTOM', label: 'Custom Range' }
];

export function getTodayDateStr() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch (e) {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}

export function getPrevDayStr(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() - 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function getNextDayStr(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  d.setDate(d.getDate() + 1);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ── Shared calculation of pending follow-ups due today (matches FollowupsModule) ──
export function calculateDueTodayCounts(followups = [], appointments = [], leads = [], patients = [], todayStr) {
  const currentToday = todayStr || getTodayDateStr();

  // 1. Prospective Leads: deduplicated by lead
  const activeLeadsMap = new Map();
  leads.forEach(l => {
    if (!l.isDeleted) activeLeadsMap.set(l.id, l);
  });

  const leadFollowups = followups.filter(f => {
    if (f.status === 'Completed' || f.status === 'Cancelled') return false;
    if (f.leadId && !activeLeadsMap.has(f.leadId)) return false;
    const fDate = (f.scheduledDate || f.dueDate || (f.scheduledDateTime ? f.scheduledDateTime.split('T')[0] : '') || '').substring(0, 10);
    return fDate === currentToday && (f.personType === 'lead' || !!f.leadId);
  });

  const uniqueLeadKeys = new Set();
  leadFollowups.forEach(f => {
    const key = f.leadId || f.phone || f.targetName;
    if (key) uniqueLeadKeys.add(key);
  });
  const leadDueToday = uniqueLeadKeys.size;

  // 2. Existing Patients: deduplicated by appointment or patient recall
  const activePatientsMap = new Map();
  patients.forEach(p => {
    if (!p.isDeleted && !p.isArchived) activePatientsMap.set(p.id, p);
  });

  // 2a. Standalone patient recalls/follow-ups (non-appointment)
  const patientRecallsDueToday = followups.filter(f => {
    if (f.status === 'Completed' || f.status === 'Cancelled') return false;
    if (f.leadId) return false;
    if (f.appointmentId) return false;
    if (f.patientId && !activePatientsMap.has(f.patientId)) return false;
    const fDate = (f.scheduledDate || f.dueDate || (f.scheduledDateTime ? f.scheduledDateTime.split('T')[0] : '') || '').substring(0, 10);
    return fDate === currentToday && (f.personType === 'patient' || !!f.patientId);
  });

  const uniquePatientRecalls = new Set();
  patientRecallsDueToday.forEach(f => {
    const key = f.patientId || f.id;
    if (key) uniquePatientRecalls.add(key);
  });

  // 2b. Appointment reminders (due today if same-day reminder or 1-day before reminder)
  const processedAppts = new Set();
  let apptRemindersDueToday = 0;

  appointments.forEach(appt => {
    if (!appt || appt.status === 'Cancelled') return;
    if (processedAppts.has(appt.id)) return;

    const appointmentDate = (appt.date || '').substring(0, 10);
    const prevDay = getPrevDayStr(appointmentDate);

    const isTodayAppt = currentToday === appointmentDate;
    const isTomorrowAppt = currentToday === prevDay;

    if (isTodayAppt || isTomorrowAppt) {
      // Check if reminder was already marked completed in followups
      const apptFollowups = followups.filter(f => f.appointmentId === appt.id);
      const allCompleted = apptFollowups.length > 0 && apptFollowups.every(f => f.status === 'Completed');
      if (!allCompleted) {
        apptRemindersDueToday++;
        processedAppts.add(appt.id);
      }
    }
  });

  const patientDueToday = uniquePatientRecalls.size + apptRemindersDueToday;

  return {
    leadDueToday,
    patientDueToday,
    totalDueToday: leadDueToday + patientDueToday
  };
}

export function parseLeadDateToYMD(lead) {
  if (lead.createdDate && /^\d{4}-\d{2}-\d{2}$/.test(lead.createdDate)) {
    return lead.createdDate;
  }
  if (lead.createdAt) {
    const isoDate = lead.createdAt.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  }
  const dateStr = lead.date || '';
  const todayYMD = getTodayDateStr();

  if (dateStr.toLowerCase().startsWith('today')) {
    return todayYMD;
  }
  if (dateStr.toLowerCase().startsWith('yesterday')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }
  const match = dateStr.match(/\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];

  return todayYMD;
}

export function parsePatientDateToYMD(patient) {
  if (patient.registrationDate && /^\d{4}-\d{2}-\d{2}$/.test(patient.registrationDate)) {
    return patient.registrationDate;
  }
  if (patient.registeredDate) {
    const match = String(patient.registeredDate).match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  if (patient.createdDate) {
    return patient.createdDate;
  }
  if (patient.createdAt) {
    const isoDate = patient.createdAt.split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
  }
  return getTodayDateStr();
}

export function computeQuickDateRange(quickId) {
  const today = new Date();
  const todayYMD = today.toISOString().split('T')[0];

  if (quickId === 'TODAY') {
    return { from: todayYMD, to: todayYMD };
  }
  if (quickId === 'YESTERDAY') {
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);
    const yestYMD = yest.toISOString().split('T')[0];
    return { from: yestYMD, to: yestYMD };
  }
  if (quickId === 'LAST_7_DAYS') {
    const d = new Date(today);
    d.setDate(d.getDate() - 7);
    return { from: d.toISOString().split('T')[0], to: todayYMD };
  }
  if (quickId === 'LAST_30_DAYS') {
    const d = new Date(today);
    d.setDate(d.getDate() - 30);
    return { from: d.toISOString().split('T')[0], to: todayYMD };
  }
  if (quickId === 'THIS_MONTH') {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: firstDay.toISOString().split('T')[0], to: todayYMD };
  }
  return { from: '', to: '' };
}

export function isDateWithinRange(itemYMD, fromYMD, toYMD) {
  if (!itemYMD) return false;
  if (fromYMD && itemYMD < fromYMD) return false;
  if (toYMD && itemYMD > toYMD) return false;
  return true;
}
