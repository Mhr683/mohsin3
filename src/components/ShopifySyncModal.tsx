import React, { useState } from 'react';
import { X, ShoppingBag, ArrowUpRight, Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import { Product, StoreIntegration } from '../types';

interface ShopifySyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  stores: StoreIntegration[];
  onPushProductToStore: (productId: string, storeId: string, markupPrice: number) => void;
  onSimulateIncomingShopifyOrder?: (storeId: string) => void;
}

export const ShopifySyncModal: React.FC<ShopifySyncModalProps> = ({
  isOpen,
  onClose,
  products,
  stores,
  onPushProductToStore,
  onSimulateIncomingShopifyOrder,
}) => {
  const [selectedProdId, setSelectedProdId] = useState<string>(products[0]?.id || '');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || '');
  const [sellingPrice, setSellingPrice] = useState<number>(2999);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProdId) return;
    onPushProductToStore(selectedProdId, selectedStoreId, sellingPrice);
    setSuccessToast('Product pushed to store with auto-inventory sync enabled!');
    setTimeout(() => {
      setSuccessToast(null);
    }, 2500);
  };

  const handleSimulateOrder = () => {
    if (onSimulateIncomingShopifyOrder) {
      onSimulateIncomingShopifyOrder(selectedStoreId);
      setSuccessToast('Simulated incoming customer order from Shopify! Check your Orders tab.');
      setTimeout(() => {
        setSuccessToast(null);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Shopify & WooCommerce Push Engine</h3>
              <p className="text-xs text-slate-400">1-Click product publishing & automated webhook sync</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successToast && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        <form onSubmit={handlePush} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Select Wholesale Product</label>
            <select
              value={selectedProdId}
              onChange={(e) => setSelectedProdId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Wholesale: PKR {p.supplierCostPKR.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Target Store Integration</label>
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.storeName || s.name || s.platform} ({s.platform})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 font-semibold">Your Retail Selling Price (PKR)</label>
            <input
              type="number"
              required
              min={100}
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Publish SKU to External Store</span>
          </button>
        </form>

        <div className="pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleSimulateOrder}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
            <span>Simulate Incoming Customer Order Webhook</span>
          </button>
        </div>
      </div>
    </div>
  );
};
