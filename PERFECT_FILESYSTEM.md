# 🐙 The Co-Navigation File System Standard (Human & Agent Alignment)

Designed by **Jules**, this specification outlines the "perfect" file system architecture optimized for seamless co-navigation between **human software engineers** and **AI code agents**.

---

## 1. Core Principles

### 1. Shallow Nesting Depth (Max 3-4 Levels)
- **Problem**: Deep folder hierarchies (`src/modules/billing/components/forms/inputs/fields/...`) increase token overhead for agents when running `list_files` or resolution searches, and cause cognitive overload for humans.
- **Solution**: Maintain flat, shallow directory structures with intuitive top-level domains (`components/`, `services/`, `engine/`, `types/`).

### 2. Intelligent Grouping & Single Responsibility
- Group by **domain function**, not arbitrary technical abstractions.
- Each directory should have a deterministic purpose, making search queries predictable for agents (`grep` / `find_files`) and visual scanning easy for humans.

### 3. Fully Operational & Production-Ready Code
- No placeholder code, mock stubs, or fake implementations. All components, engines, and gateways must be fully operational and production-grade.
- Root repository contains `.agent/` or `AGENTS.md` to guide AI agents on execution commands, architectural standards, and constraints.

---

## 2. ASCII Visual Hierarchy

```
root/
├── .agent/                      <-- AI Agent Context & Execution Schema
│   ├── WORKFLOWS.json           <-- Machine-readable task recipes & scripts
│   └── CONSTRAINTS.md           <-- Safety, linting & architectural rules
│
├── src/                         <-- Application Source (Shallow Depth)
│   ├── components/              <-- UI Presentational & Interactive Components
│   │   ├── Header.tsx           <-- Telemetry ribbon & top bar
│   │   ├── SlabMirror.tsx       <-- Graded slab visualizer
│   │   ├── SearchTab.tsx        <-- Query input & OCR simulator
│   │   ├── VaultTab.tsx         <-- Inventory catalog & filtering
│   │   ├── ShapDrawer.tsx       <-- SHAP valuation decomposition
│   │   ├── CompAuditDrawer.tsx  <-- Market transaction sanitizer
│   │   ├── ConfigDrawer.tsx     <-- System keys & gateway settings
│   │   └── RapidEntryModal.tsx  <-- Manual asset entry modal
│   │
│   ├── engine/                  <-- Pure Business Logic & Valuation Math
│   │   └── valuationEngine.ts   <-- Master Valuation, IAS 38 Floor, SHAP & IQR Filter
│   │
│   ├── services/                <-- External Systems & API Gateways
│   │   ├── firebase.ts          <-- Cloud Firestore sync & Auth
│   │   └── geminiGateway.ts     <-- AI Recon & Search Grounding
│   │
│   ├── data/                    <-- Real Benchmark Catalogs & Market Index Data
│   │   └── benchmarkData.ts     <-- Catalog benchmarks & market seasonality indexes
│   │
│   ├── types/                   <-- TypeScript Interfaces & Schemas
│   │   └── index.ts             <-- Data contracts shared across app
│   │
│   ├── App.tsx                  <-- Main React State Orchestrator
│   ├── index.css                <-- Tailwind & global styling
│   └── main.tsx                 <-- React Root Mount
│
├── AGENTS.md                    <-- Agent Operational Guidelines
├── PERFECT_FILESYSTEM.md        <-- Architectural Standard Document (This File)
├── package.json                 <-- Dependency Manifest
└── tsconfig.json                <-- TypeScript Compiler Rules
```

---

## 3. Human vs Agent Co-Navigation Matrix

| Feature | Human Developer Need | AI Agent Need | Perfect Co-System Standard |
| :--- | :--- | :--- | :--- |
| **Directory Depth** | Low visual friction; quick clicks | Low token consumption in `ls`/`find` | Shallow tree (depth ≤ 3) |
| **File Naming** | Clear, predictable, camel/PascalCase | Exact match, zero ambiguity | PascalCase for React components, camelCase for logic |
| **Type Definitions** | Autocomplete, IDE intellisense | Strict schema validation, interface inference | Centralized `src/types/index.ts` |
| **Configuration** | `.env` files, visual config drawer | Explicit environment fallback defaults | `VITE_` prefixed runtime config + fallback object |
| **Documentation** | Readable README markdown | Structured context, `AGENTS.md` instructions | Dual-purpose Markdown with code blocks & schema |

---

## 4. Architectural Rules for Engineers and AI Agents

1. **Pure Engine Isolation**: Business logic (`src/engine/`) must remain free of React hooks, UI code, or side effects. This allows both humans and AI agents to write unit tests cleanly without mocking DOM components.
2. **Zero Placeholder Policy**: Every function and module must be fully implemented and functional.
3. **Deterministic Imports**: Use clean relative imports (`../services/firebase`) or path aliases (`@/engine/valuationEngine`).
4. **No Artifact Editing**: Never edit generated build directories (`dist/`, `build/`). Always edit source in `src/`.
5. **Self-Documenting Code**: Keep function parameters typed with TypeScript interfaces to eliminate guessing during maintenance.
