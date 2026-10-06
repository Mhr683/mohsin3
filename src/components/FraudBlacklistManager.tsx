import React, { useState } from 'react';
import {
  ShieldBan,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  PhoneCall,
  MapPin,
  Clock
} from 'lucide-react';
import { BlacklistEntry } from '../types';
import { INITIAL_BLACKLIST } from '../utils/riskCalculator';

export const FraudBlacklistManager: React.FC = () => {
  const [blacklist, setBlacklist] = useState<BlacklistEntry[]>(() => {
    const saved = localStorage.getItem('ym_fraud_blacklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_BLACKLIST;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    phone: '',
    customerName: '',
    city: '',
    address: '',
    reason: '',
    failedDeliveriesCount: 2,
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.phone) return;
    const entry: BlacklistEntry = {
      id: `BLK-${Date.now().toString().slice(-4)}`,
      phone: newEntry.phone,
      customerName: newEntry.customerName || 'Unknown Buyer',
      city: newEntry.city || 'Unknown',
      address: newEntry.address,
      reason: newEntry.reason || 'Repeated COD doorstep refusal',
      reportedBy: 'Store Fraud Desk',
      reportedAt: new Date().toISOString().split('T')[0],
      failedDeliveriesCount: Number(newEntry.failedDeliveriesCount) || 1,
    };

    const updated = [entry, ...blacklist];
    setBlacklist(updated);
    localStorage.setItem('ym_fraud_blacklist', JSON.stringify(updated));
    setShowAddModal(false);
    setNewEntry({ phone: '', customerName: '', city: '', address: '', reason: '', failedDeliveriesCount: 2 });
  };

  const handleDelete = (id: string) => {
    const updated = blacklist.filter((b) => b.id !== id);
    setBlacklist(updated);
    localStorage.setItem('ym_fraud_blacklist', JSON.stringify(updated));
  };

  const filtered = blacklist.filter(
    (b) =>
      b.phone.includes(searchTerm) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/60 p-5 rounded-2xl border border-rose-500/20">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
              <ShieldBan className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">National COD & RTO Fraud Blacklist</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Shared cross-store intelligence preventing fake doorstep refusals & carrier dispatch loss
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-900/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Blacklist Phone / Customer</span>
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Flagged Numbers</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{blacklist.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Protected across all connected stores</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Estimated Delivery Loss Averted</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            Rs. {(blacklist.length * 350).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Calculated at Rs. 350 courier return fee/parcel</div>
        </div>
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400">Advance Guarantee Enforced</div>
          <div className="text-2xl font-black text-amber-400 mt-1">100%</div>
          <div className="text-[11px] text-slate-400 mt-1">Requires Rs. 200 fee before label creation</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by phone number, customer name, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
        />
      </div>

      {/* Blacklist Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/70 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Customer & Phone</th>
                <th className="px-5 py-3.5">Location</th>
                <th className="px-5 py-3.5">Reason & Evidence</th>
                <th className="px-5 py-3.5">Failed Dispatches</th>
                <th className="px-5 py-3.5">Reported By</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{item.customerName}</div>
                    <div className="text-xs font-mono text-rose-400 mt-0.5 flex items-center gap-1">
                      <PhoneCall className="w-3 h-3" />
                      {item.phone}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <div className="text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.city}
                    </div>
                    {item.address && <div className="text-slate-400 text-[11px] truncate max-w-xs mt-0.5">{item.address}</div>}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <span className="text-rose-300 bg-rose-950/40 border border-rose-500/20 px-2.5 py-1 rounded-md inline-block max-w-sm">
                      {item.reason}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded text-xs">
                      {item.failedDeliveriesCount} RTO Returns
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-400">
                    <div>{item.reportedBy}</div>
                    <div className="text-[10px] text-slate-500">{item.reportedAt}</div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                      title="Remove from Blacklist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldBan className="w-5 h-5 text-rose-500" />
              Add to Shared Fraud Blacklist
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Phone Number (Mandatory)</label>
                <input
                  type="text"
                  placeholder="03XXXXXXXXX"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Asim Raza"
                  value={newEntry.customerName}
                  onChange={(e) => setNewEntry({ ...newEntry, customerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore"
                    value={newEntry.city}
                    onChange={(e) => setNewEntry({ ...newEntry, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Failed Deliveries</label>
                  <input
                    type="number"
                    value={newEntry.failedDeliveriesCount}
                    onChange={(e) => setNewEntry({ ...newEntry, failedDeliveriesCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Reason / Behavior</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Repeated refusal on doorstep, switched off phone"
                  value={newEntry.reason}
                  onChange={(e) => setNewEntry({ ...newEntry, reason: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-semibold"
                >
                  Confirm Blacklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
