export interface SupportedCourierItem {
  id: string;
  name: string;
  code: string;
  trackingPrefix: string;
  trackingBaseUrl: string;
}

export const SUPPORTED_COURIERS: SupportedCourierItem[] = [
  {
    id: 'trax',
    name: 'Trax Logistics',
    code: 'TRAX',
    trackingPrefix: 'TRX',
    trackingBaseUrl: 'https://sonic.pk/tracking?tracking_number=',
  },
  {
    id: 'postex',
    name: 'PostEx Express',
    code: 'POSTEX',
    trackingPrefix: 'PEX',
    trackingBaseUrl: 'https://postex.pk/tracking?cn=',
  },
  {
    id: 'tcs',
    name: 'TCS Express',
    code: 'TCS',
    trackingPrefix: 'TCS',
    trackingBaseUrl: 'https://www.tcsexpress.com/tracking?track=',
  },
  {
    id: 'leopards',
    name: 'Leopards Courier',
    code: 'LEOPARDS',
    trackingPrefix: 'LEO',
    trackingBaseUrl: 'https://leopardscourier.com/tracking?trackNo=',
  },
  {
    id: 'callcourier',
    name: 'Call Courier',
    code: 'CALLCOURIER',
    trackingPrefix: 'CC',
    trackingBaseUrl: 'https://callcourier.com.pk/tracking/?cn=',
  },
  {
    id: 'mnp',
    name: 'M&P Express',
    code: 'MNP',
    trackingPrefix: 'MNP',
    trackingBaseUrl: 'https://mulphilog.com/tracking?track=',
  },
];

export function getCourierTrackingUrl(courierName: string, trackingNumber?: string): string {
  if (!trackingNumber) return '#';
  const matched = SUPPORTED_COURIERS.find(
    (c) =>
      c.name.toLowerCase().includes(courierName.toLowerCase()) ||
      c.code.toLowerCase() === courierName.toLowerCase()
  );
  if (matched) {
    return `${matched.trackingBaseUrl}${encodeURIComponent(trackingNumber)}`;
  }
  return `https://sonic.pk/tracking?tracking_number=${encodeURIComponent(trackingNumber)}`;
}

export function generateAutoTrackingNumber(courierName: string): string {
  const matched = SUPPORTED_COURIERS.find(
    (c) =>
      c.name.toLowerCase().includes(courierName.toLowerCase()) ||
      c.code.toLowerCase() === courierName.toLowerCase()
  );
  const prefix = matched ? matched.trackingPrefix : 'YM';
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}-${randomNum}`;
}

export function getWhatsAppTrackingShareUrl(
  phone: string,
  customerName: string,
  orderNumber: string,
  courierName: string = 'Trax Express',
  trackingNumber: string = 'Pending',
  totalAmountPKR?: number
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('0')
    ? '92' + cleanPhone.slice(1)
    : cleanPhone.startsWith('92')
    ? cleanPhone
    : '92' + cleanPhone;

  const trackingLink = trackingNumber && trackingNumber !== 'Pending'
    ? getCourierTrackingUrl(courierName, trackingNumber)
    : 'Generating soon';

  const amountText = totalAmountPKR ? `\n💰 COD Payable Amount: Rs. ${totalAmountPKR.toLocaleString()}` : '';

  const message = `Assalam-o-Alaikum ${customerName}! 📦\n\nYour YourMart order *#${orderNumber}* has been dispatched via *${courierName}*!${amountText}\n\n🔍 Tracking ID: *${trackingNumber}*\n🔗 Track Online: ${trackingLink}\n\nPlease keep the exact cash ready upon delivery. Thank you for shopping with us!`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
