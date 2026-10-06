import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Info,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  HelpCircle,
  Building2,
  Receipt,
  BadgeAlert,
} from 'lucide-react';
import { Product } from '../types';

interface DarazCalculatorProps {
  products?: Product[];
  onSelectProductForOrder?: (product: Product, sellingPrice: number) => void;
  onClose?: () => void;
}

export type ProvinceKey = 'PUNJAB' | 'SINDH' | 'BALOCHISTAN' | 'KPK' | 'ISLAMABAD';

export interface ProvinceVatOption {
  key: ProvinceKey;
  name: string;
  shortName: string;
  vatRate: number; // 0.16 or 0.15
  vatPercent: number; // 16 or 15
  authority: string;
}

export const PROVINCES_DATA: ProvinceVatOption[] = [
  {
    key: 'PUNJAB',
    name: 'Punjab',
    shortName: 'PB',
    vatRate: 0.16,
    vatPercent: 16,
    authority: 'Punjab Revenue Authority (PRA)',
  },
  {
    key: 'SINDH',
    name: 'Sindh',
    shortName: 'SD',
    vatRate: 0.15,
    vatPercent: 15,
    authority: 'Sindh Revenue Board (SRB)',
  },
  {
    key: 'BALOCHISTAN',
    name: 'Balochistan',
    shortName: 'BA',
    vatRate: 0.15,
    vatPercent: 15,
    authority: 'Balochistan Revenue Authority (BRA)',
  },
  {
    key: 'KPK',
    name: 'Khyber Pakhtunkhwa (KPK)',
    shortName: 'KP',
    vatRate: 0.15,
    vatPercent: 15,
    authority: 'KPK Revenue Authority (KPRA)',
  },
  {
    key: 'ISLAMABAD',
    name: 'Islamabad (ICT)',
    shortName: 'ICT',
    vatRate: 0.16,
    vatPercent: 16,
    authority: 'Federal Capital Territory (ICT)',
  },
];

interface DarazCategoryPreset {
  name: string;
  commissionPct: number;
}

export const DARAZ_CATEGORY_PRESETS: DarazCategoryPreset[] = [
  { name: 'Mobile Accessories & Cables', commissionPct: 8.5 },
  { name: 'Electronics & Audio Gadgets', commissionPct: 7.0 },
  { name: 'Fashion, Clothing & Shoes', commissionPct: 12.0 },
  { name: 'Health, Beauty & Skincare', commissionPct: 10.0 },
  { name: 'Home, Kitchen & Living', commissionPct: 9.0 },
  { name: 'Watches, Bags & Jewelry', commissionPct: 11.5 },
  { name: 'Baby Care & Toys', commissionPct: 8.0 },
  { name: 'Automotive & Tools', commissionPct: 7.5 },
  { name: 'Custom / Other Category', commissionPct: 8.5 },
];

export const DarazCalculator: React.FC<DarazCalculatorProps> = ({
  products = [],
  onSelectProductForOrder,
  onClose,
}) => {
  // Mode:
  // 'TARGET_PROFIT' = Input Product Cost + Desired Profit -> Calculates required Daraz listing price
  // 'EVALUATE_PRICE' = Input Daraz Selling Price -> Calculates exact deductions and net profit
  const [activeMode, setActiveMode] = useState<'TARGET_PROFIT' | 'EVALUATE_PRICE'>('TARGET_PROFIT');

  // Input States
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productTitle, setProductTitle] = useState<string>('Custom Product');
  const [sourcingCostPKR, setSourcingCostPKR] = useState<number>(500); // Default Rs. 500 as per user example
  const [desiredProfitPKR, setDesiredProfitPKR] = useState<number>(200); // Default Rs. 200 target profit
  const [directSellingPricePKR, setDirectSellingPricePKR] = useState<number>(850);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceKey>('PUNJAB');
  const [commissionRatePct, setCommissionRatePct] = useState<number>(8.5);
  const [selectedCategory, setSelectedCategory] = useState<string>(DARAZ_CATEGORY_PRESETS[0].name);
  const [packagingCostPKR, setPackagingCostPKR] = useState<number>(0);

  // Copy Feedback
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Selected Province Data
  const province = useMemo(() => {
    return PROVINCES_DATA.find((p) => p.key === selectedProvince) || PROVINCES_DATA[0];
  }, [selectedProvince]);

  // Handle Selecting a Listed Product
  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    if (!prodId) return;
    const found = products.find((p) => p.id === prodId);
    if (found) {
      setProductTitle(found.name);
      setSourcingCostPKR(found.supplierCostPKR);
      setDirectSellingPricePKR(found.recSellingPricePKR);
      // Auto-set a healthy profit
      const potentialProfit = Math.max(150, Math.round((found.recSellingPricePKR - found.supplierCostPKR) * 0.5));
      setDesiredProfitPKR(potentialProfit);
    }
  };

  // =========================================================================
  // CORE CALCULATION FORMULAS AS SPECIFIED BY USER
  // 1. Payment fee = 2.25% of Item Unit Price
  // 2. VAT on Payment fee = Payment Fee × Province VAT % (Punjab 16%, Sindh 15%, KPK 15%, Balochistan 15%)
  // 3. Payment fee with VAT = Payment fee + VAT
  // 4. Commission = Item Unit Price × Commission %
  // 5. VAT on Commission = Commission × Province VAT %
  // 6. Commission with VAT = Commission + VAT
  // =========================================================================
  const calculation = useMemo(() => {
    const cost = Math.max(0, Number(sourcingCostPKR) || 0);
    const packaging = Math.max(0, Number(packagingCostPKR) || 0);
    const profitTarget = Math.max(0, Number(desiredProfitPKR) || 0);

    const paymentFeeRate = 0.0225; // 2.25% Standard Payment Fee
    const vatRate = province.vatRate; // 0.16 or 0.15
    const commRate = (commissionRatePct || 0) / 100; // e.g. 0.085

    // Combined fee multiplier per rupee of selling price
    // Total Fee = (Payment Fee + Commission) * (1 + VAT)
    // = [S * 0.0225 * (1 + vatRate)] + [S * commRate * (1 + vatRate)]
    // = S * [(0.0225 + commRate) * (1 + vatRate)]
    const feeMultiplier = (paymentFeeRate + commRate) * (1 + vatRate);

    let sellingPrice = 0;

    if (activeMode === 'TARGET_PROFIT') {
      // Selling Price = (Product Cost + Packaging + Target Profit) / (1 - feeMultiplier)
      if (feeMultiplier < 0.95) {
        sellingPrice = Math.round((cost + packaging + profitTarget) / (1 - feeMultiplier));
      } else {
        sellingPrice = cost + packaging + profitTarget;
      }
    } else {
      sellingPrice = Math.max(10, Number(directSellingPricePKR) || 0);
    }

    // Step-by-Step Breakdown on sellingPrice:
    // 1. Payment Fee (2.25%)
    const paymentFeeBase = sellingPrice * paymentFeeRate;
    // 2. VAT on Payment Fee
    const paymentFeeVat = paymentFeeBase * vatRate;
    // 3. Payment Fee with VAT
    const paymentFeeWithVat = paymentFeeBase + paymentFeeVat;

    // 4. Daraz Category Commission
    const commissionBase = sellingPrice * commRate;
    // 5. VAT on Commission
    const commissionVat = commissionBase * vatRate;
    // 6. Commission with VAT
    const commissionWithVat = commissionBase + commissionVat;

    // Total Daraz Deductions (Fees + VAT)
    const totalDarazFeesAndTax = paymentFeeWithVat + commissionWithVat;
    const totalAllCosts = cost + packaging + totalDarazFeesAndTax;

    // Net Payout Transferred by Daraz into Seller Bank Account
    const netBankPayout = Math.max(0, sellingPrice - totalDarazFeesAndTax);

    // Pure Net Profit In Pocket
    const netProfitInPocket = netBankPayout - cost - packaging;
    const profitMarginPct = sellingPrice > 0 ? (netProfitInPocket / sellingPrice) * 100 : 0;
    const roiPct = cost > 0 ? (netProfitInPocket / cost) * 100 : 0;

    // Break-even Selling Price (Zero Profit)
    // S_breakeven = (cost + packaging) / (1 - feeMultiplier)
    const breakEvenSellingPrice = Math.round((cost + packaging) / (1 - feeMultiplier));
    const breakEvenDarazTaxAndFee = Math.round(breakEvenSellingPrice - (cost + packaging));

    return {
      sellingPrice,
      cost,
      packaging,
      profitTarget,
      paymentFeeBase,
      paymentFeeVat,
      paymentFeeWithVat,
      commissionBase,
      commissionVat,
      commissionWithVat,
      totalDarazFeesAndTax,
      totalAllCosts,
      netBankPayout,
      netProfitInPocket,
      profitMarginPct,
      roiPct,
      breakEvenSellingPrice,
      breakEvenDarazTaxAndFee,
      isProfitable: netProfitInPocket > 0,
      feeMultiplierPct: (feeMultiplier * 100).toFixed(2),
    };
  }, [
    activeMode,
    sourcingCostPKR,
    desiredProfitPKR,
    directSellingPricePKR,
    packagingCostPKR,
    commissionRatePct,
    province,
  ]);

  // Copy Summary to Clipboard
  const handleCopy = () => {
    const text = `
🛒 DARAZ.PK OFFICIAL FEE & TAX BREAKDOWN 🛒
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Product: ${productTitle}
🏭 Product Purchase Cost: PKR ${calculation.cost.toLocaleString()}
📍 Province: ${province.name} (${province.vatPercent}% VAT)

⚖️ DARAZ TAXES & CHARGES:
• Payment Fee (2.25%): PKR ${calculation.paymentFeeBase.toFixed(2)}
• VAT on Payment Fee (${province.vatPercent}%): PKR ${calculation.paymentFeeVat.toFixed(2)}
  ↳ Payment Fee with VAT: PKR ${calculation.paymentFeeWithVat.toFixed(2)}

• Daraz Commission (${commissionRatePct}%): PKR ${calculation.commissionBase.toFixed(2)}
• VAT on Commission (${province.vatPercent}%): PKR ${calculation.commissionVat.toFixed(2)}
  ↳ Commission with VAT: PKR ${calculation.commissionWithVat.toFixed(2)}

🛑 Total Daraz Fee & Tax: PKR ${calculation.totalDarazFeesAndTax.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Recommended Daraz Listing Price: PKR ${calculation.sellingPrice.toLocaleString()}
⚠️ Break-Even Minimum Listing Price: PKR ${calculation.breakEvenSellingPrice.toLocaleString()}+
🏦 Net Bank Payout (From Daraz): PKR ${calculation.netBankPayout.toFixed(2)}
💵 Net Profit in Pocket: PKR ${calculation.netProfitInPocket.toFixed(2)} (${calculation.profitMarginPct.toFixed(1)}%)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via YourMart Global Daraz Calculator
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleReset = () => {
    setSelectedProductId('');
    setProductTitle('Custom Product');
    setSourcingCostPKR(500);
    setDesiredProfitPKR(200);
    setDirectSellingPricePKR(850);
    setSelectedProvince('PUNJAB');
    setCommissionRatePct(8.5);
    setSelectedCategory(DARAZ_CATEGORY_PRESETS[0].name);
    setPackagingCostPKR(0);
  };

  return (
    <div id="daraz-calculator-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-950 p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Calculator className="h-5 w-5" />
              </span>
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300 border border-orange-500/40 uppercase tracking-wider">
                Official Daraz.pk Formula Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Daraz Fee, Tax & Profit Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Automatic calculation based on <strong className="text-orange-400 font-semibold">2.25% Standard Payment Fee</strong>, Province-wise VAT (Punjab 16%, Sindh 15%, Balochistan 15%, KPK 15%), and category commission.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              id="reset-calculator-btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition shadow"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              id="copy-summary-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 text-xs font-bold transition shadow-lg shadow-orange-950 cursor-pointer"
            >
              {isCopied ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  <span>Breakdown Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Calculation Mode Toggle */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
            Calculator Mode:
          </span>
          <button
            id="mode-target-profit-btn"
            onClick={() => setActiveMode('TARGET_PROFIT')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === 'TARGET_PROFIT'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Target Profit Mode (Calculate Minimum Required Listing Price)</span>
          </button>
          <button
            id="mode-evaluate-price-btn"
            onClick={() => setActiveMode('EVALUATE_PRICE')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeMode === 'EVALUATE_PRICE'
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-950'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-700'
            }`}
          >
            <Percent className="h-3.5 w-3.5" />
            <span>Price Checker Mode (Input Selling Price & See Deductions)</span>
          </button>
        </div>
      </div>

      {/* Real-Life Example Highlight Banner as described by the user */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 sm:p-5 text-slate-200 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 flex-shrink-0 mt-0.5 font-bold">
              💡
            </span>
            <div>
              <h3 className="text-sm font-bold text-amber-300">
                Aapki Misal (Example Formula Guide):
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Agar product ki khareed <strong>Rs. {calculation.cost.toLocaleString()}</strong> hai, aur Daraz ke tax & fees taqreeban <strong>Rs. {calculation.breakEvenDarazTaxAndFee.toLocaleString()}</strong> bante hain, to aapko Daraz par <strong>Rs. {calculation.breakEvenSellingPrice.toLocaleString()}+</strong> se zyada hi item list karna hoga taake aapko nuqsaan na ho aur munafa mile!
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 bg-slate-900/90 border border-amber-500/40 rounded-xl px-4 py-2 text-center">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
              Break-Even Minimum
            </span>
            <span className="text-base sm:text-lg font-black font-mono text-white">
              PKR {calculation.breakEvenSellingPrice.toLocaleString()}+
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Simple Inputs vs Complete Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* =========================================================================
            LEFT COLUMN: SIMPLE INPUTS (7 COLS)
        ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card 1: Product Selection or Custom Price */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold text-xs">
                  1
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Product & Purchase Cost
                </h2>
              </div>
              <span className="text-xs text-slate-400">Step 1 of 3</span>
            </div>

            {/* Quick Sourcing Catalog Dropdown */}
            {products.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-orange-400" />
                    <span>Listed Products Catalog se select karein (Optional):</span>
                  </span>
                  {selectedProductId && (
                    <button
                      onClick={() => setSelectedProductId('')}
                      className="text-[11px] text-orange-400 hover:underline"
                    >
                      Clear Selection
                    </button>
                  )}
                </label>
                <select
                  id="catalog-product-select"
                  value={selectedProductId}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-orange-500 focus:outline-none transition"
                >
                  <option value="">-- Ya direct price neechay enter karein --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Wholesale Cost: PKR {p.supplierCostPKR.toLocaleString()} | Retail: PKR {p.recSellingPricePKR.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Product Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Product Name / Title</label>
              <input
                id="product-title-input"
                type="text"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                placeholder="e.g. Wireless Bluetooth Earbuds / Smartwatch"
              />
            </div>

            {/* Product Cost Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-orange-400">
                  Product Purchase / Sourcing Price (PKR)
                </label>
                <span className="text-[11px] text-slate-400">Aapko kitne ki pari?</span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                  Rs.
                </span>
                <input
                  id="product-cost-input"
                  type="number"
                  min="0"
                  step="10"
                  value={sourcingCostPKR || ''}
                  onChange={(e) => setSourcingCostPKR(Number(e.target.value))}
                  className="w-full rounded-xl border border-orange-500/50 bg-slate-950 pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:border-orange-500 focus:outline-none"
                  placeholder="500"
                />
              </div>

              {/* Quick Cost Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
                {[300, 500, 750, 1000, 1500, 2000].map((cost) => (
                  <button
                    key={cost}
                    type="button"
                    onClick={() => setSourcingCostPKR(cost)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition border ${
                      sourcingCostPKR === cost
                        ? 'bg-orange-600 text-white border-orange-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    Rs. {cost}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Packaging Cost */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Daraz Flyer & Packaging Cost (PKR)</span>
                <span className="text-[11px] text-slate-400">Optional (Flyer / Bubble Wrap)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                  Rs.
                </span>
                <input
                  id="packaging-cost-input"
                  type="number"
                  min="0"
                  step="5"
                  value={packagingCostPKR || ''}
                  onChange={(e) => setPackagingCostPKR(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-3.5 py-2 text-xs font-mono text-white focus:border-orange-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Province VAT & Category Commission */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-mono font-bold text-xs">
                  2
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Province VAT & Category Commission
                </h2>
              </div>
              <span className="text-xs text-slate-400">Step 2 of 3</span>
            </div>

            {/* Province Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 block">
                Apna Province (Suba) Select Karein (VAT Rates):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PROVINCES_DATA.map((p) => {
                  const isSelected = selectedProvince === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelectedProvince(p.key)}
                      className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition-all border ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-950 ring-2 ring-orange-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-xs font-bold">{p.name}</span>
                      <span
                        className={`text-xs font-black font-mono mt-0.5 ${
                          isSelected ? 'text-white' : 'text-orange-400'
                        }`}
                      >
                        {p.vatPercent}% VAT
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                📌 <strong>Yeh VAT:</strong> Daraz ki Payment Fee (2.25%) aur Category Commission par apply hota hai ({province.authority}).
              </p>
            </div>

            {/* Category Commission */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  Daraz Category Commission
                </label>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {commissionRatePct}%
                </span>
              </div>
              <select
                id="category-commission-select"
                value={selectedCategory}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedCategory(val);
                  const found = DARAZ_CATEGORY_PRESETS.find((c) => c.name === val);
                  if (found) setCommissionRatePct(found.commissionPct);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
              >
                {DARAZ_CATEGORY_PRESETS.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.commissionPct}% Commission)
                  </option>
                ))}
              </select>

              {/* Slider for custom commission */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="3"
                  max="20"
                  step="0.5"
                  value={commissionRatePct}
                  onChange={(e) => setCommissionRatePct(Number(e.target.value))}
                  className="w-full accent-orange-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-white whitespace-nowrap w-12 text-right">
                  {commissionRatePct}%
                </span>
              </div>
            </div>

            {/* Official Daraz Policy Note */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-3 text-xs text-blue-200 flex items-start gap-2.5">
              <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-blue-300">Daraz Payment Fee Policy:</strong> Har delivered item par transaction value ka <strong>2.25%</strong> deduct hota hai (bank transfer fee ke tor par for both COD and Prepaid orders) + <strong>{province.vatPercent}% {province.name} VAT</strong>.
              </div>
            </div>
          </div>

          {/* Card 3: Target Profit / Direct Selling Price */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs">
                  3
                </span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  {activeMode === 'TARGET_PROFIT' ? 'Target Profit in Pocket' : 'Customer Selling Price'}
                </h2>
              </div>
              <span className="text-xs text-slate-400">Step 3 of 3</span>
            </div>

            {activeMode === 'TARGET_PROFIT' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-400">
                    Aap Jeb Mein Kitna Munafa (Net Profit) Rakhna Chahte Hain?
                  </label>
                  <span className="text-xs font-mono text-white font-bold">
                    PKR {desiredProfitPKR.toLocaleString()}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    Rs.
                  </span>
                  <input
                    id="target-profit-input"
                    type="number"
                    min="0"
                    step="50"
                    value={desiredProfitPKR || ''}
                    onChange={(e) => setDesiredProfitPKR(Number(e.target.value))}
                    className="w-full rounded-xl border border-emerald-500/50 bg-slate-950 pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:border-emerald-500 focus:outline-none"
                    placeholder="200"
                  />
                </div>

                {/* Profit Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Presets:</span>
                  {[0, 150, 200, 300, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDesiredProfitPKR(amt)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition border ${
                        desiredProfitPKR === amt
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {amt === 0 ? 'Break-Even (Rs. 0)' : `+Rs. ${amt}`}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-orange-400">
                    Daraz par Selling / Listing Price (PKR)
                  </label>
                  <span className="text-xs text-slate-400">Customer Price</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-slate-500">
                    Rs.
                  </span>
                  <input
                    id="selling-price-input"
                    type="number"
                    min="50"
                    step="50"
                    value={directSellingPricePKR || ''}
                    onChange={(e) => setDirectSellingPricePKR(Number(e.target.value))}
                    className="w-full rounded-xl border border-orange-500/50 bg-slate-950 pl-10 pr-3.5 py-2.5 text-base font-mono font-bold text-white focus:border-orange-500 focus:outline-none"
                    placeholder="850"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: RESULTS, RECEIPT & BREAKDOWN (5 COLS)
        ========================================================================= */}
        <div className="lg:col-span-5 space-y-5">
          {/* Main Key Result Card */}
          <div className="rounded-3xl border border-orange-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-emerald-500 to-teal-400" />

            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 border border-orange-500/30">
                Official Result
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {province.name} ({province.vatPercent}% VAT)
              </span>
            </div>

            {/* Primary Recommended Listing Price */}
            <div className="bg-slate-950/90 rounded-2xl border border-orange-500/30 p-5 mb-4 text-center shadow-inner">
              <span className="text-xs font-semibold text-slate-300 block mb-1">
                {activeMode === 'TARGET_PROFIT'
                  ? 'Daraz Par Yeh Price List Karein:'
                  : 'Customer Retail Price:'}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                PKR {calculation.sellingPrice.toLocaleString()}
              </div>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>All Fees, Taxes & VAT Covered!</span>
              </div>
            </div>

            {/* Secondary Metrics: Bank Transfer & Net Profit */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-xl bg-blue-950/30 border border-blue-500/30 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-0.5">
                  Bank Transfer Payout
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-blue-200 block">
                  PKR {calculation.netBankPayout.toFixed(0)}
                </span>
                <span className="text-[9px] text-blue-300/80">Daraz se bank mein aayega</span>
              </div>

              <div
                className={`rounded-xl p-3.5 border ${
                  calculation.isProfitable
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                }`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                    calculation.isProfitable ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  Net Profit in Pocket
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono block">
                  PKR {calculation.netProfitInPocket.toFixed(0)}
                </span>
                <span className="text-[9px] opacity-80">
                  Margin: {calculation.profitMarginPct.toFixed(1)}% | ROI: {calculation.roiPct.toFixed(0)}%
                </span>
              </div>
            </div>

            {/* Break-Even Warning Note */}
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs mb-5">
              <div className="flex items-center justify-between text-amber-300 font-semibold mb-1">
                <span>⚠️ Minimum Break-Even Listing:</span>
                <span className="font-mono font-bold">
                  PKR {calculation.breakEvenSellingPrice.toLocaleString()}+
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Agar aap Rs. {calculation.breakEvenSellingPrice.toLocaleString()} se kam par list karenge to Daraz tax & fees katne ke baad aapko nuqsaan hoga.
              </p>
            </div>

            {/* Detailed Itemized Receipt Statement */}
            <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5 text-orange-400" />
                  <span>Itemized Fee & Tax Statement</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono font-normal">Daraz.pk Rule</span>
              </h3>

              {/* Product Cost */}
              <div className="flex items-center justify-between text-slate-300">
                <span>Wholesale Product Cost:</span>
                <span className="font-mono font-semibold">
                  PKR {calculation.cost.toLocaleString()}
                </span>
              </div>

              {/* Packaging */}
              {calculation.packaging > 0 && (
                <div className="flex items-center justify-between text-slate-300">
                  <span>Packaging & Flyer:</span>
                  <span className="font-mono">
                    PKR {calculation.packaging.toLocaleString()}
                  </span>
                </div>
              )}

              {/* 1. Payment Fee (2.25% + VAT) */}
              <div className="rounded-xl bg-slate-950/70 p-2.5 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    <span>Payment Processing Fee (2.25%):</span>
                  </span>
                  <span className="font-mono">
                    PKR {calculation.paymentFeeBase.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pl-3">
                  <span>
                    + {province.name} VAT ({province.vatPercent}%):
                  </span>
                  <span className="font-mono text-slate-300">
                    PKR {calculation.paymentFeeVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-blue-300 text-[11px] font-bold border-t border-slate-800/80 pt-1 pl-3">
                  <span>Payment Fee with VAT:</span>
                  <span className="font-mono">
                    PKR {calculation.paymentFeeWithVat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* 2. Category Commission + VAT */}
              <div className="rounded-xl bg-slate-950/70 p-2.5 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-200 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                    <span>Category Commission ({commissionRatePct}%):</span>
                  </span>
                  <span className="font-mono">
                    PKR {calculation.commissionBase.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] pl-3">
                  <span>
                    + {province.name} VAT ({province.vatPercent}%):
                  </span>
                  <span className="font-mono text-slate-300">
                    PKR {calculation.commissionVat.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-orange-300 text-[11px] font-bold border-t border-slate-800/80 pt-1 pl-3">
                  <span>Commission with VAT:</span>
                  <span className="font-mono">
                    PKR {calculation.commissionWithVat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Deductions */}
              <div className="flex items-center justify-between text-rose-400 font-bold border-t border-slate-800 pt-2 text-xs">
                <span>Total Daraz Tax & Fees:</span>
                <span className="font-mono">
                  - PKR {calculation.totalDarazFeesAndTax.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 space-y-2">
              <button
                type="button"
                id="copy-pricing-receipt-btn"
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white py-3 px-4 text-xs font-bold transition shadow-lg shadow-orange-950 cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Receipt Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy Full Pricing Breakdown</span>
                  </>
                )}
              </button>

              {onSelectProductForOrder && (
                <button
                  type="button"
                  id="book-daraz-order-btn"
                  onClick={() => {
                    const sampleProduct: Product = {
                      id: selectedProductId || `custom-${Date.now()}`,
                      name: productTitle,
                      sku: `DARAZ-${Math.floor(1000 + Math.random() * 9000)}`,
                      supplierCostPKR: calculation.cost,
                      recSellingPricePKR: calculation.sellingPrice,
                      category: selectedCategory,
                      stock: 50,
                      isActive: true,
                      rating: 4.8,
                      mediaGallery: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'],
                    };
                    onSelectProductForOrder(sampleProduct, calculation.sellingPrice);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-4 text-xs font-semibold transition border border-slate-700"
                >
                  <ArrowRight className="h-4 w-4 text-orange-400" />
                  <span>Use This Price in COD Orders Hub</span>
                </button>
              )}
            </div>
          </div>

          {/* Daraz Official Math Formulas Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Exact Mathematical Formula Reference</span>
            </h4>
            <div className="font-mono text-[11px] text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div>1. Payment Fee = Unit Price × 2.25%</div>
              <div>2. VAT = Payment Fee × {province.vatPercent}% ({province.name})</div>
              <div>3. Payment Fee with VAT = Payment Fee + VAT</div>
              <div>4. Total Fee = (Payment Fee with VAT) + (Commission with VAT)</div>
              <div>5. Net Bank Payout = Unit Price - Total Fee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
