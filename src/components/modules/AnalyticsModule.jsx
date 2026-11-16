import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Users,
  DollarSign,
  Activity,
  CheckCircle2
} from 'lucide-react';

export default function AnalyticsModule() {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  const exportReport = (format) => {
    showToast(`INDUS Dental Analytics Report exported as ${format}!`);
  };

  const paymentModes = [
    { mode: 'UPI (GPay / PhonePe / QR)', share: '45%', amount: '₹38.4L', color: '#1769D2', barWidth: '45%' },
    { mode: 'Credit & Debit Cards (POS)', share: '28%', amount: '₹23.9L', color: '#12B89A', barWidth: '28%' },
    { mode: 'Dental EMI / Bajaj Finserv', share: '15%', amount: '₹12.8L', color: '#7955D9', barWidth: '15%' },
    { mode: 'Cash Collections', share: '12%', amount: '₹10.2L', color: '#F28B42', barWidth: '12%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Analytics & Executive Performance Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#1769D2]">
              Single Clinic EMR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Clinic revenue, doctor productivity, lead acquisition ROI, and patient retention metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportReport('CSV / Excel')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportReport('PDF Report')}
            className="px-4 py-2 bg-[#1769D2] hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {[
          { id: 'overview', label: '1. Executive Overview' },
          { id: 'revenue', label: '2. Revenue & Collections' },
          { id: 'leads', label: '3. Lead Sources ROI' },
          { id: 'doctors', label: '4. Doctor Productivity' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#1769D2] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Analytics Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Treatment Popularity Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-[#1769D2]" />
            <span>Top Performing Dental Treatments (Revenue Share)</span>
          </h3>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Dental Implants (Single & Full Arch)</span>
                <span className="text-[#1769D2]">38% (₹32.4L)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1769D2] rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Root Canal & Ceramic Crowns</span>
                <span className="text-[#12B89A]">27% (₹23.0L)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#12B89A] rounded-full" style={{ width: '27%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Clear Aligners & Orthodontics</span>
                <span className="text-[#7955D9]">20% (₹17.1L)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#7955D9] rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">General OPD, Scaling & Fillings</span>
                <span className="text-amber-500">15% (₹12.8L)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modes & Collections Breakdown (Replaces 6-Branch Breakdown) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider flex items-center gap-2">
            <CreditCard size={16} className="text-[#1769D2]" />
            <span>Monthly Revenue by Payment Mode</span>
          </h3>

          <div className="space-y-3 pt-2">
            {paymentModes.map((pm, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-700">{pm.mode}</span>
                  <span className="text-slate-900 font-extrabold">{pm.share} <span className="text-slate-500 font-normal">({pm.amount})</span></span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: pm.barWidth, backgroundColor: pm.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Total Monthly Collections</span>
            <span className="text-base font-extrabold text-[#102A50]">₹85.3 Lakhs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
