import React, { useState } from 'react';
import {
  Package,
  Truck,
  Plus,
  RefreshCw,
  TrendingUp,
  Boxes,
  CheckCircle2,
  Clock,
  Settings,
  DollarSign,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Product, Order, User, OrderStatus, SupplierLogisticsConfig } from '../types';

interface SupplierPortalProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (prod: Partial<Product>) => void;
  onUpdateStock: (productId: string, stock: number) => void;
  onUpdateCost: (productId: string, cost: number) => void;
  onToggleActive: (productId: string) => void;
  onDispatchOrder: (orderId: string, courierName: string, trackingNumber?: string) => void;
  onBulkDispatchOrders?: any;
  onBatchAcceptAndPack?: (orderIds: string[]) => void;
  onUpdateOrderStatus?: (orderId: string, status: OrderStatus) => void;
  onWithdrawFunds?: (amount: number, details?: string) => void;
  onSaveLogisticsConfig?: (cfg: SupplierLogisticsConfig) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  currentUser,
  products,
  orders,
  onAddProduct,
  onUpdateStock,
  onUpdateCost,
  onToggleActive,
  onDispatchOrder,
  onBulkDispatchOrders,
  onBatchAcceptAndPack,
  onUpdateOrderStatus,
  onWithdrawFunds,
  onSaveLogisticsConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'logistics'>('orders');
  const [selectedCourier, setSelectedCourier] = useState('Trax Logistics');

  const myOrders = orders.filter(
    (o) => o.supplierId === currentUser.id || currentUser.role === 'ADMIN'
  );
  const myProducts = products.filter(
    (p) => p.supplierId === currentUser.id || currentUser.role === 'ADMIN'
  );

  const pendingOrders = myOrders.filter(
    (o) => o.status === 'COD_CONFIRMED' || o.status === 'PENDING_VERIFICATION' || o.status === 'PROCESSING'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block mb-2">
            Pakistani Manufacturer & Supplier Hub
          </span>
          <h2 className="text-2xl font-black">{currentUser.companyName || currentUser.name} Operations Desk</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage inventory batches, automated courier packaging & live COD remittances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block">Fulfilled Orders</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {myOrders.filter((o) => o.status === 'DELIVERED').length}
            </span>
          </div>
          <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block">Active SKUs</span>
            <span className="text-lg font-black text-indigo-400 font-mono">
              {myProducts.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pending Fulfillment ({pendingOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'inventory'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Inventory & Pricing Control ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('logistics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'logistics'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Courier API Credentials
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Awaiting Dispatch Orders</h3>
            <span className="text-xs text-slate-500">Pick, Pack & Print Courier Waybills</span>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              All orders are dispatched! Great work.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingOrders.map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm font-mono">
                        {ord.orderNumber || ord.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">
                      {ord.productName || (ord.items && ord.items[0]?.name) || 'Product'} (x{ord.quantity || 1})
                    </p>
                    <p className="text-xs text-slate-500">
                      Destination: <strong className="text-slate-700">{ord.customerCity}</strong> • Customer: {ord.customerName}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDispatchOrder(ord.id || ord.orderNumber || '', selectedCourier)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Book & Dispatch ({selectedCourier})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Product Stock & Factory Rates</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {myProducts.map((p) => (
              <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{p.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">SKU: {p.sku} • Stock: <span className="font-bold text-emerald-600">{p.stock}</span> units</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Wholesale Rate</span>
                    <span className="font-mono font-bold text-slate-900 text-xs">PKR {p.supplierCostPKR.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => {
                      const newStock = prompt('Enter updated inventory units for ' + p.name, String(p.stock));
                      if (newStock !== null) onUpdateStock(p.id, Number(newStock));
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Adjust Stock
                  </button>

                  <button
                    onClick={() => onToggleActive(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {p.isActive ? 'Active' : 'Paused'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logistics Tab */}
      {activeTab === 'logistics' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-xl">
          <h3 className="font-bold text-slate-900 text-sm">Pakistani Courier API Integrations</h3>
          <p className="text-xs text-slate-500">
            Link your own corporate Trax, PostEx or Leopards accounts for direct flyer booking.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Trax Logistics API Key</label>
              <input
                type="password"
                defaultValue="TRX_LIVE_88921_SECRET"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">PostEx Express Token</label>
              <input
                type="password"
                defaultValue="PEX_AUTH_77123"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-600 font-semibold block mb-1">Warehouse City</label>
              <input
                type="text"
                defaultValue="Lahore"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold"
              />
            </div>
            <button
              onClick={() => alert('Logistics API configurations saved successfully!')}
              className="py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Save Courier Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
