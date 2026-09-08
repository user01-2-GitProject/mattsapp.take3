import React from "react";
import {
  Search,
  Camera,
  X,
  Zap,
  RefreshCw,
  Plus,
  Sparkles,
  ChevronRight,
  Database,
  Bookmark,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign
} from "lucide-react";
import { ActiveSlabData } from "../types";

interface SearchTabProps {
  inputQuery: string;
  setInputQuery: (val: string) => void;
  askingPriceInput: string;
  setAskingPriceInput: (val: string) => void;
  isProcessing: boolean;
  onRunRecon: (query?: string) => void;
  onOpenRapidEntry: () => void;
  showScannerHelper: boolean;
  setShowScannerHelper: (show: boolean) => void;
  activeSlabData: ActiveSlabData | null;
  onSelectTab: (tab: string) => void;
  onSaveToVault: (isWatchlistOnly: boolean) => void;
  systemLogs: string[];
  searchInputRef: React.RefObject<HTMLInputElement | null>;
}

export const SearchTab: React.FC<SearchTabProps> = ({
  inputQuery,
  setInputQuery,
  askingPriceInput,
  setAskingPriceInput,
  isProcessing,
  onRunRecon,
  onOpenRapidEntry,
  showScannerHelper,
  setShowScannerHelper,
  activeSlabData,
  onSelectTab,
  onSaveToVault,
  systemLogs,
  searchInputRef
}) => {
  // Deal signal calculation relative to Asking Price vs Fair Value & Ceiling
  const askingNum = parseFloat(askingPriceInput) || 0;
  const fairValue = activeSlabData?.pricePoints?.fairValue || 0;
  const ceiling = activeSlabData?.pricePoints?.ceiling || 0;
  const floor = activeSlabData?.pricePoints?.floor || 0;

  let dealSignal: "BUY" | "FAIR" | "OVERPRICED" | "NONE" = "NONE";
  let dealPct = 0;

  if (activeSlabData && askingNum > 0) {
    dealPct = Math.round(((fairValue - askingNum) / fairValue) * 100);
    if (askingNum <= fairValue) {
      dealSignal = "BUY";
    } else if (askingNum <= ceiling) {
      dealSignal = "FAIR";
    } else {
      dealSignal = "OVERPRICED";
    }
  }

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      {/* ------------------------------------------------------------------ */}
      {/* CARD RECON SEARCH & ASKING PRICE TILE                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-3.5 space-y-3 shadow-xl">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-[#f59e0b] font-mono font-extrabold tracking-wider uppercase">
            <Search className="w-3.5 h-3.5" /> CARD RECON INTEL
          </div>
          <button
            type="button"
            onClick={() => setShowScannerHelper(!showScannerHelper)}
            className="text-[10px] text-[#a3a3a3] hover:text-white font-mono flex items-center gap-1 underline"
          >
            <Camera className="w-3 h-3 text-[#f59e0b]" /> OCR SIMULATOR
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRunRecon();
          }}
          className="space-y-2.5"
        >
          {/* Natural Language Query Bar */}
          <div className="relative flex items-center">
            <input
              ref={searchInputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="e.g. 2024 topps chrome #173 jayden daniels refractor /99..."
              disabled={isProcessing}
              className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded-lg px-3 py-2.5 text-xs text-white placeholder-[#525252] font-mono outline-none transition-colors"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery("")}
                className="absolute right-3 text-[#737373] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Asking / Dealer Price Tile */}
          <div className="flex items-center gap-2 bg-[#050505] border border-[#262626] rounded-lg px-3 py-1.5">
            <div className="text-[10px] text-[#a3a3a3] font-mono font-bold flex items-center gap-1 shrink-0 uppercase">
              <DollarSign className="w-3 h-3 text-[#f59e0b]" /> ASKING / DEALER PRICE ($):
            </div>
            <input
              type="number"
              value={askingPriceInput}
              onChange={(e) => setAskingPriceInput(e.target.value)}
              placeholder="e.g. 150 (optional for 1-sec verdict)"
              disabled={isProcessing}
              className="w-full bg-transparent text-xs text-white placeholder-[#525252] font-mono outline-none font-bold"
            />
            {askingPriceInput && (
              <button
                type="button"
                onClick={() => setAskingPriceInput("")}
                className="text-[#737373] hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Execute Buttons */}
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
              onClick={onOpenRapidEntry}
              className="px-3 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#22c55e] border border-[#262626] rounded-lg text-xs font-mono font-bold transition-colors"
              title="Rapid Manual Input"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Optical Scanner Helper */}
        {showScannerHelper && (
          <div className="p-3 bg-[#050505] border border-dashed border-[#f59e0b]/50 rounded-lg space-y-2 text-[11px] font-mono">
            <div className="flex items-center justify-between text-[#f59e0b]">
              <span className="font-bold flex items-center gap-1">
                <Camera className="w-3 h-3" /> TACTICAL OCR HELPER
              </span>
              <span className="text-[9px] text-[#737373]">OCR RESOLVER</span>
            </div>
            <p className="text-[#a3a3a3] text-[10px] leading-relaxed">
              Submit fragmented queries or slab OCR text. The mathematical pipeline handles zero-input omissions, derives latent parameters, and executes IAS 38 cost floor rules.
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setInputQuery("2024 topps chrome #173 jayden daniels refractor /99 psa 10");
                  setAskingPriceInput("210");
                  setShowScannerHelper(false);
                }}
                className="p-1.5 bg-[#121212] hover:bg-[#1f1f1f] text-left text-[10px] text-white rounded border border-[#262626] truncate"
              >
                📷 Daniels /99 ($210 ask)
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputQuery("2020 panini optik downtown patrick mahomes psa 10");
                  setAskingPriceInput("2400");
                  setShowScannerHelper(false);
                }}
                className="p-1.5 bg-[#121212] hover:bg-[#1f1f1f] text-left text-[10px] text-white rounded border border-[#262626] truncate"
              >
                📷 Mahomes Downtown ($2.4k ask)
              </button>
            </div>
          </div>
        )}

        {/* Query Archetype Chips */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[10px] text-[#737373] font-mono uppercase tracking-wider font-semibold">
            SAMPLE QUERY ARCHETYPES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { q: "2024 topps chrome #173 jayden daniels refractor /99", ask: "180" },
              { q: "2020 optik downtown mahomes psa 10", ask: "1850" },
              { q: "2023 bowman chrome elly de la cruz 1st auto /499", ask: "1600" },
              { q: "1986 fleer michael jordan #57 psa 8", ask: "7200" }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputQuery(preset.q);
                  setAskingPriceInput(preset.ask);
                  onRunRecon(preset.q);
                }}
                className="px-2 py-1 bg-[#050505] hover:bg-[#1f1f1f] text-[#d4d4d4] hover:text-[#f59e0b] border border-[#262626] rounded text-[10px] font-mono transition-colors"
              >
                "{preset.q}" (${preset.ask})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* ACTIVE VALUATION & DEAL VERDICT CARD                               */}
      {/* ------------------------------------------------------------------ */}
      {activeSlabData && (
        <div className="bg-[#121212] border border-[#262626] rounded-xl p-3.5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-[11px] border-b border-[#262626] pb-2 font-mono">
            <span className="text-[#a3a3a3] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#f59e0b]" /> VALUATION RESULT & DEAL VERDICT
            </span>
            <button
              onClick={() => onSelectTab("intel")}
              className="text-[#f59e0b] font-bold flex items-center gap-0.5 hover:underline text-[10px]"
            >
              VIEW SLAB MIRROR <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* 1-Second Visual Deal Signal Banner */}
          {dealSignal !== "NONE" && (
            <div
              className={`p-3 rounded-lg border flex items-center justify-between font-mono animate-in fade-in ${
                dealSignal === "BUY"
                  ? "bg-[#052e16] border-[#22c55e] text-[#22c55e]"
                  : dealSignal === "FAIR"
                  ? "bg-[#451a03] border-[#f59e0b] text-[#f59e0b]"
                  : "bg-[#450a0a] border-[#ef4444] text-[#ef4444]"
              }`}
            >
              <div className="flex items-center gap-2">
                {dealSignal === "BUY" && <TrendingDown className="w-5 h-5 shrink-0 animate-bounce" />}
                {dealSignal === "FAIR" && <CheckCircle2 className="w-5 h-5 shrink-0" />}
                {dealSignal === "OVERPRICED" && <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />}
                <div>
                  <div className="font-extrabold text-sm tracking-wide uppercase">
                    {dealSignal === "BUY" && "🟢 GREAT DEAL — BUY SIGNAL!"}
                    {dealSignal === "FAIR" && "🟡 FAIR MARKET PRICE — CAUTION"}
                    {dealSignal === "OVERPRICED" && "🔴 OVERPRICED — BAD DEAL!"}
                  </div>
                  <div className="text-[10px] opacity-90">
                    Asking: ${askingNum.toLocaleString()} vs Fair Value: ${fairValue.toLocaleString()}
                    {dealPct !== 0 && ` (${dealPct > 0 ? `${dealPct}% BELOW value` : `${Math.abs(dealPct)}% ABOVE value`})`}
                  </div>
                </div>
              </div>
              <div className="text-right font-black text-lg">
                {dealSignal === "BUY" && "GREAT"}
                {dealSignal === "FAIR" && "FAIR"}
                {dealSignal === "OVERPRICED" && "NO DEAL"}
              </div>
            </div>
          )}

          <div className="flex justify-between items-start">
            <div>
              <div className="font-extrabold text-sm text-white">{activeSlabData.player}</div>
              <div className="text-xs text-[#a3a3a3] font-mono">
                {activeSlabData.year} {activeSlabData.set}
              </div>
              <div className="text-[11px] text-[#f59e0b] font-mono">
                {activeSlabData.parallel} {activeSlabData.serialNumber !== "Unnumbered" ? `(${activeSlabData.serialNumber})` : ""}
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-base font-black text-[#22c55e]">
                ${fairValue.toLocaleString()}
              </div>
              <div className="text-[9px] text-[#737373]">
                CALCULATED FAIR VALUE (n={activeSlabData.pricePoints.compsCount})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px] bg-[#050505] p-2 rounded border border-[#262626]">
            <div>
              <span className="text-[#737373] text-[8px] uppercase block">FLOOR (LOW)</span>
              <span className="text-white font-bold">${floor.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#22c55e] text-[8px] uppercase font-bold block">FAIR VALUE</span>
              <span className="text-[#22c55e] font-extrabold">${fairValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#737373] text-[8px] uppercase block">CEILING (HIGH)</span>
              <span className="text-white font-bold">${ceiling.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => onSaveToVault(false)}
              className="flex-1 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 shadow"
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
      )}

      {/* Terminal Logs */}
      <div className="bg-[#050505] border border-[#262626] rounded-xl p-3 space-y-1 font-mono text-[10px]">
        <div className="flex justify-between text-[#737373] border-b border-[#1f1f1f] pb-1 uppercase tracking-wider text-[9px]">
          <span>MATTSAPP VALUATION TERMINAL LOGS</span>
          <span>{systemLogs.length} EVENTS</span>
        </div>
        <div className="h-28 overflow-y-auto space-y-1 pt-1 pr-1">
          {systemLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.includes("ERR")
                  ? "text-[#ef4444]"
                  : log.includes("COMMIT") || log.includes("RESOLVED")
                  ? "text-[#22c55e]"
                  : log.includes("SEC-")
                  ? "text-[#f59e0b]"
                  : "text-[#737373]"
              } truncate`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
