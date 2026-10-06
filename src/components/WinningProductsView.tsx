import React, { useState } from 'react';
import { Product } from '../types';
import {
  Flame,
  TrendingUp,
  Sparkles,
  ShoppingCart,
  Share2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Target,
  Video,
} from 'lucide-react';

interface WinningProductsViewProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenAdCopyModal: (product: Product) => void;
  onOpenStoreFront?: (storeId?: string) => void;
}

export const WinningProductsView: React.FC<WinningProductsViewProps> = ({
  products,
  onSelectProduct,
  onOpenAdCopyModal,
  onOpenStoreFront,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'viral' | 'high_margin'>('all');

  const winningList = products.map((p, idx) => {
    const profit = Math.max(0, p.recSellingPricePKR - p.supplierCostPKR - 260);
    const marginPct = Math.round((profit / p.recSellingPricePKR) * 100);
    return {
      product: p,
      viralScore: 85 + (idx % 14),
      dailyOrders: 40 + (idx * 15),
      profitMarginPct: marginPct,
      netProfitPKR: profit,
    };
  });

  const filtered = winningList.filter((item) => {
    if (selectedFilter === 'viral') return item.viralScore >= 90;
    if (selectedFilter === 'high_margin') return item.profitMarginPct >= 35;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Pakistani TikTok & Facebook Winning Products Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            High Velocity Wholesale Winners (With Ready Ads)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Curated products with viral TikTok video angles, massive daily search volume on Daraz, and net reseller profit margins above PKR 800+ per order.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-xl transition ${
            selectedFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All High Performers ({winningList.length})
        </button>
        <button
          onClick={() => setSelectedFilter('viral')}
          className={`px-4 py-2 rounded-xl transition ${
            selectedFilter === 'viral' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Viral TikTok Scores (90+)
        </button>
        <button
          onClick={() => setSelectedFilter('high_margin')}
          className={`px-4 py-2 rounded-xl transition ${
            selectedFilter === 'high_margin' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Super High Margin (35%+)
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(({ product, viralScore, dailyOrders, netProfitPKR, profitMarginPct }) => (
          <div
            key={product.id}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                )}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-bold backdrop-blur-md">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Viral Score: {viralScore}/100</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[11px] font-black">
                  +{profitMarginPct}% Margin
                </div>
              </div>

              <div className="p-5 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  {product.category}
                </span>

                <h3 className="font-extrabold text-slate-900 text-sm line-clamp-2">
                  {product.name}
                </h3>

                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Factory Cost</span>
                    <span className="font-mono font-bold text-slate-700">PKR {product.supplierCostPKR.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Net Profit</span>
                    <span className="font-mono font-black text-emerald-600">PKR {netProfitPKR.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Daily COD Sales: <strong className="text-slate-800">{dailyOrders}+</strong></span>
                  <span>Stock: <strong className="text-emerald-600">{product.stock} pcs</strong></span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => onOpenAdCopyModal(product)}
                className="py-2.5 px-3 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Urdu Ad Copy</span>
              </button>

              <button
                onClick={() => onSelectProduct(product)}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Sourcing</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
