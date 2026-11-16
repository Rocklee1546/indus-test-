import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertCircle,
  Building2,
  FileText
} from 'lucide-react';

export default function LabManagementModule() {
  const {
    labOrders,
    filteredLabOrders,
    branches,
    selectedBranch,
    setIsNewLabOrderOpen,
    updateLabOrderStatus
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const statuses = ['Sent to Lab', 'In Progress', 'Ready', 'Received', 'Approved'];

  const filtered = filteredLabOrders.filter(order => {
    const matchesSearch =
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.workType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Dental Laboratory & Prosthetics Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-[#7955D9]">
              {filtered.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track crowns, bridges, dentures, aligners and implants across commercial labs in Coimbatore
          </p>
        </div>

        <button
          onClick={() => setIsNewLabOrderOpen(true)}
          className="px-4 py-2 bg-[#7955D9] hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus size={15} />
          <span>New Lab Order</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search orders by patient, order ID, crown type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-bold bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#102A50] outline-none cursor-pointer"
        >
          <option value="ALL">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Patient & Doctor</th>
                <th className="py-3 px-4">Lab Name</th>
                <th className="py-3 px-4">Work Specs & Shade</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4">Status & Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-xs text-[#7955D9]">{order.id}</div>
                    <div className="text-[10px] text-slate-400">Sent: {order.dateSent}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-xs text-[#102A50]">{order.patientName}</div>
                    <div className="text-[10px] text-slate-500">{order.doctorName} ({order.branchId})</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {order.labName}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{order.workType}</div>
                    <div className="text-[10px] text-slate-500">{order.toothNumber} • Shade: <b className="text-[#1769D2]">{order.shade}</b></div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {order.expectedDate}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        order.status === 'Received' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Ready' ? 'bg-teal-100 text-teal-800' :
                        order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                      {order.doctorVerified && (
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.status !== 'Received' && (
                        <button
                          onClick={() => updateLabOrderStatus(order.id, 'Received')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Mark Received
                        </button>
                      )}
                      {!order.doctorVerified && (
                        <button
                          onClick={() => updateLabOrderStatus(order.id, order.status, true)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1769D2] hover:bg-blue-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Dr. Verify
                        </button>
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
