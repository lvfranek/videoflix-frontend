import type { ReactNode } from 'react'

// Small inline icons for the player and rows

type IconProps = { size?: number }

function Svg({ size = 24, children }: IconProps & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const PlayIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
  </Svg>
)

export const PauseIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" />
    <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" />
  </Svg>
)

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" {...stroke} strokeWidth={2.5} />
  </Svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 5l7 7-7 7" {...stroke} strokeWidth={2.5} />
  </Svg>
)

export const Rewind10Icon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12a8 8 0 1 0 2.3-5.6" {...stroke} />
    <path d="M4 4v4h4" {...stroke} />
    <text x="12" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor">
      10
    </text>
  </Svg>
)

export const Forward10Icon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.3-5.6" {...stroke} />
    <path d="M20 4v4h-4" {...stroke} />
    <text x="12" y="15.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor">
      10
    </text>
  </Svg>
)

export const VolumeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" {...stroke} />
  </Svg>
)

export const MuteIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" {...stroke} />
  </Svg>
)

export const FullscreenIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" {...stroke} />
  </Svg>
)

export const ExitFullscreenIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5" {...stroke} />
  </Svg>
)
