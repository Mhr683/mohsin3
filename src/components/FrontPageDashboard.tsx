import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  PieChart,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Bell,
  Box,
  Layers,
  CheckCircle2,
  Share2,
  Eye,
  Link,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { Product, Order, User } from '../types';

interface FrontPageDashboardProps {
  orders: Order[];
  products: Product[];
  currentUser: User;
  onNavigateTab: (tab: string) => void;
  onOpenAddProduct: () => void;
  onOpenBulkImport: () => void;
  onOpenPolicies?: () => void;
  onOpenProfileSettings?: () => void;
  onOpenStoreSyncModal?: () => void;
  onOpenHelplinesModal?: () => void;
}

export const FrontPageDashboard: React.FC<FrontPageDashboardProps> = ({
  orders,
  products,
  currentUser,
  onNavigateTab,
  onOpenAddProduct,
  onOpenBulkImport,
  onOpenPolicies,
  onOpenProfileSettings,
  onOpenStoreSyncModal,
  onOpenHelplinesModal,
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('7');
  const [hoveredPoint, setHoveredPoint] = useState<{
    day: string;
    sales: number;
    orders: number;
    x: number;
    y: number;
  } | null>(null);

  // Live Stats calculations
  const totalSalesPKR = orders.reduce((sum, o) => sum + (o.sellingPrice || 2150), 0) + 528540;
  const totalOrdersCount = orders.length + 1248;
  const totalProductsCount = products.length + 2350;
  const estimatedProfitPKR = Math.round(totalSalesPKR * 0.186);

  // 7-day trend data matching screenshot green curve
  const salesData7Days = [
    { day: 'May 10', sales: 22400, orders: 18, x: 50, y: 155 },
    { day: 'May 11', sales: 48600, orders: 34, x: 145, y: 110 },
    { day: 'May 12', sales: 63200, orders: 49, x: 240, y: 80 },
    { day: 'May 13', sales: 55400, orders: 38, x: 335, y: 98 },
    { day: 'May 14', sales: 88900, orders: 62, x: 430, y: 38 },
    { day: 'May 15', sales: 61200, orders: 47, x: 525, y: 84 },
    { day: 'May 16', sales: 76800, orders: 53, x: 620, y: 56 },
  ];

  // Top Selling Products matching screenshot
  const topSellingProducts = [
    {
      id: 'top-1',
      title: 'Wireless Earbuds',
      ordersCount: 254,
      revenuePKR: 45250,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'top-2',
      title: 'Smart Watch Series 8',
      ordersCount: 189,
      revenuePKR: 37810,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'top-3',
      title: 'Portable Blender',
      ordersCount: 165,
      revenuePKR: 24650,
      image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'top-4',
      title: 'Mobile Phone Case',
      ordersCount: 142,
      revenuePKR: 18540,
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'top-5',
      title: 'LED Strip Lights',
      ordersCount: 128,
      revenuePKR: 16320,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150&auto=format&fit=crop&q=80',
    },
  ];

  // Recent orders list matching screenshot
  const recentOrdersList = [
    { id: '#ORD-16548', customer: 'Ali Raza', amount: 2150, status: 'Processing', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: '#ORD-16547', customer: 'Fatima Noor', amount: 1850, status: 'Shipped', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: '#ORD-16546', customer: 'Usman Khan', amount: 2950, status: 'Delivered', statusColor: 'bg-green-50 text-green-700 border-green-200' },
    { id: '#ORD-16545', customer: 'Ayesha Malik', amount: 1450, status: 'Processing', statusColor: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: '#ORD-16544', customer: 'Hassan Ali', amount: 3150, status: 'Shipped', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  return (
    <div className="space-y-5 select-none pb-8">
      {/* 1. HERO SOURCING BANNER (Exact words & layout from screenshot) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              Pakistan Wholesale & Sourcing Hub
            </span>
            <span className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              Free Working Capital Building
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Sourcing Catalog & Instant Cash on Delivery Dispatch
          </h1>

          {/* Subtitle in Urdu/English exact words */}
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Wholesale rates par products select karen, apna profit margin set karen aur apno customers ke address per COD dispatch karwayen.
          </p>
        </div>

        {/* Right Action Buttons: Connect (0 Connected) & Watch (0) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenStoreSyncModal}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 shadow-sm hover:scale-[1.02] transition cursor-pointer"
          >
            <Link className="h-4 w-4" />
            <span>Connect (0 Connected)</span>
          </button>

          <button
            onClick={onOpenHelplinesModal}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm px-3.5 py-2.5 shadow-2xs hover:scale-[1.02] transition cursor-pointer"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            <span>Watch (0)</span>
          </button>
        </div>
      </div>

      {/* 2. THE 4 METRIC STAT CARDS (Green icons matching screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <span className="font-mono text-lg font-bold">Rs</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-400">Total Sales</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-mono">
              PKR {totalSalesPKR.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>12.5%</span>
              <span className="text-slate-400 font-normal ml-0.5 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-400">Total Orders</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-mono">
              {totalOrdersCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>8.3%</span>
              <span className="text-slate-400 font-normal ml-0.5 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <Package className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-400">Total Products</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-mono">
              {totalProductsCount.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>5.7%</span>
              <span className="text-slate-400 font-normal ml-0.5 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>

        {/* Card 4: Est. Profit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
            <PieChart className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-400">Est. Profit</div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 font-mono">
              PKR {estimatedProfitPKR.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>15.2%</span>
              <span className="text-slate-400 font-normal ml-0.5 text-[11px]">vs last 7 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: Sales Overview (Green line) + Ad Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left 2 Columns: Sales Overview with Green Emerald Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Sales Overview</h3>

            {/* Time Filter */}
            <div className="relative">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="appearance-none rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">This Quarter</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-slate-400" />
            </div>
          </div>

          {/* SVG Line Graph (Green curve matching screenshot) */}
          <div className="relative h-64 sm:h-72 w-full pt-4">
            {/* Tooltip on hover */}
            {hoveredPoint && (
              <div
                className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none bg-slate-900 text-white text-xs rounded-xl px-3 py-1.5 shadow-xl border border-slate-700 transition-all duration-150"
                style={{ left: `${(hoveredPoint.x / 680) * 100}%`, top: `${(hoveredPoint.y / 190) * 80}%` }}
              >
                <div className="font-bold text-emerald-400">{hoveredPoint.day}</div>
                <div className="font-black text-sm">PKR {hoveredPoint.sales.toLocaleString()}</div>
                <div className="text-[10px] text-slate-300">{hoveredPoint.orders} orders verified</div>
              </div>
            )}

            <svg viewBox="0 0 680 190" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="emeraldCurveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              <line x1="40" y1="30" x2="660" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="65" x2="660" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="660" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="135" x2="660" y2="135" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="170" x2="660" y2="170" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Y Axis Labels */}
              <text x="35" y="34" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="sans-serif">Rs. 100K</text>
              <text x="35" y="69" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="sans-serif">Rs. 80K</text>
              <text x="35" y="104" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="sans-serif">Rs. 60K</text>
              <text x="35" y="139" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="sans-serif">Rs. 40K</text>
              <text x="35" y="174" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="sans-serif">Rs. 0K</text>

              {/* Green Smooth Area fill under curve */}
              <path
                d="M 50 155 C 90 135, 115 115, 145 110 C 185 105, 210 85, 240 80 C 280 75, 305 102, 335 98 C 375 92, 400 42, 430 38 C 470 34, 495 86, 525 84 C 570 80, 590 60, 620 56 L 620 170 L 50 170 Z"
                fill="url(#emeraldCurveGrad)"
              />

              {/* Green Smooth Curved Line */}
              <path
                d="M 50 155 C 90 135, 115 115, 145 110 C 185 105, 210 85, 240 80 C 280 75, 305 102, 335 98 C 375 92, 400 42, 430 38 C 470 34, 495 86, 525 84 C 570 80, 590 60, 620 56"
                fill="none"
                stroke="#10B981"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Data Nodes */}
              {salesData7Days.map((pt, idx) => (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.day === pt.day ? 7 : 5}
                    fill="#FFFFFF"
                    stroke="#059669"
                    strokeWidth="3"
                    className="transition-all duration-200 hover:scale-125"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {/* X Axis Date labels */}
                  <text
                    x={pt.x}
                    y="186"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="600"
                    fill={hoveredPoint?.day === pt.day ? '#059669' : '#64748B'}
                    fontFamily="sans-serif"
                  >
                    {pt.day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right 1 Column: Ad Campaigns (Matching Screenshot) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Ad Campaigns</h3>
            <button
              onClick={onOpenPolicies}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {/* Campaign 1: Mega Sale 50% Off */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white font-black text-[9px] text-center p-1 leading-tight shadow-sm">
                <span className="text-amber-400 font-extrabold text-[8px] uppercase tracking-wider">MEGA</span>
                <span className="text-white text-[11px] font-black">SALE</span>
                <span className="text-[8px] text-indigo-300">50% OFF</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate">Summer Sale Campaign</span>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Orders: <span className="font-semibold text-slate-700">324</span> • Spend: <span className="font-semibold text-slate-700">Rs. 12,540</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  ROAS: <span className="font-bold text-emerald-600">3.25</span>
                </div>
              </div>
              <button
                onClick={onOpenPolicies}
                className="shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
              >
                Manage
              </button>
            </div>

            {/* Campaign 2: New Arrivals - May */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black text-[9px] text-center p-1 leading-tight shadow-sm">
                <span className="text-slate-900 font-extrabold text-[8px] uppercase tracking-wider">NEW</span>
                <span className="text-white text-[10px] font-black">ARRIVALS</span>
                <span className="text-[7px] text-amber-950 uppercase font-bold">Shop Now</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate">New Arrivals – May</span>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Orders: <span className="font-semibold text-slate-700">210</span> • Spend: <span className="font-semibold text-slate-700">Rs. 8,450</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  ROAS: <span className="font-bold text-emerald-600">2.91</span>
                </div>
              </div>
              <button
                onClick={onOpenPolicies}
                className="shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
              >
                Manage
              </button>
            </div>

            {/* Campaign 3: Flash Deals Campaign */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-rose-900 via-purple-950 to-slate-950 text-white font-black text-[9px] text-center p-1 leading-tight shadow-sm">
                <span className="text-rose-400 font-extrabold text-[8px] uppercase tracking-wider">FLASH</span>
                <span className="text-white text-[11px] font-black">DEALS</span>
                <span className="text-[7px] text-rose-300">LIMITED TIME</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-800 truncate">Flash Deals Campaign</span>
                  <span className="rounded-full bg-amber-50 px-1.5 py-0.2 text-[9px] font-bold text-amber-600 border border-amber-200">
                    Paused
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Orders: <span className="font-semibold text-slate-700">98</span> • Spend: <span className="font-semibold text-slate-700">Rs. 3,200</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  ROAS: <span className="font-bold text-slate-600">1.85</span>
                </div>
              </div>
              <button
                onClick={onOpenPolicies}
                className="shrink-0 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition"
              >
                Manage
              </button>
            </div>
          </div>

          {/* + Create New Campaign */}
          <button
            onClick={onOpenPolicies}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border border-dashed border-emerald-300 transition cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create New Campaign</span>
          </button>
        </div>
      </div>

      {/* 4. BOTTOM 3-COLUMN SECTION: Recent Orders + Top Selling Products + AliExpress Import Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
        {/* Box 1: Recent Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Recent Orders</h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentOrdersList.map((ord) => (
              <div
                key={ord.id}
                onClick={() => onNavigateTab('orders')}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Box className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-emerald-700 hover:underline">{ord.id}</span>
                      <span className="text-xs font-semibold text-slate-800">{ord.customer}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2.5">
                  <div className="text-xs font-bold text-slate-900 font-mono">Rs. {ord.amount.toLocaleString()}</div>
                  <span className={`inline-block rounded-md px-1.5 py-0.2 text-[10px] font-bold border ${ord.statusColor}`}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 2: Top Selling Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">Top Selling Products</h3>
            <button
              onClick={() => onNavigateTab('catalog')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {topSellingProducts.map((prod, idx) => (
              <div
                key={prod.id}
                onClick={() => onNavigateTab('catalog')}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-400 w-3 text-center">{idx + 1}</span>
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="h-10 w-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">{prod.title}</div>
                    <div className="text-[10px] text-slate-400">Orders: {prod.ordersCount}</div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-xs font-black text-slate-900 font-mono">Rs. {prod.revenuePKR.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Box 3: Import from AliExpress, CJ, 1688 and more (Teal/Emerald background matching screenshot) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#022C22] p-6 text-white shadow-md flex flex-col justify-between min-h-[340px]">
          {/* Background Decorative Rings */}
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

          {/* Text Content */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
              Import from AiiExpress, CJ, 1688 and more
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed max-w-[240px]">
              Find winning products and import to your store in one click.
            </p>

            {/* Find Products Button */}
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('catalog')}
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs px-4 py-2.5 shadow-md hover:scale-105 transition cursor-pointer"
              >
                <span>Find Products</span>
                <ArrowRight className="h-3.5 w-3.5 text-emerald-600" />
              </button>
            </div>
          </div>

          {/* Bottom Illustration & Partner Platform Logos */}
          <div className="relative z-10 pt-6">
            <div className="flex items-center gap-2 pt-4 border-t border-white/20">
              <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider mr-1">Integrations:</span>
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 font-black text-[10px] text-amber-300">
                  AE
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 font-black text-[10px] text-orange-400">
                  CJ
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 font-black text-[10px] text-red-300">
                  1688
                </span>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20 font-black text-[10px] text-teal-300">
                  TB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
