---
marp: true
theme: custom
paginate: true
---

<!-- _class: title -->
<!-- _paginate: false -->

# Minimal **Marp** Theme

<br>

シンプルで美しいスライドを、Markdownだけで

---

<!-- _class: section -->
<!-- _paginate: false -->

## レイアウト一覧

---

<!-- _class: catalog -->

### <i class="fa-solid fa-layer-group"></i> **13種**のレイアウト

- **title** — 表紙。H1 + サブテキスト
- **section** — 中扉。章の区切り
- **(なし)** — 基本レイアウト。H3で始める
- **content-right** — 左テキスト、右に画像
- **image** — 画像を大きく見せる
- **highlight** — 中央にキーメッセージ
- **metric** — 大きな数字・指標を横並び

---

<!-- _class: catalog -->

### <i class="fa-solid fa-layer-group"></i> **13種**のレイアウト（続き）

- **grid** — 3列グリッド
- **steps** — 縦並びの番号ステップ
- **flow** — 横フロー図
- **catalog** — 箇条書きリスト
- **table-lg** — 大きめテーブル
- **table-sm** — 小さめテーブル

`accent` を追加すると上部にアクセントカラーのボーダーが付きます。

---

### <i class="fa-solid fa-pen-nib"></i> **基本**の書き方

クラス指定は `<!-- _class: クラス名 -->` で行います。

- 見出し内の `**強調**` → プライマリカラー
- `*強調*` 内の `**二重強調**` → アクセントカラー
- 引用 `>` → 左にアクセントカラーのライン

> シンプルなルールだけ覚えれば、あとは書くだけ。

---

<!-- _class: highlight -->

### <i class="fa-solid fa-bullhorn"></i> **highlight** で中央にメッセージ

<br>

キーメッセージを1つだけ、大きく伝える。

---

<!-- _class: metric -->

### <i class="fa-solid fa-chart-line"></i> **metric** で数字を見せる

- **120%**
  売上成長率
- **3.2秒**
  平均応答速度
- **99.9%**
  稼働率

補足テキストをここに。

---

<!-- _class: grid -->

### <i class="fa-solid fa-grip"></i> **grid** で3列に並べる

- 項目A
- 項目B
- 項目C
- 項目D
- 項目E
- 項目F

---

<!-- _class: content-right -->

### <i class="fa-solid fa-image"></i> **content-right** で画像配置

左側にテキスト、右側に画像。

画像はMarkdown記法で最後に記述します。

`![](url)`

![](https://placehold.jp/400x300.png)

---

<!-- _class: image -->

### <i class="fa-solid fa-expand"></i> **image** で画像を主役に

![](https://placehold.jp/800x400.png)

---

### <i class="fa-solid fa-table"></i> **テーブル**の基本

通常のMarkdownテーブルが使えます。

| 見出し1 | 見出し2 |
|---|---|
| セルA | セルB |
| セルC | セルD |

ヘッダーはプライマリカラー、偶数行に薄い背景が入ります。

---

<!-- _class: table-lg -->

### <i class="fa-solid fa-table-columns"></i> **table-lg** で大きめテーブル

| 項目 | 値 |
|---|---|
| フォントサイズ | 28px |
| 右列 | 太字・右寄せ |

数値や金額を目立たせたいときに。

---

<!-- _class: table-sm -->

### <i class="fa-solid fa-table-list"></i> **table-sm** で小さめテーブル

| 項目 | 説明 | 備考 |
|---|---|---|
| フォントサイズ | 22px | 情報量が多いとき |
| 用途 | 明細・仕様・計算表 | 行数が多くても収まる |

テーブル下に補足を置けます。

---

<!-- _class: accent -->

### <i class="fa-solid fa-fire"></i> **accent** でアクセント強調

上部にアクセントカラーのボーダーが付きます。

<br>

- 見出しのstrongもアクセントカラーに変化
- `table-lg accent` のように組み合わせるとテーブルヘッダーも変化

> 注目させたいセクションに。

---

<!-- _class: steps -->

### <i class="fa-solid fa-list-ol"></i> **steps** で縦並びステップ

1. 課題を整理する
2. 仮説を立てて試す
3. 結果を共有する

---

<!-- _class: flow -->

### <i class="fa-solid fa-diagram-project"></i> **flow** で処理の流れ

- **入力** Markdown で記述
- **変換** テーマ CSS で整形
- **出力** プレビュー / PDF

---

<!-- _class: section -->
<!-- _paginate: false -->

## カラーパレット

---

### <i class="fa-solid fa-palette"></i> 使える**色**

<br>

- <i class="fa-solid fa-circle" style="color: var(--color-primary);"></i> **Primary**  — 見出し強調、リンク
- <i class="fa-solid fa-circle" style="color: var(--color-accent);"></i> **Accent**  — 引用線、セクション下線、`accent` ボーダー
- <i class="fa-solid fa-circle" style="color: var(--color-danger);"></i> **Danger**  — 警告や注意喚起（CSS変数として定義済み）

> 色は最小限に。多すぎると散漫になります。
