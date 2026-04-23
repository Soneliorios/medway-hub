interface MedwayLogoProps {
  className?: string;
}

export function MedwayLogo({ className = "w-8 h-8" }: MedwayLogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* M shape stylized */}
      <rect width="48" height="48" rx="12" fill="#01CFB5" />
      <path
        d="M10 34V14l8 12 6-8 6 8 8-12v20"
        stroke="#00205B"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
