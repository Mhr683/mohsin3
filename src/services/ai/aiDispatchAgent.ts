import { KnowledgeDoc } from '../../types';

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'DOC-001',
    category: 'COD',
    title: 'Cash on Delivery (COD) Rules & Advance Guarantee Fees',
    content: 'All standard orders across Pakistan are eligible for 100% Cash on Delivery. Customers with previous refusal strikes or unverified high-risk mobile numbers may be requested to pay a small Rs. 200 Advance Delivery Guarantee via JazzCash/Easypaisa to confirm courier dispatch.',
    keywords: ['cod', 'advance', 'fee', 'cash', 'delivery', 'guarantee', 'advance payment'],
    updatedAt: '2026-10-01',
  },
  {
    id: 'DOC-002',
    category: 'DELIVERY',
    title: 'Standard Courier Delivery Timings & Tracking',
    content: 'Deliveries to major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad) typically take 2-3 business days via Trax, PostEx, or TCS. Rural or secondary tehsils take 3-5 days. Live SMS and WhatsApp tracking links are dispatched immediately after parcel booking.',
    keywords: ['delivery', 'tracking', 'time', 'courier', 'days', 'kab', 'track', 'parcel', 'trax', 'postex'],
    updatedAt: '2026-10-02',
  },
  {
    id: 'DOC-003',
    category: 'REFUND',
    title: '7-Day Check & Replacement Warranty Policy',
    content: 'Every product on YourMart includes a 7-day checking and replacement warranty from the date of delivery. If an item is defective, damaged in transit, or missing parts, customers can request an exchange through the WhatsApp helpline with an unboxing video.',
    keywords: ['return', 'refund', 'warranty', 'replace', 'exchange', 'defect', 'damaged', 'kharab', 'wapsi'],
    updatedAt: '2026-10-03',
  },
  {
    id: 'DOC-004',
    category: 'DARAZ_SYNC',
    title: 'Daraz & Shopify Reseller Auto-Sync Guidelines',
    content: 'Resellers can sync their Daraz Seller Center and Shopify stores with 1-click. Stock levels and prices update automatically. Orders received on external stores are routed directly to Pakistani wholesale suppliers for dispatch without manual entry.',
    keywords: ['daraz', 'shopify', 'sync', 'store', 'reseller', 'orders', 'dropshipping'],
    updatedAt: '2026-10-04',
  },
];

export interface AIDispatchAgentResponse {
  replyText: string;
  confidenceScore: number;
  needsHumanEscalation: boolean;
  matchedDoc?: KnowledgeDoc;
}

export function queryAIDispatchAgent(
  query: string,
  docs: KnowledgeDoc[] = INITIAL_KNOWLEDGE_DOCS
): AIDispatchAgentResponse {
  const clean = query.toLowerCase().trim();

  // Check for human escalation keywords
  const humanKeywords = ['agent', 'human', 'complaint', 'fraud', 'stolen', 'police', 'manager', 'lawyer', 'scam'];
  if (humanKeywords.some((k) => clean.includes(k))) {
    return {
      replyText: 'Aapki request hamari Senior Customer Resolution Team ko transfer kar di gayi hai. Aik human support officer thodi der mein aap se direct WhatsApp / Phone par rabta karega.',
      confidenceScore: 0.98,
      needsHumanEscalation: true,
    };
  }

  // Find best matching document
  let bestDoc: KnowledgeDoc | undefined;
  let maxMatches = 0;

  for (const doc of docs) {
    let matches = 0;
    for (const kw of doc.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestDoc = doc;
    }
  }

  if (bestDoc && maxMatches > 0) {
    return {
      replyText: `${bestDoc.content}\n\nAgar aapko mazeed maloomat darkaar hon tou bila-jhijhak apna order number share karein!`,
      confidenceScore: Math.min(0.95, 0.75 + maxMatches * 0.1),
      needsHumanEscalation: false,
      matchedDoc: bestDoc,
    };
  }

  // Fallback helpful guidance in bilingual Urdu/English
  return {
    replyText: 'Assalam-o-Alaikum! Main YourMart automated customer service bot hoon. Aap mujh se order tracking status, Cash on Delivery rules, ya 7-day replacement warranty ke baray mein sawal pooch saktay hain. Barah-e-karam apna Order ID ya tracking number yahan likhein.',
    confidenceScore: 0.72,
    needsHumanEscalation: false,
  };
}
