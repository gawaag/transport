import { useSite } from '../context/SiteContext'

export function CorridorSketch() {
  const { ui } = useSite()
  return (
    <div className="mt-10 max-w-lg" dir="ltr">
      <svg
        viewBox="0 0 360 100"
        className="w-full overflow-visible text-[var(--ink)]"
        role="img"
        aria-label={`${ui.corridorFr}, ${ui.corridorEs}, ${ui.corridorBoat}, ${ui.corridorMa}`}
      >
        <path
          d="M58 48h86"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
        <path
          d="M188 48h86"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="3.5 4.5"
          strokeLinecap="round"
        />
        <g transform="translate(214 22)">
          <path d="M2 18c6-2 14-2 22 0" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M6 14h20l-3 5H11Z" fill="var(--accent)" />
          <path d="M16 14V5l8 6H16Z" fill="var(--accent)" />
        </g>
        <text
          x="231"
          y="16"
          textAnchor="middle"
          fill="var(--accent)"
          fontSize="10"
          fontFamily="inherit"
          fontWeight="500"
        >
          {ui.corridorBoat}
        </text>
        <Stop x={36} y={48} label={ui.corridorFr} />
        <Stop x={144} y={48} label={ui.corridorEs} />
        <Stop x={274} y={48} label={ui.corridorMa} />
      </svg>
    </div>
  )
}

function Stop({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-14" width="28" height="28" rx="9" fill="var(--bg-elev)" stroke="var(--line)" />
      <circle cx="14" cy="0" r="3.4" fill="var(--accent)" />
      <text
        x="14"
        y="28"
        textAnchor="middle"
        fill="currentColor"
        fontSize="11"
        fontFamily="inherit"
        fontWeight="500"
      >
        {label}
      </text>
    </g>
  )
}
