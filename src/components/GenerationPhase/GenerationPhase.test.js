import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GenerationPhase from './GenerationPhase';
import * as prototypeService from '../../services/prototypeService';
import * as fileService from '../../services/fileService';

jest.mock('../../services/prototypeService');
jest.mock('../../services/fileService');

describe('Phase 4: プロトタイプ生成エンジン', () => {
  const mockRefinedSpec = {
    projectInfo: {
      title: 'オンライン学習プラットフォーム ダッシュボード',
      domain: '教育',
      targetUsers: ['大学生'],
      primaryGoals: ['学習効率化', '進捗管理']
    },
    uiRequirements: {
      pages: [{
        name: 'ダッシュボード',
        purpose: '学習状況の一覧表示',
        keyComponents: ['進捗グラフ', '課題リスト', '通知エリア', '成績サマリー']
      }],
      designPrinciples: ['直感的操作', '情報の視認性', 'モバイルファースト'],
      interactions: ['ドリルダウン', 'フィルタリング', 'リアルタイム更新'],
      priorityInfo: 'pending_assignments',
      displayFormat: 'balanced',
      additionalFeatures: ['dark_mode', 'notification_settings']
    },
    technicalSpecs: {
      responsive: true,
      accessibility: 'WCAG 2.1 AA準拠',
      browserSupport: ['Chrome', 'Safari', 'Firefox', 'Edge'],
      frameworks: ['CSS Grid', 'Flexbox', 'JavaScript ES6+']
    }
  };

  const mockGeneratedCode = {
    html: `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>オンライン学習プラットフォーム ダッシュボード</title>
</head>
<body>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>学習ダッシュボード</h1>
    </header>
    <main class="dashboard-main">
      <section class="progress-section">
        <h2>学習進捗</h2>
        <div class="progress-chart"></div>
      </section>
      <section class="tasks-section">
        <h2>課題リスト</h2>
        <ul class="task-list"></ul>
      </section>
    </main>
  </div>
</body>
</html>`,
    css: `.dashboard-container { display: grid; }`,
    javascript: `console.log('Dashboard loaded');`,
    assets: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI要素抽出・マッピング', () => {
    test('仕様からUI要素が正しく抽出される', async () => {
      prototypeService.extractUIElements.mockResolvedValue({
        '学習進捗': {
          component: 'ProgressChart',
          type: 'data-visualization',
          props: ['percentage', 'timeframe', 'subjects']
        },
        '課題リスト': {
          component: 'TaskList',
          type: 'interactive-list',
          props: ['items', 'dueDate', 'priority', 'status']
        },
        '成績確認': {
          component: 'GradeTable',
          type: 'data-table',
          props: ['subjects', 'scores', 'trends']
        }
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        expect(prototypeService.extractUIElements).toHaveBeenCalledWith(mockRefinedSpec);
        expect(screen.getByText(/UI要素の抽出完了/)).toBeInTheDocument();
      });
    });

    test('コンポーネントマッピングが表示される', async () => {
      prototypeService.extractUIElements.mockResolvedValue({
        '学習進捗': { component: 'ProgressChart', type: 'data-visualization' }
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        expect(screen.getByText(/ProgressChart/)).toBeInTheDocument();
        expect(screen.getByText(/data-visualization/)).toBeInTheDocument();
      });
    });
  });

  describe('レイアウト自動生成', () => {
    test('レスポンシブレイアウトが生成される', async () => {
      prototypeService.generateLayout.mockResolvedValue({
        desktop: { grid: '12-column', pattern: 'F-pattern' },
        tablet: { grid: '8-column', pattern: 'simplified' },
        mobile: { grid: 'single-column', pattern: 'vertical' }
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        expect(screen.getByText(/デスクトップ: 12-column/)).toBeInTheDocument();
        expect(screen.getByText(/タブレット: 8-column/)).toBeInTheDocument();
        expect(screen.getByText(/モバイル: single-column/)).toBeInTheDocument();
      });
    });

    test('レイアウトパターンが適用される', async () => {
      prototypeService.generateLayout.mockResolvedValue({
        desktop: { pattern: 'F-pattern' }
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        expect(screen.getByText(/F-pattern/)).toBeInTheDocument();
      });
    });

    test('情報階層が視覚化される', async () => {
      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        const hierarchyView = screen.getByTestId('hierarchy-visualization');
        expect(hierarchyView).toBeInTheDocument();
        expect(within(hierarchyView).getByText(/課題リスト/)).toBeInTheDocument();
      });
    });
  });

  describe('インタラクション実装', () => {
    test('ナビゲーションパターンが実装される', async () => {
      prototypeService.implementInteractions.mockResolvedValue({
        navigation: { type: 'tab-based', transitions: 'smooth-slide' },
        dataFiltering: { type: 'real-time' },
        feedback: { loading: 'skeleton-ui' }
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        expect(screen.getByText(/tab-based/)).toBeInTheDocument();
        expect(screen.getByText(/smooth-slide/)).toBeInTheDocument();
      });
    });

    test('フィルタリング機能が実装される', async () => {
      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        const filterSection = screen.getByTestId('filter-implementation');
        expect(within(filterSection).getByText(/リアルタイムフィルタリング/)).toBeInTheDocument();
      });
    });

    test('フィードバックパターンが設定される', async () => {
      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await waitFor(() => {
        expect(screen.getByText(/skeleton-ui/)).toBeInTheDocument();
        expect(screen.getByText(/toast-notification/)).toBeInTheDocument();
      });
    });
  });

  describe('コード生成プロセス', () => {
    test('生成開始ボタンが表示される', () => {
      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      const generateButton = screen.getByRole('button', { name: /プロトタイプを生成/i });
      expect(generateButton).toBeInTheDocument();
    });

    test('生成プロセスが実行される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      expect(screen.getByText(/生成中.../)).toBeInTheDocument();
      
      await waitFor(() => {
        expect(prototypeService.generatePrototype).toHaveBeenCalledWith(mockRefinedSpec);
      });
    });

    test('生成の進捗が表示される', async () => {
      prototypeService.generatePrototype.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(mockGeneratedCode), 1000))
      );

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(/UI要素を分析中.../)).toBeInTheDocument();
    });

    test('生成完了後にコードが表示される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/生成完了/)).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /HTML/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /CSS/i })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: /JavaScript/i })).toBeInTheDocument();
      });
    });
  });

  describe('プレビュー機能', () => {
    test('プレビューボタンが生成後に表示される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /プレビュー/i })).toBeInTheDocument();
      });
    });

    test('プレビューがiframeで表示される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /プレビュー/i })).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /プレビュー/i }));
      
      const iframe = screen.getByTitle(/プロトタイププレビュー/i);
      expect(iframe).toBeInTheDocument();
    });

    test('デバイスサイズ切り替えが可能', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /プレビュー/i })).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /プレビュー/i }));
      
      expect(screen.getByRole('button', { name: /デスクトップ/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /タブレット/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /モバイル/i })).toBeInTheDocument();
    });
  });

  describe('品質チェック', () => {
    test('アクセシビリティチェックが実行される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);
      prototypeService.checkAccessibility.mockResolvedValue({
        score: 92,
        issues: [
          { level: 'warning', message: 'alt属性が不足している画像があります' }
        ]
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/アクセシビリティスコア: 92/)).toBeInTheDocument();
        expect(screen.getByText(/alt属性が不足/)).toBeInTheDocument();
      });
    });

    test('レスポンシブ検証が実行される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);
      prototypeService.validateResponsive.mockResolvedValue({
        desktop: { status: 'pass' },
        tablet: { status: 'pass' },
        mobile: { status: 'warning', message: 'テキストが小さすぎる可能性があります' }
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('responsive-check-mobile')).toHaveTextContent(/warning/);
      });
    });

    test('パフォーマンス最適化の提案が表示される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);
      prototypeService.analyzePerformance.mockResolvedValue({
        suggestions: [
          'CSSを最小化できます',
          '画像の遅延読み込みを実装できます'
        ]
      });

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/CSSを最小化/)).toBeInTheDocument();
        expect(screen.getByText(/画像の遅延読み込み/)).toBeInTheDocument();
      });
    });
  });

  describe('ダウンロード機能', () => {
    test('ダウンロードボタンが表示される', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ダウンロード/i })).toBeInTheDocument();
      });
    });

    test('ZIPファイルとしてダウンロードできる', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);
      fileService.downloadAsZip.mockResolvedValue(true);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /ダウンロード/i })).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /ダウンロード/i }));
      
      expect(fileService.downloadAsZip).toHaveBeenCalledWith(
        mockGeneratedCode,
        'オンライン学習プラットフォーム_ダッシュボード'
      );
    });

    test('個別ファイルをダウンロードできる', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        const htmlTab = screen.getByRole('tab', { name: /HTML/i });
        expect(htmlTab).toBeInTheDocument();
      });
      
      await userEvent.click(screen.getByRole('tab', { name: /HTML/i }));
      
      const downloadHtmlButton = screen.getByRole('button', { name: /HTMLをダウンロード/i });
      expect(downloadHtmlButton).toBeInTheDocument();
    });
  });

  describe('次フェーズへの遷移', () => {
    test('生成完了後に次へボタンが有効になる', async () => {
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} />);
      
      const nextButton = screen.getByRole('button', { name: /次のフェーズへ/i });
      expect(nextButton).toBeDisabled();
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        expect(nextButton).not.toBeDisabled();
      });
    });

    test('生成されたコードが次フェーズに渡される', async () => {
      const onNext = jest.fn();
      prototypeService.generatePrototype.mockResolvedValue(mockGeneratedCode);

      render(<GenerationPhase refinedSpec={mockRefinedSpec} onNext={onNext} />);
      
      await userEvent.click(screen.getByRole('button', { name: /プロトタイプを生成/i }));
      
      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /次のフェーズへ/i });
        expect(nextButton).not.toBeDisabled();
      });
      
      await userEvent.click(screen.getByRole('button', { name: /次のフェーズへ/i }));
      
      expect(onNext).toHaveBeenCalledWith({
        refinedSpec: mockRefinedSpec,
        generatedCode: mockGeneratedCode
      });
    });
  });
});