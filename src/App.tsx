import { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import Dashboard from './components/Dashboard';
import MirrorScreen from './components/MirrorScreen';
import AudienceScreen from './components/AudienceScreen';
import { useGame } from './hooks/useGame';
import { useAudiencePoll } from './hooks/useAudiencePoll';

function App() {
  const params = new URLSearchParams(window.location.search);
  const audienceMode = params.get('audience') === '1';
  const roomId = params.get('room') || 'demo';
  const audiencePoll = useAudiencePoll(audienceMode ? 'audience' : 'host', roomId);
  const { state, decay, startGame, makeChoice, advanceCycle, setAriaObservation, setTabWarningTriggered } = useGame();
  const [fadeOut, setFadeOut] = useState(false);
  const [currentView, setCurrentView] = useState<'intro' | 'playing' | 'mirror'>('intro');

  if (audienceMode) {
    return <AudienceScreen roomId={roomId} audiencePoll={audiencePoll} />;
  }

  useEffect(() => {
    if (state.phase !== currentView) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        setCurrentView(state.phase);
        setFadeOut(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [state.phase, currentView]);

  return (
    <div className="fixed inset-0" style={{ background: '#030305' }}>
      <div
        className="transition-opacity duration-700 w-full h-full"
        style={{ opacity: fadeOut ? 0 : 1 }}
      >
        {currentView === 'intro' && <IntroScreen onStart={startGame} playthrough={state.playthrough} />}
        {currentView === 'playing' && (
          <Dashboard
            state={state}
            decay={decay}
            onChoice={makeChoice}
            onAdvance={advanceCycle}
            onAriaObservation={setAriaObservation}
            onTabWarning={setTabWarningTriggered}
            audienceRoomId={roomId}
            audiencePoll={audiencePoll}
          />
        )}
        {currentView === 'mirror' && <MirrorScreen state={state} decay={decay} />}
      </div>
    </div>
  );
}

export default App;
