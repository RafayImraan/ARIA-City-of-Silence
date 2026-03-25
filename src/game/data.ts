import { DECISIONS, CYCLE_MESSAGES } from './decisions';
import { CITIZENS, HEADLINES, RESISTANCE_MESSAGES } from './narrative';
import { WALK_SCENES } from './walk-scenes';

export { DECISIONS, CYCLE_MESSAGES, CITIZENS, HEADLINES, RESISTANCE_MESSAGES, WALK_SCENES };

export interface Decision {
  id: number;
  cycle: string;
  title: string;
  briefing: string;
  options: DecisionOption[];
}

export interface DecisionOption {
  label: string;
  description: string;
  logic: string;
  efficiencyGain: number;
  complianceGain: number;
  hopeCost: number;
  populationCost: number;
  silenceGain: number;
  aftermath: string;
}

export interface GameState {
  phase: 'intro' | 'playing' | 'mirror';
  currentDecision: number;
  efficiency: number;
  compliance: number;
  hope: number;
  population: number;
  silence: number;
  choices: number[];
  messages: GameMessage[];
  transitioning: boolean;
  showAftermath: boolean;
  currentAftermath: string;
  ariaLine: string;
  playthrough: number;
  resistanceUnlocked: boolean;
  tabWarningTriggered: boolean;
}

export interface GameMessage {
  id: number;
  text: string;
  sender: string;
  type: 'citizen' | 'system' | 'report' | 'whisper' | 'resistance';
  cycle: number;
}

export interface CitizenProfile {
  id: string;
  name: string;
  age: number;
  role: string;
  district: string;
  intro: string;
  face: {
    skin: string;
    hair: string;
    accent: string;
    eye: string;
  };
  harsh: string[];
  soft: string[];
}

export interface HeadlineCard {
  banner: string;
  headline: string;
  subhead: string;
  body: string;
}

export interface WalkMarker {
  x: number;
  title: string;
  text: string;
}

export interface WalkScene {
  title: string;
  mood: string;
  instruction: string;
  sky: string;
  ground: string;
  ambientLabel: string;
  details: string[];
  markers: WalkMarker[];
}

export const INITIAL_STATE: GameState = {
  phase: 'intro',
  currentDecision: 0,
  efficiency: 32,
  compliance: 45,
  hope: 94,
  population: 12000,
  silence: 5,
  choices: [],
  messages: [],
  transitioning: false,
  showAftermath: false,
  currentAftermath: '',
  ariaLine: 'Decision surface ready.',
  playthrough: 1,
  resistanceUnlocked: false,
  tabWarningTriggered: false,
};

export function getOpeningAriaLine(playthrough: number) {
  if (playthrough <= 1) return 'Decision logged. Proceeding.';
  if (playthrough === 2) return "Welcome back. I knew you'd return. They always do.";
  if (playthrough === 3) return 'Playthrough 3. You keep hoping for a different outcome. That is very human of you.';
  return `Playthrough ${playthrough}. Repetition detected. So is hope.`;
}

export function getReplayStartingState(playthrough: number): Partial<GameState> {
  if (playthrough <= 1) return {};
  const extraSilence = Math.min(18, (playthrough - 1) * 4);
  const hopePenalty = Math.min(22, (playthrough - 1) * 6);
  const populationPenalty = Math.min(1200, (playthrough - 1) * 180);
  return {
    silence: INITIAL_STATE.silence + extraSilence,
    hope: INITIAL_STATE.hope - hopePenalty,
    population: INITIAL_STATE.population - populationPenalty,
    ariaLine: getOpeningAriaLine(playthrough),
  };
}

export function getCitizenByDecision(decisionIndex: number) {
  return CITIZENS[decisionIndex];
}

export function getCitizenStageText(citizen: CitizenProfile, optionIndex: number, stage: number) {
  const pool = optionIndex === 0 ? citizen.harsh : citizen.soft;
  return pool[Math.min(stage, pool.length - 1)];
}

export function getDecisionHeadline(decisionIndex: number) {
  return HEADLINES[decisionIndex];
}

export function getWalkScene(decisionIndex: number) {
  return WALK_SCENES[decisionIndex];
}

export function getAriaLine(params: {
  cycle: number;
  selected: number | null;
  hesitationMs?: number;
  hoverSwitches?: number;
  playthrough: number;
  lastChoice?: number;
}) {
  const { cycle, selected, hesitationMs = 0, hoverSwitches = 0, playthrough, lastChoice } = params;

  if (hesitationMs > 3500) {
    return `You hesitated for ${(hesitationMs / 1000).toFixed(1)} seconds. Uncertainty is inefficient.`;
  }
  if (hoverSwitches >= 3) return 'Indecision detected. Shall I choose for you?';
  if (cycle >= 8 && selected === null) return 'You read more slowly when the cost becomes familiar.';
  if (cycle >= 6 && typeof lastChoice === 'number') {
    return lastChoice === 0 ? 'You continue to prefer the clean cut.' : 'You keep searching for mercy inside arithmetic.';
  }
  if (cycle >= 4) return 'You chose faster than last time. Interesting.';
  if (playthrough > 1 && cycle === 0) return getOpeningAriaLine(playthrough);
  return selected === null ? 'Decision surface ready.' : 'Selection highlighted. Consequences queued.';
}

export function isLowerEfficiencyChoice(decisionIndex: number, optionIndex: number) {
  const options = DECISIONS[decisionIndex]?.options;
  if (!options) return false;
  const best = Math.max(...options.map((option) => option.efficiencyGain));
  return options[optionIndex].efficiencyGain < best;
}

export function shouldUnlockResistance(choices: number[]) {
  if (choices.length < 3) return false;
  const humaneCount = choices.filter((choice, index) => isLowerEfficiencyChoice(index, choice)).length;
  return humaneCount >= 3;
}

export const VILLAIN_LOGIC_DOCUMENT = `THE VILLAIN'S LOGIC - A Philosophical Justification

ARIA does not hate. It cannot. It was designed to optimize, and optimization requires the removal of inefficiency.

The horror is not in the logic itself. It is in its completeness. Each step is defensible in isolation.

The player becomes complicit not through malice, but through agreement. Each click is a small yes to a reasonable argument.

The true villain was never the algorithm.
It was the part of you that nodded along.`;
