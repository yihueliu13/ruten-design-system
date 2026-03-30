import { useState } from "react";

// ── Color Palette ──
const C = {
  bg: "#0F172A",
  bgCard: "#1E293B",
  bgCardHover: "#273548",
  border: "#334155",
  borderAccent: "#FF963B",
  text: "#F1F5F9",
  textDim: "#94A3B8",
  textMuted: "#64748B",
  orange: "#FF963B",
  orangeDim: "#FF963B88",
  blue: "#3B82F6",
  green: "#10B981",
  greenDim: "#10B98144",
  red: "#EF4444",
  purple: "#A78BFA",
  cyan: "#22D3EE",
  yellow: "#FBBF24",
  yellowDim: "#FBBF2444",
  pink: "#F472B6",
};

// ── Data ──
const FILES = [
  // SOT
  { id: "sot", label: "design-system-all.json", desc: "唯一 SOT — 642 tokens", group: "core", x: 400, y: 60, color: C.orange, icon: "🏛️" },
  // Scripts
  { id: "validate", label: "validate-design-system.py", desc: "39 項驗證檢查", group: "script", x: 120, y: 220, color: C.green, icon: "✅" },
  { id: "sync", label: "sync-derived-files.py", desc: "自動同步衍生檔數字", group: "script", x: 400, y: 220, color: C.green, icon: "🔄" },
  { id: "synclog", label: "sync-daily-log.py", desc: "DAILY_LOG 生命週期管理", group: "script", x: 680, y: 220, color: C.green, icon: "📋" },
  // Entry Points
  { id: "skill", label: "SKILL.md", desc: "Skill 觸發 + 架構速查 + 生命週期", group: "entry", x: 80, y: 400, color: C.blue, icon: "⚡" },
  { id: "cowork", label: "COWORK_INSTRUCTIONS.md", desc: "Cowork 進入點 + 品質閘門", group: "entry", x: 310, y: 400, color: C.blue, icon: "🤖" },
  { id: "claude", label: "CLAUDE.md", desc: "Claude Code 進入點 + 每日流程", group: "entry", x: 540, y: 400, color: C.blue, icon: "💻" },
  { id: "daily", label: "DAILY_LOG.md", desc: "每日站會記錄 + 明日工作順序", group: "entry", x: 770, y: 400, color: C.blue, icon: "📅" },
  // Governance & Planning
  { id: "governance", label: "component-governance.md", desc: "三維分類 + Registry + 鎖定決策", group: "gov", x: 80, y: 560, color: C.purple, icon: "📐" },
  { id: "execution", label: "EXECUTION_PLAN.md", desc: "19 元件 Sprint 順序 + Phase 路線圖", group: "gov", x: 350, y: 560, color: C.purple, icon: "🗺️" },
  { id: "progress", label: "design-system-progress.md", desc: "進度摘要（數字同步用）", group: "gov", x: 620, y: 560, color: C.purple, icon: "📊" },
  { id: "govsum", label: "design-system-governance.md", desc: "治理摘要（數字同步用）", group: "gov", x: 870, y: 560, color: C.purple, icon: "📄" },
  // Guidelines
  { id: "guide-btn", label: "button-usage-guideline.md", desc: "Button 4 role × 5 size", group: "guide", x: 80, y: 720, color: C.cyan, icon: "📘" },
  { id: "guide-tab", label: "tab-usage-guideline.md", desc: "Tab 4 size × emphasis", group: "guide", x: 260, y: 720, color: C.cyan, icon: "📘" },
  { id: "guide-tag", label: "tag-badge-usage-guideline.md", desc: "Tag/Badge 使用規則", group: "guide", x: 440, y: 720, color: C.cyan, icon: "📘" },
  { id: "guide-avatar", label: "avatar-usage-guideline.md", desc: "Avatar 人/商家", group: "guide", x: 620, y: 720, color: C.cyan, icon: "📘" },
  { id: "guide-thumb", label: "thumbnail-usage-guideline.md", desc: "Thumbnail IP/主題/分類", group: "guide", x: 800, y: 720, color: C.cyan, icon: "📘" },
  { id: "guide-more", label: "+6 more guidelines", desc: "section-header, nav-bar, search-bar, bottom-nav, banner, divider", group: "guide", x: 440, y: 790, color: C.cyan, icon: "📘" },
  // Figma Tools
  { id: "scripter-tab", label: "scripter-01-tab.js", desc: "Tab 24 variants", group: "figma", x: 80, y: 930, color: C.yellow, icon: "🎨" },
  { id: "scripter-btn", label: "scripter-02-button.js", desc: "Button 48 variants", group: "figma", x: 280, y: 930, color: C.yellow, icon: "🎨" },
  { id: "scripter-avatar", label: "scripter-03-avatar.js", desc: "Avatar 12 variants", group: "figma", x: 480, y: 930, color: C.yellow, icon: "🎨" },
  { id: "textstyles", label: "create-text-styles.js", desc: "130 Text Styles (CH+EN)", group: "figma", x: 680, y: 930, color: C.yellow, icon: "🔤" },
  // Outputs
  { id: "viewer-live", label: "design-system-viewer-live.html", desc: "即時 viewer (fetch JSON)", group: "output", x: 150, y: 1090, color: C.pink, icon: "🌐" },
  { id: "viewer-snapshot", label: "design-system-viewer-snapshot.html", desc: "快照 viewer (內嵌 JSON)", group: "output", x: 440, y: 1090, color: C.pink, icon: "🌐" },
  { id: "ui-preview", label: "ui-library-preview.html", desc: "Component UI 預覽", group: "output", x: 730, y: 1090, color: C.pink, icon: "🖼️" },
  // Migration
  { id: "migration", label: "token-migration-map.md", desc: "舊→新 token 遷移對照", group: "other", x: 870, y: 930, color: C.textMuted, icon: "🔀" },
  { id: "todo", label: "RUTEN_TODO.md", desc: "Phase 1-4 待辦追蹤", group: "other", x: 870, y: 400, color: C.textMuted, icon: "☑️" },
];

const CONNECTIONS = [
  // SOT → scripts read it
  { from: "sot", to: "validate", label: "驗證 alias 完整性", type: "data", color: C.green },
  { from: "sot", to: "sync", label: "讀 token 數字", type: "data", color: C.green },
  // sync → derived files
  { from: "sync", to: "skill", label: "更新數字", type: "sync", color: C.orangeDim },
  { from: "sync", to: "claude", label: "更新數字", type: "sync", color: C.orangeDim },
  { from: "sync", to: "governance", label: "更新數字", type: "sync", color: C.orangeDim },
  { from: "sync", to: "execution", label: "更新數字", type: "sync", color: C.orangeDim },
  { from: "sync", to: "progress", label: "更新數字", type: "sync", color: C.orangeDim },
  { from: "sync", to: "govsum", label: "更新數字", type: "sync", color: C.orangeDim },
  // synclog → daily
  { from: "synclog", to: "daily", label: "git 歷史同步", type: "sync", color: C.orangeDim },
  // SOT → viewers
  { from: "sot", to: "viewer-live", label: "fetch JSON", type: "data", color: C.pink },
  { from: "sot", to: "viewer-snapshot", label: "內嵌 JSON", type: "data", color: C.pink },
  // SOT → Figma scripters (read token values)
  { from: "sot", to: "scripter-tab", label: "讀 token", type: "data", color: C.yellowDim },
  { from: "sot", to: "scripter-btn", label: "讀 token", type: "data", color: C.yellowDim },
  { from: "sot", to: "scripter-avatar", label: "讀 token", type: "data", color: C.yellowDim },
  { from: "sot", to: "textstyles", label: "讀 typography token", type: "data", color: C.yellowDim },
  // Guidelines reference SOT indirectly (via governance/spec)
  { from: "governance", to: "guide-btn", label: "分類規則", type: "ref", color: C.purple },
  { from: "governance", to: "guide-tab", label: "分類規則", type: "ref", color: C.purple },
  { from: "governance", to: "guide-tag", label: "分類規則", type: "ref", color: C.purple },
];

// ── Workflow Steps ──
const WORKFLOW = [
  { step: 1, label: "READ", desc: "讀 COWORK / CLAUDE.md 建立 context", actor: "Claude", color: C.blue },
  { step: 2, label: "LOCATE", desc: "確認 design-system-all.json 存在", actor: "Claude", color: C.blue },
  { step: 3, label: "PLAN", desc: "說出要做什麼、改哪些檔案", actor: "Claude", color: C.blue },
  { step: 4, label: "DO", desc: "修改 design-system-all.json", actor: "Claude", color: C.orange },
  { step: 5, label: "CHECK", desc: "python3 validate-design-system.py", actor: "Claude", color: C.green },
  { step: 6, label: "SYNC", desc: "python3 sync-derived-files.py", actor: "Claude", color: C.green },
  { step: 7, label: "REPORT", desc: "列出改了/沒改的檔案 + validation 結果", actor: "Claude", color: C.purple },
  { step: 8, label: "COMMIT", desc: "git commit（Claude Code）", actor: "Claude Code", color: C.cyan },
  { step: 9, label: "PUSH", desc: "git push（Kay 本機操作）", actor: "Kay", color: C.yellow },
  { step: 10, label: "PK-SYNC", desc: "Kay 手動更新 Project Knowledge", actor: "Kay", color: C.yellow },
];

const GROUPS = {
  core: { label: "🏛️ Source of Truth", color: C.orange },
  script: { label: "⚙️ Automation Scripts", color: C.green },
  entry: { label: "📖 Agent Entry Points", color: C.blue },
  gov: { label: "📐 Governance & Planning", color: C.purple },
  guide: { label: "📘 Usage Guidelines", color: C.cyan },
  figma: { label: "🎨 Figma Scripter", color: C.yellow },
  output: { label: "🌐 Viewers & Previews", color: C.pink },
  other: { label: "🔧 Other", color: C.textMuted },
};

const ACTORS = [
  { id: "chat", label: "Chat (Opus)", desc: "設計決策、Figma MCP、治理", color: C.orange, icon: "🧠" },
  { id: "cowork", label: "Cowork (Sonnet)", desc: "JSON 寫入、validate、sync、guideline", color: C.blue, icon: "🤖" },
  { id: "claudecode", label: "Claude Code", desc: "Vue/RN 工程輸出、git commit", color: C.cyan, icon: "💻" },
  { id: "kay", label: "Kay", desc: "Figma 操作、push、最終決策", color: C.yellow, icon: "👤" },
];

// ── Helpers ──
const getFile = (id) => FILES.find((f) => f.id === id);
const CARD_W = 180;
const CARD_H = 52;

function Arrow({ from, to, color, label, dashed }) {
  const f = getFile(from);
  const t = getFile(to);
  if (!f || !t) return null;

  const fx = f.x + CARD_W / 2;
  const fy = f.y + CARD_H;
  const tx = t.x + CARD_W / 2;
  const ty = t.y;

  const midY = (fy + ty) / 2;
  const d = `M${fx},${fy} C${fx},${midY} ${tx},${midY} ${tx},${ty}`;

  return (
    <g style={{ opacity: 0.6 }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "6,4" : "none"}
        markerEnd="url(#arrowhead)"
      />
      {label && (
        <text
          x={(fx + tx) / 2}
          y={midY - 4}
          fill={C.textDim}
          fontSize={9}
          textAnchor="middle"
          fontFamily="system-ui"
        >
          {label}
        </text>
      )}
    </g>
  );
}

// ── Main Component ──
export default function RutenArchitecture() {
  const [activeGroup, setActiveGroup] = useState(null);
  const [hoveredFile, setHoveredFile] = useState(null);
  const [view, setView] = useState("architecture"); // architecture | workflow | actors

  const connectedIds = hoveredFile
    ? new Set(
        CONNECTIONS.filter((c) => c.from === hoveredFile || c.to === hoveredFile).flatMap((c) => [c.from, c.to])
      )
    : null;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px 0", maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: C.orange }}>
          Ruten Design System — 架構全景圖
        </h1>
        <p style={{ color: C.textDim, fontSize: 14, margin: "6px 0 20px" }}>
          32 個檔案的職責、資料流向、與工作迴圈
        </p>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
          {[
            { key: "architecture", label: "📂 檔案架構 & 資料流" },
            { key: "workflow", label: "🔄 工作迴圈" },
            { key: "actors", label: "👥 角色分工" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              style={{
                padding: "8px 16px",
                background: view === key ? C.orange : C.bgCard,
                color: view === key ? C.bg : C.textDim,
                border: "none",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: view === key ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════ VIEW: Architecture ═══════════════════ */}
      {view === "architecture" && (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px 40px" }}>
          {/* Group legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {Object.entries(GROUPS).map(([key, g]) => (
              <button
                key={key}
                onClick={() => setActiveGroup(activeGroup === key ? null : key)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  border: `1px solid ${activeGroup === key ? g.color : C.border}`,
                  background: activeGroup === key ? g.color + "22" : "transparent",
                  color: activeGroup === key ? g.color : C.textDim,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* SVG Diagram */}
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "auto", padding: 16 }}>
            <svg width={1040} height={1160} style={{ display: "block" }}>
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={C.textDim} />
                </marker>
              </defs>

              {/* Group Backgrounds */}
              {[
                { group: "core", x: 340, y: 40, w: 240, h: 80 },
                { group: "script", x: 60, y: 195, w: 700, h: 70 },
                { group: "entry", x: 20, y: 370, w: 940, h: 80 },
                { group: "gov", x: 20, y: 530, w: 940, h: 80 },
                { group: "guide", x: 20, y: 690, w: 940, h: 130 },
                { group: "figma", x: 20, y: 900, w: 940, h: 80 },
                { group: "output", x: 80, y: 1060, w: 840, h: 80 },
              ].map(({ group, x, y, w, h }) => (
                <g key={group}>
                  <rect
                    x={x} y={y} width={w} height={h} rx={8}
                    fill={GROUPS[group].color + "08"}
                    stroke={GROUPS[group].color + "30"}
                    strokeWidth={1}
                    style={{ opacity: activeGroup && activeGroup !== group ? 0.3 : 1 }}
                  />
                  <text x={x + 8} y={y + 14} fill={GROUPS[group].color} fontSize={10} fontFamily="system-ui" opacity={0.7}>
                    {GROUPS[group].label}
                  </text>
                </g>
              ))}

              {/* Connections */}
              {CONNECTIONS.map((conn, i) => (
                <Arrow
                  key={i}
                  from={conn.from}
                  to={conn.to}
                  color={conn.color}
                  label={conn.label}
                  dashed={conn.type === "ref"}
                />
              ))}

              {/* File Cards */}
              {FILES.map((file) => {
                const dimmed =
                  (activeGroup && file.group !== activeGroup) ||
                  (connectedIds && !connectedIds.has(file.id));
                return (
                  <g
                    key={file.id}
                    style={{ opacity: dimmed ? 0.2 : 1, cursor: "pointer", transition: "opacity 0.2s" }}
                    onMouseEnter={() => setHoveredFile(file.id)}
                    onMouseLeave={() => setHoveredFile(null)}
                  >
                    <rect
                      x={file.x} y={file.y} width={CARD_W} height={CARD_H} rx={6}
                      fill={hoveredFile === file.id ? C.bgCardHover : C.bgCard}
                      stroke={hoveredFile === file.id ? file.color : C.border}
                      strokeWidth={hoveredFile === file.id ? 2 : 1}
                    />
                    <text x={file.x + 8} y={file.y + 18} fill={file.color} fontSize={10} fontWeight={600} fontFamily="monospace">
                      {file.icon} {file.label.length > 22 ? file.label.slice(0, 20) + "…" : file.label}
                    </text>
                    <text x={file.x + 8} y={file.y + 36} fill={C.textDim} fontSize={9} fontFamily="system-ui">
                      {file.desc.length > 28 ? file.desc.slice(0, 26) + "…" : file.desc}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Connection Legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: 11, color: C.textDim }}>
            <span><span style={{ color: C.green }}>━━</span> 資料讀取 / 驗證</span>
            <span><span style={{ color: C.orangeDim }}>━━</span> 數字同步寫入</span>
            <span><span style={{ color: C.pink }}>━━</span> 產出 / 展示</span>
            <span><span style={{ color: C.yellowDim }}>━━</span> Figma 腳本讀取</span>
            <span><span style={{ color: C.purple }}>- - -</span> 間接參考</span>
          </div>
        </div>
      )}

      {/* ═══════════════════ VIEW: Workflow ═══════════════════ */}
      {view === "workflow" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 40px" }}>
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 28 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px", color: C.text }}>每次任務的工作迴圈</h2>
            <p style={{ fontSize: 12, color: C.textDim, margin: "0 0 24px" }}>
              不管做什麼任務，都走這 10 步。失敗回到 Step 4 重跑。
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {WORKFLOW.map((w, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Step number */}
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: w.color + "22", border: `2px solid ${w.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: w.color, flexShrink: 0,
                    }}>
                      {w.step}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: w.color, fontFamily: "monospace" }}>
                          {w.label}
                        </span>
                        <span style={{
                          fontSize: 10, padding: "1px 8px", borderRadius: 10,
                          background: w.color + "22", color: w.color,
                        }}>
                          {w.actor}
                        </span>
                      </div>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textDim }}>{w.desc}</p>
                    </div>
                    {/* Files involved */}
                    <div style={{ fontSize: 10, color: C.textMuted, textAlign: "right", minWidth: 160 }}>
                      {w.step === 1 && "COWORK_INSTRUCTIONS / CLAUDE.md"}
                      {w.step === 2 && "design-system-all.json"}
                      {w.step === 4 && "design-system-all.json"}
                      {w.step === 5 && "validate-design-system.py"}
                      {w.step === 6 && "sync-derived-files.py → 6 衍生檔"}
                      {w.step === 7 && "所有變動檔案"}
                      {w.step === 8 && "git repo"}
                      {w.step === 9 && "Kay 本機 terminal"}
                      {w.step === 10 && "Claude Project Knowledge"}
                    </div>
                  </div>
                  {/* Connector line */}
                  {i < WORKFLOW.length - 1 && (
                    <div style={{ width: 2, height: 16, background: C.border, marginLeft: 17 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Fail loop annotation */}
            <div style={{
              marginTop: 20, padding: "12px 16px", borderRadius: 8,
              background: C.red + "11", border: `1px solid ${C.red}33`,
              fontSize: 12, color: C.textDim,
            }}>
              <span style={{ color: C.red, fontWeight: 600 }}>⚠ 失敗回溯：</span>
              validate FAIL → 回 Step 4 修 JSON 重跑 ｜ Figma 視覺不對 → 回 Step 3 的 Token 定義 ｜ 交付驗證 FAIL → 回 Token 定義
            </div>
          </div>

          {/* Data flow summary */}
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 28, marginTop: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: C.text }}>資料流向摘要</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { title: "寫入方向（單向）", items: ["Kay/Chat 決策 → design-system-all.json", "sync-derived-files.py → SKILL.md, CLAUDE.md, governance.md, EXECUTION_PLAN.md, progress.md, govsum.md", "sync-daily-log.py → DAILY_LOG.md"], color: C.orange },
                { title: "讀取方向", items: ["validate 讀 JSON + 所有衍生檔", "Figma Scripter 讀 JSON token 值", "viewer-live.html fetch JSON 即時渲染", "Claude Agent 讀 entry point → 建立 context"], color: C.blue },
                { title: "Figma 雙向", items: ["JSON → Thierry import → Figma Variables", "Figma MCP → get_variable_defs → 驗證 binding", "Figma → get_design_context → 回饋到 token 定義"], color: C.yellow },
                { title: "Git & PK 同步", items: ["Claude Code: git commit", "Kay 本機: git push", "Kay 手動: 更新 Project Knowledge（10 個檔案）"], color: C.green },
              ].map((section, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 8, background: section.color + "08", border: `1px solid ${section.color}22` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: section.color, marginBottom: 8 }}>{section.title}</div>
                  {section.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 11, color: C.textDim, marginBottom: 4, paddingLeft: 8, borderLeft: `2px solid ${section.color}44` }}>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ VIEW: Actors ═══════════════════ */}
      {view === "actors" && (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {ACTORS.map((actor) => (
              <div key={actor.id} style={{
                background: C.bgCard, borderRadius: 12, border: `1px solid ${actor.color}44`,
                padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 24 }}>{actor.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: actor.color }}>{actor.label}</div>
                    <div style={{ fontSize: 11, color: C.textDim }}>{actor.desc}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
                  {actor.id === "chat" && (
                    <>
                      <div><span style={{ color: C.orange }}>讀取：</span>SKILL.md, component-governance.md, DAILY_LOG.md 頂部狀態</div>
                      <div><span style={{ color: C.orange }}>操作：</span>Figma MCP (get_design_context, get_screenshot, get_variable_defs)</div>
                      <div><span style={{ color: C.orange }}>產出：</span>Token 定義表格 → 交給 Cowork 寫入 JSON</div>
                      <div><span style={{ color: C.orange }}>決策：</span>元件分類、架構方向、治理規則衝突</div>
                    </>
                  )}
                  {actor.id === "cowork" && (
                    <>
                      <div><span style={{ color: C.blue }}>讀取：</span>COWORK_INSTRUCTIONS.md, SKILL.md, design-system-all.json</div>
                      <div><span style={{ color: C.blue }}>寫入：</span>design-system-all.json (唯一寫入者)</div>
                      <div><span style={{ color: C.blue }}>執行：</span>validate → sync → report</div>
                      <div><span style={{ color: C.blue }}>產出：</span>usage-guideline.md, Scripter 腳本, viewer HTML</div>
                    </>
                  )}
                  {actor.id === "claudecode" && (
                    <>
                      <div><span style={{ color: C.cyan }}>讀取：</span>CLAUDE.md, design-system-all.json, DAILY_LOG.md</div>
                      <div><span style={{ color: C.cyan }}>產出：</span>Vue components, React Native components, Storybook</div>
                      <div><span style={{ color: C.cyan }}>操作：</span>git commit, lint, test, AI debug</div>
                      <div><span style={{ color: C.cyan }}>每日：</span>sync-daily-log.py --write → 讀明日順序 → 開工</div>
                    </>
                  )}
                  {actor.id === "kay" && (
                    <>
                      <div><span style={{ color: C.yellow }}>Figma：</span>Thierry import, Scripter 執行, Variable Binding, 視覺驗證</div>
                      <div><span style={{ color: C.yellow }}>Git：</span>git push（Cowork 無認證，push 由 Kay 操作）</div>
                      <div><span style={{ color: C.yellow }}>PK：</span>手動更新 Claude Project Knowledge（10 個檔案）</div>
                      <div><span style={{ color: C.yellow }}>決策：</span>最終設計決策、Sprint 優先順序</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Handoff flow */}
          <div style={{ background: C.bgCard, borderRadius: 12, border: `1px solid ${C.border}`, padding: 24, marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: C.text }}>交接流程（Component 生命週期）</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
              {[
                { label: "需求確認", actor: "Kay+Chat", color: C.orange },
                { label: "Token 定義", actor: "Chat", color: C.orange },
                { label: "JSON 寫入", actor: "Cowork", color: C.blue },
                { label: "驗證+同步", actor: "Cowork", color: C.blue },
                { label: "Guideline", actor: "Cowork", color: C.blue },
                { label: "Figma Import", actor: "Kay", color: C.yellow },
                { label: "Component 建置", actor: "Kay+Cowork", color: C.yellow },
                { label: "Binding", actor: "Kay", color: C.yellow },
                { label: "視覺驗證", actor: "Kay", color: C.yellow },
                { label: "交付驗證", actor: "Cowork", color: C.blue },
                { label: "Governance", actor: "Cowork", color: C.blue },
                { label: "工程輸出", actor: "Claude Code", color: C.cyan },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{
                    padding: "6px 10px", borderRadius: 6,
                    background: step.color + "18", border: `1px solid ${step.color}44`,
                    textAlign: "center", minWidth: 70,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: step.color }}>{step.label}</div>
                    <div style={{ fontSize: 9, color: C.textMuted }}>{step.actor}</div>
                  </div>
                  {i < 11 && <span style={{ color: C.textMuted, margin: "0 2px", fontSize: 12 }}>→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
