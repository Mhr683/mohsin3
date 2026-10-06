import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Video,
  FileText,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  CheckCircle2,
  Search,
  X,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  Truck,
  Banknote,
} from 'lucide-react';

export interface KnowledgeArticle {
  id: string;
  title: string;
  titleUrdu: string;
  category: 'STARTING' | 'SHOPIFY' | 'COD_OPTIMIZATION' | 'MARKETING' | 'PAYOUTS';
  readTime: string;
  excerpt: string;
  excerptUrdu: string;
  steps: string[];
  proTip: string;
}

const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'g-1',
    title: 'How to Scale to 50+ COD Orders/Day in Pakistan Without Holding Inventory',
    titleUrdu: 'بغیر اسٹاک رکھے روزانہ 50+ آرڈرز تک پہنچنے کا مکمل طریقہ',
    category: 'STARTING',
    readTime: '4 min read',
    excerpt:
      'Learn the exact playbook used by top Karachi, Lahore & Islamabad e-commerce brands to source from verified wholesalers and automate dispatch.',
    excerptUrdu:
      'کراچی، لاہور اور اسلام آباد کے کامیاب ری سیلرز کی طرح تصدیق شدہ ہول سیلرز سے مصنوعات منتخب کریں اور خودکار ڈسپیچ کے ذریعے کاروبار بڑھائیں۔',
    steps: [
      'Register your verified Reseller Account and set your JazzCash, EasyPaisa, or IBAN payout bank details.',
      'Browse the Products Catalog or Winning Products tab and check the wholesale rate and Profit Guard floor.',
      'Download clean product images and copy the ready-made Urdu/English ad scripts for TikTok, Facebook, or WhatsApp.',
      'Book customer orders in single or multi-product bundles; YourMart dispatches directly with your store brand name on the thermal slip.',
    ],
    proTip:
      'Focus on 2–3 high-margin problem-solving products first before expanding into general catalog items.',
  },
  {
    id: 'g-2',
    title: 'Slashing Courier Return Rates (RTO) from 25% Down to Under 5% Using WhatsApp & Fraud Shield',
    titleUrdu: 'واٹس ایپ تصدیق اور فراڈ شیلڈ سے پارسل ریٹرن (RTO) کو 5% سے کم کریں',
    category: 'COD_OPTIMIZATION',
    readTime: '6 min read',
    excerpt:
      'How automated WhatsApp confirmation, AI Dispatch bot replies, and National Fraud Blacklist checks prevent fake orders and uncontactable consignees.',
    excerptUrdu:
      'آٹومیٹک واٹس ایپ تصدیق اور نیشنل فراڈ بلیک لسٹ کے ذریعے جعلی آرڈرز اور ریٹرن نقصان سے مکمل تحفظ حاصل کریں۔',
    steps: [
      'Screen every customer phone number against the National COD Fraud Blacklist before booking.',
      'Trigger the 1-Click WhatsApp Order Confirmation message from the Orders & Dispatch hub.',
      'Require Rs. 250–300 Advance Delivery Charges via JazzCash/EasyPaisa for flagged or remote-area buyers.',
      'Ensure landmarks (Famous Masjid, School, Market) are included in the street address before printing the courier label.',
    ],
    proTip:
      'Orders with a verified famous landmark in the address have a 34% higher first-attempt delivery rate across TCS, Leopards, and PostEx.',
  },
  {
    id: 'g-3',
    title: 'Connecting Shopify, WooCommerce & Daraz via 1-Click Store Sync & CSV Exporter',
    titleUrdu: 'شاپ فائی، وو کامرس اور دراز اسٹور کو یکجا کرنے کا طریقہ',
    category: 'SHOPIFY',
    readTime: '3 min read',
    excerpt:
      'Step-by-step guide to integrate Shopify/WooCommerce webhooks or export Shopify-ready CSV catalogs so inventory updates in real time.',
    excerptUrdu:
      'اپنے آن لائن اسٹور کو منسلک کریں یا ایک کلک پر شاپ فائی CSV فائل ڈاؤن لوڈ کر کے سینکڑوں مصنوعات اپلوڈ کریں۔',
    steps: [
      'Open Store Sync or click Export Shopify CSV inside the Products Hub.',
      'Import the CSV directly into your Shopify Admin > Products > Import.',
      'When an order arrives on your store, push it to YourMart for automated warehouse packing and courier booking.',
      'White-label thermal labels automatically print your custom store name and logo.',
    ],
    proTip:
      'Enable Auto-Delist in Store Sync so out-of-stock wholesale items pause automatically on your storefront.',
  },
  {
    id: 'g-4',
    title: 'Understanding Profit Guard, 2% Platform Fee & Rapid T+1 Payout Settlement in PKR',
    titleUrdu: 'پرافٹ گارڈ، 2 فیصد پلیٹ فارم فیس اور فوری بینک پے آؤٹ کی تفصیلات',
    category: 'PAYOUTS',
    readTime: '3 min read',
    excerpt:
      'Transparent breakdown of wholesale base rates, courier charges, RTO shield, and automated JazzCash/EasyPaisa/Bank transfers.',
    excerptUrdu:
      'ہول سیل قیمت، کوریئر چارجز اور آپ کے خالص منافع کا شفاف حساب کتاب اور تیز ترین پے آؤٹ سسٹم۔',
    steps: [
      'Net Profit = Customer COD Collectable − (Supplier Wholesale Price + Courier Fee + Packaging + RTO Shield + 2% Platform Fee).',
      'Profit Guard automatically warns and blocks underpriced listings that would result in a loss.',
      'Once the courier marks the parcel DELIVERED, your net margin moves from Pending COD to Available Balance.',
      'Request instant withdrawal to JazzCash, EasyPaisa, Raast, or any Pakistani Bank IBAN.',
    ],
    proTip:
      'Use Multi-Product Cart bundling to ship 2+ items in a single parcel and save Rs. 200+ on duplicate courier charges.',
  },
  {
    id: 'g-5',
    title: 'TikTok, Facebook Reels & WhatsApp Status Viral Marketing Playbook for Pakistan',
    titleUrdu: 'ٹک ٹاک، فیس بک ریلز اور واٹس ایپ اسٹیٹس سے مفت اور پیڈ آرڈرز حاصل کریں',
    category: 'MARKETING',
    readTime: '5 min read',
    excerpt:
      'High-converting Urdu and Roman Urdu ad hooks, pricing psychology (Rs. 1,999 vs Rs. 2,000), and WhatsApp closing scripts.',
    excerptUrdu:
      'پاکستانی خریداروں کی نفسیات کے مطابق اردو اور رومن اردو اشتہاری اسکرپٹس اور واٹس ایپ سیلز ٹپس۔',
    steps: [
      'Open the Winning Products & Ads tab inside Products to view products with low ad saturation and high margin.',
      'Use the Ad Copy Generator to copy ready-made Urdu/English scripts for Facebook and TikTok.',
      'Price products at psychological endings like Rs. 1,499 or Rs. 2,490 with "Free Home Delivery" built into your margin.',
      'Reply to WhatsApp inquiries within 2 minutes or enable the AI Dispatch Auto-Reply Engine.',
    ],
    proTip:
      'Video ads showing a 3-second real unboxing demonstration convert 2.8x better than static catalog images.',
  },
];

interface KnowledgeCenterViewProps {
  onBack?: () => void;
  isModal?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export const KnowledgeCenterView: React.FC<KnowledgeCenterViewProps> = ({
  onBack,
  isModal = false,
  isOpen = true,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    'ALL' | 'STARTING' | 'SHOPIFY' | 'COD_OPTIMIZATION' | 'MARKETING' | 'PAYOUTS'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('g-1');

  if (isModal && !isOpen) return null;

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.titleUrdu.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const innerContent = (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Seller Academy & Free Learning Library
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Knowledge Center & Dropshipping Playbooks (اردو / English)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete operational SOPs, COD return reduction, Profit Guard mastery, and viral marketing guides for Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          )}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'All Playbooks' },
            { id: 'STARTING', label: 'Getting Started' },
            { id: 'COD_OPTIMIZATION', label: 'COD & RTO Shield' },
            { id: 'MARKETING', label: 'TikTok & FB Ads' },
            { id: 'SHOPIFY', label: 'Store Sync & CSV' },
            { id: 'PAYOUTS', label: 'Profit & Payouts' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (Urdu/English)..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((art) => {
          const isExpanded = expandedId === art.id;
          return (
            <div
              key={art.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : art.id)}
                className="cursor-pointer space-y-2"
              >
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {art.category.replace('_', ' ')}
                  </span>
                  <span className="text-slate-500 text-[11px] font-mono">{art.readTime}</span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-white text-base leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs font-bold text-emerald-300" dir="rtl">
                      {art.titleUrdu}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-lg bg-slate-800 p-1.5 text-slate-300 hover:text-white shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{art.excerpt}</p>
                <p className="text-xs text-slate-300 leading-relaxed text-right" dir="rtl">
                  {art.excerptUrdu}
                </p>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
                      Step-by-Step Action Plan:
                    </h5>
                    <ul className="space-y-2">
                      {art.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-xs text-amber-200">
                    <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Pro Seller Tip: </span>
                      {art.proTip}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md animate-fadeIn">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
          {innerContent}
        </div>
      </div>
    );
  }

  return innerContent;
};
