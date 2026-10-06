import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  ChevronDown,
  Filter,
  CheckCircle2,
  Tag,
  Boxes,
  Truck,
  ArrowRight,
  Headphones,
  FileSpreadsheet,
  LayoutDashboard,
  MessageCircle,
  Bell,
  User as UserIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { Product, PlatformHelplinesConfig } from '../types';

interface PublicProductsCatalogViewProps {
  products: Product[];
  onNavigateHome: () => void;
  onOpenDropshipperRegister: () => void;
  onOpenSupplierRegister: () => void;
  onOpenWhatsNew: () => void;
  onOpenLearningLibrary: () => void;
  onOpenHelpSupport: () => void;
  onExportProductsCSV: () => void;
  onOpenBusinessDashboard: () => void;
  onOpenLogin: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  helplinesConfig?: PlatformHelplinesConfig;
}

export const PublicProductsCatalogView: React.FC<PublicProductsCatalogViewProps> = ({
  products,
  onNavigateHome,
  onOpenDropshipperRegister,
  onOpenSupplierRegister,
  onOpenWhatsNew,
  onOpenLearningLibrary,
  onOpenHelpSupport,
  onExportProductsCSV,
  onOpenBusinessDashboard,
  onOpenLogin,
  cartCount,
  onOpenCart,
  onAddToCart,
  onBuyNow,
  helplinesConfig,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(true);

  const officialWhatsApp = helplinesConfig?.buyersHelpline?.whatsapp || '+92 300 1122334';

  const categories = [
    'All Categories',
    'Airpods & Headsets',
    'Apparel & Clothing',
    'Bags & Handbags',
    'Fashion Accessories',
    'Home, Kitchen & Lifestyle',
    'Kids & Gaming',
    'Perfume & Fragrance',
    'Personal Care & Beauty',
    'Smart Gadgets',
    'Smart Watches',
    'Undergarments',
    'Video Lighting & Content Studio',
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (selectedCategory !== 'All Categories') {
          if (!p.category.toLowerCase().includes(selectedCategory.toLowerCase().slice(0, 5))) {
            return false;
          }
        }
        if (p.recSellingPricePKR > maxPrice) return false;
        if (onlyInStock && p.stock <= 0) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.recSellingPricePKR - b.recSellingPricePKR;
        if (sortBy === 'price-high') return b.recSellingPricePKR - a.recSellingPricePKR;
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        return 0;
      });
  }, [products, selectedCategory, maxPrice, onlyInStock, searchQuery, sortBy]);

  return (
    <div id="public-products-catalog" className="min-h-screen flex flex-col bg-[#f5f6f8] text-slate-800 font-sans">
      {/* 1. TOP ANNOUNCEMENT STRIP */}
      <div className="bg-[#16325c] text-white px-4 sm:px-8 py-2 text-xs font-medium border-b border-[#214374] select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="font-extrabold tracking-wider uppercase flex items-center gap-2 text-xs sm:text-[13px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PAKISTAN'S SMARTEST DROPSHIPPING PLATFORM</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <button onClick={onOpenHelpSupport} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-semibold">
              <Headphones className="w-3.5 h-3.5 text-amber-300" />
              <span>Contact Us</span>
            </button>
            <button onClick={onOpenCart} className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-semibold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Cart ({cartCount})</span>
            </button>
            <button onClick={onOpenLogin} className="hover:text-amber-300 transition cursor-pointer font-bold">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="bg-[#16325c] text-white px-4 sm:px-8 py-4 border-b border-[#214374]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={onNavigateHome}>
            <div className="w-12 h-12 rounded-full border-2 border-white/90 flex items-center justify-center bg-gradient-to-br from-sky-600 to-indigo-800 shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight leading-none text-white">YOURMART</div>
              <div className="text-[10px] tracking-wider text-slate-300 font-bold uppercase mt-1">
                PAKISTAN'S SMARTEST DROPSHIPPING PLATFORM
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <div className="flex items-center bg-white rounded-full p-1 pl-4 shadow-sm text-slate-800">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, SKU or category..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none pr-2"
              />
              <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#16325c] hover:bg-sky-800 text-white flex items-center justify-center shrink-0 transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <a
              href={`https://wa.me/${officialWhatsApp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-left group hover:opacity-95 transition"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                <MessageCircle className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-300 tracking-wider">WHATSAPP</span>
                <span className="text-sm font-extrabold text-white tracking-tight">{officialWhatsApp}</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION BAR */}
      <nav className="w-full bg-white border-b border-slate-200 shadow-xs select-none sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs font-bold text-slate-700 tracking-wide">
            <button onClick={onNavigateHome} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              HOME
            </button>
            <button className="text-sky-700 uppercase transition cursor-pointer py-1 border-b-2 border-sky-600 font-black">
              PRODUCTS
            </button>
            <button onClick={onOpenDropshipperRegister} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              DROPSHIPPER REGISTRATION
            </button>
            <button onClick={onOpenSupplierRegister} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              SUPPLIER REGISTRATION
            </button>
            <button onClick={onOpenWhatsNew} className="hover:opacity-90 uppercase transition cursor-pointer py-1 flex items-center gap-1">
              <span>WHAT'S</span>
              <span className="text-amber-700 font-black bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300">
                NEW
              </span>
            </button>
            <button onClick={onOpenLearningLibrary} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              LEARNING LIBRARY
            </button>
            <button onClick={onOpenHelpSupport} className="hover:text-sky-700 uppercase transition cursor-pointer py-1">
              HELP & SUPPORT
            </button>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onExportProductsCSV}
              className="bg-[#16325c] hover:bg-[#122748] text-white font-bold text-xs px-3.5 py-2 rounded-lg tracking-wider flex items-center gap-1.5 uppercase transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT PRODUCTS CSV</span>
            </button>
            <button
              onClick={onOpenBusinessDashboard}
              className="bg-[#16325c] hover:bg-sky-800 text-white font-black text-xs px-4 py-2 rounded-lg tracking-wider uppercase transition shadow-sm cursor-pointer flex items-center gap-1.5 border border-sky-700"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span>BUSINESS DASHBOARD</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 4. CATALOG MAIN LAYOUT: SIDEBAR + PRODUCT GRID (Exact from video 1:40) */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sidebar Filters (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Box */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-[#16325c] text-white px-5 py-3.5 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                <Boxes className="w-4 h-4 text-emerald-400" />
                <span>CATEGORIES</span>
              </div>
              <div className="p-3 space-y-1 text-xs font-semibold text-slate-700">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition cursor-pointer flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-sky-50 text-sky-800 font-extrabold'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Price */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="font-black text-xs uppercase tracking-wider text-slate-900 flex items-center justify-between">
                <span>FILTER BY PRICE</span>
                <span className="text-sky-700 font-mono">Up to PKR {maxPrice}</span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Min: PKR 200</span>
                <span>Max: PKR 5,000</span>
              </div>
            </div>

            {/* Stock Availability Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="font-black text-xs uppercase tracking-wider text-slate-900">
                AVAILABILITY
              </div>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Right Column: Products Grid (9 Cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-black text-slate-900">
                  {selectedCategory === 'All Categories' ? 'All Wholesale Products' : selectedCategory}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredProducts.length} verified products ready for dropshipping
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="text-xs font-bold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 focus:outline-none"
                >
                  <option value="default">Default sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-lg hover:border-sky-300 transition group"
                >
                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3 relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-[#16325c] text-white text-[9px] font-bold px-2 py-0.5 rounded">
                        {p.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block truncate">
                      {p.category}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                      {p.name}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-1">
                      Item #: {p.sku}
                    </div>

                    <div className="mt-3 text-xs space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <div className="font-bold text-slate-800 font-mono">
                        Price: PKR {p.recSellingPricePKR}
                      </div>
                      <div className="font-black text-sky-700 font-mono">
                        Bulk Price: PKR {p.supplierCostPKR}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 pt-4">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="w-full py-2 rounded-xl bg-[#16325c] hover:bg-sky-800 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      ADD TO CART
                    </button>
                    <button
                      onClick={() => onBuyNow(p)}
                      className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#16325c] text-white border-t border-[#214374] py-8 px-4 sm:px-8 mt-12 text-center text-xs">
        <p>© {new Date().getFullYear()} YourMart Pakistan. Wholesale catalog updated hourly.</p>
      </footer>
    </div>
  );
};
