const PARIS = '#2F6FDB'
const MAROC = '#1C8A5A'

export function Logo({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    <span className="lx-logo inline-flex" dir="ltr">
      <svg
        viewBox="0 0 148 40"
        className={className}
        role="img"
        aria-label="SAMT, Paris vers Maroc"
      >
        <Mark />
        <g transform="translate(48.4 6.1) skewX(-11)" fill="currentColor">
          <path d="M10.85 1.9C9.55.55 7.1-.15 4.75.25 2.05.75.4 2.65.6 4.95c.2 2.05 1.9 3.25 4.1 4.05l2.8 1.05c1.35.5 1.85 1.35 1.75 2.3-.15 1.25-1.65 2.1-3.55 2-1.85-.1-3.25-.95-4.05-2.15L.65 14.5c1.25 2.2 3.95 3.55 6.85 3.65 3.4.15 6.5-1.6 6.95-4.55.4-2.55-1.05-4.3-3.75-5.35l-2.85-1.1C6.65 6.65 6 6 6.05 5.25 6.1 4.2 7.15 3.45 8.6 3.25c1.35-.2 2.65.35 3.3 1.3L10.85 1.9Z" />
          <path
            fillRule="evenodd"
            d="M18.4 0 24.7 16.5h-2.8l-1.15-3.15h-4.55L15.05 16.5h-2.75L18.4 0Zm0 5.35-1.65 5.25h3.3L18.4 5.35Z"
          />
          <path d="M26.3 16.5V0h2.9l4.05 10.2L37.3 0h2.9v16.5h-2.6V5.55l-3.2 8.8h-1.3l-3.2-8.8V16.5h-2.6Z" />
          <path d="M42.2 0h12.2v2.7h-4.75V16.5h-2.7V2.7H42.2V0Z" />
        </g>
        <text
          x="49.2"
          y="33.5"
          fill="var(--muted)"
          textAnchor="start"
          direction="ltr"
          fontFamily="var(--font-sans)"
          fontSize="7.2"
          fontWeight="600"
          letterSpacing="1.4"
        >
          PARIS · MAROC
        </text>
      </svg>
    </span>
  )
}

function Mark() {
  return (
    <g>
      <path
        d="M2.4 37.4C6.2 27.2 15.8 18 27.6 12.6l4.4 2.2C20.8 21 12.6 29.4 17 37.4Z"
        fill="currentColor"
      />
      <path
        d="M9.6 37.2C13.2 28 20.8 19.4 29.6 13.8"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="1.55"
        strokeDasharray="2.3 2.15"
        strokeLinecap="round"
      />
      <Pin x={9.6} y={36.6} scale={0.68} fill={PARIS} />
      <Pin x={30.2} y={13.2} scale={1} fill={MAROC} />
    </g>
  )
}

function Pin({
  x,
  y,
  scale,
  fill,
}: {
  x: number
  y: number
  scale: number
  fill: string
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 4.15-6.15A4.7 4.7 0 1 0-4.15-6.15Z" fill={fill} />
      <circle cy="-8.85" r="1.85" fill="var(--bg-elev)" />
    </g>
  )
}
