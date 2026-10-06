import React, { useState } from 'react';
import { X, ShieldAlert, UserCheck, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { User } from '../types';

interface RegistrationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers?: User[];
  existingUsers?: User[];
  onSelectRegisteredUser?: (user: User) => void;
  onSelectExistingUser?: (user: User) => void;
  onRegistrationSuccess?: (user: User) => void;
  onRegisterSuccess?: (user: User) => void;
  onOpenFullVerifiedRegistration?: () => void;
  pendingOrderSummary?: {
    productName?: string;
    totalAmountPKR?: number;
    itemsCount?: number;
  };
}

export const RegistrationRequiredModal: React.FC<RegistrationRequiredModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers = [],
  existingUsers = [],
  onSelectRegisteredUser,
  onSelectExistingUser,
  onRegistrationSuccess,
  onRegisterSuccess,
  onOpenFullVerifiedRegistration,
  pendingOrderSummary,
}) => {
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickCity, setQuickCity] = useState('Lahore');

  if (!isOpen) return null;

  const usersList = allUsers.length > 0 ? allUsers : existingUsers;
  const selectCallback = onSelectRegisteredUser || onSelectExistingUser || onRegistrationSuccess || onRegisterSuccess;

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) return;

    const newUser: User = {
      ...currentUser,
      id: `usr_quick_${Date.now()}`,
      name: quickName,
      phone: quickPhone,
      city: quickCity,
      companyName: `${quickName} Stores`,
      role: 'RESELLER',
      isRegistered: true,
      isVerified: true,
    };

    if (selectCallback) selectCallback(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reseller Verification Required</h3>
              <p className="text-xs text-slate-400">Attach order to your verified reseller profile</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {pendingOrderSummary && (
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">Pending Customer COD Order:</span>
              <strong className="text-white truncate block max-w-xs">{pendingOrderSummary.productName}</strong>
            </div>
            <span className="font-mono font-black text-emerald-400 text-sm">
              PKR {pendingOrderSummary.totalAmountPKR?.toLocaleString()}
            </span>
          </div>
        )}

        {/* Existing Accounts Switch */}
        {usersList.filter((u) => u.isRegistered).length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Continue as existing verified profile:</span>
            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
              {usersList
                .filter((u) => u.isRegistered)
                .map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      if (selectCallback) selectCallback(u);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left flex items-center justify-between transition cursor-pointer"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{u.name}</h4>
                      <p className="text-[10px] text-slate-400">{u.companyName} • {u.city} ({u.role})</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Or Quick 10-Second Registration */}
        <form onSubmit={handleQuickRegister} className="border-t border-slate-800 pt-4 space-y-3 text-xs">
          <span className="font-bold text-slate-300 block">Or register new profile in 10 seconds:</span>
          <div>
            <label className="text-slate-400 block mb-1">Your Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Asad Ali"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 block mb-1">WhatsApp Phone</label>
              <input
                type="tel"
                required
                placeholder="0300-1234567"
                value={quickPhone}
                onChange={(e) => setQuickPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">City</label>
              <input
                type="text"
                value={quickCity}
                onChange={(e) => setQuickCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition cursor-pointer"
          >
            Confirm & Dispatch Parcel
          </button>
        </form>

        {onOpenFullVerifiedRegistration && (
          <button
            type="button"
            onClick={onOpenFullVerifiedRegistration}
            className="w-full text-center text-[11px] text-purple-400 hover:text-purple-300 underline font-semibold transition"
          >
            Switch to Full Verified CNIC/NTN Supplier & Manufacturer Onboarding →
          </button>
        )}
      </div>
    </div>
  );
};
