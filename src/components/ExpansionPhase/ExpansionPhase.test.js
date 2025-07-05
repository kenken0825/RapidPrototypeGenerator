import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpansionPhase from './ExpansionPhase';
import * as claudeService from '../../services/claudeService';

jest.mock('../../services/claudeService');

describe('Phase 2: インテリジェントプロンプト拡張エンジン', () => {
  const mockInputData = {
    idea: 'オンライン学習プラットフォームのダッシュボードを作りたい。学習進捗、課題提出、成績確認ができるもの。',
    targetUsers: '大学生',
    constraints: 'スマホでも使いやすくしたい',
    referenceUrls: [],
    uploadedImages: []
  };

  const mockExpandedPrompt = {
    projectInfo: {
      title: 'オンライン学習プラットフォーム ダッシュボード',
      domain: '教育',
      targetUsers: ['大学生', '20-25歳'],
      primaryGoals: ['学習効率化', '進捗管理', '成績可視化']
    },
    uiRequirements: {
      pages: [
        {
          name: 'ダッシュボード',
          purpose: '学習状況の一覧表示',
          keyComponents: ['進捗グラフ', '課題リスト', '通知エリア', '成績サマリー']
        }
      ],
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('プロンプト拡張プロセス', () => {
    test('初期入力データが正しく表示される', () => {
      render(<ExpansionPhase inputData={mockInputData} />);
      
      expect(screen.getByText(/オンライン学習プラットフォーム/)).toBeInTheDocument();
      expect(screen.getByText(/大学生/)).toBeInTheDocument();
      expect(screen.getByText(/スマホでも使いやすく/)).toBeInTheDocument();
    });

    test('拡張プロセスが開始される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      const expandButton = screen.getByRole('button', { name: /プロンプトを拡張/i });
      
      await userEvent.click(expandButton);
      
      expect(screen.getByText(/拡張中.../i)).toBeInTheDocument();
      expect(claudeService.expandPrompt).toHaveBeenCalledWith(mockInputData);
    });

    test('拡張結果が表示される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      const expandButton = screen.getByRole('button', { name: /プロンプトを拡張/i });
      
      await userEvent.click(expandButton);
      
      await waitFor(() => {
        expect(screen.getByText(/オンライン学習プラットフォーム ダッシュボード/)).toBeInTheDocument();
        expect(screen.getByText(/教育/)).toBeInTheDocument();
        expect(screen.getByText(/学習効率化/)).toBeInTheDocument();
      });
    });

    test('エラー時にエラーメッセージが表示される', async () => {
      claudeService.expandPrompt.mockRejectedValue(new Error('API エラー'));
      
      render(<ExpansionPhase inputData={mockInputData} />);
      const expandButton = screen.getByRole('button', { name: /プロンプトを拡張/i });
      
      await userEvent.click(expandButton);
      
      await waitFor(() => {
        expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument();
      });
    });
  });

  describe('コンテキスト分析', () => {
    test('ドメイン識別が正しく動作する', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        const domainSection = screen.getByTestId('domain-analysis');
        expect(domainSection).toHaveTextContent('教育');
      });
    });

    test('ユーザー層の特定が表示される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/20-25歳/)).toBeInTheDocument();
      });
    });

    test('主要機能の抽出結果が表示される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/進捗グラフ/)).toBeInTheDocument();
        expect(screen.getByText(/課題リスト/)).toBeInTheDocument();
        expect(screen.getByText(/通知エリア/)).toBeInTheDocument();
      });
    });
  });

  describe('要件補完', () => {
    test('不足要素が追加される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/成績サマリー/)).toBeInTheDocument();
      });
    });

    test('アクセシビリティ要件が追加される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/WCAG 2.1 AA準拠/)).toBeInTheDocument();
      });
    });

    test('デザイン原則が追加される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/直感的操作/)).toBeInTheDocument();
        expect(screen.getByText(/情報の視認性/)).toBeInTheDocument();
        expect(screen.getByText(/モバイルファースト/)).toBeInTheDocument();
      });
    });
  });

  describe('技術的制約の明確化', () => {
    test('レスポンシブ要件が表示される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('responsive-indicator')).toHaveTextContent('対応');
      });
    });

    test('ブラウザ対応範囲が表示される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
        browsers.forEach(browser => {
          expect(screen.getByText(browser)).toBeInTheDocument();
        });
      });
    });

    test('使用技術が表示される', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/CSS Grid/)).toBeInTheDocument();
        expect(screen.getByText(/Flexbox/)).toBeInTheDocument();
        expect(screen.getByText(/JavaScript ES6\+/)).toBeInTheDocument();
      });
    });
  });

  describe('結果の編集機能', () => {
    test('拡張結果を編集できる', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        const editButton = screen.getByRole('button', { name: /編集/i });
        expect(editButton).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /編集/i }));
      
      const titleInput = screen.getByDisplayValue(/オンライン学習プラットフォーム ダッシュボード/);
      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, '学習管理システム');
      
      await userEvent.click(screen.getByRole('button', { name: /保存/i }));
      
      expect(screen.getByText(/学習管理システム/)).toBeInTheDocument();
    });

    test('編集をキャンセルできる', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /編集/i })).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /編集/i }));
      await userEvent.click(screen.getByRole('button', { name: /キャンセル/i }));
      
      expect(screen.getByText(/オンライン学習プラットフォーム ダッシュボード/)).toBeInTheDocument();
    });
  });

  describe('次のフェーズへの遷移', () => {
    test('拡張完了後に次へボタンが有効になる', async () => {
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} />);
      const nextButton = screen.getByRole('button', { name: /次のフェーズへ/i });
      
      expect(nextButton).toBeDisabled();
      
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(nextButton).not.toBeDisabled();
      });
    });

    test('次へボタンクリックで適切なデータが渡される', async () => {
      const onNext = jest.fn();
      claudeService.expandPrompt.mockResolvedValue(mockExpandedPrompt);
      
      render(<ExpansionPhase inputData={mockInputData} onNext={onNext} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /次のフェーズへ/i })).not.toBeDisabled();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /次のフェーズへ/i }));
      
      expect(onNext).toHaveBeenCalledWith(mockExpandedPrompt);
    });
  });

  describe('プログレス表示', () => {
    test('拡張中にプログレスバーが表示される', async () => {
      claudeService.expandPrompt.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockExpandedPrompt), 1000))
      );
      
      render(<ExpansionPhase inputData={mockInputData} />);
      await userEvent.click(screen.getByRole('button', { name: /プロンプトを拡張/i }));
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });
    });

    test('フェーズインジケーターが正しく表示される', () => {
      render(<ExpansionPhase inputData={mockInputData} />);
      
      expect(screen.getByText(/Phase 2/i)).toBeInTheDocument();
      expect(screen.getByText(/プロンプト拡張/i)).toBeInTheDocument();
    });
  });
});