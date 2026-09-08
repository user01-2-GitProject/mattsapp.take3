import React from "react";
import { Shield, Sliders } from "lucide-react";
import { User } from "firebase/auth";

interface HeaderProps {
  systemTime: string;
  firebaseConnected: boolean;
  currentUser: User | null;
  onOpenConfig: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  systemTime,
  firebaseConnected,
  currentUser,
  onOpenConfig
}) => {
  return (
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

      <div className="flex items-center space-x-2">
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

        <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 bg-[#121622] border border-[#252d3d] rounded text-[10px] font-mono text-[#94a3b8]">
          <Shield className="w-2.5 h-2.5 text-[#06b6d4]" />
          <span>{currentUser ? `UID:${currentUser.uid.slice(0, 5)}` : "AUTH_INIT"}</span>
        </div>

        <button
          onClick={onOpenConfig}
          className="p-1.5 bg-[#171c2b] hover:bg-[#20273c] text-[#f59e0b] border border-[#252d3d] rounded transition-colors active:scale-95"
          title="System Configuration"
          aria-label="System Configuration"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
