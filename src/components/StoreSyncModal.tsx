import React from 'react';
import { X, RefreshCw, CheckCircle, Power, ExternalLink, Store as StoreIcon } from 'lucide-react';
import { StoreIntegration } from '../types';

interface StoreSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreIntegration[];
  onToggleStoreConnection: (id: string) => void;
  onSyncNow: (id: string) => void;
}

export const StoreSyncModal: React.FC<StoreSyncModalProps> = ({
  isOpen,
  onClose,
  stores,
  onToggleStoreConnection,
  onSyncNow,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/20">
              <StoreIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Multi-Store Channels & Auto-Sync</h3>
              <p className="text-xs text-slate-400">Sync products, inventory & orders with Shopify, Daraz & WooCommerce</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {stores.map((store) => (
            <div
              key={store.id}
              className={`p-4 rounded-2xl border transition ${
                store.connected
                  ? 'bg-slate-950/60 border-purple-500/30'
                  : 'bg-slate-950/30 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {store.platform}
                    </span>
                    <h4 className="font-bold text-white text-sm">{store.storeName || store.name || store.platform}</h4>
                  </div>
                  {store.url && (
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-purple-400 flex items-center gap-1 transition"
                    >
                      <span>{store.url}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Last Synced: <strong className="text-slate-300">{store.lastSync || 'Never'}</strong> • Active Products: <strong className="text-emerald-400">{store.activeProductsCount || store.syncedProductsCount || 0}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSyncNow(store.id)}
                    disabled={!store.connected}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                    <span>Sync Now</span>
                  </button>

                  <button
                    onClick={() => onToggleStoreConnection(store.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      store.connected
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{store.connected ? 'Disconnect' : 'Connect'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
