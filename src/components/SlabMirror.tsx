import React from "react";
import {
  Hash,
  Scale,
  Database,
  Bookmark,
  Layers,
  Calculator,
  ChevronDown,
  Globe,
  ExternalLink,
  AlertTriangle,
  Search
} from "lucide-react";
import { ActiveSlabData } from "../types";

interface SlabMirrorProps {
  activeSlabData: ActiveSlabData | null;
  slabStyle: string;
  setSlabStyle: (style: string) => void;
  showShapDrawer: boolean;
  setShowShapDrawer: (show: boolean) => void;
  showCompAuditDrawer: boolean;
  setShowCompAuditDrawer: (show: boolean) => void;
  onSaveToVault: (isWatchlistOnly: boolean) => void;
  onSelectTab: (tab: string) => void;
}

export const SlabMirror: React.FC<SlabMirrorProps> = ({
  activeSlabData,
  slabStyle,
  setSlabStyle,
  showShapDrawer,
  setShowShapDrawer,
  showCompAuditDrawer,
  setShowCompAuditDrawer,
  onSaveToVault,
  onSelectTab
}) => {
  if (!activeSlabData) {
    return (
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-8 text-center space-y-3 font-mono shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#171717] text-[#f59e0b] border border-[#262626] flex items-center justify-center mx-auto">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold text-white uppercase tracking-wider">NO ACTIVE SLAB SELECTED</div>
          <p className="text-xs text-[#a3a3a3] mt-1 max-w-xs mx-auto">
            Execute a search recon query in [SEARCH / SCAN] or pick an asset from [MY VAULT] to display the authentic Digital Slab Mirror.
          </p>
        </div>
        <button
          onClick={() => onSelectTab("scan")}
          className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-xs rounded-lg uppercase tracking-wider"
        >
          GO TO SCAN TAB
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* Slab Casing Style Switcher */}
      <div className="flex items-center justify-between px-1 text-[10px] font-mono">
        <span className="text-[#a3a3a3] uppercase font-bold">CASING MATTE:</span>
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
                  : "bg-[#121212] text-[#a3a3a3] border-[#262626] hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* AUTHENTIC GRADED SLAB CASING                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`relative rounded-2xl p-3.5 shadow-2xl transition-all ${
          slabStyle === "psa-red"
            ? "bg-gradient-to-b from-[#1a1a1a] to-[#050505] border-2 border-[#dc2626]/80 shadow-rose-950/30"
            : slabStyle === "bgs-gold"
            ? "bg-gradient-to-b from-[#1c1917] to-[#050505] border-2 border-[#b45309]/80 shadow-amber-950/30"
            : "bg-gradient-to-b from-[#171717] to-[#000000] border-2 border-[#404040]"
        }`}
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full mb-2.5"></div>

        {/* Digital Slab Label Header */}
        <div
          className={`rounded-lg overflow-hidden border-2 shadow-md ${
            slabStyle === "psa-red"
              ? "bg-white text-black border-[#dc2626]"
              : slabStyle === "bgs-gold"
              ? "bg-[#eab308] text-black border-[#713f12]"
              : "bg-black text-white border-[#262626]"
          }`}
        >
          <div className="p-2.5 flex items-stretch justify-between gap-2">
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

            <div
              className={`w-16 shrink-0 flex flex-col items-center justify-center border-l-2 pl-2 text-center ${
                slabStyle === "psa-red"
                  ? "border-[#dc2626]"
                  : slabStyle === "bgs-gold"
                  ? "border-[#713f12]"
                  : "border-[#404040]"
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
            </div>
          </div>
        </div>

        {/* Deterministic Valuation Band Tile */}
        <div className="mt-3 bg-[#050505] border border-[#262626] rounded-xl p-2.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-1.5">
            <div className="text-[10px] font-mono text-[#a3a3a3] flex items-center gap-1">
              <Scale className="w-3 h-3 text-[#f59e0b]" />
              <span>MATTSAPP DETERMINISTIC VALUATION BAND</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/40 rounded font-bold">
              IAS 38 COST FLOOR
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-1.5 bg-[#121212] rounded border border-[#262626]">
              <div className="text-[8px] text-[#737373] tracking-wider uppercase">FLOOR [LOW]</div>
              <div className="text-xs font-bold text-white mt-0.5">
                ${activeSlabData.pricePoints.floor.toLocaleString()}
              </div>
            </div>

            <div className="p-1.5 bg-[#22c55e]/10 rounded border border-[#22c55e]/50">
              <div className="text-[8px] text-[#22c55e] font-extrabold tracking-wider uppercase">
                FAIR VALUE [n={activeSlabData.pricePoints.compsCount}]
              </div>
              <div className="text-sm font-black text-[#22c55e] mt-0.5">
                ${activeSlabData.pricePoints.fairValue.toLocaleString()}
              </div>
            </div>

            <div className="p-1.5 bg-[#121212] rounded border border-[#262626]">
              <div className="text-[8px] text-[#737373] tracking-wider uppercase">CEILING [HIGH]</div>
              <div className="text-xs font-bold text-white mt-0.5">
                ${activeSlabData.pricePoints.ceiling.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            onClick={() => onSaveToVault(false)}
            className="flex-1 py-2 px-3 bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 shadow"
          >
            <Database className="w-3.5 h-3.5" /> COMMIT TO VAULT
          </button>
          <button
            onClick={() => onSaveToVault(true)}
            className="px-3 py-2 bg-[#171717] hover:bg-[#262626] text-[#f59e0b] border border-[#f59e0b]/40 font-bold text-xs font-mono rounded-lg flex items-center gap-1"
          >
            <Bookmark className="w-3.5 h-3.5" /> WATCH
          </button>
        </div>
      </div>

      {/* Attribute Verification Audit */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-3 space-y-2 font-mono text-xs shadow-xl">
        <div className="flex items-center justify-between text-[11px] text-[#a3a3a3] border-b border-[#262626] pb-1.5">
          <span className="font-bold text-white flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#f59e0b]" /> ATTRIBUTE VERIFICATION AUDIT
          </span>
          <span className="text-[9px] text-[#737373]">HEURISTIC FALLBACKS</span>
        </div>

        <div className="space-y-1">
          <div className="text-[9px] text-[#22c55e] font-bold uppercase tracking-wider">
            CONFIRMED ATTRIBUTES:
          </div>
          <div className="flex flex-wrap gap-1">
            {activeSlabData.verifiedAttributes?.map((attr, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30 rounded text-[10px]"
              >
                ✓ {attr}
              </span>
            ))}
          </div>
        </div>

        {activeSlabData.missingAttributes && activeSlabData.missingAttributes.length > 0 && (
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

      {/* SHAP Marginal Attribution Drawer */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden shadow-xl">
        <button
          onClick={() => setShowShapDrawer(!showShapDrawer)}
          className="w-full p-3 flex items-center justify-between text-left font-mono text-xs hover:bg-[#1f1f1f] transition-colors"
        >
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Calculator className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>SHAP VALUE MARGINAL ATTRIBUTION</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#a3a3a3]">
            <span>{showShapDrawer ? "COLLAPSE" : "EXPAND FORMULA"}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showShapDrawer ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showShapDrawer && (
          <div className="p-3 border-t border-[#262626] bg-[#050505] space-y-2.5 font-mono text-[11px]">
            <div className="text-[#a3a3a3] text-[10px] leading-relaxed">
              Shapley Additive exPlanations (SHAP) decompose the exact mathematical contribution of each variable in Formula A (Vs) and Formula C (A-Val):
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center py-1 border-b border-[#1f1f1f]">
                <span className="text-[#a3a3a3]">Historical Base (Ph):</span>
                <span className="font-bold text-white">${activeSlabData.shapValues?.base}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1f1f1f]">
                <span className="text-[#a3a3a3]">Scarcity Rarity Lift [f(Scarcity)]:</span>
                <span className={`font-bold ${(activeSlabData.shapValues?.scarcity || 0) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                  {(activeSlabData.shapValues?.scarcity || 0) >= 0 ? "+" : ""}${activeSlabData.shapValues?.scarcity}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1f1f1f]">
                <span className="text-[#a3a3a3]">Grade / Condition Premium:</span>
                <span className="font-bold text-[#22c55e]">
                  +${activeSlabData.shapValues?.grade}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1f1f1f]">
                <span className="text-[#a3a3a3]">Player Hype Index (+0.15 × Hz):</span>
                <span className={`font-bold ${(activeSlabData.shapValues?.hype || 0) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                  {(activeSlabData.shapValues?.hype || 0) >= 0 ? "+" : ""}${activeSlabData.shapValues?.hype}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1f1f1f]">
                <span className="text-[#a3a3a3]">Market Sentiment (-0.10 × Sz):</span>
                <span className={`font-bold ${(activeSlabData.shapValues?.sentiment || 0) >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                  {(activeSlabData.shapValues?.sentiment || 0) >= 0 ? "+" : ""}${activeSlabData.shapValues?.sentiment}
                </span>
              </div>

              {activeSlabData.shapValues && activeSlabData.shapValues.floorLift > 0 && (
                <div className="flex justify-between items-center py-1 border-b border-[#1f1f1f] text-[#f59e0b]">
                  <span>IAS 38 Cost Floor (D-Val) Adjustment:</span>
                  <span className="font-bold">+${activeSlabData.shapValues.floorLift}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-1 text-xs font-extrabold text-[#22c55e] border-t border-[#262626]">
                <span>REPORTED FAIR VALUE:</span>
                <span>${activeSlabData.shapValues?.total?.toLocaleString()}</span>
              </div>
            </div>

            {activeSlabData.latentCluster && (
              <div className="pt-2 border-t border-[#1f1f1f] text-[10px] text-[#737373]">
                <span className="text-white font-bold">K-Means Partition: </span>
                <span>{activeSlabData.latentCluster.clusterName} </span>
                <span>(Sc={activeSlabData.latentCluster.Sc}, beta={activeSlabData.latentCluster.beta}, Ac={activeSlabData.latentCluster.Ac})</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Market Comp Audit Drawer */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden shadow-xl">
        <button
          onClick={() => setShowCompAuditDrawer(!showCompAuditDrawer)}
          className="w-full p-3 flex items-center justify-between text-left font-mono text-xs hover:bg-[#1f1f1f] transition-colors"
        >
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Globe className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>MARKET COMP AUDIT & SANITIZER</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#a3a3a3]">
            <span>{showCompAuditDrawer ? "COLLAPSE" : `${activeSlabData.qualifiedComps?.length || 0} QUALIFIED COMPS`}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCompAuditDrawer ? "rotate-180" : ""}`} />
          </div>
        </button>

        {showCompAuditDrawer && (
          <div className="p-3 border-t border-[#262626] bg-[#050505] space-y-3 font-mono text-[11px]">
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#22c55e] font-bold uppercase tracking-wider">
                QUALIFIED TRANSACTIONS:
              </div>
              {activeSlabData.qualifiedComps && activeSlabData.qualifiedComps.length > 0 ? (
                <div className="space-y-1">
                  {activeSlabData.qualifiedComps.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 bg-[#121212] rounded border border-[#262626] flex justify-between items-center text-[10px]"
                    >
                      <div>
                        <div className="text-white font-bold">{c.venue || "Market Comp"}</div>
                        <div className="text-[#737373]">
                          {c.date || "Settled"} | {c.gradeCompany || "PSA"} {c.grade || "10"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-[#22c55e]">${c.normalizedPrice}</div>
                        <div className="text-[9px] text-[#737373]">Raw: ${c.rawPrice}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-[#737373] text-[10px]">No direct sales in memory; indexed via player ratio.</div>
              )}
            </div>

            {activeSlabData.trimmedComps && activeSlabData.trimmedComps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-[#ef4444] font-bold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> SANITIZED / TRIMMED OUTLIERS ({activeSlabData.trimmedComps.length}):
                </div>
                <div className="space-y-1">
                  {activeSlabData.trimmedComps.map((c, i) => (
                    <div
                      key={i}
                      className="p-2 bg-[#450a0a]/30 rounded border border-[#ef4444]/40 flex justify-between items-center text-[10px]"
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

            {activeSlabData.sources && activeSlabData.sources.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#1f1f1f]">
                <div className="text-[10px] text-[#f59e0b] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Globe className="w-3 h-3" /> VERIFIED MARKET CITATIONS:
                </div>
                <div className="space-y-1">
                  {activeSlabData.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 bg-[#121212] hover:bg-[#1f1f1f] rounded border border-[#262626] flex items-center justify-between text-[10px] text-[#a3a3a3] hover:text-[#f59e0b] transition-colors"
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
    </div>
  );
};
