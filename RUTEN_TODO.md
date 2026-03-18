# Ruten Design System — 全域待辦

> 更新：2026-03-17
> Sprint 級任務見 EXECUTION_PLAN.md
> 本文件追蹤 Phase 層級進度和跨 Sprint 的技術債

---

## Phase 1 — Figma UI Kit（進行中）

### 1.1 Token 定義
- [x] ref 155 tokens
- [x] sys 150 tokens
- [x] comp 208 tokens（icon 8, product-card 51, button 49, tab 28, tag 61, badge 11）
- [ ] 新增 ~82 tokens for #9-19（見 EXECUTION_PLAN Sprint 2-5）

### 1.2 Figma Component 建置
- [ ] ProductCard → Main Component + Variants
- [ ] Button → Main Component (sm/md/lg/xl × primary/secondary/ghost)
- [ ] Tab → Main Component (sm/md/lg/xl × active/inactive/hover)
- [ ] Tag → Main Component (filter/display/action × size × state)
- [ ] Badge → Main Component (dot/count)
- [ ] #9-19 新元件的 Figma Component

### 1.3 Variable Binding + Library
- [ ] 所有元件 binding 審核
- [ ] Variable scoping（隱藏 ref 層）
- [ ] 正式 Library 檔建立 + Publish

---

## Phase 2 — Engineering Output（待做）

- [ ] `tokens.css`（Web Vue 用）
- [ ] `tokens.ts`（React Native 用）
- [ ] Vue component 產出（AI agent 從 JSON + SKILL.md 生成）
- [ ] React Native component 產出
- [ ] Storybook 整合（Button, Tag, Tab, Card, Icon stories）
- [ ] JSON → CSS/TS 轉換腳本

---

## Phase 3 — Multi-brand + Dark Mode（待做）

- [ ] Ichiban brand mode（色彩 token 替換）
- [ ] Resell brand mode（色彩 token 替換）
- [ ] Dark mode 結構預留
- [ ] 六組 brand × theme 組合測試

---

## Phase 4b+ — Icon 系統持續擴充（待做）

- [ ] 持續從設計稿 detach 新 icon
- [ ] icon-inventory.json 版本管理
- [ ] Figma API 批量 export 腳本維護

---

## 技術債

| 項目 | 狀態 | 說明 |
|------|------|------|
| progress.md comp 數字 | ✅ 已修 | 173→208 |
| SKILL.md tag 數字 | ✅ 已修 | 37→61 |
| 2 broken alias | ✅ 已修 | tag-brand icon-size/gap 路徑 |
| Tag 舊路徑殘留 | ⏳ Sprint 1 | comp/tag 下可能有新舊結構重複 |
| product-card/tag-* 重複 | ⏳ Sprint 1 | 與 comp/tag 邊界待釐清 |
| validate 腳本 NO_LEGACY | ✅ | v2 已支援分層+扁平目錄 |
