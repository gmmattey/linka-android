import type { ChartData } from '../../lib/historyChart'

type Metrica = 'download' | 'upload'

interface HistoryChartViewProps {
  chart: ChartData
  metric: Metrica
  onSelectMetric: (m: Metrica) => void
}

export function HistoryChartView({ chart, metric, onSelectMetric }: HistoryChartViewProps) {
  const chartColor = metric === 'download' ? 'var(--phase-download)' : 'var(--phase-upload)'

  const chipStyle = (m: Metrica) => ({
    background: metric === m ? 'var(--accent)' : 'var(--bg-secondary)',
    color: metric === m ? '#fff' : 'var(--text-primary)',
  })

  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)' }}>
      <div className="mb-3 flex items-center gap-2">
        <button onClick={() => onSelectMetric('download')} className="rounded-full px-3 py-1.5 label-medium" style={chipStyle('download')}>
          Download
        </button>
        <button onClick={() => onSelectMetric('upload')} className="rounded-full px-3 py-1.5 label-medium" style={chipStyle('upload')}>
          Upload
        </button>
      </div>
      <svg viewBox="0 0 640 220" className="block w-full" style={{ overflow: 'visible' }}>
        {chart.gridLines.map((g, i) => (
          <g key={i}>
            <line x1={40} y1={g.y} x2={620} y2={g.y} stroke="var(--border)" strokeWidth={1} opacity={0.18} />
            <text x={34} y={g.y} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="var(--text-tertiary)">
              {g.label}
            </text>
          </g>
        ))}
        <polyline points={chart.polyline} fill="none" stroke={chartColor} strokeWidth={2} opacity={0.6} />
        {chart.points.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r={4} fill={chartColor} />
        ))}
        <text x={40} y={214} fontSize={10} fill="var(--text-tertiary)">
          {chart.fromLabel}
        </text>
        <text x={620} y={214} textAnchor="end" fontSize={10} fill="var(--text-tertiary)">
          {chart.toLabel}
        </text>
      </svg>
    </div>
  )
}
