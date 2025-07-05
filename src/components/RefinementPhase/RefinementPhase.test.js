import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefinementPhase from './RefinementPhase';
import * as claudeService from '../../services/claudeService';

jest.mock('../../services/claudeService');

describe('Phase 3: インタラクティブ要件精密化', () => {
  const mockExpandedPrompt = {
    projectInfo: {
      title: 'オンライン学習プラットフォーム ダッシュボード',
      domain: '教育',
      targetUsers: ['大学生', '20-25歳'],
      primaryGoals: ['学習効率化', '進捗管理', '成績可視化']
    },
    uiRequirements: {
      pages: [{
        name: 'ダッシュボード',
        purpose: '学習状況の一覧表示',
        keyComponents: ['進捗グラフ', '課題リスト', '通知エリア']
      }],
      designPrinciples: ['直感的操作', '情報の視認性', 'モバイルファースト'],
      interactions: ['ドリルダウン', 'フィルタリング', 'リアルタイム更新']
    },
    technicalSpecs: {
      responsive: true,
      accessibility: 'WCAG 2.1 AA準拠',
      browserSupport: ['Chrome', 'Safari', 'Firefox', 'Edge'],
      frameworks: ['CSS Grid', 'Flexbox', 'JavaScript ES6+']
    }
  };

  const mockQuestions = [
    {
      id: 'q1',
      question: 'メインダッシュボードで最も重要な情報は何ですか？',
      type: 'single-choice',
      options: [
        { id: 'opt1', label: '今週の学習時間', value: 'weekly_study_time' },
        { id: 'opt2', label: '未提出の課題数', value: 'pending_assignments' },
        { id: 'opt3', label: '全体的な成績推移', value: 'grade_trends' },
        { id: 'opt4', label: '次回の予定', value: 'upcoming_events' }
      ],
      priority: 'high'
    },
    {
      id: 'q2',
      question: 'データ表示の形式はどちらを好みますか？',
      type: 'single-choice',
      options: [
        { id: 'opt1', label: 'グラフ重視（視覚的）', value: 'graph_focused' },
        { id: 'opt2', label: 'リスト重視（詳細情報）', value: 'list_focused' },
        { id: 'opt3', label: 'バランス型', value: 'balanced' }
      ],
      priority: 'medium'
    },
    {
      id: 'q3',
      question: '以下の追加機能から必要なものを選んでください',
      type: 'multi-choice',
      options: [
        { id: 'opt1', label: 'ダークモード', value: 'dark_mode' },
        { id: 'opt2', label: '通知設定', value: 'notification_settings' },
        { id: 'opt3', label: 'データエクスポート', value: 'data_export' },
        { id: 'opt4', label: 'カスタマイズ可能なウィジェット', value: 'custom_widgets' }
      ],
      priority: 'low'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('質問生成エンジン', () => {
    test('質問が自動生成される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(claudeService.generateRefinementQuestions).toHaveBeenCalledWith(mockExpandedPrompt);
        expect(screen.getByText(/メインダッシュボードで最も重要な情報は何ですか/)).toBeInTheDocument();
      });
    });

    test('優先度順に質問が表示される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const questions = screen.getAllByRole('group', { name: /質問/i });
        expect(questions[0]).toHaveTextContent('メインダッシュボードで最も重要な情報');
        expect(questions[1]).toHaveTextContent('データ表示の形式');
      });
    });

    test('質問の種類に応じた入力形式が表示される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        // 単一選択の質問
        const q1Options = screen.getAllByRole('radio');
        expect(q1Options).toHaveLength(4);
        
        // 複数選択の質問
        const q3Options = screen.getAllByRole('checkbox');
        expect(q3Options).toHaveLength(4);
      });
    });
  });

  describe('ユーザー回答の処理', () => {
    test('単一選択の回答が記録される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const option = screen.getByLabelText('未提出の課題数');
        expect(option).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('未提出の課題数'));
      
      expect(screen.getByLabelText('未提出の課題数')).toBeChecked();
    });

    test('複数選択の回答が記録される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('ダークモード')).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('ダークモード'));
      await userEvent.click(screen.getByLabelText('通知設定'));
      
      expect(screen.getByLabelText('ダークモード')).toBeChecked();
      expect(screen.getByLabelText('通知設定')).toBeChecked();
    });

    test('回答を変更できる', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('今週の学習時間')).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('今週の学習時間'));
      expect(screen.getByLabelText('今週の学習時間')).toBeChecked();
      
      await userEvent.click(screen.getByLabelText('未提出の課題数'));
      expect(screen.getByLabelText('今週の学習時間')).not.toBeChecked();
      expect(screen.getByLabelText('未提出の課題数')).toBeChecked();
    });
  });

  describe('リアルタイム仕様更新', () => {
    test('回答に基づいて仕様がリアルタイムで更新される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      claudeService.updateSpecBasedOnAnswer.mockResolvedValue({
        ...mockExpandedPrompt,
        uiRequirements: {
          ...mockExpandedPrompt.uiRequirements,
          keyComponents: [...mockExpandedPrompt.uiRequirements.pages[0].keyComponents, '課題優先度表示']
        }
      });
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('未提出の課題数')).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('未提出の課題数'));
      
      await waitFor(() => {
        expect(screen.getByText(/課題優先度表示/)).toBeInTheDocument();
      });
    });

    test('変更の影響が可視化される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('ダークモード')).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('ダークモード'));
      
      await waitFor(() => {
        const changeIndicator = screen.getByTestId('change-indicator');
        expect(changeIndicator).toHaveTextContent(/ダークモード機能が追加されます/);
      });
    });

    test('制約事項の自動チェックが行われる', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(screen.getAllByRole('checkbox')).toHaveLength(4);
      });
      
      // すべてのオプションを選択
      const checkboxes = screen.getAllByRole('checkbox');
      for (const checkbox of checkboxes) {
        await userEvent.click(checkbox);
      }
      
      await waitFor(() => {
        expect(screen.getByText(/注意: 多くの機能を追加するとパフォーマンスに影響する可能性があります/)).toBeInTheDocument();
      });
    });
  });

  describe('質問のスキップ機能', () => {
    test('任意の質問をスキップできる', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const skipButtons = screen.getAllByRole('button', { name: /スキップ/i });
        expect(skipButtons).toHaveLength(mockQuestions.length);
      });
      
      await userEvent.click(screen.getAllByRole('button', { name: /スキップ/i })[0]);
      
      expect(screen.getByTestId('question-q1')).toHaveClass('skipped');
    });

    test('必須質問はスキップできない', async () => {
      const questionsWithRequired = [
        { ...mockQuestions[0], required: true },
        ...mockQuestions.slice(1)
      ];
      claudeService.generateRefinementQuestions.mockResolvedValue(questionsWithRequired);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const firstQuestionContainer = screen.getByTestId('question-q1');
        const skipButton = within(firstQuestionContainer).queryByRole('button', { name: /スキップ/i });
        expect(skipButton).not.toBeInTheDocument();
      });
    });
  });

  describe('プレビュー機能', () => {
    test('現在の仕様のプレビューが表示される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const previewButton = screen.getByRole('button', { name: /プレビュー/i });
        expect(previewButton).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /プレビュー/i }));
      
      expect(screen.getByRole('dialog', { name: /仕様プレビュー/i })).toBeInTheDocument();
      expect(screen.getByText(/オンライン学習プラットフォーム ダッシュボード/)).toBeInTheDocument();
    });

    test('プレビューに最新の変更が反映される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('ダークモード')).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('ダークモード'));
      await userEvent.click(screen.getByRole('button', { name: /プレビュー/i }));
      
      const dialog = screen.getByRole('dialog');
      expect(within(dialog).getByText(/ダークモード/)).toBeInTheDocument();
    });
  });

  describe('完了と次フェーズへの遷移', () => {
    test('すべての必須質問に回答すると次へボタンが有効になる', async () => {
      const questionsWithRequired = [
        { ...mockQuestions[0], required: true },
        ...mockQuestions.slice(1)
      ];
      claudeService.generateRefinementQuestions.mockResolvedValue(questionsWithRequired);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /次のフェーズへ/i });
        expect(nextButton).toBeDisabled();
      });
      
      await userEvent.click(screen.getByLabelText('未提出の課題数'));
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /次のフェーズへ/i });
        expect(nextButton).not.toBeDisabled();
      });
    });

    test('精密化された仕様が次フェーズに渡される', async () => {
      const onNext = jest.fn();
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} onNext={onNext} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('未提出の課題数')).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('未提出の課題数'));
      await userEvent.click(screen.getByRole('button', { name: /次のフェーズへ/i }));
      
      expect(onNext).toHaveBeenCalledWith(expect.objectContaining({
        refinedSpec: expect.any(Object),
        answers: expect.any(Object)
      }));
    });
  });

  describe('進捗表示', () => {
    test('回答の進捗が表示される', async () => {
      claudeService.generateRefinementQuestions.mockResolvedValue(mockQuestions);
      
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      await waitFor(() => {
        const progressText = screen.getByText(/0 \/ 3 質問に回答済み/);
        expect(progressText).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByLabelText('未提出の課題数'));
      
      expect(screen.getByText(/1 \/ 3 質問に回答済み/)).toBeInTheDocument();
    });

    test('フェーズインジケーターが表示される', () => {
      render(<RefinementPhase expandedPrompt={mockExpandedPrompt} />);
      
      expect(screen.getByText(/Phase 3/i)).toBeInTheDocument();
      expect(screen.getByText(/要件精密化/i)).toBeInTheDocument();
    });
  });
});