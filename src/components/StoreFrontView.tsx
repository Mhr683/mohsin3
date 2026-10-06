import React, { useState } from 'react';
import {
  Store as StoreIcon,
  ShieldCheck,
  Star,
  Truck,
  Clock,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Eye,
  Heart,
  Sparkles,
  Package,
  Layers,
  ChevronRight,
  BadgePercent,
  Check,
  X,
  Boxes,
  MessageCircle,
  Building,
  Send,
} from 'lucide-react';
import { Product, Store, User, ProfitGuardConfig, BankTransferDetails } from '../types';

interface StoreFrontViewProps {
  store: Store;
  allProducts: Product[];
  currentUser: User;
  profitGuardConfig: ProfitGuardConfig;
  bankTransferDetails?: BankTransferDetails;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onPlaceMultiOrder: (
    items: { product: Product; quantity: number; sellingPrice: number }[],
    customerDetails: {
      customerName: string;
      customerPhone: string;
      customerCity: string;
      customerAddress: string;
    },
    totalAmountPKR: number
  ) => void;
  onPlaceBulkOrder?: (bulkData: {
    store: Store;
    product: Product;
    quantity: number;
    tierUnitPricePKR: number;
    totalAmountPKR: number;
    deliveryMethod: 'CARGO_BILTY' | 'COURIER';
    resellerName: string;
    resellerPhone: string;
    resellerCity: string;
    deliveryAddress: string;
    notes?: string;
  }) => void;
}

export const StoreFrontView: React.FC<StoreFrontViewProps> = ({
  store,
  allProducts,
  currentUser,
  profitGuardConfig,
  bankTransferDetails,
  onBack,
  onSelectProduct,
  onPlaceMultiOrder,
  onPlaceBulkOrder,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Multi-Product Store Cart: Allows customer to add multiple products from this 1 store!
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wholesale Bulk Order Modal State (Direct Factory Sourcing)
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkProduct, setBulkProduct] = useState<Product | null>(null);
  const [bulkQuantity, setBulkQuantity] = useState<number>(50);
  const [bulkDeliveryMethod, setBulkDeliveryMethod] = useState<'CARGO_BILTY' | 'COURIER'>('CARGO_BILTY');
  const [bulkResellerName, setBulkResellerName] = useState(currentUser.name || '');
  const [bulkResellerPhone, setBulkResellerPhone] = useState(currentUser.phone || '+92 300 1234567');
  const [bulkResellerCity, setBulkResellerCity] = useState(currentUser.city || 'Lahore');
  const [bulkDeliveryAddress, setBulkDeliveryAddress] = useState('Main Commercial Adda / Cargo Station / Shop');
  const [bulkNotes, setBulkNotes] = useState('');
  const [bulkSuccessMessage, setBulkSuccessMessage] = useState<string | null>(null);

  // Customer Checkout Modal
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '+92 300 1234567');
  const [customerCity, setCustomerCity] = useState(currentUser.city || 'Lahore');
  const [customerAddress, setCustomerAddress] = useState('Flat # 4, Main Commercial Boulevard');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  // Filter products belonging to this specific store
  const storeProducts = allProducts.filter((p) => {
    // Check either storeId, supplierId, or supplierName
    const matchesStore =
      p.storeId === store.id ||
      p.supplierId === store.ownerId ||
      (p.supplierName && p.supplierName.toLowerCase().includes(store.name.toLowerCase())) ||
      (store.id === 'store-oshi' && (!p.storeId || p.supplierId === 'usr-1'));

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesStore && matchesSearch && matchesCat;
  });

  // Extract categories for this store
  const storeCategories = [
    'ALL',
    ...Array.from(
      new Set(
        allProducts
          .filter(
            (p) =>
              p.storeId === store.id ||
              p.supplierId === store.ownerId ||
              (store.id === 'store-oshi' && (!p.storeId || p.supplierId === 'usr-1'))
          )
          .map((p) => p.category)
      )
    ),
  ];

  // Cart operations
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Calculations
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.recSellingPricePKR * item.quantity,
    0
  );
  // Single consolidated shipping fee for ordering multiple items from 1 single store!
  const consolidatedShipping = cartItems.length > 0 ? profitGuardConfig.defaultShippingCostPKR || 250 : 0;
  const grandTotal = itemsSubtotal + consolidatedShipping;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Factory Tiered Wholesale Rate Calculator
  const getBulkTierDetails = (product: Product, qty: number) => {
    const baseWholesale = product.supplierCostPKR || Math.round(product.recSellingPricePKR * 0.7);
    let discountPct = 5;
    let tierName = 'Small Wholesale Lot (10-49 units)';
    if (qty >= 200) {
      discountPct = 25;
      tierName = 'Master Carton / Production Lot (200+ units)';
    } else if (qty >= 50) {
      discountPct = 15;
      tierName = 'Standard Wholesale Carton (50-199 units)';
    }

    const unitPrice = Math.round(baseWholesale * (1 - discountPct / 100));
    const totalAmount = unitPrice * qty;
    const estimatedCartons = Math.max(1, Math.ceil(qty / 50));
    const cargoEstimatePKR = estimatedCartons * 450; // Goods transport approx 450 PKR per carton
    return {
      baseWholesale,
      discountPct,
      tierName,
      unitPrice,
      totalAmount,
      estimatedCartons,
      cargoEstimatePKR,
    };
  };

  const openSupplierWhatsApp = (product?: Product, qty?: number) => {
    const targetProd = product || bulkProduct || storeProducts[0];
    const targetQty = qty || bulkQuantity || 50;
    const tier = targetProd ? getBulkTierDetails(targetProd, targetQty) : null;
    const whatsappNum = store.whatsapp || (store.phone ? store.phone.replace(/[^0-9]/g, '') : '923218899112');

    const msg = `Assalam o Alaikum! Mujhe aapke store "${store.name}" se Wholesale Bulk Order lena hai:
Product: ${targetProd ? targetProd.name : 'Wholesale Items'} (SKU: ${targetProd ? targetProd.sku : 'N/A'})
Quantity: ${targetQty} Units (${tier ? tier.estimatedCartons : 1} Cartons)
Tier Rate: PKR ${tier ? tier.unitPrice.toLocaleString() : 'N/A'}/piece
Total Estimated: PKR ${tier ? tier.totalAmount.toLocaleString() : 'N/A'}
Delivery City: ${bulkResellerCity} via Goods Transport (Bilty).
Kindly factory stock availability confirm karein.`;

    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleBulkOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProd = bulkProduct || storeProducts[0];
    if (!targetProd) return;

    const tier = getBulkTierDetails(targetProd, bulkQuantity);

    if (onPlaceBulkOrder) {
      onPlaceBulkOrder({
        store,
        product: targetProd,
        quantity: bulkQuantity,
        tierUnitPricePKR: tier.unitPrice,
        totalAmountPKR: tier.totalAmount,
        deliveryMethod: bulkDeliveryMethod,
        resellerName: bulkResellerName,
        resellerPhone: bulkResellerPhone,
        resellerCity: bulkResellerCity,
        deliveryAddress: bulkDeliveryAddress,
        notes: bulkNotes,
      });
    } else {
      // Fallback to onPlaceMultiOrder with wholesale bulk pricing
      onPlaceMultiOrder(
        [{ product: targetProd, quantity: bulkQuantity, sellingPrice: tier.unitPrice }],
        {
          customerName: `${bulkResellerName} (Wholesale Bulk Booking)`,
          customerPhone: bulkResellerPhone,
          customerCity: bulkResellerCity,
          customerAddress: `${bulkDeliveryAddress} [Delivery: ${bulkDeliveryMethod === 'CARGO_BILTY' ? 'Goods Transport Bilty Cargo' : 'Courier'}]`,
        },
        tier.totalAmount
      );
    }

    setIsBulkModalOpen(false);
    setBulkSuccessMessage(
      `🎉 Wholesale Bulk Order Registered! ${bulkQuantity} units of "${targetProd.name}" booked directly with supplier ${store.name}. Warehouse stock allocation in progress.`
    );
    setTimeout(() => setBulkSuccessMessage(null), 8000);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    onPlaceMultiOrder(
      cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        sellingPrice: item.product.recSellingPricePKR,
      })),
      {
        customerName,
        customerPhone,
        customerCity,
        customerAddress,
      },
      grandTotal
    );

    setIsCheckoutModalOpen(false);
    setCartItems([]);
    setOrderSuccessMessage(
      `🎉 Mubarak Ho! ${cartItems.length} Products ka combined store order COD dispatch ke liye place ho chuka hai.`
    );
    setTimeout(() => setOrderSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Navigation & Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          title="Go Back to Products (واپس جائیں)"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back (واپس)</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Wholesale Bulk Order Trigger */}
          <button
            onClick={() => {
              if (storeProducts.length > 0) {
                setBulkProduct(storeProducts[0]);
              }
              setIsBulkModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition cursor-pointer border border-emerald-400/30"
          >
            <Boxes className="h-4 w-4 text-emerald-200" />
            <span>Wholesale Bulk Order (تھوک مال)</span>
            <span className="rounded-full bg-emerald-950/80 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-200">
              Carton Rates
            </span>
          </button>

          {/* View Store Cart Floating Trigger */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition relative cursor-pointer"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Store Cart ({totalItemsCount} items)</span>
            {cartItems.length > 0 && (
              <span className="rounded-full bg-white px-2 py-0.2 text-[10px] font-black text-orange-600 font-mono">
                PKR {grandTotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {orderSuccessMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-bold text-emerald-200 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>{orderSuccessMessage}</span>
        </div>
      )}

      {bulkSuccessMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/50 p-4 text-xs font-bold text-emerald-200 flex items-center gap-3 shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          <span>{bulkSuccessMessage}</span>
        </div>
      )}

      {/* =========================================================================
          STORE BANNER & OFFICIAL HEADER
      ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
        {/* Banner Image */}
        <div className="h-36 sm:h-48 w-full overflow-hidden relative">
          <img
            src={store.banner}
            alt={store.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>

        {/* Store Profile Info Bar */}
        <div className="relative px-6 pb-6 pt-0 -mt-12 sm:-mt-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex items-start sm:items-end gap-4">
            {/* Store Logo */}
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden flex-shrink-0">
              <img
                src={store.logo}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Store Text Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Verified {store.ownerRole === 'SUPPLIER' ? 'Manufacturer' : 'Reseller'}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">ID: {store.verificationId}</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{store.name}</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{store.city}</span>
                </span>
                <span>•</span>
                <span className="text-slate-300">
                  Operated by <strong className="text-white">{store.ownerName}</strong>
                </span>
                <span>•</span>
                <span className="text-slate-400">{store.category}</span>
              </div>

              {/* Direct Supplier Coordination & Bulk Sourcing Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5">
                <span className="rounded-lg bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-orange-400" />
                  <span>Direct Factory Wholesale & Carton Sourcing Available</span>
                </span>
                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 text-[11px] font-bold flex items-center gap-1.5 transition"
                  >
                    <Phone className="h-3.5 w-3.5 text-blue-400" />
                    <span>{store.phone}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => openSupplierWhatsApp()}
                  className="rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-300" />
                  <span>WhatsApp Supplier</span>
                </button>
              </div>
            </div>
          </div>

          {/* Store Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 md:pt-0">
            {/* Rating */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{store.rating}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Store Rating</span>
            </div>

            {/* Delivery Rating */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 font-black text-xs">
                <Truck className="h-3.5 w-3.5" />
                <span>99% Fast</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">On-Time Dispatch</span>
            </div>

            {/* Response Rate */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 font-black text-xs">
                <Clock className="h-3.5 w-3.5" />
                <span>&lt; 15 mins</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Response Time</span>
            </div>

            {/* Total Orders */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-3.5 py-2 text-center">
              <div className="font-mono font-black text-white text-xs">
                {(store.totalOrders || 1200).toLocaleString()}+
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Orders Shipped</span>
            </div>
          </div>
        </div>

        {/* Store Benefits Notice */}
        <div className="bg-gradient-to-r from-orange-950/60 via-slate-950 to-slate-950 border-t border-slate-800 px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-orange-300 font-medium">
            <Sparkles className="h-4 w-4 text-orange-400 flex-shrink-0" />
            <span>
              <strong>Single Delivery Fee Guarantee:</strong> Is ek hi store se chahe 5 mukhtalif products mangwayein, courier charges sirf flat PKR 250 hi lagenge!
            </span>
          </div>
          <span className="rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold font-mono">
            Save PKR 750+ on Combined Shipping
          </span>
        </div>
      </div>

      {/* =========================================================================
          STORE PRODUCTS SECTION WITH SEARCH & CATEGORY
      ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black text-white">
              {store.name} ke Tamam Products ({storeProducts.length})
            </h2>
            <p className="text-xs text-slate-400">
              Is store ke items select karein aur aik sath 1 hi parcel mein COD deliver karwayein.
            </p>
          </div>

          {/* Search within store */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this store..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Categories Bar */}
        {storeCategories.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {storeCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Store Items' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {storeProducts.map((p) => {
            const inCart = cartItems.find((i) => i.product.id === p.id);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Image Container */}
                <div
                  onClick={() => onSelectProduct(p)}
                  className="relative aspect-square w-full bg-slate-50/70 p-3 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Stock: {p.stock}
                  </span>
                </div>

                {/* Body */}
                <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
                  <div className="space-y-1">
                    <h3
                      onClick={() => onSelectProduct(p)}
                      className="text-slate-900 text-xs sm:text-[13px] font-semibold leading-snug line-clamp-2 hover:text-orange-600 cursor-pointer transition-colors"
                      title={p.name}
                    >
                      {p.name}
                    </h3>

                    {/* Ratings line under product */}
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-semibold">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{p.rating || 4.8}</span>
                      <span className="text-slate-400 font-normal">
                        ({p.reviewsCount || Math.floor((p.salesCount || 100) * 0.15)} reviews)
                      </span>
                    </div>
                  </div>

                  {/* Price & Dual Order Actions (Retail COD Dropship vs Wholesale Bulk Carton) */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Selling (Retail/COD)</span>
                        <div className="text-slate-950 font-bold text-sm sm:text-base font-sans tracking-tight">
                          PKR {p.recSellingPricePKR.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-600 block font-bold">Wholesale Carton Rate</span>
                        <div className="text-emerald-700 font-black text-xs font-mono">
                          from PKR {getBulkTierDetails(p, 50).unitPrice.toLocaleString()}/pc
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {/* Bulk Wholesale Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setBulkProduct(p);
                          setIsBulkModalOpen(true);
                        }}
                        className="h-8 sm:h-8.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300/60 cursor-pointer shadow-xs"
                        title="Book Wholesale Bulk / Carton Order"
                      >
                        <Boxes className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Bulk (تھوک)</span>
                      </button>

                      {/* Add to Store Multi-Order Cart */}
                      <button
                        type="button"
                        onClick={() => addToCart(p)}
                        className={`h-8 sm:h-8.5 px-2 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition shadow-xs cursor-pointer ${
                          inCart
                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                            : 'bg-[#e35614] text-white hover:bg-[#cf4a0e]'
                        }`}
                        title="Add to Store Multi-Order Cart"
                      >
                        {inCart ? (
                          <>
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                            <span>({inCart.quantity})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                            <span>Add Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {storeProducts.length === 0 && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
            <Package className="h-8 w-8 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-bold text-slate-200">No products found in this store category</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="mt-3 rounded-xl bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-500"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          STORE CART DRAWER / SIDEBAR (MULTI-ORDER CAPABILITY)
      ========================================================================= */}
      {isCartOpen && (
        <div
          id="store-cart-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 flex flex-col justify-between shadow-2xl p-5 overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
                    <ShoppingCart className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-white">Store Order Cart</h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Store: {store.name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Notice */}
              <div className="mt-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Single consolidated shipping (PKR 250) for all items in this store!</span>
              </div>

              {/* Items List */}
              <div className="mt-4 space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-12 text-center text-slate-500">
                    <ShoppingCart className="h-10 w-10 mx-auto mb-2 text-slate-700" />
                    <p className="text-sm">Aapka store cart khali hai.</p>
                    <p className="text-xs">Product cards par 'Add' click karein.</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950 p-3 flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-14 w-14 rounded-xl object-contain bg-white p-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-orange-400 block">
                          PKR {item.product.recSellingPricePKR.toLocaleString()} × {item.quantity} = PKR{' '}
                          {(item.product.recSellingPricePKR * item.quantity).toLocaleString()}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="h-6 w-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-mono text-xs font-bold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="h-6 w-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Checkout Details */}
            {cartItems.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Products Subtotal ({totalItemsCount} items):</span>
                    <span className="font-mono text-slate-200">PKR {itemsSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Store Consolidated Courier Delivery:</span>
                    <span className="font-mono">PKR {consolidatedShipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                    <span>Grand Total (COD):</span>
                    <span className="font-mono text-orange-400">PKR {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(true)}
                  className="w-full rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black py-3 text-xs tracking-wide transition shadow-xl shadow-orange-950 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Order All {cartItems.length} Products Together (COD)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MULTI-ORDER CHECKOUT MODAL
      ========================================================================= */}
      {isCheckoutModalOpen && (
        <div
          id="multi-order-checkout-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
        >
          <div className="relative w-full max-w-lg rounded-3xl border border-orange-500/40 bg-slate-900 text-slate-100 shadow-2xl p-5 sm:p-6 space-y-4 my-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Place Single Combined Store Order (COD)
                </h3>
                <span className="text-xs text-orange-400 font-semibold">Store: {store.name}</span>
              </div>
              <button
                onClick={() => setIsCheckoutModalOpen(false)}
                className="rounded-full bg-slate-800 p-2 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Asad Ullah Khan"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Mobile Number (COD) *</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    placeholder="Karachi / Lahore / Islamabad"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Complete Delivery Address *</label>
                <textarea
                  rows={2}
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="House #, Street #, Sector, Landmark"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-white focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              {/* Order Summary box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Products:</span>
                  <span className="font-bold text-white">{cartItems.length} items ({totalItemsCount} units)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Consolidated Delivery:</span>
                  <span className="text-emerald-400 font-bold">PKR {consolidatedShipping} (Flat)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-slate-800">
                  <span>Pay on Cash on Delivery:</span>
                  <span className="text-orange-400 font-mono">PKR {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black py-3 text-xs tracking-wide transition shadow-xl cursor-pointer"
              >
                Confirm & Dispatch Multi-Order Parcel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          WHOLESALE BULK ORDER MODAL (Direct Factory Carton / B2B Sourcing)
      ========================================================================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1">
                    <Boxes className="h-3 w-3 text-emerald-400" />
                    <span>Direct Factory Wholesale (تھوک مال آرڈر)</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">Supplier: {store.name}</span>
                </div>
                <h3 className="text-lg font-black text-white tracking-tight">
                  Wholesale Bulk Booking & Carton Sourcing
                </h3>
                <p className="text-xs text-slate-400">
                  Resellers & shop owners direct factory rates par pura carton ya bulk lot order kar sakte hain.
                </p>
              </div>

              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBulkOrderSubmit} className="space-y-4 text-xs">
              {/* Product Selection */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-300">Select Product to Bulk Order *</label>
                <select
                  value={bulkProduct?.id || (storeProducts[0]?.id ?? '')}
                  onChange={(e) => {
                    const found = storeProducts.find((p) => p.id === e.target.value);
                    if (found) setBulkProduct(found);
                  }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-white focus:border-emerald-500 focus:outline-none"
                >
                  {storeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Retail: PKR {p.recSellingPricePKR.toLocaleString()} | Stock: {p.stock}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Product Summary & Live Tier Pricing */}
              {(() => {
                const activeProd = bulkProduct || storeProducts[0];
                if (!activeProd) return null;
                const tierInfo = getBulkTierDetails(activeProd, bulkQuantity);
                const tier1 = getBulkTierDetails(activeProd, 20);
                const tier2 = getBulkTierDetails(activeProd, 50);
                const tier3 = getBulkTierDetails(activeProd, 200);

                return (
                  <div className="space-y-3">
                    {/* Visual 3-Tier Pricing Cards */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block mb-1.5">
                        Factory Wholesale Slab Rates (زیادہ مال = کم ترین ریٹ):
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Tier 1 */}
                        <div
                          onClick={() => setBulkQuantity(25)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer text-center ${
                            bulkQuantity >= 10 && bulkQuantity < 50
                              ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-xs'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider">10 - 49 pcs</div>
                          <div className="text-xs sm:text-sm font-black text-white font-mono mt-0.5">
                            PKR {tier1.unitPrice.toLocaleString()}
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">5% Factory Off</span>
                        </div>

                        {/* Tier 2 */}
                        <div
                          onClick={() => setBulkQuantity(50)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer text-center relative ${
                            bulkQuantity >= 50 && bulkQuantity < 200
                              ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-xs'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                            Most Popular
                          </span>
                          <div className="text-[10px] font-bold uppercase tracking-wider">50 - 199 pcs (Carton)</div>
                          <div className="text-xs sm:text-sm font-black text-amber-300 font-mono mt-0.5">
                            PKR {tier2.unitPrice.toLocaleString()}
                          </div>
                          <span className="text-[9px] text-amber-400 font-semibold block mt-0.5">15% Carton Off</span>
                        </div>

                        {/* Tier 3 */}
                        <div
                          onClick={() => setBulkQuantity(200)}
                          className={`p-2.5 rounded-xl border transition cursor-pointer text-center ${
                            bulkQuantity >= 200
                              ? 'border-emerald-500 bg-emerald-950/40 text-white shadow-xs'
                              : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-[10px] font-bold uppercase tracking-wider">200+ pcs (Master Lot)</div>
                          <div className="text-xs sm:text-sm font-black text-emerald-300 font-mono mt-0.5">
                            PKR {tier3.unitPrice.toLocaleString()}
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">25% Factory Direct</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Selector with Quick Buttons */}
                    <div className="space-y-1.5 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <label className="font-semibold text-slate-200">Wholesale Quantity (Tadaad):</label>
                        <span className="font-mono text-emerald-400 font-bold">
                          {bulkQuantity} Units ({tierInfo.estimatedCartons} Carton{tierInfo.estimatedCartons > 1 ? 's' : ''})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setBulkQuantity((prev) => Math.max(10, prev - 10))}
                          className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black transition cursor-pointer"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min={10}
                          step={5}
                          value={bulkQuantity}
                          onChange={(e) => setBulkQuantity(Math.max(10, parseInt(e.target.value) || 10))}
                          className="flex-1 text-center font-mono font-black text-base rounded-xl border border-slate-700 bg-slate-900 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setBulkQuantity((prev) => prev + 10)}
                          className="h-9 w-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-black transition cursor-pointer"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quick select pills */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-400">Quick Pick:</span>
                        {[20, 50, 100, 200, 500].map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => setBulkQuantity(qty)}
                            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition cursor-pointer ${
                              bulkQuantity === qty
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {qty} pcs {qty === 50 ? '(1 Ctn)' : qty === 100 ? '(2 Ctn)' : ''}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Live Calculation Output Card */}
                    <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 p-3.5 space-y-1.5">
                      <div className="flex justify-between text-slate-300">
                        <span>Wholesale Tier Rate:</span>
                        <span className="font-mono font-bold text-white">PKR {tierInfo.unitPrice.toLocaleString()} / piece</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Total Quantity Booked:</span>
                        <span className="font-mono font-bold text-white">
                          {bulkQuantity} Units (~{tierInfo.estimatedCartons} Master Cartons)
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Goods Transport (Bilty) Adda Estimate:</span>
                        <span className="font-mono text-amber-300">~PKR {tierInfo.cargoEstimatePKR.toLocaleString()} (Paid at Adda)</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                        <span>Total Sourcing Amount:</span>
                        <span className="text-emerald-400 font-mono text-base">
                          PKR {tierInfo.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Delivery / Transport Method Selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Transport & Dispatch Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setBulkDeliveryMethod('CARGO_BILTY')}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      bulkDeliveryMethod === 'CARGO_BILTY'
                        ? 'border-emerald-500 bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 text-xs text-white">
                      <Truck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Goods Transport Bilty (بلٹی اڈہ)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Faisal Movers / Niazi Cargo / Al-Rehman. Flat ~PKR 450/carton paid on arrival at adda.
                    </p>
                  </div>

                  <div
                    onClick={() => setBulkDeliveryMethod('COURIER')}
                    className={`p-2.5 rounded-xl border transition cursor-pointer ${
                      bulkDeliveryMethod === 'COURIER'
                        ? 'border-emerald-500 bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5 text-xs text-white">
                      <Package className="h-3.5 w-3.5 text-blue-400" />
                      <span>Express Courier (Doorstep)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      TCS / Leopards direct doorstep delivery for smaller lots (charges by weight).
                    </p>
                  </div>
                </div>
              </div>

              {/* Reseller Business Contact Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Reseller / Shop Name *</label>
                  <input
                    type="text"
                    required
                    value={bulkResellerName}
                    onChange={(e) => setBulkResellerName(e.target.value)}
                    placeholder="e.g. Al-Madina Electronics / Ahmad"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">WhatsApp / Phone *</label>
                  <input
                    type="text"
                    required
                    value={bulkResellerPhone}
                    onChange={(e) => setBulkResellerPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={bulkResellerCity}
                    onChange={(e) => setBulkResellerCity(e.target.value)}
                    placeholder="e.g. Multan / Faisalabad / Rawalpindi"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">
                    {bulkDeliveryMethod === 'CARGO_BILTY' ? 'Cargo Station / Adda Name' : 'Shop / Warehouse Address'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={bulkDeliveryAddress}
                    onChange={(e) => setBulkDeliveryAddress(e.target.value)}
                    placeholder="e.g. General Bus Stand Goods Adda"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Packaging / Carton Marking Instructions (Optional)</label>
                <input
                  type="text"
                  value={bulkNotes}
                  onChange={(e) => setBulkNotes(e.target.value)}
                  placeholder="e.g. Heavy cartoon taping, print our shop brand mark on carton"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="submit"
                  className="w-full sm:flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 text-xs tracking-wide transition shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  <Boxes className="h-4 w-4" />
                  <span>Confirm & Book Wholesale Bulk Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => openSupplierWhatsApp(bulkProduct || storeProducts[0], bulkQuantity)}
                  className="w-full sm:w-auto px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold py-3 text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Supplier</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
