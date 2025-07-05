import React, { useState } from 'react';
import { generatePrototype } from '../../services/claudeService';
import './GenerationPhase.css';

const GenerationPhase = ({ refinedSpec, onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('html');
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Claude APIを使用してプロトタイプを生成
      const code = await generatePrototype(refinedSpec);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Generation Error:', error);
      // エラー時はフォールバックコードを使用
      setGeneratedCode({
        html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>プロトタイプ</title>
</head>
<body>
  <h1>プロトタイプ生成エラー</h1>
  <p>${error.message}</p>
</body>
</html>`,
        css: `body { font-family: sans-serif; padding: 20px; }`,
        javascript: `console.log('Error:', '${error.message}');`
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    onNext({
      refinedSpec: refinedSpec,
      generatedCode: generatedCode
    });
  };

  return (
    <div className="generation-phase">
      <div className="phase-header">
        <h2>Phase 4: プロトタイプ生成</h2>
        <p>要件定義に基づいてHTMLプロトタイプを生成します</p>
      </div>

      {!generatedCode && !isGenerating && (
        <div className="generate-section">
          <button className="generate-button" onClick={handleGenerate}>
            プロトタイプを生成
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="generating-status">
          <div className="spinner"></div>
          <p>生成中...</p>
          <p className="sub-text">UI要素を分析中...</p>
        </div>
      )}

      {generatedCode && (
        <div className="generated-content">
          <div className="code-tabs">
            <button 
              className={activeTab === 'html' ? 'active' : ''}
              onClick={() => setActiveTab('html')}
              role="tab"
              aria-selected={activeTab === 'html'}
            >
              HTML
            </button>
            <button 
              className={activeTab === 'css' ? 'active' : ''}
              onClick={() => setActiveTab('css')}
              role="tab"
              aria-selected={activeTab === 'css'}
            >
              CSS
            </button>
            <button 
              className={activeTab === 'javascript' ? 'active' : ''}
              onClick={() => setActiveTab('javascript')}
              role="tab"
              aria-selected={activeTab === 'javascript'}
            >
              JavaScript
            </button>
          </div>

          <div className="code-display">
            <pre>
              <code>{generatedCode[activeTab]}</code>
            </pre>
          </div>

          <div className="generation-actions">
            <button className="preview-button" onClick={() => setShowPreview(!showPreview)}>
              プレビュー
            </button>
            <button className="next-button" onClick={handleNext}>
              次のフェーズへ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationPhase;