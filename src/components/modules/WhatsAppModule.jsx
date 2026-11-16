import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  Building2,
  TrendingUp,
  AlertCircle,
  Eye,
  CheckCheck,
  Search,
  User,
  Phone,
  Calendar,
  CalendarPlus,
  UserCheck,
  ArrowRight,
  Filter,
  Trash2,
  Edit3,
  Bot,
  Zap,
  Tag,
  Paperclip,
  Smile,
  ShieldAlert,
  Info,
  HelpCircle,
  ChevronRight,
  Lock,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const BRANCH_OPTIONS = [
  { id: 'ALL', name: 'All Branches (Coimbatore Network)' },
  { id: 'RS_PURAM', name: 'R.S. Puram (Flagship Clinic)' },
  { id: 'GANDHIPURAM', name: 'Gandhipuram Branch' },
  { id: 'PEELAMEDU', name: 'Peelamedu (Avinashi Road)' },
  { id: 'SAIBABA_COLONY', name: 'Saibaba Colony Branch' },
  { id: 'SARAVANAMPATTI', name: 'Saravanampatti Tech Zone' },
  { id: 'SINGANALLUR', name: 'Singanallur Trichy Road' }
];

const AUDIENCE_SEGMENTS = [
  { id: 'new_leads', name: 'New Leads (Uncontacted)', count: 24, source: 'Leads' },
  { id: 'contacted_leads', name: 'Contacted Leads (In Pipeline)', count: 52, source: 'Leads' },
  { id: 'followup_required', name: 'Leads Requiring Follow-Up', count: 38, source: 'Leads' },
  { id: 'existing_patients', name: 'All Registered Patients (6 Branches)', count: 1420, source: 'Patients' },
  { id: 'pending_treatment', name: 'Patients with Pending Treatment', count: 185, source: 'Patients' },
  { id: 'inactive_patients', name: 'Inactive Patients (> 180 Days Recall)', count: 340, source: 'Patients' }
];

const INITIAL_AUTOMATION_RULES = [
  {
    id: 'RUL-01',
    name: 'New Lead Instant Welcome & Treatment Brochure',
    trigger: 'Immediately when enquiry received via Web / Meta Ads',
    delay: '5 minutes',
    branch: 'ALL',
    template: 'New enquiry acknowledgement (TMP-01)',
    requireApproval: false,
    active: true
  },
  {
    id: 'RUL-02',
    name: 'Appointment Booking Confirmation Dispatch',
    trigger: 'When appointment status moves to Booked or Confirmed',
    delay: 'Instant',
    branch: 'ALL',
    template: 'Appointment confirmation with clinic map (TMP-05)',
    requireApproval: false,
    active: true
  },
  {
    id: 'RUL-03',
    name: 'Pre-Visit Appointment Reminders (T-24h & T-2h)',
    trigger: 'Scheduled 24 hours & 2 hours before appointment slot',
    delay: '24 hours prior',
    branch: 'ALL',
    template: 'Appointment reminder with timing & doctor (TMP-06)',
    requireApproval: false,
    active: true
  },
  {
    id: 'RUL-04',
    name: 'Missed Appointment Reschedule Outreach',
    trigger: 'When appointment marked as No Show or Cancelled',
    delay: '30 minutes',
    branch: 'ALL',
    template: 'Missed appointment follow-up & reschedule (TMP-07)',
    requireApproval: true,
    active: true
  },
  {
    id: 'RUL-05',
    name: 'Pending Treatment & Clinical Quote Follow-Up',
    trigger: 'When treatment plan / quote shared without booking',
    delay: '3 days',
    branch: 'ALL',
    template: 'Treatment pending reminder & EMI options (TMP-08)',
    requireApproval: true,
    active: true
  },
  {
    id: 'RUL-06',
    name: 'Post-Treatment 24h Care & Pain Check-in',
    trigger: 'When consultation / procedure marked Completed',
    delay: '24 hours',
    branch: 'ALL',
    template: 'Post-treatment care & pain check instructions (TMP-09)',
    requireApproval: false,
    active: true
  },
  {
    id: 'RUL-07',
    name: '6-Month Dental Hygiene & Prophylaxis Recall',
    trigger: '180 days after last cleaning or dental consultation',
    delay: '180 days',
    branch: 'ALL',
    template: 'Dental check-up & smile recall (TMP-10)',
    requireApproval: true,
    active: true
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'CONV-01',
    name: 'Gokul Chandran',
    personType: 'patient',
    idCode: 'IND-0292',
    phone: '+91 80721 03756',
    branch: 'R.S. Puram (Flagship)',
    status: 'In Consultation',
    treatment: 'Root Canal Treatment (Tooth 46)',
    assignedTo: 'Dr. Priya Sharma',
    time: '11:15 AM',
    unread: 0,
    upcomingAppt: 'Today at 11:00 AM with Dr. Priya Sharma',
    notes: 'Prescribed Augmentin & Ketorol-DT. Check swelling and percussion sensitivity tomorrow.',
    messages: [
      { id: 1, sender: 'patient', text: 'Doctor, will I have pain after the root canal today?', time: '11:10 AM' },
      { id: 2, sender: 'clinic', text: 'Hello Gokul! Mild tenderness for 24-48 hours is normal. Take Ketorol-DT only if severe pain occurs, and finish your Augmentin course.', time: '11:12 AM', status: 'read' },
      { id: 3, sender: 'patient', text: 'Understood, thank you Dr. Priya!', time: '11:15 AM' }
    ]
  },
  {
    id: 'CONV-02',
    name: 'Mrs. Ananya Krishnan',
    personType: 'patient',
    idCode: 'IND-0184',
    phone: '+91 98432 55678',
    branch: 'R.S. Puram (Flagship)',
    status: 'Waiting in Queue (Token 002)',
    treatment: 'Implant Crown Trial / Fixing',
    assignedTo: 'Sneha R (Front Desk)',
    time: '10:45 AM',
    unread: 0,
    upcomingAppt: 'Today at 11:45 AM with Dr. Priya Sharma',
    notes: 'Custom Zirconia abutment and crown received from Apex Lab yesterday.',
    messages: [
      { id: 1, sender: 'clinic', text: 'Dear Mrs. Ananya, your custom Zirconia crown has arrived from the lab. Please confirm your trial slot today at 11:45 AM.', time: '10:30 AM', status: 'read' },
      { id: 2, sender: 'patient', text: 'Yes, on my way to R.S. Puram branch now. Arriving by 11:35 AM.', time: '10:45 AM' },
      { id: 3, sender: 'clinic', text: 'Noted! Chair 2 is reserved for you. See you soon.', time: '10:47 AM', status: 'read' }
    ]
  },
  {
    id: 'CONV-03',
    name: 'Arun Kumar',
    personType: 'lead',
    idCode: 'LD-4091',
    phone: '+91 98430 12845',
    branch: 'R.S. Puram',
    status: 'Interested Lead',
    treatment: 'Full Mouth Dental Implants',
    assignedTo: 'Sneha R (Front Desk)',
    time: '09:50 AM',
    unread: 1,
    upcomingAppt: 'None scheduled yet',
    notes: 'Inquired from Google Ads about Swiss Straumann implants and 3D CBCT scan.',
    messages: [
      { id: 1, sender: 'patient', text: 'Hi, what is the cost of single tooth Straumann implant at INDUS Dental?', time: '09:45 AM' },
      { id: 2, sender: 'clinic', text: 'Hello Arun! We provide Swiss Straumann implants starting with complete CBCT 3D planning. May we schedule a quick consultation with our Chief Implantologist?', time: '09:50 AM', status: 'delivered' }
    ]
  },
  {
    id: 'CONV-04',
    name: 'Divya S',
    personType: 'lead',
    idCode: 'LD-4092',
    phone: '+91 97890 44210',
    branch: 'Peelamedu',
    status: 'Contacted',
    treatment: 'Clear Aligners / Invisible Braces',
    assignedTo: 'Dr. Arun Agarwal',
    time: 'Yesterday',
    unread: 0,
    upcomingAppt: 'Pending in-clinic 3D digital scan',
    notes: 'PSG Tech college student. Inquired about monthly zero-interest EMI options.',
    messages: [
      { id: 1, sender: 'patient', text: 'Do you offer monthly EMI for clear aligners?', time: 'Yesterday 04:15 PM' },
      { id: 2, sender: 'clinic', text: 'Yes Divya! We offer 0% interest Bajaj Finserv EMI starting from ₹3,500/month. Would you like to book a free 3D smile assessment this Saturday?', time: 'Yesterday 04:30 PM', status: 'read' }
    ]
  },
  {
    id: 'CONV-05',
    name: 'Ms. Deepika Ranganathan',
    personType: 'patient',
    idCode: 'IND-0245',
    phone: '+91 97860 11984',
    branch: 'Peelamedu',
    status: 'Confirmed Appointment',
    treatment: 'Clear Aligner Tray #4 Delivery',
    assignedTo: 'Dr. Arun Agarwal',
    time: 'Yesterday',
    unread: 0,
    upcomingAppt: 'Today at 02:30 PM with Dr. Arun Agarwal',
    notes: 'Tray 4 and 5 ready in clinic kit.',
    messages: [
      { id: 1, sender: 'clinic', text: 'Hello Deepika! Your Aligner Tray #4 is ready at our Peelamedu clinic. Appointment is set for today at 02:30 PM.', time: 'Yesterday 06:00 PM', status: 'read' },
      { id: 2, sender: 'patient', text: 'Perfect, see you at 2:30 PM.', time: 'Yesterday 06:15 PM' }
    ]
  }
];

export default function WhatsAppModule() {
  const {
    campaigns,
    setCampaigns,
    showToast,
    selectedBranch,
    branches,
    leads,
    patients,
    openBookAppointment,
    setPatient360Data,
    setSelectedLeadId,
    setIsLeadDetailsOpen,
    setIsAddPatientFollowupOpen,
    setPatientFollowupTargetPatient,
    whatsappTemplates
  } = useApp();

  // Top Tabs: 'campaigns', 'inbox', 'automation', 'templates', 'api_config'
  const [activeTab, setActiveTab] = useState('campaigns');

  // ── CAMPAIGN BUILDER STATE ──
  const [campaignName, setCampaignName] = useState('');
  const [campaignType, setCampaignType] = useState('Dental Check-up Reminders');
  const [targetAudience, setTargetAudience] = useState('new_leads');
  const [campaignBranch, setCampaignBranch] = useState('ALL');
  const [selectedTemplateText, setSelectedTemplateText] = useState(
    'Dear {{patient_name}}, Greetings from INDUS Dental {{branch_name}}! 🦷 Your regular 6-month dental check-up and prophylaxis is due. Protect your healthy smile today with our special Coimbatore branch slot.'
  );
  const [scheduleMode, setScheduleMode] = useState('now'); // 'now' or 'later'
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('10:00 AM');
  const [isConfirmingCampaign, setIsConfirmingCampaign] = useState(false);

  // ── INBOX STATE ──
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState('CONV-01');
  const [inboxFilter, setInboxFilter] = useState('all'); // 'all', 'leads', 'patients', 'unread', 'mine'
  const [inboxSearch, setInboxSearch] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMode, setChatMode] = useState('chat'); // 'chat' or 'internal_note'
  const [internalNotes, setInternalNotes] = useState({});

  // ── AUTOMATION RULES STATE ──
  const [automationRules, setAutomationRules] = useState(INITIAL_AUTOMATION_RULES);

  // ── TEMPLATES STATE (EDITABLE) ──
  const [templatesList, setTemplatesList] = useState(() => {
    return (whatsappTemplates || []).map(t => ({
      ...t,
      metaStatus: 'Approved (Sandbox Demo)',
      lastEdited: 'Today'
    }));
  });
  const [templateFilterCategory, setTemplateFilterCategory] = useState('ALL');
  const [editingTemplate, setEditingTemplate] = useState(null); // null or template object
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: '',
    category: 'Lead Messages',
    text: ''
  });

  // Current active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === selectedConvId) || conversations[0];
  }, [conversations, selectedConvId]);

  // Filtered inbox conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      const q = inboxSearch.toLowerCase().trim();
      const matchesSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.idCode.toLowerCase().includes(q) ||
        c.treatment.toLowerCase().includes(q);

      let matchesFilter = true;
      if (inboxFilter === 'leads') matchesFilter = c.personType === 'lead';
      if (inboxFilter === 'patients') matchesFilter = c.personType === 'patient';
      if (inboxFilter === 'unread') matchesFilter = c.unread > 0;
      if (inboxFilter === 'mine') matchesFilter = c.assignedTo.includes('Priya');

      return matchesSearch && matchesFilter;
    });
  }, [conversations, inboxFilter, inboxSearch]);

  // Recipient Count for Campaign Builder
  const selectedSegmentObj = AUDIENCE_SEGMENTS.find(s => s.id === targetAudience) || AUDIENCE_SEGMENTS[0];
  const sampleContacts = selectedSegmentObj.source === 'Leads'
    ? leads.slice(0, 4)
    : patients.slice(0, 4);

  // Send message in demo inbox
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (chatMode === 'internal_note') {
      const currentNotes = internalNotes[activeConversation.id] || [];
      setInternalNotes({
        ...internalNotes,
        [activeConversation.id]: [
          ...currentNotes,
          { text: chatInput.trim(), author: 'Staff', time: timeStr }
        ]
      });
      showToast('Internal note saved for clinic team');
    } else {
      const newMsg = {
        id: Date.now(),
        sender: 'clinic',
        text: chatInput.trim(),
        time: timeStr,
        status: 'delivered'
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            time: timeStr,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      }));

      showToast(`Reply dispatched to ${activeConversation.name} (Sandbox Demo)`);
    }

    setChatInput('');
  };

  // Quick reply chip click
  const handleQuickReply = (text) => {
    setChatInput(text);
  };

  // Launch Campaign
  const handleLaunchCampaign = () => {
    if (!campaignName.trim()) {
      showToast('Please enter a campaign name', 'error');
      return;
    }

    const newCmp = {
      id: `CMP-${Math.floor(200 + Math.random() * 800)}`,
      name: campaignName,
      type: campaignType,
      branchId: campaignBranch,
      targetAudience: selectedSegmentObj.name,
      recipientCount: selectedSegmentObj.count,
      deliveredCount: Math.round(selectedSegmentObj.count * 0.98),
      readCount: Math.round(selectedSegmentObj.count * 0.86),
      repliesCount: Math.round(selectedSegmentObj.count * 0.14),
      status: scheduleMode === 'now' ? 'Active' : 'Scheduled',
      date: scheduleMode === 'now' ? 'Today' : scheduleDate,
      templateName: 'indus_custom_broadcast',
      roi: '8-14 Consultations Projected'
    };

    setCampaigns(prev => [newCmp, ...prev]);
    showToast(`Campaign "${campaignName}" scheduled successfully (Sandbox Demo)!`);
    setCampaignName('');
    setIsConfirmingCampaign(false);
  };

  // Toggle Automation Rule
  const handleToggleRule = (ruleId) => {
    setAutomationRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const nextState = !r.active;
        showToast(`Rule "${r.name}" ${nextState ? 'Enabled' : 'Disabled'}`);
        return { ...r, active: nextState };
      }
      return r;
    }));
  };

  // Save edited template
  const handleSaveEditedTemplate = () => {
    if (!editingTemplate) return;
    setTemplatesList(prev => prev.map(t => t.id === editingTemplate.id ? { ...editingTemplate, lastEdited: 'Just now' } : t));
    showToast(`Template "${editingTemplate.name}" updated successfully!`);
    setEditingTemplate(null);
  };

  // Create new template
  const handleCreateNewTemplate = (e) => {
    e.preventDefault();
    if (!newTemplateForm.name.trim() || !newTemplateForm.text.trim()) {
      showToast('Please complete all template fields', 'error');
      return;
    }

    const newTpl = {
      id: `TMP-${Math.floor(20 + Math.random() * 80)}`,
      name: newTemplateForm.name.trim(),
      category: newTemplateForm.category,
      text: newTemplateForm.text.trim(),
      metaStatus: 'Approved (Sandbox Demo)',
      lastEdited: 'Just now'
    };

    setTemplatesList(prev => [newTpl, ...prev]);
    showToast(`New template "${newTpl.name}" created!`);
    setIsCreatingTemplate(false);
    setNewTemplateForm({ name: '', category: 'Lead Messages', text: '' });
  };

  // Delete template
  const handleDeleteTemplate = (id) => {
    setTemplatesList(prev => prev.filter(t => t.id !== id));
    showToast('Template deleted');
  };

  // Quick actions from chat
  const handleChatBookAppt = () => {
    if (activeConversation.personType === 'lead') {
      const lead = leads.find(l => l.id === activeConversation.idCode) || {
        id: activeConversation.idCode,
        name: activeConversation.name,
        phone: activeConversation.phone,
        treatment: activeConversation.treatment
      };
      openBookAppointment(lead);
    } else {
      const patient = patients.find(p => p.id === activeConversation.idCode) || {
        id: activeConversation.idCode,
        name: activeConversation.name,
        phone: activeConversation.phone,
        preferredBranch: 'RS_PURAM'
      };
      openBookAppointment(patient);
    }
  };

  const handleChatOpenProfile = () => {
    if (activeConversation.personType === 'lead') {
      setSelectedLeadId(activeConversation.idCode);
      setIsLeadDetailsOpen(true);
    } else {
      const patient = patients.find(p => p.id === activeConversation.idCode);
      if (patient) setPatient360Data(patient);
    }
  };

  const handleChatFollowup = () => {
    if (activeConversation.personType === 'patient') {
      const patient = patients.find(p => p.id === activeConversation.idCode);
      if (patient) {
        setPatientFollowupTargetPatient(patient);
        setIsAddPatientFollowupOpen(true);
      }
    } else {
      showToast('Schedule a follow-up directly from the Leads pipeline.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">WhatsApp Communication Centre</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#1769D2] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1769D2] animate-pulse"></span>
              Frontend Sandbox Demo
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast campaigns, collaborative team inbox, automated healthcare triggers, and template approvals
          </p>
        </div>

        {/* Top 5 Tab Navigation */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold overflow-x-auto scrollbar-thin">
          {[
            { id: 'campaigns', label: 'Campaigns & Analytics' },
            { id: 'inbox', label: 'Shared Team Inbox' },
            { id: 'automation', label: 'Automation Rules' },
            { id: 'templates', label: 'Message Templates' },
            { id: 'api_config', label: 'API Configuration' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-[#102A50] shadow-xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          TAB 1: CAMPAIGNS & ANALYTICS
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Creation Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-[#1769D2]" />
                <span>Create & Broadcast WhatsApp Campaign</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">
                Meta Business Cloud Broadcast Simulator
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Form Controls (Col 8) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. November Deep Cleaning & Smile Camp"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Type</label>
                    <select
                      value={campaignType}
                      onChange={(e) => setCampaignType(e.target.value)}
                      className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none cursor-pointer"
                    >
                      <option value="Dental Check-up Reminders">Dental Check-up Reminders</option>
                      <option value="Clear Aligners & Braces Camp">Clear Aligners & Braces Camp</option>
                      <option value="Implant Awareness & Consultation">Implant Awareness & Consultation</option>
                      <option value="Festival Greetings & Offers">Festival Greetings & Offers</option>
                      <option value="Post-Treatment Care Wave">Post-Treatment Care Wave</option>
                      <option value="Patient Review & Feedback Request">Patient Review & Feedback Request</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Target Audience */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience Segment</label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none cursor-pointer"
                    >
                      {AUDIENCE_SEGMENTS.map(seg => (
                        <option key={seg.id} value={seg.id}>
                          {seg.name} ({seg.count} contacts)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Branch Selection supporting all 6 branches */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Branch Filter</label>
                    <select
                      value={campaignBranch}
                      onChange={(e) => setCampaignBranch(e.target.value)}
                      className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2.5 text-[#102A50] outline-none cursor-pointer"
                    >
                      {BRANCH_OPTIONS.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Template Selection & Personalised Preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select Message Template
                  </label>
                  <select
                    onChange={(e) => {
                      const t = templatesList.find(tpl => tpl.id === e.target.value);
                      if (t) setSelectedTemplateText(t.text);
                    }}
                    className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer mb-2"
                  >
                    {templatesList.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>

                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Personalized HSM Template Preview
                  </label>
                  <textarea
                    rows={3}
                    value={selectedTemplateText}
                    onChange={(e) => setSelectedTemplateText(e.target.value)}
                    className="w-full text-xs font-medium bg-[#EEF5FF] border border-blue-200/60 rounded-xl p-3 text-slate-800 outline-none resize-none leading-relaxed"
                  />
                  <span className="text-[10px] text-slate-400">
                    Placeholders like <code className="bg-white px-1 py-0.5 rounded text-[#1769D2]">{'{{patient_name}}'}</code> and <code className="bg-white px-1 py-0.5 rounded text-[#1769D2]">{'{{branch_name}}'}</code> are dynamically replaced for each recipient.
                  </span>
                </div>

                {/* Schedule Options */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="schedule"
                        checked={scheduleMode === 'now'}
                        onChange={() => setScheduleMode('now')}
                        className="text-[#1769D2]"
                      />
                      <span>Broadcast Immediately</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="schedule"
                        checked={scheduleMode === 'later'}
                        onChange={() => setScheduleMode('later')}
                        className="text-[#1769D2]"
                      />
                      <span>Schedule for Later</span>
                    </label>
                  </div>

                  {scheduleMode === 'later' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={scheduleDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[#102A50]"
                      />
                      <input
                        type="text"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        placeholder="10:00 AM"
                        className="w-24 text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 text-[#102A50]"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Recipient Preview & Confirmation (Col 4) */}
              <div className="lg:col-span-4 bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Audience Scope
                    </span>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                      {selectedSegmentObj.count} Recipients
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="text-xs font-bold text-[#102A50]">
                      Segment: <span className="font-semibold text-slate-600">{selectedSegmentObj.name}</span>
                    </div>
                    <div className="text-xs font-bold text-[#102A50]">
                      Branch: <span className="font-semibold text-slate-600">{BRANCH_OPTIONS.find(b => b.id === campaignBranch)?.name}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Sample Contacts Preview
                      </span>
                      <div className="space-y-1.5">
                        {sampleContacts.map((c, i) => (
                          <div key={i} className="p-2 bg-white rounded-xl border border-slate-100 text-[11px] flex items-center justify-between">
                            <span className="font-bold text-slate-800">{c.name}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{c.phone}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingCampaign(true)}
                    className="w-full py-3 bg-[#16A779] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send size={14} />
                    <span>Review & Schedule Broadcast →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Modal */}
          {isConfirmingCampaign && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#102A50]">Confirm WhatsApp Broadcast</h3>
                    <p className="text-xs text-slate-500">INDUS Dental Meta Broadcast Sandbox</p>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Campaign:</span>
                    <span className="font-bold text-slate-800">{campaignName || 'Untitled'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Audience:</span>
                    <span className="font-bold text-slate-800">{selectedSegmentObj.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Recipients:</span>
                    <span className="font-extrabold text-[#1769D2]">{selectedSegmentObj.count} Patients / Leads</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dispatch Time:</span>
                    <span className="font-bold text-slate-800">
                      {scheduleMode === 'now' ? 'Immediate' : `${scheduleDate} at ${scheduleTime}`}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-normal">
                  ⚠️ This will simulate a high-speed dispatch across Coimbatore branches. Replies will appear in the Shared Team Inbox.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingCampaign(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Edit Campaign
                  </button>
                  <button
                    type="button"
                    onClick={handleLaunchCampaign}
                    className="flex-1 py-2.5 rounded-xl bg-[#16A779] hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send size={13} />
                    <span>Confirm & Broadcast</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Campaign History & Performance Analytics */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-xs text-[#102A50] uppercase tracking-wider">
                Broadcast Campaign Performance & Analytics ({campaigns.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-semibold">
                Live delivery & conversion metrics
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map(cmp => (
                <div key={cmp.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                        {cmp.type}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        cmp.status === 'Active'
                          ? 'bg-blue-100 text-[#1769D2]'
                          : cmp.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {cmp.status}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#102A50] mt-3">{cmp.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{cmp.targetAudience}</p>

                    {/* KPI 6-Grid: Sent, Delivered, Read, Replies, Appointments, Converted */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center">
                      <div className="p-2 bg-slate-50 rounded-xl">
                        <div className="text-[9px] text-slate-400 font-bold uppercase">Sent</div>
                        <div className="text-xs font-black text-slate-800">{cmp.recipientCount}</div>
                      </div>
                      <div className="p-2 bg-blue-50/60 rounded-xl">
                        <div className="text-[9px] text-blue-600 font-bold uppercase">Delivered</div>
                        <div className="text-xs font-black text-[#1769D2]">{cmp.deliveredCount}</div>
                      </div>
                      <div className="p-2 bg-emerald-50/60 rounded-xl">
                        <div className="text-[9px] text-emerald-600 font-bold uppercase">Read</div>
                        <div className="text-xs font-black text-emerald-700">{cmp.readCount}</div>
                      </div>
                      <div className="p-2 bg-purple-50/60 rounded-xl">
                        <div className="text-[9px] text-purple-600 font-bold uppercase">Replies</div>
                        <div className="text-xs font-black text-purple-700">{cmp.repliesCount}</div>
                      </div>
                      <div className="p-2 bg-indigo-50/60 rounded-xl">
                        <div className="text-[9px] text-indigo-600 font-bold uppercase">Appts Booked</div>
                        <div className="text-xs font-black text-indigo-700">{Math.round(cmp.repliesCount * 0.42)}</div>
                      </div>
                      <div className="p-2 bg-teal-50/60 rounded-xl">
                        <div className="text-[9px] text-teal-600 font-bold uppercase">Converted</div>
                        <div className="text-xs font-black text-teal-800">{Math.round(cmp.repliesCount * 0.28)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-600 flex justify-between items-center">
                    <span>Clinical Impact / ROI:</span>
                    <span className="text-[#1769D2] font-extrabold">{cmp.roi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 2: SHARED TEAM INBOX (3-PANE COLLABORATION)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* ── Left Pane: Conversation List (Col 4) ── */}
          <div className="lg:col-span-4 border-r border-slate-200 flex flex-col bg-[#F8FAFC]">
            {/* Search */}
            <div className="p-3 border-b border-slate-200 bg-white">
              <div className="relative">
                <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search chats by name, phone, UHID..."
                  value={inboxSearch}
                  onChange={(e) => setInboxSearch(e.target.value)}
                  className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 mt-2.5 overflow-x-auto scrollbar-thin pb-1">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'leads', label: 'New Leads' },
                  { id: 'patients', label: 'Patients' },
                  { id: 'unread', label: 'Unread' },
                  { id: 'mine', label: 'My Chats' }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setInboxFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      inboxFilter === f.id
                        ? 'bg-[#1769D2] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredConversations.map(conv => {
                const isSelected = selectedConvId === conv.id;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-[#1769D2]'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-xs ${
                        conv.personType === 'lead'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-[#1769D2]'
                      }`}>
                        {conv.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      {conv.unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white font-extrabold text-[9px] flex items-center justify-center shadow-xs">
                          {conv.unread}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-extrabold text-xs text-[#102A50] truncate">
                          {conv.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                          {conv.time}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          conv.personType === 'lead'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-[#1769D2]'
                        }`}>
                          {conv.personType === 'lead' ? 'Lead' : 'Patient'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{conv.idCode}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mt-1">
                        {lastMsg ? lastMsg.text : 'No messages'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Centre Pane: Active Chat Stream (Col 5) ── */}
          <div className="lg:col-span-5 flex flex-col justify-between border-r border-slate-200 bg-[#F4F8FC]">
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1769D2] flex items-center justify-center font-extrabold text-xs shrink-0">
                  {activeConversation.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-[#102A50] truncate">
                      {activeConversation.name}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      activeConversation.personType === 'lead' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-[#1769D2]'
                    }`}>
                      {activeConversation.idCode}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span>{activeConversation.phone}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">Online</span>
                  </div>
                </div>
              </div>

              {/* Staff Assignment */}
              <select
                value={activeConversation.assignedTo}
                onChange={(e) => {
                  const val = e.target.value;
                  setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, assignedTo: val } : c));
                  showToast(`Conversation assigned to ${val}`);
                }}
                className="text-[10px] font-bold bg-[#F8FAFC] border border-slate-200 rounded-lg px-2 py-1 text-[#102A50] outline-none cursor-pointer"
              >
                <option>Sneha R (Front Desk)</option>
                <option>Dr. Priya Sharma</option>
                <option>Dr. Arun Agarwal</option>
                <option>Praveen M (Billing)</option>
              </select>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] scrollbar-thin">
              {activeConversation.messages.map(m => {
                const isClinic = m.sender === 'clinic';
                return (
                  <div key={m.id} className={`flex ${isClinic ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-md p-3.5 rounded-2xl text-xs font-medium shadow-xs leading-relaxed ${
                      isClinic
                        ? 'bg-[#1769D2] text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}>
                      <div>{m.text}</div>
                      <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        isClinic ? 'text-blue-100' : 'text-slate-400'
                      }`}>
                        <span>{m.time}</span>
                        {isClinic && <CheckCheck size={12} className="text-blue-200 inline" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Internal Notes stream in chat */}
              {(internalNotes[activeConversation.id] || []).map((note, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Lock size={12} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold text-amber-800">
                      Internal Clinic Note · {note.time}
                    </div>
                    <div className="text-amber-950 font-medium mt-0.5">{note.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies Bar */}
            <div className="px-4 py-2 bg-white border-t border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Quick Reply Templates</span>
                <span className="text-[9px] text-[#1769D2]">Click to insert</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
                {[
                  { label: 'Confirm Slot', text: 'Hello! Your consultation slot is confirmed with our Chief Surgeon. Please arrive 10 mins early.' },
                  { label: 'Clinic Map', text: 'INDUS Dental Coimbatore: 142 D.B. Road, R.S. Puram. Landmark: Near Flower Market signal.' },
                  { label: '0% EMI Plans', text: 'We offer zero-downpayment 0% interest monthly EMI for implants and aligners via Bajaj Finserv.' },
                  { label: 'Post-Op Check', text: 'Hope you are recovering smoothly! Remember to stick to soft foods and complete your medication.' }
                ].map((chip, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickReply(chip.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-[10px] font-bold text-slate-700 hover:text-[#1769D2] whitespace-nowrap cursor-pointer transition-colors"
                  >
                    + {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Mode & Input Bar */}
            <div className="p-3 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setChatMode('chat')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    chatMode === 'chat'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  WhatsApp Reply
                </button>
                <button
                  type="button"
                  onClick={() => setChatMode('internal_note')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    chatMode === 'internal_note'
                      ? 'bg-amber-100 text-amber-800'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Lock size={10} />
                  <span>Internal Note (Team Only)</span>
                </button>
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={chatMode === 'internal_note' ? "Write internal staff note..." : "Type WhatsApp reply to patient..."}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className={`flex-1 border rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none ${
                    chatMode === 'internal_note'
                      ? 'bg-amber-50/50 border-amber-300 focus:bg-white'
                      : 'bg-[#F8FAFC] border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100'
                  }`}
                />
                <button
                  type="submit"
                  className={`p-2.5 text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                    chatMode === 'internal_note'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-[#1769D2] hover:bg-blue-700'
                  }`}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* ── Right Pane: CRM Patient/Lead Intel Panel (Col 3) ── */}
          <div className="lg:col-span-3 bg-white p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  CRM Intelligence Panel
                </span>
                <h4 className="font-extrabold text-sm text-[#102A50]">{activeConversation.name}</h4>
                <div className="text-xs font-bold text-[#1769D2] mt-0.5">
                  {activeConversation.treatment}
                </div>
              </div>

              {/* Metadata Cards */}
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Record Type & ID</div>
                  <div className="font-extrabold text-[#102A50] mt-0.5">
                    {activeConversation.personType === 'lead' ? 'Prospective Lead' : 'Registered Patient'} · {activeConversation.idCode}
                  </div>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Current Status</div>
                  <div className="font-bold text-emerald-700 mt-0.5">{activeConversation.status}</div>
                </div>

                <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Upcoming / Last Appt</div>
                  <div className="font-bold text-slate-700 mt-0.5 text-[11px] leading-tight">
                    {activeConversation.upcomingAppt}
                  </div>
                </div>

                {activeConversation.notes && (
                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100">
                    <div className="text-[10px] text-[#1769D2] font-bold uppercase">Clinical / Front Desk Remarks</div>
                    <div className="text-slate-700 mt-0.5 text-[11px] leading-relaxed">
                      {activeConversation.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions connected to real CRM workflows! */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleChatBookAppt}
                className="w-full py-2 px-3 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <CalendarPlus size={13} />
                <span>Book Appointment</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleChatFollowup}
                  className="py-2 px-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Clock size={12} />
                  <span>+ Follow-Up</span>
                </button>
                <button
                  type="button"
                  onClick={handleChatOpenProfile}
                  className="py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye size={12} />
                  <span>View 360</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 3: AUTOMATION RULES (CONFIGURABLE HEALTHCARE TRIGGERS)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-3xl flex items-start gap-3">
            <Bot size={20} className="text-[#1769D2] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-extrabold text-xs text-[#102A50] uppercase tracking-wide">
                Configurable WhatsApp Automation Rules (Frontend Sandbox Mode)
              </h3>
              <p className="text-xs text-blue-900/80 mt-0.5 leading-relaxed">
                Configure patient journey automations triggered on enquiry capture, appointment booking, chair check-ins, and 6-month recalls. These rules will connect to Meta Webhook events in the backend integration phase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationRules.map(rule => (
              <div
                key={rule.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  rule.active
                    ? 'bg-white border-slate-200/90 shadow-xs'
                    : 'bg-slate-50/70 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                      {rule.id}
                    </span>

                    {/* Switch Toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleRule(rule.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black transition-colors cursor-pointer ${
                        rule.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {rule.active ? '● Active' : '○ Disabled'}
                    </button>
                  </div>

                  <h4 className="font-extrabold text-sm text-[#102A50]">{rule.name}</h4>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Trigger Event</span>
                      <span className="font-semibold text-slate-800 mt-0.5 block">{rule.trigger}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-[#F8FAFC] rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Delay</span>
                        <span className="font-bold text-[#1769D2]">{rule.delay}</span>
                      </div>
                      <div className="p-2 bg-[#F8FAFC] rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Branch Scope</span>
                        <span className="font-bold text-slate-700">{rule.branch === 'ALL' ? 'All 6 Branches' : rule.branch}</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-[#EEF5FF] rounded-xl border border-blue-100">
                      <span className="text-[10px] text-[#1769D2] font-bold uppercase block">Selected Template</span>
                      <span className="font-semibold text-slate-800 text-[11px] mt-0.5 block">{rule.template}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 font-bold text-slate-600 text-[11px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rule.requireApproval}
                      onChange={() => {
                        setAutomationRules(prev => prev.map(r => r.id === rule.id ? { ...r, requireApproval: !r.requireApproval } : r));
                        showToast(`Approval requirement updated for ${rule.id}`);
                      }}
                      className="rounded text-[#1769D2]"
                    />
                    <span>Require manual staff approval</span>
                  </label>

                  <span className="text-[10px] text-slate-400 font-mono">Auto-Dispatch</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 4: MESSAGE TEMPLATES (EDITABLE TEMPLATE MANAGEMENT)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <div>
              <h3 className="font-extrabold text-base text-[#102A50]">
                HSM Message Templates Management ({templatesList.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Editable healthcare templates with dynamic placeholders for leads, appointments, recalls, and festive greetings
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTemplate(true)}
              className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>+ Create New Template</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {[
              'ALL',
              'Lead Messages',
              'Appointment Messages',
              'Patient Follow-ups',
              'Treatment Reminders',
              'Offers & Promotions',
              'Birthday & Festival Greetings'
            ].map(cat => (
              <button
                key={cat}
                onClick={() => setTemplateFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  templateFilterCategory === cat
                    ? 'bg-[#1769D2] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Create Modal */}
          {isCreatingTemplate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-[#102A50]">Create WhatsApp HSM Template</h3>
                  <button onClick={() => setIsCreatingTemplate(false)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateNewTemplate} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Template Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Festival Smile Whitening Discount"
                      value={newTemplateForm.name}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })}
                      className="w-full font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={newTemplateForm.category}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, category: e.target.value })}
                      className="w-full font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
                    >
                      <option>Lead Messages</option>
                      <option>Appointment Messages</option>
                      <option>Patient Follow-ups</option>
                      <option>Treatment Reminders</option>
                      <option>Offers & Promotions</option>
                      <option>Birthday & Festival Greetings</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Template Message Body *</label>
                    <textarea
                      rows={4}
                      placeholder="Dear {{patient_name}}, Greetings from INDUS Dental {{branch_name}}..."
                      value={newTemplateForm.text}
                      onChange={(e) => setNewTemplateForm({ ...newTemplateForm, text: e.target.value })}
                      className="w-full font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-slate-800 outline-none resize-none leading-relaxed"
                      required
                    />
                    <span className="text-[10px] text-slate-400">
                      Use placeholders: {'{{patient_name}}'}, {'{{doctor_name}}'}, {'{{appointment_date}}'}, {'{{appointment_time}}'}, {'{{treatment}}'}.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingTemplate(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                    >
                      Save Template
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {editingTemplate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#102A50]">Edit Template: {editingTemplate.id}</h3>
                    <p className="text-xs text-slate-500">{editingTemplate.name}</p>
                  </div>
                  <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-slate-600">
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Template Name</label>
                    <input
                      type="text"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      className="w-full font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Message Body</label>
                    <textarea
                      rows={5}
                      value={editingTemplate.text}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, text: e.target.value })}
                      className="w-full font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-slate-800 outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-900 font-medium">
                    Approval Status: <b>{editingTemplate.metaStatus || 'Approved (Sandbox Demo)'}</b>. Editing modifies the template instantly in the local CRM cache.
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingTemplate(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEditedTemplate}
                      className="flex-1 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templatesList
              .filter(t => templateFilterCategory === 'ALL' || t.category === templateFilterCategory || (t.category?.includes(templateFilterCategory)))
              .map(tpl => (
                <div key={tpl.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#1769D2]">
                        {tpl.id} · {tpl.category}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {tpl.metaStatus || 'Approved (Demo)'}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#102A50]">{tpl.name}</h4>

                    <div className="mt-3 p-3 rounded-2xl bg-[#F8FAFC] border border-slate-100 text-xs text-slate-700 font-medium leading-relaxed">
                      {tpl.text}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">
                      Updated: {tpl.lastEdited || 'Today'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingTemplate(tpl)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#1769D2] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Template"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          TAB 5: API CONFIGURATION (HONEST SANDBOX STATUS & FUTURE STEPS)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'api_config' && (
        <div className="space-y-6 max-w-4xl">
          {/* Status Banner */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <ShieldAlert size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#102A50]">
                    Official Meta WhatsApp Cloud API Status
                  </h3>
                  <p className="text-xs text-slate-500">Frontend Simulation & Sandbox Mode Active</p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Status: Not Connected (Sandbox)</span>
              </span>
            </div>

            {/* Config Field Placeholders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  WhatsApp Business Account (WABA) ID
                </div>
                <div className="font-mono text-xs font-bold text-slate-700 mt-1">
                  WABA-SANDBOX-109284920491029
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Placeholder ID</span>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  Phone Number ID
                </div>
                <div className="font-mono text-xs font-bold text-slate-700 mt-1">
                  PHONE-SANDBOX-104928109348102
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Placeholder ID</span>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  Webhook Status
                </div>
                <div className="font-bold text-rose-700 text-xs mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span>Not Configured</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Requires live HTTPS endpoint in backend</span>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  HSM Template Synchronisation
                </div>
                <div className="font-bold text-blue-700 text-xs mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Local CRM Cache (Sandbox Active)</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">10 Templates loaded locally</span>
              </div>
            </div>
          </div>

          {/* Future Integration Setup Instructions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider flex items-center gap-2">
              <Info size={16} className="text-[#1769D2]" />
              <span>Production Setup Instructions (Meta Cloud API)</span>
            </h3>

            <div className="space-y-3 text-xs">
              {[
                {
                  step: 'Step 1',
                  title: 'Create Meta for Developers Account & Business App',
                  desc: 'Register at developers.facebook.com, create a Business type app, and add the WhatsApp product.'
                },
                {
                  step: 'Step 2',
                  title: 'Generate Permanent System User Token',
                  desc: 'In Meta Business Manager, create a System User with whatsapp_business_messaging and whatsapp_business_management permissions.'
                },
                {
                  step: 'Step 3',
                  title: 'Configure Webhook URL & Verify Token',
                  desc: 'Point the webhook to https://api.indusdental.in/v1/webhooks/whatsapp and subscribe to messages, message_status, and template_status.'
                },
                {
                  step: 'Step 4',
                  title: 'Verify Clinic Phone Number & Submit Healthcare Templates',
                  desc: 'Register the official INDUS Dental 10-digit clinic number via SMS OTP and submit healthcare templates for Meta review.'
                },
                {
                  step: 'Step 5',
                  title: 'Connect Backend Express / Node Server',
                  desc: 'Provide credentials securely via server environment variables (process.env.META_WABA_TOKEN) — never in frontend client code.'
                }
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-start gap-3">
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-[#1769D2] text-white shrink-0 mt-0.5">
                    {s.step}
                  </span>
                  <div>
                    <h5 className="font-extrabold text-[#102A50]">{s.title}</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
