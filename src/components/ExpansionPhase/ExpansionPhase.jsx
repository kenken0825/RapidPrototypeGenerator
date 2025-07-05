import React, { useState } from 'react';
import { expandPrompt } from '../../services/claudeService';
import './ExpansionPhase.css';

const ExpansionPhase = ({ inputData, onNext }) => {
  const [isExpanding, setIsExpanding] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(null);
  const [error, setError] = useState(null);

  const handleExpand = async () => {
    setIsExpanding(true);
    setError(null);

    try {
      // Claude APIを使用してプロンプトを拡張
      const expanded = await expandPrompt(inputData);
      
      setExpandedPrompt(expanded);
      setEditedPrompt(expanded);
    } catch (err) {
      console.error('Expansion Error:', err);
      setError(err.message || 'プロンプトの拡張中にエラーが発生しました');
    } finally {
      setIsExpanding(false);
    }
  };

  // ヘルパー関数（実際のAI処理をシミュレート）
  const extractTitle = (idea) => {
    if (idea.includes('学習プラットフォーム')) return 'オンライン学習プラットフォーム ダッシュボード';
    if (idea.includes('EC')) return 'ECサイト管理ダッシュボード';
    return 'プロトタイプアプリケーション';
  };

  const identifyDomain = (idea) => {
    if (idea.includes('学習') || idea.includes('教育')) return '教育';
    if (idea.includes('EC') || idea.includes('ショップ')) return 'EC';
    if (idea.includes('SNS')) return 'ソーシャル';
    return 'ビジネス';
  };

  const parseTargetUsers = (users) => {
    if (!users) return ['一般ユーザー'];
    return users.split(/[、,]/).map(u => u.trim()).filter(u => u);
  };

  const extractGoals = (idea) => {
    const goals = [];
    if (idea.includes('進捗')) goals.push('進捗管理');
    if (idea.includes('課題')) goals.push('タスク管理');
    if (idea.includes('成績')) goals.push('パフォーマンス分析');
    if (idea.includes('効率')) goals.push('効率化');
    return goals.length > 0 ? goals : ['ユーザビリティ向上'];
  };

  const extractPages = (idea) => {
    const pages = [];
    if (idea.includes('ダッシュボード')) {
      pages.push({
        name: 'ダッシュボード',
        purpose: '全体の状況を一覧表示',
        keyComponents: ['統計情報', 'グラフ', '通知エリア']
      });
    }
    if (idea.includes('進捗')) {
      pages.push({
        name: '進捗管理',
        purpose: '進捗状況の詳細表示',
        keyComponents: ['進捗グラフ', 'タイムライン', 'マイルストーン']
      });
    }
    return pages.length > 0 ? pages : [{
      name: 'メインページ',
      purpose: '主要機能の提供',
      keyComponents: ['ヘッダー', 'コンテンツエリア', 'フッター']
    }];
  };

  const deriveDesignPrinciples = (data) => {
    const principles = [];
    if (data.constraints?.includes('シンプル')) principles.push('シンプルさ');
    if (data.constraints?.includes('スマホ') || data.constraints?.includes('モバイル')) {
      principles.push('モバイルファースト');
    }
    principles.push('直感的操作', '情報の視認性');
    return principles;
  };

  const identifyInteractions = (idea) => {
    const interactions = [];
    if (idea.includes('フィルタ')) interactions.push('フィルタリング');
    if (idea.includes('検索')) interactions.push('検索機能');
    if (idea.includes('リアルタイム')) interactions.push('リアルタイム更新');
    interactions.push('ドリルダウン');
    return interactions;
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    setExpandedPrompt(editedPrompt);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedPrompt(expandedPrompt);
    setEditMode(false);
  };

  const handleFieldChange = (path, value) => {
    const pathArray = path.split('.');
    setEditedPrompt(prev => {
      const newPrompt = JSON.parse(JSON.stringify(prev));
      let current = newPrompt;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current[pathArray[i]];
      }
      current[pathArray[pathArray.length - 1]] = value;
      return newPrompt;
    });
  };

  const handleNext = () => {
    onNext(expandedPrompt);
  };

  return (
    <div className="expansion-phase">
      <div className="phase-header">
        <h2>Phase 2: プロンプト拡張</h2>
        <p>入力されたアイデアを詳細な要件仕様に変換します</p>
      </div>

      <div className="input-summary">
        <h3>入力内容</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <strong>アイデア:</strong>
            <p>{inputData.idea}</p>
          </div>
          {inputData.targetUsers && (
            <div className="summary-item">
              <strong>ターゲットユーザー:</strong>
              <p>{inputData.targetUsers}</p>
            </div>
          )}
          {inputData.constraints && (
            <div className="summary-item">
              <strong>制約条件:</strong>
              <p>{inputData.constraints}</p>
            </div>
          )}
        </div>
      </div>

      {!expandedPrompt && !isExpanding && (
        <div className="action-area">
          <button className="expand-button" onClick={handleExpand}>
            プロンプトを拡張
          </button>
        </div>
      )}

      {isExpanding && (
        <div className="expanding-status">
          <div className="spinner"></div>
          <p>拡張中...</p>
          <div className="progress-steps">
            <div className="step active">コンテキスト分析中...</div>
            <div className="step">要件補完中...</div>
            <div className="step">技術仕様策定中...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleExpand}>再試行</button>
        </div>
      )}

      {expandedPrompt && (
        <div className="expanded-result">
          <div className="result-header">
            <h3>拡張結果</h3>
            {!editMode && (
              <button className="edit-button" onClick={handleEdit}>編集</button>
            )}
          </div>

          {editMode ? (
            <div className="edit-mode">
              <div className="edit-section">
                <h4>プロジェクト情報</h4>
                <div className="edit-field">
                  <label>タイトル</label>
                  <input
                    type="text"
                    value={editedPrompt.projectInfo.title}
                    onChange={(e) => handleFieldChange('projectInfo.title', e.target.value)}
                  />
                </div>
                <div className="edit-field">
                  <label>ドメイン</label>
                  <input
                    type="text"
                    value={editedPrompt.projectInfo.domain}
                    onChange={(e) => handleFieldChange('projectInfo.domain', e.target.value)}
                  />
                </div>
              </div>

              <div className="edit-actions">
                <button className="save-button" onClick={handleSave}>保存</button>
                <button className="cancel-button" onClick={handleCancel}>キャンセル</button>
              </div>
            </div>
          ) : (
            <div className="result-content">
              <div className="result-section">
                <h4>プロジェクト情報</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">タイトル:</span>
                    <span className="value">{expandedPrompt.projectInfo.title}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">ドメイン:</span>
                    <span className="value domain-tag" data-testid="domain-analysis">
                      {expandedPrompt.projectInfo.domain}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">ターゲットユーザー:</span>
                    <div className="tag-list">
                      {expandedPrompt.projectInfo.targetUsers.map((user, idx) => (
                        <span key={idx} className="tag">{user}</span>
                      ))}
                    </div>
                  </div>
                  <div className="info-item">
                    <span className="label">主要目標:</span>
                    <div className="tag-list">
                      {expandedPrompt.projectInfo.primaryGoals.map((goal, idx) => (
                        <span key={idx} className="tag primary">{goal}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="result-section">
                <h4>UI要件</h4>
                <div className="pages-list">
                  {expandedPrompt.uiRequirements.pages.map((page, idx) => (
                    <div key={idx} className="page-item">
                      <h5>{page.name}</h5>
                      <p className="purpose">{page.purpose}</p>
                      <div className="components">
                        {page.keyComponents.map((comp, cidx) => (
                          <span key={cidx} className="component-tag">{comp}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="principles">
                  <h5>デザイン原則</h5>
                  <div className="tag-list">
                    {expandedPrompt.uiRequirements.designPrinciples.map((principle, idx) => (
                      <span key={idx} className="tag">{principle}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="result-section">
                <h4>技術仕様</h4>
                <div className="tech-specs">
                  <div className="spec-item">
                    <span className="label">レスポンシブ対応:</span>
                    <span className="value" data-testid="responsive-indicator">
                      {expandedPrompt.technicalSpecs.responsive ? '対応' : '非対応'}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="label">アクセシビリティ:</span>
                    <span className="value">{expandedPrompt.technicalSpecs.accessibility}</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">対応ブラウザ:</span>
                    <div className="browser-list">
                      {expandedPrompt.technicalSpecs.browserSupport.map((browser, idx) => (
                        <span key={idx} className="browser-tag">{browser}</span>
                      ))}
                    </div>
                  </div>
                  <div className="spec-item">
                    <span className="label">使用技術:</span>
                    <div className="tech-list">
                      {expandedPrompt.technicalSpecs.frameworks.map((framework, idx) => (
                        <span key={idx} className="tech-tag">{framework}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!editMode && (
            <div className="phase-actions">
              <button 
                className="next-button" 
                onClick={handleNext}
                disabled={!expandedPrompt}
              >
                次のフェーズへ
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpansionPhase;