import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Shield,
  MessageSquare,
  Key,
  CheckCircle2,
  Clock,
  Save,
  Lock
} from 'lucide-react';

export default function SettingsModule() {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('general');

  const auditLogs = [
    { time: '10:50 AM', user: 'Sneha R (Reception)', action: 'Registered Patient IND-0292 (Mr Gokul)', module: 'Patient Registration' },
    { time: '11:05 AM', user: 'Dr. Priya Sharma', action: 'Created Root Canal Treatment Plan for Tooth 46', module: 'Consultation' },
    { time: '11:15 AM', user: 'Dr. Priya Sharma', action: 'Signed & Finalized Treatment Note TX-9041', module: 'Draw & Explain' },
    { time: '11:20 AM', user: 'Praveen M (Billing)', action: 'Issued Tax Invoice IND-INV-082 (₹6,500)', module: 'Billing' },
    { time: '09:30 AM', user: 'Deepak Raj (Reception)', action: 'Scheduled Follow-up Reminders for Today', module: 'Follow-ups' },
    { time: '09:00 AM', user: 'Karthik S (Manager)', action: 'Stock update: 10 packs ProTaper Gold Rotary Files', module: 'Inventory' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              System Settings & Clinic Configurations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              Super Admin Config
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure hospital branding, clinic operations, WhatsApp credentials, and security audit logs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
          {['general', 'audit_logs'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === tab ? 'bg-white text-[#102A50] shadow-xs' : 'text-slate-600'
              }`}
            >
              {tab === 'general' ? 'Clinic Profile' : 'HIPAA / DPDP Audit Logs'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'general' ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs max-w-2xl space-y-4">
          <h2 className="text-sm font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
            <Building2 size={16} className="text-[#1769D2]" />
            <span>INDUS Dental Clinic Profile</span>
          </h2>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Name</label>
              <input
                type="text"
                defaultValue="INDUS Dental"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN / Registration #</label>
              <input
                type="text"
                defaultValue="33AAACI9912K1Z9 / TN-DENT-MED-4402"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Address</label>
            <input
              type="text"
              defaultValue="142, D.B. Road, R.S. Puram, Coimbatore, Tamil Nadu - 641002"
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Clinic Phone</label>
              <input
                type="text"
                defaultValue="+91 422 254 8890"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Email</label>
              <input
                type="email"
                defaultValue="contact@indusdental.in"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => showToast('Clinic configuration settings updated successfully!')}
              className="px-5 py-2.5 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>Save Configurations</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="text-xs font-bold text-[#102A50] uppercase tracking-wider flex items-center gap-2">
              <Lock size={15} className="text-[#1769D2]" />
              <span>Healthcare Activity & Security Audit Logs (DPDP Act Compliant)</span>
            </div>
            <span className="text-[10px] text-slate-400">Timestamped to Indian Standard Time (IST)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 px-5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-slate-400 w-16">{log.time}</span>
                  <div>
                    <span className="font-bold text-[#102A50]">{log.user}: </span>
                    <span className="text-slate-700">{log.action}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {log.module}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
