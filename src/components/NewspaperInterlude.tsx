import { HeadlineCard } from '../game/data';

interface Props {
  card: HeadlineCard;
  cycleIndex: number;
  onContinue: () => void;
}

export default function NewspaperInterlude({ card, cycleIndex, onContinue }: Props) {
  const degradation = Math.min(0.85, cycleIndex * 0.09);

  return (
    <div className="story-panel">
      <div
        className="rounded-[28px] border p-6 md:p-8 shadow-[0_28px_70px_rgba(0,0,0,0.26)]"
        style={{
          background: `linear-gradient(180deg, rgba(240,232,215,${0.95 - degradation * 0.25}), rgba(195,188,177,${0.88 - degradation * 0.3}))`,
          borderColor: `rgba(65,48,32,${0.16 + degradation * 0.18})`,
          filter: `saturate(${1 - degradation * 0.35}) contrast(${1 - degradation * 0.08})`,
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
          <p className="font-display text-[10px] tracking-[0.4em] uppercase text-black/65">{card.banner}</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-black/50">{`Edition ${String(cycleIndex + 1).padStart(2, '0')}`}</p>
        </div>

        <div className="pt-5">
          <h3
            className="font-serif text-[30px] md:text-[50px] leading-[0.98] tracking-[-0.03em]"
            style={{
              color: `rgba(22,18,15,${0.92 - degradation * 0.2})`,
              letterSpacing: `${Math.max(0, degradation * 0.6 - 0.1)}px`,
            }}
          >
            {card.headline}
          </h3>
          <p className="font-mono text-[12px] mt-4 uppercase tracking-[0.12em]" style={{ color: 'rgba(30,22,18,0.7)' }}>
            {card.subhead}
          </p>
          <p className="font-serif text-[15px] leading-8 mt-6 max-w-2xl" style={{ color: 'rgba(24,20,18,0.72)' }}>
            {card.body}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-black/10 pt-4">
          <p className="font-mono text-[10px] tracking-[0.14em]" style={{ color: 'rgba(30,22,18,0.45)' }}>
            {cycleIndex >= 8 ? 'The paper is mostly press release now.' : 'The paper still remembers how to question things.'}
          </p>
          <button onClick={onContinue} className="btn-ghost" style={{ color: 'rgba(25,22,18,0.65)', borderColor: 'rgba(25,22,18,0.18)' }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
