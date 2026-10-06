import { RiskAssessment, BlacklistEntry } from '../types';

export const INITIAL_BLACKLIST: BlacklistEntry[] = [
  {
    id: 'BL-001',
    phone: '03001234999',
    customerName: 'Khurram Shehzad',
    city: 'Gujranwala',
    address: 'Near Clock Tower, Bazar 4',
    reason: 'Rejected 4 consecutive COD deliveries from Trax and PostEx. Refuses rider calls.',
    reportedBy: 'Al-Madina Traders',
    reportedAt: '2026-09-12',
    failedDeliveriesCount: 4,
  },
  {
    id: 'BL-002',
    phone: '03129876543',
    customerName: 'Zahid Mehmood',
    city: 'Faisalabad',
    address: 'Street 9, D Ground',
    reason: 'Repeatedly places bulk orders and switches phone off when rider reaches location.',
    reportedBy: 'Apex Wholesalers',
    reportedAt: '2026-09-28',
    failedDeliveriesCount: 3,
  },
  {
    id: 'BL-003',
    phone: '03214567890',
    customerName: 'Asim Riaz',
    city: 'Multan',
    address: 'Near Bosan Road, Gol Bagh',
    reason: 'Opened parcel flyer, removed warranty card, and refused delivery payment.',
    reportedBy: 'Super Tech Hub',
    reportedAt: '2026-10-01',
    failedDeliveriesCount: 5,
  },
];

export function calculateCustomerRisk(phone: string, city: string = 'Lahore'): RiskAssessment {
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Check if blacklisted
  const blacklisted = INITIAL_BLACKLIST.find((entry) => {
    const cleanEntryPhone = entry.phone.replace(/[^0-9]/g, '');
    return cleanEntryPhone.endsWith(cleanPhone.slice(-9)) || cleanPhone.endsWith(cleanEntryPhone.slice(-9));
  });

  if (blacklisted) {
    return {
      phone,
      riskScore: 95,
      riskLevel: 'HIGH',
      isBlacklisted: true,
      refusalRatePercentage: 88,
      totalOrders: 6,
      deliveredOrders: 1,
      returnedOrders: 5,
      requiresAdvanceFee: true,
      reasons: [
        `Blacklisted: ${blacklisted.reason}`,
        `Customer has ${blacklisted.failedDeliveriesCount} documented RTO refusal strikes across Pakistan courier networks.`,
        'Mandatory PKR 200 Advance Delivery Guarantee Fee applies to prevent courier loss.',
      ],
    };
  }

  // Check specific test numbers or high-risk simulation patterns
  if (cleanPhone.endsWith('0000') || cleanPhone.endsWith('1111')) {
    return {
      phone,
      riskScore: 78,
      riskLevel: 'HIGH',
      isBlacklisted: false,
      refusalRatePercentage: 65,
      totalOrders: 4,
      deliveredOrders: 1,
      returnedOrders: 3,
      requiresAdvanceFee: true,
      reasons: [
        'High RTO return frequency detected in courier database.',
        'High refusal probability for COD shipments to remote delivery route.',
      ],
    };
  }

  if (cleanPhone.endsWith('5555')) {
    return {
      phone,
      riskScore: 42,
      riskLevel: 'MEDIUM',
      isBlacklisted: false,
      refusalRatePercentage: 25,
      totalOrders: 4,
      deliveredOrders: 3,
      returnedOrders: 1,
      requiresAdvanceFee: false,
      reasons: [
        'Moderate order history. 1 past return recorded.',
      ],
    };
  }

  // Standard safe customer
  return {
    phone,
    riskScore: 12,
    riskLevel: 'LOW',
    isBlacklisted: false,
    refusalRatePercentage: 4,
    totalOrders: 5,
    deliveredOrders: 5,
    returnedOrders: 0,
    requiresAdvanceFee: false,
    reasons: [
      'Clean delivery history with 96% on-time COD acceptance record.',
      'Verified mobile number.',
    ],
  };
}
