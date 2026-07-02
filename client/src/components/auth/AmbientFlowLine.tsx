import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function AmbientFlowLine() {
  const reduced = useReducedMotion();
  const path =
    "M-40,260 C120,214 220,300 360,255 C500,210 560,120 720,150 C880,180 930,84 1100,112 C1230,134 1320,64 1480,92";

  return (
    <svg
      viewBox="0 0 1440 360"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[46%] w-full opacity-80"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="auth-line" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4A3AEB" />
          <stop offset="1" stopColor="#4F8CFF" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="url(#auth-line)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength={1}
        style={{
          strokeDasharray: 1,
          strokeDashoffset: reduced ? 0 : 1,
          animation: reduced ? undefined : "draw-line 2.4s cubic-bezier(.16,1,.3,1) 0.3s forwards",
        }}
      />
    </svg>
  );
}
