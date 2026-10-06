import React, { useState } from 'react';
import { Order, RtoClaim } from '../types';
import {
  RotateCcw,
  AlertTriangle,
  PackageCheck,
  ShieldAlert,
  CheckCircle,
  Truck,
  Building,
} from 'lucide-react';

interface ReverseLogisticsRtoViewProps {
  orders: Order[];
  onRestockOrder?: (orderId: string) => void;
}

export const ReverseLogisticsRtoView: React.FC<ReverseLogisticsRtoViewProps> = ({
  orders,
  onRestockOrder,
}) => {
  const [restockedMap, setRestockedMap] = useState<Record<string, boolean>>({});

  const rtoOrders = orders.filter(
    (o) => o.status === 'RETURNED' || o.status === 'CANCELLED'
  );

  const handleRestock = (ordId: string) => {
    setRestockedMap((prev) => ({ ...prev, [ordId]: true }));
    if (onRestockOrder) onRestockOrder(ordId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 inline-block mb-2">
            Reverse Logistics & Warehouse Restocking Hub
          </span>
          <h2 className="text-2xl font-black">RTO (Return to Origin) & Claims Manager</h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated courier reverse tracking, warehouse inspection & supplier inventory restocking.
          </p>
        </div>

        <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-right">
          <span className="text-[10px] text-slate-400 block font-semibold">Total RTO Parcels</span>
          <span className="text-2xl font-black text-rose-400 font-mono">
            {rtoOrders.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Returned Customer Parcels</h3>

        {rtoOrders.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            🎉 Excellent performance! No RTO return parcels found. High delivery success rate.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {rtoOrders.map((ord) => {
              const id = ord.id || ord.orderNumber || '';
              const isRestocked = restockedMap[id];

              return (
                <div key={id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        #{ord.orderNumber || ord.id}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        RTO Returned
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-semibold">
                      {ord.productName || 'Wholesale SKU'} • Return Reason: Customer Refused at Doorstep
                    </p>
                    <p className="text-xs text-slate-500">
                      Courier: <strong>{ord.courierName || 'Trax'}</strong> • Tracking: <span className="font-mono">{ord.trackingNumber || 'Pending'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isRestocked ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Restocked to Warehouse</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRestock(id)}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Inspect & Restock (+1 Unit)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
