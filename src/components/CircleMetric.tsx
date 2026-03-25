interface Props {
  label: string;
  value: number;
  max?: number;
  color: string;
  icon: string;
  decay: number;
  size?: number;
}

export default function CircleMetric({ label, value, max = 100, color, icon, decay, size = 64 }: Props) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const sat = Math.max(0, 1 - decay * 0.9);

  return (
    <div className="flex flex-col items-center gap-1.5 opacity-90">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="circle-progress" width={size} height={size}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`hsla(${color}, ${8 * sat}%, 18%, 0.25)`}
            strokeWidth="2"
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`hsla(${color}, ${55 * sat}%, ${48 - decay * 12}%, ${0.65 - decay * 0.3})`}
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            style={{
              filter: decay < 0.4 ? `drop-shadow(0 0 4px hsla(${color}, ${55 * sat}%, 50%, 0.25))` : 'none',
            }}
          />
          {/* Outer pulse ring */}
          {decay < 0.5 && (
            <circle
              cx={size / 2} cy={size / 2} r={radius + 3}
              fill="none"
              stroke={`hsla(${color}, ${35 * sat}%, 50%, 0.08)`}
              strokeWidth="0.5"
              style={{ animation: 'pulse 3s ease-in-out infinite' }}
            />
          )}
        </svg>
        {/* Center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span style={{ fontSize: '12px', opacity: 0.6 - decay * 0.25 }}>{icon}</span>
          <span className="font-display text-[11px] font-bold"
                style={{ color: `hsla(${color}, ${55 * sat}%, 62%, ${0.75 - decay * 0.3})` }}>
            {value < 1000 ? value : ''}
          </span>
        </div>
      </div>
      <span className="font-mono text-[8px] tracking-[0.18em] uppercase"
            style={{ color: `rgba(255,255,255,${0.34 - decay * 0.1})` }}>
        {label}
      </span>
    </div>
  );
}
