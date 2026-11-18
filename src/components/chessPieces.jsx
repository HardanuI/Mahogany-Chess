/**
 * Minimalist, flat architectural silhouette chess piece set ("Arbiter Neo").
 * Designed to match the warm cream (#FAF7F0) and deep charcoal (#1A1A1A) palette.
 */

const PALETTE = {
  w: {
    fill: '#FAF7F0',
    stroke: '#1F1B17',
    detail: 'rgba(26, 26, 26, 0.25)',
    eye: '#1F1B17',
  },
  b: {
    fill: '#1A1A1A',
    stroke: '#141210',
    detail: 'rgba(245, 242, 235, 0.28)',
    eye: '#FAF7F0',
  },
}

function PieceWrapper({ squareWidth, isDragging, children }) {
  return (
    <div
      style={{
        width: squareWidth,
        height: squareWidth,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        transform: isDragging ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <svg
        viewBox="0 0 45 45"
        style={{
          width: '82%',
          height: '82%',
          display: 'block',
          overflow: 'visible',
          filter: isDragging
            ? 'drop-shadow(0 12px 16px rgba(26, 26, 26, 0.35))'
            : 'drop-shadow(0 2px 3px rgba(26, 26, 26, 0.18))',
        }}
      >
        {children}
      </svg>
    </div>
  )
}

function PawnSVG({ color }) {
  const c = PALETTE[color]
  return (
    <g
      fill={c.fill}
      stroke={c.stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Head */}
      <circle cx="22.5" cy="13.5" r="4.6" />
      {/* Collar + tapered body */}
      <path d="M17.5 19.2 H27.5 C26.3 23.4 26.8 27.6 29 31.2 C31.4 32.3 33 34.1 33 36.2 H12 C12 34.1 13.6 32.3 16 31.2 C18.2 27.6 18.7 23.4 17.5 19.2 Z" />
      {/* Base plinth */}
      <rect x="10.5" y="35.8" width="24" height="3" rx="1.5" />
      {/* Minimalist interior collar & base detail */}
      <line x1="18.2" y1="20.8" x2="26.8" y2="20.8" stroke={c.detail} strokeWidth="1.2" />
      <line x1="14.5" y1="33.6" x2="30.5" y2="33.6" stroke={c.detail} strokeWidth="1.2" />
    </g>
  )
}

function RookSVG({ color }) {
  const c = PALETTE[color]
  return (
    <g
      fill={c.fill}
      stroke={c.stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Battlements + tower shaft */}
      <path d="M12.5 10 H16.8 V13.2 H19.8 V10 H25.2 V13.2 H28.2 V10 H32.5 V16.4 L29.8 18.8 V31.2 L32.5 33.8 V36 H12.5 V33.8 L15.2 31.2 V18.8 L12.5 16.4 Z" />
      {/* Base plinth */}
      <rect x="10" y="35.8" width="25" height="3" rx="1.5" />
      {/* Interior architectural lines */}
      <line x1="15.5" y1="18.6" x2="29.5" y2="18.6" stroke={c.detail} strokeWidth="1.2" />
      <line x1="15.2" y1="31.4" x2="29.8" y2="31.4" stroke={c.detail} strokeWidth="1.2" />
    </g>
  )
}

function KnightSVG({ color }) {
  const c = PALETTE[color]
  return (
    <g
      fill={c.fill}
      stroke={c.stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Geometric Neo horse profile */}
      <path d="M13 36 C13 29.8 17.8 27.6 19.5 23.2 C16.4 24.4 13.8 26.2 11.4 25.8 C9.8 25.5 9.2 23.6 10.2 21.6 C11.6 18.8 14.5 15.2 16.5 13.2 L16.2 8.8 L20.4 11.2 C22.2 10.6 24.2 10.5 26 11 C31.8 12.6 34.6 19.2 33 36 Z" />
      {/* Base plinth */}
      <rect x="10" y="35.8" width="25" height="3" rx="1.5" />
      {/* Eye detail */}
      <circle cx="17.2" cy="15.8" r="1.25" fill={c.eye} stroke="none" />
      {/* Base accent line */}
      <line x1="14.5" y1="33.6" x2="30.8" y2="33.6" stroke={c.detail} strokeWidth="1.2" />
    </g>
  )
}

function BishopSVG({ color }) {
  const c = PALETTE[color]
  return (
    <g
      fill={c.fill}
      stroke={c.stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top orb finial */}
      <circle cx="22.5" cy="8.8" r="2.1" />
      {/* Mitre dome + tapered base */}
      <path d="M22.5 11.4 C15.2 15.2 14.2 23.2 17.4 28.6 L14.5 33.4 L12.2 36 H32.8 L30.5 33.4 L27.6 28.6 C30.8 23.2 29.8 15.2 22.5 11.4 Z" />
      {/* Base plinth */}
      <rect x="10" y="35.8" width="25" height="3" rx="1.5" />
      {/* Minimalist cross & collar */}
      <line x1="22.5" y1="16.4" x2="22.5" y2="21.2" stroke={c.detail} strokeWidth="1.35" />
      <line x1="20.1" y1="18.8" x2="24.9" y2="18.8" stroke={c.detail} strokeWidth="1.35" />
      <line x1="17.6" y1="28.8" x2="27.4" y2="28.8" stroke={c.detail} strokeWidth="1.2" />
      <line x1="15" y1="33.4" x2="30" y2="33.4" stroke={c.detail} strokeWidth="1.2" />
    </g>
  )
}

function QueenSVG({ color }) {
  const c = PALETTE[color]
  return (
    <g
      fill={c.fill}
      stroke={c.stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Five-pointed coronet */}
      <path d="M9.5 16.2 L15.2 26.8 L16.6 13.8 L22.5 25.8 L28.4 13.8 L29.8 26.8 L35.5 16.2 L32.2 33.4 L33 36 H12 L12.8 33.4 Z" />
      {/* Crown pearls */}
      <circle cx="9" cy="14.2" r="1.7" />
      <circle cx="16.5" cy="11.8" r="1.7" />
      <circle cx="22.5" cy="10.8" r="1.8" />
      <circle cx="28.5" cy="11.8" r="1.7" />
      <circle cx="36" cy="14.2" r="1.7" />
      {/* Base plinth */}
      <rect x="10" y="35.8" width="25" height="3" rx="1.5" />
      {/* Interior band detail */}
      <path d="M13.8 30.2 Q22.5 28.4 31.2 30.2" fill="none" stroke={c.detail} strokeWidth="1.2" />
      <line x1="13.5" y1="33.5" x2="31.5" y2="33.5" stroke={c.detail} strokeWidth="1.2" />
    </g>
  )
}

function KingSVG({ color }) {
  const c = PALETTE[color]
  return (
    <g
      fill={c.fill}
      stroke={c.stroke}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Apex cross */}
      <line x1="22.5" y1="6.2" x2="22.5" y2="12.4" strokeWidth="1.8" />
      <line x1="19.6" y1="9" x2="25.4" y2="9" strokeWidth="1.8" />
      {/* Royal crown silhouette */}
      <path d="M22.5 12.6 C19.6 12.6 18.4 15.6 19.6 19.4 C15.2 14.8 8.8 16.8 9.8 23.2 C10.4 27.2 13 30.6 13 33.6 L12 36 H33 L32 33.6 C32 30.6 34.6 27.2 35.2 23.2 C36.2 16.8 29.8 14.8 25.4 19.4 C26.6 15.6 25.4 12.6 22.5 12.6 Z" />
      {/* Base plinth */}
      <rect x="10" y="35.8" width="25" height="3" rx="1.5" />
      {/* Interior band detail */}
      <path d="M13.8 30.2 Q22.5 28.2 31.2 30.2" fill="none" stroke={c.detail} strokeWidth="1.2" />
      <line x1="13.5" y1="33.5" x2="31.5" y2="33.5" stroke={c.detail} strokeWidth="1.2" />
    </g>
  )
}

const PIECE_RENDERERS = {
  P: PawnSVG,
  R: RookSVG,
  N: KnightSVG,
  B: BishopSVG,
  Q: QueenSVG,
  K: KingSVG,
}

export const CUSTOM_PIECES = Object.fromEntries(
  ['w', 'b'].flatMap((color) =>
    Object.entries(PIECE_RENDERERS).map(([type, Component]) => [
      `${color}${type}`,
      ({ squareWidth, isDragging }) => (
        <PieceWrapper squareWidth={squareWidth} isDragging={isDragging}>
          <Component color={color} />
        </PieceWrapper>
      ),
    ]),
  ),
)
