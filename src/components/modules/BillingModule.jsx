import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  Printer,
  Download,
  ChevronDown,
  X,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tag,
  Filter,
  Trash2,
  Pencil,
  PlusCircle,
  MinusCircle,
  ShieldAlert
} from 'lucide-react';
import { exportToCSV, exportToExcel, exportToPDF } from '../../utils/exportUtils';
import { computeQuickDateRange, isDateWithinRange } from '../../utils/dateFilterUtils';

// ─── Branch Details ────────────────────────────────────────────────────────────
const BRANCH_DETAILS = {
  RS_PURAM:    { name: 'R.S. Puram (Flagship)', address: '142 D.B. Road, R.S. Puram, Coimbatore – 641002', phone: '+91 98430 12845', email: 'rspuram@indusdental.com' },
  SINGANALLUR: { name: 'Singanallur Branch',    address: '45 Trichy Road, Singanallur, Coimbatore – 641005', phone: '+91 94430 56789', email: 'singanallur@indusdental.com' },
  PEELAMEDU:   { name: 'Peelamedu Branch',      address: '78 Avinashi Road, Peelamedu, Coimbatore – 641004', phone: '+91 97890 12345', email: 'peelamedu@indusdental.com' },
  GANDHIPURAM: { name: 'Gandhipuram Branch',    address: '23 Cross Cut Road, Gandhipuram, Coimbatore – 641012', phone: '+91 90922 34567', email: 'gandhipuram@indusdental.com' },
  UKKADAM:     { name: 'Ukkadam Branch',         address: '56 Mettupalayam Road, Ukkadam, Coimbatore – 641001', phone: '+91 96009 87654', email: 'ukkadam@indusdental.com' },
  SAIBABA:     { name: 'Saibaba Colony Branch',  address: '11 100 Feet Road, Saibaba Colony, Coimbatore – 641011', phone: '+91 93422 11223', email: 'saibaba@indusdental.com' },
};

// ─── Amount in Words (Indian) ─────────────────────────────────────────────────
function numberToWordsINR(amount) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function belowHundred(n) {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  }
  function belowThousand(n) {
    if (n < 100) return belowHundred(n);
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + belowHundred(n % 100) : '');
  }
  function convert(n) {
    if (n === 0) return 'Zero';
    if (n < 1000) return belowThousand(n);
    if (n < 100000) return belowThousand(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + belowThousand(n % 1000) : '');
    if (n < 10000000) return belowThousand(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return belowThousand(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  }
  const intAmt = Math.round(amount);
  return convert(intAmt) + ' Rupees Only';
}

// ─── Invoice HTML Generator (opens in new window) ────────────────────────────
function generateInvoiceHTML(inv, patient, branch) {
  const branchInfo = branch || BRANCH_DETAILS[inv.branchId] || { name: inv.branchId, address: '', phone: '', email: '' };
  const patientPhone = patient?.phone || patient?.mobile || '';
  const patientAddress = patient?.address || patient?.city || 'Coimbatore, Tamil Nadu';
  const taxable = inv.subtotal - (inv.discount || 0);
  const cgst = inv.tax ? (taxable * (inv.tax / 2 / 100)) : 0;
  const sgst = cgst;
  const amtInWords = numberToWordsINR(inv.grandTotal);

  const itemsRows = (inv.items || []).map((item, idx) => `
    <tr>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center;">${idx + 1}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;">${item.description || 'Treatment'}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:center;">${item.qty || 1}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:right;">₹${(item.rate || 0).toLocaleString('en-IN')}</td>
      <td style="padding:7px 10px;border-bottom:1px solid #eee;text-align:right;">₹${(item.amount || 0).toLocaleString('en-IN')}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${inv.id} – INDUS Dental</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; color: #1a1a2e; background: #fff; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 14mm 14mm 10mm; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1769D2; padding-bottom: 14px; margin-bottom: 14px; }
    .clinic-name { font-size: 22px; font-weight: 900; color: #1769D2; letter-spacing: -0.5px; }
    .clinic-sub  { font-size: 11px; font-weight: 700; color: #102A50; margin-top: 2px; }
    .clinic-addr { font-size: 10px; color: #555; margin-top: 4px; line-height: 1.6; }
    .invoice-label { font-size: 18px; font-weight: 900; color: #102A50; text-align: right; }
    .invoice-meta  { font-size: 11px; color: #555; text-align: right; margin-top: 6px; line-height: 1.8; }
    .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 10px; font-weight: 800;
             background: ${inv.status === 'Paid' ? '#d1fae5' : inv.status === 'Partial' ? '#fef3c7' : '#fee2e2'};
             color: ${inv.status === 'Paid' ? '#065f46' : inv.status === 'Partial' ? '#92400e' : '#991b1b'}; }
    .parties { display: flex; gap: 20px; margin-bottom: 14px; }
    .party-box { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
    .party-label { font-size: 9px; font-weight: 900; color: #1769D2; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
    .party-name  { font-size: 13px; font-weight: 800; color: #102A50; }
    .party-detail { font-size: 10px; color: #666; margin-top: 2px; line-height: 1.6; }
    table.items { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
    table.items thead th { background: #102A50; color: #fff; font-size: 10px; font-weight: 700;
                            text-transform: uppercase; padding: 9px 10px; letter-spacing: 0.5px; }
    table.items thead th:last-child, table.items thead th:nth-child(3), table.items thead th:nth-child(4) { text-align: right; }
    table.items thead th:nth-child(1) { text-align: center; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 14px; }
    .totals-box { width: 300px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .totals-row { display: flex; justify-content: space-between; padding: 7px 14px; font-size: 11px; border-bottom: 1px solid #f0f0f0; }
    .totals-row:last-child { border-bottom: none; }
    .totals-row.grand { background: #102A50; color: #fff; font-weight: 900; font-size: 13px; padding: 10px 14px; }
    .totals-row.paid  { background: #ecfdf5; color: #065f46; font-weight: 700; }
    .totals-row.due   { background: #fef2f2; color: #991b1b; font-weight: 700; }
    .payment-section { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
    .payment-title { font-size: 10px; font-weight: 900; color: #1769D2; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
    .payment-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
    .payment-item label { font-size: 9px; color: #888; font-weight: 700; display: block; }
    .payment-item span  { font-size: 11px; color: #102A50; font-weight: 600; }
    .words-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; }
    .words-label { font-size: 9px; color: #1769D2; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; }
    .words-text  { font-size: 11px; font-weight: 700; color: #102A50; margin-top: 3px; }
    .footer { border-top: 2px solid #e2e8f0; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end; }
    .footer-note { font-size: 10px; color: #555; line-height: 1.6; max-width: 300px; }
    .sign-box { text-align: right; font-size: 11px; }
    .sign-line { border-top: 1px solid #102A50; padding-top: 6px; margin-top: 30px; color: #102A50; font-weight: 700; font-size: 10px; }
    .gstin-note { font-size: 9px; color: #888; margin-top: 3px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 10mm 12mm; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="clinic-name">INDUS Dental</div>
        <div class="clinic-sub">Multi-Speciality Dental Hospital</div>
        <div class="clinic-addr">
          ${branchInfo.name}<br/>
          ${branchInfo.address}<br/>
          Tel: ${branchInfo.phone} &nbsp;|&nbsp; ${branchInfo.email}
        </div>
        <div class="gstin-note">GSTIN: 33AAAAI0000A1Z5 &nbsp;|&nbsp; SAC: 999317 (Dental Services)</div>
      </div>
      <div>
        <div class="invoice-label">TAX INVOICE</div>
        <div class="invoice-meta">
          Invoice No: <strong>${inv.id}</strong><br/>
          Date: <strong>${inv.date}</strong><br/>
          <span class="badge">${inv.status}</span>
        </div>
      </div>
    </div>

    <!-- Bill To / Doctor -->
    <div class="parties">
      <div class="party-box">
        <div class="party-label">Bill To (Patient)</div>
        <div class="party-name">${inv.patientName}</div>
        <div class="party-detail">
          Patient ID: ${inv.patientId}<br/>
          ${patientPhone ? 'Phone: ' + patientPhone + '<br/>' : ''}
          ${patientAddress}
        </div>
      </div>
      <div class="party-box">
        <div class="party-label">Treating Doctor</div>
        <div class="party-name">${inv.doctorName || 'N/A'}</div>
        <div class="party-detail">
          Branch: ${branchInfo.name}<br/>
          Invoice Date: ${inv.date}
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items">
      <thead>
        <tr>
          <th style="text-align:center;">S.No</th>
          <th>Description / Treatment</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Rate (₹)</th>
          <th style="text-align:right;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>₹${(inv.subtotal || 0).toLocaleString('en-IN')}</span>
        </div>
        ${inv.discount ? `<div class="totals-row" style="color:#dc2626;"><span>Discount</span><span>– ₹${inv.discount.toLocaleString('en-IN')}</span></div>` : ''}
        ${inv.tax ? `
        <div class="totals-row"><span>Taxable Amount</span><span>₹${taxable.toLocaleString('en-IN')}</span></div>
        <div class="totals-row"><span>CGST @ ${inv.tax / 2}%</span><span>₹${Math.round(cgst).toLocaleString('en-IN')}</span></div>
        <div class="totals-row"><span>SGST @ ${inv.tax / 2}%</span><span>₹${Math.round(sgst).toLocaleString('en-IN')}</span></div>
        ` : `<div class="totals-row" style="color:#888;font-size:10px;"><span>GST</span><span>Nil – Dental Exempt</span></div>`}
        <div class="totals-row grand"><span>Grand Total</span><span>₹${inv.grandTotal.toLocaleString('en-IN')}</span></div>
        <div class="totals-row paid"><span>Amount Paid</span><span>₹${(inv.paidAmount || 0).toLocaleString('en-IN')}</span></div>
        ${inv.balance > 0 ? `<div class="totals-row due"><span>Outstanding Balance</span><span>₹${inv.balance.toLocaleString('en-IN')}</span></div>` : ''}
      </div>
    </div>

    <!-- Payment Info -->
    <div class="payment-section">
      <div class="payment-title">Payment Information</div>
      <div class="payment-grid">
        <div class="payment-item"><label>Payment Date</label><span>${inv.date}</span></div>
        <div class="payment-item"><label>Payment Method</label><span>${inv.paymentMethod || 'N/A'}</span></div>
        <div class="payment-item"><label>Payment Status</label><span>${inv.status}</span></div>
        ${inv.paymentRef ? `<div class="payment-item"><label>Reference / UPI ID</label><span>${inv.paymentRef}</span></div>` : ''}
        <div class="payment-item"><label>Amount Received</label><span>₹${(inv.paidAmount || 0).toLocaleString('en-IN')}</span></div>
        <div class="payment-item"><label>Balance Due</label><span>₹${(inv.balance || 0).toLocaleString('en-IN')}</span></div>
      </div>
    </div>

    <!-- Amount in Words -->
    <div class="words-box">
      <div class="words-label">Amount in Words</div>
      <div class="words-text">${amtInWords}</div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-note">
        <strong>Thank you for choosing INDUS Dental.</strong><br/>
        Please carry this invoice for your records and future reference.<br/>
        For queries: +91 98430 12845 &nbsp;|&nbsp; www.indusdental.com
      </div>
      <div class="sign-box">
        <div class="sign-line">Authorised Signatory<br/>INDUS Dental – ${branchInfo.name}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// ─── Quick Date Pills ─────────────────────────────────────────────────────────
const DATE_PILLS = [
  { id: 'ALL',         label: 'All Dates' },
  { id: 'TODAY',       label: 'Today' },
  { id: 'YESTERDAY',   label: 'Yesterday' },
  { id: 'LAST_30_DAYS',label: 'Last 30 Days' },
  { id: 'THIS_MONTH',  label: 'This Month' },
  { id: 'THIS_YEAR',   label: 'This Year' },
  { id: 'CUSTOM',      label: 'Custom Range' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BillingModule() {
  const {
    invoices,
    filteredInvoices,
    patients,
    doctors,
    branches,
    selectedBranch,
    setIsNewInvoiceOpen,
    updateInvoice,
    voidInvoice,
    deleteInvoice,
    currentUser,
    showToast
  } = useApp();

  // Date filters
  const [dateQuick,   setDateQuick]   = useState('ALL');
  const [customFrom,  setCustomFrom]  = useState('');
  const [customTo,    setCustomTo]    = useState('');

  // Additional filters
  const [searchQuery,    setSearchQuery]    = useState('');
  const [statusFilter,   setStatusFilter]   = useState('ALL');
  const [methodFilter,   setMethodFilter]   = useState('ALL');
  const [doctorFilter,   setDoctorFilter]   = useState('ALL');

  // Active KPI card selection (for visual highlight)
  const [activeKpiCard,  setActiveKpiCard]  = useState(null);

  // Export dropdown
  const [showExport, setShowExport] = useState(false);

  // Edit modal state
  const [editInvoice, setEditInvoice] = useState(null);     // invoice being edited
  const [editDraft,   setEditDraft]   = useState(null);     // draft copy of editable fields

  // Delete / Void modal state
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { inv, mode: 'delete'|'void' }
  const [voidReason,    setVoidReason]    = useState('');

  // ── Filtered list ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let range = { from: '', to: '' };
    if (dateQuick === 'THIS_YEAR') {
      const yr = new Date().getFullYear();
      range = { from: `${yr}-01-01`, to: `${yr}-12-31` };
    } else if (dateQuick !== 'ALL' && dateQuick !== 'CUSTOM') {
      range = computeQuickDateRange(dateQuick);
    } else if (dateQuick === 'CUSTOM') {
      range = { from: customFrom, to: customTo };
    }

    return filteredInvoices.filter(inv => {
      // Date
      if (dateQuick !== 'ALL') {
        if (!isDateWithinRange(inv.date, range.from, range.to)) return false;
      }
      // Search
      const q = searchQuery.toLowerCase();
      if (q && !(
        inv.patientName.toLowerCase().includes(q) ||
        inv.id.toLowerCase().includes(q) ||
        inv.patientId.toLowerCase().includes(q) ||
        (inv.doctorName || '').toLowerCase().includes(q)
      )) return false;
      // Status
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
      // Method
      if (methodFilter !== 'ALL' && !(inv.paymentMethod || '').toLowerCase().includes(methodFilter.toLowerCase())) return false;
      // Doctor
      if (doctorFilter !== 'ALL' && inv.doctorName !== doctorFilter) return false;
      return true;
    });
  }, [filteredInvoices, dateQuick, customFrom, customTo, searchQuery, statusFilter, methodFilter, doctorFilter]);

  // ── KPI Summaries (from filtered) ────────────────────────────────────────
  const summary = useMemo(() => {
    const totalRevenue     = filtered.reduce((s, i) => s + (i.grandTotal   || 0), 0);
    const totalCollected   = filtered.reduce((s, i) => s + (i.paidAmount   || 0), 0);
    const totalOutstanding = filtered.reduce((s, i) => s + (i.balance      || 0), 0);
    const totalDiscounts   = filtered.reduce((s, i) => s + (i.discount     || 0), 0);
    const totalGST         = filtered.reduce((s, i) => {
      if (i.tax && i.subtotal && i.discount !== undefined) {
        const taxable = (i.subtotal || 0) - (i.discount || 0);
        return s + taxable * (i.tax / 100);
      }
      return s + (i.gstAmount || 0);
    }, 0);
    const numInvoices     = filtered.length;
    const paidInvoices    = filtered.filter(i => i.status === 'Paid').length;
    const pendingInvoices = filtered.filter(i => i.status !== 'Paid').length;
    return { totalRevenue, totalCollected, totalOutstanding, totalDiscounts, totalGST, numInvoices, paidInvoices, pendingInvoices };
  }, [filtered]);

  // ── Unique doctors for filter ─────────────────────────────────────────────
  const uniqueDoctors = useMemo(() => {
    const names = [...new Set(filteredInvoices.map(i => i.doctorName).filter(Boolean))];
    return names.sort();
  }, [filteredInvoices]);

  // ── Edit Handlers ─────────────────────────────────────────────────────────
  const openEditInvoice = (inv) => {
    setEditInvoice(inv);
    setEditDraft({
      date:          inv.date,
      discount:      inv.discount || 0,
      tax:           inv.tax || 0,
      paidAmount:    inv.paidAmount || 0,
      paymentMethod: inv.paymentMethod || 'Cash',
      paymentRef:    inv.paymentRef || '',
      notes:         inv.notes || '',
      items:         (inv.items || []).map(it => ({ ...it })),
    });
  };

  const updateDraftItem = (idx, field, value) => {
    setEditDraft(prev => {
      const items = prev.items.map((it, i) => {
        if (i !== idx) return it;
        const updated = { ...it, [field]: field === 'description' ? value : Number(value) || 0 };
        updated.amount = (updated.qty || 1) * (updated.rate || 0);
        return updated;
      });
      return { ...prev, items };
    });
  };

  const addDraftItem = () => {
    setEditDraft(prev => ({
      ...prev,
      items: [...prev.items, { description: '', qty: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeDraftItem = (idx) => {
    setEditDraft(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));
  };

  const saveEditedInvoice = () => {
    if (!editInvoice || !editDraft) return;
    updateInvoice(editInvoice.id, editDraft, currentUser?.name || 'Staff');
    setEditInvoice(null);
    setEditDraft(null);
  };

  // ── Delete / Void Handlers ────────────────────────────────────────────────
  const openDeleteInvoice = (inv) => {
    setDeleteConfirm({ inv, mode: inv.status === 'Paid' ? 'void' : 'delete' });
    setVoidReason('');
  };

  const confirmInvoiceAction = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.mode === 'void') {
      voidInvoice(deleteConfirm.inv.id, voidReason || 'Voided by staff', currentUser?.name);
    } else {
      deleteInvoice(deleteConfirm.inv.id, currentUser?.name);
    }
    setDeleteConfirm(null);
    setVoidReason('');
  };

  // ── Print Invoice ─────────────────────────────────────────────────────────
  const handlePrint = (inv) => {
    const patient = patients?.find(p => p.id === inv.patientId);
    const branchInfo = BRANCH_DETAILS[inv.branchId];
    const html = generateInvoiceHTML(inv, patient, branchInfo);
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 400);
    } else {
      showToast('Pop-up blocked. Please allow pop-ups for this site.', 'error');
    }
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const EXPORT_HEADERS = [
    { key: 'id',            label: 'Invoice Number' },
    { key: 'date',          label: 'Invoice Date' },
    { key: 'patientId',     label: 'Patient ID' },
    { key: 'patientName',   label: 'Patient Name' },
    { key: 'doctorName',    label: 'Doctor' },
    { key: 'branchId',      label: 'Branch' },
    { key: 'procedures',    label: 'Treatment / Services' },
    { key: 'subtotal',      label: 'Subtotal (₹)' },
    { key: 'discount',      label: 'Discount (₹)' },
    { key: 'taxRate',       label: 'GST Rate (%)' },
    { key: 'gstAmount',     label: 'GST Amount (₹)' },
    { key: 'grandTotal',    label: 'Grand Total (₹)' },
    { key: 'paidAmount',    label: 'Amount Paid (₹)' },
    { key: 'balance',       label: 'Outstanding Balance (₹)' },
    { key: 'paymentMethod', label: 'Payment Method' },
    { key: 'paymentRef',    label: 'Payment Reference' },
    { key: 'status',        label: 'Payment Status' },
  ];

  const buildExportRows = () => {
    const rows = filtered.map(inv => {
      const taxable   = (inv.subtotal || 0) - (inv.discount || 0);
      const gstAmt    = inv.tax ? Math.round(taxable * inv.tax / 100) : 0;
      return {
        id:            inv.id,
        date:          inv.date,
        patientId:     inv.patientId,
        patientName:   inv.patientName,
        doctorName:    inv.doctorName || '',
        branchId:      BRANCH_DETAILS[inv.branchId]?.name || inv.branchId,
        procedures:    (inv.items || []).map(i => i.description).join('; '),
        subtotal:      inv.subtotal || 0,
        discount:      inv.discount || 0,
        taxRate:       inv.tax || 0,
        gstAmount:     gstAmt,
        grandTotal:    inv.grandTotal || 0,
        paidAmount:    inv.paidAmount || 0,
        balance:       inv.balance || 0,
        paymentMethod: inv.paymentMethod || '',
        paymentRef:    inv.paymentRef || '',
        status:        inv.status,
      };
    });

    // Summary rows at top
    const summaryRows = [
      { id: '── REVENUE SUMMARY ──', date: '', patientId: '', patientName: '', doctorName: '', branchId: '', procedures: '', subtotal: '', discount: '', taxRate: '', gstAmount: '', grandTotal: '', paidAmount: '', balance: '', paymentMethod: '', paymentRef: '', status: '' },
      { id: 'Total Revenue',        date: '', patientId: '', patientName: '', doctorName: '', branchId: '', procedures: '', subtotal: '', discount: '', taxRate: '', gstAmount: '', grandTotal: `₹${summary.totalRevenue.toLocaleString('en-IN')}`, paidAmount: '', balance: '', paymentMethod: '', paymentRef: '', status: '' },
      { id: 'Total Collected',      date: '', patientId: '', patientName: '', doctorName: '', branchId: '', procedures: '', subtotal: '', discount: '', taxRate: '', gstAmount: '', grandTotal: '', paidAmount: `₹${summary.totalCollected.toLocaleString('en-IN')}`, balance: '', paymentMethod: '', paymentRef: '', status: '' },
      { id: 'Outstanding',          date: '', patientId: '', patientName: '', doctorName: '', branchId: '', procedures: '', subtotal: '', discount: '', taxRate: '', gstAmount: '', grandTotal: '', paidAmount: '', balance: `₹${summary.totalOutstanding.toLocaleString('en-IN')}`, paymentMethod: '', paymentRef: '', status: '' },
      { id: 'Total Discounts',      date: '', patientId: '', patientName: '', doctorName: '', branchId: '', procedures: '', subtotal: '', discount: `₹${summary.totalDiscounts.toLocaleString('en-IN')}`, taxRate: '', gstAmount: '', grandTotal: '', paidAmount: '', balance: '', paymentMethod: '', paymentRef: '', status: '' },
      { id: '── INVOICE RECORDS ──', date: '', patientId: '', patientName: '', doctorName: '', branchId: '', procedures: '', subtotal: '', discount: '', taxRate: '', gstAmount: '', grandTotal: '', paidAmount: '', balance: '', paymentMethod: '', paymentRef: '', status: '' },
    ];

    return [...summaryRows, ...rows];
  };

  const handleExport = (type) => {
    setShowExport(false);
    const rows = buildExportRows();
    const dateLabel = dateQuick === 'CUSTOM' ? `${customFrom}_to_${customTo}` : dateQuick.toLowerCase();
    const filename = `INDUS_Dental_Billing_${dateLabel}_${new Date().toISOString().slice(0,10)}`;
    if (type === 'csv') {
      exportToCSV(EXPORT_HEADERS, rows, `${filename}.csv`);
    } else if (type === 'pdf') {
      exportToPDF(EXPORT_HEADERS, rows, `${filename}.pdf`, 'Billing & Invoices Audit Report');
    } else {
      exportToExcel(EXPORT_HEADERS, rows, `${filename}.xlsx`, 'Billing');
    }
    showToast(`Exported ${filtered.length} invoice(s) successfully.`, 'success');
  };

  // ── KPI card helper ───────────────────────────────────────────────────────
  const KpiCard = ({ id, icon: Icon, label, value, sub, iconBg, filterKey, filterVal }) => {
    const isSelected = activeKpiCard === id;
    return (
      <div
        onClick={() => {
          if (isSelected) {
            setActiveKpiCard(null);
            setStatusFilter('ALL');
          } else {
            setActiveKpiCard(id);
            if (filterKey === 'status') setStatusFilter(filterVal || 'ALL');
          }
        }}
        className={`rounded-2xl p-4 border transition-all cursor-pointer flex items-start gap-3 ${
          isSelected
            ? 'bg-gradient-to-r from-[#0C294F] via-[#0E3A75] to-[#1253A4] border-transparent shadow-xl shadow-blue-900/20 ring-2 ring-blue-300'
            : 'bg-white border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-200'
        }`}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          isSelected ? 'bg-white/15 text-white border border-white/20' : (iconBg || 'bg-blue-50 text-[#1670E8]')
        }`}>
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <div className={`text-[10px] font-bold uppercase tracking-wide truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{label}</div>
          <div className={`text-lg font-black mt-0.5 leading-none ${isSelected ? 'text-white' : 'text-[#102A50]'}`}>{value}</div>
          {sub && <div className={`text-[10px] mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>{sub}</div>}
        </div>
      </div>
    );
  };

  const fmt = n => `₹${Math.round(n).toLocaleString('en-IN')}`;

  // ── Live totals for edit draft ────────────────────────────────────────────
  const draftTotals = useMemo(() => {
    if (!editDraft) return {};
    const subtotal   = (editDraft.items || []).reduce((s, it) => s + ((Number(it.qty)||1)*(Number(it.rate)||0)), 0);
    const discount   = Number(editDraft.discount) || 0;
    const taxRate    = Number(editDraft.tax) || 0;
    const taxable    = subtotal - discount;
    const taxAmt     = taxRate > 0 ? Math.round(taxable * taxRate / 100) : 0;
    const grandTotal = taxable + taxAmt;
    const paidAmount = Number(editDraft.paidAmount) || 0;
    const balance    = Math.max(0, grandTotal - paidAmount);
    return { subtotal, discount, taxRate, taxAmt, grandTotal, paidAmount, balance };
  }, [editDraft]);

  return (
    <div className="space-y-5 animate-in fade-in pb-10" onClick={() => showExport && setShowExport(false)}>

      {/* ── Edit Invoice Modal ── */}
      {editInvoice && editDraft && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-blue-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h3 className="font-extrabold text-[#102A50] text-sm flex items-center gap-2">
                  <Pencil size={15} className="text-[#1769D2]" />
                  Edit Invoice – {editInvoice.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{editInvoice.patientName} · {editInvoice.doctorName}</p>
              </div>
              <button onClick={() => { setEditInvoice(null); setEditDraft(null); }} className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Date & Payment Method */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Invoice Date</label>
                  <input type="date" value={editDraft.date}
                    onChange={e => setEditDraft(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Payment Method</label>
                  <select value={editDraft.paymentMethod}
                    onChange={e => setEditDraft(p => ({ ...p, paymentMethod: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100">
                    <option>Cash</option>
                    <option>UPI (GPay)</option>
                    <option>UPI (PhonePe)</option>
                    <option>Card (Credit)</option>
                    <option>Card (Debit)</option>
                    <option>Bank Transfer (NEFT)</option>
                    <option>Bank Transfer (IMPS)</option>
                    <option>Cheque</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600">Treatment / Billing Items</label>
                  <button onClick={addDraftItem} className="flex items-center gap-1 text-xs font-bold text-[#1769D2] hover:underline cursor-pointer">
                    <PlusCircle size={13} /> Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(editDraft.items || []).map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="col-span-5 border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Description"
                        value={it.description}
                        onChange={e => updateDraftItem(idx, 'description', e.target.value)}
                      />
                      <input type="number" min="1"
                        className="col-span-2 border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Qty"
                        value={it.qty || 1}
                        onChange={e => updateDraftItem(idx, 'qty', e.target.value)}
                      />
                      <input type="number" min="0"
                        className="col-span-3 border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Rate ₹"
                        value={it.rate || 0}
                        onChange={e => updateDraftItem(idx, 'rate', e.target.value)}
                      />
                      <div className="col-span-1 text-xs font-bold text-slate-700 text-right">
                        ₹{((it.qty||1)*(it.rate||0)).toLocaleString('en-IN')}
                      </div>
                      <button onClick={() => removeDraftItem(idx)} className="col-span-1 p-1 text-rose-400 hover:text-rose-600 cursor-pointer flex justify-center">
                        <MinusCircle size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discount, GST, Paid Amount */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Discount (₹)</label>
                  <input type="number" min="0" value={editDraft.discount}
                    onChange={e => setEditDraft(p => ({ ...p, discount: Number(e.target.value)||0 }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">GST Rate (%)</label>
                  <input type="number" min="0" max="28" value={editDraft.tax}
                    onChange={e => setEditDraft(p => ({ ...p, tax: Number(e.target.value)||0 }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Amount Paid (₹)</label>
                  <input type="number" min="0" value={editDraft.paidAmount}
                    onChange={e => setEditDraft(p => ({ ...p, paidAmount: Number(e.target.value)||0 }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Notes / Remarks</label>
                <textarea rows={2} value={editDraft.notes}
                  onChange={e => setEditDraft(p => ({ ...p, notes: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100 resize-none" />
              </div>

              {/* Live Totals Preview */}
              <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Live Calculation Preview</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ['Subtotal',          fmt(draftTotals.subtotal || 0)],
                    ['Discount',          `– ${fmt(draftTotals.discount || 0)}`],
                    ['GST',               draftTotals.taxAmt > 0 ? fmt(draftTotals.taxAmt) : 'Nil'],
                    ['Grand Total',       fmt(draftTotals.grandTotal || 0), true],
                    ['Amount Paid',       fmt(draftTotals.paidAmount || 0)],
                    ['Balance Due',       fmt(draftTotals.balance || 0), false, draftTotals.balance > 0],
                  ].map(([label, val, bold, warn]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-500">{label}</span>
                      <span className={`font-bold ${bold ? 'text-[#102A50]' : warn ? 'text-rose-600' : 'text-slate-700'}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3 rounded-b-3xl">
              <button onClick={() => { setEditInvoice(null); setEditDraft(null); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={saveEditedInvoice}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1769D2] hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-500/20">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete / Void Confirmation Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full mx-4 border border-rose-100">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${deleteConfirm.mode === 'void' ? 'bg-amber-100' : 'bg-rose-100'}`}>
                {deleteConfirm.mode === 'void'
                  ? <ShieldAlert size={20} className="text-amber-600" />
                  : <Trash2 size={20} className="text-rose-600" />}
              </div>
              <div>
                <h3 className="font-extrabold text-[#102A50] text-sm">
                  {deleteConfirm.mode === 'void' ? 'Void / Cancel Invoice?' : 'Delete Invoice?'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {deleteConfirm.mode === 'void'
                    ? 'Paid invoices are voided — record is preserved for audit.'
                    : 'Unpaid invoice will be permanently removed.'}
                </p>
              </div>
            </div>
            <div className={`rounded-2xl p-3 mb-4 text-xs text-slate-700 leading-relaxed ${deleteConfirm.mode === 'void' ? 'bg-amber-50' : 'bg-rose-50'}`}>
              <div className="font-bold text-[#102A50]">{deleteConfirm.inv.id}</div>
              <div className="text-slate-500">{deleteConfirm.inv.patientName} · {deleteConfirm.inv.date}</div>
              <div className="font-bold text-slate-800 mt-1">Grand Total: ₹{(deleteConfirm.inv.grandTotal||0).toLocaleString('en-IN')} · Status: {deleteConfirm.inv.status}</div>
            </div>
            {deleteConfirm.mode === 'void' && (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Void Reason *</label>
                <input
                  type="text"
                  placeholder="e.g. Duplicate entry, Patient cancelled..."
                  value={voidReason}
                  onChange={e => setVoidReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-amber-100"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setDeleteConfirm(null); setVoidReason(''); }}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button
                onClick={confirmInvoiceAction}
                disabled={deleteConfirm.mode === 'void' && !voidReason.trim()}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer text-white transition-colors ${
                  deleteConfirm.mode === 'void'
                    ? 'bg-amber-600 hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}>
                {deleteConfirm.mode === 'void' ? 'Void Invoice' : 'Delete Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0C294F] via-[#0E3A75] to-[#1670E8] p-5 rounded-3xl shadow-lg shadow-blue-900/25">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-white/15 border border-white/25 text-white flex items-center justify-center shrink-0 backdrop-blur-sm" style={{width:'52px',height:'52px'}}>
            <Receipt size={28} className="stroke-[2] text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-white tracking-tight">Billing, Invoices & Payment Collections</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/25 text-emerald-100 border border-emerald-300/30">Tax Compliant</span>
            </div>
            <p className="text-xs text-blue-100/75 mt-0.5">Centralised accounts, branch collections, UPI/Card audit trails</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Export Button */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowExport(v => !v)}
              className="px-3 py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-sm"
            >
              <Download size={14} />
              <span>Export</span>
              <ChevronDown size={12} />
            </button>
            {showExport && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-slate-200 shadow-lg z-50 w-44 overflow-hidden">
                <button onClick={() => handleExport('xlsx')} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 text-[#102A50] flex items-center gap-2 cursor-pointer">
                  <FileText size={13} className="text-emerald-600" /> Export to Excel (.xlsx)
                </button>
                <button onClick={() => handleExport('csv')} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 text-[#102A50] flex items-center gap-2 cursor-pointer">
                  <FileText size={13} className="text-blue-600" /> Export to CSV (.csv)
                </button>
                <button onClick={() => handleExport('pdf')} className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-rose-50 text-[#102A50] flex items-center gap-2 cursor-pointer">
                  <FileText size={13} className="text-rose-600" /> Export to PDF (.pdf)
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsNewInvoiceOpen(true)}
            className="px-4 py-2 bg-white hover:bg-blue-50 text-[#1253A4] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* ── Date Filters ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <Filter size={11} /> Invoice Date Filter
        </div>
        <div className="flex flex-wrap gap-2">
          {DATE_PILLS.map(pill => (
            <button
              key={pill.id}
              onClick={() => { setDateQuick(pill.id); if (pill.id !== 'CUSTOM') { setCustomFrom(''); setCustomTo(''); } }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dateQuick === pill.id
                  ? 'bg-[#1769D2] text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#1769D2]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
        {dateQuick === 'CUSTOM' && (
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>From</span>
              <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>To</span>
              <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
        )}
      </div>

      {/* ── Additional Filters ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient name, ID, invoice #, doctor..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer">
              <X size={12} />
            </button>
          )}
        </div>

        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer">
          <option value="ALL">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending</option>
          <option value="Overdue">Overdue</option>
        </select>

        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer">
          <option value="ALL">All Methods</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="NEFT">NEFT</option>
        </select>

        <select value={doctorFilter} onChange={e => setDoctorFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer">
          <option value="ALL">All Doctors</option>
          {uniqueDoctors.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {(searchQuery || statusFilter !== 'ALL' || methodFilter !== 'ALL' || doctorFilter !== 'ALL' || dateQuick !== 'ALL') && (
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); setMethodFilter('ALL'); setDoctorFilter('ALL'); setDateQuick('ALL'); setCustomFrom(''); setCustomTo(''); }}
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <X size={12} /> Clear All
          </button>
        )}
      </div>

      {/* ── Revenue Summary (8 KPI Cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard id="all"       icon={IndianRupee}  label="Total Revenue"       value={fmt(summary.totalRevenue)}     sub={`${summary.numInvoices} invoice(s)`}  iconBg="bg-blue-50 text-[#1670E8] border border-blue-100"       filterKey="status" filterVal="ALL" />
        <KpiCard id="collected" icon={TrendingUp}   label="Total Collected"     value={fmt(summary.totalCollected)}   sub="Payments received"                     iconBg="bg-emerald-50 text-emerald-600 border border-emerald-100" filterKey="status" filterVal="Paid" />
        <KpiCard id="outstnd"   icon={TrendingDown} label="Outstanding Amount"  value={fmt(summary.totalOutstanding)} sub="Pending dues"                          iconBg="bg-rose-50 text-rose-600 border border-rose-100"         filterKey="status" filterVal="Pending" />
        <KpiCard id="disc"      icon={Tag}          label="Total Discounts"     value={fmt(summary.totalDiscounts)}   sub="Applied concessions"                   iconBg="bg-amber-50 text-amber-600 border border-amber-100"      />
        <KpiCard id="gst"       icon={Receipt}      label="Total GST Collected" value={fmt(summary.totalGST)}         sub="CGST + SGST"                           iconBg="bg-purple-50 text-purple-600 border border-purple-100"   />
        <KpiCard id="num"       icon={FileText}     label="Number of Invoices"  value={summary.numInvoices}           sub="In selected period"                    iconBg="bg-slate-100 text-slate-600 border border-slate-200"     />
        <KpiCard id="paid"      icon={CheckCircle2} label="Paid Invoices"       value={summary.paidInvoices}          sub="Fully settled"                         iconBg="bg-teal-50 text-teal-600 border border-teal-100"         filterKey="status" filterVal="Paid" />
        <KpiCard id="pending"   icon={Clock}        label="Pending / Partial"   value={summary.pendingInvoices}       sub="Awaiting payment"                      iconBg="bg-orange-50 text-orange-600 border border-orange-100"   filterKey="status" filterVal="Partial" />
      </div>

      {/* ── Invoices Table ── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <span className="text-sm font-bold text-[#102A50]">Invoice Records</span>
          <span className="text-xs text-slate-500 font-semibold">{filtered.length} record(s) found</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Patient & Doctor</th>
                <th className="py-3 px-4">Procedures</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Paid & Method</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 font-semibold text-sm">
                    No invoices match the selected filters.
                  </td>
                </tr>
              ) : filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-xs text-[#102A50]">{inv.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{inv.date}</div>
                    <div className="text-[10px] text-slate-400">{BRANCH_DETAILS[inv.branchId]?.name || inv.branchId}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-xs text-[#102A50]">{inv.patientName}</div>
                    <div className="text-[10px] text-slate-500">{inv.patientId}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{inv.doctorName}</div>
                  </td>

                  <td className="py-3.5 px-4 max-w-[180px]">
                    <div className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                      {(inv.items || []).map(i => i.description).join(', ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-900">
                    ₹{(inv.grandTotal || 0).toLocaleString('en-IN')}
                    {inv.discount > 0 && (
                      <div className="text-[10px] text-amber-600 font-semibold">Disc: ₹{inv.discount.toLocaleString('en-IN')}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-700">₹{(inv.paidAmount || 0).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{inv.paymentMethod}</div>
                    {inv.paymentRef && <div className="text-[9px] text-slate-400">{inv.paymentRef}</div>}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      inv.balance === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : inv.status === 'Overdue'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {inv.balance === 0 ? 'Settled' : `Due: ₹${inv.balance.toLocaleString('en-IN')}`}
                    </span>
                    <div className="mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        inv.status === 'Paid'    ? 'bg-emerald-50 text-emerald-700' :
                        inv.status === 'Partial' ? 'bg-amber-50 text-amber-700' :
                        inv.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>{inv.status}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Edit */}
                      {inv.status !== 'Void' && (
                        <button
                          onClick={() => openEditInvoice(inv)}
                          title="Edit Invoice"
                          className="p-1.5 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <Pencil size={13} />
                        </button>
                      )}

                      {/* Print */}
                      <button
                        onClick={() => handlePrint(inv)}
                        title="Print Invoice"
                        className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Printer size={13} />
                      </button>

                      {/* Delete / Void */}
                      {inv.status !== 'Void' && (
                        <button
                          onClick={() => openDeleteInvoice(inv)}
                          title={inv.status === 'Paid' ? 'Void Invoice' : 'Delete Invoice'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            inv.status === 'Paid'
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                              : 'bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-700'
                          }`}
                        >
                          {inv.status === 'Paid' ? <ShieldAlert size={13} /> : <Trash2 size={13} />}
                        </button>
                      )}

                      {/* Voided badge */}
                      {inv.status === 'Void' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500">Voided</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
