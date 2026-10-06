import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageCircle,
  Bell,
  User as UserIcon,
  Headphones,
  FileSpreadsheet,
  LayoutDashboard,
  CheckCircle2,
  Truck,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  RotateCcw,
  Check,
  ExternalLink,
  Award,
  BookOpen,
  Facebook,
  Instagram,
  Youtube,
  Send,
  QrCode,
  Star,
  Info,
} from 'lucide-react';
import { Product, PlatformHelplinesConfig } from '../types';

interface PublicHomeViewProps {
  products: Product[];
  onNavigateProducts: () => void;
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

export const PublicHomeView: React.FC<PublicHomeViewProps> = ({
  products,
  onNavigateProducts,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  const officialWhatsApp = helplinesConfig?.buyersHelpline?.whatsapp || '+92 300 1122334';
  const officialPhone = helplinesConfig?.resellersHelpline?.phone || '+92 321 4455667';
  const officialEmail = helplinesConfig?.resellersHelpline?.email || 'support@yourmart.pk';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateProducts();
  };

  // Real Curated Products matching the video sections
  const newArrivalProducts: Product[] = [
    {
      id: 'prod-na-1',
      sku: 'Pe-92-00-00-925',
      name: 'Teashell 5% Niacinamide Serum (Deep Hydration)',
      category: 'Personal Care & Beauty',
      supplierId: 'sup-1',
      supplierName: 'Teashell Beauty Labs',
      supplierCostPKR: 250,
      recSellingPricePKR: 290,
      stock: 350,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesPotentialScore: 98,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Advanced pore-refining facial serum for glowing skin.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-na-2',
      sku: 'Sm-92-00-00-924',
      name: '5-in-1 Precision Screwdriver Set Repair Kit',
      category: 'Smart Gadgets',
      supplierId: 'sup-2',
      supplierName: 'Tech Tools Hub',
      supplierCostPKR: 300,
      recSellingPricePKR: 340,
      stock: 180,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 94,
      fastShipping: true,
      estDeliveryDays: 1,
      estShippingCostPKR: 200,
      description: 'Magnetic precision screwdriver set for mobile and electronics repair.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-na-3',
      sku: 'Pe-92-00-00-923',
      name: '4-in-1 Electric Lady Shaver & Trimmer',
      category: 'Personal Care & Beauty',
      supplierId: 'sup-1',
      supplierName: 'Karachi Wholesale Mall',
      supplierCostPKR: 1000,
      recSellingPricePKR: 1090,
      stock: 90,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      rating: 4.7,
      salesPotentialScore: 91,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Waterproof electric shaver for painless hair removal.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-na-4',
      sku: 'Sm-92-00-00-922',
      name: 'Small Vase-Shaped LED Humidifier & Diffuser',
      category: 'Smart Gadgets',
      supplierId: 'sup-4',
      supplierName: 'Home Essentials Lahore',
      supplierCostPKR: 750,
      recSellingPricePKR: 790,
      stock: 210,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 95,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Wood grain ultrasonic aromatherapy mist humidifier.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-na-5',
      sku: 'Ho-92-00-00-921',
      name: 'Waist Trimmer Belt for Fitness & Posture',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-3',
      supplierName: 'Faisalabad Direct Mill',
      supplierCostPKR: 450,
      recSellingPricePKR: 490,
      stock: 140,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80',
      rating: 4.6,
      salesPotentialScore: 89,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Sweat waist trainer belt for men and women.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-na-6',
      sku: 'Pe-91-00-00-919',
      name: 'Zafrani Skin Brightening & Moisturizing Cream',
      category: 'Personal Care & Beauty',
      supplierId: 'sup-1',
      supplierName: 'Teashell Beauty Labs',
      supplierCostPKR: 450,
      recSellingPricePKR: 490,
      stock: 310,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesPotentialScore: 97,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Natural saffron glow cream for spotless radiance.',
      status: 'IN_STOCK',
    },
  ];

  const restockedProducts: Product[] = [
    {
      id: 'prod-rs-1',
      sku: 'Sm-47-00-00-471',
      name: '40pcs Aiwa Socket Wrench Multi-Purpose Tool Kit',
      category: 'Smart Gadgets',
      supplierId: 'sup-2',
      supplierName: 'Pak Logistics Lahore',
      supplierCostPKR: 900,
      recSellingPricePKR: 940,
      stock: 85,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 92,
      fastShipping: true,
      estDeliveryDays: 1,
      estShippingCostPKR: 220,
      description: 'Heavy duty motorcycle and car ratchet socket set.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-rs-2',
      sku: 'Ho-28-00-00-289',
      name: 'Colorful USB Rechargeable Personal Cooling Fan',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-4',
      supplierName: 'Home Essentials',
      supplierCostPKR: 1460,
      recSellingPricePKR: 1500,
      stock: 120,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80',
      rating: 4.7,
      salesPotentialScore: 90,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 220,
      description: 'Silent motor USB rechargeable desktop cooling fan.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-rs-3',
      sku: 'Sm-28-00-00-282',
      name: 'Arctic Air Freedom Hands-free Cooling Neck Fan',
      category: 'Smart Gadgets',
      supplierId: 'sup-2',
      supplierName: 'Tech Imports',
      supplierCostPKR: 840,
      recSellingPricePKR: 880,
      stock: 160,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 93,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Bladeless portable neck fan with 3 speed levels.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-rs-4',
      sku: 'Pe-23-00-12-235',
      name: 'Digital Period Heating Smart Relief Belt',
      category: 'Personal Care & Beauty',
      supplierId: 'sup-1',
      supplierName: 'Health First PK',
      supplierCostPKR: 950,
      recSellingPricePKR: 1000,
      stock: 75,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesPotentialScore: 96,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Vibrating massage warm palace heating belt with digital display.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-rs-5',
      sku: 'Pe-94-00-00-941',
      name: 'T9 Vintage Professional Hair & Beard Trimmer',
      category: 'Personal Care & Beauty',
      supplierId: 'sup-1',
      supplierName: 'Oshi Wholesale Logistics',
      supplierCostPKR: 485,
      recSellingPricePKR: 515,
      stock: 240,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesPotentialScore: 99,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Gold metal zero-gapped professional hair styling trimmer.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-rs-6',
      sku: 'Ho-29-00-12-291',
      name: 'Portable 6-Blade USB Rechargeable Juicer Blender',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-4',
      supplierName: 'Oshi Wholesale',
      supplierCostPKR: 920,
      recSellingPricePKR: 1000,
      stock: 195,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 95,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 220,
      description: '380ml portable smoothie bottle juicer with stainless steel blades.',
      status: 'IN_STOCK',
    },
  ];

  const summerProducts: Product[] = [
    {
      id: 'prod-sm-1',
      sku: 'Ho-87-00-00-872',
      name: 'Desktop Circular Rechargeable Fan QL-01',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-4',
      supplierName: 'Summer Breeze Imports',
      supplierCostPKR: 1000,
      recSellingPricePKR: 1050,
      stock: 60,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80',
      rating: 4.7,
      salesPotentialScore: 91,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 220,
      description: 'Compact high airflow circular cooling fan with USB charging.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-sm-2',
      sku: 'Ho-82-00-00-828',
      name: 'Rechargeable 3-in-1 Clip & Desk Fan',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-4',
      supplierName: 'Summer Breeze Imports',
      supplierCostPKR: 1350,
      recSellingPricePKR: 1400,
      stock: 70,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 94,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 220,
      description: '360 degree rotatable baby stroller and office desk clip fan.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-sm-3',
      sku: 'Ho-82-00-00-827',
      name: 'Oscillating Desktop Circular Fan FT-905',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-4',
      supplierName: 'Pak Logistics Lahore',
      supplierCostPKR: 3600,
      recSellingPricePKR: 3900,
      stock: 45,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80',
      rating: 4.9,
      salesPotentialScore: 96,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 250,
      description: 'High power oscillating room air circulator.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-sm-4',
      sku: 'Sm-82-00-00-822',
      name: 'Turbofan Rechargeable Handheld USB Turbo Fan',
      category: 'Smart Gadgets',
      supplierId: 'sup-2',
      supplierName: 'Tech Imports',
      supplierCostPKR: 745,
      recSellingPricePKR: 775,
      stock: 110,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 93,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Pocket pocket handheld hurricane speed turbo cooling fan.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-sm-5',
      sku: 'Ho-82-00-00-820',
      name: 'Luxury Outdoor AC Unit Waterproof Dust Cover',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-3',
      supplierName: 'Faisalabad Textile Hub',
      supplierCostPKR: 210,
      recSellingPricePKR: 250,
      stock: 150,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&auto=format&fit=crop&q=80',
      rating: 4.7,
      salesPotentialScore: 89,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'Heavy duty sun and rain shield protection cover for air conditioner.',
      status: 'IN_STOCK',
    },
    {
      id: 'prod-sm-6',
      sku: 'Ho-80-00-00-807',
      name: 'Kids Water Bottle 650ml with Straw & Cute Strap',
      category: 'Home, Kitchen & Lifestyle',
      supplierId: 'sup-4',
      supplierName: 'Home Essentials',
      supplierCostPKR: 245,
      recSellingPricePKR: 275,
      stock: 220,
      ownerRole: 'SUPPLIER',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
      rating: 4.8,
      salesPotentialScore: 92,
      fastShipping: true,
      estDeliveryDays: 2,
      estShippingCostPKR: 200,
      description: 'BPA free spill-proof water bottle for school and sports.',
      status: 'IN_STOCK',
    },
  ];

  return (
    <div id="public-homepage" className="min-h-screen flex flex-col bg-[#f5f6f8] text-slate-800 font-sans">
      {/* 1. TOP ANNOUNCEMENT STRIP (Exact navy styling from video) */}
      <div className="bg-[#16325c] text-white px-4 sm:px-8 py-2 text-xs font-medium border-b border-[#214374] select-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="font-extrabold tracking-wider uppercase flex items-center gap-2 text-xs sm:text-[13px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PAKISTAN'S SMARTEST DROPSHIPPING PLATFORM</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <button
              onClick={onOpenHelpSupport}
              className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-semibold"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-300" />
              <span>Contact Us</span>
            </button>
            <button
              onClick={onOpenCart || onNavigateProducts}
              className="hover:text-amber-300 transition cursor-pointer flex items-center gap-1 font-semibold"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>Cart ({cartCount})</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="hover:text-amber-300 transition cursor-pointer font-bold"
            >
              Login
            </button>
            <span className="text-slate-400">|</span>
            <div className="flex items-center gap-2.5 text-slate-300">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href={`https://wa.me/${officialWhatsApp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition"
                title="WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER WITH SEARCH & WHATSAPP (Exact layout from video 0:45) */}
      <div className="bg-[#16325c] text-white px-4 sm:px-8 py-4 border-b border-[#214374]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-12 h-12 rounded-full border-2 border-white/90 flex items-center justify-center bg-gradient-to-br from-sky-600 to-indigo-800 shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight leading-none text-white flex items-center gap-1.5">
                <span>YOURMART</span>
              </div>
              <div className="text-[10px] tracking-wider text-slate-300 font-bold uppercase mt-1">
                PAKISTAN'S SMARTEST DROPSHIPPING PLATFORM
              </div>
            </div>
          </div>

          {/* Pill Search Bar */}
          <div className="w-full max-w-xl">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center bg-white rounded-full p-1 pl-4 shadow-sm text-slate-800"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none pr-2"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-1 pr-3 border-l border-slate-200 pl-3 text-xs text-slate-600 font-bold hover:text-slate-900 transition cursor-pointer"
                >
                  <span className="max-w-[100px] truncate">{selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {isCategoryOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1 text-xs text-slate-700 font-medium">
                    {['All Categories', 'Airpods & Headsets', 'Home, Kitchen & Lifestyle', 'Personal Care & Beauty', 'Smart Gadgets', 'Kids', 'Smart Watches'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-sky-50 hover:text-sky-800 transition"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#16325c] hover:bg-sky-800 text-white flex items-center justify-center shrink-0 transition cursor-pointer"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: WhatsApp Helpline + Action Icons */}
          <div className="flex items-center gap-5 shrink-0">
            {/* WhatsApp Block */}
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
                <span className="text-[10px] font-bold text-slate-300 tracking-wider">
                  WHATSAPP
                </span>
                <span className="text-sm font-extrabold text-white tracking-tight">
                  {officialWhatsApp}
                </span>
              </div>
            </a>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 text-slate-200">
              <button
                onClick={onOpenLogin}
                className="hover:text-white p-2 rounded-lg hover:bg-white/10 transition cursor-pointer"
                title="My Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenWhatsNew}
                className="hover:text-white p-2 rounded-lg hover:bg-white/10 relative transition cursor-pointer"
                title="Notifications / What's New"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
              </button>
              <button
                onClick={onOpenCart || onNavigateProducts}
                className="hover:text-white p-2 rounded-lg hover:bg-white/10 relative transition cursor-pointer"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RUNNING ANNOUNCEMENT TICKER (Exact text from video) */}
      <div className="bg-[#122748] text-slate-200 py-2.5 px-4 text-xs font-semibold border-t border-b border-[#214374] overflow-hidden select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-6">
            <span className="text-white font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Now Every Pakistani Can Sell Online
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span>🛡️</span> Trusted by Thousands Across Pakistan
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <span>⚡</span> No Investment • No Advance Payment
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span>📦</span> Register Free & Get Started Easily
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <span>🚚</span> We Handle Inventory, Packing & Delivery
            </span>
            <span className="text-slate-500">|</span>
            <span className="flex items-center gap-1.5 text-white font-bold">
              <span>⚡</span> Same-Day Dispatch Available
            </span>
          </div>
        </div>
      </div>

      {/* 4. CLEAN WHITE HORIZONTAL NAVIGATION BAR (The 9 Core Options from Video) */}
      <nav
        aria-label="Front Navigation"
        className="w-full bg-white border-b border-slate-200 shadow-xs select-none sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
          {/* Navigation Links */}
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs font-bold text-slate-700 tracking-wide">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-sky-700 uppercase transition cursor-pointer py-1 border-b-2 border-sky-600 font-black"
            >
              HOME
            </button>
            <button
              onClick={onNavigateProducts}
              className="hover:text-sky-700 uppercase transition cursor-pointer py-1"
            >
              PRODUCTS
            </button>
            <button
              onClick={onOpenDropshipperRegister}
              className="hover:text-sky-700 uppercase transition cursor-pointer py-1 flex items-center gap-1"
            >
              <span>DROPSHIPPER REGISTRATION</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">FREE</span>
            </button>
            <button
              onClick={onOpenSupplierRegister}
              className="hover:text-sky-700 uppercase transition cursor-pointer py-1 flex items-center gap-1"
            >
              <span>SUPPLIER REGISTRATION</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded-full font-bold">FACTORY</span>
            </button>
            <button
              onClick={onOpenWhatsNew}
              className="hover:opacity-90 uppercase transition cursor-pointer py-1 flex items-center gap-1"
            >
              <span>WHAT'S</span>
              <span className="text-amber-700 font-black bg-amber-100 px-1.5 py-0.5 rounded-md border border-amber-300">
                NEW
              </span>
            </button>
            <button
              onClick={onOpenLearningLibrary}
              className="hover:text-sky-700 uppercase transition cursor-pointer py-1"
            >
              LEARNING LIBRARY
            </button>
            <div className="relative">
              <button
                onClick={() => setIsHelpDropdownOpen(!isHelpDropdownOpen)}
                className="hover:text-sky-700 uppercase transition cursor-pointer py-1 flex items-center gap-1"
              >
                <span>HELP & SUPPORT</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
              {isHelpDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 text-xs text-slate-700">
                  <button
                    onClick={() => {
                      setIsHelpDropdownOpen(false);
                      onOpenHelpSupport();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-bold text-sky-700"
                  >
                    Help Center
                  </button>
                  <button
                    onClick={() => {
                      setIsHelpDropdownOpen(false);
                      onOpenHelpSupport();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50"
                  >
                    Support Ticket
                  </button>
                  <button
                    onClick={() => {
                      setIsHelpDropdownOpen(false);
                      onOpenHelpSupport();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50"
                  >
                    Live Chat
                  </button>
                  <button
                    onClick={() => {
                      setIsHelpDropdownOpen(false);
                      onOpenHelpSupport();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 border-t border-slate-100"
                  >
                    Get In Touch
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              id="btn-home-export-csv"
              onClick={onExportProductsCSV}
              className="bg-[#16325c] hover:bg-[#122748] text-white font-bold text-xs px-3.5 py-2 rounded-lg tracking-wider flex items-center gap-1.5 uppercase transition shadow-xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXPORT PRODUCTS CSV</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              id="btn-home-business-dashboard"
              onClick={onOpenBusinessDashboard}
              className="bg-[#16325c] hover:bg-sky-800 text-white font-black text-xs px-4 py-2 rounded-lg tracking-wider uppercase transition shadow-sm cursor-pointer flex items-center gap-1.5 border border-sky-700"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-300" />
              <span>BUSINESS DASHBOARD</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 5. HOMEPAGE MAIN CONTENT (Matching the exact video layout from 0:45 to 1:35) */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-8">
        {/* TOP CATEGORIES SIDEBAR + HERO BANNER SLIDER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: TOP CATEGORIES */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="bg-[#16325c] text-white px-5 py-3.5 font-black text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>TOP CATEGORIES</span>
            </div>
            <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700 flex-1 flex flex-col justify-between">
              {[
                { name: 'Airpods & Headsets', icon: '🎧' },
                { name: 'Home, Kitchen & Lifestyle', icon: '🏠' },
                { name: 'Personal Care & Beauty', icon: '💄' },
                { name: 'Smart Gadgets', icon: '💡' },
                { name: 'Kids', icon: '🧸' },
                { name: 'Smart Watches', icon: '⌚' },
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={onNavigateProducts}
                  className="w-full text-left px-5 py-3 hover:bg-sky-50 hover:text-sky-800 transition flex items-center justify-between group cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-700 transition" />
                </button>
              ))}
              <button
                onClick={onNavigateProducts}
                className="w-full text-center py-3.5 bg-slate-50 hover:bg-sky-100 text-sky-700 font-extrabold uppercase text-xs tracking-wider transition cursor-pointer border-t border-slate-200"
              >
                SEE ALL CATEGORIES
              </button>
            </div>
          </div>

          {/* Right Column: BIG HERO BANNER */}
          <div className="lg:col-span-9 bg-gradient-to-r from-slate-50 via-white to-sky-50 rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="max-w-xl z-10 space-y-4">
              <div className="inline-block text-[11px] font-black uppercase tracking-widest text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                ONLINE SELLING MADE EASY
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Start Selling <br />
                <span className="text-sky-600">Without Stock</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                Launch your online selling journey with ready products, smart tools, and nationwide support across Pakistan.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenDropshipperRegister}
                  className="py-3.5 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm uppercase tracking-wider transition shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>Start Selling Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hero Image Illustration */}
            <div className="absolute right-0 bottom-0 top-0 hidden md:flex items-center justify-end w-1/2 pointer-events-none pr-6">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
                alt="Entrepreneur"
                className="h-72 w-72 object-cover rounded-full shadow-2xl border-4 border-white opacity-95"
              />
            </div>

            {/* Slider Indicator Dots */}
            <div className="flex items-center gap-2 pt-6 z-10">
              <button
                onClick={() => setActiveHeroSlide(0)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeHeroSlide === 0 ? 'w-8 bg-sky-600' : 'w-2.5 bg-slate-300'
                }`}
              />
              <button
                onClick={() => setActiveHeroSlide(1)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeHeroSlide === 1 ? 'w-8 bg-sky-600' : 'w-2.5 bg-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 3 VALUE PILLARS (Exact from video) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-sky-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                WINNING PRODUCTS
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Best-Selling, High-Demand Products
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-emerald-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                WHOLESALE PRICE
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Discounted Bulk Purchase Rate
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex items-center gap-4 hover:border-indigo-400 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                SAME DAY SHIPPING
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Immediate & Same Day Dispatch Available
              </p>
            </div>
          </div>
        </div>

        {/* VALUE PROPOSITION: START SELLING ONLINE EFFORTLESSLY */}
        <section className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-xs text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Start Selling Online Effortlessly, Without Inventory Headaches or Financial Burdens
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              YOURMART: Pakistan's Smartest Dropshipping Platform
            </h2>
          </div>

          {/* 8 Feature Tiles Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2 text-left">
            {[
              { title: 'Zero Investment Model', desc: 'No stock risk', icon: '🛡️' },
              { title: 'Smart Business Dashboard', desc: 'Real-time stats', icon: '📊' },
              { title: 'Fast Secure Payouts', desc: 'Daily remittances', icon: '⚡' },
              { title: 'Wide Product Range', desc: '10,000+ ready SKUs', icon: '📦' },
              { title: 'Dedicated WhatsApp Support', desc: 'Active 24/7 team', icon: '💬' },
              { title: 'Rewards And Incentives', desc: 'Milestone bonuses', icon: '🎁' },
              { title: 'Three Level Pricing', desc: 'Transparent margins', icon: '🏷️' },
              { title: 'COD, Wholesale, Daraz Orders', desc: 'Multi-channel sync', icon: '🇵🇰' },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-sky-300 hover:shadow-2xs transition flex flex-col justify-between"
              >
                <span className="text-2xl mb-1.5">{feat.icon}</span>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 leading-snug">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={onOpenDropshipperRegister}
              className="py-3.5 px-10 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-black text-sm uppercase tracking-wider transition shadow-md cursor-pointer"
            >
              REGISTER AS DROPSHIPPER
            </button>
          </div>
        </section>

        {/* LATEST UPDATES: WHAT'S NEW ON YOURMART (Exact from video 0:50) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                LATEST UPDATES
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                What's New on YourMart
              </h2>
            </div>
            <button
              onClick={onOpenWhatsNew}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Transparent Window Packaging */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div className="aspect-video bg-amber-50 p-6 flex items-center justify-center border-b border-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80"
                  alt="Packaging"
                  className="h-full w-full object-cover rounded-xl"
                />
                <span className="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  New Feature
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Transparent-Window Packaging
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    See what's inside before you open it. Transparent-window packaging builds trust and gives buyers more confidence.
                  </p>
                </div>
                <button
                  onClick={onOpenWhatsNew}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Weekly Payment */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div className="aspect-video bg-emerald-50 p-6 flex items-center justify-center border-b border-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=80"
                  alt="Payment"
                  className="h-full w-full object-cover rounded-xl"
                />
                <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  Weekly Payouts
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Weekly Payment
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Get paid every week, on time! Enjoy secure, reliable payouts that keep your cash flow moving and help you grow with confidence.
                  </p>
                </div>
                <button
                  onClick={onOpenWhatsNew}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Return Control Center */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between">
              <div className="aspect-video bg-sky-50 p-6 flex items-center justify-center border-b border-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80"
                  alt="Analytics"
                  className="h-full w-full object-cover rounded-xl"
                />
                <span className="absolute top-3 right-3 bg-sky-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                  Profit Guard™
                </span>
              </div>
              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Return Control Center
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Take control of returns with powerful insights into products, couriers and return reasons—reduce return rates and protect your profits.
                  </p>
                </div>
                <button
                  onClick={onOpenWhatsNew}
                  className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* START DROPSHIPPING WITH WINNING NICHE PRODUCTS (Exact round photo cards from video 0:53) */}
        <section className="bg-[#122748] text-white rounded-2xl p-8 sm:p-10 shadow-md space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Start Dropshipping with Winning Niche Products
            </h2>
            <p className="text-xs text-slate-300">
              Verified top-performing wholesale categories in high demand across Pakistan
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Home & Kitchen', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&auto=format&fit=crop&q=80' },
              { name: 'Airpods & Headset', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80' },
              { name: 'Personal Care & Beauty', img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' },
              { name: 'Smart Gadgets', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&auto=format&fit=crop&q=80' },
              { name: 'Kids & Gaming', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=300&auto=format&fit=crop&q=80' },
              { name: 'Smart Watches', img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&auto=format&fit=crop&q=80' },
            ].map((niche, idx) => (
              <button
                key={idx}
                onClick={onNavigateProducts}
                className="group flex flex-col items-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 transition cursor-pointer"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden mb-2 border border-white/20 group-hover:scale-105 transition">
                  <img src={niche.img} alt={niche.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-center tracking-tight group-hover:text-amber-300 transition">
                  {niche.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 3 PROMOTIONAL ADS BANNERS (Exact from video 0:54) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Banner 1: Sell as a Dropshipper */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                For Resellers
              </span>
              <h3 className="text-xl font-black mt-2">SELL AS A DROPSHIPPER</h3>
              <p className="text-xs text-emerald-100 mt-1">
                No investment, No Stock. Just profit.
              </p>
            </div>
            <button
              onClick={onOpenDropshipperRegister}
              className="py-2.5 px-4 rounded-xl bg-white text-emerald-800 font-extrabold text-xs uppercase tracking-wider hover:bg-emerald-50 transition self-start cursor-pointer shadow-sm"
            >
              LEARN MORE
            </button>
          </div>

          {/* Banner 2: All-in-one Business Dashboard */}
          <div className="bg-gradient-to-br from-sky-600 to-indigo-800 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                Portal Management
              </span>
              <h3 className="text-xl font-black mt-2">ALL-IN-ONE BUSINESS DASHBOARD</h3>
              <p className="text-xs text-sky-100 mt-1">
                Order Status • Inventory Status • Payment Status
              </p>
            </div>
            <button
              onClick={onOpenBusinessDashboard}
              className="py-2.5 px-4 rounded-xl bg-white text-sky-900 font-extrabold text-xs uppercase tracking-wider hover:bg-sky-50 transition self-start cursor-pointer shadow-sm"
            >
              OPEN DASHBOARD
            </button>
          </div>

          {/* Banner 3: Become a Supplier */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-800 text-white rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                For Manufacturers
              </span>
              <h3 className="text-xl font-black mt-2">BECOME A SUPPLIER</h3>
              <p className="text-xs text-indigo-100 mt-1">
                Let Thousands Sell Your Products Nationwide.
              </p>
            </div>
            <button
              onClick={onOpenSupplierRegister}
              className="py-2.5 px-4 rounded-xl bg-white text-indigo-900 font-extrabold text-xs uppercase tracking-wider hover:bg-indigo-50 transition self-start cursor-pointer shadow-sm"
            >
              LEARN MORE
            </button>
          </div>
        </div>

        {/* SECTION 1: NEW ARRIVAL (Exact products from video 0:56) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>🛍️</span>
              <span>NEW ARRIVAL</span>
            </h2>
            <button
              onClick={onNavigateProducts}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {newArrivalProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition group"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    <span className="absolute top-1.5 left-1.5 bg-[#16325c] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block truncate">
                    {p.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                    {p.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Item #: {p.sku}
                  </div>
                  <div className="mt-2 text-xs">
                    <div className="font-bold text-slate-800 font-mono">
                      Price: PKR {p.recSellingPricePKR}
                    </div>
                    <div className="font-extrabold text-sky-700 font-mono">
                      Bulk Price: PKR {p.supplierCostPKR}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3">
                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full py-1.5 rounded-lg bg-[#16325c] hover:bg-sky-800 text-white font-extrabold text-[11px] uppercase transition cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => onBuyNow(p)}
                    className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] uppercase transition cursor-pointer"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 2: RE-STOCKED (Exact products from video 1:02) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>📦</span>
              <span>RE-STOCKED</span>
            </h2>
            <button
              onClick={onNavigateProducts}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {restockedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition group"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block truncate">
                    {p.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                    {p.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Item #: {p.sku}
                  </div>
                  <div className="mt-2 text-xs">
                    <div className="font-bold text-slate-800 font-mono">
                      Price: PKR {p.recSellingPricePKR}
                    </div>
                    <div className="font-extrabold text-sky-700 font-mono">
                      Bulk Price: PKR {p.supplierCostPKR}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3">
                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full py-1.5 rounded-lg bg-[#16325c] hover:bg-sky-800 text-white font-extrabold text-[11px] uppercase transition cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => onBuyNow(p)}
                    className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] uppercase transition cursor-pointer"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onNavigateProducts}
              className="py-2.5 px-8 rounded-xl bg-[#16325c] hover:bg-[#122748] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
            >
              SEE MORE
            </button>
          </div>
        </section>

        {/* SECTION 3: SUMMER COLLECTION (Exact from video 1:10) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>☀️</span>
              <span>SUMMER COLLECTION</span>
            </h2>
            <button
              onClick={onNavigateProducts}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {summerProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between hover:shadow-md hover:border-sky-300 transition group"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2 relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block truncate">
                    {p.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mt-0.5 leading-snug">
                    {p.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Item #: {p.sku}
                  </div>
                  <div className="mt-2 text-xs">
                    <div className="font-bold text-slate-800 font-mono">
                      Price: PKR {p.recSellingPricePKR}
                    </div>
                    <div className="font-extrabold text-sky-700 font-mono">
                      Bulk Price: PKR {p.supplierCostPKR}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3">
                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full py-1.5 rounded-lg bg-[#16325c] hover:bg-sky-800 text-white font-extrabold text-[11px] uppercase transition cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => onBuyNow(p)}
                    className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-[11px] uppercase transition cursor-pointer"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onNavigateProducts}
              className="py-2.5 px-8 rounded-xl bg-[#16325c] hover:bg-[#122748] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
            >
              SEE MORE
            </button>
          </div>
        </section>
      </main>

      {/* 6. PLATFORM FOOTER (Exact 5-column model from video 0:08 and 2:22) */}
      <footer className="bg-[#16325c] text-white border-t border-[#214374] pt-12 pb-8 px-4 sm:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-white/10 text-xs">
            {/* Column 1: Brand & About */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-[#16325c] flex items-center justify-center font-black">
                  YM
                </div>
                <span className="font-black text-base tracking-tight">YOURMART</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                YourMart is Pakistan's Smartest Dropshipping Platform, making online selling easy, simple, and risk-free that — Now Everyone Can Sell Online.
              </p>
              <div className="flex items-center gap-3 pt-2 text-slate-300">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href={`https://wa.me/${officialWhatsApp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Sell On YourMart + Track Shipment */}
            <div className="space-y-4">
              <div>
                <h4 className="font-black uppercase tracking-wider text-slate-200 mb-2.5">
                  SELL ON YOURMART
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li>
                    <button onClick={onOpenDropshipperRegister} className="hover:text-white transition cursor-pointer">
                      • Dropshipper Registration
                    </button>
                  </li>
                  <li>
                    <button onClick={onOpenSupplierRegister} className="hover:text-white transition cursor-pointer">
                      • Supplier Registration
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-black uppercase tracking-wider text-slate-200 mb-2.5">
                  TRACK YOUR SHIPMENT
                </h4>
                <ul className="space-y-1.5 text-slate-300">
                  <li>• Trax Courier</li>
                  <li>• Leopards Courier</li>
                  <li>• PostEx</li>
                  <li>• M&P Courier</li>
                </ul>
              </div>
            </div>

            {/* Column 3: Resources */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-slate-200 mb-2.5">
                RESOURCES
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button onClick={onOpenLearningLibrary} className="hover:text-white transition cursor-pointer">
                    • Learning Library
                  </button>
                </li>
                <li>
                  <button onClick={onExportProductsCSV} className="hover:text-white transition cursor-pointer">
                    • 1-Click Export | Shopify
                  </button>
                </li>
                <li>
                  <button onClick={onExportProductsCSV} className="hover:text-white transition cursor-pointer">
                    • 1-Click Export | WooCommerce
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDropshipperRegister} className="hover:text-white transition cursor-pointer">
                    • Dropshipper Orientation Kit
                  </button>
                </li>
                <li>
                  <button onClick={onOpenSupplierRegister} className="hover:text-white transition cursor-pointer">
                    • Supplier Orientation Kit
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div>
              <h4 className="font-black uppercase tracking-wider text-slate-200 mb-2.5">
                SUPPORT
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>
                  <button onClick={onOpenHelpSupport} className="hover:text-white transition cursor-pointer">
                    • Guidelines
                  </button>
                </li>
                <li>
                  <button onClick={onOpenHelpSupport} className="hover:text-white transition cursor-pointer">
                    • FAQs
                  </button>
                </li>
                <li>
                  <button onClick={onOpenHelpSupport} className="hover:text-white transition cursor-pointer">
                    • Policies
                  </button>
                </li>
                <li>
                  <button onClick={onOpenHelpSupport} className="hover:text-white transition cursor-pointer">
                    • Get In Touch
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: WhatsApp Channel QR */}
            <div className="space-y-2">
              <h4 className="font-black uppercase tracking-wider text-slate-200 mb-2.5">
                YOURMART DROPSHIPPING WHATSAPP CHANNEL
              </h4>
              <div className="bg-white p-3 rounded-xl inline-block text-slate-900 text-center shadow">
                <QrCode className="w-20 h-20 text-slate-900 mx-auto" />
                <span className="text-[10px] font-bold mt-1 block">Scan me</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Join to Stay Updated with daily wholesale winners!
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} YourMart. All Rights Reserved</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>TCS • Leopards • Trax • Call Courier</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">100% Cash On Delivery</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
