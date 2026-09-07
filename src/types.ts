export type SportType = "NFL" | "NBA" | "MLB" | "Soccer";
export type GradeCompanyType = "PSA" | "BGS" | "SGC" | "CGC" | "Raw";

export interface MarketplaceComp {
  date: string;
  venue: string;                // eBay, Goldin, PWCC, Heritage
  rawPrice: number;             // Listed or hammer price
  acceptedPrice: number;        // True market clearing price (unmasked Best Offer)
  bestOffer: boolean;           // Strikethrough concealment flag
  unpaid: boolean;              // Bidder non-compliance default
  shillScore: number;           // Probability metric (0.0 to 1.0)
  outlier: boolean;             // >30% variance outside trend line
  note: string;
}

export interface HedonicTraits {
  autograph: "None" | "Sticker" | "On-Card";
  patchQuality: string;
  workhorsePair: string;      // Highly liquid paired asset (e.g. Base Prizm PSA 10)
  workhorsePrice: number;
  workhorse30dChange: number; // 30-day percentage momentum
}

export interface CardAsset {
  id: string;
  player: string;
  year: number;
  set: string;
  variation: string;
  serialNumber: string;         // e.g. "3/5", "Unnumbered"
  numberedTo: number;           // Denominator for scarcity elasticity
  sport: SportType;
  gradeCompany: GradeCompanyType;
  grade: string;                // "10", "9.5", "9", etc.
  subgrades?: { centering: number; corners: number; edges: number; surface: number } | null;
  isBlackLabel: boolean;        // BGS Quad-10 Black Label Flag
  basePrice: number;            // P_h (Historical clean transaction price)
  cagr: number;                 // Historical compound annual growth rate
  tYears: number;               // Forward time horizon in years
  hz: number;                   // Standardized Hype Index z-score (-2.0 to +3.0)
  sz: number;                   // Standardized Sentiment Index z-score (-2.0 to +3.0)
  popCount: number;             // Total graded population count for f(Pop)
  macroM: number;               // Macroeconomic climate multiplier (0.85 - 1.15)
  acquisitionCost: number;
  comps: MarketplaceComp[];
  hedonicTraits: HedonicTraits;
}

export interface ValuationResult {
  Vs: number;                   // Integrated Value Score
  lowerBound: number;           // -15% to -25% uncertainty bound
  upperBound: number;           // +15% to +25% uncertainty bound
  growthFactor: number;         // (1 + r_excess)^t
  compIndex: number;            // C_i time-decay weighted multiple
  psychFactor: number;          // (1 + 0.15*H_z - 0.10*S_z)
  scarcityFactor: number;       // f(Pop) = (1000 / Pop)^0.16
  macroM: number;               // M
  validCompCount: number;
  rawCompCount: number;
}
