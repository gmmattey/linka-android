import { GAUGE_ARC_LEN, GAUGE_ARC_PATH, GAUGE_TICKS, pointOnArc } from '../../lib/gaugeMath'

interface SpeedGaugeProps {
  fraction: number
  color: string
  centerValue: string
  centerUnit: string
  showTicks: boolean
  pulse: boolean
}

export function SpeedGauge({ fraction, color, centerValue, centerUnit, showTicks, pulse }: SpeedGaugeProps) {
  const needle = pointOnArc(132, fraction)

  return (
    <div className="relative" style={{ width: 'min(92vw, 520px)', aspectRatio: '320 / 190' }}>
      <svg viewBox="0 0 320 190" className="absolute inset-0 block h-full w-full">
        {showTicks &&
          GAUGE_TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--border)" strokeWidth={2} opacity={0.35} />
          ))}
        <path d={GAUGE_ARC_PATH} stroke="var(--border)" opacity={0.22} strokeWidth={20} fill="none" strokeLinecap="round" />
        <path
          d={GAUGE_ARC_PATH}
          stroke={color}
          strokeWidth={20}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={GAUGE_ARC_LEN}
          strokeDashoffset={GAUGE_ARC_LEN * (1 - fraction)}
          style={{ transition: 'stroke-dashoffset 250ms ease-out' }}
        />
        <circle cx={needle.x} cy={needle.y} r={17} fill={color} className={pulse ? 'sq-pulse-dot' : ''} style={!pulse ? { opacity: 0.22 } : undefined} />
        <circle
          cx={needle.x}
          cy={needle.y}
          r={8}
          fill={color}
          stroke="var(--bg-primary)"
          strokeWidth={3}
          style={{ transition: 'cx 250ms ease-out, cy 250ms ease-out' }}
        />
      </svg>
      <div className="absolute bottom-1.5 left-0 right-0 flex flex-col items-center">
        <div className="font-bold" style={{ font: '700 clamp(40px,9vw,68px)/1 var(--font-sans)', color: 'var(--text-primary)' }}>
          {centerValue}
        </div>
        <div className="mt-0.5 title-medium" style={{ color: 'var(--text-secondary)' }}>
          {centerUnit}
        </div>
      </div>
    </div>
  )
}
