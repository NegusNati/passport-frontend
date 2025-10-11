import * as React from 'react'

type HeroWaveShaderProps = {
  /** Base accent color (hex). Defaults to the green/teal in your image. */
  color?: string // e.g. "#009966"
  /** Overall size of the SVG (you can also control via CSS). */
  width?: number | string
  height?: number | string
  /** Thickness of the ribbon. */
  strokeWidth?: number
  /** Optional custom path data if you want to change the curve. */
  path?: string
  /** Extra class names for positioning (e.g. absolute inset-0). */
  className?: string
  style?: React.CSSProperties
}

/* ---------------- Color helpers (hex → HSL → adjustments) ---------------- */

function clamp(n: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, n))
}

function hexToRgb(hex: string) {
  const s = hex.replace('#', '')
  const r = parseInt(s.slice(0, 2), 16)
  const g = parseInt(s.slice(2, 4), 16)
  const b = parseInt(s.slice(4, 6), 16)
  return { r, g, b }
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h *= 60
  }
  return { h, s: s * 100, l: l * 100 }
}

function hslToCss(h: number, s: number, l: number) {
  return `hsl(${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%)`
}

function adjustLightness(hex: string, delta: number) {
  const { r, g, b } = hexToRgb(hex)
  const { h, s, l } = rgbToHsl(r, g, b)
  return hslToCss(h, s, clamp(l + delta))
}

/* ---------------------------- Subcomponents ----------------------------- */

const RibbonGlow: React.FC<{
  id: string
  path: string
  stroke: string
  strokeWidth: number
}> = ({ id, path, stroke, strokeWidth }) => (
  <g filter={`url(#glow-${id})`} opacity={0.9}>
    <path
      d={path}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </g>
)

const RibbonBody: React.FC<{
  id: string
  path: string
  strokeWidth: number
}> = ({ id, path, strokeWidth }) => (
  <path
    d={path}
    fill="none"
    stroke={`url(#grad-${id})`}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    vectorEffect="non-scaling-stroke"
    opacity={0.98}
  />
)

const RibbonHighlight: React.FC<{
  id: string
  path: string
  stroke: string
  strokeWidth: number
}> = ({ id, path, stroke, strokeWidth }) => (
  <g style={{ mixBlendMode: 'screen' }} opacity={0.75} filter={`url(#soft-${id})`}>
    <path
      d={path}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
    />
  </g>
)

/* ----------------------------- Main export ------------------------------ */

export const HeroWaveShader: React.FC<HeroWaveShaderProps> = ({
  color = '#009966',
  width = '100%',
  height = 600,
  strokeWidth = 220,
  className,
  style,
  path, // optional override
}) => {
  // Stable unique id for gradients/filters
  const uid = React.useMemo(() => Math.random().toString(36).slice(2, 10), [])

  // Default curve closely matching the reference
  const d =
    path ??
    // Start slightly off-canvas left, sweep up then down
    'M -60 340 C 160 90, 680 40, 920 210 C 1120 340, 1200 430, 1500 470'

  // Derived colors for gradient + glow
  const base = color
  const lighter = adjustLightness(color, 16) // minty center
  const darker = adjustLightness(color, -8) // subtle shading
  const glowStrong = adjustLightness(color, 20)
  const glowSoft = adjustLightness(color, 36)
  const highlight = adjustLightness(color, 28)

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 1440 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: 'block', ...style }}
      aria-hidden
    >
      <defs>
        {/* Gradient along the path (left→right) */}
        <linearGradient
          id={`grad-${uid}`}
          x1="-60"
          y1="0"
          x2="1500"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={lighter} />
          <stop offset="55%" stopColor={base} />
          <stop offset="100%" stopColor={darker} />
        </linearGradient>

        {/* Softening blur for the inner highlight */}
        <filter id={`soft-${uid}`} x="-40%" y="-40%" width="180%" height="200%">
          <feGaussianBlur stdDeviation="2.5" edgeMode="duplicate" />
        </filter>

        {/* Multi-ring neon glow (stacked drop shadows) */}
        <filter
          id={`glow-${uid}`}
          x="-60%"
          y="-80%"
          width="220%"
          height="260%"
          filterUnits="objectBoundingBox"
        >
          {/* Tight bright rim */}
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="4"
            floodColor={glowStrong}
            floodOpacity="0.95"
          />
          {/* Mid halo */}
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="10"
            floodColor={glowStrong}
            floodOpacity="0.55"
          />
          {/* Outer halo */}
          <feDropShadow dx="0" dy="0" stdDeviation="18" floodColor={glowSoft} floodOpacity="0.35" />
          {/* Extra wide bloom */}
          <feDropShadow dx="0" dy="0" stdDeviation="28" floodColor={glowSoft} floodOpacity="0.22" />
        </filter>
      </defs>

      {/* Layer 1: glow */}
      <RibbonGlow id={uid} path={d} stroke={base} strokeWidth={strokeWidth} />

      {/* Layer 2: solid ribbon */}
      <RibbonBody id={uid} path={d} strokeWidth={strokeWidth} />

      {/* Layer 3: inner highlight (narrower, blended) */}
      <RibbonHighlight
        id={uid}
        path={d}
        stroke={highlight}
        strokeWidth={Math.max(20, strokeWidth * 0.55)}
      />
    </svg>
  )
}

export default HeroWaveShader
