import React, { useState, useEffect } from 'react';
import { generateRefinementQuestions } from '../../services/claudeService';
import './RefinementPhase.css';

const RefinementPhase = ({ expandedPrompt, onNext }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentSpec, setCurrentSpec] = useState(expandedPrompt);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    generateQuestions();
  }, []);

  const generateQuestions = async () => {
    setIsLoading(true);
    
    try {
      // Claude APIを使用して質問を生成
      const generatedQuestions = await generateRefinementQuestions(expandedPrompt);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Generate Questions Error:', error);
      // エラーメッセージを表示するか、フォールバックの質問を使用
      setQuestions([
        {
          id: 'q1',
          question: '最も重要な機能は何ですか？',
          type: 'single-choice',
          options: [
            { id: 'opt1', label: '機能A', value: 'feature_a' },
            { id: 'opt2', label: '機能B', value: 'feature_b' },
            { id: 'opt3', label: '機能C', value: 'feature_c' }
          ],
          priority: 'high',
          required: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // リアルタイムで仕様を更新
    updateSpec(questionId, value);
  };

  const handleMultiAnswer = (questionId, optionValue, checked) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers;
    
    if (checked) {
      newAnswers = [...currentAnswers, optionValue];
    } else {
      newAnswers = currentAnswers.filter(v => v !== optionValue);
    }
    
    setAnswers({ ...answers, [questionId]: newAnswers });
    updateSpec(questionId, newAnswers);
  };

  const updateSpec = (questionId, value) => {
    // 回答に基づいて仕様を更新（簡略化版）
    const newSpec = { ...currentSpec };
    
    if (questionId === 'q1') {
      // 優先情報に基づいてUIを調整
      if (value === 'pending_assignments') {
        newSpec.uiRequirements.pages[0].keyComponents.push('課題優先度表示');
      }
    }
    
    if (questionId === 'q3' && Array.isArray(value)) {
      // 追加機能を仕様に反映
      if (value.includes('dark_mode')) {
        newSpec.uiRequirements.designPrinciples.push('ダークモード対応');
      }
    }
    
    setCurrentSpec(newSpec);
  };

  const isQuestionAnswered = (question) => {
    if (question.type === 'multi-choice') {
      return answers[question.id] && answers[question.id].length > 0;
    }
    return !!answers[question.id];
  };

  const canProceed = () => {
    const requiredQuestions = questions.filter(q => q.required);
    return requiredQuestions.every(q => isQuestionAnswered(q));
  };

  const getAnsweredCount = () => {
    return questions.filter(q => isQuestionAnswered(q)).length;
  };

  const handleSkip = (questionId) => {
    setAnswers({ ...answers, [questionId]: 'skipped' });
  };

  const handleNext = () => {
    onNext({
      refinedSpec: currentSpec,
      answers: answers
    });
  };

  if (isLoading) {
    return (
      <div className="refinement-phase loading">
        <div className="spinner"></div>
        <p>質問を生成中...</p>
      </div>
    );
  }

  return (
    <div className="refinement-phase">
      <div className="phase-header">
        <h2>Phase 3: 要件精密化</h2>
        <p>いくつかの質問に答えて、要件をより詳細に定義しましょう</p>
      </div>

      <div className="progress-info">
        <p>{getAnsweredCount()} / {questions.length} 質問に回答済み</p>
        <div className="progress-bar-small">
          <div 
            className="progress-fill-small" 
            style={{ width: `${(getAnsweredCount() / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="questions-container">
        {questions.map((question) => (
          <div 
            key={question.id} 
            className={`question-card ${answers[question.id] === 'skipped' ? 'skipped' : ''}`}
            data-testid={`question-${question.id}`}
            role="group"
            aria-label={`質問: ${question.question}`}
          >
            <div className="question-header">
              <h3>{question.question}</h3>
              {question.required && <span className="required-badge">必須</span>}
              {!question.required && !isQuestionAnswered(question) && (
                <button 
                  className="skip-button" 
                  onClick={() => handleSkip(question.id)}
                >
                  スキップ
                </button>
              )}
            </div>

            {question.type === 'single-choice' && (
              <div className="options-list">
                {question.options.map((option) => (
                  <label key={option.id} className="option-label">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswer(question.id, option.value)}
                    />
                    <span className="option-text">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'multi-choice' && (
              <div className="options-list">
                {question.options.map((option) => (
                  <label key={option.id} className="option-label">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={answers[question.id]?.includes(option.value) || false}
                      onChange={(e) => handleMultiAnswer(question.id, option.value, e.target.checked)}
                    />
                    <span className="option-text">{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {isQuestionAnswered(question) && question.id === 'q3' && 
             answers[question.id].length >= 3 && (
              <div className="warning-message">
                注意: 多くの機能を追加するとパフォーマンスに影響する可能性があります
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="change-indicators">
        {answers.q1 === 'pending_assignments' && (
          <div className="change-indicator" data-testid="change-indicator">
            <span className="icon">✨</span>
            <span>課題優先度表示機能が追加されます</span>
          </div>
        )}
        {answers.q3?.includes('dark_mode') && (
          <div className="change-indicator" data-testid="change-indicator">
            <span className="icon">🌙</span>
            <span>ダークモード機能が追加されます</span>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button 
          className="preview-button" 
          onClick={() => setShowPreview(!showPreview)}
        >
          プレビュー
        </button>
        <button 
          className="next-button" 
          onClick={handleNext}
          disabled={!canProceed()}
        >
          次のフェーズへ
        </button>
      </div>

      {showPreview && (
        <div className="preview-modal" role="dialog" aria-label="仕様プレビュー">
          <div className="modal-content">
            <div className="modal-header">
              <h3>仕様プレビュー</h3>
              <button onClick={() => setShowPreview(false)}>×</button>
            </div>
            <div className="modal-body">
              <pre>{JSON.stringify(currentSpec, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefinementPhase;