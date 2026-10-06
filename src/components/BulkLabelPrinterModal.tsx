import React, { useState } from 'react';
import {
  Printer,
  Barcode,
  Package,
  CheckSquare,
  Square,
  FileText,
  Truck,
  MapPin,
  X,
  Download
} from 'lucide-react';
import { Order } from '../types';

interface BulkLabelPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const BulkLabelPrinterModal: React.FC<BulkLabelPrinterModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(() =>
    orders.slice(0, 4).map((o) => o.id)
  );
  const [labelFormat, setLabelFormat] = useState<'4x6_THERMAL' | 'A4_SHEET'>('4x6_THERMAL');

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedOrders = orders.filter((o) => selectedOrderIds.includes(o.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-800/80 p-5 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Batch 4x6 Thermal Shipping Label Printer</h3>
              <p className="text-xs text-slate-400">
                Direct Courier Barcode Generation for TCS, Trax, PostEx & Leopards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={selectAll}
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
            >
              {selectedOrderIds.length === orders.length ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>Select All ({selectedOrderIds.length}/{orders.length})</span>
            </button>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
              <span className="text-slate-400 px-2">Format:</span>
              <button
                onClick={() => setLabelFormat('4x6_THERMAL')}
                className={`px-2.5 py-1 rounded font-bold ${
                  labelFormat === '4x6_THERMAL' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                4x6 Standard Thermal
              </button>
              <button
                onClick={() => setLabelFormat('A4_SHEET')}
                className={`px-2.5 py-1 rounded font-bold ${
                  labelFormat === 'A4_SHEET' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                A4 (4 per page)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={selectedOrders.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-950/40 transition disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>Print {selectedOrders.length} Labels Now</span>
            </button>
          </div>
        </div>

        {/* Labels Preview Canvas */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedOrders.map((order) => {
              const trackingNumber = order.trackingNumber || `TRK-${order.id.replace('ORD-', '')}-PK`;
              const courier = order.courierPartner || 'PostEx Express';
              const totalAmount = order.totalAmountPKR || 3200;

              return (
                <div
                  key={order.id}
                  className="bg-white text-slate-950 rounded-xl p-5 border-2 border-slate-900 shadow-xl space-y-3 font-sans relative"
                >
                  {/* Courier & Tracking Barcode Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-950 pb-3">
                    <div>
                      <div className="text-xl font-black tracking-tight uppercase">{courier}</div>
                      <div className="text-xs font-bold text-slate-700">Cash on Delivery (COD)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 font-bold">Standard Flyer Service</div>
                      <div className="text-2xl font-black text-slate-950">Rs. {totalAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Mock Barcode Graphic */}
                  <div className="bg-slate-100 p-2.5 rounded text-center border border-slate-300">
                    <div className="font-mono text-2xl font-bold tracking-widest py-1 flex items-center justify-center gap-1">
                      ||||| | |||| ||| || |||||| ||||| |||
                    </div>
                    <div className="font-mono text-xs font-bold text-slate-800 tracking-wider">
                      {trackingNumber}
                    </div>
                  </div>

                  {/* Consignee Address */}
                  <div className="border-b border-slate-300 pb-2 text-xs space-y-1">
                    <div className="font-extrabold text-sm uppercase text-slate-900">
                      Deliver To: {order.customerName}
                    </div>
                    <div className="text-slate-700 font-medium">
                      Phone: <span className="font-bold text-slate-950">{order.customerPhone}</span>
                    </div>
                    <div className="text-slate-800 leading-snug">
                      Address: {order.shippingAddress}, {order.city}
                    </div>
                  </div>

                  {/* Sender Origin */}
                  <div className="flex justify-between items-center text-[10px] text-slate-600 pt-1">
                    <div>
                      <span className="font-bold">Shipper:</span> YourMart Hub (Terminal 01)
                    </div>
                    <div>
                      <span className="font-bold">Order ID:</span> {order.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
