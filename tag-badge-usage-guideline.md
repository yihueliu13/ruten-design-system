# Ruten Design System — Tag & Badge 使用規則

> **版本**: v1.0.0-draft  
> **日期**: 2026-03-16  
> **狀態**: 討論定稿中  
> **適用範圍**: 露天市集（Ruten）、一抽露魂（Ichiban）、預購市場（Resell）  
> **維護者**: Design System Team  
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Feedback × Primitive × Owned（Tag 74 + Badge 11 = 85 tokens）

---

## 1. 總覽：為什麼需要這份文件

電商平台中 Tag 和 Badge 的使用場景非常密集，但界線模糊。設計師不確定「預購」是 Tag 還是 Badge，工程師不知道該用哪組 token，AI 無法從 token 名稱推斷應該綁定哪個組件。

本文件定義**唯一判斷規則**，讓三方（設計師、工程師、AI）用同一套語言溝通。

---

## 2. 核心定義：Tag vs Badge

### 2.1 判斷規則（唯一一條）

```
附著在另一個元素角落的小型圓點或數字指示器 → Badge
其他所有標記型、篩選型、操作型元件 → Tag
```

### 2.2 Badge（徽章）

| 屬性 | 說明 |
|------|------|
| **本質** | 附著型指示器 |
| **位置** | 寄生在另一個元素（icon、avatar、tab）的角落 |
| **互動性** | 永遠不可互動（靜態） |
| **內容** | 數字計數、小圓點、短文字（1~3字） |
| **Token 路徑** | `comp/badge/` |

**露天實例**：
- 購物車數字（1）— 附著在購物車 icon 右上角
- 露露通未讀數（25）— 附著在聊聊 icon 右上角
- NEW 紅色圓點 — 附著在首頁快捷入口 icon 右上角
- HOT 標記 — 附著在導航分類文字旁
- 一番賞商品圖右上角的抽數（1）— 附著在商品圖角落

### 2.3 Tag（標籤）

| 屬性 | 說明 |
|------|------|
| **本質** | 獨立存在的標記或互動元件 |
| **位置** | 在內容流中佔據自己的空間（inline 或 block） |
| **互動性** | 可以是靜態的，也可以是互動的 |
| **內容** | 文字標籤，可帶 icon prefix、close icon、badge suffix |
| **Token 路徑** | `comp/tag/{role}/` |

**露天實例**：
- 露天心選（商品卡標記）
- 預購（商品頁標記）
- 哥吉拉（一番賞分類篩選）
- 火影忍者 ✕（歷史搜尋可刪除）
- 代理版 / 日規中文版（商品規格選擇）
- 鐵血的孤兒 / 熱銷首選（商品推薦標記）

### 2.4 灰色地帶決策表

| 元件 | 判斷 | 歸類 | 原因 |
|------|------|------|------|
| 商城（商品卡上） | Tag | `comp/tag/display/` | 獨立佔據空間，不附著在其他元素角落 |
| 天天超划算 | Tag | `comp/tag/display/` | 同上 |
| 預購（藍底） | Tag | `comp/tag/display/` | 獨立標記，在標題旁但非附著角落 |
| 3C聯盟（賣家名旁） | Tag | `comp/tag/display/` | 獨立標記 |
| 已售完 | Tag | `comp/tag/display/` | 獨立狀態標記 |
| 免運$99（角標） | Tag | `comp/tag/display/` (promo-corner 子類) | 雖在圖片角落但面積大、有獨立內容結構 |
| A賞 / 最後賞 | Tag | `comp/tag/display/` | 獨立等級標記 |
| 大賞齊全 / 尚有大賞 | Tag | `comp/tag/display/` (composite) | 特殊造型但本質是狀態標記 |
| NEW 紅點 | Badge | `comp/badge/` | 小圓點附著在 icon 角落 |
| 購物車數字 | Badge | `comp/badge/` | 數字附著在 icon 角落 |
| 商品圖右上角抽數（1） | Badge | `comp/badge/` | 數字附著在圖片角落 |

---

## 3. Tag 的 Role 分類體系

### 3.1 四大 Role

| Role | 中文 | 互動性 | 狀態 | 說明 |
|------|------|--------|------|------|
| **filter** | 篩選型 | ✅ 互動 | normal / active / disabled | 使用者主動篩選內容，toggle 切換 |
| **display** | 標記型 | ❌ 靜態 | static only | 系統自動標記，傳達狀態/分類/屬性 |
| **action** | 操作型 | ✅ 互動 | normal / pressed | 觸發動作但非篩選（搜尋、刪除） |
| **input** | 輸入型 | ✅ 互動 | normal / editing | 使用者產生內容轉為 tag（**預留，暫不定義**） |

### 3.2 Role 判斷流程

```
使用者可以點擊它嗎？
├── 否 → Display（標記型）
└── 是 → 點擊的目的是什麼？
    ├── 篩選/切換內容 → Filter（篩選型）
    ├── 觸發動作（搜尋/刪除/導航） → Action（操作型）
    └── 建立新標籤 → Input（輸入型，預留）
```

---

## 4. Filter Tag（A 類）完整場景

### 4.1 場景清單

| 編號 | 場景 | 範例 | 平台 | 選擇模式 |
|------|------|------|------|---------|
| A1 | 排序切換 | 熱門度 / 價格 / 銷量 | Both | 單選 |
| A2 | 優惠篩選 | 露幣加碼 / 運費券 / 有折扣 | App=tag, Web=checkbox | 多選 toggle |
| A3 | 賣家身份 | 官網購 / 露天心選 / 3C聯盟 / ebay | App=tag, Web=checkbox | 多選 toggle |
| A4 | 出貨地 | 台灣 / 海外 | App=tag, Web=checkbox | 單選 |
| A5 | 付款方式 | 7-11 / 全家 / 拍錢包 | App=tag, Web=checkbox | 多選 toggle |
| A6 | 商品條件 | 全新品 / 二手品 / 24h出貨 | App=tag, Web=checkbox | 多選 toggle |
| A7 | 主題分類 | 玩具公仔 / 卡牌遊戲 / 生活居家 | Both | 單選 tab |
| A8 | 規格選擇 | 代理版 / 日規中文版 / 黑色 / 白色 | Both | 單選 |
| A9 | IP/系列分類 | 哥吉拉 / 寶可夢 / 卡牌 / 熱抽 | Both (Ichiban) | 單選 |
| A10 | 出貨方式 tab | 趣逛看 / 預購 | Both | 單選 tab |

### 4.2 Filter Tag 的三個狀態

| 狀態 | 視覺 | 觸發條件 |
|------|------|---------|
| **normal** | 淺色底或深色底（依 theme），無強調 | 預設狀態 |
| **active** | 填色切換、帶描邊、或帶 ✓ icon | 使用者點擊選中 |
| **disabled** | opacity 降低，不可點擊 | 無可用選項時 |

### 4.3 Filter Tag 的可選 Slot

| Slot | 說明 | 範例 |
|------|------|------|
| icon prefix | 前置圖標 | 🔥 fire icon（熱門 IP）、® 露幣、7-11 logo |
| text | 必填文字 | 「哥吉拉」「運費券」 |
| badge suffix | 後綴小標 | 「TOP」「P幣」 |
| check icon | 選中指示 | ✓（active 態） |

---

## 5. Display Tag（B 類）完整場景

### 5.1 語意色分類

| 語意 | 色彩 Token | 使用場景 |
|------|-----------|---------|
| **primary** | sys/color/primary (orange) | 品牌認證：商城、品牌旗艦 |
| **primary-container** | sys/color/primary-container | 促銷標記：天天超划算、熱銷首選 |
| **info** | sys/color/info (blue) | 出貨方式：預購、3天內出貨 |
| **success** | sys/color/success (green) | 保障/認證：退貨險、3C聯盟 |
| **error** | sys/color/error-container (red) | 庫存/狀態：已售完 |
| **warning** | sys/color/warning-container (yellow) | 付款/限時：6期0利率 |
| **price** | sys/color/price (red) | 促銷金額：免運$99 |
| **neutral** | sys/color/surface-variant | 一般標記：AD、可開發票 |
| **per-level** | 各賞品自定義色 | 獎品等級：A賞(紅)、B賞(藍)、最後賞(黃) |

### 5.2 Display Tag 的特殊子類

| 子類 | 說明 | Token 處理 |
|------|------|-----------|
| **promo-corner** | 免運$99 角標，非對稱圓角 | 獨立 token set（已有） |
| **composite** | 大賞齊全、露天心選 badge（帶 icon） | Compound (Slot Override)，token 管色彩，形狀由 Figma component 控制 |
| **prize-level** | A賞/B賞/最後賞，per-level 色 | 色彩由業務邏輯決定，token 只管結構尺寸 |

---

## 6. Action Tag（C 類）完整場景

### 6.1 子類型

| 子類 | 說明 | 行為 | 範例 |
|------|------|------|------|
| **dismissible** | 可刪除 | 點擊=觸發動作，✕=移除 | 歷史搜尋（火影忍者 ✕） |
| **navigational** | 導航型 | 點擊=跳轉或觸發搜尋 | 推薦熱搜（hyread / 變形金剛） |

### 6.2 Action Tag 的 Slot

| Slot | dismissible | navigational |
|------|-------------|-------------|
| icon prefix | 可選 | 可選 |
| text | 必填 | 必填 |
| close icon (✕) | ✅ 必有 | ❌ 無 |

---

## 7. 尺寸系統（Size）

### 7.1 六級尺寸

| Size | min-height | font-size | padding-h | padding-v | 主要用途 |
|------|-----------|-----------|-----------|-----------|---------|
| **xs** | 16px | label-2xs (8px) | 2xs (4px) | 1px | 角標折扣、Shipping tag |
| **sm** | 20px | label-xs (10px) | xs (8px) | 2xs (4px) | 商品卡 badge、獎品等級 |
| **md** | 28px | body-md-alt (13px) | sm (12px) | 2xs (4px) | Filter chip、歷史搜尋、Web filter |
| **lg** | 32px | body/md (14px) | md (16px) | xs (8px) | Desktop 大分類、規格選擇 |
| **xl** | 40px | body/md (14px) | md (16px) | sm (12px) | App facet filter |
| **2xl** | 48px | title/sm (16px) | lg (24px) | sm (12px) | **預留**：大型 App 觸控 tag |

### 7.2 平台 × 角色 → 尺寸對應

| Role × 場景 | Web | App |
|-------------|-----|-----|
| Filter — 排序/分類 tab | md (28px) | md~lg (28~32px) |
| Filter — facet 進階篩選 | N/A (checkbox) | xl (40px) |
| Filter — 規格選擇 | lg (32px) | xl (40px) |
| Display — 商品卡上 | xs~sm | xs~sm |
| Display — 商品頁上 | sm (20px) | md (28px) |
| Action — 歷史搜尋 | md (28px) | lg (32px) |
| Action — 推薦熱搜 | sm (20px) | md (28px) |

---

## 8. 形狀系統（Shape / Border-Radius）

### 8.1 兩種基本形狀

| Shape | radius 值 | 視覺 | 語意 |
|-------|----------|------|------|
| **pill** | 999px | 膠囊圓潤 | 互動型、使用者會觸碰的 |
| **rounded** | sys/radius/sm (4px) | 微圓角矩形 | 靜態標記、資訊標記 |

### 8.2 Shape × Role 對應

| Role | Ruten (default) | Ichiban | 說明 |
|------|----------------|---------|------|
| **filter** | sys/radius/md (8px) | 999px (pill) | 品牌差異，Phase 3 Variable Mode 覆蓋 |
| **display** | sys/radius/sm (4px) | sys/radius/sm (4px) | 統一小圓角，跨品牌一致 |
| **action** | 999px (pill) | 999px (pill) | 統一 pill，跨品牌一致 |

### 8.3 現階段處理方式

- 每個 role 各定義一個 `border-radius` token
- Ruten 為基準值
- Ichiban 的差異在 Phase 3 用 Figma Variable Mode 覆蓋
- 設計師不需要額外選擇 shape —— role 選對了，shape 就自動對

---

## 9. Token 路徑結構

### 9.1 完整路徑規則

```
comp/tag/{role}/{state 或 property}
comp/tag/base/{size}/{property}
comp/badge/{property}
```

### 9.2 共用 base token

| Token path | 說明 |
|-----------|------|
| `comp/tag/base/{size}/min-height` | 各尺寸的最低高度 |
| `comp/tag/base/{size}/font-size` | 各尺寸的字型大小 |
| `comp/tag/base/{size}/padding-h` | 各尺寸的水平內距 |
| `comp/tag/base/{size}/padding-v` | 各尺寸的垂直內距 |
| `comp/tag/icon-size` | icon prefix 尺寸（12px，共用） |
| `comp/tag/icon-gap` | icon 與文字間距（2px hardcode，共用） |
| `comp/tag/font-weight` | 預設字重 |

### 9.3 Role-specific token

| Token path | 說明 |
|-----------|------|
| `comp/tag/filter/normal/background` | Filter 預設態背景 |
| `comp/tag/filter/normal/text-color` | Filter 預設態文字 |
| `comp/tag/filter/normal/border-color` | Filter 預設態邊框 |
| `comp/tag/filter/active/background` | Filter 選中態背景 |
| `comp/tag/filter/active/text-color` | Filter 選中態文字 |
| `comp/tag/filter/active/border-color` | Filter 選中態邊框 |
| `comp/tag/filter/border-radius` | Filter 圓角（Ruten=8px，Ichiban=pill） |
| `comp/tag/display/{semantic}/background` | Display 各語意色背景 |
| `comp/tag/display/{semantic}/text-color` | Display 各語意色文字 |
| `comp/tag/display/border-radius` | Display 圓角（4px） |
| `comp/tag/action/dismissible/background` | Dismissible 背景 |
| `comp/tag/action/dismissible/text-color` | Dismissible 文字 |
| `comp/tag/action/dismissible/close-icon-color` | Dismissible ✕ 顏色 |
| `comp/tag/action/navigational/background` | Navigational 背景 |
| `comp/tag/action/navigational/text-color` | Navigational 文字 |
| `comp/tag/action/border-radius` | Action 圓角（pill） |

### 9.4 Badge token（精簡）

| Token path | 說明 |
|-----------|------|
| `comp/badge/dot/size` | 圓點尺寸（8px） |
| `comp/badge/dot/color` | 圓點顏色（error red） |
| `comp/badge/count/min-size` | 數字 badge 最小尺寸（16px） |
| `comp/badge/count/font-size` | 數字字型大小 |
| `comp/badge/count/background` | 數字背景色 |
| `comp/badge/count/text-color` | 數字文字色 |
| `comp/badge/count/border-radius` | 數字圓角（pill） |
| `comp/badge/offset-x` | 附著位置水平偏移 |
| `comp/badge/offset-y` | 附著位置垂直偏移 |

---

## 10. AI 判斷指引（$description 撰寫規範）

每個 token 的 `$description` 欄位是 AI 理解設計意圖的唯一依據。撰寫規範：

### 10.1 必須包含的資訊

1. **Role** — 這是什麼類型的 tag（filter / display / action）
2. **State** — 這對應什麼狀態（normal / active / static）
3. **場景** — 什麼時候用（搜尋篩選面板、商品卡、商品頁...）
4. **平台** — 哪個平台用（App / Web / Both）

### 10.2 範例

```json
{
  "$value": "{sys.color.surface-variant}",
  "$description": "Filter tag normal state background. Used for unselected filter chips in search facets (App) and category tabs (Both). Neutral surface for inactive filter options."
}
```

```json
{
  "$value": "{sys.color.primary}",
  "$description": "Filter tag active state background. Used when user selects a filter chip. Orange fill indicates active selection. Ichiban theme overrides to brand/500 in dark mode."
}
```

---

## 11. 擴充規則

### 11.1 新增 Tag 場景

1. 判斷是否已被現有 Role 覆蓋（大多數新場景都是）
2. 如果是新 Role，需經過設計系統委員會審核
3. 更新本文件的場景清單
4. 在 `design-system-all.json` 新增 token（如需要）
5. 跑 `validate-design-system.py` 確認通過

### 11.2 新增尺寸

1. 必須基於 base-4 spacing grid
2. 新增到 `comp/tag/base/{size}/` 下
3. 更新本文件的尺寸表和平台對應表

### 11.3 新增語意色

1. 確認 `sys/color/` 層已有對應語意色
2. 新增到 `comp/tag/display/{semantic}/` 下
3. 更新本文件的語意色分類表

### 11.4 新增品牌 Theme

1. Phase 3 多品牌處理時
2. 用 Figma Variable Mode 覆蓋 sys 層值
3. Token 路徑結構不變
4. 更新本文件的 Shape × Role 對應表

---

## 12. 設計師 Do / Don't

### Do ✓
- Tag 選 role 前先問自己：這個標籤是給使用者點的（Filter/Action），還是純展示的（Display）？
- 篩選用 Filter Tag（可選可取消），展示用 Display Tag（不可互動）
- Badge 只用在通知數量（紅點/數字），不要拿 Badge 當 Tag 用
- Product Card 裡的 tag（露天心選、預購）用 Slot Override token，不要用 Tag Primitive 的預設色
- Tag 文字盡量控制在 2~6 個中文字

### Don't ✗
- 不要把 Tag 和 Badge 搞混——Tag 是分類標記，Badge 是通知計數
- 不要在同一個商品卡上堆超過 3 個 Tag——太多標籤等於沒有標籤
- 不要用 Tag 來做按鈕該做的事——如果點了會觸發操作（送出、刪除），那是 Button
- 不要自己定義 Tag 顏色——用 token，品牌切換時才能自動適配
- 不要把 Filter Tag 用在不可互動的場景——使用者會以為可以點

---

## 13. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0-draft | 2026-03-16 | 初始版本。定義 Tag vs Badge 判斷規則、4 Role 分類、10 Filter 場景、6 級尺寸、2 Shape 系統。 |

---

## 附錄 A：完整 Tag 實例對照表

| 實例 | Role | Size | Shape | 語意色 | 平台 | 頁面 |
|------|------|------|-------|-------|------|------|
| 哥吉拉 🔥 | filter | md | pill→8px(R)/pill(I) | — | Both (Ichiban) | 一番賞分類 |
| 熱抽 🔥 | filter | md | pill | — | Both (Ichiban) | 一番賞子分類 |
| 代理版四月再到貨 | filter | lg(W)/xl(A) | rounded 8px | — | Both | 商品頁規格 |
| 露幣加碼 | filter | xl | pill | — | App | 搜尋篩選面板 |
| 熱門度 | filter | md | — | — | Both | 搜尋排序 |
| 玩具公仔 | filter | md | — | — | Both | 首頁主題展覽 |
| 露天心選 ♥ | display | sm | rounded 4px | price (red) | Both | 商品卡 |
| 退貨險 🛡 | display | sm | rounded 4px | success (green) | Both | 商品卡 |
| 預購 | display | xs | rounded 4px | info (blue) | Both | 商品卡/商品頁 |
| 3C聯盟 | display | sm | rounded 4px | success (green) | Both | 商品頁賣家 |
| 商城 | display | sm | rounded 4px | primary (orange) | Both | 商品卡 |
| 天天超划算 | display | sm | rounded 4px | primary-container | Both | 商品卡 |
| 已售完 | display | sm | rounded 4px | error (red) | Both | 商品卡 |
| 免運$99 | display | — | asymmetric 8px | price (red) | Both | 商品卡角標 |
| A賞 / 最後賞 | display | sm | pill 24px | per-level | Both (Ichiban) | 一番賞獎品 |
| 大賞齊全 | display | sm | composite | price (red) | Both (Ichiban) | 一番賞列表 |
| 鐵血的孤兒 | display | md | pill | primary-container | Both | 商品推薦 |
| 熱銷首選 | display | md | pill | primary-container | Both | 商品推薦 |
| AD | display | xs | rounded 4px | neutral | Both | 搜尋結果 |
| 火影忍者 ✕ | action/dismissible | md(W)/lg(A) | pill | — | Both | 歷史搜尋 |
| hyread | action/navigational | sm(W)/md(A) | pill | — | Both | 搜尋熱詞 |

## 附錄 B：Badge 實例對照表

| 實例 | 類型 | 附著對象 | 內容 |
|------|------|---------|------|
| 購物車 (1) | count | 購物車 icon | 數字 |
| 露露通 (25) | count | 聊聊 icon | 數字 |
| NEW | dot+text | 快捷入口 icon | 短文字 |
| HOT | dot+text | 導航分類文字 | 短文字 |
| 一番賞抽數 (1) | count | 商品圖片 | 數字 |
