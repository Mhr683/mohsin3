import React, { useState } from 'react';
import { X, MessageSquare, CheckCircle, XCircle, Send, Phone, ShieldCheck } from 'lucide-react';
import { Order } from '../types';

interface WhatsAppVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmVerification: (orderId: string, method: string) => void;
  onRejectOrder: (orderId: string, reason?: string) => void;
}

export const WhatsAppVerificationModal: React.FC<WhatsAppVerificationModalProps> = ({
  isOpen,
  onClose,
  order,
  onConfirmVerification,
  onRejectOrder,
}) => {
  const [rejectReason, setRejectReason] = useState('Customer requested order cancellation');

  if (!isOpen || !order) return null;

  const orderId = order.id || order.orderNumber || '';

  const handleOpenDirectWhatsApp = () => {
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const formatted = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
    const msg = `Assalam-o-Alaikum ${order.customerName}! 📦\n\nYour YourMart order *#${order.orderNumber || order.id}* for *${order.productName || 'Wholesale Item'}* (Total: Rs. ${order.sellingPricePKR.toLocaleString()} Cash on Delivery) is ready for dispatch to ${order.customerAddress}, ${order.customerCity}.\n\nPlease reply *1* to Confirm or *2* to Cancel. Thank you!`;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">WhatsApp COD Verification Bot</h3>
              <p className="text-xs text-slate-400">Order #{order.orderNumber || order.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer Details Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Customer Name:</span>
            <strong className="text-white">{order.customerName}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">WhatsApp Phone:</span>
            <strong className="text-emerald-400 font-mono">{order.customerPhone}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">City / Delivery Address:</span>
            <span className="text-slate-300 text-right truncate max-w-[200px]">{order.customerCity}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-900">
            <span className="text-slate-400">COD Total:</span>
            <span className="text-sm font-black font-mono text-emerald-400">
              PKR {order.sellingPricePKR.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleOpenDirectWhatsApp}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Send className="w-4 h-4" />
            <span>Open Interactive WhatsApp Chat</span>
          </button>

          <button
            onClick={() => onConfirmVerification(orderId, 'WHATSAPP_BOT')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-emerald-500/30"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Mark as Customer Verified (Ready for Courier)</span>
          </button>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => onRejectOrder(orderId, rejectReason)}
              className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-rose-500/20"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel / Reject Fake COD Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
