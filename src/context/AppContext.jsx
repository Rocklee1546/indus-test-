import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getDoctorInitials } from '../utils/doctorUtils';
import {
  BRANCHES,
  DOCTORS,
  INITIAL_LEADS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_FOLLOWUPS,
  INITIAL_LAB_ORDERS,
  INITIAL_INVOICES,
  INITIAL_TREATMENT_PLANS,
  INITIAL_INVENTORY,
  INITIAL_PRESCRIPTIONS,
  INITIAL_CAMPAIGNS,
  INITIAL_FEEDBACK,
  LEAD_STATUSES,
  FOLLOWUP_CATEGORIES,
  WHATSAPP_TEMPLATES,
  INITIAL_TREATMENTS
} from '../data/mockData';

const AppContext = createContext();

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Storage load error for ' + key, e);
  }
  return fallback;
};

export const USERS = [
  {
    id: 'USR-01',
    name: 'Dr. Priya Sharma',
    role: 'Doctor',
    title: 'Chief Dental Surgeon',
    branchId: 'RS_PURAM',
    avatar: 'https://images.unsplash.com/photo-1594824813576-0f4b3df2a514?w=150&auto=format&fit=crop&q=80',
    permissions: ['view_all', 'edit_clinical', 'write_rx', 'view_lab', 'draw_explain']
  },
  {
    id: 'USR-00',
    name: 'Dr. K. Senthil Nathan',
    role: 'Super Admin',
    title: 'Founder & Managing Director',
    branchId: 'ALL',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    permissions: ['all']
  },
  {
    id: 'USR-02',
    name: 'Sneha R',
    role: 'Receptionist',
    title: 'Front Desk Lead • R.S. Puram',
    branchId: 'RS_PURAM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    permissions: ['leads', 'patients_basic', 'appointments', 'checkin', 'followups']
  },
  {
    id: 'USR-03',
    name: 'Karthik Subramanian',
    role: 'Branch Manager',
    title: 'Operations Manager • R.S. Puram',
    branchId: 'RS_PURAM',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    permissions: ['branch_ops', 'staff', 'inventory', 'reports', 'billing']
  },
  {
    id: 'USR-04',
    name: 'Praveen M',
    role: 'Billing Staff',
    title: 'Cashier & Billing Executive',
    branchId: 'RS_PURAM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    permissions: ['billing', 'invoices', 'receipts', 'reports_finance']
  },
  {
    id: 'USR-05',
    name: 'Venkatesh S',
    role: 'Lab Coordinator',
    title: 'Dental Prosthetics Coordinator',
    branchId: 'ALL',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    permissions: ['lab_orders', 'materials']
  },
  {
    id: 'USR-06',
    name: 'Deepak Raj',
    role: 'Marketing Staff',
    title: 'Digital Outreach & CRM Specialist',
    branchId: 'ALL',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    permissions: ['campaigns', 'whatsapp', 'leads']
  }
];

const INITIAL_DENTAL_IMAGES = [
  {
    id: 'IMG-DEMO-01',
    patientId: 'IND-0292',
    patientName: 'Karthik Subramanian',
    patientUhid: 'IND-0292',
    patientPhone: '9840123456',
    title: 'Adult 32 Teeth – Full Panoramic Radiograph',
    templateName: 'Adult Teeth – 32 Teeth',
    templateId: 'adult_32',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Priya Sharma',
    notes: 'Maxillary right molar restored. Lower left #36 advised for zirconia crown.',
    includeOnRx: true,
    date: '2026-11-20',
    createdAt: '2026-11-20T10:30:00.000Z',
    imageData: '/dental-templates/adult-teeth-32.jpg'
  },
  {
    id: 'IMG-DEMO-02',
    patientId: 'IND-0292',
    patientName: 'Karthik Subramanian',
    patientUhid: 'IND-0292',
    patientPhone: '9840123456',
    title: 'Molar Anatomy – Crown, Pulp & Root Canals',
    templateName: 'Tooth Anatomy – Roots & Pulp',
    templateId: 'tooth_anatomy',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Priya Sharma',
    notes: 'Patient consultation on endodontic anatomy and root canal procedure stages.',
    includeOnRx: true,
    date: '2026-11-22',
    createdAt: '2026-11-22T14:15:00.000Z',
    imageData: '/dental-templates/tooth-anatomy-roots-pulp.jpg'
  }
];

export const AppProvider = ({ children }) => {
  // Navigation
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedBranch, setSelectedBranch] = useState('ALL');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [settingsTab, setSettingsTab] = useState('general');

  // Search & Filters
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Entities Data State with LocalStorage Persistence
  const [doctors, setDoctors] = useState(() => {
    const loaded = loadFromStorage('indus_doctors_v4', null);
    if (loaded && Array.isArray(loaded) && loaded.length > 0) return loaded;
    return DOCTORS.map(d => ({
      ...d,
      role: d.specialty || 'Dental Surgeon',
      phone: d.phone || '+91 98422 10101',
      email: d.email || `${d.name.toLowerCase().replace(/[^a-z]/g, '')}@indusdental.in`,
      status: d.status || 'Active'
    }));
  });

  // Central Doctor Profile Synchronization State
  const [activeDoctorId, setActiveDoctorId] = useState(() => {
    return loadFromStorage('indus_active_doctor_id_v4', 'DOC-01');
  });

  // Persist active doctor selection across sessions
  useEffect(() => {
    if (activeDoctorId) {
      try {
        localStorage.setItem('indus_active_doctor_id_v4', JSON.stringify(activeDoctorId));
      } catch (e) {}
    }
  }, [activeDoctorId]);

  // Dynamically derived currentUser synchronized with central Doctor Management
  const currentUser = useMemo(() => {
    // 1. Try finding selected doctor who is active
    let activeDoc = doctors.find(d => d.id === activeDoctorId && (d.status || 'Active') === 'Active');

    // 2. Fallback to first available active doctor
    if (!activeDoc) {
      activeDoc = doctors.find(d => (d.status || 'Active') === 'Active') || doctors[0] || {
        id: 'DOC-01',
        name: 'Dr. Priya Sharma',
        role: 'Chief Dental Surgeon',
        specialty: 'Chief Dental Surgeon & Implantologist'
      };
    }

    return {
      id: activeDoc.id,
      name: activeDoc.name,
      role: activeDoc.role || activeDoc.specialty || 'Doctor',
      title: activeDoc.role || activeDoc.specialty || 'Chief Dental Surgeon',
      branchId: activeDoc.branchId || 'RS_PURAM',
      initials: getDoctorInitials(activeDoc.name),
      avatar: activeDoc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeDoc.name)}&background=1769d2&color=fff`,
      phone: activeDoc.phone,
      email: activeDoc.email,
      permissions: ['all']
    };
  }, [doctors, activeDoctorId]);

  // Switch doctor profile action with validation
  const selectDoctorProfile = (doctorId) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return;
    if (doc.status === 'Inactive') {
      showToast(`${doc.name} is inactive and cannot be selected as the active profile.`, 'error');
      return;
    }
    setActiveDoctorId(doctorId);
    showToast(`Switched active profile to ${doc.name}`, 'success');
  };
  const [leads, setLeads] = useState(() => {
    const raw = loadFromStorage('indus_leads_v4', INITIAL_LEADS);
    const sourceMap = {
      'Google Ads': 'Meta Ads',
      'Website': 'WhatsApp',
      'Walk-in': 'Walk In',
      'Phone Calls': 'Referral',
      'Referrals': 'Referral',
      'Instagram': 'Meta Ads'
    };
    return (raw || []).map(l => (l.source && sourceMap[l.source] ? { ...l, source: sourceMap[l.source] } : l));
  });
  const [patients, setPatients] = useState(() => loadFromStorage('indus_patients_v4', INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState(() => loadFromStorage('indus_appointments_v4', INITIAL_APPOINTMENTS));
  const [followups, setFollowups] = useState(() => loadFromStorage('indus_followups_v4', INITIAL_FOLLOWUPS));
  const [labOrders, setLabOrders] = useState(INITIAL_LAB_ORDERS);
  const [invoices, setInvoices] = useState(() => loadFromStorage('indus_invoices_v4', INITIAL_INVOICES));
  const [treatmentPlans, setTreatmentPlans] = useState(() => loadFromStorage('indus_treatment_plans_v4', INITIAL_TREATMENT_PLANS));
  const [dentalImages, setDentalImages] = useState(() => loadFromStorage('indus_dental_images_v1', INITIAL_DENTAL_IMAGES));
  const [activeDrawingToLoad, setActiveDrawingToLoad] = useState(null);
  const [treatments, setTreatments] = useState(() => loadFromStorage('indus_treatments_v2', INITIAL_TREATMENTS));
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);

  // Sync state to LocalStorage
  useEffect(() => {
    try { localStorage.setItem('indus_doctors_v4', JSON.stringify(doctors)); } catch (e) {}
  }, [doctors]);
  useEffect(() => {
    try { localStorage.setItem('indus_leads_v4', JSON.stringify(leads)); } catch (e) {}
  }, [leads]);

  useEffect(() => {
    try { localStorage.setItem('indus_patients_v4', JSON.stringify(patients)); } catch (e) {}
  }, [patients]);

  useEffect(() => {
    try { localStorage.setItem('indus_appointments_v4', JSON.stringify(appointments)); } catch (e) {}
  }, [appointments]);

  useEffect(() => {
    try { localStorage.setItem('indus_followups_v4', JSON.stringify(followups)); } catch (e) {}
  }, [followups]);

  useEffect(() => {
    try { localStorage.setItem('indus_invoices_v4', JSON.stringify(invoices)); } catch (e) {}
  }, [invoices]);

  useEffect(() => {
    try { localStorage.setItem('indus_treatment_plans_v4', JSON.stringify(treatmentPlans)); } catch (e) {}
  }, [treatmentPlans]);

  useEffect(() => {
    try { localStorage.setItem('indus_dental_images_v1', JSON.stringify(dentalImages)); } catch (e) {}
  }, [dentalImages]);

  useEffect(() => {
    try { localStorage.setItem('indus_treatments_v2', JSON.stringify(treatments)); } catch (e) {}
  }, [treatments]);

  const enabledTreatments = useMemo(() => {
    return (treatments || []).filter(t => t.enabled !== false);
  }, [treatments]);

  // Selection state for consultation and 360 profile
  const [activePatientId, setActivePatientId] = useState('IND-0292');
  const [patient360Data, setPatient360Data] = useState(null); // When opened in drawer/modal

  // Modals state
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isBookCheckInOpen, setIsBookCheckInOpen] = useState(false);
  const [isBookApptSlotOpen, setIsBookApptSlotOpen] = useState(false);
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isNewLabOrderOpen, setIsNewLabOrderOpen] = useState(false);
  const [isStockTransferOpen, setIsStockTransferOpen] = useState(false);

  // New Workflow Modals & Drawers
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [leadStatusFilter, setLeadStatusFilter] = useState('ALL');
  const [isLeadDetailsOpen, setIsLeadDetailsOpen] = useState(false);
  const [whatsAppData, setWhatsAppData] = useState(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [lostLeadData, setLostLeadData] = useState(null);
  const [isLostLeadModalOpen, setIsLostLeadModalOpen] = useState(false);
  const [leadToBookAppt, setLeadToBookAppt] = useState(null);

  // Appointment Flow State
  const [apptToBookPatient, setApptToBookPatient] = useState(null);
  const [checkInPatientModalData, setCheckInPatientModalData] = useState(null);
  const [isRescheduleApptOpen, setIsRescheduleApptOpen] = useState(false);
  const [rescheduleApptData, setRescheduleApptData] = useState(null);
  const [isCancelApptOpen, setIsCancelApptOpen] = useState(false);
  const [cancelApptData, setCancelApptData] = useState(null);

  // Token Slip & Queue State
  const [tokenSlipData, setTokenSlipData] = useState(null);
  const [isTokenSlipOpen, setIsTokenSlipOpen] = useState(false);
  const [calledPatientAnnouncement, setCalledPatientAnnouncement] = useState(null);

  // Follow-up Outcome & Patient Follow-up State
  const [followupOutcomeData, setFollowupOutcomeData] = useState(null);
  const [isFollowupOutcomeOpen, setIsFollowupOutcomeOpen] = useState(false);
  const [isAddPatientFollowupOpen, setIsAddPatientFollowupOpen] = useState(false);
  const [patientFollowupTargetPatient, setPatientFollowupTargetPatient] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Branch Filter Helper
  const filterByBranch = (items, branchKey = 'branchId') => {
    if (selectedBranch === 'ALL') return items;
    return items.filter(item => item[branchKey] === selectedBranch || item[branchKey] === 'ALL');
  };

  // Filtered entity views (excluding soft-deleted / archived records)
  const filteredLeads = useMemo(() => filterByBranch(leads).filter(l => !l.isDeleted), [leads, selectedBranch]);
  const filteredPatients = useMemo(() => filterByBranch(patients, 'preferredBranch').filter(p => !p.isDeleted && !p.isArchived), [patients, selectedBranch]);
  const filteredAppointments = useMemo(() => filterByBranch(appointments), [appointments, selectedBranch]);
  const filteredFollowups = useMemo(() => filterByBranch(followups), [followups, selectedBranch]);
  const filteredLabOrders = useMemo(() => filterByBranch(labOrders), [labOrders, selectedBranch]);
  const filteredInvoices = useMemo(() => filterByBranch(invoices), [invoices, selectedBranch]);
  const filteredInventory = useMemo(() => filterByBranch(inventory), [inventory, selectedBranch]);

  // Derived current active patient
  const activePatient = useMemo(() => {
    return patients.find(p => p.id === activePatientId) || patients[0];
  }, [patients, activePatientId]);

  // 1. Add New Lead (creates lead + timeline + auto-creates linked follow-up if date given)
  const addLead = (leadData) => {
    const leadId = `LD-${Math.floor(4000 + Math.random() * 9000)}`;
    const timelineEntry = {
      id: `TL-${Date.now()}-1`,
      type: 'created',
      title: 'Lead Registered',
      description: `Captured lead via ${leadData.source || 'Direct Entry'}. Treatment: ${leadData.treatment}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      user: currentUser.name
    };

    const newLead = {
      ...leadData,
      id: leadId,
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      createdDate: new Date().toISOString().split('T')[0],
      isDeleted: false,
      status: 'New',
      timeline: [timelineEntry],
      nextAction: leadData.nextFollowup ? `Follow-up scheduled on ${leadData.nextFollowup.replace('T', ' ')}` : 'Initiate first contact call or WhatsApp'
    };

    setLeads(prev => [newLead, ...prev]);

    // If follow-up date/time provided, automatically create connected follow-up task!
    if (leadData.nextFollowup) {
      const parts = leadData.nextFollowup.split('T');
      const datePart = parts[0];
      const timePart = parts[1] || '11:00';
      const folId = `FOL-${Math.floor(200 + Math.random() * 800)}`;

      const newFol = {
        id: folId,
        leadId: leadId,
        patientId: null,
        personType: 'lead',
        targetName: leadData.name,
        phone: leadData.phone,
        treatment: leadData.treatment,
        reason: `Initial enquiry follow-up on ${leadData.treatment}`,
        assignedTo: leadData.assignedTo || currentUser.name,
        scheduledDate: datePart,
        scheduledTime: timePart,
        scheduledDateTime: leadData.nextFollowup,
        status: 'Pending',
        branchId: leadData.branchId || 'RS_PURAM',
        category: 'New Lead Follow-up',
        priority: leadData.priority || 'Hot',
        lastContactDate: 'Just now',
        lastContactChannel: leadData.source || 'Direct Entry',
        notes: leadData.remarks || 'Captured via CRM registration form',
        nextAction: `Call on ${datePart} at ${timePart}`
      };
      setFollowups(prev => [newFol, ...prev]);
    }

    showToast(`Lead ${newLead.name} registered successfully!`);
    return newLead;
  };

  // 2. Update Lead Status (synchronized with follow-ups, pipeline, timeline, lost reason)
  const updateLeadStatus = (leadId, newStatus, extraData = {}) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const oldStatus = lead.status;
    if (oldStatus === newStatus && !extraData.force) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let timelineEvent = {
      id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'status_change',
      title: `Status Changed to ${newStatus}`,
      description: `Moved from "${oldStatus}" to "${newStatus}" by ${currentUser.name}.${extraData.note ? ' Note: ' + extraData.note : ''}`,
      time: timeStr,
      date: 'Today',
      user: currentUser.name
    };

    if (newStatus === 'Lost Lead') {
      timelineEvent.type = 'lost';
      timelineEvent.title = 'Lead Marked as Lost';
      timelineEvent.description = `Reason: ${extraData.lostReason || 'Not specified'}. ${extraData.note || ''}`;
    }

    let updatedNextAction = lead.nextAction;

    // WORKFLOW AUTOMATION:
    // A) If moved to 'Follow-up Required' -> ensure linked follow-up exists or update it
    if (newStatus === 'Follow-up Required') {
      setFollowups(prev => {
        const existingPending = prev.find(f => f.leadId === leadId && f.status !== 'Completed' && f.status !== 'Cancelled');
        const schedDate = extraData.scheduledDate || new Date().toISOString().split('T')[0];
        const schedTime = extraData.scheduledTime || '11:00 AM';
        const schedDateTime = `${schedDate}T${schedTime}`;

        if (existingPending) {
          // Update existing
          return prev.map(f => f.id === existingPending.id ? {
            ...f,
            scheduledDate: schedDate,
            scheduledTime: schedTime,
            scheduledDateTime: schedDateTime,
            status: 'Pending',
            priority: lead.priority || 'Hot',
            notes: extraData.note || f.notes,
            nextAction: `Follow-up on ${schedDate} at ${schedTime}`
          } : f);
        } else {
          // Create new connected follow-up
          const newFol = {
            id: `FOL-${Math.floor(200 + Math.random() * 800)}`,
            leadId: leadId,
            patientId: null,
            personType: 'lead',
            targetName: lead.name,
            phone: lead.phone,
            treatment: lead.treatment,
            reason: extraData.reason || `Follow-up required on ${lead.treatment}`,
            assignedTo: lead.assignedTo || currentUser.name,
            scheduledDate: schedDate,
            scheduledTime: schedTime,
            scheduledDateTime: schedDateTime,
            status: 'Pending',
            branchId: lead.branchId || 'RS_PURAM',
            category: 'Interested Lead Follow-up',
            priority: lead.priority || 'Hot',
            lastContactDate: 'Today',
            lastContactChannel: 'CRM Pipeline',
            notes: extraData.note || 'Moved to Follow-up Required in pipeline.',
            nextAction: `Call on ${schedDate} at ${schedTime}`
          };
          return [newFol, ...prev];
        }
      });
      updatedNextAction = `Follow-up scheduled on ${extraData.scheduledDate || 'Today'}`;
    }

    // B) If moved to 'Appointment Booked' -> close conversion follow-up
    if (newStatus === 'Appointment Booked') {
      setFollowups(prev => prev.map(f => {
        if (f.leadId === leadId && (f.status === 'Pending' || f.status === 'Due Today' || f.status === 'Overdue')) {
          return { ...f, status: 'Completed', notes: f.notes + ' [Closed: Appointment Booked]' };
        }
        return f;
      }));
      updatedNextAction = `Appointment scheduled for ${lead.treatment}`;
    }

    // C) If moved to 'Lost Lead' -> close pending follow-ups
    if (newStatus === 'Lost Lead') {
      setFollowups(prev => prev.map(f => {
        if (f.leadId === leadId && (f.status === 'Pending' || f.status === 'Due Today' || f.status === 'Overdue')) {
          return { ...f, status: 'Cancelled', notes: f.notes + ` [Closed: Lost Lead - ${extraData.lostReason || ''}]` };
        }
        return f;
      }));
      updatedNextAction = `Lead closed (${extraData.lostReason || 'Lost'})`;
    }

    // D) If moved to 'Converted to Patient'
    if (newStatus === 'Converted to Patient') {
      setFollowups(prev => prev.map(f => {
        if (f.leadId === leadId && (f.status === 'Pending' || f.status === 'Due Today' || f.status === 'Overdue')) {
          return { ...f, status: 'Completed', notes: f.notes + ' [Closed: Converted to Patient]' };
        }
        return f;
      }));
      updatedNextAction = `Patient Registered • Active Profile`;
    }

    // Update lead
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          lostReason: newStatus === 'Lost Lead' ? (extraData.lostReason || l.lostReason) : l.lostReason,
          nextAction: updatedNextAction,
          timeline: [timelineEvent, ...(l.timeline || [])]
        };
      }
      return l;
    }));

    showToast(`Lead status updated to ${newStatus}`);
  };

  // 3. Schedule Next Follow-up (synchronizes follow-up & linked lead)
  const scheduleNextFollowup = ({
    leadId,
    followupId,
    date,
    time,
    reason = 'Follow-up regarding dental consultation',
    notes = ''
  }) => {
    const lead = leads.find(l => l.id === leadId);
    const isoDateTime = `${date}T${time}`;

    // Find existing pending follow-up task if any
    const existingFollowup = followupId
      ? followups.find(f => f.id === followupId)
      : followups.find(f => f.leadId === leadId && f.status !== 'Completed' && f.status !== 'Cancelled');

    const isPending = existingFollowup && existingFollowup.status !== 'Completed' && existingFollowup.status !== 'Cancelled';

    if (isPending) {
      // Update existing pending follow-up without creating duplicates
      setFollowups(prev => prev.map(f => {
        if (f.id === existingFollowup.id) {
          return {
            ...f,
            scheduledDate: date,
            scheduledTime: time,
            scheduledDateTime: isoDateTime,
            status: 'Pending',
            category: reason || f.category || 'Enquiry Follow-up',
            reason: notes || reason || f.reason,
            notes: (f.notes ? `${f.notes} | ` : '') + `Next Follow-up: ${date} ${time}${notes ? ` - ${notes}` : ''}`,
            updatedAt: new Date().toISOString()
          };
        }
        return f;
      }));
    } else {
      // Create new follow-up task linked to the lead
      const newFollowup = {
        id: `FOL-${Math.floor(2000 + Math.random() * 8000)}`,
        leadId: leadId,
        name: lead?.name || 'Prospective Patient',
        phone: lead?.phone || '',
        treatment: lead?.treatment || 'General Dental Consultation',
        category: reason || 'Next Follow-up Call',
        scheduledDate: date,
        scheduledTime: time,
        scheduledDateTime: isoDateTime,
        status: 'Pending',
        notes: notes || `Follow-up scheduled on ${date} at ${time}`,
        reason: notes || reason || 'Next follow-up consultation',
        assignedTo: 'Sneha R (Front Desk)',
        branchId: lead?.branchId || selectedBranch || 'RS_PURAM',
        channel: 'Phone Call',
        createdAt: new Date().toISOString()
      };
      setFollowups(prev => [newFollowup, ...prev]);
    }

    // Synchronize Lead Record: nextFollowup, nextAction, and timeline
    if (leadId) {
      setLeads(prev => prev.map(l => {
        if (l.id === leadId) {
          const timelineEntry = {
            id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: 'followup',
            title: 'Next Follow-up Scheduled',
            description: `Scheduled for ${date} at ${time}. ${notes ? `Remarks: ${notes}` : `Reason: ${reason}`}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            user: currentUser.name
          };

          const updatedTimeline = [timelineEntry, ...(l.timeline || [])];
          return {
            ...l,
            nextFollowup: isoDateTime,
            nextAction: `Follow-up on ${date} at ${time}${notes ? ` • ${notes}` : ''}`,
            timeline: updatedTimeline,
            activityTimeline: updatedTimeline
          };
        }
        return l;
      }));
    }

    showToast(`Next follow-up scheduled for ${date} at ${time}!`, 'success');
  };

  const rescheduleFollowup = (followupId, newDate, newTime, reason = '') => {
    const fol = followups.find(f => f.id === followupId);
    scheduleNextFollowup({
      leadId: fol?.leadId,
      followupId,
      date: newDate,
      time: newTime,
      reason: reason || 'Follow-up Rescheduled',
      notes: reason
    });
  };

  // 4. Complete Follow-up Task
  const completeFollowupTask = (followupId, resolutionNote = '') => {
    const fol = followups.find(f => f.id === followupId);
    if (!fol) return;

    setFollowups(prev => prev.map(f => f.id === followupId ? {
      ...f,
      status: 'Completed',
      notes: (f.notes ? f.notes + ' | ' : '') + `Completed: ${resolutionNote || 'Task fulfilled'}`
    } : f));

    // If linked to lead, log to timeline
    if (fol.leadId) {
      setLeads(prev => prev.map(l => {
        if (l.id === fol.leadId) {
          const timelineEntry = {
            id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: 'followup',
            title: 'Follow-up Task Completed',
            description: `${fol.category}: ${resolutionNote || 'Patient contacted and follow-up closed successfully.'}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: 'Today',
            user: currentUser.name
          };
          return {
            ...l,
            timeline: [timelineEntry, ...(l.timeline || [])]
          };
        }
        return l;
      }));
    }

    showToast('Follow-up marked as Completed');
  };

  // 5. Convert Lead to Patient (Checks duplicate phone, generates UHID, links profile, closes follow-up)
  const convertLeadToPatient = (leadId, extraData = {}) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Duplicate check on phone
    const cleanPhone = (lead.phone || '').replace(/\D/g, '');
    const existingPatient = patients.find(p => (p.phone || '').replace(/\D/g, '') === cleanPhone);

    let newPatientId = existingPatient ? existingPatient.id : `IND-0${Math.floor(300 + Math.random() * 700)}`;

    if (!existingPatient) {
      const newPatient = {
        id: newPatientId,
        name: lead.name,
        salutation: extraData.salutation || 'Mr.',
        dob: extraData.dob || '1998-05-10',
        age: extraData.age || 28,
        ageDetails: { yrs: extraData.age || 28, mths: 0, days: 0 },
        gender: extraData.gender || 'Male',
        bloodGroup: extraData.bloodGroup || 'B+',
        phone: lead.phone,
        altPhone: lead.altPhone || '',
        email: lead.email || '',
        address: extraData.address || 'Coimbatore, Tamil Nadu',
        emergencyContact: extraData.emergencyContact || '',
        preferredBranch: lead.branchId || 'RS_PURAM',
        referredBy: (() => {
          const s = (lead.source || '').toLowerCase();
          if (s.includes('walk')) return 'Walk-in';
          if (s.includes('refer')) return 'Doctor Referral';
          if (s.includes('what')) return 'WhatsApp';
          return 'Meta Ads';
        })(),
        registeredDate: new Date().toISOString().split('T')[0],
        familyRelation: 'Self',
        allergies: extraData.allergies ? [extraData.allergies] : ['None reported'],
        medicalAlerts: extraData.medicalAlerts || 'None',
        lastVisit: 'Today',
        totalVisits: 1,
        outstandingBalance: 0,
        totalBilled: 0,
        status: 'Active'
      };
      setPatients(prev => [newPatient, ...prev]);
    }

    const timelineEntry = {
      id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'converted',
      title: 'Converted to Registered Patient',
      description: `Lead converted to Patient profile with UHID ${newPatientId}.${existingPatient ? ' Linked to existing medical record.' : ' New patient profile created.'}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      user: currentUser.name
    };

    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l,
      status: 'Converted to Patient',
      convertedPatientId: newPatientId,
      nextAction: `Patient Registered (${newPatientId}) • View Profile`,
      timeline: [timelineEntry, ...(l.timeline || [])]
    } : l));

    // Close pending conversion follow-ups
    setFollowups(prev => prev.map(f => {
      if (f.leadId === leadId && (f.status === 'Pending' || f.status === 'Due Today' || f.status === 'Overdue')) {
        return { ...f, status: 'Completed', notes: f.notes + ` [Closed: Converted to ${newPatientId}]` };
      }
      return f;
    }));

    showToast(`Lead ${lead.name} converted to Patient (${newPatientId})!`);
    return newPatientId;
  };

  // 6. Book Appointment From Lead
  const bookAppointmentFromLead = (leadId, apptData) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    const newAppt = {
      ...apptData,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      leadId: leadId,
      patientName: lead.name,
      phone: lead.phone,
      treatmentType: lead.treatment,
      status: 'Booked'
    };

    setAppointments(prev => [newAppt, ...prev]);

    const timelineEntry = {
      id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: `Appointment booked for ${apptData.date} at ${apptData.time} with ${apptData.doctorName || 'Doctor'}. Slot: ${newAppt.id}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      user: currentUser.name
    };

    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l,
      status: 'Appointment Booked',
      nextAction: `Appointment on ${apptData.date} at ${apptData.time} with ${apptData.doctorName || 'Doctor'}`,
      timeline: [timelineEntry, ...(l.timeline || [])]
    } : l));

    // Close pending conversion follow-up
    setFollowups(prev => prev.map(f => {
      if (f.leadId === leadId && (f.status === 'Pending' || f.status === 'Due Today' || f.status === 'Overdue')) {
        return { ...f, status: 'Completed', notes: f.notes + ` [Closed: Appointment ${newAppt.id} Booked]` };
      }
      return f;
    }));

    showToast(`Appointment booked for ${lead.name} (${apptData.time})!`);
    return newAppt;
  };

  // 7. Log Communication (WhatsApp / Call) into Lead Timeline
  const logLeadCommunication = (leadId, { channel, outcome, notes, templateName, messageContent, nextActionDate }) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timelineEntry = {
      id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: channel === 'WhatsApp' ? 'whatsapp' : 'call',
      title: `${channel} Communication: ${outcome || 'Contacted'}`,
      description: `${templateName ? `Template: "${templateName}" • ` : ''}${notes || messageContent || 'Attempted communication.'}`,
      time: timeStr,
      date: 'Today',
      user: currentUser.name
    };

    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          nextFollowup: nextActionDate || l.nextFollowup,
          nextAction: nextActionDate ? `Follow-up on ${nextActionDate}` : l.nextAction,
          timeline: [timelineEntry, ...(l.timeline || [])]
        };
      }
      return l;
    }));

    showToast(`${channel} interaction recorded in activity timeline`);
  };

  // 8. Add Manual Note to Lead Timeline
  const addLeadNote = (leadId, noteText) => {
    if (!noteText.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const timelineEntry = {
      id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'note',
      title: 'Clinical / Staff Note Added',
      description: noteText,
      time: timeStr,
      date: 'Today',
      user: currentUser.name
    };

    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l,
      timeline: [timelineEntry, ...(l.timeline || [])]
    } : l));

    showToast('Note added to timeline');
  };

  // 9. Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem('indus_leads_v4');
    localStorage.removeItem('indus_followups_v4');
    localStorage.removeItem('indus_patients_v4');
    localStorage.removeItem('indus_appointments_v4');
    setLeads(INITIAL_LEADS);
    setFollowups(INITIAL_FOLLOWUPS);
    setPatients(INITIAL_PATIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    showToast('Demo data reset to fresh default states!');
  };

  // Action: Delete / Archive Lead (Soft delete, removes from active pipeline, preserves any converted patient)
  const deleteLead = (leadId, reason = 'User deletion') => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    setLeads(prev => prev.map(l => l.id === leadId ? {
      ...l,
      isDeleted: true,
      deletedAt: new Date().toISOString(),
      deletedBy: currentUser.name,
      timeline: [
        {
          id: `TL-${Date.now()}`,
          type: 'status_change',
          title: 'Lead Deleted / Archived',
          description: `Archived by ${currentUser.name}. Reason: ${reason}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: 'Today',
          user: currentUser.name
        },
        ...(l.timeline || [])
      ]
    } : l));

    // Cancel pending follow-ups linked to this lead
    setFollowups(prev => prev.map(f => f.leadId === leadId && f.status !== 'Completed' ? {
      ...f,
      status: 'Cancelled',
      notes: (f.notes ? f.notes + ' • ' : '') + '[Lead deleted/archived]'
    } : f));

    showToast(`Lead ${lead.name} (${leadId}) deleted.`);
  };

  // Action: Add Patient Directly (From Modal)
  const addPatient = (patientData) => {
    // Validate mandatory full name
    const rawName = (patientData.name || '').replace(/^(Mr|Mrs|Ms|Dr|Master)\.?\s+/i, '').trim();
    if (!rawName) {
      showToast('Validation Error: Patient full name is required.', 'error');
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(rawName)) {
      showToast('Validation Error: Patient name can only contain letters, spaces, hyphens, and apostrophes.', 'error');
      return false;
    }

    // Validate phone: exactly 10 digits
    const digitsPhone = (patientData.phone || '').replace(/\D/g, '');
    if (!digitsPhone || digitsPhone.length !== 10) {
      showToast('Validation Error: Phone number must be exactly 10 digits.', 'error');
      return false;
    }

    // Validate email if provided
    if (patientData.email && patientData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(patientData.email.trim())) {
        showToast('Validation Error: Please enter a valid email address.', 'error');
        return false;
      }
    }

    // Allowed referredBy values
    const validReferredBy = ['Meta Ads', 'Doctor Referral', 'Walk-in', 'WhatsApp'];
    let safeReferredBy = patientData.referredBy;
    if (!validReferredBy.includes(safeReferredBy)) {
      if (safeReferredBy === 'Google Ads' || safeReferredBy === 'Meta / Instagram Ads') safeReferredBy = 'Meta Ads';
      else if (safeReferredBy === 'WhatsApp Campaign') safeReferredBy = 'WhatsApp';
      else if (safeReferredBy === 'Direct Walk-in') safeReferredBy = 'Walk-in';
      else safeReferredBy = 'Meta Ads';
    }

    const newPatient = {
      ...patientData,
      phone: digitsPhone,
      email: (patientData.email || '').trim(),
      referredBy: safeReferredBy,
      id: patientData.id || `IND-0${Math.floor(300 + Math.random() * 700)}`,
      registeredDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      isDeleted: false,
      isArchived: false,
      totalVisits: 0,
      outstandingBalance: 0,
      totalBilled: 0,
      status: 'Active'
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast(`Patient ${newPatient.name} registered with UHID: ${newPatient.id}!`);
    return newPatient;
  };

  // Action: Delete / Archive Patient (Safe soft archive, preserves all clinical records, visits, invoices, appointments)
  const deletePatient = (patientId, reason = 'Administrative archive') => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    setPatients(prev => prev.map(p => p.id === patientId ? {
      ...p,
      isDeleted: true,
      isArchived: true,
      status: 'Archived',
      archivedAt: new Date().toISOString(),
      archivedBy: currentUser.name
    } : p));

    showToast(`Patient ${patient.name} (${patientId}) safely archived. Linked records preserved.`);
  };

  // Action: Update Patient Details (Personal info, Medical History, Dental History)
  const updatePatient = (patientId, updatedFields) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return { ...p, ...updatedFields };
      }
      return p;
    }));

    if (patient360Data && patient360Data.id === patientId) {
      setPatient360Data(prev => ({ ...prev, ...updatedFields }));
    }

    showToast('Patient record saved successfully!');
  };

  // Treatment Plan Actions
  const addTreatmentPlan = (newPlan) => {
    const plan = {
      id: `TP-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...newPlan
    };
    setTreatmentPlans(prev => [plan, ...prev]);
    showToast('Treatment plan added successfully!');
    return plan;
  };

  const updateTreatmentPlan = (planId, updatedFields) => {
    setTreatmentPlans(prev => prev.map(tp => tp.id === planId ? { ...tp, ...updatedFields } : tp));
    showToast('Treatment plan updated successfully!');
  };

  const deleteTreatmentPlan = (planId) => {
    setTreatmentPlans(prev => prev.filter(tp => tp.id !== planId));
    showToast('Treatment plan removed');
  };

  // Dental Images & Clinical Drawings Actions
  const saveDentalImage = (newDrawing) => {
    const drawing = {
      id: `IMG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      ...newDrawing
    };
    setDentalImages(prev => [drawing, ...prev]);
    showToast('Clinical drawing saved to Patient Profile successfully!');
    return drawing;
  };

  const updateDentalImage = (drawingId, updatedFields) => {
    setDentalImages(prev => prev.map(img => img.id === drawingId ? { ...img, ...updatedFields, updatedAt: new Date().toISOString() } : img));
    showToast('Clinical drawing updated successfully!');
  };

  const deleteDentalImage = (drawingId) => {
    setDentalImages(prev => prev.filter(img => img.id !== drawingId));
    showToast('Dental drawing removed from patient profile');
  };

  // ── Delete Appointment (soft-marks as deleted, removes from lists) ─────────
  const deleteAppointment = (apptId) => {
    setAppointments(prev => prev.filter(a => a.id !== apptId));
    // Clean up associated reminders as well
    setFollowups(prev => prev.filter(f => f.appointmentId !== apptId));
    showToast('Appointment deleted successfully.', 'success');
  };

  // ── Delete Follow-up (hard remove from list) ──────────────────────────────
  const deleteFollowup = (followupId) => {
    if (Array.isArray(followupId)) {
      setFollowups(prev => prev.filter(f => !followupId.includes(f.id)));
    } else {
      setFollowups(prev => prev.filter(f => f.id !== followupId));
    }
    showToast('Follow-up record deleted.', 'success');
  };

  // ── Update / Edit Invoice ─────────────────────────────────────────────────
  const updateInvoice = (invoiceId, updatedFields, editorName = '') => {
    const editor = editorName || (currentUser ? currentUser.name : 'Staff');
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const merged = { ...inv, ...updatedFields };
      // Recalculate totals
      const subtotal = (merged.items || []).reduce((s, it) => s + ((Number(it.qty) || 1) * (Number(it.rate) || 0)), 0);
      const discount = Number(merged.discount) || 0;
      const taxRate  = Number(merged.tax) || 0;
      const taxable  = subtotal - discount;
      const taxAmt   = taxRate > 0 ? Math.round(taxable * taxRate / 100) : 0;
      const grandTotal = taxable + taxAmt;
      const paidAmount = Number(merged.paidAmount) || 0;
      const balance    = Math.max(0, grandTotal - paidAmount);
      const status     = balance === 0 ? 'Paid' : paidAmount > 0 ? 'Partial' : 'Pending';

      const auditEntry = {
        at: new Date().toISOString(),
        by: editor,
        action: 'Edited',
        note: `Invoice updated by ${editor}`
      };
      return {
        ...merged,
        subtotal,
        discount,
        tax: taxRate,
        grandTotal,
        paidAmount,
        balance,
        status,
        auditLog: [...(inv.auditLog || []), auditEntry]
      };
    }));

    // Sync patient outstanding balance
    const updatedInv = invoices.find(i => i.id === invoiceId);
    if (updatedInv) {
      setPatients(prev => prev.map(p => {
        if (p.id !== updatedInv.patientId) return p;
        // Recompute from all invoices for this patient
        return p;
      }));
    }
    showToast('Invoice updated successfully!', 'success');
  };

  // ── Void / Cancel Invoice (keeps record for audit, marks as Void) ─────────
  const voidInvoice = (invoiceId, reason = 'User requested void', editorName = '') => {
    const editor = editorName || (currentUser ? currentUser.name : 'Staff');
    setInvoices(prev => prev.map(inv => {
      if (inv.id !== invoiceId) return inv;
      const auditEntry = {
        at: new Date().toISOString(),
        by: editor,
        action: 'Voided',
        note: reason
      };
      return {
        ...inv,
        status: 'Void',
        isVoided: true,
        voidReason: reason,
        voidedAt: new Date().toISOString(),
        voidedBy: editor,
        auditLog: [...(inv.auditLog || []), auditEntry]
      };
    }));
    showToast(`Invoice voided. Reason: ${reason}`, 'success');
  };

  // ── Hard Delete Invoice (only for unpaid/draft, with audit trail) ─────────
  const deleteInvoice = (invoiceId, editorName = '') => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    if (inv.status === 'Paid') {
      showToast('Paid invoices cannot be deleted. Use Void/Cancel instead.', 'error');
      return false;
    }
    setInvoices(prev => prev.filter(i => i.id !== invoiceId));
    showToast(`Invoice ${invoiceId} deleted.`, 'success');
    return true;
  };

  // ── Doctor Management Actions ─────────────────────────────────────────────
  const activeDoctors = useMemo(() => {
    return doctors.filter(d => (d.status || 'Active') === 'Active');
  }, [doctors]);

  const addDoctor = (docData) => {
    const newId = `DOC-${String(doctors.length + 1).padStart(2, '0')}`;
    const newDoc = {
      id: newId,
      name: docData.name?.trim(),
      role: docData.role?.trim() || 'Dental Surgeon',
      specialty: docData.role?.trim() || 'Dental Surgeon',
      phone: docData.phone?.trim() || '',
      email: docData.email?.trim() || '',
      status: docData.status || 'Active',
      branchId: docData.branchId || (selectedBranch !== 'ALL' ? selectedBranch : 'RS_PURAM'),
      consultationFee: Number(docData.consultationFee) || 500,
      avatar: docData.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'
    };
    setDoctors(prev => [...prev, newDoc]);
    showToast(`Doctor ${newDoc.name} added successfully!`, 'success');
    return newDoc;
  };

  const updateDoctor = (doctorId, updatedFields) => {
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        return {
          ...d,
          ...updatedFields,
          role: updatedFields.role || d.role,
          specialty: updatedFields.role || d.specialty || d.role
        };
      }
      return d;
    }));

    if (doctorId === activeDoctorId && updatedFields.status === 'Inactive') {
      const otherActive = doctors.find(d => d.id !== doctorId && (d.status || 'Active') === 'Active');
      if (otherActive) {
        setActiveDoctorId(otherActive.id);
        showToast(`Switched active profile to ${otherActive.name}`, 'info');
      }
    }

    showToast('Doctor details updated successfully!', 'success');
  };

  const toggleDoctorStatus = (doctorId) => {
    let nextStatus = 'Active';
    setDoctors(prev => prev.map(d => {
      if (d.id === doctorId) {
        nextStatus = d.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`${d.name} is now marked ${nextStatus}.`);
        return { ...d, status: nextStatus };
      }
      return d;
    }));

    // If currently active doctor is deactivated, gracefully switch to another active doctor
    if (doctorId === activeDoctorId && nextStatus === 'Inactive') {
      const otherActive = doctors.find(d => d.id !== doctorId && (d.status || 'Active') === 'Active');
      if (otherActive) {
        setActiveDoctorId(otherActive.id);
        showToast(`Switched active profile to ${otherActive.name}`, 'info');
      }
    }
  };

  const deleteDoctor = (doctorId) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc) return false;

    // Check if doctor is linked to existing appointments
    const linkedAppts = appointments.filter(a => a.doctorId === doctorId || a.doctorName === doc.name);
    if (linkedAppts.length > 0) {
      showToast(
        `Cannot delete ${doc.name}: linked to ${linkedAppts.length} existing appointment(s). Please deactivate the doctor instead.`,
        'error'
      );
      return false;
    }

    setDoctors(prev => prev.filter(d => d.id !== doctorId));

    // If currently active doctor was deleted, gracefully switch to another active doctor
    if (doctorId === activeDoctorId) {
      const otherActive = doctors.find(d => d.id !== doctorId && (d.status || 'Active') === 'Active');
      if (otherActive) {
        setActiveDoctorId(otherActive.id);
        showToast(`Switched active profile to ${otherActive.name}`, 'info');
      }
    }

    showToast(`Doctor ${doc.name} deleted successfully.`, 'success');
    return true;
  };

  // ── Treatment Management Configuration ─────────────────────────────────────
  const addTreatment = (trtData) => {
    const newId = `TRT-${Date.now()}`;
    const newTrt = {
      id: newId,
      name: trtData.name?.trim(),
      category: trtData.category?.trim() || 'General Dentistry',
      enabled: trtData.enabled !== undefined ? trtData.enabled : true,
      createdAt: new Date().toISOString()
    };
    setTreatments(prev => [...prev, newTrt]);
    showToast(`Treatment "${newTrt.name}" added successfully!`, 'success');
    return newTrt;
  };

  const updateTreatment = (trtId, updatedFields) => {
    const prevTrt = treatments.find(t => t.id === trtId);
    setTreatments(prev => prev.map(t => {
      if (t.id === trtId) {
        return { ...t, ...updatedFields };
      }
      return t;
    }));
    if (updatedFields.name && prevTrt && prevTrt.name !== updatedFields.name) {
      setLeads(prev => prev.map(l => {
        if (l.treatment === prevTrt.name) {
          return { ...l, treatment: updatedFields.name };
        }
        return l;
      }));
    }
    showToast('Treatment details updated successfully!', 'success');
    return true;
  };

  const toggleTreatmentStatus = (trtId) => {
    setTreatments(prev => prev.map(t => {
      if (t.id === trtId) {
        const nextState = !t.enabled;
        showToast(`Treatment "${t.name}" is now ${nextState ? 'Enabled' : 'Disabled'}.`, 'info');
        return { ...t, enabled: nextState };
      }
      return t;
    }));
  };

  const deleteTreatment = (trtId) => {
    const trt = treatments.find(t => t.id === trtId);
    setTreatments(prev => prev.filter(t => t.id !== trtId));
    showToast(`Treatment "${trt?.name || 'Treatment'}" deleted successfully.`, 'info');
    return true;
  };

  const moveTreatment = (index, direction) => {
    setTreatments(prev => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const updated = [...prev];
      const item = updated.splice(index, 1)[0];
      updated.splice(targetIndex, 0, item);
      return updated;
    });
  };

  // Record Payment on Invoice
  const recordPayment = (invoiceId, amount, paymentMethod = 'UPI (GPay)', paymentNotes = '') => {
    const payAmount = Number(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      showToast('Please enter a valid payment amount', 'error');
      return false;
    }
    let targetPatientId = null;

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        targetPatientId = inv.patientId;
        const newPaid = (Number(inv.paidAmount) || 0) + payAmount;
        const newBalance = Math.max(0, (Number(inv.grandTotal) || 0) - newPaid);
        const newStatus = newBalance === 0 ? 'Paid' : 'Partial';
        return {
          ...inv,
          paidAmount: newPaid,
          balance: newBalance,
          status: newStatus,
          paymentMethod,
          paymentDate: new Date().toISOString().split('T')[0],
          paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
          paymentNotes: paymentNotes || inv.paymentNotes
        };
      }
      return inv;
    }));

    if (targetPatientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === targetPatientId) {
          const newOutstanding = Math.max(0, (Number(p.outstandingBalance) || 0) - payAmount);
          return { ...p, outstandingBalance: newOutstanding };
        }
        return p;
      }));
      if (patient360Data && patient360Data.id === targetPatientId) {
        setPatient360Data(prev => ({
          ...prev,
          outstandingBalance: Math.max(0, (Number(prev.outstandingBalance) || 0) - payAmount)
        }));
      }
    }

    showToast(`Payment of ₹${payAmount.toLocaleString()} recorded successfully!`);
    return true;
  };

  // Helper: get previous day YYYY-MM-DD
  const getPrevDayStr = (dateStr) => {
    try {
      const d = new Date(dateStr);
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    } catch (e) {
      return dateStr;
    }
  };

  // Active visit check: returns the active appointment if patient has an active check-in
  const getActiveVisitForPatient = (patientId, patientName) => {
    if (!patientId && !patientName) return null;
    const todayStr = new Date().toISOString().split('T')[0];
    return appointments.find(a => 
      ((patientId && a.patientId === patientId) || (patientName && a.patientName === patientName)) && 
      a.status === 'Checked In' &&
      (a.date === todayStr || a.date === '2026-11-06')
    ) || null;
  };

  const isPatientCheckedIn = (patientId, patientName) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const hasCheckedInAppt = appointments.some(a => 
      ((patientId && a.patientId === patientId) || (patientName && a.patientName === patientName)) && 
      a.status === 'Checked In' && 
      (a.date === todayStr || a.date === '2026-11-06')
    );
    const pat = patients.find(p => p.id === patientId || p.name === patientName);
    return hasCheckedInAppt || pat?.currentVisitStatus === 'Checked In';
  };

  // Open Book Appointment modal with optional preselected patient
  const openBookAppointment = (patient = null) => {
    setApptToBookPatient(patient);
    setIsBookApptSlotOpen(true);
  };

  // Open Instant Check-in modal with optional preselected patient
  const openInstantCheckIn = (patient = null) => {
    if (patient) {
      checkInPatient(patient);
      return;
    }
    setIsBookCheckInOpen(true);
  };

  const openRescheduleAppt = (appt) => {
    setRescheduleApptData(appt);
    setIsRescheduleApptOpen(true);
  };

  const openCancelAppt = (appt) => {
    setCancelApptData(appt);
    setIsCancelApptOpen(true);
  };

  // Action: Create Appointment & Auto-generate 2 Patient Follow-Up Reminders
  const addAppointment = (apptData) => {
    const targetBranch = apptData.branchId || selectedBranch || 'RS_PURAM';
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0];

    const newAppt = {
      ...apptData,
      id: apptData.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: apptData.date || todayDate,
      time: apptData.time || nowTime,
      branchId: targetBranch,
      type: apptData.type || 'In Clinic',
      status: apptData.status || 'Confirmed',
      checkInTime: apptData.status === 'Checked In' ? (apptData.checkInTime || nowTime) : null
    };

    setAppointments(prev => [newAppt, ...prev]);

    // Synchronise with Patient record: set current visit status and append to visit history
    if (newAppt.patientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === newAppt.patientId || p.name === newAppt.patientName) {
          const existingVisits = p.visitHistory || [];
          const newVisitEntry = {
            appointmentId: newAppt.id,
            date: newAppt.date,
            time: newAppt.time,
            checkInTime: newAppt.checkInTime,
            doctorName: newAppt.doctorName,
            treatment: newAppt.treatmentType,
            status: newAppt.status,
            branchId: newAppt.branchId,
            chair: newAppt.chair || 'Chair 1',
            type: newAppt.type
          };
          return {
            ...p,
            currentVisitStatus: newAppt.status === 'Checked In' ? 'Checked In' : (p.currentVisitStatus || null),
            activeAppointmentId: newAppt.status === 'Checked In' ? newAppt.id : (p.activeAppointmentId || null),
            lastVisit: newAppt.date,
            visitHistory: [newVisitEntry, ...existingVisits]
          };
        }
        return p;
      }));
    }

    // Automatically create 2 Appointment Reminders in Existing Patient Follow-ups:
    // 1. One day before the appointment
    // 2. On the appointment day
    const prevDay = getPrevDayStr(newAppt.date);

    const reminder1DayBefore = {
      id: `REM-${newAppt.id}-1D`,
      appointmentId: newAppt.id,
      patientId: newAppt.patientId,
      personType: 'patient',
      targetName: newAppt.patientName,
      phone: newAppt.phone,
      treatment: newAppt.treatmentType || 'Dental Consultation',
      category: 'Appointment Reminder',
      reminderType: 'Pre-Visit Reminder (1 Day Before)',
      scheduledDate: prevDay,
      appointmentDate: newAppt.date,
      appointmentTime: newAppt.time,
      doctorName: newAppt.doctorName,
      assignedTo: newAppt.assignedStaff || 'Sneha R (Front Desk)',
      reason: `Pre-visit reminder for ${newAppt.treatmentType || 'consultation'} tomorrow at ${newAppt.time}`,
      status: 'Pending',
      notes: `Appointment on ${newAppt.date} at ${newAppt.time} with ${newAppt.doctorName}`,
      branchId: newAppt.branchId,
      createdAt: new Date().toISOString()
    };

    const reminderDayOfVisit = {
      id: `REM-${newAppt.id}-SAME`,
      appointmentId: newAppt.id,
      patientId: newAppt.patientId,
      personType: 'patient',
      targetName: newAppt.patientName,
      phone: newAppt.phone,
      treatment: newAppt.treatmentType || 'Dental Consultation',
      category: 'Appointment Reminder',
      reminderType: 'Same-Day Visit Reminder',
      scheduledDate: newAppt.date,
      appointmentDate: newAppt.date,
      appointmentTime: newAppt.time,
      doctorName: newAppt.doctorName,
      assignedTo: newAppt.assignedStaff || 'Sneha R (Front Desk)',
      reason: `Same-day clinic arrival reminder for ${newAppt.treatmentType || 'consultation'} today at ${newAppt.time}`,
      status: 'Pending',
      notes: `Appointment today at ${newAppt.time} with ${newAppt.doctorName}`,
      branchId: newAppt.branchId,
      createdAt: new Date().toISOString()
    };

    setFollowups(prev => {
      const filtered = prev.filter(f => f.appointmentId !== newAppt.id);
      return [reminder1DayBefore, reminderDayOfVisit, ...filtered];
    });

    showToast(`Appointment confirmed for ${newAppt.patientName} (${newAppt.date} at ${newAppt.time}). Reminders scheduled!`);
    return newAppt;
  };

  // Action: Check-in Patient (No tokens, links to existing today appointment or creates walk-in)
  const checkInPatient = (patient) => {
    if (!patient) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check if there is an existing appointment for today
    const existingAppt = appointments.find(a => 
      (a.patientId === patient.id || a.patientName === patient.name) &&
      (a.date === todayStr || a.date === '2026-11-06') &&
      a.status !== 'Cancelled'
    );

    if (existingAppt) {
      setAppointments(prev => prev.map(a => {
        if (a.id === existingAppt.id) {
          return {
            ...a,
            status: 'Checked In',
            checkInTime: nowTime
          };
        }
        return a;
      }));
    } else {
      const newAppt = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: patient.id,
        patientName: patient.name,
        phone: patient.phone,
        branchId: patient.preferredBranch || selectedBranch || 'RS_PURAM',
        doctorId: doctors[0]?.id || 'DOC-01',
        doctorName: doctors[0]?.name || 'Dr. Priya Sharma',
        treatmentType: 'General Dental Consultation',
        date: todayStr,
        time: nowTime,
        type: 'Walk-in',
        status: 'Checked In',
        checkInTime: nowTime,
        bookingSource: 'Walk-in Arrival',
        assignedStaff: 'Front Desk',
        notes: 'Walk-in check-in at reception desk.'
      };
      setAppointments(prev => [newAppt, ...prev]);
    }

    // Update patient arrival status
    setPatients(prev => prev.map(p => {
      if (p.id === patient.id) {
        return {
          ...p,
          currentVisitStatus: 'Checked In',
          lastCheckInDate: todayStr,
          lastCheckInTime: nowTime
        };
      }
      return p;
    }));

    showToast(`Patient ${patient.name} checked in successfully.`);
  };

  // Action: Update Appointment Status
  const updateAppointmentStatus = (apptId, status) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        return { ...a, status };
      }
      return a;
    }));
    showToast(`Appointment marked as ${status}`);
  };

  // Action: Reschedule Appointment & update automatic reminders
  const rescheduleAppointment = (apptId, newDate, newTime, reason) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        const historyNote = `[Rescheduled from ${a.date} ${a.time} to ${newDate} ${newTime}. Reason: ${reason || 'Patient request'}]`;
        return {
          ...a,
          date: newDate,
          time: newTime,
          status: 'Rescheduled',
          notes: a.notes ? `${a.notes} • ${historyNote}` : historyNote
        };
      }
      return a;
    }));

    // Update related appointment reminders
    const prevDay = getPrevDayStr(newDate);
    setFollowups(prev => prev.map(f => {
      if (f.appointmentId === apptId) {
        const isOneDayBefore = f.reminderType?.includes('1 Day Before') || f.id.endsWith('-1D');
        return {
          ...f,
          scheduledDate: isOneDayBefore ? prevDay : newDate,
          appointmentDate: newDate,
          appointmentTime: newTime,
          status: 'Pending',
          notes: f.notes ? `${f.notes} • [Rescheduled to ${newDate} at ${newTime}]` : `Rescheduled to ${newDate} at ${newTime}`
        };
      }
      return f;
    }));

    showToast(`Appointment rescheduled to ${newDate} at ${newTime}. Reminders updated.`);
  };

  // Action: Cancel Appointment & cancel related reminders
  const cancelAppointment = (apptId, reason, cancelNotes = '') => {
    let cancelledAppt = null;
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        cancelledAppt = a;
        const historyNote = `[Cancelled: ${reason}${cancelNotes ? ' - ' + cancelNotes : ''}]`;
        return {
          ...a,
          status: 'Cancelled',
          cancelReason: reason,
          notes: a.notes ? `${a.notes} • ${historyNote}` : historyNote
        };
      }
      return a;
    }));

    // Cancel related follow-up reminders
    setFollowups(prev => prev.map(f => {
      if (f.appointmentId === apptId) {
        return {
          ...f,
          status: 'Cancelled',
          notes: f.notes ? `${f.notes} • [Appointment Cancelled: ${reason}]` : `Appointment Cancelled: ${reason}`
        };
      }
      return f;
    }));

    if (cancelledAppt && cancelledAppt.patientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === cancelledAppt.patientId || p.name === cancelledAppt.patientName) {
          return {
            ...p,
            currentVisitStatus: null,
            activeAppointmentId: null
          };
        }
        return p;
      }));
    }

    showToast(`Appointment ${apptId} cancelled`);
  };

  // Action: Check in appointment
  const checkInAppointment = (apptId) => {
    const checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let targetAppt = null;

    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        targetAppt = {
          ...a,
          status: 'Checked In',
          checkInTime
        };
        return targetAppt;
      }
      return a;
    }));

    if (targetAppt?.patientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === targetAppt.patientId || p.name === targetAppt.patientName) {
          return {
            ...p,
            currentVisitStatus: 'Checked In',
            activeAppointmentId: targetAppt.id,
            lastVisit: targetAppt.date
          };
        }
        return p;
      }));
    }

    showToast(`Patient ${targetAppt?.patientName || ''} checked in.`);
  };

  // Action: Call Next Patient (Doctor-wise or All Doctors)
  const callNextPatient = (doctorId = 'ALL') => {
    const eligible = appointments.filter(a => {
      const matchDoc = doctorId === 'ALL' || a.doctorId === doctorId;
      return matchDoc && a.status === 'Waiting';
    });

    if (eligible.length === 0) {
      showToast('No patients currently waiting in queue.', 'info');
      return null;
    }

    // Pick first patient in queue (FIFO check-in sequence)
    const nextPatient = eligible[0];

    setAppointments(prev => prev.map(a =>
      a.id === nextPatient.id ? { ...a, status: 'Called' } : a
    ));

    const announcement = {
      token: nextPatient.queueToken || 'Token 001',
      patientName: nextPatient.patientName,
      chair: nextPatient.chair || 'Chair 1',
      doctorName: nextPatient.doctorName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCalledPatientAnnouncement(announcement);
    showToast(`🔔 ${announcement.token} (${announcement.patientName}) called to ${announcement.chair}!`);
    return nextPatient;
  };

  // Action: Call Again
  const callPatientAgain = (apptId) => {
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) return;

    setCalledPatientAnnouncement({
      token: appt.queueToken || 'Token',
      patientName: appt.patientName,
      chair: appt.chair || 'Chair 1',
      doctorName: appt.doctorName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    showToast(`Re-announcing ${appt.queueToken} (${appt.patientName}) to ${appt.chair || 'Chair 1'}`);
  };

  // Action: Skip Token
  const skipPatientToken = (apptId) => {
    setAppointments(prev => prev.map(a =>
      a.id === apptId ? { ...a, status: 'Skipped' } : a
    ));
    showToast(`Patient token marked as Skipped`);
  };

  // Action: Recall Skipped Token back to Waiting
  const recallPatientToken = (apptId) => {
    setAppointments(prev => prev.map(a =>
      a.id === apptId ? { ...a, status: 'Waiting' } : a
    ));
    showToast(`Patient recalled back into live queue`);
  };

  // Action: Call patient into chair / In Consultation
  const callPatientToChair = (apptId, chair = 'Chair 1') => {
    setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, status: 'In Consultation', chair } : a));
    showToast(`Patient called to ${chair}`);
  };

  // Action: Finish consultation
  const completeAppointment = (apptId) => {
    let completedAppt = null;
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        completedAppt = a;
        return { ...a, status: 'Completed' };
      }
      return a;
    }));

    if (completedAppt && completedAppt.patientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === completedAppt.patientId || p.name === completedAppt.patientName) {
          const updatedVisits = (p.visitHistory || []).map(v => 
            v.appointmentId === apptId ? { ...v, status: 'Completed' } : v
          );
          return {
            ...p,
            currentVisitStatus: 'Completed',
            activeAppointmentId: null,
            activeQueueToken: null,
            visitHistory: updatedVisits
          };
        }
        return p;
      }));
    }

    showToast(`Consultation completed for ${apptId}`);
  };

  // Action: Mark No-Show
  const markAppointmentNoShow = (apptId) => {
    let noShowAppt = null;
    setAppointments(prev => prev.map(a => {
      if (a.id === apptId) {
        noShowAppt = a;
        return { ...a, status: 'No Show' };
      }
      return a;
    }));

    if (noShowAppt && noShowAppt.patientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === noShowAppt.patientId || p.name === noShowAppt.patientName) {
          return {
            ...p,
            currentVisitStatus: null,
            activeAppointmentId: null,
            activeQueueToken: null
          };
        }
        return p;
      }));
    }

    showToast(`Appointment marked as No Show`);
  };

  // Action: Complete Lead Follow-up with Outcome
  const completeLeadFollowupWithOutcome = (followupId, outcome, notes = '', nextFollowupData = null) => {
    const fol = followups.find(f => f.id === followupId);
    if (!fol) return;

    // 1. Mark follow-up completed with outcome
    setFollowups(prev => prev.map(f => {
      if (f.id === followupId) {
        return {
          ...f,
          status: 'Completed',
          outcome,
          outcomeNotes: notes,
          completedAt: new Date().toISOString()
        };
      }
      return f;
    }));

    // 2. Automatically update Lead status based on outcome
    if (fol.leadId) {
      let targetStatus = 'Contacted';
      let actionText = `Follow-up completed: ${outcome}`;

      if (outcome === 'Interested') {
        targetStatus = 'Interested';
        actionText = 'Lead interested in treatment. Ready for consultation booking.';
      } else if (outcome === 'Appointment Booked') {
        targetStatus = 'Appointment Booked';
        actionText = 'Appointment slot booked from follow-up.';
      } else if (outcome === 'Not Interested') {
        targetStatus = 'Lost Lead';
        actionText = `Marked as Lost: ${notes || 'Declined treatment'}`;
      } else if (outcome === 'Call Again Later') {
        targetStatus = 'Follow-up Required';
        actionText = `Callback scheduled for ${nextFollowupData?.date || 'next session'} at ${nextFollowupData?.time || '11:00 AM'}`;
      } else if (outcome === 'Requested More Information') {
        targetStatus = 'Contacted';
        actionText = 'Information/pricing shared via WhatsApp. Awaiting lead reply.';
      } else if (outcome === 'No Response') {
        targetStatus = 'Contacted';
        actionText = 'Attempted contact. No response from lead.';
      }

      const timelineEntry = {
        id: `TL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'followup',
        title: `Follow-Up Outcome: ${outcome}`,
        description: `${actionText} ${notes ? `(${notes})` : ''}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        user: currentUser?.name || 'Front Desk'
      };

      setLeads(prev => prev.map(l => {
        if (l.id === fol.leadId) {
          return {
            ...l,
            status: targetStatus,
            nextAction: actionText,
            timeline: [timelineEntry, ...(l.timeline || [])]
          };
        }
        return l;
      }));
    }

    // 3. If "Call Again Later" scheduled next follow-up, create it!
    if (outcome === 'Call Again Later' && nextFollowupData) {
      const newNextFol = {
        id: `FOL-${Math.floor(300 + Math.random() * 700)}`,
        leadId: fol.leadId,
        patientId: null,
        personType: 'lead',
        targetName: fol.targetName,
        phone: fol.phone,
        treatment: fol.treatment,
        reason: nextFollowupData.reason || 'Follow-up callback',
        assignedTo: fol.assignedTo || currentUser?.name || 'Sneha R (Front Desk)',
        scheduledDate: nextFollowupData.date,
        scheduledTime: nextFollowupData.time,
        scheduledDateTime: `${nextFollowupData.date}T11:00`,
        status: 'Pending',
        branchId: fol.branchId || 'RS_PURAM',
        category: 'First Contact Follow-up',
        priority: 'Warm',
        lastContactDate: 'Today',
        lastContactChannel: 'Call',
        notes: `Callback scheduled: ${notes || 'Lead requested recall.'}`,
        nextAction: `Call on ${nextFollowupData.date} at ${nextFollowupData.time}`
      };
      setFollowups(prev => [newNextFol, ...prev]);
      showToast(`Next follow-up scheduled for ${nextFollowupData.date}!`);
    } else {
      showToast(`Follow-up marked completed (${outcome})`);
    }
  };

  // Action: Add Patient Follow-up (Clinical / Recall / Post-treatment)
  const addPatientFollowup = (folData) => {
    const newFol = {
      id: `FOL-${Math.floor(400 + Math.random() * 600)}`,
      leadId: null,
      patientId: folData.patientId,
      personType: 'patient',
      targetName: folData.patientName,
      phone: folData.phone,
      treatment: folData.treatment || 'Dental Care',
      reason: folData.reason,
      assignedTo: folData.assignedTo || currentUser?.name || 'Dr. Priya Sharma',
      scheduledDate: folData.scheduledDate,
      scheduledTime: folData.scheduledTime || '11:00 AM',
      scheduledDateTime: `${folData.scheduledDate}T11:00`,
      status: 'Pending',
      branchId: folData.branchId || 'RS_PURAM',
      category: folData.category || 'Post-Treatment Follow-up',
      priority: 'Normal',
      lastContactDate: 'Today',
      lastContactChannel: folData.method || 'WhatsApp',
      notes: folData.clinicalNotes || folData.reason || 'Scheduled clinical follow-up',
      nextAction: `${folData.category} due on ${folData.scheduledDate}`
    };

    setFollowups(prev => [newFol, ...prev]);
    showToast(`Patient follow-up scheduled for ${folData.patientName}`);
    return newFol;
  };

  // Action: Add Follow-up
  const addFollowup = (folData) => {
    const newFol = {
      ...folData,
      id: `FOL-${Math.floor(200 + Math.random() * 800)}`,
      status: 'Pending'
    };
    setFollowups(prev => [newFol, ...prev]);
    showToast(`Follow-up scheduled for ${newFol.targetName}`);
    return newFol;
  };

  // Action: Complete Follow-up
  const completeFollowup = (folId) => {
    setFollowups(prev => prev.map(f => f.id === folId ? { ...f, status: 'Completed' } : f));
    showToast(`Follow-up marked completed`);
  };

  // Action: Create Lab Order
  const addLabOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `LAB-${Math.floor(880 + Math.random() * 1000)}`,
      status: 'Sent to Lab',
      dateSent: new Date().toISOString().split('T')[0],
      doctorVerified: false
    };
    setLabOrders(prev => [newOrder, ...prev]);
    showToast(`Lab Order ${newOrder.id} dispatched to ${newOrder.labName}`);
    return newOrder;
  };

  // Action: Update Lab Order Status
  const updateLabOrderStatus = (orderId, status, verified = false) => {
    setLabOrders(prev => prev.map(o => o.id === orderId ? { ...o, status, doctorVerified: verified || o.doctorVerified } : o));
    showToast(`Lab order status updated to ${status}`);
  };

  // Action: Add Invoice
  const addInvoice = (invoiceData) => {
    const newInv = {
      ...invoiceData,
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split('T')[0]
    };
    setInvoices(prev => [newInv, ...prev]);

    // Automatically synchronize patient billing totals
    if (newInv.patientId) {
      setPatients(prev => prev.map(p => {
        if (p.id === newInv.patientId) {
          return {
            ...p,
            totalBilled: (Number(p.totalBilled) || 0) + (Number(newInv.grandTotal) || 0),
            outstandingBalance: (Number(p.outstandingBalance) || 0) + (Number(newInv.balance) || 0)
          };
        }
        return p;
      }));
      if (patient360Data && patient360Data.id === newInv.patientId) {
        setPatient360Data(prev => ({
          ...prev,
          totalBilled: (Number(prev.totalBilled) || 0) + (Number(newInv.grandTotal) || 0),
          outstandingBalance: (Number(prev.outstandingBalance) || 0) + (Number(newInv.balance) || 0)
        }));
      }
    }

    showToast(`Invoice ${newInv.id} generated successfully!`);
    return newInv;
  };

  // Action: Transfer Stock
  const transferStock = ({ itemId, fromBranch, toBranch, quantity }) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock - Number(quantity))
        };
      }
      return item;
    }));
    showToast(`Successfully transferred ${quantity} units to ${toBranch}`);
  };

  // Action: Save Prescription
  const savePrescription = (rxData) => {
    const newRx = {
      ...rxData,
      id: rxData.id || `RX-${Math.floor(9000 + Math.random() * 1000)}`,
      date: new Date().toISOString().split('T')[0],
      signed: true,
      status: 'Finalized'
    };
    setPrescriptions(prev => [newRx, ...prev.filter(r => r.id !== newRx.id)]);
    showToast(`Prescription ${newRx.id} signed and finalized! Ready for print.`);
    return newRx;
  };

  // Global search lookup across patients, leads, appointments
  const searchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return { patients: [], leads: [], appointments: [] };
    const q = globalSearchQuery.toLowerCase();
    return {
      patients: patients.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q)
      ),
      leads: leads.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.treatment.toLowerCase().includes(q)
      ),
      appointments: appointments.filter(a =>
        a.patientName.toLowerCase().includes(q) ||
        a.patientId.toLowerCase().includes(q)
      )
    };
  }, [globalSearchQuery, patients, leads, appointments]);

  return (
    <AppContext.Provider
      value={{
        // Nav & User
        activeModule,
        setActiveModule,
        selectedBranch,
        setSelectedBranch,
        currentUser,
        setCurrentUser: (u) => {
          if (typeof u === 'string') selectDoctorProfile(u);
          else if (u?.id) selectDoctorProfile(u.id);
        },
        activeDoctorId,
        selectDoctorProfile,
        settingsTab,
        setSettingsTab,
        isSidebarCollapsed,
        setIsSidebarCollapsed,

        // Data collections
        branches: BRANCHES,
        doctors,
        activeDoctors,
        leads,
        filteredLeads,
        patients,
        filteredPatients,
        appointments,
        filteredAppointments,
        followups,
        filteredFollowups,
        labOrders,
        filteredLabOrders,
        invoices,
        filteredInvoices,
        treatmentPlans,
        dentalImages,
        setDentalImages,
        activeDrawingToLoad,
        setActiveDrawingToLoad,
        treatments,
        enabledTreatments,
        inventory,
        filteredInventory,
        prescriptions,
        campaigns,
        setCampaigns,
        feedbackList,
        setFeedbackList,

        // Active Patient Selection
        activePatientId,
        setActivePatientId,
        activePatient,
        patient360Data,
        setPatient360Data,
        getActiveVisitForPatient,
        isPatientCheckedIn,

        // Search
        globalSearchQuery,
        setGlobalSearchQuery,
        isSearchFocused,
        setIsSearchFocused,
        searchResults,

        // Actions
        addLead,
        deleteLead,
        updateLeadStatus,
        rescheduleFollowup,
        scheduleNextFollowup,
        completeFollowupTask,
        convertLeadToPatient,
        bookAppointmentFromLead,
        logLeadCommunication,
        addLeadNote,
        resetDemoData,
        addPatient,
        updatePatient,
        deletePatient,
        addTreatmentPlan,
        updateTreatmentPlan,
        deleteTreatmentPlan,
        saveDentalImage,
        updateDentalImage,
        deleteDentalImage,
        recordPayment,
        addAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        cancelAppointment,
        checkInAppointment,
        callPatientToChair,
        completeAppointment,
        markAppointmentNoShow,
        callNextPatient,
        callPatientAgain,
        skipPatientToken,
        recallPatientToken,
        completeLeadFollowupWithOutcome,
        addPatientFollowup,
        addFollowup,
        completeFollowup,
        addLabOrder,
        updateLabOrderStatus,
        addInvoice,
        updateInvoice,
        voidInvoice,
        deleteInvoice,
        deleteAppointment,
        deleteFollowup,
        addDoctor,
        updateDoctor,
        toggleDoctorStatus,
        deleteDoctor,
        addTreatment,
        updateTreatment,
        toggleTreatmentStatus,
        deleteTreatment,
        moveTreatment,
        transferStock,
        savePrescription,

        // Modals & Connected Workflow State
        isAddPatientOpen,
        setIsAddPatientOpen,
        isBookCheckInOpen,
        setIsBookCheckInOpen,
        isBookApptSlotOpen,
        setIsBookApptSlotOpen,
        apptToBookPatient,
        setApptToBookPatient,
        openBookAppointment,
        checkInPatient,
        checkInPatientModalData,
        setCheckInPatientModalData,
        openInstantCheckIn,
        isRescheduleApptOpen,
        setIsRescheduleApptOpen,
        rescheduleApptData,
        setRescheduleApptData,
        openRescheduleAppt,
        isCancelApptOpen,
        setIsCancelApptOpen,
        cancelApptData,
        setCancelApptData,
        openCancelAppt,
        tokenSlipData,
        setTokenSlipData,
        isTokenSlipOpen,
        setIsTokenSlipOpen,
        calledPatientAnnouncement,
        setCalledPatientAnnouncement,
        followupOutcomeData,
        setFollowupOutcomeData,
        isFollowupOutcomeOpen,
        setIsFollowupOutcomeOpen,
        isAddPatientFollowupOpen,
        setIsAddPatientFollowupOpen,
        patientFollowupTargetPatient,
        setPatientFollowupTargetPatient,
        isAddLeadOpen,
        setIsAddLeadOpen,
        leadToConvert,
        setLeadToConvert,
        isNewInvoiceOpen,
        setIsNewInvoiceOpen,
        isNewLabOrderOpen,
        setIsNewLabOrderOpen,
        isStockTransferOpen,
        setIsStockTransferOpen,

        // Detail Drawer & Workflow Modals
        selectedLeadId,
        setSelectedLeadId,
        leadStatusFilter,
        setLeadStatusFilter,
        isLeadDetailsOpen,
        setIsLeadDetailsOpen,
        whatsAppData,
        setWhatsAppData,
        isWhatsAppModalOpen,
        setIsWhatsAppModalOpen,
        rescheduleData,
        setRescheduleData,
        isRescheduleModalOpen,
        setIsRescheduleModalOpen,
        lostLeadData,
        setLostLeadData,
        isLostLeadModalOpen,
        setIsLostLeadModalOpen,
        leadToBookAppt,
        setLeadToBookAppt,

        // Constants
        leadStatuses: LEAD_STATUSES,
        followupCategories: FOLLOWUP_CATEGORIES,
        whatsappTemplates: WHATSAPP_TEMPLATES,

        // Toasts
        toasts,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
