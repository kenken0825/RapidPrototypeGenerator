// Claude API用のプロンプトテンプレート

export const expandPromptTemplate = (inputData) => {
  return `あなたは優秀なUIデザイナー兼開発者です。以下のユーザーのアイデアを分析し、詳細な要件仕様に拡張してください。

ユーザーのアイデア:
${inputData.idea}

ターゲットユーザー: ${inputData.targetUsers || '指定なし'}
制約条件: ${inputData.constraints || '指定なし'}
言語: ${inputData.language === 'ja' ? '日本語' : '英語'}

以下の形式のJSONで回答してください:
{
  "projectInfo": {
    "title": "プロジェクトの適切なタイトル",
    "domain": "ドメイン（教育、EC、エンタメ、ヘルスケア、ビジネス、その他）",
    "targetUsers": ["具体的なターゲットユーザー層を配列で"],
    "primaryGoals": ["主要な目標・目的を配列で"]
  },
  "uiRequirements": {
    "pages": [
      {
        "name": "ページ名",
        "purpose": "ページの目的",
        "keyComponents": ["主要なコンポーネントを配列で"]
      }
    ],
    "designPrinciples": ["デザイン原則を配列で"],
    "interactions": ["必要なインタラクションを配列で"]
  },
  "technicalSpecs": {
    "responsive": true/false,
    "accessibility": "アクセシビリティ基準",
    "browserSupport": ["対応ブラウザを配列で"],
    "frameworks": ["使用する技術・フレームワークを配列で"]
  }
}

考慮事項:
1. ユーザーが明示的に述べていない重要な要素も推測して補完してください
2. 業界のベストプラクティスを適用してください
3. モバイルファーストアプローチを考慮してください
4. アクセシビリティ要件（WCAG 2.1）を含めてください`;
};

export const generateQuestionsTemplate = (expandedPrompt) => {
  return `以下の拡張された要件仕様を分析し、ユーザーに確認すべき重要な質問を生成してください。

要件仕様:
${JSON.stringify(expandedPrompt, null, 2)}

質問は以下の形式のJSON配列で回答してください:
[
  {
    "id": "q1",
    "question": "質問文",
    "type": "single-choice または multi-choice",
    "options": [
      {
        "id": "opt1",
        "label": "選択肢のラベル",
        "value": "値"
      }
    ],
    "priority": "high/medium/low",
    "required": true/false,
    "impact": "この質問の回答が影響する領域の説明"
  }
]

質問生成のガイドライン:
1. 曖昧な部分や複数の解釈が可能な部分を明確化する質問
2. ユーザーの優先順位を確認する質問
3. 技術的な選択肢に関する質問
4. 5-8個程度の質問に絞る
5. 優先度の高い質問から並べる`;
};

export const generatePrototypeTemplate = (refinedSpec) => {
  return `あなたは優秀なフロントエンド開発者です。以下の要件仕様に基づいて、実用的なHTMLプロトタイプを生成してください。

要件仕様:
${JSON.stringify(refinedSpec, null, 2)}

以下の形式のJSONで回答してください:
{
  "html": "完全なHTML文書",
  "css": "スタイルシート",
  "javascript": "インタラクティブ機能のJavaScript",
  "explanation": "実装の説明"
}

実装要件:
1. 完全に機能するHTMLプロトタイプを作成
2. レスポンシブデザインを実装
3. アクセシビリティ要件を満たす（ARIA属性、セマンティックHTML）
4. モダンなCSSを使用（Grid、Flexbox）
5. 基本的なインタラクションを実装
6. プレースホルダーコンテンツを適切に配置
7. カラースキームとタイポグラフィを統一
8. ローディング状態やエラー状態も考慮`;
};

export const analyzePrototypeTemplate = (generatedCode, requirements) => {
  return `以下の生成されたプロトタイプコードを分析し、品質評価とフィードバックを提供してください。

要件:
${JSON.stringify(requirements, null, 2)}

生成されたコード:
HTML: ${generatedCode.html}
CSS: ${generatedCode.css}
JavaScript: ${generatedCode.javascript}

以下の形式のJSONで回答してください:
{
  "qualityScores": {
    "accessibility": 0-100,
    "responsiveness": 0-100,
    "codeQuality": 0-100,
    "designConsistency": 0-100
  },
  "strengths": ["良い点を配列で"],
  "improvements": [
    {
      "area": "改善領域",
      "suggestion": "具体的な改善提案",
      "priority": "high/medium/low"
    }
  ],
  "accessibilityIssues": ["アクセシビリティの問題点"],
  "performanceConsiderations": ["パフォーマンスに関する考慮事項"]
}`;
};

export const refineBasedOnFeedbackTemplate = (originalCode, feedback) => {
  return `以下のフィードバックに基づいて、プロトタイプを改善してください。

元のコード:
${JSON.stringify(originalCode, null, 2)}

フィードバック:
${feedback}

改善版のコードを以下の形式のJSONで回答してください:
{
  "html": "改善されたHTML",
  "css": "改善されたCSS",
  "javascript": "改善されたJavaScript",
  "changes": ["実施した変更点のリスト"]
}`;
};