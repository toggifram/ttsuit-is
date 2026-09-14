const MARK = "#3d6aa0";
const LINE = "#043034";

function Marker({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill="white" stroke={MARK} strokeWidth="1.5" />
      <text
        x={x}
        y={y + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={MARK}
        fontSize="11"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="600"
      >
        {n}
      </text>
    </g>
  );
}

function CoatButton({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="5.4" stroke={LINE} strokeWidth="1.35" fill="white" />
      <circle cx={cx} cy={cy} r="1.5" fill={LINE} />
    </g>
  );
}

/** Double-breasted peacoat fashion flat with numbered measure points. */
export function PeacoatMeasureDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Útlínamynd af peacoat. 1 brjóst, 2 mitta, 3 axlir, 4 ermi, 5 lengd."
    >
      {/* Left sleeve */}
      <path
        d="M114 92 L62 104 L48 122 L40 252 C39 264 48 270 60 268 L96 258 L114 176 Z"
        fill="white"
        stroke={LINE}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Right sleeve */}
      <path
        d="M286 92 L338 104 L352 122 L360 252 C361 264 352 270 340 268 L304 258 L286 176 Z"
        fill="white"
        stroke={LINE}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Body */}
      <path
        d="M114 92 L168 82 L178 58 C188 48 212 48 222 58 L232 82 L286 92
           L286 176 L278 438 C276 450 266 456 252 456 H148
           C134 456 124 450 122 438 L114 176 Z"
        fill="white"
        stroke={LINE}
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Fold-over collar */}
      <path
        d="M178 58 C188 50 212 50 222 58 L234 84 L200 76 L166 84 Z"
        fill="white"
        stroke={LINE}
        strokeWidth="1.55"
        strokeLinejoin="round"
      />
      <path
        d="M182 62 C190 70 210 70 218 62"
        stroke={LINE}
        strokeWidth="1.15"
        strokeLinecap="round"
      />

      {/* Peak lapels meeting in a V */}
      <path
        d="M166 84 L120 158 L174 186 L176 132 C174 108 170 92 166 84 Z"
        fill="white"
        stroke={LINE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M234 84 L280 158 L226 186 L224 132 C226 108 230 92 234 84 Z"
        fill="white"
        stroke={LINE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M172 92 C176 122 176 152 174 182"
        stroke={LINE}
        strokeWidth="1.1"
        opacity="0.75"
      />
      <path
        d="M228 92 C224 122 224 152 226 182"
        stroke={LINE}
        strokeWidth="1.1"
        opacity="0.75"
      />

      {/* Double-breasted wrap edges */}
      <path
        d="M174 186 C164 210 158 250 158 456"
        stroke={LINE}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M226 186 C236 210 242 250 242 456"
        stroke={LINE}
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.85"
      />

      <CoatButton cx={150} cy={198} />
      <CoatButton cx={150} cy={240} />
      <CoatButton cx={150} cy={282} />
      <CoatButton cx={150} cy={324} />
      <CoatButton cx={250} cy={218} />
      <CoatButton cx={250} cy={260} />
      <CoatButton cx={250} cy={302} />
      <CoatButton cx={250} cy={344} />

      {/* Breast welt */}
      <path
        d="M250 198 h34"
        stroke={LINE}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M250 194 h34"
        stroke={LINE}
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Hip welts */}
      <path
        d="M128 338 h46"
        stroke={LINE}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M128 333 h46"
        stroke={LINE}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M226 338 h46"
        stroke={LINE}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M226 333 h46"
        stroke={LINE}
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Cuff seams */}
      <path d="M44 246 h48" stroke={LINE} strokeWidth="1.2" />
      <path d="M308 246 h48" stroke={LINE} strokeWidth="1.2" />

      {/* 3 — shoulders */}
      <path
        d="M62 100 H338"
        stroke={MARK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Marker n={3} x={352} y={100} />

      {/* 1 — chest */}
      <ellipse
        cx="200"
        cy="214"
        rx="86"
        ry="17"
        stroke={MARK}
        strokeWidth="1.4"
      />
      <Marker n={1} x={296} y={214} />

      {/* 2 — waist */}
      <path
        d="M122 316 H278"
        stroke={MARK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Marker n={2} x={296} y={316} />

      {/* 4 — sleeve */}
      <path
        d="M286 92 C328 108 348 150 354 198 C358 236 356 268 348 268"
        stroke={MARK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M340 262 l8 12 10-9"
        stroke={MARK}
        strokeWidth="1.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Marker n={4} x={378} y={178} />

      {/* 5 — length */}
      <path
        d="M200 42 V456"
        stroke={MARK}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeDasharray="4 5"
      />
      <path
        d="M194 456 h12"
        stroke={MARK}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <Marker n={5} x={200} y={484} />
    </svg>
  );
}
