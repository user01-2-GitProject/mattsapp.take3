import { CardAsset, ValuationResult } from "./types";

export function calculateIntegratedValueScore(card: CardAsset): ValuationResult {
  const { basePrice, cagr, tYears, comps, hz, sz, popCount, macroM } = card;

  // Macro Risk-Free Rate = 4.0%
  const macroRiskFree = 0.04;
  const rExcess = Math.max(-0.20, cagr - macroRiskFree);
  const growthFactor = Math.pow(1 + rExcess, Math.max(0, tYears));

  // Time-decay weighted clean comps: Filter shill, unpaid, and outlier trades
  const validComps = comps.filter(c => !c.unpaid && !c.outlier && c.shillScore < 0.5);
  
  let compIndex = 1.0;
  if (validComps.length > 0) {
    const weights = [0.35, 0.25, 0.20, 0.15, 0.05];
    let totalW = 0;
    let weightedSum = 0;
    validComps.forEach((comp, idx) => {
      const w = weights[Math.min(idx, weights.length - 1)];
      const priceToUse = comp.acceptedPrice || comp.rawPrice;
      weightedSum += priceToUse * w;
      totalW += w;
    });
    const cleanWeightedPrice = totalW > 0 ? (weightedSum / totalW) : basePrice;
    compIndex = cleanWeightedPrice / Math.max(1, basePrice);
  }

  // Psychology / Hype & Sentiment Modifier: (1 + 0.15*H_z - 0.10*S_z)
  const rawPsych = 1 + (0.15 * (hz || 0)) - (0.10 * (sz || 0));
  const psychFactor = Math.max(0.70, Math.min(1.30, rawPsych));

  // Scarcity Elasticity: f(Pop) = (1000 / Pop)^0.16
  const alpha = 0.16;
  const safePop = Math.max(1, popCount || 100);
  const scarcityFactor = Math.pow(1000 / safePop, alpha);
  const normalizedScarcity = Math.max(0.85, Math.min(2.5, scarcityFactor));

  // Formula 7.3: Integrated Value Score
  const Vs = basePrice * growthFactor * compIndex * psychFactor * normalizedScarcity * (macroM || 1.0);

  const uncertaintyPct = validComps.length >= 3 ? 0.15 : 0.25;
  const lowerBound = Vs * (1 - uncertaintyPct);
  const upperBound = Vs * (1 + uncertaintyPct);

  return {
    Vs: Math.round(Vs),
    lowerBound: Math.round(lowerBound),
    upperBound: Math.round(upperBound),
    growthFactor: parseFloat(growthFactor.toFixed(3)),
    compIndex: parseFloat(compIndex.toFixed(3)),
    psychFactor: parseFloat(psychFactor.toFixed(3)),
    scarcityFactor: parseFloat(normalizedScarcity.toFixed(3)),
    macroM: parseFloat((macroM || 1.0).toFixed(2)),
    validCompCount: validComps.length,
    rawCompCount: comps.length
  };
}
