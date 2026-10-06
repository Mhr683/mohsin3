import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Percent,
  Truck,
  RotateCcw,
  Building2,
  Lock,
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RotateCcw as ResetIcon,
  Download,
} from 'lucide-react';
import { User } from '../types';

export interface PolicyClause {
  id: string;
  title: string;
  category: 'FEE' | 'COD_SHIPPING' | 'PARTNER' | 'RETURNS' | 'CUSTOM';
  categoryLabel: string;
  content: string;
  urduContent?: string;
  updatedAt: string;
  isCustom?: boolean;
}

const DEFAULT_POLICIES: PolicyClause[] = [
  {
    id: 'pol-1',
    title: '2% Flat Platform Commission & Payout Policy',
    category: 'FEE',
    categoryLabel: '2% Commission Fee',
    content:
      'A flat 2% platform fee is applied strictly on delivered orders (calculated on the final customer selling price). No fee is charged on canceled, returned, or unfulfilled orders. Reseller net earnings are computed transparently after deducting product cost, flat delivery (Rs. 200), processing fee (Rs. 30), and the 2% platform commission.',
    urduContent:
      'تمام کامیاب ڈلیورڈ آرڈرز پر فلیٹ 2 فیصد پلیٹ فارم فیس لاگو ہوتی ہے۔ کینسل یا ریٹرن آرڈرز پر کوئی کمیشن نہیں کاٹا جاتا۔ ری سیلر کا منافع پروڈکٹ لاگت، 200 روپے کوریئر فیس، 30 روپے پروسیسنگ اور 2 فیصد سروس فیس منہا کرنے کے بعد جمعہ کو ادا کیا جاتا ہے۔',
    updatedAt: '2026-09-01',
  },
  {
    id: 'pol-2',
    title: 'Weekly Friday Payout Settlements',
    category: 'FEE',
    categoryLabel: 'Payout Schedule',
    content:
      'All verified reseller COD profits and manufacturer wholesale payments are settled weekly every Friday directly via 1Link IBAN Bank Transfer, JazzCash, or EasyPaisa. Minimum withdrawal threshold is PKR 500.',
    urduContent:
      'تمام ری سیلرز اور مینوفیکچررز کے ہفتہ وار منافع جات ہر جمعہ کو براہ راست 1Link بینک اکاؤنٹ، جاز کیش یا ایزی پیسہ کے ذریعے اکاؤنٹ میں ٹرانسفر کیے جاتے ہیں۔',
    updatedAt: '2026-09-01',
  },
  {
    id: 'pol-3',
    title: 'Cash on Delivery (COD) & Profit Guard Protocol',
    category: 'COD_SHIPPING',
    categoryLabel: 'COD & Courier Safety',
    content:
      'To prevent courier RTO (Return to Origin) losses, all COD orders undergo automated address verification. The Profit Guard feature enforces a minimum PKR 200 net margin per order to safeguard resellers against unexpected shipping surcharges.',
    urduContent:
      'کوریئر پارسل ضائع ہونے سے بچانے کے لیے تمام سی او ڈی آرڈرز کا ایڈریس خودکار طور پر چیک کیا جاتا ہے۔ پرافٹ گارڈ کم از کم 200 روپے نیٹ منافع یقینی بناتا ہے۔',
    updatedAt: '2026-09-01',
  },
  {
    id: 'pol-4',
    title: 'Wholesale Factory & Manufacturer Standards (KYB)',
    category: 'PARTNER',
    categoryLabel: 'Factory Compliance',
    content:
      'Wholesale manufacturers and factory partners must maintain ready physical stock. Orders must be packed in standard waterproof flyers and dispatched within 24 to 48 business hours. Faulty batches result in supplier rating deductions.',
    urduContent:
      'تمام فیکٹریوں اور ہول سیلرز کے پاس فزیکل اسٹاک کا ہونا لازمی ہے۔ آرڈر وصول ہونے کے 24 سے 48 گھنٹوں کے اندر واٹر پروف فلائر میں کوریئر ہینڈ اوور کرنا لازمی ہے۔',
    updatedAt: '2026-09-01',
  },
  {
    id: 'pol-5',
    title: '7-Day Return & Replacement Guarantee',
    category: 'RETURNS',
    categoryLabel: 'Returns & Claims',
    content:
      'End customers have 7 calendar days to report damaged, defective, or incorrect items. Claims submitted with unboxing photographic or video proof are replaced with zero return courier costs charged to the reseller.',
    urduContent:
      'کسٹمر کو خراب یا غلط پروڈکٹ موصول ہونے کی صورت میں 7 دن کے اندر بلا معاوضہ ری پلیسمنٹ دی جاتی ہے۔ ویڈیو ثبوت کے بعد نیا پارسل فورا روانہ کر دیا جاتا ہے۔',
    updatedAt: '2026-09-01',
  },
  {
    id: 'pol-6',
    title: 'Urgent Issue Escalation Protocol (Customer Helpline Desk)',
    category: 'CUSTOM',
    categoryLabel: 'Customer Escalations',
    content:
      'Whenever a customer query involves an emergency (e.g. damaged goods, urgent order cancellations, payment dispute), our support system immediately redirects the case to our senior executive email (support@yourmartglobal.com) and dedicated WhatsApp helpline desk.',
    urduContent:
      'کسی بھی ہنگامی مسئلے (ٹوٹی ہوئی پروڈکٹ، فوری آرڈر منسوخی یا پیمنٹ تصدیق) پر کسٹمر کی رہنمائی فوری طور پر آفیشل ای میل اور واٹس ایپ ہیلپ لائن ڈیسک پر منتقل کر دی جاتی ہے۔',
    updatedAt: '2026-09-01',
  },
];

interface PlatformPoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
}

export const PlatformPoliciesModal: React.FC<PlatformPoliciesModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [policies, setPolicies] = useState<PolicyClause[]>(() => {
    const saved = localStorage.getItem('ym_software_policies');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_POLICIES;
  });

  const [activeTab, setActiveTab] = useState<'VIEW' | 'MANAGE'>('VIEW');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Policy Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'FEE' | 'COD_SHIPPING' | 'PARTNER' | 'RETURNS' | 'CUSTOM'>('CUSTOM');
  const [newContent, setNewContent] = useState('');
  const [newUrduContent, setNewUrduContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('ym_software_policies', JSON.stringify(policies));
  }, [policies]);

  if (!isOpen) return null;

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const categoryLabels: Record<string, string> = {
      FEE: 'Commission & Fees',
      COD_SHIPPING: 'COD & Logistics',
      PARTNER: 'Partner Compliance',
      RETURNS: 'Returns & Replacements',
      CUSTOM: 'Custom Platform Rules',
    };

    if (editingId) {
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title: newTitle.trim(),
                category: newCategory,
                categoryLabel: categoryLabels[newCategory] || 'Custom Rule',
                content: newContent.trim(),
                urduContent: newUrduContent.trim() || undefined,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : p
        )
      );
      setEditingId(null);
    } else {
      const newPolicy: PolicyClause = {
        id: `pol-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        categoryLabel: categoryLabels[newCategory] || 'Custom Rule',
        content: newContent.trim(),
        urduContent: newUrduContent.trim() || undefined,
        updatedAt: new Date().toISOString().split('T')[0],
        isCustom: true,
      };
      setPolicies((prev) => [newPolicy, ...prev]);
    }

    setNewTitle('');
    setNewContent('');
    setNewUrduContent('');
    setNewCategory('CUSTOM');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleStartEdit = (policy: PolicyClause) => {
    setEditingId(policy.id);
    setNewTitle(policy.title);
    setNewCategory(policy.category);
    setNewContent(policy.content);
    setNewUrduContent(policy.urduContent || '');
    setActiveTab('MANAGE');
  };

  const handleDeletePolicy = (id: string) => {
    if (confirm('Kya aap waqai yeh policy clause delete karna chahte hain?')) {
      setPolicies((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset to standard platform policies?')) {
      setPolicies(DEFAULT_POLICIES);
      localStorage.removeItem('ym_software_policies');
    }
  };

  const filteredPolicies = policies.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.urduContent && p.urduContent.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-5 backdrop-blur-md animate-fadeIn">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Platform Policies & Software Usage Rules
                </h3>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  2% Platform Fee Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">
                پالیسیاں، شرائط و ضوابط اور کسٹم رولز منیجر
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Selector & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/90 px-6 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('VIEW')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'VIEW'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Policies Directory ({policies.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('MANAGE')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeTab === 'MANAGE'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{editingId ? 'Edit Clause' : 'Write / Add Policy (+)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white transition"
              title="Reset to default operational guidelines"
            >
              <ResetIcon className="h-3 w-3" />
              <span>Restore Defaults</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {saveSuccess && (
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/70 p-3.5 text-xs font-bold text-emerald-300 shadow">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Software policy clause saved successfully!</span>
            </div>
          )}

          {activeTab === 'VIEW' ? (
            <>
              {/* Category Filter Pills & Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['ALL', 'FEE', 'COD_SHIPPING', 'PARTNER', 'RETURNS', 'CUSTOM'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? 'bg-slate-800 text-white border border-emerald-500/50'
                          : 'bg-slate-950/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat === 'ALL'
                        ? 'All Clauses'
                        : cat === 'FEE'
                        ? '2% Fee & Payouts'
                        : cat === 'COD_SHIPPING'
                        ? 'COD & Delivery'
                        : cat === 'PARTNER'
                        ? 'Factory & Reseller'
                        : cat === 'RETURNS'
                        ? 'Returns'
                        : 'Custom Rules'}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Search policies / تلاش کریں..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-60 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Policy Cards Grid */}
              <div className="space-y-4">
                {filteredPolicies.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-emerald-400 border border-emerald-500/30">
                            {p.categoryLabel}
                          </span>
                          <span className="text-[11px] text-slate-500">Updated: {p.updatedAt}</span>
                          {p.isCustom && (
                            <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-bold text-indigo-300">
                              Custom Rule
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-white">{p.title}</h4>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                          title="Edit this clause"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        {p.isCustom && (
                          <button
                            onClick={() => handleDeletePolicy(p.id)}
                            className="rounded-lg p-1.5 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition"
                            title="Delete custom clause"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{p.content}</p>

                    {p.urduContent && (
                      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-right">
                        <p className="text-xs text-slate-200 font-sans leading-relaxed" dir="rtl">
                          {p.urduContent}
                        </p>
                      </div>
                    )}
                  </div>
                ))}

                {filteredPolicies.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs">
                    Koi policy clause match nahi hui. "Write / Add Policy" par click karke naya rule likhein.
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Write / Manage Policies Form */
            <form onSubmit={handleSavePolicy} className="space-y-4">
              <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                <h4 className="text-xs font-black text-indigo-300 uppercase tracking-wider">
                  {editingId ? 'Edit Existing Policy Clause' : 'Write New Software Policy Clause'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Yahan aap apne dropshipping software ke liye custom rules, commission terms, delivery policies aur guidelines likh kar save kar sakte hain.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Policy Clause Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Reseller Payout Security & 2% Fee"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Policy Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="FEE">2% Fee & Commission Policy</option>
                    <option value="COD_SHIPPING">Cash on Delivery & Shipping</option>
                    <option value="PARTNER">Factory / Reseller Standards</option>
                    <option value="RETURNS">Returns & Replacements</option>
                    <option value="CUSTOM">Custom Operational Rule</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Clause Content (English / Standard Terms) *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe the operational rule, fee breakdown, or requirement in detail..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Urdu / Roman Urdu Description (اردو میں وضاحت - اختیاری)
                </label>
                <textarea
                  rows={3}
                  placeholder="پالیسی کی اردو میں تفصیل لکھیں..."
                  value={newUrduContent}
                  onChange={(e) => setNewUrduContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none text-right"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setNewTitle('');
                      setNewContent('');
                      setNewUrduContent('');
                      setActiveTab('VIEW');
                    }}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingId ? 'Update Policy' : 'Save Policy Clause'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950/80 px-6 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Percent className="h-3.5 w-3.5 text-emerald-400" />
            <span>2% Platform Fee is mathematically enforced across all delivered order settlements.</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
