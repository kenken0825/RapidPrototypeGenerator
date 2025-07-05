import React, { useState } from 'react';
import './FeedbackPhase.css';

const FeedbackPhase = ({ prototype, onComplete, onNewProject }) => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [improvements, setImprovements] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSubmitFeedback = () => {
    // モック分析
    setShowAnalysis(true);
  };

  const handleComplete = () => {
    onComplete({
      prototype: prototype,
      feedback: {
        text: feedback,
        rating: rating,
        improvements: improvements
      }
    });
  };

  return (
    <div className="feedback-phase">
      <div className="phase-header">
        <h2>Phase 5: フィードバック収集</h2>
        <p>生成されたプロトタイプについてフィードバックをお聞かせください</p>
      </div>

      <div className="prototype-display">
        <h3>生成されたプロトタイプ</h3>
        <div className="prototype-preview">
          <p>プロトタイププレビューエリア</p>
        </div>
      </div>

      <div className="feedback-section">
        <div className="rating-section">
          <label>使いやすさの評価</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star ${star <= rating ? 'active' : ''}`}
                onClick={() => setRating(star)}
              >
                ★
              </button>
            ))}
          </div>
          <span className="rating-text">{rating}/5</span>
        </div>

        <div className="feedback-input">
          <label htmlFor="feedback-text">全体的なフィードバックを入力</label>
          <textarea
            id="feedback-text"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="プロトタイプの良い点、改善点など、ご自由にお書きください"
            rows={6}
          />
        </div>

        <button 
          className="submit-feedback-button"
          onClick={handleSubmitFeedback}
          disabled={!feedback}
        >
          フィードバックを送信
        </button>
      </div>

      {showAnalysis && (
        <div className="analysis-results">
          <h3>フィードバック分析結果</h3>
          <div className="analysis-content">
            <div className="score-section">
              <h4>ユーザビリティスコア</h4>
              <div className="scores">
                <div className="score-item">
                  <span>ナビゲーション: 85%</span>
                </div>
                <div className="score-item">
                  <span>コンテンツの明確さ: 92%</span>
                </div>
                <div className="score-item">
                  <span>視覚的階層: 78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="phase-actions">
        <button className="complete-button" onClick={handleComplete}>
          プロジェクトを完了
        </button>
        <button className="new-project-button" onClick={onNewProject}>
          新しいプロジェクト
        </button>
      </div>
    </div>
  );
};

export default FeedbackPhase;