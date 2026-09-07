import { CardAsset } from "./types";

export const INITIAL_CARDS: CardAsset[] = [
  {
    id: "c1",
    player: "Jayden Daniels",
    year: 2024,
    set: "Panini Prizm Draft Picks",
    variation: "Gold Vinyl Prizm Auto",
    serialNumber: "3/5",
    numberedTo: 5,
    sport: "NFL",
    gradeCompany: "BGS",
    grade: "9.5",
    subgrades: { centering: 9.5, corners: 9.5, edges: 10, surface: 9.5 },
    isBlackLabel: false,
    basePrice: 4200,
    cagr: 0.18,
    tYears: 0.25,
    hz: 1.4, // High rookie hype
    sz: 1.1, // Strong sentiment
    popCount: 2,
    macroM: 1.08,
    acquisitionCost: 3400,
    comps: [
      {
        date: "2026-07-28",
        venue: "Goldin Auctions",
        rawPrice: 4650,
        acceptedPrice: 4650,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.04,
        outlier: false,
        note: "Verified wire transfer clearing"
      },
      {
        date: "2026-06-12",
        venue: "eBay",
        rawPrice: 5800,
        acceptedPrice: 4100,
        bestOffer: true,
        unpaid: false,
        shillScore: 0.08,
        outlier: false,
        note: "Best offer accepted ($5800 strikethrough masked)"
      },
      {
        date: "2026-04-15",
        venue: "PWCC Premier",
        rawPrice: 3900,
        acceptedPrice: 3900,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.02,
        outlier: false,
        note: "Post-draft floor purchase transaction"
      },
      {
        date: "2026-02-10",
        venue: "eBay Auction",
        rawPrice: 6200,
        acceptedPrice: 6200,
        bestOffer: false,
        unpaid: true,
        shillScore: 0.92,
        outlier: true,
        note: "UNPAID: Bidder zero feedback defaulted after hype spike"
      }
    ],
    hedonicTraits: {
      autograph: "On-Card",
      patchQuality: "3-Color Prime Patch",
      workhorsePair: "2024 Prizm Base Rookie PSA 10",
      workhorsePrice: 185,
      workhorse30dChange: 0.14
    }
  },
  {
    id: "c2",
    player: "Victor Wembanyama",
    year: 2023,
    set: "Panini Prizm",
    variation: "Silver Prizm Rookie #136",
    serialNumber: "Unnumbered",
    numberedTo: 9999,
    sport: "NBA",
    gradeCompany: "PSA",
    grade: "10",
    subgrades: null,
    isBlackLabel: false,
    basePrice: 1650,
    cagr: 0.22,
    tYears: 0.5,
    hz: 1.6,
    sz: 1.25,
    popCount: 2140,
    macroM: 1.05,
    acquisitionCost: 1200,
    comps: [
      {
        date: "2026-08-01",
        venue: "eBay",
        rawPrice: 1720,
        acceptedPrice: 1720,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.05,
        outlier: false,
        note: "Clean high-volume comp"
      },
      {
        date: "2026-07-15",
        venue: "eBay",
        rawPrice: 1950,
        acceptedPrice: 1625,
        bestOffer: true,
        unpaid: false,
        shillScore: 0.06,
        outlier: false,
        note: "130point verified accepted offer"
      },
      {
        date: "2026-05-20",
        venue: "Heritage Auctions",
        rawPrice: 1580,
        acceptedPrice: 1580,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.01,
        outlier: false,
        note: "Spring auction floor price"
      },
      {
        date: "2026-03-10",
        venue: "eBay",
        rawPrice: 2450,
        acceptedPrice: 2450,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.88,
        outlier: true,
        note: "Late-night bidding velocity anomaly (>30% premium)"
      }
    ],
    hedonicTraits: {
      autograph: "None",
      patchQuality: "None",
      workhorsePair: "2023 Prizm Base Rookie PSA 10",
      workhorsePrice: 420,
      workhorse30dChange: -0.06
    }
  },
  {
    id: "c3",
    player: "Anthony Edwards",
    year: 2020,
    set: "National Treasures",
    variation: "Rookie Patch Autograph (RPA)",
    serialNumber: "14/99",
    numberedTo: 99,
    sport: "NBA",
    gradeCompany: "BGS",
    grade: "10",
    subgrades: { centering: 10, corners: 10, edges: 10, surface: 10 },
    isBlackLabel: true,
    basePrice: 24500,
    cagr: 0.25,
    tYears: 0.8,
    hz: 1.3,
    sz: 1.15,
    popCount: 1,
    macroM: 1.05,
    acquisitionCost: 16500,
    comps: [
      {
        date: "2026-06-20",
        venue: "PWCC Premier",
        rawPrice: 26000,
        acceptedPrice: 26000,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.03,
        outlier: false,
        note: "Private collector escrow clearance"
      },
      {
        date: "2026-01-14",
        venue: "Goldin Auctions",
        rawPrice: 22800,
        acceptedPrice: 22800,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.02,
        outlier: false,
        note: "Winter marquee premier catalog sale"
      },
      {
        date: "2025-08-05",
        venue: "eBay",
        rawPrice: 32000,
        acceptedPrice: 32000,
        bestOffer: false,
        unpaid: true,
        shillScore: 0.95,
        outlier: true,
        note: "UNPAID shill default after playoff buzzer beater"
      }
    ],
    hedonicTraits: {
      autograph: "On-Card",
      patchQuality: "Timberwolves 3-Color Lettering Patch",
      workhorsePair: "2020 Prizm Silver PSA 10",
      workhorsePrice: 850,
      workhorse30dChange: 0.05
    }
  },
  {
    id: "c4",
    player: "Derek Jeter",
    year: 1993,
    set: "SP Foil",
    variation: "Premier Prospects Rookie #279",
    serialNumber: "Unnumbered",
    numberedTo: 50000,
    sport: "MLB",
    gradeCompany: "PSA",
    grade: "9",
    subgrades: null,
    isBlackLabel: false,
    basePrice: 5100,
    cagr: 0.09,
    tYears: 1.0,
    hz: 0.3,
    sz: 0.85,
    popCount: 710,
    macroM: 1.0,
    acquisitionCost: 4800,
    comps: [
      {
        date: "2026-07-10",
        venue: "eBay",
        rawPrice: 5350,
        acceptedPrice: 5000,
        bestOffer: true,
        unpaid: false,
        shillScore: 0.05,
        outlier: false,
        note: "130 Point verified Best Offer accepted"
      },
      {
        date: "2026-05-18",
        venue: "Heritage Auctions",
        rawPrice: 5200,
        acceptedPrice: 5200,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.02,
        outlier: false,
        note: "Standard public auction hammer"
      },
      {
        date: "2026-02-28",
        venue: "Goldin Auctions",
        rawPrice: 4950,
        acceptedPrice: 4950,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.03,
        outlier: false,
        note: "Offseason winter baseline transaction"
      }
    ],
    hedonicTraits: {
      autograph: "None",
      patchQuality: "Condition Sensitive Die-Cut Foil",
      workhorsePair: "1993 Topps Traded PSA 10",
      workhorsePrice: 195,
      workhorse30dChange: 0.01
    }
  },
  {
    id: "c5",
    player: "Lionel Messi",
    year: 2004,
    set: "Panini Megacracks",
    variation: "Barca Campio Rookie #71",
    serialNumber: "Unnumbered",
    numberedTo: 10000,
    sport: "Soccer",
    gradeCompany: "PSA",
    grade: "9",
    subgrades: null,
    isBlackLabel: false,
    basePrice: 9200,
    cagr: 0.14,
    tYears: 1.2,
    hz: 0.8,
    sz: 1.05,
    popCount: 184,
    macroM: 1.02,
    acquisitionCost: 8100,
    comps: [
      {
        date: "2026-08-04",
        venue: "PWCC Premier",
        rawPrice: 9400,
        acceptedPrice: 9400,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.03,
        outlier: false,
        note: "International collector wire transfer"
      },
      {
        date: "2026-06-01",
        venue: "eBay",
        rawPrice: 10500,
        acceptedPrice: 9100,
        bestOffer: true,
        unpaid: false,
        shillScore: 0.07,
        outlier: false,
        note: "Strikethrough accepted offer resolved"
      },
      {
        date: "2026-03-22",
        venue: "Goldin Auctions",
        rawPrice: 8850,
        acceptedPrice: 8850,
        bestOffer: false,
        unpaid: false,
        shillScore: 0.04,
        outlier: false,
        note: "Clean auction sale"
      }
    ],
    hedonicTraits: {
      autograph: "None",
      patchQuality: "European Card Stock",
      workhorsePair: "2014 Prizm World Cup Base PSA 10",
      workhorsePrice: 580,
      workhorse30dChange: 0.03
    }
  }
];

export const GRADE_MULTIPLIERS: Record<string, number> = {
  "Raw (Ungraded)": 1.0,
  "PSA 8": 1.25,
  "SGC 8": 1.15,
  "PSA 9 (Mint)": 2.40,
  "SGC 9": 2.10,
  "BGS 9": 2.20,
  "BGS 9.5 (True Gem)": 4.80,
  "SGC 10 (Tuxedo)": 5.20,
  "PSA 10 (Gem Mint)": 6.10,
  "BGS 10 (Pristine)": 14.50,
  "BGS 10 (Black Label Quad 10s)": 38.00,
  "CGC 10 (Pristine)": 5.80
};

export const SEASONALITY_DATA = {
  NFL: [
    { month: "Jan - Feb", phase: "Playoffs & Super Bowl", discountPct: -5, signal: "SELL PEAK", color: "bg-[#E6DCDC] text-[#141414] border border-[#141414]" },
    { month: "Mar - May", phase: "Deep Offseason Lull", discountPct: 22, signal: "STRONG BUY", color: "bg-[#DCE6DE] text-[#141414] border border-[#141414]" },
    { month: "Jun - Jul", phase: "Camp Buzz & Pre-Season", discountPct: 8, signal: "ACCUMULATE", color: "bg-slate-100 text-[#141414] border border-[#141414]" },
    { month: "Aug - Sep", phase: "Opening Week Fever", discountPct: -18, signal: "PROFIT TAKE", color: "bg-yellow-100 text-[#141414] border border-[#141414]" },
    { month: "Oct - Dec", phase: "Regular Season Grind", discountPct: 0, signal: "HOLD", color: "bg-white text-[#141414] border border-[#141414]" }
  ],
  NBA: [
    { month: "Jul - Sep", phase: "Summer Inactivity Lull", discountPct: 20, signal: "STRONG BUY", color: "bg-[#DCE6DE] text-[#141414] border border-[#141414]" },
    { month: "Oct - Nov", phase: "Tip-Off Hype", discountPct: -12, signal: "PROFIT TAKE", color: "bg-yellow-100 text-[#141414] border border-[#141414]" },
    { month: "Dec - Jan", phase: "Mid-Season Baseline", discountPct: 2, signal: "ACCUMULATE", color: "bg-slate-100 text-[#141414] border border-[#141414]" },
    { month: "Feb - Mar", phase: "All-Star & Trade Surge", discountPct: -8, signal: "HOLD / TRADE", color: "bg-slate-200 text-[#141414] border border-[#141414]" },
    { month: "Apr - Jun", phase: "Playoffs & NBA Finals", discountPct: -25, signal: "SELL PEAK", color: "bg-[#E6DCDC] text-[#141414] border border-[#141414]" }
  ],
  MLB: [
    { month: "Nov - Jan", phase: "Winter Deep Freeze", discountPct: 25, signal: "STRONG BUY", color: "bg-[#DCE6DE] text-[#141414] border border-[#141414]" },
    { month: "Feb - Apr", phase: "Spring Training Hope", discountPct: -15, signal: "PROFIT TAKE", color: "bg-yellow-100 text-[#141414] border border-[#141414]" },
    { month: "May - Aug", phase: "Mid-Summer Grind", discountPct: 3, signal: "HOLD", color: "bg-white text-[#141414] border border-[#141414]" },
    { month: "Sep - Oct", phase: "Postseason & World Series", discountPct: -30, signal: "SELL PEAK", color: "bg-[#E6DCDC] text-[#141414] border border-[#141414]" }
  ]
};
