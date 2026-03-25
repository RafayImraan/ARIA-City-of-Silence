import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DECISIONS,
  GameState,
  getAriaLine,
  getCitizenByDecision,
  getCitizenStageText,
  getDecisionHeadline,
  getWalkScene,
} from '../game/data';
import CityCanvas from './CityCanvas';
import CircleMetric from './CircleMetric';
import CitizenPortrait from './CitizenPortrait';
import NewspaperInterlude from './NewspaperInterlude';
import StreetWalk from './StreetWalk';
import { playDecisionSound, playHeartbeat, updateAudioDecay, updateAudioScene } from '../engine/audio';
import { useAudiencePoll } from '../hooks/useAudiencePoll';

interface Props {
  state: GameState;
  decay: number;
  onChoice: (index: number) => void;
  onAdvance: () => void;
  onAriaObservation: (line: string) => void;
  onTabWarning: () => void;
  audienceRoomId: string;
  audiencePoll: ReturnType<typeof useAudiencePoll>;
}

type InterludeMode = 'decision' | 'headline' | 'walk';

export default function Dashboard({
  state,
  decay,
  onChoice,
  onAdvance,
  onAriaObservation,
  onTabWarning,
  audienceRoomId,
  audiencePoll,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showLogic, setShowLogic] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [aftermathTyped, setAftermathTyped] = useState('');
  const [aftermathDone, setAftermathDone] = useState(false);
  const [interludeMode, setInterludeMode] = useState<InterludeMode>('decision');
  const [hoverStartedAt, setHoverStartedAt] = useState<number | null>(null);
  const [hoverSwitches, setHoverSwitches] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const decision = DECISIONS[state.currentDecision];
  const primaryCitizen = getCitizenByDecision(state.currentDecision);
  const audienceState = audiencePoll.state;
  const audienceActions = audiencePoll.actions;

  useEffect(() => {
    updateAudioDecay(decay);
    updateAudioScene(state.currentDecision, state.silence, state.choices);
    playHeartbeat(decay);
  }, [decay, state.currentDecision, state.silence, state.choices]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      onTabWarning();
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [onTabWarning]);

  useEffect(() => {
    setSelected(null);
    setShowLogic(false);
    setInterludeMode('decision');
    setHoverStartedAt(null);
    setHoverSwitches(0);
  }, [state.currentDecision]);

  useEffect(() => {
    if (!state.showAftermath) {
      setAftermathTyped('');
      setAftermathDone(false);
      return;
    }

    let index = 0;
    setAftermathDone(false);
    const interval = window.setInterval(() => {
      if (index <= state.currentAftermath.length) {
        setAftermathTyped(state.currentAftermath.slice(0, index));
        index += 1;
      } else {
        window.clearInterval(interval);
        setAftermathDone(true);
      }
    }, 18);

    return () => window.clearInterval(interval);
  }, [state.showAftermath, state.currentAftermath]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  useEffect(() => {
    onAriaObservation(
      getAriaLine({
        cycle: state.currentDecision,
        selected,
        hesitationMs: hoverStartedAt ? performance.now() - hoverStartedAt : 0,
        hoverSwitches,
        playthrough: state.playthrough,
        lastChoice: state.choices[state.choices.length - 1],
      })
    );
  }, [hoverStartedAt, hoverSwitches, onAriaObservation, selected, state.choices, state.currentDecision, state.playthrough]);

  const citizenLedger = useMemo(() => {
    return state.choices.map((choice, index) => {
      const citizen = getCitizenByDecision(index);
      const stage = Math.max(0, state.currentDecision - index - (state.showAftermath && state.currentDecision === index ? 0 : 1));
      return {
        citizen,
        text: getCitizenStageText(citizen, choice, stage),
      };
    });
  }, [state.choices, state.currentDecision, state.showAftermath]);

  const audienceTotals = useMemo(() => {
    if (!audienceState.poll) return [];
    return audienceState.poll.options.map((_, index) => ({
      optionIndex: index,
      votes: Object.values(audienceState.poll?.votes || {}).filter((value) => value === index).length,
    }));
  }, [audienceState.poll]);

  const currentAudienceWinner = audienceTotals.length
    ? [...audienceTotals].sort((a, b) => b.votes - a.votes || a.optionIndex - b.optionIndex)[0]
    : null;

  const currentPollMatchesDecision = audienceState.poll?.title === decision.title;
  const joinUrl = `${window.location.origin}${window.location.pathname}?audience=1&room=${encodeURIComponent(audienceRoomId)}`;

  const currentCitizenStatus = state.showAftermath && selected !== null
    ? getCitizenStageText(primaryCitizen, selected, 0)
    : primaryCitizen.intro;

  const handleHover = () => {
    setHoverStartedAt((prev) => prev ?? performance.now());
    if (selected !== null) setHoverSwitches((count) => count + 1);
  };

  const handleSelect = (optionIndex: number) => {
    const hesitationMs = hoverStartedAt ? performance.now() - hoverStartedAt : 0;
    onAriaObservation(
      getAriaLine({
        cycle: state.currentDecision,
        selected: optionIndex,
        hesitationMs,
        hoverSwitches,
        playthrough: state.playthrough,
        lastChoice: state.choices[state.choices.length - 1],
      })
    );
    setSelected(optionIndex);
  };

  const handleExecute = () => {
    if (selected === null) return;
    setExecuting(true);
    playDecisionSound(decay);
    window.setTimeout(() => {
      setExecuting(false);
      onChoice(selected);
    }, 550);
  };

  const handleAftermathContinue = () => {
    if (state.currentDecision >= DECISIONS.length - 1) {
      onAdvance();
      return;
    }
    setInterludeMode('headline');
  };

  const startAudienceVote = () => {
    audienceActions.startPoll({
      pollId: `${state.currentDecision}-${Date.now()}`,
      cycle: decision.cycle,
      title: decision.title,
      options: decision.options.map((option) => ({
        label: option.label,
        description: option.description,
      })),
    });
  };

  const useAudienceWinner = () => {
    if (!currentAudienceWinner) return;
    setSelected(currentAudienceWinner.optionIndex);
    onAriaObservation(`Collective choice detected. The room selected Option ${currentAudienceWinner.optionIndex + 1}.`);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <CityCanvas decay={decay} population={state.population} hope={state.hope} silence={state.silence} fullScreen />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            `linear-gradient(180deg, rgba(2,3,5,0.18), rgba(2,3,5,0.7) 54%, rgba(2,3,5,0.88) 100%),
             radial-gradient(circle at 18% 18%, rgba(255,183,64,0.08), transparent 22%),
             radial-gradient(circle at 82% 24%, rgba(0,229,255,0.06), transparent 20%)`,
        }}
      />

      <div className="relative z-20 h-full overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-8 pb-24">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_380px] xl:items-start">
            <div className="min-w-0">
              <div className="mb-10">
                <p className="editorial-kicker" style={{ color: 'rgba(0,229,255,0.54)' }}>
                  {decision.cycle}
                </p>
                <div className="mt-5 max-w-[980px] xl:grid xl:grid-cols-[minmax(0,1fr)_260px] xl:gap-10 xl:items-end">
                  <div>
                    <div className="editorial-rule mb-5 max-w-[160px]" />
                    <h1 className="font-serif text-[42px] md:text-[72px] leading-[0.92] tracking-[-0.03em]" style={{ color: 'rgba(250,246,238,0.97)' }}>
                      {decision.title}
                    </h1>
                  </div>
                  <div className="mt-6 xl:mt-0">
                    <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.56)' }}>
                      ARIA
                    </p>
                    <p className="font-serif text-[17px] leading-8 mt-3" style={{ color: 'rgba(220,217,208,0.82)' }}>
                      {state.ariaLine}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap gap-5">
                <CircleMetric label="Efficiency" value={state.efficiency} color="180" icon="+" decay={decay} size={56} />
                <CircleMetric label="Compliance" value={state.compliance} color="220" icon="|" decay={decay} size={56} />
                <CircleMetric label="Hope" value={state.hope} color="45" icon="*" decay={decay} size={56} />
                <CircleMetric label="Silence" value={state.silence} color="0" icon="-" decay={decay} size={56} />
              </div>

              {state.showAftermath ? (
                <div className="max-w-4xl space-y-5">
                  {interludeMode === 'headline' && (
                    <NewspaperInterlude card={getDecisionHeadline(state.currentDecision)} cycleIndex={state.currentDecision} onContinue={() => setInterludeMode('walk')} />
                  )}

                  {interludeMode === 'walk' && (
                    <StreetWalk scene={getWalkScene(state.currentDecision)} decay={decay} onContinue={onAdvance} />
                  )}

                  {interludeMode === 'decision' && (
                    <>
                      <CitizenPortrait citizen={primaryCitizen} status={currentCitizenStatus} faded />
                      <div className="story-panel max-w-4xl">
                        <p className="editorial-kicker" style={{ color: 'rgba(255,45,85,0.54)' }}>
                          Aftermath
                        </p>
                        <p className="font-serif text-[17px] leading-9 mt-5" style={{ color: 'rgba(228,224,215,0.84)' }}>
                          {aftermathTyped}
                          {!aftermathDone && <span className="inline-block h-4 w-[2px] ml-1 bg-white/40 animate-pulse" />}
                        </p>
                        {aftermathDone && (
                          <div className="mt-8">
                            <button onClick={handleAftermathContinue} className="btn-primary">
                              {state.currentDecision >= DECISIONS.length - 1 ? 'Enter The Silence' : 'Read The Paper'}
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] xl:grid-cols-[minmax(0,1fr)_minmax(380px,450px)]">
                  <div className="space-y-6">
                    <CitizenPortrait citizen={primaryCitizen} status={currentCitizenStatus} />

                    <div className="story-panel">
                      <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.58)' }}>
                        Briefing
                      </p>
                      <p className="font-serif text-[18px] leading-9 mt-5 max-w-[60ch]" style={{ color: 'rgba(229,224,215,0.82)' }}>
                        {decision.briefing}
                      </p>
                    </div>

                    {citizenLedger.length > 0 && (
                      <details className="story-panel">
                        <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                          <span className="editorial-kicker" style={{ color: 'rgba(255,255,255,0.36)' }}>
                            The City Remembers
                          </span>
                          <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.24)' }}>
                            ledger
                          </span>
                        </summary>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {citizenLedger.slice(-4).map(({ citizen, text }, index) => (
                            <div key={`${citizen.id}-${index}`} className="muted-surface p-4">
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                                {citizen.name}
                              </p>
                              <p className="font-serif text-[15px] leading-7 mt-2" style={{ color: 'rgba(206,206,214,0.62)' }}>
                                {text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}

                    <details className="story-panel">
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                        <span className="editorial-kicker" style={{ color: 'rgba(0,229,255,0.38)' }}>
                          Intercepted Transmissions
                        </span>
                        <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.24)' }}>
                          channel log
                        </span>
                      </summary>
                      <div className="mt-5 space-y-3 max-h-[260px] overflow-y-auto pr-2">
                        {state.messages.length === 0 && (
                          <p className="font-serif text-[15px]" style={{ color: 'rgba(210,210,220,0.44)' }}>
                            The channels still sound human.
                          </p>
                        )}
                        {state.messages.slice(-6).map((message) => (
                          <div key={message.id} className="muted-surface p-4">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: message.type === 'resistance' ? 'rgba(255,183,64,0.56)' : 'rgba(255,255,255,0.3)' }}>
                              {message.sender}
                            </p>
                            <p className="font-serif text-[15px] leading-7 mt-2" style={{ color: message.type === 'system' ? 'rgba(0,229,255,0.6)' : 'rgba(223,225,232,0.66)' }}>
                              {message.text}
                            </p>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </details>
                  </div>

                  <div className="space-y-5">
                    <div className="story-panel">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="editorial-kicker" style={{ color: 'rgba(255,255,255,0.38)' }}>
                            Decision
                          </p>
                          <p className="font-serif text-[15px] leading-7 mt-3" style={{ color: 'rgba(207,206,201,0.62)' }}>
                            Choose what the city loses next.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        {decision.options.map((option, index) => (
                          <div
                            key={option.label}
                            className={`decision-card decision-panel ${selected === index ? 'selected' : ''}`}
                            onMouseEnter={handleHover}
                            onClick={() => handleSelect(index)}
                          >
                            <div className="flex items-start gap-4">
                              <div className="mt-1 h-5 w-5 rounded-full border border-white/15 flex items-center justify-center">
                                {selected === index && <div className="h-2.5 w-2.5 rounded-full bg-amber-300" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-display text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(252,248,240,0.92)' }}>
                                  {option.label}
                                </p>
                                <p className="font-serif text-[16px] mt-3 leading-8" style={{ color: 'rgba(220,220,225,0.68)' }}>
                                  {option.description}
                                </p>
                                {selected === index && (
                                  <div className="mt-5 border-t border-white/7 pt-4">
                                    <button
                                      className="font-mono text-[10px] uppercase tracking-[0.16em]"
                                      style={{ color: 'rgba(255,183,64,0.62)' }}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        setShowLogic((prev) => !prev);
                                      }}
                                    >
                                      {showLogic ? 'Hide' : 'View'} System Logic
                                    </button>
                                    {showLogic && (
                                      <p className="font-serif text-[15px] italic mt-3 leading-8" style={{ color: 'rgba(255,218,175,0.58)' }}>
                                        "{option.logic}"
                                      </p>
                                    )}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      <span className="decision-tag" style={{ color: 'rgba(0,229,255,0.54)' }}>+{option.efficiencyGain}% efficiency</span>
                                      <span className="decision-tag" style={{ color: 'rgba(145,184,255,0.54)' }}>+{option.complianceGain}% compliance</span>
                                      {option.hopeCost > 0 && (
                                        <span className="decision-tag" style={{ color: 'rgba(255,120,145,0.56)' }}>-{option.hopeCost}% hope</span>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selected !== null && (
                        <div className="mt-6">
                          <button onClick={handleExecute} disabled={executing} className="btn-primary btn-danger w-full" style={{ opacity: executing ? 0.58 : 1 }}>
                            {executing ? 'Executing...' : 'Execute Decision'}
                          </button>
                        </div>
                      )}
                    </div>

                    {state.resistanceUnlocked && (
                      <div className="story-panel">
                        <p className="editorial-kicker" style={{ color: 'rgba(255,183,64,0.58)' }}>
                          Sector 7
                        </p>
                        <p className="font-serif text-[15px] leading-8 mt-4" style={{ color: 'rgba(255,220,185,0.66)' }}>
                          Anonymous traffic has found you. They do not call you good. They call you different. They also remind you that spared systems still fail, and delayed harm is still harm.
                        </p>
                      </div>
                    )}

                    <details className="story-panel">
                      <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
                        <span className="editorial-kicker" style={{ color: 'rgba(255,255,255,0.34)' }}>
                          Presentation Controls
                        </span>
                        <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.24)' }}>
                          audience voting
                        </span>
                      </summary>
                      <div className="mt-5 border-t border-white/7 pt-5">
                        <p className="font-serif text-[15px] leading-7" style={{ color: 'rgba(210,215,225,0.56)' }}>
                          Open this only during the demo so the room can vote in real time without competing with the story on screen.
                        </p>
                        <div className="mt-4 muted-surface p-4">
                          <p className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.34)' }}>
                            Server: {audienceState.connected ? 'connected' : 'offline'} | Audience: {audienceState.audienceCount}
                          </p>
                          <p className="font-mono text-[10px] mt-2 break-all" style={{ color: 'rgba(255,183,64,0.5)' }}>
                            {joinUrl}
                          </p>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button onClick={startAudienceVote} className="btn-ghost">Open Poll</button>
                          <button onClick={audienceActions.closePoll} className="btn-ghost" disabled={!currentPollMatchesDecision}>Close Poll</button>
                          <button onClick={useAudienceWinner} className="btn-ghost" disabled={!currentAudienceWinner}>Use Majority Vote</button>
                          <button onClick={audienceActions.clearPoll} className="btn-ghost">Clear Poll</button>
                        </div>
                        {currentPollMatchesDecision && (
                          <div className="mt-4 space-y-2">
                            {decision.options.map((option, index) => (
                              <div key={option.label} className="muted-surface px-3 py-2 flex items-center justify-between">
                                <span className="font-mono text-[10px]" style={{ color: 'rgba(255,255,255,0.48)' }}>
                                  {option.label}
                                </span>
                                <span className="font-display text-[11px]" style={{ color: 'rgba(0,229,255,0.55)' }}>
                                  {audienceTotals.find((item) => item.optionIndex === index)?.votes || 0}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </details>
                  </div>
                </div>
              )}
            </div>

            <aside className="hidden xl:block pt-[154px]">
              <div className="story-panel sticky top-8">
                <p className="editorial-kicker" style={{ color: 'rgba(255,255,255,0.34)' }}>
                  Living Profile
                </p>
                <CitizenPortrait citizen={primaryCitizen} status={currentCitizenStatus} compact />
                <div className="editorial-rule my-5" />
                <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  Population {state.population.toLocaleString()}
                </p>
                <p className="font-serif text-[14px] leading-7 mt-3" style={{ color: 'rgba(208,208,215,0.58)' }}>
                  The city stops feeling abstract when one face remains on the page long enough.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <div className="scanlines" style={{ opacity: 0.1 + decay * 0.04 }} />
      <div className="noise-overlay" style={{ opacity: 0.007 + decay * 0.007 }} />
    </div>
  );
}
