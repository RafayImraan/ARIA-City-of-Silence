import { CitizenProfile } from '../game/data';

interface Props {
  citizen: CitizenProfile;
  status: string;
  faded?: boolean;
  compact?: boolean;
}

export default function CitizenPortrait({ citizen, status, faded = false, compact = false }: Props) {
  return (
    <div
      className="story-panel"
      style={{
        opacity: faded ? 0.62 : 1,
        filter: faded ? 'grayscale(0.78)' : 'none',
      }}
    >
      <div className={`flex ${compact ? 'items-center gap-4' : 'items-start gap-5'}`}>
        <div
          className={`relative shrink-0 overflow-hidden rounded-[22px] border ${compact ? 'h-[86px] w-[74px]' : 'h-[112px] w-[94px]'}`}
          style={{
            background: `radial-gradient(circle at 50% 18%, ${citizen.face.accent}66, rgba(8,12,18,0.98) 68%)`,
            borderColor: 'rgba(255,255,255,0.08)',
            boxShadow: `inset 0 0 30px ${citizen.face.accent}20`,
          }}
        >
          <div className="absolute left-1/2 top-4 h-8 w-8 -translate-x-1/2 rounded-full" style={{ background: citizen.face.skin }} />
          <div className="absolute left-1/2 top-3 h-5 w-10 -translate-x-1/2 rounded-b-full rounded-t-[12px]" style={{ background: citizen.face.hair }} />
          <div className="absolute left-[30px] top-[29px] h-[3px] w-[3px] rounded-full" style={{ background: citizen.face.eye }} />
          <div className="absolute right-[30px] top-[29px] h-[3px] w-[3px] rounded-full" style={{ background: citizen.face.eye }} />
          <div className="absolute left-1/2 top-[38px] h-[2px] w-3 -translate-x-1/2 rounded-full bg-black/25" />
          <div className="absolute left-1/2 top-[50px] h-10 w-12 -translate-x-1/2 rounded-t-[14px]" style={{ background: `linear-gradient(180deg, ${citizen.face.hair}aa, rgba(17,21,28,1))` }} />
          <div className="absolute inset-x-4 bottom-4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${citizen.face.accent}, transparent)` }} />
        </div>

        <div className="flex-1">
          <p className="font-display text-[10px] tracking-[0.32em] uppercase" style={{ color: 'rgba(255,183,64,0.52)' }}>
            Named Citizen
          </p>
          <h4 className={`${compact ? 'text-[28px]' : 'text-[34px]'} mt-1 leading-none`} style={{ color: 'rgba(255,255,255,0.92)' }}>
            {citizen.name}
          </h4>
          <p className="font-mono text-[11px] mt-3 uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.42)' }}>
            {citizen.age} • {citizen.role}
          </p>
          {!compact && (
            <p className="font-serif text-[13px] mt-3 leading-6 max-w-[56ch]" style={{ color: 'rgba(200,206,218,0.5)' }}>
              {citizen.intro}
            </p>
          )}
          <p className={`font-serif ${compact ? 'text-[14px] leading-7 mt-3' : 'text-[16px] leading-8 mt-4'} max-w-[60ch]`} style={{ color: 'rgba(225,225,232,0.72)' }}>
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
