# Ruten Design System — SectionModule 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）

---

## 1. 元件定義

SectionModule 是區塊容器元件，包裹 SectionHeader + Content Slot + Footer，用於分類首頁的每個獨立內容區塊。Display 類 Compound。

---

## 2. 使用情境

### 什麼時候用
- 分類首頁的每個獨立內容區塊（🔥熱門分類、大家都在玩、今日精選、排行榜 等）
- 任何需要「標題 + 內容 + 可選 footer」結構的頁面區塊
- 多個 SectionModule 上下堆疊組成完整分類頁

### 什麼時候不用
- 全寬 Banner（Banner 有自己的 comp/banner/ token）
- 頁面最頂層的 NavigationBar 區域
- 表單佈局（用 Form Layout Pattern）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/section-module/background | {sys.color.surface} | White | Section module container background. White. |
| comp/section-module/border-radius | {sys.radius.md} | 16px | Section module top/bottom cap corner radius. 16px. |
| comp/section-module/padding-h | {sys.spacing.md} | 16px | Section module horizontal content padding. 16px. Aligns with page-level grid. |
| comp/section-module/cap-height | {sys.spacing.md} | 16px | Section module top/bottom decorative cap height. 16px. |
| comp/section-module/gap-header-to-content | {sys.spacing.md} | 16px | Gap between SectionHeader and first content slot. 16px. |
| comp/section-module/gap-content-to-footer | {sys.spacing.lg} | 24px | Gap between last content slot and footer action. 24px. |
| comp/section-module/gap-between-slots | {sys.spacing.md} | 16px | Gap between Slot A (filter) and Slot B (content). 16px. |

---

## 4. Slot 機制

SectionModule 採用 **Slot 架構**，由 3 個可選區域組成：

```
[────────── SectionModule ──────────]
│  cap-height: 16px                 │  ← 頂部裝飾留白
│  ┌── SectionHeader ──────────┐   │
│  │  🔥 熱門分類      看更多 > │   │
│  └───────────────────────────┘   │
│  gap-header-to-content: 16px      │
│  ┌── Slot A (filter) ───────┐   │  ← 可選：Tab / Tag 篩選列
│  │  全部 | 3C | 服飾 | 美妝   │   │
│  └───────────────────────────┘   │
│  gap-between-slots: 16px          │
│  ┌── Slot B (content) ──────┐   │  ← 必填：主要內容
│  │  ProductCard × N          │   │
│  │  或 Avatar Grid           │   │
│  │  或 Banner + Avatar 列     │   │
│  └───────────────────────────┘   │
│  gap-content-to-footer: 24px      │
│  ┌── Slot C (footer) ───────┐   │  ← 可選：行動按鈕
│  │  [看更多商品]              │   │
│  └───────────────────────────┘   │
│  cap-height: 16px                 │  ← 底部裝飾留白
[──────────────────────────────────]
```

### Slot A：Filter（可選）
放置篩選或分類切換的元件。

| 可放的內容 | 使用的 Primitive |
|-----------|----------------|
| 分類 Tab 切換 | Tab (sm/md) |
| 篩選 Tag 列 | Tag (filter role) |

### Slot B：Content（必填）
放置主要內容。這是 Pattern 層，不需要額外 comp/ token。

| 可放的內容 | 使用的 Pattern / Primitive |
|-----------|--------------------------|
| 商品卡橫滑 | HorizontalScroll + ProductCard |
| 商品卡 Grid | Product Grid (2-4 columns) |
| 分類 Avatar Grid | CategoryGrid + Avatar |
| 排行榜卡片橫滑 | HorizontalScroll + LeaderboardCard (ProductCard variant) |
| Hero Banner + Avatar 列 | Banner + Avatar × N |
| 純文字資訊 | Typography 直接排版 |

### Slot C：Footer（可選）
放置行動按鈕或「查看更多」連結。

| 可放的內容 | 使用的 Primitive |
|-----------|----------------|
| 查看更多按鈕 | Button (secondary, md) |
| 文字連結 | Link / ghost Button |

---

## 5. 組合關係

### 與 SectionHeader
- SectionHeader **永遠是 SectionModule 的第一個子元素**
- padding-h 對齊：SectionHeader.padding-h = SectionModule.padding-h = 16px
- SectionHeader → Content 的 gap = gap-header-to-content (16px)

### 與 Tab / Tag
- Tab 或 Tag 放在 Slot A，用於篩選 Slot B 的內容
- Tab/Tag 自己管外觀 token，SectionModule 只管佈局（gap-between-slots）

### 與 Button
- Button 放在 Slot C 做 footer 行動
- 或放在 SectionHeader 的 trailing 位置（「看更多 >」）

### 與 Avatar / ProductCard
- 這些放在 Slot B，是 Content Pattern 的子元素
- SectionModule 不管 Content 內部的佈局（那是 Pattern 的責任）

### 與 Banner
- Banner 可以放在 Slot B 作為 Content
- Banner 有自己的 comp/banner/ token 管圓角和 padding

---

## 6. AI Agent 組裝分館頁的完整邏輯

AI 產出分類首頁 code 時，按以下步驟組裝：

```
Step 1: 確定有哪些區塊
  讀 Figma 設計稿或產品需求，列出所有 Section：
  - 🔥 熱門分類 (CategoryGrid)
  - 大家都在玩 (ProductCard 橫滑)
  - 排行榜 (LeaderboardCard 橫滑, brand surface)
  - 今日精選 (ProductCard Grid)
  - ...

Step 2: 每個 Section 對應一個 SectionModule
  <Page>
    <NavigationBar />
    <SectionModule>  ← 🔥 熱門分類
      <SectionHeader icon="fire" title="熱門分類" />
      <CategoryGrid>
        <Avatar size="xl" /><Avatar size="xl" />...
      </CategoryGrid>
    </SectionModule>

    <SectionModule>  ← 大家都在玩
      <SectionHeader icon="star" title="大家都在玩" trailing="看更多" />
      <Tab items={["全部", "3C", "服飾"]} />           ← Slot A
      <HorizontalScroll>                                ← Slot B
        <ProductCard /><ProductCard />...
      </HorizontalScroll>
    </SectionModule>

    <SectionModule background="brand">  ← 排行榜 (brand surface)
      <SectionHeader icon="trophy" title="排行榜" inverse />
      <HorizontalScroll>
        <LeaderboardCard /><LeaderboardCard />...
      </HorizontalScroll>
    </SectionModule>

    ...
    <BottomNav />
  </Page>

Step 3: 每個 SectionModule 的間距
  SectionModule 之間的 gap 用 sys/spacing/xs (8px) 或頁面背景色差異區分。
  不用 Divider（SectionModule 有圓角 cap，自帶視覺分界）。

Step 4: 動態內容
  Slot B 的內容由 API 資料決定。AI 只需要保持 SectionModule 的骨架結構不變。
```

---

## 7. Do / Don't

### Do
- 每個 Section 用一個 SectionModule 包裝
- SectionHeader 永遠在最上面
- Content 溢出（橫滑）時，SectionModule 不截斷

### Don't
- 不要在 SectionModule 內嵌套另一個 SectionModule
- 不要省略 cap-height（頂部和底部的裝飾留白是品牌視覺的一部分）
- 不要在 SectionModule 內放 Divider（用 gap token 管內部間距）

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。7 tokens：background + border-radius + padding-h + cap-height + 3 gap。Slot A/B/C 機制定義。 |
