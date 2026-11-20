import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  MessageSquare,
  Send,
  Sparkles,
  Phone,
  User,
  Copy,
  CheckCircle2,
  ExternalLink,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function WhatsAppComposerModal() {
  const {
    whatsAppData,
    setWhatsAppData,
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    whatsappTemplates,
    logLeadCommunication,
    showToast
  } = useApp();

  const [selectedTemplateId, setSelectedTemplateId] = useState('TMP-01');
  const [composedMessage, setComposedMessage] = useState('');
  const [outcomeStatus, setOutcomeStatus] = useState('Sent - Awaiting Reply');
  const [communicationNotes, setCommunicationNotes] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);

  const renderTemplate = (tplId, data) => {
    if (!data) return;
    const tpl = (whatsappTemplates || []).find(t => t.id === tplId) || (whatsappTemplates || [])[0];
    if (!tpl) return;
    let text = tpl.text || '';
    text = text.replace(/\{name\}/g, data.recipientName || 'Valued Patient');
    text = text.replace(/\{treatment\}/g, data.treatment || 'Dental Consultation');
    text = text.replace(/\{clinic_name\}/g, 'INDUS Dental Coimbatore');
    text = text.replace(/\{doctor_name\}/g, data.doctorName || 'Dr. Priya Sharma');
    text = text.replace(/\{appointment_date\}/g, data.appointmentDate || 'Today');
    text = text.replace(/\{appointment_time\}/g, data.appointmentTime || '11:00 AM');
    setComposedMessage(text);
  };

  useEffect(() => {
    if (isWhatsAppModalOpen && whatsAppData && whatsappTemplates?.length > 0) {
      const initialTplId = whatsAppData.defaultTemplateId || 'TMP-01';
      setSelectedTemplateId(initialTplId);
      renderTemplate(initialTplId, whatsAppData);
      setHasOpenedWhatsApp(false);
      setCommunicationNotes('');
    }
  }, [whatsAppData, isWhatsAppModalOpen, whatsappTemplates]);

  const handleTemplateChange = (newTplId) => {
    setSelectedTemplateId(newTplId);
    renderTemplate(newTplId, whatsAppData);
  };

  const cleanPhone = (whatsAppData?.phone || '').replace(/\D/g, '');

  const handleOpenWhatsAppChat = () => {
    if (!whatsAppData) return;
    const url = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(composedMessage)}`;
    window.open(url, '_blank');
    setHasOpenedWhatsApp(true);
    showToast('WhatsApp Chat opened with prefilled message!');
  };

  const handleRecordCommunication = (e) => {
    e.preventDefault();
    if (whatsAppData?.leadId) {
      const selectedTpl = (whatsappTemplates || []).find(t => t.id === selectedTemplateId);
      logLeadCommunication(whatsAppData.leadId, {
        channel: 'WhatsApp',
        outcome: outcomeStatus,
        notes: communicationNotes || 'WhatsApp click-to-chat message initiated.',
        templateName: selectedTpl ? selectedTpl.name : 'Custom Message',
        messageContent: composedMessage,
        nextActionDate: nextActionDate || null
      });
    } else {
      showToast('WhatsApp interaction recorded successfully!');
    }
    setIsWhatsAppModalOpen(false);
  };

  if (!isWhatsAppModalOpen || !whatsAppData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#12B89A] to-[#16A779] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold">WhatsApp Clinical & CRM Composer</h2>
              <p className="text-xs text-emerald-100">
                To: <span className="font-extrabold text-white">{whatsAppData.recipientName}</span> (+91 {cleanPhone})
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-thin">
          {/* Template Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Dental Message Template (10 Standard CRM Templates)
            </label>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer focus:border-[#12B89A]"
            >
              {whatsappTemplates.map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.id} • {tpl.name} ({tpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* Contextual Recipient Pill */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <User size={14} className="text-emerald-700" />
              <span className="font-bold text-emerald-950">{whatsAppData.recipientName}</span>
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-slate-600">{whatsAppData.treatment || 'Consultation'}</span>
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Click-to-Chat Ready
            </span>
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Personalized Message Preview & Editor</label>
              <span className="text-[10px] text-slate-400 font-medium">Variables prefilled</span>
            </div>
            <textarea
              rows={5}
              value={composedMessage}
              onChange={(e) => setComposedMessage(e.target.value)}
              className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3.5 text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-[#12B89A] focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Primary Action Button */}
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenWhatsAppChat}
              className="flex-1 py-2.5 rounded-xl bg-[#16A779] hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Send size={15} />
              <span>Open WhatsApp & Send Prefilled Message</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {/* Prototype Integrity Notice */}
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 px-1 italic">
            <ShieldAlert size={13} className="text-amber-500 shrink-0" />
            <span>Opens official WhatsApp Web / app. Direct automated delivery requires Meta Cloud API credentials.</span>
          </div>

          {/* Record Outcome Section */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="text-xs font-bold text-[#102A50]">
              Record Communication Outcome into CRM Timeline
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Interaction Result</label>
                <select
                  value={outcomeStatus}
                  onChange={(e) => setOutcomeStatus(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-[#102A50] outline-none"
                >
                  <option value="Sent - Awaiting Reply">Sent - Awaiting Reply</option>
                  <option value="Patient Replied & Interested">Patient Replied & Interested</option>
                  <option value="Appointment Confirmed via Chat">Appointment Confirmed via Chat</option>
                  <option value="Pricing / Quote Discussed">Pricing / Quote Discussed</option>
                  <option value="Callback Requested">Callback Requested</option>
                  <option value="Not Interested">Not Interested</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Next Follow-up Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={nextActionDate}
                  onChange={(e) => setNextActionDate(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-slate-800 outline-none"
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Add communication notes (e.g. Sent Straumann pricing brochure, patient reviewing with family)..."
              value={communicationNotes}
              onChange={(e) => setCommunicationNotes(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setIsWhatsAppModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRecordCommunication}
            className="px-5 py-2 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 size={14} />
            <span>Save & Log to Timeline</span>
          </button>
        </div>
      </div>
    </div>
  );
}
