import { useState } from "react";

const LAYERS = [
  {
    id: "root",
    name: "/ (root)",
    color: "#FF963B",
    desc: "進入點 + SOT — Claude 讀取的第一層，不動",
    files: [
      { name: "CLAUDE.md", note: "Claude Code 進入點", locked: true },
      { name: "SKILL.md", note: "Skill 觸發 + 架構速查", locked: true },
      { name: "COWORK_INSTRUCTIONS.md", note: "Cowork 進入點", locked: true },
      { name: "design-system-all.json", note: "唯一 SOT (271KB)", locked: true },
    ],
  },
  {
    id: "ref",
    name: "ref/",
    color: "#8B5CF6",
    desc: "架構參考 & 治理 — 定義 what & why 的規則層",
    files: [
      { name: "component-governance.md", note: "三維分類 + Registry + 鎖定決策", from: "component-governance.md" },
      { name: "token-migration-map.md", note: "舊→新 token 遷移對照", from: "token-migration-map.md" },
      { name: "icon-inventory.json", note: "476 icons 清單", from: "icon-inventory.json" },
    ],
  },
  {
    id: "guideline",
    name: "guideline/",
    color: "#3B82F6",
    desc: "使用規範 — 每個 component 的 do/don't 文件",
    files: [
      { name: "button.md", from: "button-usage-guideline.md" },
      { name: "tab.md", from: "tab-usage-guideline.md" },
      { name: "avatar.md", from: "avatar-usage-guideline.md" },
      { name: "thumbnail.md", from: "thumbnail-usage-guideline.md" },
      { name: "tag-badge.md", from: "tag-badge-usage-guideline.md" },
      { name: "divider.md", from: "divider-usage-guideline.md" },
      { name: "section-header.md", from: "section-header-usage-guideline.md" },
      { name: "section-module.md", from: "section-module-usage-guideline.md" },
      { name: "banner.md", from: "banner-usage-guideline.md" },
      { name: "navigation-bar.md", from: "navigation-bar-usage-guideline.md" },
      { name: "search-bar.md", from: "search-bar-usage-guideline.md" },
      { name: "bottom-nav.md", from: "bottom-nav-usage-guideline.md" },
    ],
  },
  {
    id: "script",
    name: "script/",
    color: "#10B981",
    desc: "Figma Scripter 腳本 — Kay 在 Figma 內執行",
    files: [
      { name: "create-text-styles.js", note: "130 Text Styles", from: "create-text-styles.js" },
      { name: "sprint3-variables.js", note: "Sprint 3 Variable 建立", from: "scripter-04-sprint3-variables.js" },
      { name: "navigation-bar.js", from: "scripter-05-navigation-bar.js" },
      { name: "navbar-binding.js", from: "scripter-06-navbar-binding.js" },
      { name: "search-bar.js", from: "scripter-07-search-bar.js" },
      { name: "bottom-nav.js", from: "scripter-08-bottom-nav.js" },
    ],
  },
  {
    id: "tool",
    name: "tool/",
    color: "#F59E0B",
    desc: "驗證 & 同步工具 — Python CLI 腳本",
    files: [
      { name: "validate-design-system.py", note: "每次改 JSON 必跑", from: "validate-design-system.py" },
      { name: "sync-derived-files.py", note: "token 數字同步", from: "sync-derived-files.py" },
      { name: "sync-daily-log.py", note: "日報生命週期管理", from: "sync-daily-log.py" },
    ],
  },
  {
    id: "viewer",
    name: "viewer/",
    color: "#EC4899",
    desc: "視覺化預覽 — 瀏覽器開啟",
    files: [
      { name: "token-viewer.html", note: "即時 token 瀏覽器", from: "ruten-design-system.html" },
      { name: "hierarchy.html", note: "token 階層結構圖", from: "design-system-hierarchy.html" },
      { name: "architecture.jsx", note: "檔案關係圖（React）", from: "ruten-ds-architecture.jsx" },
    ],
  },
  {
    id: "ops",
    name: "ops/",
    color: "#6B7280",
    desc: "營運 & 進度 — 計畫 / 日報 / 待辦 / sync 目標檔",
    files: [
      { name: "EXECUTION_PLAN.md", note: "19 元件 + Sprint 路線圖", from: "EXECUTION_PLAN.md" },
      { name: "DAILY_LOG.md", note: "每日站會記錄", from: "DAILY_LOG.md" },
      { name: "RUTEN_TODO.md", note: "待辦追蹤", from: "RUTEN_TODO.md" },
      { name: "design-system-governance.md", note: "sync 目標（數字同步用）", from: "design-system-governance.md" },
      { name: "design-system-progress.md", note: "sync 目標（數字同步用）", from: "design-system-progress.md" },
    ],
  },
];

const WARNINGS = [
  {
    icon: "⚠️",
    title: "Python 腳本路徑依賴",
    detail:
      "validate / sync-derived / sync-daily-log 三個腳本內部用 --root 找檔案（component-governance.md、SKILL.md 等）。搬進 tool/ 後，腳本內的相對路徑和 --root 參數邏輯都需要更新。",
  },
  {
    icon: "⚠️",
    title: "sync-derived-files.py 寫入目標",
    detail:
      "這個腳本會寫入 SKILL.md、component-governance.md、EXECUTION_PLAN.md 等。搬資料夾後它的寫入路徑也要跟著改。",
  },
  {
    icon: "📌",
    title: "Root 進入點不動",
    detail:
      "CLAUDE.md、SKILL.md、COWORK_INSTRUCTIONS.md 是 Claude 的讀取進入點，必須留在根目錄。design-system-all.json 是 SOT，也留根目錄。",
  },
];

const FileRow = ({ file, layerColor }) => (
  <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors group">
    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: layerColor }} />
    <span className="font-mono text-sm text-gray-800 font-medium">{file.name}</span>
    {file.locked && (
      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
        不動
      </span>
    )}
    {file.from && !file.locked && (
      <span className="text-xs text-gray-400 hidden group-hover:inline">
        ← {file.from}
      </span>
    )}
    {file.note && (
      <span className="text-xs text-gray-500 ml-auto">{file.note}</span>
    )}
  </div>
);

export default function SkillRestructureProposal() {
  const [expanded, setExpanded] = useState(new Set(["root", "ref", "guideline", "script", "tool", "viewer", "ops"]));
  const [showWarnings, setShowWarnings] = useState(true);

  const toggle = (id) => {
    const next = new Set(expanded);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpanded(next);
  };

  const totalFiles = LAYERS.reduce((sum, l) => sum + l.files.length, 0);
  const movedFiles = LAYERS.reduce(
    (sum, l) => sum + l.files.filter((f) => f.from).length,
    0
  );

  return (
    <div className="max-w-2xl mx-auto p-6 font-sans">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          Skill 結構化提案
        </h1>
        <p className="text-sm text-gray-500">
          {totalFiles} 個檔案 · {movedFiles} 個需搬移 · 7 個分層
        </p>
      </div>

      {/* Tree */}
      <div className="space-y-1 mb-6">
        {LAYERS.map((layer) => {
          const isOpen = expanded.has(layer.id);
          return (
            <div key={layer.id} className="rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggle(layer.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: layer.color }}
                />
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-sm font-bold text-gray-900">
                    {layer.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{layer.desc}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {layer.files.length} files
                </span>
                <span className="text-gray-400 text-xs">{isOpen ? "▼" : "▶"}</span>
              </button>
              {isOpen && (
                <div className="px-2 pb-2 border-t border-gray-100 bg-white">
                  {layer.files.map((f) => (
                    <FileRow key={f.name} file={f} layerColor={layer.color} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Warnings */}
      <button
        onClick={() => setShowWarnings(!showWarnings)}
        className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-1 hover:text-gray-900"
      >
        {showWarnings ? "▼" : "▶"} 搬移注意事項
      </button>
      {showWarnings && (
        <div className="space-y-2">
          {WARNINGS.map((w, i) => (
            <div key={i} className="flex gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="flex-shrink-0">{w.icon}</span>
              <div>
                <div className="text-sm font-medium text-amber-900">{w.title}</div>
                <div className="text-xs text-amber-700 mt-0.5">{w.detail}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Layer logic summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-2">分層邏輯</h3>
        <div className="text-xs text-gray-600 space-y-1.5">
          <p><strong className="text-purple-600">ref/</strong> = 定義「是什麼、為什麼」的規則文件（治理、遷移、盤點）</p>
          <p><strong className="text-blue-600">guideline/</strong> = 定義「怎麼用」的使用規範（每個 component 一份）</p>
          <p><strong className="text-green-600">script/</strong> = Figma 內執行的 JS 腳本（Scripter plugin）</p>
          <p><strong className="text-amber-600">tool/</strong> = CLI 執行的 Python 工具（validate / sync）</p>
          <p><strong className="text-pink-600">viewer/</strong> = 瀏覽器開啟的視覺化檔案（HTML / JSX）</p>
          <p><strong className="text-gray-600">ops/</strong> = 營運追蹤（計畫、日報、進度、待辦）</p>
        </div>
      </div>
    </div>
  );
}
