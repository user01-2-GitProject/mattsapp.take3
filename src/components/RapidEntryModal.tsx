import React from "react";
import { Plus, X, DollarSign } from "lucide-react";

interface RapidEntryModalProps {
  manualForm: {
    player: string;
    year: number | string;
    set: string;
    cardNumber: string;
    parallel: string;
    serialNumber: string;
    attributes: string;
    gradeCompany: string;
    gradeCondition: string;
    grade: string;
    estimatedLow: number | string;
    estimatedMedian: number | string;
    estimatedHigh: number | string;
    askingPrice?: number | string;
    isWatchlist: boolean;
  };
  setManualForm: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: (e: any) => void;
  onClose: () => void;
}

export const RapidEntryModal: React.FC<RapidEntryModalProps> = ({
  manualForm,
  setManualForm,
  onSubmit,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#0f0f0f] border border-[#262626] rounded-2xl w-full max-w-sm p-4 space-y-3 font-mono text-xs shadow-2xl">
        <div className="flex justify-between items-center border-b border-[#262626] pb-2 text-[#22c55e]">
          <span className="font-bold flex items-center gap-1">
            <Plus className="w-4 h-4 text-[#22c55e]" /> RAPID MANUAL VAULT ENTRY
          </span>
          <button
            onClick={onClose}
            className="text-[#737373] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-2.5">
          <div>
            <label className="text-[10px] text-[#a3a3a3]">PLAYER / SUBJECT NAME:</label>
            <input
              type="text"
              required
              value={manualForm.player}
              onChange={(e) => setManualForm({ ...manualForm, player: e.target.value })}
              placeholder="e.g. Jayden Daniels"
              className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#a3a3a3]">YEAR:</label>
              <input
                type="number"
                value={manualForm.year}
                onChange={(e) => setManualForm({ ...manualForm, year: e.target.value })}
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#a3a3a3]">CARD #:</label>
              <input
                type="text"
                value={manualForm.cardNumber}
                onChange={(e) => setManualForm({ ...manualForm, cardNumber: e.target.value })}
                placeholder="#173"
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#a3a3a3]">BRAND / PRODUCT SET:</label>
            <input
              type="text"
              required
              value={manualForm.set}
              onChange={(e) => setManualForm({ ...manualForm, set: e.target.value })}
              placeholder="e.g. Topps Chrome"
              className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#a3a3a3]">PARALLEL / VARIETY:</label>
              <input
                type="text"
                value={manualForm.parallel}
                onChange={(e) => setManualForm({ ...manualForm, parallel: e.target.value })}
                placeholder="Refractor"
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#a3a3a3]">SERIAL NUMBERING:</label>
              <input
                type="text"
                value={manualForm.serialNumber}
                onChange={(e) => setManualForm({ ...manualForm, serialNumber: e.target.value })}
                placeholder="/99"
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="text-[9px] text-[#a3a3a3]">GRADER:</label>
              <select
                value={manualForm.gradeCompany}
                onChange={(e) => setManualForm({ ...manualForm, gradeCompany: e.target.value })}
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-1.5 text-white outline-none text-[10px]"
              >
                <option value="PSA">PSA</option>
                <option value="BGS">BGS</option>
                <option value="SGC">SGC</option>
                <option value="RAW">RAW</option>
              </select>
            </div>
            <div>
              <label className="text-[9px] text-[#a3a3a3]">GRADE:</label>
              <input
                type="text"
                value={manualForm.grade}
                onChange={(e) => setManualForm({ ...manualForm, grade: e.target.value })}
                placeholder="10"
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-1.5 text-white outline-none text-[10px]"
              />
            </div>
            <div>
              <label className="text-[9px] text-[#a3a3a3]">FAIR VAL ($):</label>
              <input
                type="number"
                value={manualForm.estimatedMedian}
                onChange={(e) => setManualForm({ ...manualForm, estimatedMedian: e.target.value })}
                className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-1.5 text-white outline-none text-[10px]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="watchlistCheck"
              checked={manualForm.isWatchlist}
              onChange={(e) => setManualForm({ ...manualForm, isWatchlist: e.target.checked })}
              className="rounded border-[#262626] bg-[#050505] text-[#f59e0b] focus:ring-0"
            />
            <label htmlFor="watchlistCheck" className="text-[10px] text-[#a3a3a3] cursor-pointer">
              Tag as Watchlist asset
            </label>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-[#171717] hover:bg-[#262626] text-[#a3a3a3] rounded font-bold"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold rounded"
            >
              SAVE RECORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
