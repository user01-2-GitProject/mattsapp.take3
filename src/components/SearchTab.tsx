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
  Bookmark
} from "lucide-react";
import { ActiveSlabData } from "../types";

interface SearchTabProps {
  inputQuery: string;
  setInputQuery: (val: string) => void;
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
  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
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

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onRunRecon();
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
              onClick={onOpenRapidEntry}
              className="px-3 py-2.5 bg-[#171c2b] hover:bg-[#20273c] text-[#10b981] border border-[#252d3d] rounded-lg text-xs font-mono font-bold transition-colors"
              title="Rapid Manual Input"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

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
                  onRunRecon(preset);
                }}
                className="px-2 py-1 bg-[#090a0f] hover:bg-[#181d2c] text-[#cbd5e1] hover:text-[#f59e0b] border border-[#252d3d] rounded text-[10px] font-mono transition-colors"
              >
                "{preset}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeSlabData && (
        <div className="bg-[#121622] border border-[#06b6d4]/50 rounded-xl p-3.5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between text-[11px] border-b border-[#252d3d] pb-2 font-mono">
            <span className="text-[#06b6d4] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> ACTIVE VALUATION ARTIFACT
            </span>
            <button
              onClick={() => onSelectTab("intel")}
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
              onClick={() => onSaveToVault(false)}
              className="flex-1 py-2 bg-[#10b981] hover:bg-[#059669] text-black font-bold text-xs font-mono rounded-lg flex items-center justify-center gap-1.5 shadow"
            >
              <Database className="w-3 h-3" /> COMMIT TO VAULT
            </button>
            <button
              onClick={() => onSaveToVault(true)}
              className="px-3 py-2 bg-[#171c2b] hover:bg-[#20273c] text-[#f59e0b] border border-[#f59e0b]/40 font-bold text-xs font-mono rounded-lg flex items-center gap-1"
            >
              <Bookmark className="w-3 h-3" /> WATCH
            </button>
          </div>
        </div>
      )}

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
  );
};
