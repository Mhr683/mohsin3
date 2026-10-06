import React, { useState } from 'react';
import {
  LifeBuoy,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { User, Order } from '../types';

interface SupportDisputeDeskViewProps {
  currentUser: User;
  orders: Order[];
  onRefundDispute?: (resellerId: string, amount: number, reason: string) => void;
  onLogAudit?: (action: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'FAILED') => void;
}

interface DisputeItem {
  id: string;
  orderNumber: string;
  customerName: string;
  issue: string;
  amountPKR: number;
  status: 'PENDING' | 'RESOLVED' | 'UNDER_REVIEW';
  createdAt: string;
}

export const SupportDisputeDeskView: React.FC<SupportDisputeDeskViewProps> = ({
  currentUser,
  orders,
  onRefundDispute,
  onLogAudit,
}) => {
  const [disputes, setDisputes] = useState<DisputeItem[]>([
    {
      id: 'DISP-101',
      orderNumber: 'YM-98241',
      customerName: 'Muhammad Bilal',
      issue: 'Customer reported minor package dent in transit. Replacement tip set sent.',
      amountPKR: 450,
      status: 'PENDING',
      createdAt: '2026-10-04 16:30',
    },
    {
      id: 'DISP-102',
      orderNumber: 'YM-98242',
      customerName: 'Ayesha Siddiqua',
      issue: 'Rider delayed delivery by 1 day due to local rain. Rider apologized and parcel delivered.',
      amountPKR: 200,
      status: 'RESOLVED',
      createdAt: '2026-10-03 11:20',
    }
  ]);

  const [newOrderNum, setNewOrderNum] = useState('');
  const [newIssue, setNewIssue] = useState('');

  const handleResolve = (id: string, amount: number, reason: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'RESOLVED' } : d))
    );
    if (onRefundDispute) {
      onRefundDispute(currentUser.id, amount, reason);
    }
    if (onLogAudit) {
      onLogAudit('DISPUTE_SETTLED', `Settled dispute ${id} with compensation PKR ${amount}`, 'SUCCESS');
    }
    alert(`Dispute resolved and PKR ${amount} credited as compensation!`);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssue.trim()) return;
    const newItem: DisputeItem = {
      id: `DISP-${Date.now().toString().slice(-4)}`,
      orderNumber: newOrderNum || 'YM-GENERAL',
      customerName: 'Support Query',
      issue: newIssue,
      amountPKR: 500,
      status: 'PENDING',
      createdAt: 'Just now',
    };
    setDisputes([newItem, ...disputes]);
    setNewOrderNum('');
    setNewIssue('');
    alert('Ticket logged with Senior Support Resolution Desk.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 inline-block mb-2">
            Priority Reseller Support & Mediation
          </span>
          <h2 className="text-2xl font-black">24/7 Escalation & Disputes Desk</h2>
          <p className="text-xs text-slate-400 mt-1">
            Resolve delivery delays, courier damage claims, and warranty replacement compensations.
          </p>
        </div>

        <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-right">
          <span className="text-[10px] text-slate-400 block font-semibold">Active Escalations</span>
          <span className="text-2xl font-black text-indigo-400 font-mono">
            {disputes.filter((d) => d.status === 'PENDING').length}
          </span>
        </div>
      </div>

      {/* New Ticket Form */}
      <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Open Support / Compensation Ticket</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Related Order Number</label>
            <input
              type="text"
              placeholder="e.g. YM-98241"
              value={newOrderNum}
              onChange={(e) => setNewOrderNum(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">Issue Description / Courier Dispute</label>
            <input
              type="text"
              required
              placeholder="Describe courier damage, wrong item, or delay"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
          </div>
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
        >
          Submit Dispute Ticket
        </button>
      </form>

      {/* Disputes List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Escalations Log</h3>

        <div className="divide-y divide-slate-100">
          {disputes.map((d) => (
            <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">{d.id}</span>
                  <span className="text-xs text-slate-500 font-mono">Order: #{d.orderNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      d.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{d.issue}</p>
                <p className="text-[11px] text-slate-400 font-mono">Logged: {d.createdAt}</p>
              </div>

              {d.status === 'PENDING' && (
                <button
                  onClick={() => handleResolve(d.id, d.amountPKR, d.issue)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Compensate PKR {d.amountPKR}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
