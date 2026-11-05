export default function NeuroCareLogo({ compact = false, className = "", wordmarkClassName = "" }) {
  return (
    <span className={`inline-flex min-w-0 items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label="NeuroCare"
        className="h-10 w-10 shrink-0"
        fill="none"
      >
        <defs>
          <linearGradient id="neurocare-mark" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#818cf8" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path d="M24 5.5v8M24 34.5v8M5.5 24h8M34.5 24h8M10.9 10.9l5.7 5.7m14.8 14.8 5.7 5.7m0-26.2-5.7 5.7m-14.8 14.8-5.7 5.7" stroke="url(#neurocare-mark)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="24" r="8.5" fill="url(#neurocare-mark)" />
        <circle cx="24" cy="24" r="3" fill="white" />
        <circle cx="24" cy="5.5" r="2.5" fill="#a5b4fc" />
        <circle cx="42.5" cy="24" r="2.5" fill="#8b5cf6" />
        <circle cx="24" cy="42.5" r="2.5" fill="#8b5cf6" />
        <circle cx="5.5" cy="24" r="2.5" fill="#a5b4fc" />
      </svg>
      {!compact && (
        <span className={`whitespace-nowrap text-lg font-bold text-slate-800 dark:text-slate-100 ${wordmarkClassName}`}>
          NeuroCare
        </span>
      )}
    </span>
  );
}