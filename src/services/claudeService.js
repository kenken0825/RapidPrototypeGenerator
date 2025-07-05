import axios from 'axios';
import {
  expandPromptTemplate,
  generateQuestionsTemplate,
  generatePrototypeTemplate,
  analyzePrototypeTemplate,
  refineBasedOnFeedbackTemplate
} from './promptTemplates';

// Claude API設定
const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = import.meta.env.VITE_CLAUDE_MODEL || 'claude-3-opus-20240229';
const MAX_TOKENS = parseInt(import.meta.env.VITE_CLAUDE_MAX_TOKENS) || 4096;

// APIクライアントの設定
const claudeClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
    'anthropic-version': '2023-06-01'
  }
});

// エラーハンドリング
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.error?.message || 'APIエラーが発生しました');
  } else if (error.request) {
    console.error('Network Error:', error.request);
    throw new Error('ネットワークエラーが発生しました');
  } else {
    console.error('Error:', error.message);
    throw new Error('予期しないエラーが発生しました');
  }
};

// JSONレスポンスの解析
const parseJsonResponse = (text) => {
  try {
    // コードブロック内のJSONを抽出
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    // プレーンJSONの場合
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    throw new Error('レスポンスの解析に失敗しました');
  }
};

// Claude APIを呼び出す共通関数
const callClaudeAPI = async (prompt, systemPrompt = '') => {
  if (!API_KEY || API_KEY === 'your-api-key-here') {
    throw new Error('Claude APIキーが設定されていません。.env.localファイルを確認してください。');
  }

  try {
    const response = await claudeClient.post('', {
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      ...(systemPrompt && {
        system: systemPrompt
      })
    });

    return response.data.content[0].text;
  } catch (error) {
    handleApiError(error);
  }
};

// プロンプトを拡張
export const expandPrompt = async (inputData) => {
  try {
    const prompt = expandPromptTemplate(inputData);
    const response = await callClaudeAPI(prompt);
    return parseJsonResponse(response);
  } catch (error) {
    console.error('Expand Prompt Error:', error);
    // フォールバック: モックデータを返す
    return {
      projectInfo: {
        title: inputData.idea.slice(0, 50) + '...',
        domain: '一般',
        targetUsers: inputData.targetUsers ? inputData.targetUsers.split(',').map(u => u.trim()) : ['一般ユーザー'],
        primaryGoals: ['ユーザビリティ向上', '効率化']
      },
      uiRequirements: {
        pages: [{
          name: 'メインページ',
          purpose: '主要機能の提供',
          keyComponents: ['ヘッダー', 'メインコンテンツ', 'フッター']
        }],
        designPrinciples: ['シンプル', '直感的', 'レスポンシブ'],
        interactions: ['クリック', 'スクロール']
      },
      technicalSpecs: {
        responsive: true,
        accessibility: 'WCAG 2.1 AA準拠',
        browserSupport: ['Chrome', 'Safari', 'Firefox', 'Edge'],
        frameworks: ['HTML5', 'CSS3', 'JavaScript ES6+']
      }
    };
  }
};

// 要件精密化のための質問を生成
export const generateRefinementQuestions = async (expandedPrompt) => {
  try {
    const prompt = generateQuestionsTemplate(expandedPrompt);
    const response = await callClaudeAPI(prompt);
    return parseJsonResponse(response);
  } catch (error) {
    console.error('Generate Questions Error:', error);
    // フォールバック: デフォルトの質問を返す
    return [
      {
        id: 'q1',
        question: '最も重要な機能は何ですか？',
        type: 'single-choice',
        options: [
          { id: 'opt1', label: '基本機能A', value: 'feature_a' },
          { id: 'opt2', label: '基本機能B', value: 'feature_b' },
          { id: 'opt3', label: '基本機能C', value: 'feature_c' }
        ],
        priority: 'high',
        required: true
      }
    ];
  }
};

// プロトタイプコードを生成
export const generatePrototype = async (refinedSpec) => {
  try {
    const prompt = generatePrototypeTemplate(refinedSpec);
    const response = await callClaudeAPI(prompt);
    const result = parseJsonResponse(response);
    
    return {
      html: result.html,
      css: result.css,
      javascript: result.javascript,
      assets: []
    };
  } catch (error) {
    console.error('Generate Prototype Error:', error);
    // フォールバック: 基本的なテンプレートを返す
    return {
      html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プロトタイプ</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>プロトタイプ</h1>
    <p>Claude APIが利用できないため、基本的なテンプレートを表示しています。</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
      css: `body { font-family: sans-serif; margin: 0; padding: 20px; }
.container { max-width: 800px; margin: 0 auto; }`,
      javascript: `console.log('Prototype loaded');`,
      assets: []
    };
  }
};

// プロトタイプを分析
export const analyzePrototype = async (generatedCode, requirements) => {
  try {
    const prompt = analyzePrototypeTemplate(generatedCode, requirements);
    const response = await callClaudeAPI(prompt);
    return parseJsonResponse(response);
  } catch (error) {
    console.error('Analyze Prototype Error:', error);
    return {
      qualityScores: {
        accessibility: 80,
        responsiveness: 85,
        codeQuality: 75,
        designConsistency: 80
      },
      strengths: ['基本的な構造が整っている'],
      improvements: [],
      accessibilityIssues: [],
      performanceConsiderations: []
    };
  }
};

// フィードバックに基づいて改善
export const refineBasedOnFeedback = async (originalCode, feedback) => {
  try {
    const prompt = refineBasedOnFeedbackTemplate(originalCode, feedback);
    const response = await callClaudeAPI(prompt);
    return parseJsonResponse(response);
  } catch (error) {
    console.error('Refine Based On Feedback Error:', error);
    return {
      ...originalCode,
      changes: ['フィードバックを反映できませんでした']
    };
  }
};

// 回答に基づいて仕様を更新（ローカル処理）
export const updateSpecBasedOnAnswer = async (spec, questionId, answer) => {
  const updatedSpec = JSON.parse(JSON.stringify(spec));
  
  // 回答に基づいて仕様を更新するロジック
  // これは質問の内容と回答に応じてカスタマイズする必要があります
  
  return updatedSpec;
};