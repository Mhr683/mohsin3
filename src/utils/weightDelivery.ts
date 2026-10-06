export interface WeightDeliveryResult {
  totalWeightKg: number;
  baseDeliveryPKR: number;
  extraWeightKg: number;
  extraKgUnits: number;
  extraDeliveryPKR: number;
  totalDeliveryPKR: number;
}

export function calculateWeightDelivery(
  totalWeightKg: number,
  baseRatePKR: number = 200,
  extraPerKgPKR: number = 60
): WeightDeliveryResult {
  const roundedWeight = Math.max(0.1, Math.round(totalWeightKg * 100) / 100);
  const extraWeight = Math.max(0, roundedWeight - 1.0);
  const extraKgUnits = Math.ceil(extraWeight);
  const extraDelivery = extraKgUnits * extraPerKgPKR;
  const total = baseRatePKR + extraDelivery;

  return {
    totalWeightKg: roundedWeight,
    baseDeliveryPKR: baseRatePKR,
    extraWeightKg: Math.round(extraWeight * 100) / 100,
    extraKgUnits,
    extraDeliveryPKR: extraDelivery,
    totalDeliveryPKR: total,
  };
}
