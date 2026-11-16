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
  return new Date().toISOString().split('T')[0];
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
