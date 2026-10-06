import React, { useState } from 'react';
import {
  Truck,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Link2,
  ExternalLink,
  Zap,
  PackageCheck,
  Building2,
  ArrowRight,
  Info,
  X,
  RefreshCw,
} from 'lucide-react';
import { Order, User } from '../types';
import {
  SUPPORTED_COURIERS,
  getCourierTrackingUrl,
  generateAutoTrackingNumber,
} from '../utils/courierTracking';

interface SupplierTrackingUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
  orders: Order[];
  onDispatchOrder: (orderId: string, courierName: string, trackingNumber: string) => void;
  onBulkDispatchOrders?: (dispatches: { orderId: string; courierName: string; trackingNumber: string }[]) => void;
}

export const SupplierTrackingUploadModal: React.FC<SupplierTrackingUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  orders,
  onDispatchOrder,
  onBulkDispatchOrders,
}) => {
  const [activeMode, setActiveMode] = useState<'SINGLE' | 'BULK_CSV' | 'AUTO_API'>('AUTO_API');

  // Supplier-specific confirmed orders ready for fulfillment
  const readyOrders = orders.filter((o) => {
    const isSupplierMatch =
      currentUser?.role === 'ADMIN' || o.supplierId === currentUser?.id;
    const isReadyStatus = o.status === 'COD_CONFIRMED' || o.status === 'PENDING_VERIFICATION';
    return isSupplierMatch && isReadyStatus;
  });

  // Single order form state
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    readyOrders[0]?.id || ''
  );
  const [selectedCourier, setSelectedCourier] = useState<string>('Trax Logistics');
  const [manualTrackingNumber, setManualTrackingNumber] = useState<string>('');
  const [isSimulatingApi, setIsSimulatingApi] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  // Bulk CSV upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedCsvRows, setParsedCsvRows] = useState<
    { orderId: string; courierName: string; trackingNumber: string; valid: boolean; reason?: string }[]
  >([]);

  if (!isOpen) return null;

  const currentSelectedOrder = orders.find((o) => o.id === selectedOrderId) || readyOrders[0];

  // A. Auto Courier API Booking
  const handleAutoApiBooking = (orderId: string) => {
    setIsSimulatingApi(true);
    setFeedbackSuccess(null);
    setFeedbackError(null);

    setTimeout(() => {
      const generatedCn = generateAutoTrackingNumber(selectedCourier);
      onDispatchOrder(orderId, selectedCourier, generatedCn);
      setIsSimulatingApi(false);
      setFeedbackSuccess(
        `✓ Courier API Booking Successful! ${selectedCourier} generated CN #${generatedCn}. Order status updated to DISPATCHED.`
      );
    }, 900);
  };

  // B. Manual Tracking ID Upload
  const handleManualUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(null);
    setFeedbackError(null);

    if (!selectedOrderId) {
      setFeedbackError('Please select an order to dispatch.');
      return;
    }
    if (!manualTrackingNumber.trim()) {
      setFeedbackError('Please enter a valid Tracking / Consignment Number (CN).');
      return;
    }

    onDispatchOrder(selectedOrderId, selectedCourier, manualTrackingNumber.trim());
    setFeedbackSuccess(
      `✓ Tracking ID #${manualTrackingNumber.trim()} uploaded for ${currentSelectedOrder?.orderNumber}. Status marked DISPATCHED!`
    );
    setManualTrackingNumber('');
  };

  // D. CSV Bulk Upload Processing
  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      // Skip header if contains 'order'
      const dataRows = lines[0].toLowerCase().includes('order') ? lines.slice(1) : lines;

      const parsed = dataRows.map((line) => {
        const parts = line.split(',').map((p) => p.trim());
        const orderIdOrNum = parts[0] || '';
        const courier = parts[1] || 'Trax Logistics';
        const tracking = parts[2] || '';

        // Match order
        const matchedOrder = orders.find(
          (o) =>
            o.id === orderIdOrNum ||
            o.orderNumber?.toLowerCase() === orderIdOrNum.toLowerCase()
        );

        if (!matchedOrder) {
          return {
            orderId: orderIdOrNum,
            courierName: courier,
            trackingNumber: tracking,
            valid: false,
            reason: 'Order ID not found in system',
          };
        }

        if (!tracking) {
          return {
            orderId: matchedOrder.id || '',
            courierName: courier,
            trackingNumber: '',
            valid: false,
            reason: 'Missing Tracking Number',
          };
        }

        return {
          orderId: matchedOrder.id || '',
          courierName: courier,
          trackingNumber: tracking,
          valid: true,
        };
      });

      setParsedCsvRows(parsed);
    };
    reader.readAsText(file);
  };

  const handleApplyBulkCsv = () => {
    const validRows = parsedCsvRows.filter((r) => r.valid);
    if (validRows.length === 0) {
      setFeedbackError('No valid rows found to update in CSV.');
      return;
    }

    if (onBulkDispatchOrders) {
      onBulkDispatchOrders(validRows);
    } else {
      validRows.forEach((r) => onDispatchOrder(r.orderId, r.courierName, r.trackingNumber));
    }

    setFeedbackSuccess(`✓ Successfully uploaded tracking IDs for ${validRows.length} orders via Bulk CSV!`);
    setCsvFile(null);
    setParsedCsvRows([]);
  };

  const previewTrackingUrl = manualTrackingNumber
    ? getCourierTrackingUrl(selectedCourier, manualTrackingNumber)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                  SUPPLIER DISPATCH ENGINE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {readyOrders.length} Orders Awaiting Courier Fulfillment
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Upload & Sync Order Tracking ID (Consignment No)
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Feedback Alerts */}
        {feedbackSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-semibold text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{feedbackSuccess}</span>
          </div>
        )}
        {feedbackError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs font-semibold text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{feedbackError}</span>
          </div>
        )}

        {/* 4 Mode Navigation Tabs */}
        <div className="px-6 pt-4 border-b border-slate-800 flex flex-wrap gap-2">
          <button
            onClick={() => {
              setActiveMode('AUTO_API');
              setFeedbackSuccess(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'AUTO_API'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>A. Direct Courier API (1-Click Auto Booking)</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('SINGLE');
              setFeedbackSuccess(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'SINGLE'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>B. Manual Tracking ID & Courier Input</span>
          </button>

          <button
            onClick={() => {
              setActiveMode('BULK_CSV');
              setFeedbackSuccess(null);
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
              activeMode === 'BULK_CSV'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>D. Bulk CSV Upload (100+ Orders)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[68vh] overflow-y-auto">
          {/* Option A: Direct Courier API Integration */}
          {activeMode === 'AUTO_API' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-3">
                <Zap className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-white text-sm">Direct Courier API Automated Booking:</b>
                  <p className="mt-1 text-slate-300 leading-relaxed">
                    Supplier warehouse parcel pack karke single click par courier API (Trax, PostEx, Leopard, TCS) ke sath live booking karta hai. System automatically parcel CN Number generate karega, order status ko <b>DISPATCHED</b> karega, aur Reseller dashboard par live tracking link broadcast kar dega.
                  </p>
                </div>
              </div>

              {readyOrders.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs">
                  <PackageCheck className="h-8 w-8 mx-auto text-emerald-400 mb-2" />
                  <p className="font-semibold text-white">All pending orders are already dispatched!</p>
                  <p className="text-slate-500 mt-1">Naye orders receive hote hi yahan appear honge.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Order for 1-Click Courier Booking
                  </label>
                  <div className="space-y-2.5">
                    {readyOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 hover:border-purple-600/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-white text-sm">
                              {ord.orderNumber}
                            </span>
                            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                              PKR {ord.sellingPricePKR.toLocaleString()} COD
                            </span>
                            <span className="text-[10px] text-amber-400 font-medium">
                              Reseller: {ord.resellerName || 'Dropshipper'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">
                            <b>Customer:</b> {ord.customerName} ({ord.customerPhone}) • {ord.customerCity}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            <b>Address:</b> {ord.customerAddress}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <select
                            value={selectedCourier}
                            onChange={(e) => setSelectedCourier(e.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                          >
                            {SUPPORTED_COURIERS.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name} (API Live)
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => handleAutoApiBooking(ord.id!)}
                            disabled={isSimulatingApi}
                            className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white shadow-lg transition"
                          >
                            {isSimulatingApi ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Booking CN...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="h-3.5 w-3.5" />
                                <span>Dispatch via API</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Option B & C: Manual Tracking ID & Live Link Generator */}
          {activeMode === 'SINGLE' && (
            <form onSubmit={handleManualUpload} className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>
                  Jab aap manually parcel book karein, toh courier se milne wala <b>CN / Tracking Number</b> aur <b>Courier Company</b> select karein. System automatically official tracking URL generate kar dega (C. Live Tracking Link Generator).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Select Order */}
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    1. Select Order to Dispatch
                  </label>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    {readyOrders.length === 0 ? (
                      <option value="">No pending orders</option>
                    ) : (
                      readyOrders.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.orderNumber} - {o.customerName} ({o.customerCity})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Select Courier */}
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase">
                    2. Courier Company
                  </label>
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    {SUPPORTED_COURIERS.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Custom Courier">Other / Private Cargo Bilty</option>
                  </select>
                </div>
              </div>

              {/* Tracking ID input */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase flex items-center justify-between">
                  <span>3. Consignment Number (CN) / Tracking ID</span>
                  <span className="text-[11px] text-slate-500 normal-case font-normal">
                    E.g. TRX-7829104, TCS-98214, PEX-104928
                  </span>
                </label>
                <div className="mt-1.5 relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter Tracking ID provided by Courier receipt..."
                    value={manualTrackingNumber}
                    onChange={(e) => setManualTrackingNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 font-mono text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* C. Live Tracking Link Generator Preview */}
              {previewTrackingUrl && (
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Generated Official Courier Tracking URL:
                    </span>
                    <span className="text-[10px] text-slate-500">Live Web Link</span>
                  </div>
                  <a
                    href={previewTrackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block font-mono text-xs text-cyan-400 underline truncate hover:text-cyan-300"
                  >
                    {previewTrackingUrl}
                  </a>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-6 py-2.5 text-xs font-bold text-white shadow-xl transition"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Update Status to DISPATCHED & Broadcast Tracking</span>
                </button>
              </div>
            </form>
          )}

          {/* Option D: Bulk CSV Upload (Large Suppliers 100+ Orders) */}
          {activeMode === 'BULK_CSV' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b className="text-white text-sm">Bulk CSV Upload for Daily 100+ Dispatches:</b>
                  <p className="mt-1 text-slate-400 leading-relaxed">
                    Upload a CSV file containing columns: <code className="text-emerald-300">Order_ID, Courier_Name, Tracking_Number</code>. Ek click mein sab orders ka status Dispatched ho jayega aur unke respective Resellers ko tracking mil jayegi.
                  </p>
                </div>
              </div>

              {/* CSV Upload Zone */}
              <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/40 p-6 text-center hover:border-purple-500 transition">
                <FileSpreadsheet className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-semibold">
                  {csvFile ? csvFile.name : 'Select or Drag & Drop Supplier Dispatch CSV'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: Order_ID, Courier_Name, Tracking_Number
                </p>
                <label className="mt-3 inline-block cursor-pointer rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white transition border border-slate-700">
                  Browse CSV File
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Download Helper */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Need sample CSV format?</span>
                <button
                  type="button"
                  onClick={() => {
                    const sample = "Order_ID,Courier_Name,Tracking_Number\nYM-98214,Trax Logistics,TRX-82910482-PK\nYM-98215,PostEx COD,PEX-9921401";
                    const blob = new Blob([sample], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'supplier_tracking_sample.csv';
                    a.click();
                  }}
                  className="text-purple-400 hover:text-purple-300 underline font-medium"
                >
                  Download Sample CSV
                </button>
              </div>

              {/* Parsed CSV Preview */}
              {parsedCsvRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">
                      Parsed CSV Data ({parsedCsvRows.length} rows)
                    </span>
                    <span className="text-emerald-400 font-bold">
                      {parsedCsvRows.filter((r) => r.valid).length} Ready for Upload
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase">
                        <tr>
                          <th className="p-2">Order ID</th>
                          <th className="p-2">Courier</th>
                          <th className="p-2">Tracking ID</th>
                          <th className="p-2">Validation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {parsedCsvRows.map((r, i) => (
                          <tr key={i} className={r.valid ? 'bg-emerald-950/20' : 'bg-rose-950/20'}>
                            <td className="p-2 font-mono">{r.orderId}</td>
                            <td className="p-2">{r.courierName}</td>
                            <td className="p-2 font-mono text-cyan-300">{r.trackingNumber}</td>
                            <td className="p-2">
                              {r.valid ? (
                                <span className="text-emerald-400 font-bold">✓ Ready</span>
                              ) : (
                                <span className="text-rose-400">{r.reason}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleApplyBulkCsv}
                    className="w-full mt-3 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white shadow-lg transition"
                  >
                    Apply Bulk Dispatches ({parsedCsvRows.filter((r) => r.valid).length} Orders)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950/90 p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Couriers: Trax • PostEx • Leopard • TCS • CallCourier</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
