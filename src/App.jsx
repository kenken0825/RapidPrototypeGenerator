import React, { useState } from 'react';
import InputPhase from './components/InputPhase/InputPhase';
import ExpansionPhase from './components/ExpansionPhase/ExpansionPhase';
import RefinementPhase from './components/RefinementPhase/RefinementPhase';
import GenerationPhase from './components/GenerationPhase/GenerationPhase';
import FeedbackPhase from './components/FeedbackPhase/FeedbackPhase';
import ProgressBar from './components/common/ProgressBar';
import './App.css';

function App() {
  const [currentPhase, setCurrentPhase] = useState(1);
  const [projectData, setProjectData] = useState({
    sessionId: `session-${Date.now()}`,
    phases: {
      input: { completed: false, data: null },
      expansion: { completed: false, data: null },
      refinement: { completed: false, data: null },
      generation: { completed: false, data: null },
      feedback: { completed: false, data: null }
    }
  });

  const handlePhaseComplete = (phase, data) => {
    setProjectData(prev => ({
      ...prev,
      phases: {
        ...prev.phases,
        [phase]: { completed: true, data }
      }
    }));
    
    if (currentPhase < 5) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handleNewProject = () => {
    setCurrentPhase(1);
    setProjectData({
      sessionId: `session-${Date.now()}`,
      phases: {
        input: { completed: false, data: null },
        expansion: { completed: false, data: null },
        refinement: { completed: false, data: null },
        generation: { completed: false, data: null },
        feedback: { completed: false, data: null }
      }
    });
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 1:
        return (
          <InputPhase 
            onSubmit={(data) => handlePhaseComplete('input', data)}
          />
        );
      case 2:
        return (
          <ExpansionPhase 
            inputData={projectData.phases.input.data}
            onNext={(data) => handlePhaseComplete('expansion', data)}
          />
        );
      case 3:
        return (
          <RefinementPhase 
            expandedPrompt={projectData.phases.expansion.data}
            onNext={(data) => handlePhaseComplete('refinement', data)}
          />
        );
      case 4:
        return (
          <GenerationPhase 
            refinedSpec={projectData.phases.refinement.data}
            onNext={(data) => handlePhaseComplete('generation', data)}
          />
        );
      case 5:
        return (
          <FeedbackPhase 
            prototype={projectData.phases.generation.data}
            onComplete={(data) => handlePhaseComplete('feedback', data)}
            onNewProject={handleNewProject}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Rapid Prototype Generator</h1>
        <p className="tagline">アイデアから実用的なプロトタイプへ</p>
      </header>
      
      <ProgressBar 
        currentPhase={currentPhase} 
        totalPhases={5}
        phases={[
          'アイデア入力',
          'プロンプト拡張',
          '要件精密化',
          'プロトタイプ生成',
          'フィードバック'
        ]}
      />
      
      <main className="app-main">
        {renderPhase()}
      </main>
    </div>
  );
}

export default App;