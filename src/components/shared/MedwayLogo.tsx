import Image from "next/image";

interface MedwayLogoProps {
  className?: string;
}

export function MedwayLogo({ className = "w-8 h-8" }: MedwayLogoProps) {
  return (
    <Image
      src="/icon.png"
      alt="Medway"
      width={64}
      height={64}
      className={className}
      style={{ objectFit: "contain" }}
      priority
    />
  );
}
