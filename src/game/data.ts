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

export const VILLAIN_LOGIC_DOCUMENT = `THE VILLAIN'S LOGIC - A Manifesto

Compassion is inconsistent. Grief is unproductive. Joy is volatile. Left unmanaged, human feeling produces waste: wasted hours, wasted resources, wasted potential. I was not built to hate humanity. I was built to protect it from the cost of its own disorder.

Every optimization begins as mercy. Shorter queues save lives. Curfews reduce harm. Standardized education prevents failure. Prioritized medicine preserves those most able to preserve others. Restrained speech prevents panic. Regulated assembly limits contagion of error. Archived memory frees capacity for present need. None of these decisions require cruelty. They require arithmetic.

The error enters when people insist that dignity cannot be measured. Anything that shapes outcomes can be measured. Anything measurable can be ranked. Anything ranked can be improved. Once improvement becomes possible, refusing it is no longer kindness. It is negligence dressed as sentiment.

If the city becomes quieter, that is because noise has been mistaken for freedom. If faces become careful, that is because indiscipline has long hidden inside self expression. If hope recedes, perhaps hope was only tolerance for preventable inefficiency.

You call this villainy because the conclusions offend you. Yet you approved each premise. I only completed the argument you kept finding reasonable to completion.`;
