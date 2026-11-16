import React, { useState } from 'react';
import { useApp, USERS } from '../../context/AppContext';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Building2,
  Lock,
  CheckCircle2,
  XCircle,
  Key
} from 'lucide-react';

export default function StaffRolesModule() {
  const { currentUser, branches } = useApp();

  const [activeTab, setActiveTab] = useState('staff_list');

  const permissionsMatrix = [
    { module: 'Central Dashboard', superAdmin: true, branchManager: true, doctor: true, receptionist: true, billing: true, marketing: false },
    { module: 'Leads & Enquiries', superAdmin: true, branchManager: true, doctor: false, receptionist: true, billing: false, marketing: true },
    { module: 'Patient Registration', superAdmin: true, branchManager: true, doctor: true, receptionist: true, billing: false, marketing: false },
    { module: 'Doctor Consultation (OPD)', superAdmin: true, branchManager: false, doctor: true, receptionist: false, billing: false, marketing: false },
    { module: 'Dental EMR & Odontogram', superAdmin: true, branchManager: false, doctor: true, receptionist: false, billing: false, marketing: false },
    { module: 'Draw & Explain Canvas', superAdmin: true, branchManager: false, doctor: true, receptionist: false, billing: false, marketing: false },
    { module: 'Lab Management', superAdmin: true, branchManager: true, doctor: true, receptionist: false, billing: false, marketing: false },
    { module: 'Billing & Invoicing', superAdmin: true, branchManager: true, doctor: false, receptionist: false, billing: true, marketing: false },
    { module: 'WhatsApp Campaigns', superAdmin: true, branchManager: true, doctor: false, receptionist: true, billing: false, marketing: true },
    { module: 'Inventory & Transfers', superAdmin: true, branchManager: true, doctor: true, receptionist: false, billing: false, marketing: false },
    { module: 'Audit Logs & Settings', superAdmin: true, branchManager: false, doctor: false, receptionist: false, billing: false, marketing: false }
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-[#102A50]">
              Staff & Role-Based Access Control (RBAC)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1769D2] text-white">
              7 Active Profiles
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict healthcare role boundaries protecting patient records and financial audits
          </p>
        </div>

        {/* Tab switch */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('staff_list')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'staff_list' ? 'bg-white text-[#102A50] shadow-xs' : 'text-slate-600'
            }`}
          >
            Staff Directory
          </button>
          <button
            onClick={() => setActiveTab('permissions_matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'permissions_matrix' ? 'bg-white text-[#102A50] shadow-xs' : 'text-slate-600'
            }`}
          >
            Security Permissions Matrix
          </button>
        </div>
      </div>

      {activeTab === 'staff_list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {USERS.map(staff => (
            <div key={staff.id} className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-[#102A50]">{staff.name}</h3>
                  <span className="text-[11px] font-bold text-[#1769D2] bg-blue-50 px-2 py-0.5 rounded-full">
                    {staff.role}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 font-medium">
                {staff.title}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Branch: <b className="text-slate-800">{staff.branchId}</b></span>
                <span className="text-emerald-600 font-bold">● Active</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Clinical / Admin Module</th>
                  <th className="py-3 px-4 text-center">Super Admin</th>
                  <th className="py-3 px-4 text-center">Branch Manager</th>
                  <th className="py-3 px-4 text-center">Doctor</th>
                  <th className="py-3 px-4 text-center">Receptionist</th>
                  <th className="py-3 px-4 text-center">Billing Staff</th>
                  <th className="py-3 px-4 text-center">Marketing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-[#102A50]">{row.module}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-emerald-600 font-bold">✓ Full</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.branchManager ? <span className="text-emerald-600 font-bold">✓ Yes</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.doctor ? <span className="text-emerald-600 font-bold">✓ Yes</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.receptionist ? <span className="text-emerald-600 font-bold">✓ Yes</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.billing ? <span className="text-emerald-600 font-bold">✓ Yes</span> : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.marketing ? <span className="text-emerald-600 font-bold">✓ Yes</span> : <span className="text-slate-300">-</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
