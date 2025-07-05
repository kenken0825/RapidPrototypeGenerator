import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputPhase from './InputPhase';

describe('Phase 1: アイデア入力インターフェース', () => {
  describe('基本的な入力フォーム', () => {
    test('アイデア説明の入力フィールドが表示される', () => {
      render(<InputPhase />);
      const ideaInput = screen.getByLabelText(/アイデアの説明/i);
      expect(ideaInput).toBeInTheDocument();
      expect(ideaInput).toHaveAttribute('placeholder', expect.stringContaining('オンライン学習プラットフォーム'));
    });

    test('ターゲットユーザー情報の入力フィールドが表示される', () => {
      render(<InputPhase />);
      const targetUserInput = screen.getByLabelText(/ターゲットユーザー/i);
      expect(targetUserInput).toBeInTheDocument();
    });

    test('制約条件の入力フィールドが表示される', () => {
      render(<InputPhase />);
      const constraintsInput = screen.getByLabelText(/制約条件/i);
      expect(constraintsInput).toBeInTheDocument();
    });

    test('日本語と英語の切り替えが可能', async () => {
      render(<InputPhase />);
      const languageToggle = screen.getByRole('button', { name: /English/i });
      
      await userEvent.click(languageToggle);
      expect(screen.getByLabelText(/Idea Description/i)).toBeInTheDocument();
      
      const japaneseToggle = screen.getByRole('button', { name: /日本語/i });
      await userEvent.click(japaneseToggle);
      expect(screen.getByLabelText(/アイデアの説明/i)).toBeInTheDocument();
    });
  });

  describe('ファイルアップロード機能', () => {
    test('参考URL入力フィールドが存在する', () => {
      render(<InputPhase />);
      const urlInput = screen.getByLabelText(/参考URL/i);
      expect(urlInput).toBeInTheDocument();
      expect(urlInput).toHaveAttribute('type', 'url');
    });

    test('画像アップロードボタンが存在する', () => {
      render(<InputPhase />);
      const uploadButton = screen.getByLabelText(/画像をアップロード/i);
      expect(uploadButton).toBeInTheDocument();
      expect(uploadButton).toHaveAttribute('type', 'file');
      expect(uploadButton).toHaveAttribute('accept', 'image/*');
    });

    test('画像をアップロードできる', async () => {
      render(<InputPhase />);
      const file = new File(['hello'], 'hello.png', { type: 'image/png' });
      const input = screen.getByLabelText(/画像をアップロード/i);
      
      await userEvent.upload(input, file);
      
      expect(input.files[0]).toBe(file);
      expect(input.files).toHaveLength(1);
    });

    test('複数の画像をアップロードできる', async () => {
      render(<InputPhase />);
      const files = [
        new File(['hello1'], 'hello1.png', { type: 'image/png' }),
        new File(['hello2'], 'hello2.png', { type: 'image/png' }),
      ];
      const input = screen.getByLabelText(/画像をアップロード/i);
      
      await userEvent.upload(input, files);
      
      expect(input.files).toHaveLength(2);
      expect(screen.getByText(/2個のファイルが選択されました/i)).toBeInTheDocument();
    });
  });

  describe('入力検証', () => {
    test('アイデア説明が空の場合、エラーメッセージが表示される', async () => {
      render(<InputPhase />);
      const submitButton = screen.getByRole('button', { name: /次へ/i });
      
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/アイデアの説明は必須です/i)).toBeInTheDocument();
    });

    test('アイデア説明が短すぎる場合、警告が表示される', async () => {
      render(<InputPhase />);
      const ideaInput = screen.getByLabelText(/アイデアの説明/i);
      const submitButton = screen.getByRole('button', { name: /次へ/i });
      
      await userEvent.type(ideaInput, '短い説明');
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/もう少し詳しく説明してください/i)).toBeInTheDocument();
    });

    test('有効なURLが入力された場合、検証を通過する', async () => {
      render(<InputPhase />);
      const urlInput = screen.getByLabelText(/参考URL/i);
      
      await userEvent.type(urlInput, 'https://example.com');
      
      expect(urlInput).toHaveClass('valid');
    });

    test('無効なURLが入力された場合、エラーが表示される', async () => {
      render(<InputPhase />);
      const urlInput = screen.getByLabelText(/参考URL/i);
      
      await userEvent.type(urlInput, 'not-a-url');
      await userEvent.tab(); // フォーカスを外す
      
      expect(screen.getByText(/有効なURLを入力してください/i)).toBeInTheDocument();
    });
  });

  describe('データの保存と送信', () => {
    test('入力データが正しく保存される', async () => {
      const onSubmit = jest.fn();
      render(<InputPhase onSubmit={onSubmit} />);
      
      const ideaInput = screen.getByLabelText(/アイデアの説明/i);
      const targetUserInput = screen.getByLabelText(/ターゲットユーザー/i);
      const constraintsInput = screen.getByLabelText(/制約条件/i);
      const submitButton = screen.getByRole('button', { name: /次へ/i });
      
      await userEvent.type(ideaInput, 'オンライン学習プラットフォームのダッシュボードを作りたい');
      await userEvent.type(targetUserInput, '大学生、社会人学習者');
      await userEvent.type(constraintsInput, 'スマホ対応必須、シンプルなUI');
      await userEvent.click(submitButton);
      
      expect(onSubmit).toHaveBeenCalledWith({
        idea: 'オンライン学習プラットフォームのダッシュボードを作りたい',
        targetUsers: '大学生、社会人学習者',
        constraints: 'スマホ対応必須、シンプルなUI',
        referenceUrls: [],
        uploadedImages: [],
        language: 'ja'
      });
    });

    test('自動保存機能が動作する', async () => {
      jest.useFakeTimers();
      const onAutoSave = jest.fn();
      render(<InputPhase onAutoSave={onAutoSave} />);
      
      const ideaInput = screen.getByLabelText(/アイデアの説明/i);
      
      await userEvent.type(ideaInput, 'テスト入力');
      
      jest.advanceTimersByTime(2000); // 2秒待機
      
      expect(onAutoSave).toHaveBeenCalled();
      
      jest.useRealTimers();
    });
  });

  describe('アクセシビリティ', () => {
    test('すべての入力フィールドに適切なラベルがある', () => {
      render(<InputPhase />);
      
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });
    });

    test('キーボードナビゲーションが適切に動作する', async () => {
      render(<InputPhase />);
      
      const ideaInput = screen.getByLabelText(/アイデアの説明/i);
      const targetUserInput = screen.getByLabelText(/ターゲットユーザー/i);
      
      ideaInput.focus();
      expect(document.activeElement).toBe(ideaInput);
      
      await userEvent.tab();
      expect(document.activeElement).toBe(targetUserInput);
    });

    test('スクリーンリーダー用の説明が提供される', () => {
      render(<InputPhase />);
      
      expect(screen.getByRole('form')).toHaveAttribute('aria-label', 'アイデア入力フォーム');
      expect(screen.getByLabelText(/アイデアの説明/i)).toHaveAttribute('aria-describedby');
    });
  });

  describe('プログレスインジケーター', () => {
    test('現在のフェーズが表示される', () => {
      render(<InputPhase />);
      
      expect(screen.getByText(/Phase 1/i)).toBeInTheDocument();
      expect(screen.getByText(/アイデア入力/i)).toBeInTheDocument();
    });

    test('進捗バーが正しく表示される', () => {
      render(<InputPhase />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow', '20'); // 5フェーズ中の1番目
    });
  });
});