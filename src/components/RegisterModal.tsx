import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PAKISTAN_BANKS, PAKISTAN_CITIES, PRODUCT_CATEGORIES } from '../data/mockData';

export { PAKISTAN_BANKS, PAKISTAN_CITIES, PRODUCT_CATEGORIES };

interface RegisterModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { isRegisterModalOpen, setIsRegisterModalOpen, currentUser, setCurrentUser } = useApp();
  const show = isOpen !== undefined ? isOpen : isRegisterModalOpen;
  const handleClose = onClose || (() => setIsRegisterModalOpen(false));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState(PAKISTAN_CITIES[0]);
  const [businessName, setBusinessName] = useState('');
  const [role, setRole] = useState<'RESELLER' | 'SUPPLIER'>('RESELLER');
  const [isDone, setIsDone] = useState(false);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name,
        phone,
        city,
        companyName: businessName || `${name} Store`,
        role,
        isRegistered: true,
        isVerified: true,
      });
    }
    setIsDone(true);
    setTimeout(() => {
      setIsDone(false);
      if (onSuccess) onSuccess();
      handleClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isDone ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
            <p className="text-xs text-slate-400">Account verified. Welcome to YourMart Global.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Join YourMart Global</h3>
                <p className="text-xs text-slate-400">Wholesale, Reselling & Automated Dispatch</p>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">WhatsApp / Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="RESELLER">Reseller / Dropshipper</option>
                  <option value="SUPPLIER">Manufacturer / Factory</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Store / Business Brand Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. TrendyTrends PK"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Complete Instant Verification
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
export default RegisterModal;
