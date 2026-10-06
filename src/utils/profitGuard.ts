import { ProfitGuardConfig } from '../types';

export interface OrderFinancialInputs {
  sellingPricePKR: number;
  supplierCostPKR?: number;
  shippingCostPKR?: number;
  processingFeePKR?: number;
  platformFeePct?: number;
}

export interface OrderFinancialBreakdown {
  sellingPricePKR: number;
  supplierCostPKR: number;
  shippingCostPKR: number;
  processingFeePKR: number;
  platformFeePKR: number;
  resellerNetProfitPKR: number;
  profitMarginPct: number;
  grossProfitPKR: number;
}

export interface ProfitGuardEvaluation {
  approved: boolean;
  reason: string;
  financials: OrderFinancialBreakdown;
}

export function evaluateOrderFinancials(
  inputs: OrderFinancialInputs,
  config?: Partial<ProfitGuardConfig>
): ProfitGuardEvaluation {
  const sellingPrice = Number(inputs.sellingPricePKR) || 0;
  const supplierCost = Number(inputs.supplierCostPKR) || 0;
  const shippingCost = inputs.shippingCostPKR !== undefined ? Number(inputs.shippingCostPKR) : (config?.defaultShippingCostPKR ?? 200);
  const processingFee = inputs.processingFeePKR !== undefined ? Number(inputs.processingFeePKR) : (config?.processingFeePKR ?? 30);
  const platformFeePct = inputs.platformFeePct !== undefined ? Number(inputs.platformFeePct) : (config?.platformFeePct ?? 2.0);

  const platformFeePKR = Math.round((sellingPrice * platformFeePct) / 100);
  const totalDeductions = supplierCost + shippingCost + processingFee + platformFeePKR;
  const resellerNetProfitPKR = sellingPrice - totalDeductions;
  const grossProfitPKR = sellingPrice - supplierCost;

  const profitMarginPct = sellingPrice > 0
    ? Math.round((resellerNetProfitPKR / sellingPrice) * 1000) / 10
    : 0;

  const minProfitAmountPKR = config?.minProfitAmountPKR ?? 50;
  const minProfitMarginPct = config?.minProfitMarginPct ?? 5;
  const enforceLock = config?.enforceLock ?? true;

  let approved = true;
  let reason = 'Order meets profit margins and platform safety rules.';

  if (resellerNetProfitPKR < 0) {
    approved = false;
    reason = `Negative profit margin! Reseller will lose PKR ${Math.abs(resellerNetProfitPKR)} on this order.`;
  } else if (resellerNetProfitPKR < minProfitAmountPKR) {
    if (enforceLock) approved = false;
    reason = `Profit of PKR ${resellerNetProfitPKR} is below the minimum required threshold of PKR ${minProfitAmountPKR}.`;
  } else if (profitMarginPct < minProfitMarginPct) {
    if (enforceLock) approved = false;
    reason = `Profit margin of ${profitMarginPct}% is lower than required safety margin of ${minProfitMarginPct}%.`;
  }

  return {
    approved,
    reason,
    financials: {
      sellingPricePKR: sellingPrice,
      supplierCostPKR: supplierCost,
      shippingCostPKR: shippingCost,
      processingFeePKR: processingFee,
      platformFeePKR: platformFeePKR,
      resellerNetProfitPKR: Math.max(-99999, resellerNetProfitPKR),
      profitMarginPct,
      grossProfitPKR,
    },
  };
}
