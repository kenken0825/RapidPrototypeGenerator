# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RapidPrototypeGenerator - ユーザーの簡単なアイデア説明から、段階的にプロンプトを洗練し、最終的に実用的なHTMLプロトタイプを自動生成するツール。デザイン思考プロセスを自動化し、ステークホルダーとの早期検証を可能にする。

### ワークフロー
```
ユーザー入力 → プロンプト拡張 → 要件精密化 → プロトタイプ生成 → フィードバック収集
```

## Development Setup

### Project Structure
```
/
├── .claude/           # Claude Code configuration
├── .specstory/        # SpecStory extension artifacts (AI interaction history)
├── requirements.md    # 詳細な要件定義書
├── CLAUDE.md         # This file
└── src/              # ソースコード (React Application)
    ├── components/   # React コンポーネント
    │   ├── InputPhase/      # アイデア入力
    │   ├── ExpansionPhase/  # プロンプト拡張
    │   ├── RefinementPhase/ # 要件精密化
    │   ├── GenerationPhase/ # プロトタイプ生成
    │   └── FeedbackPhase/   # フィードバック収集
    ├── services/     # API連携、ビジネスロジック
    ├── templates/    # HTMLテンプレート
    └── utils/        # ユーティリティ関数
```

### Technology Stack
- **Frontend**: React
- **Styling**: CSS Grid, Flexbox
- **API Integration**: Claude API
- **Language**: JavaScript ES6+
- **Browser Support**: Chrome, Safari, Firefox, Edge

### Common Development Tasks

```bash
# プロジェクトセットアップ
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test

# リント実行
npm run lint
```

## Key Implementation Details

### Phase 1: アイデア入力インターフェース
- 自然言語での説明入力（日本語/英語対応）
- 参考URL・画像の添付機能
- ターゲットユーザー情報入力
- 基本的な制約条件設定

### Phase 2: プロンプト拡張エンジン
- コンテキスト分析（ドメイン識別、ユーザー層特定）
- 要件補完（不足要素の特定、ベストプラクティス適用）
- 技術的制約の明確化（レスポンシブ、ブラウザ対応、パフォーマンス）

### Phase 3: 要件精密化
- 曖昧な要件の特定と質問生成
- ユーザーフレンドリーな選択肢の提示
- リアルタイム仕様更新

### Phase 4: プロトタイプ生成
- UI要素の自動抽出とマッピング
- レイアウト自動生成（F字/Z字パターン）
- インタラクション実装（ナビゲーション、フィルタリング、フィードバック）

### Phase 5: フィードバック収集
- ホットスポット注釈機能
- インライン編集モード
- フィードバック分析とスコアリング

## Claude API Integration

Claude APIを使用してプロンプト拡張を行う際は、以下の構造化されたテンプレートを使用：

```javascript
const expandedPrompt = {
  projectInfo: { title, domain, targetUsers, primaryGoals },
  uiRequirements: { pages, designPrinciples, interactions },
  technicalSpecs: { responsive, accessibility, browserSupport, frameworks }
}
```

## Quality Assurance

- **レスポンシブ検証**: 複数画面サイズでの確認
- **アクセシビリティ**: WCAG 2.1 AA準拠
- **パフォーマンス最適化**: CSS/JS最小化、画像最適化

## Development Guidelines

1. **コンポーネント設計**: 再利用可能なモジュラー設計を心がける
2. **状態管理**: プロジェクト全体の状態をprojectStateで一元管理
3. **エラーハンドリング**: 各フェーズで適切なエラー処理を実装
4. **テスト**: 各コンポーネントのユニットテストを作成
5. **ドキュメント**: 新機能追加時は必ずドキュメントを更新

## Notes

- 詳細な要件は requirements.md を参照
- Claude API使用時はレート制限に注意
- 生成されたプロトタイプは自動的にアクセシビリティチェックを通す
- フィードバック収集データは今後の改善に活用