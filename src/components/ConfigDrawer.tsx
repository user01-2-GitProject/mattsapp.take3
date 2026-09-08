import React from "react";
import { Sliders, X, Shield } from "lucide-react";
import firebaseConfig from "../../firebase-applet-config.json";

interface ConfigDrawerProps {
  customGatewayUrl: string;
  setCustomGatewayUrl: (url: string) => void;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  customFirebaseKey: string;
  setCustomFirebaseKey: (key: string) => void;
  customProjectId: string;
  setCustomProjectId: (id: string) => void;
  firebaseConnected: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  customGatewayUrl,
  setCustomGatewayUrl,
  customApiKey,
  setCustomApiKey,
  customFirebaseKey,
  setCustomFirebaseKey,
  customProjectId,
  setCustomProjectId,
  firebaseConnected,
  onClose,
  onApply
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-sm bg-[#050505] border-l border-[#262626] h-full p-4 overflow-y-auto space-y-4 font-mono text-xs flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-2 text-[#f59e0b]">
            <span className="font-extrabold flex items-center gap-1.5 text-sm">
              <Sliders className="w-4 h-4" /> SYSTEM CONFIGURATION
            </span>
            <button
              onClick={onClose}
              className="p-1 text-[#737373] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-2.5 bg-[#121212] rounded-lg border border-[#262626] space-y-1 text-[10px]">
            <div className="text-[#f59e0b] font-bold flex items-center gap-1">
              <Shield className="w-3 h-3" /> ZERO-TRUST MEDIATION
            </div>
            <p className="text-[#a3a3a3] leading-relaxed">
              In production, queries route through a secured backend proxy. For prototyping, the developer adapter communicates directly with Gemini 3.8 Flash + Google Search Grounding.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[#a3a3a3] text-[10px] uppercase font-bold">
              API GATEWAY PROXY URL (OPTIONAL):
            </label>
            <input
              type="text"
              value={customGatewayUrl}
              onChange={(e) => setCustomGatewayUrl(e.target.value)}
              placeholder="https://api.yourdomain.com"
              className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[#a3a3a3] text-[10px] uppercase font-bold">
              GEMINI API KEY (PROTOTYPE ADAPTER):
            </label>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#050505] border border-[#262626] focus:border-[#f59e0b] rounded p-2 text-white outline-none"
            />
            <p className="text-[9px] text-[#22c55e]">
              {customApiKey ? "✓ Gemini Live Search Recon Armed" : "⚡ Autonomous Econometric Engine Active (No key required)"}
            </p>
          </div>

          <div className="space-y-2 border-t border-[#1f1f1f] pt-3">
            <div className="flex items-center justify-between">
              <div className="text-[#22c55e] font-bold text-[11px]">FIREBASE CLOUD VAULT:</div>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${firebaseConnected ? "bg-[#22c55e]/20 text-[#22c55e]" : "bg-[#f59e0b]/20 text-[#f59e0b]"}`}>
                {firebaseConnected ? "ONLINE / SECURED" : "INITIALIZING..."}
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[#a3a3a3] text-[9px]">API KEY:</label>
              <input
                type="password"
                value={customFirebaseKey}
                onChange={(e) => setCustomFirebaseKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#050505] border border-[#262626] rounded p-1.5 text-[10px] text-white outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a3a3a3] text-[9px]">PROJECT ID:</label>
              <input
                type="text"
                value={customProjectId}
                onChange={(e) => setCustomProjectId(e.target.value)}
                placeholder="gen-lang-client-0199815442"
                className="w-full bg-[#050505] border border-[#262626] rounded p-1.5 text-[10px] text-white outline-none"
              />
              <p className="text-[9px] text-[#737373]">
                Cloud Database: {(firebaseConfig as any).firestoreDatabaseId || "(default)"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-[#262626]">
          <button
            onClick={onApply}
            className="w-full py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-extrabold text-xs uppercase tracking-wider rounded font-mono"
          >
            APPLY CONFIGURATION
          </button>
        </div>
      </div>
    </div>
  );
};
