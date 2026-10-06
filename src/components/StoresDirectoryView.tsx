import React, { useState } from 'react';
import { Store, Product } from '../types';
import {
  Building2,
  MapPin,
  Star,
  CheckCircle2,
  Package,
  Search,
  ArrowRight,
  Truck,
  Phone,
  MessageCircle,
} from 'lucide-react';

interface StoresDirectoryViewProps {
  stores: Store[];
  products: Product[];
  onSelectStore: (store: Store) => void;
  onExploreProducts?: (store: Store) => void;
  onOpenVerifiedRegistration?: () => void;
}

export const StoresDirectoryView: React.FC<StoresDirectoryViewProps> = ({
  stores,
  products,
  onSelectStore,
  onExploreProducts,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const cities = ['All', ...Array.from(new Set(stores.map((s) => s.city)))];

  const filtered = stores.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase())) ||
      (s.ownerName && s.ownerName.toLowerCase().includes(search.toLowerCase()));
    const matchesCity = selectedCity === 'All' || s.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Verified Wholesale Stores & Factories Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Direct Pakistani Manufacturers & Importers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Connect directly with verified wholesale warehouses in Lahore, Karachi, Gujranwala and Faisalabad. Stock items for your dropshipping store with zero inventory risk.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search stores by factory name, category or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedCity === city
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((store) => {
          const storeProducts = products.filter(
            (p) => p.storeId === store.id || p.supplierId === store.ownerId
          );

          return (
            <div
              key={store.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Store Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base truncate">
                        {store.name}
                      </h3>
                      {store.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {store.city}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {store.rating}
                      </span>
                      <span>•</span>
                      <span className="text-slate-600">{store.totalOrders.toLocaleString()} Orders</span>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {store.category || 'General Wholesale'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                {store.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {store.description}
                  </p>
                )}

                {/* Delivery & Performance Badge */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[11px]">{store.deliveryRating}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Response: {store.responseRate || '98%'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectStore(store)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View Storefront ({storeProducts.length || '30+'} Items)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {store.whatsapp && (
                  <a
                    href={`https://wa.me/92${store.whatsapp.replace(/[^0-9]/g, '').slice(-10)}?text=Assalam-o-Alaikum! Saw your store on YourMart Global.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                    title="Direct WhatsApp Contact"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
