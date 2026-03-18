# Ruten Design System — 執行計畫

> 更新：2026-03-17
> 範圍：分類館首頁 19 個 component
> 目前：529 tokens (ref 155 + sys 153 + comp 221) + 130 Text Styles
> 策略決策見 COWORK_INSTRUCTIONS.md §9-10

---

## 元件完整清單

### A. 已有 token（需收尾 + 建 Figma Component）

| # | Component | Tokens | 狀態 | 待做 |
|---|-----------|--------|------|------|
| 1 | ProductCard | 51 | ✅ Binding 大致完成 | 轉 Main Component + Variants |
| 2 | Button | 49 | ✅ Token 完成 | 建 Figma Main Component (size × style) |
| 3 | Tab | 28 | ✅ Token 完成 | 建 Figma Main Component (size × state) |
| 4 | Tag (Filter) | 61 | ✅ 清理完成 | 無舊路徑殘留（2026-03-17 驗證） |
| 5 | Tag (Display) | 含 #4 | ✅ 邊界確認 | product-card/tag-* 與 comp/tag 邊界清晰（2026-03-17 驗證） |
| 6 | Tag (Promo Corner) | 含 #4 | ✅ | — |
| 7 | Icon | 8 | ✅ outline 完成 | 23 icon detach + -lite + color binding（2026-03-17） |
| 8 | Badge | 11 | ✅ Token 完成 | 建 Figma Main Component (dot/count) |

### B. 需全新定義 token（按執行優先序）

| 優先 | # | Component | 出現位置 | 預估 tokens |
|------|---|-----------|----------|-------------|
| P1 | 9 | SectionHeader | 🔥熱門分類 / 大家都在玩 等 (8+ 次) | ~12 |
| P1 | 10 | NavigationBar (Top) | 頂部橘色導航列 | ~10 |
| P1 | 11 | SearchBar | 頂部搜尋框（嵌在 NavBar 內） | ~10 |
| P1 | 12 | BottomNav | 底部五 tab 導航 | ~12 |
| P2 | 13 | CategoryGrid | 熱門分類 icon+文字 快捷入口 | ~8 |
| P2 | 14 | HorizontalScroll | 大家都在玩 / 焦點主題 橫滑 | ~5 |
| P2 | 15 | FeatureCard | 焦點主題大圖卡片 | ~8 |
| P3 | 16 | QuickInfoBar | 保障購物（評價/出貨/退貨） | ~8 |
| P3 | 17 | Divider | 各區塊間分隔線 | ~3 |
| P3 | 18 | Banner (Ad) | 廣告輪播區 | ~4 |
| P3 | 19 | Avatar (Round) | 圓形角色圖 | ~2 |

**預估新增 ~82 tokens → 總量 ~595**

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
- [ ] #2 Button：Chat 定 guideline（size × style × state × RWD）→ Cowork 建 Main Component + Variants
- [ ] #3 Tab：Chat 定 guideline（size × state × RWD）→ Cowork 建 Main Component + Variants
- [ ] #19 Avatar：Chat 定 guideline → Cowork 補 token + 建 Main Component

### Sprint 3：全局骨架元件（Chat 討論 + Cowork 執行）
- [ ] #9 SectionHeader（出現頻率最高）
- [ ] #10 NavigationBar + #11 SearchBar（頁面骨架上）
- [ ] #12 BottomNav（頁面骨架下）

### Sprint 4：P2 首頁內容元件 + Badge
- [ ] #8 Badge：Main Component (dot/count)
- [ ] #13 CategoryGrid
- [ ] #14 HorizontalScroll
- [ ] #15 FeatureCard

### Sprint 5：P3 剩餘元件
- [ ] #16 QuickInfoBar
- [ ] #17 Divider
- [ ] #18 Banner (Ad)

### Sprint 6：Variable Binding 審核 + Library 發布
- [ ] 所有元件 binding 完整度審核
- [ ] Variable scoping（隱藏 ref 層）
- [ ] 建立正式 Library 檔 → Publish
