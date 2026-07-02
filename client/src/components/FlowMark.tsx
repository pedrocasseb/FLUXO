export default function FlowMark({ className = "h-7 w-7", gradientId = "flow-mark" }: { className?: string; gradientId?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={gradientId} x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4A3AEB" />
          <stop offset="1" stopColor="#4F8CFF" />
        </linearGradient>
      </defs>
      <path
        d="M10 44V28c0-9.4 7.6-17 17-17h11L26.6 22.4C22.9 26.1 18 28.8 12.8 30L10 30.6"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 44v-9.4c9.4-1.6 17.9-6.4 24.4-13.6"
        stroke={`url(#${gradientId})`}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}
