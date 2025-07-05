import React, { useState, useEffect } from 'react';
import './InputPhase.css';

const InputPhase = ({ onSubmit, onAutoSave }) => {
  const [formData, setFormData] = useState({
    idea: '',
    targetUsers: '',
    constraints: '',
    referenceUrls: [],
    uploadedImages: [],
    language: 'ja'
  });
  
  const [errors, setErrors] = useState({});
  const [currentUrl, setCurrentUrl] = useState('');
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // 自動保存
    if (onAutoSave) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      const timer = setTimeout(() => {
        onAutoSave(formData);
      }, 2000);
      setAutoSaveTimer(timer);
    }

    // エラークリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            name: file.name,
            data: reader.result,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, ...images]
      }));
    });
  };

  const handleAddUrl = () => {
    if (currentUrl && isValidUrl(currentUrl)) {
      setFormData(prev => ({
        ...prev,
        referenceUrls: [...prev.referenceUrls, currentUrl]
      }));
      setCurrentUrl('');
    } else {
      setErrors(prev => ({
        ...prev,
        url: '有効なURLを入力してください'
      }));
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.idea.trim()) {
      newErrors.idea = 'アイデアの説明は必須です';
    } else if (formData.idea.length < 20) {
      newErrors.idea = 'もう少し詳しく説明してください（20文字以上）';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const removeUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      referenceUrls: prev.referenceUrls.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="input-phase">
      <div className="phase-header">
        <h2>Phase 1: アイデア入力</h2>
        <p>あなたのアイデアを教えてください。簡単な説明から始めましょう。</p>
      </div>

      <form onSubmit={handleSubmit} aria-label="アイデア入力フォーム">
        <div className="language-toggle">
          <button
            type="button"
            className={formData.language === 'ja' ? 'active' : ''}
            onClick={() => handleInputChange('language', 'ja')}
          >
            日本語
          </button>
          <button
            type="button"
            className={formData.language === 'en' ? 'active' : ''}
            onClick={() => handleInputChange('language', 'en')}
          >
            English
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="idea">
            {formData.language === 'ja' ? 'アイデアの説明' : 'Idea Description'}
          </label>
          <textarea
            id="idea"
            className={errors.idea ? 'error' : ''}
            value={formData.idea}
            onChange={(e) => handleInputChange('idea', e.target.value)}
            placeholder={formData.language === 'ja' 
              ? "例: オンライン学習プラットフォームのダッシュボードを作りたい。学習進捗、課題提出、成績確認ができるもの。"
              : "Example: I want to create a dashboard for an online learning platform with progress tracking, assignment submission, and grade checking."
            }
            rows={6}
            aria-describedby="idea-help"
          />
          {errors.idea && <span className="error-message">{errors.idea}</span>}
          <small id="idea-help">
            {formData.language === 'ja' 
              ? '作りたいものを自由に説明してください'
              : 'Describe what you want to create freely'
            }
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="targetUsers">
            {formData.language === 'ja' ? 'ターゲットユーザー' : 'Target Users'}
          </label>
          <input
            type="text"
            id="targetUsers"
            value={formData.targetUsers}
            onChange={(e) => handleInputChange('targetUsers', e.target.value)}
            placeholder={formData.language === 'ja' 
              ? "例: 大学生、社会人学習者"
              : "Example: University students, adult learners"
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="constraints">
            {formData.language === 'ja' ? '制約条件' : 'Constraints'}
          </label>
          <textarea
            id="constraints"
            value={formData.constraints}
            onChange={(e) => handleInputChange('constraints', e.target.value)}
            placeholder={formData.language === 'ja' 
              ? "例: スマホ対応必須、シンプルなUI"
              : "Example: Must be mobile-friendly, simple UI"
            }
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>
            {formData.language === 'ja' ? '参考URL（オプション）' : 'Reference URLs (Optional)'}
          </label>
          <div className="url-input-group">
            <input
              type="url"
              value={currentUrl}
              onChange={(e) => {
                setCurrentUrl(e.target.value);
                if (errors.url) {
                  setErrors(prev => ({ ...prev, url: '' }));
                }
              }}
              onBlur={() => {
                if (currentUrl && !isValidUrl(currentUrl)) {
                  setErrors(prev => ({ ...prev, url: '有効なURLを入力してください' }));
                }
              }}
              placeholder="https://example.com"
              className={errors.url ? 'error' : (currentUrl && isValidUrl(currentUrl) ? 'valid' : '')}
            />
            <button type="button" onClick={handleAddUrl}>
              追加
            </button>
          </div>
          {errors.url && <span className="error-message">{errors.url}</span>}
          
          {formData.referenceUrls.length > 0 && (
            <ul className="url-list">
              {formData.referenceUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                  <button type="button" onClick={() => removeUrl(index)}>×</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="imageUpload">
            {formData.language === 'ja' ? '画像をアップロード（オプション）' : 'Upload Images (Optional)'}
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          {formData.uploadedImages.length > 0 && (
            <div className="uploaded-images">
              <p>{formData.uploadedImages.length}個のファイルが選択されました</p>
              <div className="image-preview-grid">
                {formData.uploadedImages.map((image, index) => (
                  <div key={index} className="image-preview">
                    <img src={image.data} alt={image.name} />
                    <button type="button" onClick={() => removeImage(index)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            {formData.language === 'ja' ? '次へ' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputPhase;