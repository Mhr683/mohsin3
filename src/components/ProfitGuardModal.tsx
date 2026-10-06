import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Percent,
  Coins,
  Truck,
  ArrowRight,
  Building2,
  Wallet,
  Save,
  HelpCircle,
  Sliders,
  DollarSign
} from 'lucide-react';
import { ProfitGuardConfig } from '../types';
import { evaluateOrderFinancials } from '../utils/profitGuard';

interface ProfitGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ProfitGuardConfig;
  onSaveConfig?: (newConfig: ProfitGuardConfig) => void;
}

export const ProfitGuardModal: React.FC<ProfitGuardModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'settings' | 'flow' | 'sandbox'>('settings');

  // Config settings form
  const [platformFeePct, setPlatformFeePct] = useState<number>(config.platformFeePct || 2.0);
  const [processingFeePKR, setProcessingFeePKR] = useState<number>(config.processingFeePKR || 30);
  const [shippingCostPKR, setShippingCostPKR] = useState<number>(config.defaultShippingCostPKR || 200);
  const [minProfitMarginPct, setMinProfitMarginPct] = useState<number>(config.minProfitMarginPct || 12);
  const [enforceLock, setEnforceLock] = useState<boolean>(config.enforceLock !== false);

  const [isSavedToast, setIsSavedToast] = useState(false);

  // Simulator inputs
  const [simSellingPrice, setSimSellingPrice] = useState<number>(2000);
  const [simSupplierCost, setSimSupplierCost] = useState<number>(1200);

  // Evaluate using the strict financial formula:
  const simResult = evaluateOrderFinancials(
    {
      sellingPricePKR: simSellingPrice,
      supplierCostPKR: simSupplierCost,
      shippingCostPKR: shippingCostPKR,
      processingFeePKR: processingFeePKR,
      platformFeePct: platformFeePct,
    },
    {
      ...config,
      platformFeePct,
      processingFeePKR,
      defaultShippingCostPKR: shippingCostPKR,
      minProfitMarginPct,
      enforceLock,
    }
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveConfig) {
      onSaveConfig({
        ...config,
        platformFeePct,
        processingFeePKR,
        defaultShippingCostPKR: shippingCostPKR,
        minProfitMarginPct,
        enforceLock,
      });
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl max-h-[92vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-950 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white">Platform Fee & Profit Guard Engine</h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                  {platformFeePct}% Commission + Rs. {processingFeePKR} Order Fee
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aapka platform har delivered order par kitna munafa charge karega aur COD se paise kaise katenge.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Fee Settings (Set Platform Margin)</span>
          </button>

          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'flow'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="h-3.5 w-3.5" />
            <span>Paisa Kaise Aata Hai? (Cash-Flow)</span>
          </button>

          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Percent className="h-3.5 w-3.5" />
            <span>Financial Loss Calculator</span>
          </button>
        </div>

        {/* Toast */}
        {isSavedToast && (
          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/70 p-3 text-xs font-bold text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Settings Saved! New platform fee & processing charge are now live on all orders.</span>
          </div>
        )}

        {/* TAB 1: SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Platform Percentage Commission */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Percent className="h-4 w-4 text-purple-400" />
                    <span>Platform Commission (%)</span>
                  </label>
                  <span className="font-mono font-black text-purple-300 text-sm">
                    {platformFeePct}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Customer ke total selling price par aapka percentage cut (Standard: 2.0% - 5.0%).
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={platformFeePct}
                    onChange={(e) => setPlatformFeePct(Number(e.target.value))}
                    className="flex-1 accent-purple-500 cursor-pointer"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={platformFeePct}
                    onChange={(e) => setPlatformFeePct(Number(e.target.value))}
                    className="w-16 rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-center font-mono font-bold text-white"
                  />
                </div>
              </div>

              {/* Order Processing Fee */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <span>Fixed Order Processing Fee</span>
                  </label>
                  <span className="font-mono font-black text-amber-300 text-sm">
                    PKR {processingFeePKR}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Har order par platform ka fixed charge (Packaging, Server, SMS bot kharcha).
                </p>
                <input
                  type="number"
                  value={processingFeePKR}
                  onChange={(e) => setProcessingFeePKR(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              {/* Flat Delivery Fee */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-blue-400" />
                    <span>Standard Delivery Fee (PKR)</span>
                  </label>
                  <span className="font-mono font-black text-blue-300 text-sm">
                    PKR {shippingCostPKR}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Reseller aur customer ke cart me calculate hone wala flat delivery rate.
                </p>
                <input
                  type="number"
                  value={shippingCostPKR}
                  onChange={(e) => setShippingCostPKR(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              {/* Minimum Margin Lock */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Minimum Safe Profit Margin (%)</span>
                  </label>
                  <span className="font-mono font-black text-emerald-300 text-sm">
                    {minProfitMarginPct}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Reseller ka munafa is se kam ho to order block ho jata hai taake loss na ho.
                </p>
                <input
                  type="number"
                  value={minProfitMarginPct}
                  onChange={(e) => setMinProfitMarginPct(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            </div>

            {/* Enforce Loss Lock Toggle */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-xs block">
                  Enforce Profit Guard Protection Lock
                </span>
                <span className="text-[11px] text-slate-400">
                  Reseller ko aese orders book karne se rokta hai jinme delivery charges ya wholesale cost puri na ho rahi ho.
                </span>
              </div>
              <input
                type="checkbox"
                checked={enforceLock}
                onChange={(e) => setEnforceLock(e.target.checked)}
                className="h-5 w-5 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-950/50 transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>Save & Apply Platform Fee Settings</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: CASH FLOW EXPLANATION */}
        {activeTab === 'flow' && (
          <div className="space-y-4 text-xs">
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-indigo-300 space-y-1">
              <h3 className="font-black text-white text-sm flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-indigo-400" />
                <span>Platform Ki Fee Aapke Paas Kaise Aati Hai? (Real Money Flow)</span>
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Pakistan me dropshipping platform ko reseller se alag se paise maangne ki zaroorat nahi hoti. <strong>Tamam COD cash pehle aapke (Platform ke) bank account me aata hai.</strong>
              </p>
            </div>

            {/* 4-Step Visual Flow Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1.5">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 text-blue-400 font-bold mx-auto flex items-center justify-center text-xs">
                  1
                </div>
                <div className="font-bold text-white text-xs">Customer Pays COD</div>
                <p className="text-[10px] text-slate-400">
                  Rider customer ko parcel deta hai aur <strong>PKR 2,000 Cash</strong> collect karta hai.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1.5">
                <div className="h-8 w-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold mx-auto flex items-center justify-center text-xs">
                  2
                </div>
                <div className="font-bold text-white text-xs">Courier Remittance</div>
                <p className="text-[10px] text-slate-400">
                  Trax / PostEx poora cash <strong>Aapke Main Corporate Bank Account</strong> me transfer karti hai.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-3.5 space-y-1.5 ring-1 ring-purple-500/30">
                <div className="h-8 w-8 rounded-full bg-purple-500/30 text-purple-300 font-bold mx-auto flex items-center justify-center text-xs">
                  3
                </div>
                <div className="font-bold text-purple-300 text-xs">Aapka Munafa Kat Gaya!</div>
                <p className="text-[10px] text-purple-200">
                  Aap <strong>2% Fee (Rs. 40) + Rs. 30 Order Fee = Rs. 70</strong> foran apne paas rakh lete hain!
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-3.5 space-y-1.5">
                <div className="h-8 w-8 rounded-full bg-emerald-500/30 text-emerald-300 font-bold mx-auto flex items-center justify-center text-xs">
                  4
                </div>
                <div className="font-bold text-emerald-300 text-xs">Reseller Withdrawal</div>
                <p className="text-[10px] text-slate-400">
                  Reseller bacha hua saaf munafa JazzCash ya Raast se withdraw karta hai.
                </p>
              </div>
            </div>

            {/* Example Breakdown Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
              <span className="font-bold text-white text-xs block">
                Misaal: PKR 2,000 ke aik delivered parcel ka hisab:
              </span>
              <div className="divide-y divide-slate-800/80 font-mono text-xs">
                <div className="py-1.5 flex justify-between">
                  <span className="text-slate-400">Customer Ne Courier Ko Diya (Gross COD):</span>
                  <span className="font-bold text-white">+ PKR 2,000</span>
                </div>
                <div className="py-1.5 flex justify-between text-purple-400 font-bold">
                  <span>Aapki Platform Fee ({platformFeePct}% Commission):</span>
                  <span>- PKR {Math.round(2000 * (platformFeePct / 100))}</span>
                </div>
                <div className="py-1.5 flex justify-between text-amber-400 font-bold">
                  <span>Aapki Order Processing Fee:</span>
                  <span>- PKR {processingFeePKR}</span>
                </div>
                <div className="py-1.5 flex justify-between text-blue-400">
                  <span>Courier Delivery Charges:</span>
                  <span>- PKR {shippingCostPKR}</span>
                </div>
                <div className="py-1.5 flex justify-between text-slate-400">
                  <span>Wholesale Factory Cost:</span>
                  <span>- PKR 1,200</span>
                </div>
                <div className="py-2 flex justify-between text-emerald-400 font-black text-sm bg-emerald-950/30 px-2 rounded-xl mt-1">
                  <span>Reseller Ka Net Payout:</span>
                  <span>PKR {2000 - Math.round(2000 * (platformFeePct / 100)) - processingFeePKR - shippingCostPKR - 1200}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SANDBOX CALCULATOR */}
        {activeTab === 'sandbox' && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Selling Price (PKR):</label>
                <input
                  type="number"
                  value={simSellingPrice}
                  onChange={(e) => setSimSellingPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Wholesale Cost (PKR):</label>
                <input
                  type="number"
                  value={simSupplierCost}
                  onChange={(e) => setSimSupplierCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono font-bold"
                />
              </div>
            </div>

            <div
              className={`rounded-2xl p-4 border ${
                simResult.approved ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-rose-500/50 bg-rose-950/20'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-white text-sm">
                    {simResult.approved ? '✓ Order Approved & Safe' : '⚠️ Order Blocked: Margin Too Low'}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">{simResult.reason}</p>
                </div>
                <span className="font-mono font-black text-base text-emerald-400">
                  Net Profit: PKR {simResult.financials.resellerNetProfitPKR}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Current Platform Revenue: {platformFeePct}% + Rs. {processingFeePKR} per order
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
