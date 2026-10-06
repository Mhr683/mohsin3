import React, { useState } from 'react';
import {
  FileCheck2,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Download,
  Filter
} from 'lucide-react';
import { CourierReconciliationRecord } from '../types';

const INITIAL_RECONCILIATION: CourierReconciliationRecord[] = [
  {
    id: 'REC-001',
    courier: 'PostEx Logistics',
    trackingNumber: 'PEX-99823101',
    orderId: 'ORD-9821',
    expectedCodPKR: 3500,
    receivedCodPKR: 3500,
    shippingFeeChargedPKR: 280,
    discrepancyPKR: 0,
    payoutDate: '2026-09-04',
    settlementStatus: 'MATCHED',
  },
  {
    id: 'REC-002',
    courier: 'Trax Logistics',
    trackingNumber: 'TRX-88219034',
    orderId: 'ORD-9822',
    expectedCodPKR: 4200,
    receivedCodPKR: 3950,
    shippingFeeChargedPKR: 320,
    discrepancyPKR: -250,
    payoutDate: '2026-09-04',
    settlementStatus: 'DISCREPANCY',
  },
  {
    id: 'REC-003',
    courier: 'TCS Express COD',
    trackingNumber: 'TCS-77123901',
    orderId: 'ORD-9825',
    expectedCodPKR: 2999,
    receivedCodPKR: 2999,
    shippingFeeChargedPKR: 290,
    discrepancyPKR: 0,
    payoutDate: '2026-09-05',
    settlementStatus: 'MATCHED',
  },
  {
    id: 'REC-004',
    courier: 'Leopards Courier',
    trackingNumber: 'LEO-66120932',
    orderId: 'ORD-9828',
    expectedCodPKR: 5400,
    receivedCodPKR: 0,
    shippingFeeChargedPKR: 350,
    discrepancyPKR: -5400,
    payoutDate: 'Pending Cycle',
    settlementStatus: 'PENDING',
  },
];

export const CourierReconciliationView: React.FC = () => {
  const [records, setRecords] = useState<CourierReconciliationRecord[]>(INITIAL_RECONCILIATION);
  const [selectedCourier, setSelectedCourier] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [simulatingUpload, setSimulatingUpload] = useState(false);

  const filtered = records.filter((r) => {
    const matchesCourier = selectedCourier === 'ALL' || r.courier.includes(selectedCourier);
    const matchesSearch =
      r.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourier && matchesSearch;
  });

  const totalCollectedPKR = records.reduce((acc, curr) => acc + curr.receivedCodPKR, 0);
  const totalDiscrepancyPKR = records.reduce((acc, curr) => acc + (curr.discrepancyPKR < 0 ? Math.abs(curr.discrepancyPKR) : 0), 0);

  const handleSimulateCSV = () => {
    setSimulatingUpload(true);
    setTimeout(() => {
      setSimulatingUpload(false);
      const newRecord: CourierReconciliationRecord = {
        id: `REC-${Date.now().toString().slice(-3)}`,
        courier: 'PostEx Logistics',
        trackingNumber: `PEX-${Math.floor(10000000 + Math.random() * 90000000)}`,
        orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        expectedCodPKR: 2800,
        receivedCodPKR: 2800,
        shippingFeeChargedPKR: 260,
        discrepancyPKR: 0,
        payoutDate: new Date().toISOString().split('T')[0],
        settlementStatus: 'MATCHED',
      };
      setRecords([newRecord, ...records]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/60 p-5 rounded-2xl border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Courier Weekly Settlement & COD Reconciliation</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated CSV matching engine for PostEx, Trax, TCS & Leopards payments vs booked order totals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleSimulateCSV}
            disabled={simulatingUpload}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            <span>{simulatingUpload ? 'Parsing Courier CSV...' : 'Upload Courier Settlement CSV'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total COD Settled (Bank Credited)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">Rs. {totalCollectedPKR.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Directly credited to reseller wallet</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Flagged Under-Payment Discrepancies</div>
          <div className="text-2xl font-black text-rose-400 mt-1">Rs. {totalDiscrepancyPKR.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1">Shortage automatically logged for dispute</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Reconciliation Match Rate</div>
          <div className="text-2xl font-black text-blue-400 mt-1">94.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero leakages across 4 partner couriers</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tracking number or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
          />
        </div>

        <div className="flex gap-2">
          {['ALL', 'PostEx', 'Trax', 'TCS', 'Leopards'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCourier(c)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                selectedCourier === c
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/70 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Courier & Tracking</th>
                <th className="px-5 py-3.5">Order ID</th>
                <th className="px-5 py-3.5">Booked COD</th>
                <th className="px-5 py-3.5">Received Amount</th>
                <th className="px-5 py-3.5">Shipping Deducted</th>
                <th className="px-5 py-3.5">Discrepancy</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{item.courier}</div>
                    <div className="font-mono text-emerald-400 text-[11px] mt-0.5">{item.trackingNumber}</div>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-200">{item.orderId}</td>
                  <td className="px-5 py-4 font-semibold text-slate-300">Rs. {item.expectedCodPKR.toLocaleString()}</td>
                  <td className="px-5 py-4 font-bold text-white">Rs. {item.receivedCodPKR.toLocaleString()}</td>
                  <td className="px-5 py-4 text-slate-400">Rs. {item.shippingFeeChargedPKR}</td>
                  <td className="px-5 py-4 font-bold">
                    {item.discrepancyPKR === 0 ? (
                      <span className="text-emerald-400">Rs. 0 (Clean)</span>
                    ) : (
                      <span className="text-rose-400">Rs. {item.discrepancyPKR}</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        item.settlementStatus === 'MATCHED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.settlementStatus === 'DISCREPANCY'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {item.settlementStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
