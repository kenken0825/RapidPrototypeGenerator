import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackPhase from './FeedbackPhase';
import * as feedbackService from '../../services/feedbackService';

jest.mock('../../services/feedbackService');

describe('Phase 5: フィードバック収集システム', () => {
  const mockGeneratedPrototype = {
    refinedSpec: {
      projectInfo: {
        title: 'オンライン学習プラットフォーム ダッシュボード'
      }
    },
    generatedCode: {
      html: '<div class="dashboard">...</div>',
      css: '.dashboard { ... }',
      javascript: 'console.log("Dashboard");'
    }
  };

  const mockFeedbackAnalysis = {
    usabilityScore: {
      navigation: 0.85,
      contentClarity: 0.92,
      visualHierarchy: 0.78
    },
    commonRequests: [
      'フォントサイズを大きく',
      'メニューの位置変更',
      'カラーコントラスト調整'
    ],
    priorityImprovements: [
      {
        area: 'ナビゲーション',
        impact: 'high',
        effort: 'medium',
        suggestion: 'メガメニュー導入'
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ホットスポット注釈機能', () => {
    test('ホットスポット追加モードが有効化できる', () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const addHotspotButton = screen.getByRole('button', { name: /ホットスポットを追加/i });
      expect(addHotspotButton).toBeInTheDocument();
    });

    test('クリックでホットスポットが追加される', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /ホットスポットを追加/i }));
      
      const prototypeArea = screen.getByTestId('prototype-preview');
      fireEvent.click(prototypeArea, { clientX: 100, clientY: 100 });
      
      expect(screen.getByTestId('hotspot-marker')).toBeInTheDocument();
    });

    test('ホットスポットに説明を追加できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /ホットスポットを追加/i }));
      
      const prototypeArea = screen.getByTestId('prototype-preview');
      fireEvent.click(prototypeArea, { clientX: 100, clientY: 100 });
      
      const descriptionInput = screen.getByPlaceholderText(/説明を入力/i);
      await userEvent.type(descriptionInput, 'このエリアは学習進捗を表示します');
      
      await userEvent.click(screen.getByRole('button', { name: /保存/i }));
      
      expect(screen.getByText(/このエリアは学習進捗を表示します/)).toBeInTheDocument();
    });

    test('ホットスポットに代替案を提示できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /ホットスポットを追加/i }));
      
      const prototypeArea = screen.getByTestId('prototype-preview');
      fireEvent.click(prototypeArea, { clientX: 100, clientY: 100 });
      
      await userEvent.click(screen.getByRole('button', { name: /代替案を追加/i }));
      
      const alternativeInput = screen.getByPlaceholderText(/代替案を入力/i);
      await userEvent.type(alternativeInput, 'グラフの代わりに数値表示も可能');
      
      await userEvent.click(screen.getByRole('button', { name: /追加/i }));
      
      expect(screen.getByText(/グラフの代わりに数値表示も可能/)).toBeInTheDocument();
    });

    test('ホットスポットを削除できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /ホットスポットを追加/i }));
      
      const prototypeArea = screen.getByTestId('prototype-preview');
      fireEvent.click(prototypeArea, { clientX: 100, clientY: 100 });
      
      const deleteButton = screen.getByRole('button', { name: /削除/i });
      await userEvent.click(deleteButton);
      
      expect(screen.queryByTestId('hotspot-marker')).not.toBeInTheDocument();
    });
  });

  describe('インライン編集モード', () => {
    test('編集モードを有効化できる', () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const editModeButton = screen.getByRole('button', { name: /編集モード/i });
      expect(editModeButton).toBeInTheDocument();
    });

    test('テキストをダブルクリックで編集できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /編集モード/i }));
      
      const textElement = screen.getByTestId('editable-text');
      await userEvent.dblClick(textElement);
      
      const input = screen.getByRole('textbox');
      await userEvent.clear(input);
      await userEvent.type(input, '新しいテキスト');
      await userEvent.keyboard('{Enter}');
      
      expect(screen.getByText(/新しいテキスト/)).toBeInTheDocument();
    });

    test('色を変更できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /編集モード/i }));
      
      const element = screen.getByTestId('editable-element');
      await userEvent.click(element);
      
      const colorPicker = screen.getByLabelText(/色を選択/i);
      fireEvent.change(colorPicker, { target: { value: '#ff0000' } });
      
      expect(element).toHaveStyle('color: #ff0000');
    });

    test('フォントサイズを変更できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /編集モード/i }));
      
      const element = screen.getByTestId('editable-element');
      await userEvent.click(element);
      
      const sizeSlider = screen.getByLabelText(/フォントサイズ/i);
      fireEvent.change(sizeSlider, { target: { value: '20' } });
      
      expect(element).toHaveStyle('font-size: 20px');
    });

    test('ドラッグ&ドロップでレイアウトを変更できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /編集モード/i }));
      
      const draggableElement = screen.getByTestId('draggable-element');
      const dropZone = screen.getByTestId('drop-zone-2');
      
      fireEvent.dragStart(draggableElement);
      fireEvent.dragOver(dropZone);
      fireEvent.drop(dropZone);
      
      expect(within(dropZone).getByTestId('draggable-element')).toBeInTheDocument();
    });
  });

  describe('フィードバック入力', () => {
    test('全体的なフィードバックを入力できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const feedbackTextarea = screen.getByPlaceholderText(/全体的なフィードバックを入力/i);
      await userEvent.type(feedbackTextarea, 'とても使いやすそうですが、色のコントラストをもう少し強くしてください');
      
      expect(feedbackTextarea).toHaveValue('とても使いやすそうですが、色のコントラストをもう少し強くしてください');
    });

    test('評価スコアを設定できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const usabilityRating = screen.getByLabelText(/使いやすさ/i);
      fireEvent.change(usabilityRating, { target: { value: '4' } });
      
      expect(screen.getByText(/4\/5/)).toBeInTheDocument();
    });

    test('カテゴリー別フィードバックを入力できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const navigationFeedback = screen.getByLabelText(/ナビゲーションについて/i);
      await userEvent.type(navigationFeedback, 'メニューの位置が分かりにくい');
      
      const visualFeedback = screen.getByLabelText(/ビジュアルデザインについて/i);
      await userEvent.type(visualFeedback, 'カラースキームは良い');
      
      expect(navigationFeedback).toHaveValue('メニューの位置が分かりにくい');
      expect(visualFeedback).toHaveValue('カラースキームは良い');
    });

    test('改善提案を追加できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.click(screen.getByRole('button', { name: /改善提案を追加/i }));
      
      const suggestionInput = screen.getByPlaceholderText(/改善提案を入力/i);
      await userEvent.type(suggestionInput, 'ダッシュボードにウィジェットの並び替え機能を追加');
      
      await userEvent.click(screen.getByRole('button', { name: /提案を追加/i }));
      
      expect(screen.getByText(/ダッシュボードにウィジェットの並び替え機能を追加/)).toBeInTheDocument();
    });
  });

  describe('フィードバック分析', () => {
    test('フィードバックを送信できる', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const feedbackTextarea = screen.getByPlaceholderText(/全体的なフィードバックを入力/i);
      await userEvent.type(feedbackTextarea, 'テストフィードバック');
      
      const submitButton = screen.getByRole('button', { name: /フィードバックを送信/i });
      await userEvent.click(submitButton);
      
      expect(feedbackService.analyzeFeedback).toHaveBeenCalled();
    });

    test('分析結果が表示される', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/ユーザビリティスコア/)).toBeInTheDocument();
        expect(screen.getByText(/ナビゲーション: 85%/)).toBeInTheDocument();
        expect(screen.getByText(/コンテンツの明確さ: 92%/)).toBeInTheDocument();
        expect(screen.getByText(/視覚的階層: 78%/)).toBeInTheDocument();
      });
    });

    test('共通の要望が表示される', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/フォントサイズを大きく/)).toBeInTheDocument();
        expect(screen.getByText(/メニューの位置変更/)).toBeInTheDocument();
        expect(screen.getByText(/カラーコントラスト調整/)).toBeInTheDocument();
      });
    });

    test('優先改善項目が表示される', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        const improvementCard = screen.getByTestId('improvement-navigation');
        expect(within(improvementCard).getByText(/ナビゲーション/)).toBeInTheDocument();
        expect(within(improvementCard).getByText(/影響度: high/)).toBeInTheDocument();
        expect(within(improvementCard).getByText(/メガメニュー導入/)).toBeInTheDocument();
      });
    });
  });

  describe('改善版の生成', () => {
    test('フィードバックに基づいて改善版を生成できる', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        const improveButton = screen.getByRole('button', { name: /改善版を生成/i });
        expect(improveButton).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /改善版を生成/i }));
      
      expect(screen.getByText(/改善版を生成中.../)).toBeInTheDocument();
    });

    test('改善前後の比較ができる', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      feedbackService.generateImprovedVersion.mockResolvedValue({
        html: '<div class="improved-dashboard">...</div>',
        css: '.improved-dashboard { ... }',
        javascript: 'console.log("Improved");'
      });
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /改善版を生成/i })).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /改善版を生成/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /比較表示/i })).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /比較表示/i }));
      
      expect(screen.getByText(/改善前/)).toBeInTheDocument();
      expect(screen.getByText(/改善後/)).toBeInTheDocument();
    });
  });

  describe('エクスポート機能', () => {
    test('フィードバックレポートをエクスポートできる', async () => {
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      feedbackService.exportReport.mockResolvedValue(true);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        const exportButton = screen.getByRole('button', { name: /レポートをエクスポート/i });
        expect(exportButton).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /レポートをエクスポート/i }));
      
      expect(feedbackService.exportReport).toHaveBeenCalled();
    });

    test('フィードバック履歴を保存できる', async () => {
      render(<FeedbackPhase prototype={mockGeneratedPrototype} />);
      
      const saveButton = screen.getByRole('button', { name: /フィードバックを保存/i });
      await userEvent.click(saveButton);
      
      expect(screen.getByText(/フィードバックが保存されました/)).toBeInTheDocument();
    });
  });

  describe('完了処理', () => {
    test('プロジェクトを完了できる', async () => {
      const onComplete = jest.fn();
      feedbackService.analyzeFeedback.mockResolvedValue(mockFeedbackAnalysis);
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} onComplete={onComplete} />);
      
      await userEvent.type(screen.getByPlaceholderText(/全体的なフィードバックを入力/i), 'test');
      await userEvent.click(screen.getByRole('button', { name: /フィードバックを送信/i }));
      
      await waitFor(() => {
        const completeButton = screen.getByRole('button', { name: /プロジェクトを完了/i });
        expect(completeButton).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /プロジェクトを完了/i }));
      
      expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({
        prototype: mockGeneratedPrototype,
        feedback: expect.any(Object),
        analysis: mockFeedbackAnalysis
      }));
    });

    test('新しいプロジェクトを開始できる', async () => {
      const onNewProject = jest.fn();
      
      render(<FeedbackPhase prototype={mockGeneratedPrototype} onNewProject={onNewProject} />);
      
      await userEvent.click(screen.getByRole('button', { name: /新しいプロジェクト/i }));
      
      expect(onNewProject).toHaveBeenCalled();
    });
  });
});