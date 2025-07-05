# RapidPrototypeGenerator

ユーザーのアイデアを素早くHTMLプロトタイプに変換するAI駆動型ツール。Claude APIを活用して、アイデアから機能的なプロトタイプまでを5つのフェーズで実現します。

## 機能概要

### 5フェーズワークフロー

1. **入力フェーズ**: アイデアの入力とファイルアップロード
2. **拡張フェーズ**: AIによるアイデアの詳細化と要件定義
3. **精密化フェーズ**: インタラクティブな質問による要件の洗練
4. **生成フェーズ**: HTML/CSS/JSプロトタイプの自動生成
5. **フィードバックフェーズ**: プロトタイプの評価と改善

## 環境設定

### 必要条件

- Node.js 16.x以上
- npm または yarn
- Claude API キー（Anthropic社から取得）

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/kenken0825/RapidPrototypeGenerator.git
cd RapidPrototypeGenerator
```

2. 依存関係をインストール
```bash
npm install
```

3. 環境変数の設定
```bash
cp .env.local.example .env.local
```

4. `.env.local`ファイルを編集してClaude APIキーを設定
```
VITE_CLAUDE_API_KEY=your-actual-api-key-here
```

### Claude APIキーの取得方法

1. [Anthropic Console](https://console.anthropic.com/)にアクセス
2. アカウントを作成またはログイン
3. API Keysセクションで新しいキーを生成
4. 生成されたキーを`.env.local`に設定

### 環境変数の詳細

| 変数名 | 説明 | デフォルト値 |
|--------|------|------------|
| `VITE_CLAUDE_API_KEY` | Claude APIキー（必須） | なし |
| `VITE_CLAUDE_MODEL` | 使用するClaudeモデル | claude-3-opus-20240229 |
| `VITE_CLAUDE_MAX_TOKENS` | 最大トークン数 | 4096 |

## 開発

### 開発サーバーの起動
```bash
npm run dev
```
ブラウザで http://localhost:5173 にアクセス

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

### テストの実行
```bash
npm test
```

### リント
```bash
npm run lint
```

## 使用方法

1. アプリケーションを起動
2. アイデアを入力（例：「学生向けの学習管理システム」）
3. 必要に応じてターゲットユーザーや制約条件を追加
4. 各フェーズを順番に進めてプロトタイプを生成
5. 生成されたコードをダウンロードまたはプレビュー

## プロジェクト構造

```
src/
├── components/        # Reactコンポーネント
│   ├── InputPhase/   # フェーズ1: 入力
│   ├── ExpansionPhase/ # フェーズ2: 拡張
│   ├── RefinementPhase/ # フェーズ3: 精密化
│   ├── GenerationPhase/ # フェーズ4: 生成
│   └── FeedbackPhase/ # フェーズ5: フィードバック
├── services/         # APIサービス
│   ├── claudeService.js # Claude API統合
│   └── promptTemplates.js # プロンプトテンプレート
└── App.jsx          # メインアプリケーション
```

## トラブルシューティング

### Claude APIエラー
- APIキーが正しく設定されているか確認
- API利用制限に達していないか確認
- ネットワーク接続を確認

### ビルドエラー
```bash
npm clean-install
npm run build
```

### 開発モードでのフォールバック
APIキーが設定されていない場合、自動的にモックデータが使用されます。

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

MITライセンス - 詳細は[LICENSE](LICENSE)ファイルを参照

## サポート

問題や質問がある場合は、[Issues](https://github.com/kenken0825/RapidPrototypeGenerator/issues)でお知らせください。