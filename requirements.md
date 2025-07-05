# RapidPrototypeGenerator 設計仕様書

## 1. システム概要

### 1.1 目的
ユーザーの簡単なアイデア説明から、段階的にプロンプトを洗練し、最終的に実用的なHTMLプロトタイプを自動生成するツール。デザイン思考プロセスを自動化し、ステークホルダーとの早期検証を可能にする。

### 1.2 ワークフロー
```
ユーザー入力 → プロンプト拡張 → 要件精密化 → プロトタイプ生成 → フィードバック収集
```

## 2. 機能詳細設計

### 2.1 Phase 1: アイデア入力インターフェース
**機能:** ユーザーが自由形式でアイデアを入力
- **入力形式:** 
  - 自然言語での説明（日本語/英語対応）
  - 参考URL・画像の添付（オプション）
  - ターゲットユーザー情報
  - 基本的な制約条件

**入力例:**
```
"オンライン学習プラットフォームのダッシュボードを作りたい。
学習進捗、課題提出、成績確認ができるもの。
大学生向けで、スマホでも使いやすくしたい。"
```

### 2.2 Phase 2: インテリジェントプロンプト拡張エンジン
**機能:** 初期入力を構造化された詳細な要件仕様に変換

#### 2.2.1 拡張プロセス
1. **コンテキスト分析**
   - ドメイン識別（教育、EC、エンタメ等）
   - ユーザー層の特定
   - 主要機能の抽出

2. **要件補完**
   - 不足している重要要素の特定
   - 業界ベストプラクティスの適用
   - アクセシビリティ要件の追加

3. **技術的制約の明確化**
   - レスポンシブ要件
   - ブラウザ対応範囲
   - パフォーマンス要件

#### 2.2.2 拡張プロンプトテンプレート
```javascript
const expandedPrompt = {
  projectInfo: {
    title: "自動抽出されたプロジェクト名",
    domain: "教育/EC/SaaS等",
    targetUsers: ["大学生", "社会人"...],
    primaryGoals: ["学習効率化", "進捗管理"...]
  },
  uiRequirements: {
    pages: [
      {
        name: "ダッシュボード",
        purpose: "学習状況の一覧表示",
        keyComponents: ["進捗グラフ", "課題リスト", "通知エリア"]
      }
    ],
    designPrinciples: ["直感的操作", "情報の視認性", "モバイルファースト"],
    interactions: ["ドリルダウン", "フィルタリング", "リアルタイム更新"]
  },
  technicalSpecs: {
    responsive: true,
    accessibility: "WCAG 2.1 AA準拠",
    browserSupport: ["Chrome", "Safari", "Firefox", "Edge"],
    frameworks: ["CSS Grid", "Flexbox", "JavaScript ES6+"]
  }
}
```

### 2.3 Phase 3: インタラクティブ要件精密化
**機能:** 生成された拡張プロンプトをユーザーと対話的に調整

#### 2.3.1 質問生成エンジン
- 曖昧な要件の特定と質問生成
- 優先度に基づく質問の順序付け
- ユーザーフレンドリーな選択肢の提示

**質問例:**
```
Q1: メインダッシュボードで最も重要な情報は何ですか？
☐ 今週の学習時間
☐ 未提出の課題数
☐ 全体的な成績推移
☐ 次回の予定

Q2: データ表示の形式はどちらを好みますか？
☐ グラフ重視（視覚的）
☐ リスト重視（詳細情報）
☐ バランス型
```

#### 2.3.2 リアルタイム仕様更新
- ユーザー回答に基づく即座の仕様調整
- 変更影響の可視化
- 制約事項の自動チェック

### 2.4 Phase 4: プロトタイプ生成エンジン

#### 2.4.1 UI要素抽出・マッピング
```javascript
const uiElementMapping = {
  "学習進捗": {
    component: "ProgressChart",
    type: "data-visualization",
    props: ["percentage", "timeframe", "subjects"]
  },
  "課題リスト": {
    component: "TaskList",
    type: "interactive-list",
    props: ["items", "dueDate", "priority", "status"]
  },
  "成績確認": {
    component: "GradeTable",
    type: "data-table",
    props: ["subjects", "scores", "trends"]
  }
}
```

#### 2.4.2 レイアウト自動生成
- **グリッドシステム設計**
  - 画面サイズ別レイアウト定義
  - 要素の重要度に基づく配置最適化
  - 情報階層の視覚化

- **コンポーネント配置アルゴリズム**
  - F字パターン、Z字パターンの適用
  - 視線誘導の最適化
  - アクセシビリティガイドライン準拠

#### 2.4.3 インタラクション実装
```javascript
const interactionPatterns = {
  navigation: {
    type: "tab-based",
    transitions: "smooth-slide",
    breadcrumbs: true
  },
  dataFiltering: {
    type: "real-time",
    controls: ["dropdown", "daterange", "search"]
  },
  feedback: {
    loading: "skeleton-ui",
    success: "toast-notification",
    error: "inline-validation"
  }
}
```

### 2.5 Phase 5: フィードバック収集システム

#### 2.5.1 埋め込み機能
- **ホットスポット注釈**
  - クリック可能な説明エリア
  - 機能の意図とベネフィット表示
  - 代替案の提示

- **インライン編集モード**
  - リアルタイムテキスト編集
  - 色・サイズの調整機能
  - レイアウト変更のドラッグ&ドロップ

#### 2.5.2 フィードバック分析
```javascript
const feedbackAnalysis = {
  usabilityScore: {
    navigation: 0.85,
    contentClarity: 0.92,
    visualHierarchy: 0.78
  },
  commonRequests: [
    "フォントサイズを大きく",
    "メニューの位置変更",
    "カラーコントラスト調整"
  ],
  priorityImprovements: [
    {
      area: "ナビゲーション",
      impact: "high",
      effort: "medium",
      suggestion: "メガメニュー導入"
    }
  ]
}
```

## 3. 技術アーキテクチャ

### 3.1 フロントエンド構成
```
React Application
├── InputPhase (アイデア入力)
├── ExpansionPhase (プロンプト拡張)
├── RefinementPhase (要件精密化)
├── GenerationPhase (プロトタイプ生成)
└── FeedbackPhase (フィードバック収集)
```

### 3.2 プロンプト拡張システム
- **Claude API統合**
  - 構造化プロンプトテンプレート
  - ドメイン知識の活用
  - 反復的改善プロセス

### 3.3 コード生成エンジン
- **テンプレートシステム**
  - モジュラー設計
  - 再利用可能コンポーネント
  - カスタマイゼーション対応

### 3.4 データ管理
```javascript
const projectState = {
  sessionId: "unique-session-id",
  phases: {
    input: { completed: true, data: {...} },
    expansion: { completed: true, data: {...} },
    refinement: { completed: false, data: {...} },
    generation: { completed: false, data: null },
    feedback: { completed: false, data: null }
  },
  generatedCode: {
    html: "...",
    css: "...",
    javascript: "...",
    assets: [...]
  },
  feedback: [...]
}
```

## 4. 品質保証・検証

### 4.1 自動テスト
- **レスポンシブ検証**
  - 複数画面サイズでの表示確認
  - タッチ操作の最適化検証

- **アクセシビリティチェック**
  - WCAG 2.1ガイドライン準拠
  - スクリーンリーダー対応確認

### 4.2 パフォーマンス最適化
- **軽量化**
  - 不要なCSSの除去
  - 画像の最適化
  - JavaScript最小化

## 5. 将来拡張計画

### 5.1 Phase 2機能
- **デザインシステム連携**
  - 企業ブランドガイドライン適用
  - コンポーネントライブラリ統合

### 5.2 Phase 3機能
- **A/Bテスト機能**
  - 複数バリエーション生成
  - ユーザーテスト結果分析

### 5.3 長期ビジョン
- **コード出力機能**
  - React/Vue.js コンポーネント生成
  - バックエンドAPI仕様書生成
  - デプロイメント自動化

この設計により、単純なアイデアから実用的なプロトタイプまで、AIが支援する包括的な開発プロセスを実現できます。