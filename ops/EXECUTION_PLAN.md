# Ruten Design System — 執行計畫

> 更新：2026-03-18
> 範圍：分類館首頁 19 個 component
> 目前：686 tokens (ref 160 + sys 170 + comp 356) + 130 Text Styles
> 策略決策見 COWORK_INSTRUCTIONS.md §9-10
> Component 治理見 component-governance.md

---

## 元件完整清單

### A. 已有 token（需收尾 + 建 Figma Component）

| # | Component | 類別 | 深度 | Tokens | 狀態 | 待做 |
|---|-----------|------|------|--------|------|------|
| 1 | ProductCard | Display | Compound | 51 | ✅ Binding 大致完成 | 轉 Main Component + Variants |
| 2 | Button | Action | Primitive | 66 | ✅ Figma Component 48 variants (4 role × 4 size × 3 form) | — |
| 3 | Tab | Navigation | Primitive | 33 | ✅ Figma Component 24 variants (2 emphasis × 4 size × 3 state) | — |
| 4 | Tag (Filter) | Feedback | Primitive | 74 | ✅ 清理完成 | 無舊路徑殘留（2026-03-17 驗證） |
| 5 | Tag (Display) | Feedback | Primitive | 含 #4 | ✅ 邊界確認 | product-card/tag-* 與 comp/tag 邊界清晰（2026-03-17 驗證） |
| 6 | Tag (Promo Corner) | Feedback | Primitive | 含 #4 | ✅ | — |
| 7 | Icon | Media | Primitive | 8 | ✅ 476 icons, vector fill bound to Variable | — |
| 8 | Badge | Feedback | Primitive | 11 | ✅ Figma Component 2 variants (dot/count) | — |

### B. 需全新定義 token（按執行優先序）

| 優先 | # | Component | 類別 | 深度 | 出現位置 | 預估 tokens |
|------|---|-----------|------|------|----------|-------------|
| P1 | 9 | SectionHeader | Layout | Compound | 🔥熱門分類 / 大家都在玩 等 (8+ 次) | 17 ✅ Figma 16 variants |
| P1 | 10 | NavigationBar (Top) | Navigation | Compound | 頂部橘色導航列 | 14 ✅ Figma 6 variants |
| P1 | 11 | SearchBar | Navigation | Primitive | 頂部搜尋框（嵌在 NavBar 內） | 13 ✅ Figma 2 variants |
| P1 | 12 | BottomNav | Navigation | Compound | 底部五 tab 導航 | 15 ✅ Figma Component |
| P2 | 13 | CategoryGrid | Layout | Pattern | 熱門分類 icon+文字 快捷入口 | 0 ✅ Pattern layout |
| P2 | 14 | HorizontalScroll | Layout | Pattern | 大家都在玩 / 焦點主題 橫滑 | 0 ✅ Pattern layout |
| P2 | 15 | SectionModule | Display | Compound | 區塊容器（SectionHeader + Slots + Footer） | 7 ✅ Figma Component |
| P3 | 16 | QuickInfoBar | Layout | Pattern | 保障購物（評價/出貨/退貨） | 0 ✅ Pattern layout |
| P3 | 17 | Divider | Layout | Primitive | 各區塊間分隔線 | 5 ✅ Figma 3 variants |
| P3 | 18 | Banner | Display | Compound (Container) + Pattern (Content) | 廣告輪播區 | 5 ✅ Figma Component |
| P3 | 19 | Avatar (Round) | Media | Primitive | 圓形角色圖 | ✅ Figma Component 12 variants |
| 20 | Thumbnail | Display | Primitive | 圖片縮圖卡 | ✅ Figma Component 12 variants |

**預估新增 ~76 tokens → 總量 ~676**
（較先前估計 ~82 減少，因 Pattern 層不建 comp/ token；新增 Thumbnail 11 tokens）

---

## 執行節奏

### Chat（claude.ai）負責
- Spec 討論：每個新元件的設計決策、灰色地帶判斷、跨品牌差異
- 架構問題：token 路徑設計、元件邊界釐清
- Guideline 撰寫第一輪

### Cowork 負責
- 已確認的 token 寫入 JSON
- validate + 衍生檔同步
- Figma Component 建立 + binding
- Viewer 更新
- 批次操作（多個元件一起建 Figma Component）

### 工作迴圈
```
Chat 討論定稿 spec
    ↓
Cowork 寫入 JSON + validate + 同步
    ↓
Cowork 匯入 Figma + 建 Component + binding
    ↓
Chat 下一個元件（或回來修正）
```

---

## 開工順序

### Sprint 0：清技術債（已完成 ✅）
- [x] progress.md comp 數字 173→208
- [x] SKILL.md tag 數字 37→61
- [x] design-system-all.json 2 個 broken alias 修復
- [x] validate 全過（16 PASS, 0 FAIL）

### Sprint 1：Icon 收尾 + Tag 清理
- [x] #7 Icon：23 個分類 icon detach 到 new outline (87:15521) + rename -lite + comp/icon/md/color 綁定（2026-03-17）
- [x] #4 #5 Tag：舊路徑清理 → 無殘留；product-card/tag-* 邊界確認 → 清晰（2026-03-17）
- [x] 建立 icon-inventory.json（2026-03-17）

### Sprint 2：基礎元件 Guideline + Figma Component（Chat 定規範 → Cowork 執行）
- [x] #2 Button：Figma Component 48 variants (4 role × 4 size × 3 form) ✅
- [x] #3 Tab：Figma Component 24 variants (2 emphasis × 4 size × 3 state) ✅
- [x] #19 Avatar：Figma Component 12 variants ✅
- [x] #20 Thumbnail：Figma Component 12 variants ✅

### Sprint 3：全局骨架元件（Chat 討論 + Cowork 執行）
- [x] #9 SectionHeader：Figma Component 16 variants (layout×size×surface) ✅ 2026-03-30
- [x] #10 NavigationBar：Figma Component 6 variants (surface×layout) ✅ 2026-03-30
- [x] #11 SearchBar：Figma Component 2 variants (state=default|focus) ✅ 2026-03-30
- [x] #12 BottomNav：Figma Component (5 tabs + center button) ✅ 2026-03-30

### Sprint 4：P2 首頁內容元件 + Badge
- [x] #8 Badge：Figma Component 2 variants (type=dot|count) ✅ 2026-03-30
- [x] #13 CategoryGrid：Pattern layout (2×4 grid) ✅ 2026-03-30
- [x] #14 HorizontalScroll：Pattern layout (scrollable cards) ✅ 2026-03-30
- [x] #15 SectionModule：Figma Component (6 slots container) ✅ 2026-03-30

### Sprint 5：P3 剩餘元件
- [x] #16 QuickInfoBar：Pattern layout (3-column info bar) ✅ 2026-03-30
- [x] #17 Divider：Figma Component 3 variants (hairline|default|heavy) ✅ 2026-03-30
- [x] #18 Banner：Figma Component (container + contentSlot) ✅ 2026-03-30

### Sprint 6：Variable Binding 審核 + Library 發布
- [ ] 所有元件 binding 完整度審核
- [ ] Variable scoping（隱藏 ref 層）
- [ ] 建立正式 Library 檔 → Publish

---

## Phase 2 — Engineering Output（待做）

- [ ] `tokens.css`（Web Vue 用）
- [ ] `tokens.ts`（React Native 用）
- [ ] Vue component 產出（AI agent 從 JSON + SKILL.md 生成）
- [ ] React Native component 產出
- [ ] Storybook 整合（Button, Tag, Tab, Card, Icon stories）
- [ ] JSON → CSS/TS 轉換腳本

## Phase 3 — Multi-brand + Dark Mode（待做）

- [ ] Ichiban brand mode（色彩 token 替換）
- [ ] Resell brand mode（色彩 token 替換）
- [ ] Dark mode 結構預留
- [ ] 六組 brand × theme 組合測試

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
| Tag 舊路徑殘留 | ✅ Sprint 1 完成 | comp/tag 無殘留（2026-03-17） |
| product-card/tag-* 重複 | ✅ Sprint 1 完成 | 邊界確認清晰（2026-03-17） |
| validate 腳本 NO_LEGACY | ✅ | v2 已支援分層+扁平目錄 |
