import { useState, useCallback } from 'react';
import {
  CYCLE_MESSAGES,
  DECISIONS,
  GameState,
  INITIAL_STATE,
  RESISTANCE_MESSAGES,
  getAriaLine,
  getOpeningAriaLine,
  getReplayStartingState,
  shouldUnlockResistance,
} from '../game/data';

const STORAGE_KEY = 'aria-playthrough-count';

function getStoredPlaythrough() {
  if (typeof window === 'undefined') return 1;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const completedRuns = raw ? Number(raw) : 0;
  if (!Number.isFinite(completedRuns) || completedRuns < 0) return 1;
  return completedRuns + 1;
}

function persistCompletedRun(playthrough: number) {
  if (typeof window === 'undefined') return;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const completedRuns = raw ? Number(raw) : 0;
  const nextCount = Math.max(completedRuns, playthrough);
  window.localStorage.setItem(STORAGE_KEY, String(nextCount));
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    const playthrough = getStoredPlaythrough();
    return {
      ...INITIAL_STATE,
      ...getReplayStartingState(playthrough),
      playthrough,
      ariaLine: getOpeningAriaLine(playthrough),
    };
  });

  const startGame = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_STATE,
      ...getReplayStartingState(prev.playthrough),
      phase: 'playing',
      messages: [],
      playthrough: prev.playthrough,
      ariaLine: getOpeningAriaLine(prev.playthrough),
    }));
  }, []);

  const setAriaObservation = useCallback((line: string) => {
    setState((prev) => (prev.ariaLine === line ? prev : { ...prev, ariaLine: line }));
  }, []);

  const setTabWarningTriggered = useCallback(() => {
    setState((prev) => {
      if (prev.tabWarningTriggered) return prev;
      return {
        ...prev,
        tabWarningTriggered: true,
        ariaLine: "Leaving will not undo what you've already done.",
      };
    });
  }, []);

  const makeChoice = useCallback((optionIndex: number) => {
    setState((prev) => {
      const decision = DECISIONS[prev.currentDecision];
      const option = decision.options[optionIndex];
      const nextChoices = [...prev.choices, optionIndex];
      const resistanceUnlocked = shouldUnlockResistance(nextChoices);
      const newMessages = [
        ...prev.messages,
        ...(CYCLE_MESSAGES[prev.currentDecision] || []),
        ...(resistanceUnlocked && !prev.resistanceUnlocked
          ? [RESISTANCE_MESSAGES[0]]
          : resistanceUnlocked && prev.currentDecision >= 6
          ? RESISTANCE_MESSAGES.filter((message) => message.cycle === prev.currentDecision)
          : []),
      ];

      return {
        ...prev,
        choices: nextChoices,
        efficiency: Math.min(100, prev.efficiency + option.efficiencyGain),
        compliance: Math.min(100, prev.compliance + option.complianceGain),
        hope: Math.max(0, prev.hope - option.hopeCost),
        population: Math.max(0, prev.population - option.populationCost),
        silence: Math.min(100, prev.silence + option.silenceGain),
        messages: newMessages,
        transitioning: true,
        showAftermath: true,
        currentAftermath: option.aftermath,
        ariaLine: getAriaLine({
          cycle: prev.currentDecision,
          selected: optionIndex,
          playthrough: prev.playthrough,
          lastChoice: optionIndex,
        }),
        resistanceUnlocked,
      };
    });
  }, []);

  const advanceCycle = useCallback(() => {
    setState((prev) => {
      const nextDecision = prev.currentDecision + 1;
      if (nextDecision >= DECISIONS.length) {
        persistCompletedRun(prev.playthrough);
        return { ...prev, phase: 'mirror', transitioning: false, showAftermath: false };
      }
      return {
        ...prev,
        currentDecision: nextDecision,
        transitioning: false,
        showAftermath: false,
        ariaLine: getAriaLine({
          cycle: nextDecision,
          selected: null,
          playthrough: prev.playthrough,
          lastChoice: prev.choices[prev.choices.length - 1],
        }),
      };
    });
  }, []);

  const decay = Math.min(1, state.silence / 100);

  return {
    state,
    decay,
    startGame,
    makeChoice,
    advanceCycle,
    setAriaObservation,
    setTabWarningTriggered,
  };
}
