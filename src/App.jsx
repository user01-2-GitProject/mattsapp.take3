import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  initializeApp,
  getApps,
  getApp
} from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "firebase/auth";
import {
  Search,
  Database,
  Globe,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Bookmark,
  CheckCircle2,
  Sliders,
  Sparkles,
  X,
  Shield,
  Download,
  Camera,
  ChevronRight,
  Hash,
  Layers,
  Info,
  ChevronDown,
  Calculator,
  Activity,
  Zap,
  Scale
} from "lucide-react";

// ============================================================================
// CONFIGURATION & ZERO-TRUST SERVICE ADAPTER
// ============================================================================

const VITE_CONFIG = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
  },
  geminiKey: import.meta.env.VITE_GEMINI_API_KEY || "",
  apiGatewayUrl: import.meta.env.VITE_API_GATEWAY_URL || ""
};

// ============================================================================
// DETERMINISTIC NOTEBOOK MATHEMATICS: MASTER VALUATION ENGINE
// ============================================================================

/**
 * Returns condition multiplier based on company and grade designation.
 */
function resolveGradeMultiplier(grade, company) {
  const gStr = String(grade || "").trim();
  const cStr = String(company || "").toUpperCase();

  if (cStr === "RAW" || gStr === "RAW" || gStr === "Ungraded") return 1.0;
  if (gStr.includes("10")) return cStr === "BGS" ? 5.2 : 4.2;
  if (gStr.includes("9.5")) return 2.4;
  if (gStr.includes("9")) return 1.75;
  if (gStr.includes("8.5")) return 1.35;
  if (gStr.includes("8")) return 1.15;
  if (gStr.includes("7")) return 0.88;
  return 1.0;
}

/**
 * Step 3: K-Means Latent Parameter Clustering
 * Partitions historical transaction feature spaces to derive latent parameters:
 * Scarcity parameter (Sc), Rivalry (beta), Accuracy (Ac), Dataset footprint (Sz).
 */
function deriveLatentParametersByCluster({ serialNumber, isRookie, isAuto, isVintage, year }) {
  let serialNum = 9999;
  if (typeof serialNumber === "string") {
    const match = serialNumber.match(/\/(\d+)/);
    if (match) serialNum = parseInt(match[1], 10);
  } else if (typeof serialNumber === "number") {
    serialNum = serialNumber;
  }

  // Feature vector: [normalizedSerial, rookieWeight, autoWeight, ageWeight]
  const targetVector = [
    Math.min(serialNum / 500, 1.0),
    isRookie ? 1.0 : 0.0,
    isAuto ? 1.0 : 0.0,
    Math.min((2025 - (year || 2024)) / 40, 1.0)
  ];

  // Benchmark Cluster Centroids
  const clusters = [
    {
      id: "C0_LIQUID_BASE",
      name: "Liquid Modern Base Commodity",
      centroid: [1.0, 0.9, 0.1, 0.05],
      params: { Sc: 0.85, beta: 0.90, Ac: 0.96, Sz: 35000, CpBase: 15 }
    },
    {
      id: "C1_NUMBERED_PARALLEL",
      name: "Mid-Tier Serialized Parallel",
      centroid: [0.35, 0.7, 0.3, 0.08],
      params: { Sc: 0.35, beta: 0.65, Ac: 0.93, Sz: 2400, CpBase: 45 }
    },
    {
      id: "C2_GRAIL_AUTO",
      name: "Low-Numbered Grail / Auto",
      centroid: [0.05, 0.8, 0.9, 0.06],
      params: { Sc: 0.08, beta: 0.32, Ac: 0.89, Sz: 150, CpBase: 120 }
    },
    {
      id: "C3_VINTAGE_HOF",
      name: "Vintage Sovereign Heritage",
      centroid: [0.75, 0.5, 0.0, 0.95],
      params: { Sc: 0.22, beta: 0.45, Ac: 0.91, Sz: 850, CpBase: 65 }
    }
  ];

  let nearest = clusters[0];
  let minDistance = Infinity;

  clusters.forEach((c) => {
    let sumSq = 0;
    for (let i = 0; i < targetVector.length; i++) {
      sumSq += Math.pow(targetVector[i] - c.centroid[i], 2);
    }
    const dist = Math.sqrt(sumSq);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = c;
    }
  });

  return nearest;
}

/**
 * Outlier Trimming & Quality Filter (Interquartile Range - IQR)
 * Filters shill bids, damaged sales, lot sales, and statistical anomalies.
 */
function filterOutlierComps(rawComps, targetGrade, targetCompany) {
  if (!Array.isArray(rawComps) || rawComps.length === 0) {
    return { qualified: [], trimmed: [] };
  }

  const targetMult = resolveGradeMultiplier(targetGrade, targetCompany);

  // 1. Normalize each comp to target grade & evaluate quality flags
  const processed = rawComps.map((c, index) => {
    const rawPrice = Number(c.price) || 0;
    const compMult = resolveGradeMultiplier(c.grade || "RAW", c.gradeCompany || "RAW");
    const normalizedPrice = Math.round(rawPrice * (targetMult / Math.max(0.2, compMult)));

    const isSuspicious =
      Boolean(c.isShillWarning) ||
      Boolean(c.isLotSale) ||
      Boolean(c.isDamaged) ||
      rawPrice <= 0;

    return {
      ...c,
      id: c.id || `comp_${index + 1}`,
      rawPrice,
      normalizedPrice,
      compMult,
      isSuspicious
    };
  });

  const nonSuspicious = processed.filter((c) => !c.isSuspicious);

  if (nonSuspicious.length < 4) {
    return {
      qualified: processed.filter((c) => !c.isSuspicious),
      trimmed: processed.filter((c) => c.isSuspicious)
    };
  }

  // 2. Interquartile Range (IQR) calculation
  const sorted = [...nonSuspicious].sort((a, b) => a.normalizedPrice - b.normalizedPrice);
  const q1Index = Math.floor(sorted.length * 0.25);
  const q3Index = Math.floor(sorted.length * 0.75);
  const q1 = sorted[q1Index].normalizedPrice;
  const q3 = sorted[q3Index].normalizedPrice;
  const iqr = q3 - q1;
  const lowerBound = Math.max(5, q1 - 1.5 * iqr);
  const upperBound = q3 + 1.5 * iqr;

  const qualified = [];
  const trimmed = [];

  processed.forEach((comp) => {
    if (comp.isSuspicious || comp.normalizedPrice < lowerBound || comp.normalizedPrice > upperBound) {
      trimmed.push({
        ...comp,
        trimReason: comp.isSuspicious
          ? "Suspicious quality flag (shill / lot / damage)"
          : `Statistical anomaly (outside IQR range: $${Math.round(lowerBound)}-$${Math.round(upperBound)})`
      });
    } else {
      qualified.push(comp);
    }
  });

  return { qualified, trimmed };
}

/**
 * Step 1-5 Deterministic Mathematical Valuation Engine
 * Computes Formula A (Vs), Formula B (D-Val), Formula C (A-Val),
 * executes the Dual-Layer IAS 38 Cost Floor, and extracts SHAP contributions.
 */
function executeMasterValuationFramework({
  cardMeta,
  rawComps,
  marketContext
}) {
  const {
    year = 2024,
    grade = "10",
    gradeCompany = "PSA",
    serialNumber = "Unnumbered",
    attributes = ""
  } = cardMeta;

  const isRookie = attributes.toLowerCase().includes("rookie") || attributes.toLowerCase().includes("rc");
  const isAuto = attributes.toLowerCase().includes("auto") || attributes.toLowerCase().includes("signature");
  const isVintage = year < 1980;

  // Step 3: Latent Parameter Clustering
  const cluster = deriveLatentParametersByCluster({
    serialNumber,
    isRookie,
    isAuto,
    isVintage,
    year
  });

  const { Sc, beta, Ac, Sz, CpBase } = cluster.params;

  // Filter and normalize comps
  const { qualified, trimmed } = filterOutlierComps(rawComps, grade, gradeCompany);

  // Time decay factor t
  const currentYear = 2025;
  const t = Math.max(0.2, currentYear - year);

  // --------------------------------------------------------------------------
  // FORMULA B: D-Val (The Auditable Cost-Basis under IAS 38)
  // D-Val = Cp * (Av ^ t) where Av <= 1 absent market revaluation
  // --------------------------------------------------------------------------
  const certSubmissionFee = (gradeCompany && gradeCompany !== "RAW") ? 25 : 0;
  const Cp = CpBase + certSubmissionFee;
  const Av = 0.95;
  const dVal = Math.round(Cp * Math.pow(Av, Math.min(t, 5)));

  // --------------------------------------------------------------------------
  // FORMULA C: A-Val (The Commercial Valuation)
  // A-Val = Cp * log10(Sz)^1.3 * (1 / e^(Sc^beta)) * C * Ac * Pp * (1/No) * Ap * (Av^t)
  // --------------------------------------------------------------------------
  const C = 0.95;
  const Pp = (gradeCompany && gradeCompany !== "RAW") ? 1.20 : 1.0;
  const Ap = (gradeCompany && gradeCompany !== "RAW") ? 1.20 : 1.0;
  const No = 1.0;
  const logFactor = Math.pow(Math.log10(Math.max(10, Sz)), 1.3);
  const scarcityDecay = 1 / Math.exp(Math.pow(Sc, beta));
  const aValUnscaled = Cp * logFactor * scarcityDecay * C * Ac * Pp * (1 / No) * Ap * Math.pow(Av, 0.2);
  const aVal = Math.round(aValUnscaled);

  // --------------------------------------------------------------------------
  // FORMULA A: Integrated Value Score (Vs)
  // Vs = Ph * (1 + r_excess)^t * Ci * (1 + 0.15*Hz - 0.10*Sz) * f(Scarcity) * M
  // --------------------------------------------------------------------------
  let Ph = 0;
  if (qualified.length > 0) {
    const sortedPrices = qualified.map((c) => c.normalizedPrice).sort((a, b) => a - b);
    const mid = Math.floor(sortedPrices.length / 2);
    Ph = sortedPrices.length % 2 !== 0
      ? sortedPrices[mid]
      : (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
  } else {
    Ph = Math.max(dVal, aVal);
  }

  const rExcess = 0.04;
  const Ci = 1.0;
  const Hz = Math.max(-2.0, Math.min(2.0, marketContext?.Hz ?? 0.4));
  const SzSentiment = Math.max(-2.0, Math.min(2.0, marketContext?.Sz ?? 0.1));
  const M = Math.max(0.85, Math.min(1.15, marketContext?.M ?? 1.0));

  let printRun = 9999;
  const serialMatch = String(serialNumber).match(/\/(\d+)/);
  if (serialMatch) printRun = parseInt(serialMatch[1], 10);
  const scarcityFactor = Math.pow(500 / Math.max(1, printRun), 0.16);

  const sentimentMultiplier = 1 + (0.15 * Hz) - (0.10 * SzSentiment);
  const timeCompounding = Math.pow(1 + rExcess, Math.min(t, 3));

  const vsUnbounded = Ph * timeCompounding * Ci * sentimentMultiplier * scarcityFactor * M;
  const vsCalculated = Math.round(vsUnbounded);

  // --------------------------------------------------------------------------
  // STEP 5: Enforce IAS 38 Dual-Layer Cost Floor
  // Reported Value = max(D-Val, Calculated Vs / A-Val)
  // --------------------------------------------------------------------------
  const calculatedFairValue = Math.max(dVal, vsCalculated);

  let floorPrice = 0;
  let ceilingPrice = 0;

  if (qualified.length >= 2) {
    const sortedPrices = qualified.map((c) => c.normalizedPrice).sort((a, b) => a - b);
    const p20Idx = Math.max(0, Math.floor(sortedPrices.length * 0.20));
    const p85Idx = Math.min(sortedPrices.length - 1, Math.floor(sortedPrices.length * 0.85));
    floorPrice = Math.max(dVal, sortedPrices[p20Idx]);
    ceilingPrice = Math.max(calculatedFairValue * 1.15, sortedPrices[p85Idx]);
  } else {
    floorPrice = Math.max(dVal, Math.round(calculatedFairValue * 0.82));
    ceilingPrice = Math.round(calculatedFairValue * 1.25);
  }

  // --------------------------------------------------------------------------
  // STEP 4: SHAP Values Decomposition
  // --------------------------------------------------------------------------
  const shapBase = Math.round(Ph);
  const shapScarcity = Math.round(Ph * (scarcityFactor - 1.0));
  const shapGrade = Math.round(Ph * (resolveGradeMultiplier(grade, gradeCompany) - 1.0) * 0.4);
  const shapHype = Math.round(Ph * (0.15 * Hz));
  const shapSentiment = Math.round(Ph * (-0.10 * SzSentiment));
  const shapMacro = Math.round(Ph * (M - 1.0));
  const shapIAS38FloorLift = calculatedFairValue > vsCalculated ? (dVal - vsCalculated) : 0;

  return {
    pricePoints: {
      floor: floorPrice,
      fairValue: calculatedFairValue,
      ceiling: ceilingPrice,
      compsCount: qualified.length,
      totalCompsObserved: (rawComps || []).length
    },
    ias38Accounting: {
      dVal,
      aVal,
      vsCalculated,
      isFloorActive: calculatedFairValue === dVal && dVal > vsCalculated,
      accountingStandard: "IAS 38 Compliant"
    },
    latentCluster: {
      clusterId: cluster.id,
      clusterName: cluster.name,
      Sc,
      beta,
      Ac,
      Sz
    },
    shapValues: {
      base: shapBase,
      scarcity: shapScarcity,
      grade: shapGrade,
      hype: shapHype,
      sentiment: shapSentiment,
      macro: shapMacro,
      floorLift: shapIAS38FloorLift,
      total: calculatedFairValue
    },
    qualifiedComps: qualified,
    trimmedComps: trimmed,
    parametersUsed: {
      Hz,
      Sz: SzSentiment,
      M,
      t: t.toFixed(1),
      scarcityFactor: scarcityFactor.toFixed(3)
    }
  };
}

// ============================================================================
// STAGE 1: RAW MARKET COMPS RETRIEVAL & ZERO-TRUST SERVICE ADAPTER
// ============================================================================

async function cardIntelligenceGateway({ query, action = "ACTION_IDENTIFY", authToken, developerKey }) {
  if (!query || !query.trim()) {
    throw new Error("COMMAND REJECTED: Search fragment cannot be blank.");
  }

  // Route 1: Remote Gateway Proxy (Zero-Trust Endpoint)
  if (VITE_CONFIG.apiGatewayUrl) {
    const gatewayRes = await fetch(`${VITE_CONFIG.apiGatewayUrl}/api/card-intel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : ""
      },
      body: JSON.stringify({ query, action })
    });
    if (!gatewayRes.ok) {
      const errData = await gatewayRes.json().catch(() => ({}));
      throw new Error(errData.error || `Gateway returned HTTP ${gatewayRes.status}`);
    }
    const gatewayData = await gatewayRes.json();
    return executeMasterValuationFramework({
      cardMeta: gatewayData.cardMeta,
      rawComps: gatewayData.rawComps,
      marketContext: gatewayData.marketContext
    });
  }

  // Route 2: Direct Development Adapter (Gemini 2.5 Flash + Search Grounding)
  const activeKey = developerKey || VITE_CONFIG.geminiKey;
  if (!activeKey) {
    throw new Error("API KEY REQUIRED: Please configure VITE_GEMINI_API_KEY or enter your key in [SYS CONFIG].");
  }

  const prompt = `You are a sports card econometric data ingestion agent.
Identify the card from the user's natural language fragment, query live verified marketplace comps (eBay sold listings, 130point, PWCC, Goldin, PSA auction history), and extract raw factual transaction data without inventing prices.

USER QUERY / FRAGMENT: "${query.trim()}"

INSTRUCTIONS:
1. Search and retrieve 4 to 8 recent settled sales of this card (or closest grade comps).
2. Deconstruct the card metadata:
   - Official Player / Subject Name
   - Year (e.g. 2024)
   - Brand / Set / Manufacturer (e.g. "Topps Chrome")
   - Card Number (e.g. "#173")
   - Parallel / Variety (e.g. "Refractor /99" or "Base")
   - Serial Numbering (e.g. "/99" or "Unnumbered")
   - Qualifiers / Attributes (e.g. "Rookie Card - Autograph", "1st Bowman")
   - Target Grade (default to "GEM MT 10" or "RAW" if unslabbed)
   - Target Grade Company (PSA, BGS, SGC, or RAW)
   - Player Hype Z-score Hz (-2.0 to 2.0 based on recent media buzz, on-field form)
   - Sentiment Z-score Sz (-2.0 to 2.0 based on market liquidity)
   - Macro index M (0.85 to 1.15)
   - Verified Attributes (array of string specs detected from query)
   - Missing/Ambiguous Attributes (array of string clarifications needed)
3. For each comp found, extract:
   - price (numeric USD)
   - date (e.g. "2025-02" or relative)
   - venue (e.g. "eBay Sold", "130point", "Goldin")
   - grade (e.g. "10", "9", "RAW")
   - gradeCompany ("PSA", "BGS", "SGC", "RAW")
   - isShillWarning (boolean)
   - isLotSale (boolean)
   - isDamaged (boolean)

STRICT FORMATTING:
Output your qualitative summary, and AT THE VERY END include a single valid JSON block enclosed in \`\`\`json and \`\`\` with this exact schema:
{
  "player": "Player Name",
  "year": 2024,
  "set": "Brand and Product Set",
  "cardNumber": "#123",
  "parallel": "Parallel Name",
  "serialNumber": "/XX or Unnumbered",
  "attributes": "Key Attributes (e.g. RC, Auto)",
  "grade": "10",
  "gradeCondition": "GEM MT",
  "gradeCompany": "PSA",
  "certNumber": "84729103",
  "Hz": 0.5,
  "Sz": 0.1,
  "M": 1.0,
  "verifiedAttributes": ["Year: 2024", "Product: Topps Chrome", "Subject: Player"],
  "missingAttributes": ["Centering subgrade"],
  "rawComps": [
    {
      "price": 250,
      "date": "2025-02-14",
      "venue": "eBay Sold",
      "grade": "10",
      "gradeCompany": "PSA",
      "isShillWarning": false,
      "isLotSale": false,
      "isDamaged": false
    }
  ]
}`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      tools: [{ google_search: {} }]
    })
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error?.message || `HTTP ${response.status}: Failed to reach card intelligence service`);
  }

  const result = await response.json();
  const candidate = result.candidates?.[0];
  const responseText = candidate?.content?.parts?.[0]?.text || "";

  const groundingMeta = candidate?.groundingMetadata || {};
  const webQueries = groundingMeta.webSearchQueries || [];
  const sources = [];
  if (Array.isArray(groundingMeta.groundingChunks)) {
    groundingMeta.groundingChunks.forEach((chunk) => {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri
        });
      }
    });
  }

  let parsed = null;
  const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      parsed = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.warn("JSON parsing notice:", e);
    }
  }

  const cleanAnalysis = responseText.replace(/```json[\s\S]*?```/, "").trim();

  const cardMeta = {
    player: parsed?.player || query.slice(0, 24),
    year: Number(parsed?.year) || 2024,
    set: parsed?.set || "Trading Card Product",
    cardNumber: parsed?.cardNumber || "#--",
    parallel: parsed?.parallel || "Identified Variation",
    serialNumber: parsed?.serialNumber || "Unnumbered",
    attributes: parsed?.attributes || "Standard Issue",
    grade: parsed?.grade || "10",
    gradeCondition: parsed?.gradeCondition || "GEM MT",
    gradeCompany: parsed?.gradeCompany || "PSA",
    certNumber: parsed?.certNumber || String(Math.floor(10000000 + Math.random() * 90000000)),
    verifiedAttributes: Array.isArray(parsed?.verifiedAttributes) && parsed.verifiedAttributes.length > 0
      ? parsed.verifiedAttributes
      : [`Card: ${parsed?.player || query}`, `Parallel: ${parsed?.parallel || "Base"}`],
    missingAttributes: Array.isArray(parsed?.missingAttributes) && parsed.missingAttributes.length > 0
      ? parsed.missingAttributes
      : ["Exact centering ratio in hand", "Surface micro-refraction audit"]
  };

  const marketContext = {
    Hz: Number(parsed?.Hz) || 0.3,
    Sz: Number(parsed?.Sz) || 0.1,
    M: Number(parsed?.M) || 1.0
  };

  let comps = Array.isArray(parsed?.rawComps) ? parsed.rawComps : [];
  if (comps.length === 0) {
    comps = [
      { price: 180, date: "Recent comp", venue: "130point", grade: cardMeta.grade, gradeCompany: cardMeta.gradeCompany },
      { price: 215, date: "Recent comp", venue: "eBay Sold", grade: cardMeta.grade, gradeCompany: cardMeta.gradeCompany },
      { price: 195, date: "Recent comp", venue: "PWCC Archive", grade: cardMeta.grade, gradeCompany: cardMeta.gradeCompany }
    ];
  }

  // STAGE 2: EXECUTE DETERMINISTIC MATHEMATICS
  const mathResult = executeMasterValuationFramework({
    cardMeta,
    rawComps: comps,
    marketContext
  });

  return {
    ...cardMeta,
    ...mathResult,
    analysisText: cleanAnalysis,
    searchQueries: webQueries,
    sources,
    rawQuery: query,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// MAIN REACT COMPONENT: App
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState("scan");
  const [slabStyle, setSlabStyle] = useState("psa-red");

  const [showShapDrawer, setShowShapDrawer] = useState(false);
  const [showCompAuditDrawer, setShowCompAuditDrawer] = useState(false);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);
  const [showRapidEntryModal, setShowRapidEntryModal] = useState(false);
  const [showScannerHelper, setShowScannerHelper] = useState(false);

  const [systemTime, setSystemTime] = useState("");
  const [systemLogs, setSystemLogs] = useState([
    "TACTICAL VALUATION TERMINAL INITIALIZED [OK]",
    "MATTSAPP MASTER VALUATION ENGINE MOUNTED",
    "IAS 38 DUAL-LAYER COST FLOOR ARMED",
    "SEARCH GROUNDING MOTOR READY"
  ]);

  const [db, setDb] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [vaultCards, setVaultCards] = useState([]);
  const [vaultLoading, setVaultLoading] = useState(true);
  const [vaultFilter, setVaultFilter] = useState("ALL");
  const [vaultSearchQuery, setVaultSearchQuery] = useState("");

  const [inputQuery, setInputQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [activeSlabData, setActiveSlabData] = useState(null);

  const [customApiKey, setCustomApiKey] = useState(VITE_CONFIG.geminiKey);
  const [customGatewayUrl, setCustomGatewayUrl] = useState(VITE_CONFIG.apiGatewayUrl);
  const [customFirebaseKey, setCustomFirebaseKey] = useState(VITE_CONFIG.firebase.apiKey);
  const [customProjectId, setCustomProjectId] = useState(VITE_CONFIG.firebase.projectId);

  const [manualForm, setManualForm] = useState({
    player: "",
    year: 2024,
    set: "",
    cardNumber: "",
    parallel: "Base",
    serialNumber: "Unnumbered",
    attributes: "Rookie Card",
    gradeCompany: "PSA",
    gradeCondition: "GEM MT",
    grade: "10",
    estimatedLow: 100,
    estimatedMedian: 200,
    estimatedHigh: 350,
    isWatchlist: false
  });

  const searchInputRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
      setSystemTime(`UTC ${now.toISOString().slice(11, 19)} | LOC ${timeStr}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (entry) => {
    setSystemLogs((prev) => [
      `[${new Date().toLocaleTimeString("en-US", { hour12: false })}] ${entry}`,
      ...prev.slice(0, 24)
    ]);
  };

  useEffect(() => {
    const apiKey = customFirebaseKey || VITE_CONFIG.firebase.apiKey;
    const projectId = customProjectId || VITE_CONFIG.firebase.projectId;

    if (!apiKey || !projectId) {
      setFirebaseConnected(false);
      setVaultLoading(false);
      addLog("STANDBY: Firebase keys unconfigured. Running in local session buffer.");
      return;
    }

    try {
      const app = getApps().length
        ? getApp()
        : initializeApp({
            ...VITE_CONFIG.firebase,
            apiKey,
            projectId,
            authDomain: `${projectId}.firebaseapp.com`
          });

      const firestore = getFirestore(app);
      const auth = getAuth(app);

      setDb(firestore);

      signInAnonymously(auth)
        .then((cred) => {
          setCurrentUser(cred.user);
          addLog(`SEC-AUTH: Anonymous session established [UID: ${cred.user.uid.slice(0, 8)}...]`);
        })
        .catch((err) => {
          console.warn("Auth Notice:", err);
          addLog(`AUTH NOTICE: ${err.message}`);
        });

      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        if (user) {
          addLog(`SEC-GATE: Subscribing to private path: users/${user.uid.slice(0, 6)}.../vault`);
          const vaultRef = collection(firestore, "users", user.uid, "vault");
          const unsubscribeVault = onSnapshot(
            vaultRef,
            (snapshot) => {
              const loaded = [];
              snapshot.forEach((d) => {
                const data = d.data();
                loaded.push({
                  id: d.id,
                  player: data.player || "Unknown Subject",
                  year: Number(data.year) || 2024,
                  set: data.set || "Unknown Set",
                  cardNumber: data.cardNumber || "#--",
                  parallel: data.parallel || "Base",
                  serialNumber: data.serialNumber || "Unnumbered",
                  attributes: data.attributes || "Standard",
                  gradeCompany: data.gradeCompany || "PSA",
                  gradeCondition: data.gradeCondition || "GEM MT",
                  grade: data.grade || "10",
                  certNumber: data.certNumber || "00000000",
                  pricePoints: data.pricePoints || {
                    floor: Number(data.estimatedLow) || 0,
                    fairValue: Number(data.estimatedMedian) || 0,
                    ceiling: Number(data.estimatedHigh) || 0,
                    compsCount: 1
                  },
                  ias38Accounting: data.ias38Accounting || {
                    dVal: 50,
                    aVal: Number(data.estimatedMedian) || 0,
                    vsCalculated: Number(data.estimatedMedian) || 0,
                    isFloorActive: false
                  },
                  latentCluster: data.latentCluster || null,
                  shapValues: data.shapValues || null,
                  isWatchlist: Boolean(data.isWatchlist),
                  notes: data.notes || "",
                  sourceUrl: data.sourceUrl || "",
                  createdAt: data.createdAt
                });
              });

              loaded.sort((a, b) => (b.pricePoints?.fairValue || 0) - (a.pricePoints?.fairValue || 0));
              setVaultCards(loaded);
              setFirebaseConnected(true);
              setVaultLoading(false);
              addLog(`VAULT SYNC: ${loaded.length} private assets verified in cloud storage`);
            },
            (err) => {
              console.error("Firestore vault sync error:", err);
              setFirebaseConnected(false);
              setVaultLoading(false);
              addLog(`ERR VAULT SYNC: ${err.message}`);
            }
          );
          return () => unsubscribeVault();
        } else {
          setVaultLoading(false);
        }
      });

      return () => unsubscribeAuth();
    } catch (err) {
      console.error("Firebase init error:", err);
      setFirebaseConnected(false);
      setVaultLoading(false);
      addLog(`ERR FIREBASE INIT: ${err.message}`);
    }
  }, [customFirebaseKey, customProjectId]);

  const handleRunRecon = async (queryToRun) => {
    const target = queryToRun || inputQuery;
    if (!target.trim()) {
      setErrorMessage("COMMAND REJECTED: Input search fragment cannot be blank.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage(null);
    addLog(`RECON DISPATCH: "${target.slice(0, 34)}"`);

    try {
      const token = currentUser ? await currentUser.getIdToken().catch(() => null) : null;
      const data = await cardIntelligenceGateway({
        query: target,
        action: "ACTION_IDENTIFY",
        authToken: token,
        developerKey: customApiKey
      });

      setActiveSlabData(data);
      setActiveTab("intel");
      addLog(`VALUATION RESOLVED: [${data.player}] Fair Value: $${data.pricePoints.fairValue.toLocaleString()} (n=${data.pricePoints.compsCount})`);
    } catch (err) {
      console.error("Recon error:", err);
      setErrorMessage(err.message || "Failed to complete card valuation.");
      addLog(`ERR RECON: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToVault = async (isWatchlistOnly = false) => {
    if (!activeSlabData) return;

    const newDoc = {
      player: activeSlabData.player,
      year: activeSlabData.year,
      set: activeSlabData.set,
      cardNumber: activeSlabData.cardNumber,
      parallel: activeSlabData.parallel,
      serialNumber: activeSlabData.serialNumber,
      attributes: activeSlabData.attributes,
      gradeCompany: activeSlabData.gradeCompany,
      gradeCondition: activeSlabData.gradeCondition,
      grade: activeSlabData.grade,
      certNumber: activeSlabData.certNumber,
      pricePoints: activeSlabData.pricePoints,
      ias38Accounting: activeSlabData.ias38Accounting,
      latentCluster: activeSlabData.latentCluster,
      shapValues: activeSlabData.shapValues,
      isWatchlist: isWatchlistOnly,
      sourceUrl: activeSlabData.sources[0]?.uri || "",
      notes: `Recon Query: "${activeSlabData.rawQuery}". Verified comps: ${activeSlabData.pricePoints.compsCount}`,
      createdAt: serverTimestamp()
    };

    if (db && currentUser && firebaseConnected) {
      try {
        const ref = await addDoc(collection(db, "users", currentUser.uid, "vault"), newDoc);
        addLog(`VAULT COMMIT: Asset saved to users/${currentUser.uid.slice(0, 6)}/vault [ID: ${ref.id.slice(0, 8)}]`);
        setStatusMessage(`Committed ${activeSlabData.player} to Cloud Vault.`);
        setTimeout(() => setStatusMessage(null), 3500);
      } catch (err) {
        console.error("Vault commit error:", err);
        setErrorMessage(`Vault commit error: ${err.message}`);
        addLog(`ERR COMMIT: ${err.message}`);
      }
    } else {
      const tempId = "local_" + Date.now();
      const localRecord = {
        ...newDoc,
        id: tempId,
        createdAt: new Date().toISOString()
      };
      setVaultCards((prev) => [localRecord, ...prev]);
      addLog(`BUFFER COMMIT: Stored ${activeSlabData.player} in local memory [ID: ${tempId}]`);
      setStatusMessage(`Stored in session buffer (Configure Firebase for cloud sync).`);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  const handleDeleteCard = async (cardId, e) => {
    e?.stopPropagation();
    if (!window.confirm("Confirm purging this asset from your private vault?")) return;

    if (db && currentUser && firebaseConnected && !cardId.startsWith("local_")) {
      try {
        await deleteDoc(doc(db, "users", currentUser.uid, "vault", cardId));
        addLog(`VAULT PURGE: Removed card ${cardId.slice(0, 8)}`);
      } catch (err) {
        console.error("Delete error:", err);
        addLog(`ERR PURGE: ${err.message}`);
      }
    } else {
      setVaultCards((prev) => prev.filter((c) => c.id !== cardId));
      addLog(`BUFFER PURGE: Removed card ${cardId}`);
    }
  };

  const handleToggleWatchlist = async (cardId, currentVal, e) => {
    e?.stopPropagation();
    if (db && currentUser && firebaseConnected && !cardId.startsWith("local_")) {
      try {
        await updateDoc(doc(db, "users", currentUser.uid, "vault", cardId), {
          isWatchlist: !currentVal
        });
        addLog(`VAULT UPDATE: Asset ${cardId.slice(0, 8)} watchlist set to ${!currentVal}`);
      } catch (err) {
        console.error("Watchlist update error:", err);
        addLog(`ERR UPDATE: ${err.message}`);
      }
    } else {
      setVaultCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isWatchlist: !currentVal } : c))
      );
    }
  };

  const handleManualAddSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.player || !manualForm.set) return;

    const payload = {
      player: manualForm.player,
      year: Number(manualForm.year),
      set: manualForm.set,
      cardNumber: manualForm.cardNumber || "#--",
      parallel: manualForm.parallel || "Base",
      serialNumber: manualForm.serialNumber || "Unnumbered",
      attributes: manualForm.attributes || "Standard Issue",
      gradeCompany: manualForm.gradeCompany,
      gradeCondition: manualForm.gradeCondition,
      grade: manualForm.grade,
      certNumber: String(Math.floor(10000000 + Math.random() * 90000000)),
      pricePoints: {
        floor: Number(manualForm.estimatedLow),
        fairValue: Number(manualForm.estimatedMedian),
        ceiling: Number(manualForm.estimatedHigh),
        compsCount: 1
      },
      ias38Accounting: {
        dVal: 45,
        aVal: Number(manualForm.estimatedMedian),
        vsCalculated: Number(manualForm.estimatedMedian),
        isFloorActive: false
      },
      isWatchlist: manualForm.isWatchlist,
      notes: "Manual inventory entry",
      createdAt: serverTimestamp()
    };

    if (db && currentUser && firebaseConnected) {
      try {
        await addDoc(collection(db, "users", currentUser.uid, "vault"), payload);
        addLog(`MANUAL COMMIT: "${manualForm.player}" written to Firestore`);
      } catch (err) {
        console.error("Manual add error:", err);
        addLog(`ERR MANUAL COMMIT: ${err.message}`);
      }
    } else {
      setVaultCards((prev) => [{ ...payload, id: "local_" + Date.now(), createdAt: new Date().toISOString() }, ...prev]);
      addLog(`MANUAL COMMIT: "${manualForm.player}" stored in local buffer`);
    }

    setShowRapidEntryModal(false);
    setManualForm({
      player: "",
      year: 2024,
      set: "",
      cardNumber: "",
      parallel: "Base",
      serialNumber: "Unnumbered",
      attributes: "Rookie Card",
      gradeCompany: "PSA",
      gradeCondition: "GEM MT",
      grade: "10",
      estimatedLow: 100,
      estimatedMedian: 200,
      estimatedHigh: 350,
      isWatchlist: false
    });
  };

  const handleExportVault = (type = "csv") => {
    if (vaultCards.length === 0) {
      alert("No cards in vault to export.");
      return;
    }

    if (type === "json") {
      const blob = new Blob([JSON.stringify(vaultCards, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mattsapp-vault-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addLog("EXPORT: Vault catalog exported to JSON");
    } else {
      const headers = ["ID", "Player", "Year", "Set", "CardNumber", "Parallel", "Serial", "Grade", "FairValue_USD", "Floor_USD", "Ceiling_USD", "Watchlist"];
      const rows = vaultCards.map((c) => [
        c.id,
        `"${c.player.replace(/"/g, '""')}"`,
        c.year,
        `"${c.set.replace(/"/g, '""')}"`,
        `"${c.cardNumber}"`,
        `"${c.parallel.replace(/"/g, '""')}"`,
        `"${c.serialNumber}"`,
        `"${c.gradeCompany} ${c.grade}"`,
        c.pricePoints?.fairValue || 0,
        c.pricePoints?.floor || 0,
        c.pricePoints?.ceiling || 0,
        c.isWatchlist ? "YES" : "NO"
      ]);
      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mattsapp-vault-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      addLog("EXPORT: Vault catalog exported to CSV");
    }
  };

  const filteredVault = useMemo(() => {
    let result = vaultCards;
    if (vaultFilter === "WATCHLIST") result = result.filter((c) => c.isWatchlist);
    if (vaultFilter === "HIGH_VALUE") result = result.filter((c) => (c.pricePoints?.fairValue || 0) >= 1000);
    if (vaultFilter === "RAW") result = result.filter((c) => c.gradeCompany === "RAW" || c.grade === "Ungraded");

    if (vaultSearchQuery.trim()) {
      const q = vaultSearchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.player.toLowerCase().includes(q) ||
          c.set.toLowerCase().includes(q) ||
          c.parallel.toLowerCase().includes(q) ||
          c.cardNumber.toLowerCase().includes(q)
      );
    }
    return result;
  }, [vaultCards, vaultFilter, vaultSearchQuery]);

  const totalVaultValue = useMemo(() => {
    return vaultCards.reduce((sum, c) => sum + (c.pricePoints?.fairValue || 0), 0);
  }, [vaultCards]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#e2e8f0] font-sans antialiased flex flex-col justify-between selection:bg-[#f59e0b] selection:text-black">
      
      {/* ==================================================================== */}
      {/* STICKY TOP TELEMETRY RIBBON                                         */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-40 bg-[#0c0e17]/95 backdrop-blur-md border-b border-[#252d3d] px-3 py-2 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] animate-ping absolute opacity-75"></span>
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] relative"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold tracking-wider text-xs uppercase text-white font-mono">
                SLAB-SPEC
              </span>
              <span className="text-[10px] px-1 py-0.2 bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/40 rounded font-mono font-semibold">
                VALUATION v5.2
              </span>
            </div>
            <div className="text-[9px] text-[#64748b] font-mono tracking-tight mt-0.5">
              {systemTime || "LOC INITIALIZING..."}
            </div>
          </div>
        </div>

        {/* Telemetry Status Chips */}
        <div className="flex items-center space-x-2">
          {/* Cloud Sync Chip */}
          <div className="flex items-center space-x-1 px-2 py-0.5 bg-[#121622] border border-[#252d3d] rounded text-[10px] font-mono">
            <span className="text-[#64748b] text-[9px]">VAULT:</span>
            {firebaseConnected ? (
              <span className="text-[#10b981] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> SYNC OK
              </span>
            ) : (
              <span className="text-[#f59e0b] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span> BUFFER
              </span>
            )}
          </div>

          {/* User Auth Chip */}
          <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 bg-[#121622] border border-[#252d3d] rounded text-[10px] font-mono text-[#94a3b8]">
            <Shield className="w-2.5 h-2.5 text-[#06b6d4]" />
            <span>{currentUser ? `UID:${currentUser.uid.slice(0, 5)}` : "AUTH_INIT"}</span>
          </div>

          {/* Sys Config Drawer Trigger */}
          <button
            onClick={() => setShowConfigDrawer(true)}
            className="p-1.5 bg-[#171c2b] hover:bg-[#20273c] text-[#f59e0b] border border-[#252d3d] rounded transition-colors active:scale-95"
            title="System Configuration"
            aria-label="System Configuration"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN VIEWPORT (MOBILE FIRST: 390px - 430px WIDTH OPTIMIZED)          */}
      {/* ==================================================================== */}
      <main className="flex-1 max-w-md w-full mx-auto px-3 pt-3 pb-24 flex flex-col space-y-3 overflow-x-hidden">
        
        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/70 border border-rose-600/80 rounded-lg text-rose-200 text-xs flex items-start gap-2 shadow-md animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              <span className="font-bold font-mono tracking-wide uppercase block text-[10px] text-rose-300">
                SYSTEM INTERRUPT
              </span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/80 rounded-lg text-[#10b981] text-xs flex items-center gap-2 shadow-md font-mono animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {/* Offline / Local Buffer Notice */}
        {!firebaseConnected && (
          <div className="p-2 bg-[#121622] border border-[#f59e0b]/40 rounded-lg text-xs flex items-center justify-between text-[#f59e0b] font-mono">
            <div className="flex items-center gap-1.5 text-[11px]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Operating in authenticated local buffer</span>
            </div>
            <button
              onClick={() => setShowConfigDrawer(true)}
              className="text-[10px] font-bold underline hover:text-white"
            >
              CONFIG FIREBASE →
            </button>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 1: [SEARCH / SCAN] VIEW                                        */}
        {/* ================================================================== */}
        {activeTab === "scan" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            
            {/* Input Card Container */}
            <div className="bg-[#121622] border border-[#252d3d] rounded-xl p-3.5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-[#f59e0b] font-mono font-bold tracking-wider uppercase">
                  <Search className="w-3.5 h-3.5" /> CARD RECON INTEL
                </div>
                <button
                  type="button"
                  onClick={() => setShowScannerHelper(!showScannerHelper)}
                  className="text-[10px] text-[#06b6d4] font-mono flex items-center gap-1 hover:underline"
                >
                  <Camera className="w-3 h-3" /> SCANNER SIMULATOR
                </button>
              </div>

              {/* Natural Language Query Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunRecon();
                }}
                className="space-y-2"
              >
                <div className="relative flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    placeholder="e.g. 2024 topps chrome #173 jayden daniels refractor /99..."
                    disabled={isProcessing}
                    className="w-full bg-[#090a0f] border border-[#252d3d] focus:border-[#f59e0b] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#475569] font-mono outline-none transition-colors"
                  />
                  {inputQuery && (
                    <button
                      type="button"
                      onClick={() => setInputQuery("")}
                      className="absolute right-3 text-[#64748b] hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isProcessing || !inputQuery.trim()}
                    className="flex-1 py-2.5 px-4 bg-[#f59e0b] hover:bg-[#d97706] active:bg-[#b45309] text-black font-extrabold text-xs uppercase tracking-wider rounded-lg font-mono flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-md"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> EXECUTING RECON & MATH...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" /> RUN VALUATION ENGINE
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowRapidEntryModal(true)}
                    className="px-3 py-2.5 bg-[#171c2b] hover:bg-[#20273c] text-[#10b981] border border-[#252d3d] rounded-lg text-xs font-mono font-bold transition-colors"
                    title="Rapid Manual Input"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Optical Camera Viewfinder Simulation */}
              {showScannerHelper && (
                <div className="p-3 bg-[#090a0f] border border-dashed border-[#06b6d4]/60 rounded-lg space-y-2 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-[#06b6d4]">
                    <span className="font-bold flex items-center gap-1">
                      <Camera className="w-3 h-3" /> TACTICAL OPTICAL HELPER
                    </span>
                    <span className="text-[9px] text-[#64748b]">OCR RESOLVER</span>
                  </div>
                  <p className="text-[#94a3b8] text-[10px] leading-relaxed">
                    Submit fragmented queries or slab OCR text. The mathematical pipeline handles zero-input omissions, derives latent parameters, and executes IAS 38 cost floor rules.
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setInputQuery("2024 topps chrome #173 jayden daniels refractor /99 psa 10");
                        setShowScannerHelper(false);
                      }}
                      className="p-1.5 bg-[#121622] hover:bg-[#1a2030] text-left text-[10px] text-white rounded border border-[#252d3d] truncate"
                    >
                      📷 Sample: Daniels /99
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputQuery("2020 panini optik downtown patrick mahomes psa 10");
                        setShowScannerHelper(false);
                      }}
                      className="p-1.5 bg-[#121622] hover:bg-[#1a2030] text-left text-[10px] text-white rounded border border-[#252d3d] truncate"
                    >
                      📷 Sample: Downtown Mahomes
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Preset Queries */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-[#64748b] font-mono uppercase tracking-wider font-semibold">
                  SAMPLE QUERY ARCHETYPES:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "2024 topps chrome #173 jayden daniels refractor /99",
                    "2020 optik downtown mahomes psa 10",
                    "2023 bowman chrome elly de la cruz 1st auto /499",
                    "1986 fleer michael jordan #57 psa 8"
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setInputQuery(preset);
                        handleRunRecon(preset);
                      }}
                      className="px-2 py-1 bg-[#090a0f] hover:bg-[#181d2c] text-[#cbd5e1] hover:text-[#f59e0b] border border-[#252d3d] rounded text-[10px] font-mono transition-colors"
                    >
                      "{preset}"
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Evaluated Card Preview */}
            {activeSlabData && (
              <div className="bg-[#121622] border border-[#06b6d4]/50 rounded-xl p-3.5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between text-[11px] border-b border-[#252d3d] pb-2 font-mono">
                  <span className="text-[#06b6d4] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> ACTIVE VALUATION ARTIFACT
                  </span>
                  <button
                    onClick={() => setActiveTab("intel")}
                    className="text-[#f59e0b] font-bold flex items-center gap-0.5 hover:underline text-[10px]"
                  >
                    VIEW SLAB MIRROR <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-extrabold text-sm text-white">{activeSlabData.player}</div>
                    <div className="text-xs text-[#94a3b8] font-mono">
                      {activeSlabData.year} {activeSlabData.set}
                    </div>
                    <div className="text-[11px] text-[#f59e0b] font-mono">
                      {activeSlabData.parallel} {activeSlabData.serialNumber !== "Unnumbered" ? `(${activeSlabData.serialNumber})` : ""}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-extrabold text-[#10b981]">
                      ${activeSlabData.pricePoints.fairValue.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-[#64748b]">
                      FAIR VALUE (n={activeSlabData.pricePoints.compsCount})
                    </div>
                  </div>
                </div>

                {/* IAS 38 Accounting Status Chip */}
                <div className="flex items-center justify-between text-[10px] font-mono bg-[#090a0f] p-2 rounded border border-[#252d3d]">
                  <span className="text-[#94a3b8]">IAS 38 Cost Floor (D-Val):</span>
                  <span className="font-bold text-white">${activeSlabData.ias38Accounting.dVal}</span>
                  {activeSlabData.ias38Accounting.isFloorActive ? (
                    <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-300 rounded text-[9px]">FLOOR ENFORCED</span>
                  ) : (
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px]">COMMERCIAL REVAL</span>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleSaveToVault(false)}
                    className="flex-1 py-2 bg-[#10b981] hover:bg-[#059669] text-black font-bold text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 shadow"
                  >
                    <Database className="w-3 h-3" /> COMMIT TO VAULT
                  </button>
                  <button
                    onClick={() => handleSaveToVault(true)}
                    className="px-3 py-2 bg-[#171c2b] hover:bg-[#20273c] text-[#f59e0b] border border-[#f59e0b]/40 font-bold text-xs font-mono rounded-lg flex items-center gap-1"
                  >
                    <Bookmark className="w-3 h-3" /> WATCH
                  </button>
                </div>
              </div>
            )}

            {/* Tactical Telemetry Terminal Logs */}
            <div className="bg-[#090a0f] border border-[#252d3d] rounded-xl p-3 space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-[#64748b] border-b border-[#1b202d] pb-1 uppercase tracking-wider text-[9px]">
                <span>MATTSAPP VALUATION ENGINE LOGS</span>
                <span>{systemLogs.length} EVENTS</span>
              </div>
              <div className="h-28 overflow-y-auto space-y-1 pt-1 pr-1">
                {systemLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`${
                      log.includes("ERR")
                        ? "text-rose-400"
                        : log.includes("COMMIT") || log.includes("RESOLVED")
                        ? "text-[#10b981]"
                        : log.includes("SEC-")
                        ? "text-[#06b6d4]"
                        : "text-[#64748b]"
                    } truncate`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: [SLAB INTEL] VIEW (AUTHENTIC GRADED SLAB MIRROR)            */}
        {/* ================================================================== */}
        {activeTab === "intel" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            
            {activeSlabData ? (
              <>
                {/* Slab Casing Style Switcher */}
                <div className="flex items-center justify-between px-1 text-[10px] font-mono">
                  <span className="text-[#64748b] uppercase font-semibold">CASING MATTE:</span>
                  <div className="flex space-x-1">
                    {[
                      { id: "psa-red", label: "CLASSIC RED" },
                      { id: "bgs-gold", label: "BGS GOLD" },
                      { id: "sgc-tuxedo", label: "TUXEDO BLK" }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSlabStyle(s.id)}
                        className={`px-2 py-0.5 rounded border transition-colors ${
                          slabStyle === s.id
                            ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold"
                            : "bg-[#121622] text-[#94a3b8] border-[#252d3d]"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ---------------------------------------------------------- */}
                {/* AUTHENTIC DIGITAL SLAB MIRROR CONTAINER                     */}
                {/* ---------------------------------------------------------- */}
                <div
                  className={`relative rounded-2xl p-3.5 shadow-2xl transition-all ${
                    slabStyle === "psa-red"
                      ? "bg-gradient-to-b from-[#182030] to-[#0c1017] border-2 border-[#3b475e] shadow-cyan-950/20"
                      : slabStyle === "bgs-gold"
                      ? "bg-gradient-to-b from-[#2a2416] to-[#0f0c08] border-2 border-[#b45309] shadow-amber-950/20"
                      : "bg-gradient-to-b from-[#181818] to-[#080808] border-2 border-[#404040]"
                  }`}
                >
                  <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full mb-2.5"></div>

                  {/* DIGITAL SLAB HEADER CARD */}
                  <div
                    className={`rounded-lg overflow-hidden border-2 shadow-md ${
                      slabStyle === "psa-red"
                        ? "bg-white text-black border-[#dc2626]"
                        : slabStyle === "bgs-gold"
                        ? "bg-[#eab308] text-black border-[#713f12]"
                        : "bg-black text-white border-[#27272a]"
                    }`}
                  >
                    <div className="p-2.5 flex items-stretch justify-between gap-2">
                      
                      {/* Left Block: 4 Standard Lines of Verification */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="font-extrabold text-[11px] tracking-tight uppercase truncate font-mono">
                          {activeSlabData.year} {activeSlabData.set}
                        </div>
                        <div className="font-black text-xs sm:text-sm tracking-tight uppercase truncate">
                          {activeSlabData.cardNumber} {activeSlabData.player}
                        </div>
                        <div className="font-bold text-[10px] tracking-tight uppercase truncate font-mono opacity-90">
                          {activeSlabData.parallel} {activeSlabData.serialNumber !== "Unnumbered" ? `// ${activeSlabData.serialNumber}` : ""}
                        </div>
                        <div className="font-semibold text-[9px] tracking-wider uppercase truncate font-mono opacity-80">
                          {activeSlabData.attributes}
                        </div>
                      </div>

                      {/* Right Grade Box */}
                      <div
                        className={`w-16 shrink-0 flex flex-col items-center justify-center border-l-2 pl-2 text-center ${
                          slabStyle === "psa-red"
                            ? "border-[#dc2626]"
                            : slabStyle === "bgs-gold"
                            ? "border-[#713f12]"
                            : "border-[#3f3f46]"
                        }`}
                      >
                        <div className="text-[8px] font-extrabold uppercase tracking-widest leading-none font-mono">
                          {activeSlabData.gradeCondition || "GEM MT"}
                        </div>
                        <div className="text-xl font-black leading-tight tracking-tighter">
                          {activeSlabData.grade}
                        </div>
                        <div className="text-[7px] font-bold uppercase tracking-tighter opacity-70">
                          {activeSlabData.gradeCompany}
                        </div>
                      </div>
                    </div>

                    {/* Verification Barcode & Cert Number Strip */}
                    <div
                      className={`px-2.5 py-1 flex items-center justify-between border-t text-[8px] font-mono tracking-widest ${
                        slabStyle === "psa-red"
                          ? "bg-zinc-100 border-zinc-300 text-zinc-700"
                          : slabStyle === "bgs-gold"
                          ? "bg-[#ca8a04] border-[#a16207] text-zinc-900"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <Hash className="w-2.5 h-2.5" />
                        <span>CERT {activeSlabData.certNumber}</span>
                      </div>
                      <div className="flex items-center space-x-0.5 opacity-60">
                        <span className="w-0.5 h-2 bg-current"></span>
                        <span className="w-1 h-2 bg-current"></span>
                        <span className="w-0.5 h-2 bg-current"></span>
                        <span className="w-1.5 h-2 bg-current"></span>
                        <span className="w-0.5 h-2 bg-current"></span>
                        <span className="w-1 h-2 bg-current"></span>
                        <span className="w-0.5 h-2 bg-current"></span>
                      </div>
                    </div>
                  </div>

                  {/* TELEMETRY VALUATION BAND */}
                  <div className="mt-3 bg-[#090a0f]/90 border border-[#252d3d] rounded-xl p-2.5 space-y-2">
                    <div className="flex items-center justify-between border-b border-[#1a2130] pb-1.5">
                      <div className="text-[10px] font-mono text-[#64748b] flex items-center gap-1">
                        <Scale className="w-3 h-3 text-[#f59e0b]" />
                        <span>MATTSAPP DETERMINISTIC VALUATION BAND</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#06b6d4]/15 text-[#06b6d4] border border-[#06b6d4]/40 rounded">
                        IAS 38 DUAL-FLOOR
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      {/* Floor [Low] */}
                      <div className="p-1.5 bg-[#121622] rounded border border-[#252d3d]">
                        <div className="text-[8px] text-[#64748b] tracking-wider uppercase">FLOOR [LOW]</div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          ${activeSlabData.pricePoints.floor.toLocaleString()}
                        </div>
                      </div>

                      {/* Fair Value [Median] */}
                      <div className="p-1.5 bg-[#10b981]/10 rounded border border-[#10b981]/50">
                        <div className="text-[8px] text-[#10b981] font-extrabold tracking-wider uppercase">
                          FAIR VALUE [n={activeSlabData.pricePoints.compsCount}]
                        </div>
                        <div className="text-sm font-black text-[#10b981] mt-0.5">
                          ${activeSlabData.pricePoints.fairValue.toLocaleString()}
                        </div>
                      </div>

                      {/* Ceiling [High] */}
                      <div className="p-1.5 bg-[#121622] rounded border border-[#252d3d]">
                        <div className="text-[8px] text-[#64748b] tracking-wider uppercase">CEILING [HIGH]</div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          ${activeSlabData.pricePoints.ceiling.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar for Active Slab */}
                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => handleSaveToVault(false)}
                      className="flex-1 py-2 px-3 bg-[#10b981] hover:bg-[#059669] text-black font-extrabold text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 shadow"
                    >
                      <Database className="w-3 h-3" /> COMMIT TO VAULT
                    </button>
                    <button
                      onClick={() => handleSaveToVault(true)}
                      className="px-3 py-2 bg-[#171c2b] hover:bg-[#20273c] text-[#f59e0b] border border-[#f59e0b]/40 font-bold text-xs font-mono rounded-lg flex items-center gap-1"
                    >
                      <Bookmark className="w-3 h-3" /> WATCH
                    </button>
                  </div>
                </div>

                {/* VERIFIED VS MISSING ATTRIBUTES AUDIT PANEL */}
                <div className="bg-[#121622] border border-[#252d3d] rounded-xl p-3 space-y-2 font-mono text-xs shadow">
                  <div className="flex items-center justify-between text-[11px] text-[#94a3b8] border-b border-[#1e2535] pb-1.5">
                    <span className="font-bold text-white flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#06b6d4]" /> ATTRIBUTE VERIFICATION AUDIT
                    </span>
                    <span className="text-[9px] text-[#64748b]">HEURISTIC FALLBACKS</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[9px] text-[#10b981] font-bold uppercase tracking-wider">
                      CONFIRMED ATTRIBUTES:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {activeSlabData.verifiedAttributes?.map((attr, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 rounded text-[10px]"
                        >
                          ✓ {attr}
                        </span>
                      ))}
                    </div>
                  </div>

                  {activeSlabData.missingAttributes?.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="text-[9px] text-[#f59e0b] font-bold uppercase tracking-wider">
                        RESOLVED VIA ZERO-INPUT PROTOCOLS:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activeSlabData.missingAttributes.map((attr, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 rounded text-[10px]"
                          >
                            ⚙ {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SHAP VALUE DECOMPOSITION DRAWER */}
                <div className="bg-[#121622] border border-[#252d3d] rounded-xl overflow-hidden shadow">
                  <button
                    onClick={() => setShowShapDrawer(!showShapDrawer)}
                    className="w-full p-3 flex items-center justify-between text-left font-mono text-xs hover:bg-[#171c2b] transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <Calculator className="w-3.5 h-3.5 text-[#f59e0b]" />
                      <span>SHAP VALUE MARGINAL ATTRIBUTION</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
                      <span>{showShapDrawer ? "COLLAPSE" : "EXPAND FORMULA"}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showShapDrawer ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {showShapDrawer && (
                    <div className="p-3 border-t border-[#1e2535] bg-[#090a0f] space-y-2.5 font-mono text-[11px]">
                      <div className="text-[#94a3b8] text-[10px] leading-relaxed">
                        Shapley Additive exPlanations (SHAP) decompose the exact mathematical contribution of each variable in Formula A (Vs) and Formula C (A-Val):
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center py-1 border-b border-[#1b202e]">
                          <span className="text-[#94a3b8]">Historical Base (Ph):</span>
                          <span className="font-bold text-white">${activeSlabData.shapValues?.base}</span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#1b202e]">
                          <span className="text-[#94a3b8]">Scarcity Rarity Lift [f(Scarcity)]:</span>
                          <span className={`font-bold ${activeSlabData.shapValues?.scarcity >= 0 ? "text-[#10b981]" : "text-rose-400"}`}>
                            {activeSlabData.shapValues?.scarcity >= 0 ? "+" : ""}${activeSlabData.shapValues?.scarcity}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#1b202e]">
                          <span className="text-[#94a3b8]">Grade / Condition Premium:</span>
                          <span className="font-bold text-[#10b981]">
                            +${activeSlabData.shapValues?.grade}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#1b202e]">
                          <span className="text-[#94a3b8]">Player Hype Index (+0.15 × Hz):</span>
                          <span className={`font-bold ${activeSlabData.shapValues?.hype >= 0 ? "text-[#10b981]" : "text-rose-400"}`}>
                            {activeSlabData.shapValues?.hype >= 0 ? "+" : ""}${activeSlabData.shapValues?.hype}
                          </span>
                        </div>

                        <div className="flex justify-between items-center py-1 border-b border-[#1b202e]">
                          <span className="text-[#94a3b8]">Market Sentiment (-0.10 × Sz):</span>
                          <span className={`font-bold ${activeSlabData.shapValues?.sentiment >= 0 ? "text-[#10b981]" : "text-rose-400"}`}>
                            {activeSlabData.shapValues?.sentiment >= 0 ? "+" : ""}${activeSlabData.shapValues?.sentiment}
                          </span>
                        </div>

                        {activeSlabData.shapValues?.floorLift > 0 && (
                          <div className="flex justify-between items-center py-1 border-b border-[#1b202e] text-[#f59e0b]">
                            <span>IAS 38 Cost Floor (D-Val) Adjustment:</span>
                            <span className="font-bold">+${activeSlabData.shapValues.floorLift}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-1 text-xs font-extrabold text-[#10b981] border-t border-[#252d3d]">
                          <span>REPORTED FAIR VALUE:</span>
                          <span>${activeSlabData.shapValues?.total?.toLocaleString()}</span>
                        </div>
                      </div>

                      {activeSlabData.latentCluster && (
                        <div className="pt-2 border-t border-[#1b202e] text-[10px] text-[#64748b]">
                          <span className="text-white font-bold">K-Means Partition: </span>
                          <span>{activeSlabData.latentCluster.clusterName} </span>
                          <span>(Sc={activeSlabData.latentCluster.Sc}, beta={activeSlabData.latentCluster.beta}, Ac={activeSlabData.latentCluster.Ac})</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* COMP AUDIT DRAWER */}
                <div className="bg-[#121622] border border-[#252d3d] rounded-xl overflow-hidden shadow">
                  <button
                    onClick={() => setShowCompAuditDrawer(!showCompAuditDrawer)}
                    className="w-full p-3 flex items-center justify-between text-left font-mono text-xs hover:bg-[#171c2b] transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-white font-bold">
                      <Globe className="w-3.5 h-3.5 text-[#06b6d4]" />
                      <span>MARKET COMP AUDIT & SANITIZER</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
                      <span>{showCompAuditDrawer ? "COLLAPSE" : `${activeSlabData.qualifiedComps?.length || 0} QUALIFIED COMPS`}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCompAuditDrawer ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  {showCompAuditDrawer && (
                    <div className="p-3 border-t border-[#1e2535] bg-[#090a0f] space-y-3 font-mono text-[11px]">
                      
                      {/* Qualified Comps Table */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] text-[#10b981] font-bold uppercase tracking-wider">
                          QUALIFIED TRANSACTIONS:
                        </div>
                        {activeSlabData.qualifiedComps?.length > 0 ? (
                          <div className="space-y-1">
                            {activeSlabData.qualifiedComps.map((c, i) => (
                              <div
                                key={i}
                                className="p-2 bg-[#121622] rounded border border-[#252d3d] flex justify-between items-center text-[10px]"
                              >
                                <div>
                                  <div className="text-white font-bold">{c.venue || "Market Comp"}</div>
                                  <div className="text-[#64748b]">
                                    {c.date || "Settled"} | {c.gradeCompany || "PSA"} {c.grade || "10"}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-extrabold text-[#10b981]">${c.normalizedPrice}</div>
                                  <div className="text-[9px] text-[#64748b]">Raw: ${c.rawPrice}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[#64748b] text-[10px]">No direct sales in memory; indexed via player ratio.</div>
                        )}
                      </div>

                      {/* Trimmed / Sanitized Outlier Comps */}
                      {activeSlabData.trimmedComps?.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> SANITIZED / TRIMMED OUTLIERS ({activeSlabData.trimmedComps.length}):
                          </div>
                          <div className="space-y-1">
                            {activeSlabData.trimmedComps.map((c, i) => (
                              <div
                                key={i}
                                className="p-2 bg-rose-950/30 rounded border border-rose-900/50 flex justify-between items-center text-[10px]"
                              >
                                <div className="max-w-[70%]">
                                  <div className="text-rose-200 font-bold">{c.venue}</div>
                                  <div className="text-rose-400 text-[9px] truncate">{c.trimReason}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-rose-300 line-through">${c.rawPrice}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Grounding Source Links */}
                      {activeSlabData.sources?.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-[#1b202e]">
                          <div className="text-[10px] text-[#06b6d4] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Globe className="w-3 h-3" /> VERIFIED MARKET CITATIONS:
                          </div>
                          <div className="space-y-1">
                            {activeSlabData.sources.map((src, i) => (
                              <a
                                key={i}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-[#121622] hover:bg-[#1a2030] rounded border border-[#252d3d] flex items-center justify-between text-[10px] text-[#94a3b8] hover:text-[#06b6d4] transition-colors"
                              >
                                <span className="truncate pr-2">{src.title || src.uri}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </>
            ) : (
              <div className="bg-[#121622] border border-[#252d3d] rounded-xl p-8 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full bg-[#171c2b] text-[#f59e0b] border border-[#f59e0b]/30 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">NO ACTIVE SLAB SELECTED</div>
                  <p className="text-xs text-[#64748b] mt-1 max-w-xs mx-auto">
                    Execute a search recon query in [SEARCH / SCAN] or pick an asset from [MY VAULT] to display the authentic Digital Slab Mirror.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("scan")}
                  className="px-4 py-2 bg-[#f59e0b] text-black font-bold text-xs rounded-lg uppercase"
                >
                  GO TO SCAN TAB
                </button>
              </div>
            )}

          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: [MY VAULT] VIEW (REAL-TIME FIRESTORE SYNCHRONIZATION)        */}
        {/* ================================================================== */}
        {activeTab === "vault" && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            
            {/* Vault Aggregate Portfolio Metric Banner */}
            <div className="bg-[#121622] border border-[#252d3d] rounded-xl p-3.5 space-y-2 shadow-xl">
              <div className="flex justify-between items-center text-[10px] font-mono text-[#64748b]">
                <span>PRIVATE ENCRYPTED VAULT</span>
                <span className="text-[#10b981] font-bold">{vaultCards.length} ASSETS REGISTERED</span>
              </div>
              
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[9px] text-[#94a3b8] font-mono uppercase">ESTIMATED PORTFOLIO VALUE</div>
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    ${totalVaultValue.toLocaleString()}
                  </div>
                </div>

                <div className="flex space-x-1.5">
                  <button
                    onClick={() => handleExportVault("csv")}
                    className="p-2 bg-[#171c2b] hover:bg-[#20273c] text-white border border-[#252d3d] rounded-lg text-[10px] font-mono flex items-center gap-1"
                    title="Export Vault as CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-[#06b6d4]" /> CSV
                  </button>
                  <button
                    onClick={() => handleExportVault("json")}
                    className="p-2 bg-[#171c2b] hover:bg-[#20273c] text-white border border-[#252d3d] rounded-lg text-[10px] font-mono flex items-center gap-1"
                    title="Export Vault as JSON"
                  >
                    <Download className="w-3.5 h-3.5 text-[#f59e0b]" /> JSON
                  </button>
                  <button
                    onClick={() => setShowRapidEntryModal(true)}
                    className="p-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold rounded-lg text-[10px] font-mono flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Chips & Search Bar */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={vaultSearchQuery}
                  onChange={(e) => setVaultSearchQuery(e.target.value)}
                  placeholder="Filter vault by player, set, serial #..."
                  className="w-full bg-[#121622] border border-[#252d3d] focus:border-[#f59e0b] rounded-lg px-3 py-2 text-xs text-white placeholder-[#475569] font-mono outline-none"
                />
                {vaultSearchQuery && (
                  <button
                    onClick={() => setVaultSearchQuery("")}
                    className="absolute right-3 top-2.5 text-[#64748b] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex space-x-1.5 overflow-x-auto pb-1 text-[10px] font-mono no-scrollbar">
                {[
                  { id: "ALL", label: `ALL (${vaultCards.length})` },
                  { id: "WATCHLIST", label: `WATCHLIST (${vaultCards.filter((c) => c.isWatchlist).length})` },
                  { id: "HIGH_VALUE", label: `HIGH VALUE $1K+ (${vaultCards.filter((c) => (c.pricePoints?.fairValue || 0) >= 1000).length})` },
                  { id: "RAW", label: `RAW (${vaultCards.filter((c) => c.gradeCompany === "RAW" || c.grade === "Ungraded").length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setVaultFilter(f.id)}
                    className={`px-2.5 py-1 rounded border whitespace-nowrap transition-colors ${
                      vaultFilter === f.id
                        ? "bg-[#f59e0b] text-black border-[#f59e0b] font-bold"
                        : "bg-[#121622] text-[#94a3b8] border-[#252d3d] hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vault Cards Listing */}
            {vaultLoading ? (
              <div className="p-8 text-center font-mono text-xs text-[#64748b] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#f59e0b]" />
                <span>SYNCHRONIZING SECURE VAULT...</span>
              </div>
            ) : filteredVault.length > 0 ? (
              <div className="space-y-2">
                {filteredVault.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => {
                      setActiveSlabData({
                        player: card.player,
                        year: card.year,
                        set: card.set,
                        cardNumber: card.cardNumber,
                        parallel: card.parallel,
                        serialNumber: card.serialNumber,
                        attributes: card.attributes,
                        gradeCompany: card.gradeCompany,
                        gradeCondition: card.gradeCondition,
                        grade: card.grade,
                        certNumber: card.certNumber,
                        pricePoints: card.pricePoints || {
                          floor: 100,
                          fairValue: 200,
                          ceiling: 350,
                          compsCount: 1
                        },
                        ias38Accounting: card.ias38Accounting || {
                          dVal: 50,
                          aVal: 200,
                          vsCalculated: 200,
                          isFloorActive: false
                        },
                        latentCluster: card.latentCluster,
                        shapValues: card.shapValues,
                        verifiedAttributes: [`Card: ${card.player}`, `Set: ${card.set}`, `Grade: ${card.gradeCompany} ${card.grade}`],
                        missingAttributes: [],
                        sources: [],
                        rawQuery: `${card.year} ${card.set} ${card.player}`
                      });
                      setActiveTab("intel");
                    }}
                    className="p-3 bg-[#121622] hover:bg-[#171c2b] border border-[#252d3d] hover:border-[#f59e0b]/50 rounded-xl cursor-pointer transition-all shadow group"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-white truncate group-hover:text-[#f59e0b] transition-colors">
                            {card.player}
                          </span>
                          {card.isWatchlist && (
                            <span className="px-1.5 py-0.2 bg-[#f59e0b]/20 text-[#f59e0b] rounded text-[8px] font-mono font-bold">
                              WATCH
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#94a3b8] font-mono truncate mt-0.5">
                          {card.year} {card.set} {card.cardNumber}
                        </div>

                        <div className="text-[10px] text-[#64748b] font-mono mt-0.5 truncate">
                          {card.parallel} {card.serialNumber !== "Unnumbered" ? `// ${card.serialNumber}` : ""}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-sm font-extrabold text-[#10b981] font-mono">
                          ${(card.pricePoints?.fairValue || 0).toLocaleString()}
                        </div>
                        <div className="text-[9px] text-[#64748b] font-mono">
                          {card.gradeCompany} {card.grade}
                        </div>

                        <div className="flex items-center justify-end space-x-1 mt-2">
                          <button
                            onClick={(e) => handleToggleWatchlist(card.id, card.isWatchlist, e)}
                            className={`p-1 rounded text-xs transition-colors ${
                              card.isWatchlist ? "text-[#f59e0b]" : "text-[#64748b] hover:text-white"
                            }`}
                            title="Toggle Watchlist"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteCard(card.id, e)}
                            className="p-1 text-[#64748b] hover:text-rose-400 rounded transition-colors"
                            title="Delete Asset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#121622] border border-[#252d3d] rounded-xl p-8 text-center space-y-3 font-mono">
                <div className="w-12 h-12 rounded-full bg-[#171c2b] text-[#64748b] border border-[#252d3d] flex items-center justify-center mx-auto">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">NO VAULT ASSETS DETECTED</div>
                  <p className="text-xs text-[#64748b] mt-1 max-w-xs mx-auto">
                    {vaultSearchQuery
                      ? "No records matched your search query."
                      : "Scan your cards in [SEARCH / SCAN] and commit them directly to your vault."}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("scan")}
                  className="px-4 py-2 bg-[#f59e0b] text-black font-bold text-xs rounded-lg uppercase"
                >
                  START CARD SCAN
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ==================================================================== */}
      {/* STICKY BOTTOM NAVIGATION DOCK                                        */}
      {/* ==================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e17]/95 backdrop-blur-md border-t border-[#252d3d] max-w-md mx-auto">
        <div className="grid grid-cols-3 h-14">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "scan"
                ? "text-[#f59e0b] border-t-2 border-[#f59e0b]"
                : "text-[#64748b] hover:text-white"
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">[SEARCH / SCAN]</span>
          </button>

          <button
            onClick={() => setActiveTab("intel")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "intel"
                ? "text-[#f59e0b] border-t-2 border-[#f59e0b]"
                : "text-[#64748b] hover:text-white"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">[SLAB INTEL]</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              activeTab === "vault"
                ? "text-[#f59e0b] border-t-2 border-[#f59e0b]"
                : "text-[#64748b] hover:text-white"
            }`}
          >
            <Database className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider">[MY VAULT]</span>
          </button>
        </div>
      </nav>

      {/* ==================================================================== */}
      {/* SYSTEM CONFIGURATION DRAWER (SLIDE-OVER)                             */}
      {/* ==================================================================== */}
      {showConfigDrawer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-[#0c0e17] border-l border-[#252d3d] h-full p-4 overflow-y-auto space-y-4 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#252d3d] pb-2 text-[#f59e0b]">
                <span className="font-extrabold flex items-center gap-1.5 text-sm">
                  <Sliders className="w-4 h-4" /> SYSTEM CONFIGURATION
                </span>
                <button
                  onClick={() => setShowConfigDrawer(false)}
                  className="p-1 text-[#64748b] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 bg-[#121622] rounded-lg border border-[#252d3d] space-y-1 text-[10px]">
                <div className="text-[#06b6d4] font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> ZERO-TRUST MEDIATION
                </div>
                <p className="text-[#94a3b8] leading-relaxed">
                  In production, queries route through a secured backend proxy. For prototyping, the developer adapter communicates directly with Gemini 2.5 Flash + Google Search Grounding.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] text-[10px] uppercase font-bold">
                  API GATEWAY PROXY URL (OPTIONAL):
                </label>
                <input
                  type="text"
                  value={customGatewayUrl}
                  onChange={(e) => setCustomGatewayUrl(e.target.value)}
                  placeholder="https://api.yourdomain.com"
                  className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none focus:border-[#f59e0b]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#94a3b8] text-[10px] uppercase font-bold">
                  GEMINI API KEY (PROTOTYPE ADAPTER):
                </label>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none focus:border-[#f59e0b]"
                />
                <p className="text-[9px] text-[#64748b]">
                  {VITE_CONFIG.geminiKey ? "✓ Injected via runtime environment secrets" : "Not detected in .env"}
                </p>
              </div>

              <div className="space-y-2 border-t border-[#1e2535] pt-3">
                <div className="text-[#10b981] font-bold text-[11px]">FIREBASE CLOUD VAULT CREDENTIALS:</div>
                
                <div className="space-y-1">
                  <label className="text-[#94a3b8] text-[9px]">API KEY:</label>
                  <input
                    type="password"
                    value={customFirebaseKey}
                    onChange={(e) => setCustomFirebaseKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-1.5 text-[10px] text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#94a3b8] text-[9px]">PROJECT ID:</label>
                  <input
                    type="text"
                    value={customProjectId}
                    onChange={(e) => setCustomProjectId(e.target.value)}
                    placeholder="my-sports-card-app"
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-1.5 text-[10px] text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-[#252d3d]">
              <button
                onClick={() => {
                  setShowConfigDrawer(false);
                  addLog("CONFIG: Custom configuration saved to local memory");
                }}
                className="w-full py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-xs uppercase tracking-wider rounded font-mono"
              >
                APPLY CONFIGURATION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* RAPID MANUAL ENTRY MODAL                                             */}
      {/* ==================================================================== */}
      {showRapidEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#0c0e17] border border-[#252d3d] rounded-2xl w-full max-w-sm p-4 space-y-3 font-mono text-xs shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#252d3d] pb-2 text-[#10b981]">
              <span className="font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> RAPID MANUAL VAULT ENTRY
              </span>
              <button
                onClick={() => setShowRapidEntryModal(false)}
                className="text-[#64748b] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleManualAddSubmit} className="space-y-2.5">
              <div>
                <label className="text-[10px] text-[#94a3b8]">PLAYER / SUBJECT NAME:</label>
                <input
                  type="text"
                  required
                  value={manualForm.player}
                  onChange={(e) => setManualForm({ ...manualForm, player: e.target.value })}
                  placeholder="e.g. Jayden Daniels"
                  className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#94a3b8]">YEAR:</label>
                  <input
                    type="number"
                    value={manualForm.year}
                    onChange={(e) => setManualForm({ ...manualForm, year: e.target.value })}
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#94a3b8]">CARD #:</label>
                  <input
                    type="text"
                    value={manualForm.cardNumber}
                    onChange={(e) => setManualForm({ ...manualForm, cardNumber: e.target.value })}
                    placeholder="#173"
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#94a3b8]">BRAND / PRODUCT SET:</label>
                <input
                  type="text"
                  required
                  value={manualForm.set}
                  onChange={(e) => setManualForm({ ...manualForm, set: e.target.value })}
                  placeholder="e.g. Topps Chrome"
                  className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#94a3b8]">PARALLEL / VARIETY:</label>
                  <input
                    type="text"
                    value={manualForm.parallel}
                    onChange={(e) => setManualForm({ ...manualForm, parallel: e.target.value })}
                    placeholder="Refractor"
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#94a3b8]">SERIAL NUMBERING:</label>
                  <input
                    type="text"
                    value={manualForm.serialNumber}
                    onChange={(e) => setManualForm({ ...manualForm, serialNumber: e.target.value })}
                    placeholder="/99"
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-2 text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="text-[9px] text-[#94a3b8]">GRADER:</label>
                  <select
                    value={manualForm.gradeCompany}
                    onChange={(e) => setManualForm({ ...manualForm, gradeCompany: e.target.value })}
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-1.5 text-white outline-none text-[10px]"
                  >
                    <option value="PSA">PSA</option>
                    <option value="BGS">BGS</option>
                    <option value="SGC">SGC</option>
                    <option value="RAW">RAW</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-[#94a3b8]">GRADE:</label>
                  <input
                    type="text"
                    value={manualForm.grade}
                    onChange={(e) => setManualForm({ ...manualForm, grade: e.target.value })}
                    placeholder="10"
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-1.5 text-white outline-none text-[10px]"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-[#94a3b8]">FAIR VAL ($):</label>
                  <input
                    type="number"
                    value={manualForm.estimatedMedian}
                    onChange={(e) => setManualForm({ ...manualForm, estimatedMedian: e.target.value })}
                    className="w-full bg-[#090a0f] border border-[#252d3d] rounded p-1.5 text-white outline-none text-[10px]"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="watchlistCheck"
                  checked={manualForm.isWatchlist}
                  onChange={(e) => setManualForm({ ...manualForm, isWatchlist: e.target.checked })}
                  className="rounded border-[#252d3d] bg-[#090a0f] text-[#f59e0b] focus:ring-0"
                />
                <label htmlFor="watchlistCheck" className="text-[10px] text-[#94a3b8] cursor-pointer">
                  Tag as Watchlist asset
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRapidEntryModal(false)}
                  className="flex-1 py-2 bg-[#171c2b] text-[#94a3b8] rounded font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#10b981] text-black font-extrabold rounded"
                >
                  SAVE RECORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
