import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Printer, Tag } from 'lucide-react';
import { User, WhiteLabelConfig } from '../types';
import { initialWhiteLabelConfig } from '../data/initialData';

interface WhiteLabelBrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveConfig: (config: WhiteLabelConfig) => void;
}

export const WhiteLabelBrandingModal: React.FC<WhiteLabelBrandingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveConfig,
}) => {
  const [storeName, setStoreName] = useState(currentUser.companyName || 'Your Brand Express');
  const [brandTagline, setBrandTagline] = useState('Premium Direct Shopping');
  const [supportPhone, setSupportPhone] = useState(currentUser.phone || '0300-1234567');
  const [returnCity, setReturnCity] = useState(currentUser.city || 'Lahore');
  const [hideSupplierCost, setHideSupplierCost] = useState(true);
  const [hideYourMart, setHideYourMart] = useState(true);
  const [customNote, setCustomNote] = useState('Thank you for shopping with us! 7 Days warranty valid.');
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cfg: WhiteLabelConfig = {
      storeName,
      brandTagline,
      supportPhone,
      returnCity,
      returnHubAddress: `${returnCity} Reseller Hub`,
      hideSupplierCostOnFlyer: hideSupplierCost,
      hideYourMartBranding: hideYourMart,
      customInvoiceNote: customNote,
    };
    onSaveConfig(cfg);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">White-Label Flyer & Thermal Invoice Branding</h3>
              <p className="text-xs text-slate-400">Put your brand logo & phone on the courier slip</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedToast && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>White-label settings saved! All upcoming courier slips will print your brand details.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Your Brand / Store Name (Printed on Flyer)</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Support WhatsApp / Phone</label>
              <input
                type="text"
                required
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Return City</label>
              <input
                type="text"
                value={returnCity}
                onChange={(e) => setReturnCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={hideSupplierCost}
                onChange={(e) => setHideSupplierCost(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>100% Mask Factory Wholesale Cost (Customer only sees your Retail COD Amount)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={hideYourMart}
                onChange={(e) => setHideYourMart(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>Hide platform name (Flyer shows your store as the primary sender)</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Save White-Label Branding
          </button>
        </form>
      </div>
    </div>
  );
};
