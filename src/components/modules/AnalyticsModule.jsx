import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Download,
  Calendar,
  CreditCard,
  Users,
  DollarSign,
  Activity,
  CheckCircle2,
  PieChart,
  Smartphone,
  Banknote,
  Receipt,
  Sparkles,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';

// ── Format Currency helper (Indian Rupee format) ─────────────────────────────
const formatINR = (val) => {
  const num = Number(val) || 0;
  return '₹' + num.toLocaleString('en-IN');
};

const formatINRCompact = (val) => {
  const num = Number(val) || 0;
  if (num >= 10000000) return '₹' + (num / 10000000).toFixed(2) + ' Cr';
  if (num >= 100000) return '₹' + (num / 100000).toFixed(2) + 'L';
  if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
  return '₹' + num.toLocaleString('en-IN');
};

// ── Normalize Payment Method to exactly the 3 supported channels ───────────────
// Explicitly ignores any EMI, Bajaj Finserv, or loan-based methods
const normalizePaymentMethod = (method) => {
  if (!method) return null;
  const m = method.toLowerCase();
  if (m.includes('emi') || m.includes('bajaj') || m.includes('finserv') || m.includes('finance') || m.includes('loan')) {
    return null;
  }
  if (m.includes('upi') || m.includes('gpay') || m.includes('phonepe') || m.includes('paytm') || m.includes('qr') || m.includes('bhim')) {
    return 'UPI (GPay / PhonePe / QR)';
  }
  if (m.includes('cash')) {
    return 'Cash';
  }
  if (m.includes('card') || m.includes('credit') || m.includes('debit') || m.includes('pos') || m.includes('bank') || m.includes('neft') || m.includes('imps') || m.includes('cheque')) {
    return 'Credit & Debit Cards';
  }
  return null;
};

// ── Match treatment name to clinical catalog or standard categories ───────────
const matchTreatmentCategory = (description, catalog) => {
  if (!description) return 'General Dental Care';
  const descLower = description.toLowerCase();

  // Match against Settings catalog first
  if (Array.isArray(catalog)) {
    for (const t of catalog) {
      if (!t.name) continue;
      const tNameLower = t.name.toLowerCase();
      if (descLower === tNameLower || descLower.includes(tNameLower) || tNameLower.includes(descLower)) {
        return t.name;
      }
    }
  }

  // Fallback category matching
  if (descLower.includes('implant') || descLower.includes('straumann') || descLower.includes('fixture')) {
    return 'Dental Implants';
  }
  if (descLower.includes('aligner') || descLower.includes('invisalign') || descLower.includes('orthodont')) {
    return 'Clear Aligners';
  }
  if (descLower.includes('root canal') || descLower.includes('rct') || descLower.includes('obturation') || descLower.includes('canal')) {
    return 'Root Canal Treatment';
  }
  if (descLower.includes('crown') || descLower.includes('bridge') || descLower.includes('zirconia') || descLower.includes('ceramic') || descLower.includes('post') || descLower.includes('core')) {
    return 'Zirconia Crown / Bridge';
  }
  if (descLower.includes('whiten') || descLower.includes('bleach') || descLower.includes('cosmetic')) {
    return 'Teeth Whitening';
  }
  if (descLower.includes('scaling') || descLower.includes('polishing') || descLower.includes('periodont') || descLower.includes('curettage') || descLower.includes('flap') || descLower.includes('graft')) {
    return 'Periodontics & Scaling';
  }
  if (descLower.includes('opd') || descLower.includes('consultation') || descLower.includes('x-ray') || descLower.includes('rvg') || descLower.includes('diagno')) {
    return 'Consultation & Diagnostics';
  }
  if (descLower.includes('pedo') || descLower.includes('child') || descLower.includes('pediatric')) {
    return 'Pediatric Dental Care';
  }

  return description;
};

export default function AnalyticsModule() {
  const {
    showToast,
    invoices,
    filteredInvoices,
    treatments,
    enabledTreatments,
    leads,
    patients,
    appointments,
    selectedBranch
  } = useApp();

  // ── Tab Navigation: 3 tabs only ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');

  // ── Active KPI card for Executive Overview ──────────────────────────────
  const [activeKpiCard, setActiveKpiCard] = useState(null);

  // ── Date Filter State ────────────────────────────────────────────────────
  const [dateQuick, setDateQuick] = useState('ALL');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // ── Hover tooltip states for charts ───────────────────────────────────────
  const [hoveredTreatment, setHoveredTreatment] = useState(null);
  const [hoveredPayment, setHoveredPayment] = useState(null);

  // ── Clinical Catalog from Settings ─────────────────────────────────────────
  const catalog = useMemo(() => {
    return enabledTreatments && enabledTreatments.length > 0
      ? enabledTreatments
      : (treatments || []).filter(t => t.enabled !== false);
  }, [enabledTreatments, treatments]);

  // ── Base Invoices List (branch filtered if applicable) ─────────────────────
  const baseInvoices = useMemo(() => {
    return filteredInvoices && filteredInvoices.length > 0 ? filteredInvoices : (invoices || []);
  }, [filteredInvoices, invoices]);

  // ── Date-Filtered Invoices ────────────────────────────────────────────────
  const dateFilteredInvoices = useMemo(() => {
    return baseInvoices.filter(inv => {
      if (!inv.date) return false;
      const invDate = new Date(inv.date);
      const now = new Date(); // or reference date 2026-11-20

      if (dateQuick === 'ALL') return true;
      if (dateQuick === 'TODAY') {
        return invDate.toDateString() === now.toDateString();
      }
      if (dateQuick === 'THIS_MONTH') {
        return invDate.getFullYear() === now.getFullYear() && invDate.getMonth() === now.getMonth();
      }
      if (dateQuick === 'LAST_30') {
        const diffDays = (now.getTime() - invDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 30;
      }
      if (dateQuick === 'CUSTOM') {
        if (customFrom && new Date(inv.date) < new Date(customFrom)) return false;
        if (customTo && new Date(inv.date) > new Date(customTo + 'T23:59:59')) return false;
        return true;
      }
      return true;
    });
  }, [baseInvoices, dateQuick, customFrom, customTo]);

  // ── 1. Revenue by Payment Mode (Strictly 3 methods: UPI, Cash, Cards) ─────
  const paymentStats = useMemo(() => {
    const buckets = {
      'UPI (GPay / PhonePe / QR)': {
        id: 'upi',
        mode: 'UPI (GPay / PhonePe / QR)',
        shortName: 'UPI (QR / GPay / PhonePe)',
        amount: 0,
        count: 0,
        color: '#1769D2',
        lightBg: '#EBF4FF',
        borderCol: '#BFDBFE',
        icon: Smartphone
      },
      'Cash': {
        id: 'cash',
        mode: 'Cash',
        shortName: 'Cash Collections',
        amount: 0,
        count: 0,
        color: '#12B89A',
        lightBg: '#ECFDF5',
        borderCol: '#A7F3D0',
        icon: Banknote
      },
      'Credit & Debit Cards': {
        id: 'cards',
        mode: 'Credit & Debit Cards',
        shortName: 'Credit & Debit Cards (POS)',
        amount: 0,
        count: 0,
        color: '#7955D9',
        lightBg: '#F5F3FF',
        borderCol: '#DDD6FE',
        icon: CreditCard
      }
    };

    dateFilteredInvoices.forEach(inv => {
      const normalized = normalizePaymentMethod(inv.paymentMethod);
      if (normalized && buckets[normalized]) {
        // Collect actual paid amount (or grandTotal if paidAmount not set)
        const paid = Number(inv.paidAmount ?? inv.grandTotal ?? 0);
        buckets[normalized].amount += paid;
        buckets[normalized].count += 1;
      }
    });

    const totalCollected = Object.values(buckets).reduce((sum, b) => sum + b.amount, 0);
    const totalTransactions = Object.values(buckets).reduce((sum, b) => sum + b.count, 0);

    const list = Object.values(buckets).map(b => {
      const share = totalCollected > 0 ? Math.round((b.amount / totalCollected) * 100) : 0;
      return {
        ...b,
        share,
        shareDecimal: totalCollected > 0 ? (b.amount / totalCollected) : 0
      };
    });

    return {
      items: list,
      totalCollected,
      totalTransactions,
      hasData: totalCollected > 0
    };
  }, [dateFilteredInvoices]);

  // ── 2. Top Performing Dental Treatments (Revenue Share) ───────────────────
  const treatmentRevenueStats = useMemo(() => {
    const treatmentMap = {};

    dateFilteredInvoices.forEach(inv => {
      if (Array.isArray(inv.items) && inv.items.length > 0) {
        inv.items.forEach(item => {
          const cat = matchTreatmentCategory(item.description, catalog);
          const itemAmt = Number(item.amount ?? (item.qty * item.rate) ?? 0);
          if (!treatmentMap[cat]) {
            treatmentMap[cat] = { name: cat, revenue: 0, count: 0 };
          }
          treatmentMap[cat].revenue += itemAmt;
          treatmentMap[cat].count += Number(item.qty || 1);
        });
      } else {
        // Invoice without items breakdown: attribute to general or invoice doctor/reason
        const cat = 'General Dental Care';
        const paid = Number(inv.paidAmount ?? inv.grandTotal ?? 0);
        if (!treatmentMap[cat]) {
          treatmentMap[cat] = { name: cat, revenue: 0, count: 0 };
        }
        treatmentMap[cat].revenue += paid;
        treatmentMap[cat].count += 1;
      }
    });

    const totalRevenue = Object.values(treatmentMap).reduce((sum, t) => sum + t.revenue, 0);

    // Premium INDUS theme color palette
    const colors = [
      { bar: '#1769D2', bg: '#EBF4FF', border: '#BFDBFE' },
      { bar: '#12B89A', bg: '#ECFDF5', border: '#A7F3D0' },
      { bar: '#7955D9', bg: '#F5F3FF', border: '#DDD6FE' },
      { bar: '#F28B42', bg: '#FFF7ED', border: '#FED7AA' },
      { bar: '#0284C7', bg: '#F0F9FF', border: '#BAE6FD' },
      { bar: '#059669', bg: '#F0FDF4', border: '#BBF7D0' }
    ];

    const sorted = Object.values(treatmentMap)
      .sort((a, b) => b.revenue - a.revenue)
      .map((t, idx) => {
        const share = totalRevenue > 0 ? Math.round((t.revenue / totalRevenue) * 100) : 0;
        const colorSet = colors[idx % colors.length];
        return {
          ...t,
          rank: idx + 1,
          share,
          color: colorSet.bar,
          lightBg: colorSet.bg,
          borderColor: colorSet.border
        };
      });

    return {
      items: sorted,
      totalRevenue,
      hasData: sorted.length > 0 && totalRevenue > 0
    };
  }, [dateFilteredInvoices, catalog]);

  // ── 3. Lead Sources Performance (for Tab 3: Lead Sources ROI) ─────────────
  const leadSourceStats = useMemo(() => {
    const rawLeads = leads || [];
    const sourceBuckets = {};

    rawLeads.forEach(l => {
      const src = l.source || 'Walk-in';
      if (!sourceBuckets[src]) {
        sourceBuckets[src] = { source: src, total: 0, converted: 0, appointments: 0 };
      }
      sourceBuckets[src].total += 1;
      if (l.status === 'Converted' || l.stage === 'Converted') {
        sourceBuckets[src].converted += 1;
      }
      if (l.status === 'Appointment' || l.stage === 'Appointment') {
        sourceBuckets[src].appointments += 1;
      }
    });

    const totalLeadsCount = rawLeads.length;
    const sortedSources = Object.values(sourceBuckets).map(s => {
      const convRate = s.total > 0 ? Math.round((s.converted / s.total) * 100) : 0;
      const share = totalLeadsCount > 0 ? Math.round((s.total / totalLeadsCount) * 100) : 0;
      return { ...s, convRate, share };
    }).sort((a, b) => b.total - a.total);

    return {
      sources: sortedSources,
      totalLeads: totalLeadsCount,
      totalConverted: sortedSources.reduce((sum, s) => sum + s.converted, 0)
    };
  }, [leads]);

  // ── Export Handlers ───────────────────────────────────────────────────────
  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'INDUS DENTAL - EXECUTIVE PERFORMANCE REPORT\n';
    csvContent += `Generated: ${new Date().toLocaleDateString('en-IN')}\n\n`;

    csvContent += '1. MONTHLY REVENUE BY PAYMENT MODE\n';
    csvContent += 'Payment Mode,Transactions,Collections (INR),Share (%)\n';
    paymentStats.items.forEach(p => {
      csvContent += `"${p.mode}",${p.count},${p.amount},${p.share}%\n`;
    });
    csvContent += `Total Collections,,${paymentStats.totalCollected},100%\n\n`;

    csvContent += '2. TOP PERFORMING DENTAL TREATMENTS (REVENUE SHARE)\n';
    csvContent += 'Rank,Treatment Name,Procedures/Qty,Revenue (INR),Share (%)\n';
    treatmentRevenueStats.items.forEach(t => {
      csvContent += `${t.rank},"${t.name}",${t.count},${t.revenue},${t.share}%\n`;
    });
    csvContent += `Total Treatment Revenue,,,${treatmentRevenueStats.totalRevenue},100%\n\n`;

    csvContent += '3. REGISTERED BILLING TRANSACTIONS\n';
    csvContent += 'Invoice ID,Patient Name,Date,Payment Method,Paid Amount (INR),Grand Total (INR),Status\n';
    dateFilteredInvoices.forEach(inv => {
      csvContent += `"${inv.id}","${inv.patientName}","${inv.date}","${inv.paymentMethod}",${inv.paidAmount || 0},${inv.grandTotal || 0},"${inv.status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `INDUS_Dental_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics Report exported to CSV successfully!');
  };

  const exportPDF = () => {
    showToast('Preparing printable executive summary...');
    window.print();
  };

  // ── Helper: SVG Doughnut Arc Calculations ─────────────────────────────────
  const doughnutRadius = 42;
  const doughnutCircumference = 2 * Math.PI * doughnutRadius; // ~263.89

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* ── 1. Header with Title & Action Buttons ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0C294F] via-[#0E3A75] to-[#1670E8] p-5 rounded-3xl shadow-lg shadow-blue-900/25">
        <div className="flex items-center gap-3.5">
          <div className="rounded-2xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0 backdrop-blur-sm" style={{width:'52px',height:'52px'}}>
            <TrendingUp size={28} className="stroke-[2] text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Analytics & Executive Performance Reports
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                {selectedBranch ? (selectedBranch.name || 'Single Clinic EMR') : 'Single Clinic EMR'}
              </span>
            </div>
            <p className="text-xs text-blue-100/75 mt-0.5">
              Real clinic revenue, clinical treatment share, payment mode collections, and lead ROI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
            title="Download CSV Spreadsheet"
          >
            <FileSpreadsheet size={14} className="text-emerald-300" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportPDF}
            className="px-4 py-2 bg-white hover:bg-blue-50 text-[#1253A4] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            title="Print or Save as PDF"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* ── 2. Tab Navigation (Exactly 3 Tabs) ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        {[
          { id: 'overview', label: '1. Executive Overview', icon: TrendingUp },
          { id: 'revenue', label: '2. Revenue & Collections', icon: DollarSign },
          { id: 'leads', label: '3. Lead Sources ROI', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-[#1769D2] text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. Quick Date Range Filter Bar ──────────────────────────────────── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#102A50] uppercase tracking-wider">
            <Filter size={14} className="text-[#1769D2]" />
            <span>Filter Period:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: 'All Dates' },
              { id: 'THIS_MONTH', label: 'This Month' },
              { id: 'LAST_30', label: 'Last 30 Days' },
              { id: 'TODAY', label: 'Today' },
              { id: 'CUSTOM', label: 'Custom Range' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDateQuick(d.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateQuick === d.id
                    ? 'bg-[#1769D2] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {dateQuick === 'CUSTOM' && (
          <div className="flex items-center gap-2 text-xs">
            <input
              type="date"
              value={customFrom}
              onChange={e => setCustomFrom(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-slate-50 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-slate-400 font-bold">to</span>
            <input
              type="date"
              value={customTo}
              onChange={e => setCustomTo(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 bg-slate-50 text-xs outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="text-[11px] font-bold text-slate-500">
          <span>Records analyzed: </span>
          <span className="text-[#102A50] font-black">{dateFilteredInvoices.length} invoices</span>
        </div>
      </div>

      {/* ── 4. TAB 1: EXECUTIVE OVERVIEW ────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: 'collections',
                label: 'Total Collections',
                value: formatINR(paymentStats.totalCollected),
                sub: <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5"><CheckCircle2 size={11} /> Registered billing data</span>,
                icon: DollarSign,
                iconBg: 'bg-[#EBF4FF] text-[#1769D2]',
                iconBgSel: 'bg-white/20 text-white border border-white/25',
              },
              {
                id: 'avg_invoice',
                label: 'Average Invoice',
                value: dateFilteredInvoices.length > 0
                  ? formatINR(Math.round(paymentStats.totalCollected / dateFilteredInvoices.length))
                  : '₹0',
                sub: <span className="text-[10px] font-bold text-slate-500">Across {dateFilteredInvoices.length} invoices</span>,
                icon: Receipt,
                iconBg: 'bg-[#ECFDF5] text-[#12B89A]',
                iconBgSel: 'bg-white/20 text-white border border-white/25',
              },
              {
                id: 'top_treatment',
                label: 'Top Treatment',
                value: treatmentRevenueStats.items[0]?.name || 'No records',
                valueClass: 'text-sm sm:text-base',
                sub: <span className="text-[10px] font-bold text-[#7955D9]">{treatmentRevenueStats.items[0] ? `${treatmentRevenueStats.items[0].share}% Revenue Share` : 'No data'}</span>,
                icon: Activity,
                iconBg: 'bg-[#F5F3FF] text-[#7955D9]',
                iconBgSel: 'bg-white/20 text-white border border-white/25',
              },
              {
                id: 'top_payment',
                label: 'Top Payment Mode',
                value: paymentStats.items.reduce((max, cur) => cur.amount > max.amount ? cur : max, paymentStats.items[0] || {})?.shortName || 'UPI',
                valueClass: 'text-sm sm:text-base',
                sub: <span className="text-[10px] font-bold text-emerald-600">{(paymentStats.items.reduce((max, cur) => cur.amount > max.amount ? cur : max, paymentStats.items[0] || {})?.share || 0)}% Collections</span>,
                icon: Smartphone,
                iconBg: 'bg-[#FFF7ED] text-[#F28B42]',
                iconBgSel: 'bg-white/20 text-white border border-white/25',
              },
            ].map((card) => {
              const isSelected = activeKpiCard === card.id;
              const Icon = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => setActiveKpiCard(isSelected ? null : card.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#0C294F] via-[#0E3A75] to-[#1253A4] border-transparent shadow-xl shadow-blue-900/25 ring-2 ring-blue-300'
                      : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isSelected ? card.iconBgSel : card.iconBg}`}>
                    <Icon size={20} className="stroke-[1.8]" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[11px] font-bold uppercase tracking-wider block ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>{card.label}</span>
                    <span className={`font-black truncate block ${card.valueClass || 'text-lg sm:text-xl'} ${isSelected ? 'text-white' : 'text-[#102A50]'}`}>{card.value}</span>
                    <span className={isSelected ? '[&>*]:!text-blue-200 [&>span]:!text-blue-200' : ''}>{card.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Two Redesigned Visualizations Side-by-Side ───────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">

            {/* ── Visualization 1: Top Performing Dental Treatments ─────────── */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#1769D2] flex items-center justify-center">
                      <Activity size={16} />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider">
                      Top Performing Dental Treatments
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1769D2]">
                    Revenue Share
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Clinical procedures ranked by total billed value from registered patient invoices
                </p>
              </div>

              {/* Treatment Visualization Body */}
              <div className="flex-1 flex flex-col justify-center">
                {!treatmentRevenueStats.hasData ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <Activity size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-600">No treatment billing records found</p>
                    <p className="text-[11px] text-slate-400">Add patient invoices in the Billing module or expand date filter</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 pt-2">
                    {treatmentRevenueStats.items.map((t) => {
                      const isHovered = hoveredTreatment === t.name;
                      return (
                        <div
                          key={t.name}
                          onMouseEnter={() => setHoveredTreatment(t.name)}
                          onMouseLeave={() => setHoveredTreatment(null)}
                          className={`p-2.5 rounded-2xl transition-all duration-200 ${
                            isHovered ? 'bg-slate-50 ring-1 ring-blue-100 shadow-xs' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 text-white shadow-2xs"
                                style={{ backgroundColor: t.color }}
                              >
                                {t.rank}
                              </span>
                              <span className="font-bold text-slate-800 truncate" title={t.name}>
                                {t.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-extrabold text-[#102A50]">
                                {formatINR(t.revenue)}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded-md text-[11px] font-black"
                                style={{ backgroundColor: t.lightBg, color: t.color }}
                              >
                                {t.share}%
                              </span>
                            </div>
                          </div>

                          {/* Progress Track */}
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 relative">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: `${Math.max(t.share, 4)}%`,
                                backgroundColor: t.color
                              }}
                            />
                          </div>

                          {/* Hover Details */}
                          {isHovered && (
                            <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-medium px-1">
                              <span>{t.count} procedure(s) billed</span>
                              <span>Contributes {t.share}% of total treatment revenue</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Card Footer Summary */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Total Treatment Revenue</span>
                <span className="text-base font-extrabold text-[#102A50]">
                  {formatINR(treatmentRevenueStats.totalRevenue)}
                </span>
              </div>
            </div>

            {/* ── Visualization 2: Monthly Revenue by Payment Mode (Doughnut) ─ */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#7955D9] flex items-center justify-center">
                      <PieChart size={16} />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider">
                      Revenue by Payment Mode
                    </h3>
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    3 Payment Methods
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Collections breakdown across UPI, Cash, and Cards (no EMI / financing)
                </p>
              </div>

              {/* Payment Mode Visualization Body */}
              <div className="flex-1 flex flex-col justify-center">
                {!paymentStats.hasData ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                      <CreditCard size={24} />
                    </div>
                    <p className="text-xs font-bold text-slate-600">No payment collections found</p>
                    <p className="text-[11px] text-slate-400">Record a payment in Billing to populate this breakdown</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                    {/* SVG Doughnut Chart */}
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background track circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r={doughnutRadius}
                          fill="none"
                          stroke="#F1F5F9"
                          strokeWidth="11"
                        />
                        {/* Dynamic Slices for the 3 payment methods */}
                        {(() => {
                          let runningOffset = 0;
                          return paymentStats.items.map((pm) => {
                            if (pm.amount === 0) return null;
                            const strokeDash = pm.shareDecimal * doughnutCircumference;
                            const dashOffset = -runningOffset;
                            runningOffset += strokeDash;
                            const isHovered = hoveredPayment === pm.id;

                            return (
                              <circle
                                key={pm.id}
                                cx="50"
                                cy="50"
                                r={doughnutRadius}
                                fill="none"
                                stroke={pm.color}
                                strokeWidth={isHovered ? 13 : 11}
                                strokeDasharray={`${strokeDash} ${doughnutCircumference - strokeDash}`}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setHoveredPayment(pm.id)}
                                onMouseLeave={() => setHoveredPayment(null)}
                              />
                            );
                          });
                        })()}
                      </svg>

                      {/* Center Total Display */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-2">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          {hoveredPayment
                            ? paymentStats.items.find(p => p.id === hoveredPayment)?.shortName
                            : 'Collections'}
                        </span>
                        <span className="text-base font-black text-[#102A50] leading-tight">
                          {hoveredPayment
                            ? formatINRCompact(paymentStats.items.find(p => p.id === hoveredPayment)?.amount)
                            : formatINRCompact(paymentStats.totalCollected)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {hoveredPayment
                            ? `${paymentStats.items.find(p => p.id === hoveredPayment)?.share}% Share`
                            : '100% Real'}
                        </span>
                      </div>
                    </div>

                    {/* Clean Legend for the 3 Methods */}
                    <div className="space-y-2.5 w-full sm:w-auto flex-1">
                      {paymentStats.items.map((pm) => {
                        const Icon = pm.icon;
                        const isHovered = hoveredPayment === pm.id;
                        return (
                          <div
                            key={pm.id}
                            onMouseEnter={() => setHoveredPayment(pm.id)}
                            onMouseLeave={() => setHoveredPayment(null)}
                            className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
                              isHovered
                                ? 'bg-slate-50 border-blue-200 shadow-xs'
                                : 'bg-white border-slate-100 hover:bg-slate-50/70'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: pm.lightBg, color: pm.color }}
                                >
                                  <Icon size={13} />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 block leading-tight">
                                    {pm.mode}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-medium">
                                    {pm.count} transaction(s)
                                  </span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs font-extrabold text-[#102A50] block">
                                  {formatINR(pm.amount)}
                                </span>
                                <span
                                  className="text-[10px] font-black px-1.5 py-0.2 rounded"
                                  style={{ backgroundColor: pm.lightBg, color: pm.color }}
                                >
                                  {pm.share}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Summary */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Total Monthly Collections</span>
                <span className="text-base font-extrabold text-[#102A50]">
                  {formatINR(paymentStats.totalCollected)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Recent Registered Invoices Quick Table ─────────────────────── */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#102A50] flex items-center gap-2">
                  <Receipt size={16} className="text-[#1769D2]" />
                  <span>Recent Registered Billing Records</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actual patient invoices recorded in clinic system
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Showing {Math.min(dateFilteredInvoices.length, 5)} of {dateFilteredInvoices.length}
              </span>
            </div>

            {dateFilteredInvoices.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-slate-400">
                No billing records found for the selected period.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Invoice</th>
                      <th className="py-2.5 px-3">Patient</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3 text-right">Paid Amount</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dateFilteredInvoices.slice(0, 5).map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-all">
                        <td className="py-2.5 px-3 font-bold text-[#1769D2]">{inv.id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{inv.patientName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{inv.date}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-[#102A50]">
                          {formatINR(inv.paidAmount ?? inv.grandTotal)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5. TAB 2: REVENUE & COLLECTIONS ─────────────────────────────────── */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Detailed Revenue Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed</span>
              <span className="text-xl font-black text-[#102A50] block mt-0.5">
                {formatINR(dateFilteredInvoices.reduce((sum, i) => sum + Number(i.grandTotal || 0), 0))}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">{dateFilteredInvoices.length} invoices generated</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Collected</span>
              <span className="text-xl font-black text-emerald-600 block mt-0.5">
                {formatINR(paymentStats.totalCollected)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">Through 3 core channels</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Balance Outstanding</span>
              <span className="text-xl font-black text-amber-600 block mt-0.5">
                {formatINR(dateFilteredInvoices.reduce((sum, i) => sum + Number(i.balance || 0), 0))}
              </span>
              <span className="text-[10px] text-amber-600 font-medium">Pending patient dues</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Collection Efficiency</span>
              <span className="text-xl font-black text-[#1769D2] block mt-0.5">
                {(() => {
                  const billed = dateFilteredInvoices.reduce((sum, i) => sum + Number(i.grandTotal || 0), 0);
                  return billed > 0 ? `${Math.round((paymentStats.totalCollected / billed) * 100)}%` : '100%';
                })()}
              </span>
              <span className="text-[10px] text-slate-500">Collected vs Billed</span>
            </div>
          </div>

          {/* 3 Supported Payment Channels Detailed Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                <CreditCard size={16} className="text-[#1769D2]" />
                <span>Authorized Clinical Payment Channels</span>
              </h3>
              <p className="text-xs text-slate-500">
                Collections recorded exclusively under UPI, Cash, and Credit & Debit Cards
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentStats.items.map(pm => {
                const Icon = pm.icon;
                return (
                  <div key={pm.id} className="p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: pm.lightBg, color: pm.color }}>
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ backgroundColor: pm.lightBg, color: pm.color }}>
                        {pm.share}% Share
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">{pm.mode}</h4>
                      <div className="text-lg font-black text-[#102A50] mt-0.5">
                        {formatINR(pm.amount)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Transactions:</span>
                      <span className="font-bold text-slate-800">{pm.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Full Invoices Ledger */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-[#102A50] flex items-center gap-2">
              <Receipt size={16} className="text-[#1769D2]" />
              <span>Full Billing & Collections Ledger</span>
            </h3>

            {dateFilteredInvoices.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-slate-400">
                No billing records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Invoice ID</th>
                      <th className="py-2.5 px-3">Patient</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Payment Method</th>
                      <th className="py-2.5 px-3 text-right">Grand Total</th>
                      <th className="py-2.5 px-3 text-right">Paid Amount</th>
                      <th className="py-2.5 px-3 text-right">Balance</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dateFilteredInvoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/70 transition-all">
                        <td className="py-2.5 px-3 font-bold text-[#1769D2]">{inv.id}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-800">{inv.patientName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{inv.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-700">{inv.paymentMethod}</td>
                        <td className="py-2.5 px-3 text-right text-slate-700">{formatINR(inv.grandTotal)}</td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-600">{formatINR(inv.paidAmount)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600">{formatINR(inv.balance)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 6. TAB 3: LEAD SOURCES ROI ──────────────────────────────────────── */}
      {activeTab === 'leads' && (
        <div className="space-y-6">
          {/* Lead Acquisition KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Enquiries</span>
              <span className="text-xl font-black text-[#102A50] block mt-0.5">{leadSourceStats.totalLeads}</span>
              <span className="text-[10px] text-slate-500">Across all acquisition channels</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Converted Patients</span>
              <span className="text-xl font-black text-emerald-600 block mt-0.5">{leadSourceStats.totalConverted}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Registered in clinic system</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
              <span className="text-xl font-black text-[#1769D2] block mt-0.5">
                {leadSourceStats.totalLeads > 0
                  ? `${Math.round((leadSourceStats.totalConverted / leadSourceStats.totalLeads) * 100)}%`
                  : '0%'}
              </span>
              <span className="text-[10px] text-blue-600 font-medium">Enquiry-to-patient conversion</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Channels</span>
              <span className="text-xl font-black text-[#7955D9] block mt-0.5">{leadSourceStats.sources.length}</span>
              <span className="text-[10px] text-slate-500">Marketing & referral channels</span>
            </div>
          </div>

          {/* Lead Sources Breakdown Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="font-extrabold text-sm text-[#102A50] uppercase tracking-wider flex items-center gap-2">
                <Users size={16} className="text-[#1769D2]" />
                <span>Acquisition Channel Performance & ROI</span>
              </h3>
              <p className="text-xs text-slate-500">
                Calculated directly from registered CRM lead enquiries and patient conversions
              </p>
            </div>

            <div className="space-y-3">
              {leadSourceStats.sources.map(src => (
                <div key={src.source} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-800">{src.source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-medium">{src.total} lead(s) ({src.share}%)</span>
                      <span className="font-extrabold text-emerald-600">{src.converted} converted</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-[#1769D2]">
                        {src.convRate}% Conv.
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1769D2] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(src.share, 5)}%` }}
                    />
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
