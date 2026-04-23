"use client";

export function OrbBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Teal orb — top right */}
      <div
        className="absolute rounded-full animate-orb-1"
        style={{
          width: 800,
          height: 800,
          top: "-200px",
          right: "-200px",
          background:
            "radial-gradient(circle, rgba(1,207,181,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Navy orb — bottom left */}
      <div
        className="absolute rounded-full animate-orb-2"
        style={{
          width: 1000,
          height: 1000,
          bottom: "-300px",
          left: "-300px",
          background:
            "radial-gradient(circle, rgba(0,32,91,0.12) 0%, transparent 70%)",
        }}
      />
      {/* Small teal orb — center left */}
      <div
        className="absolute rounded-full animate-orb-3"
        style={{
          width: 500,
          height: 500,
          top: "40%",
          left: "10%",
          background:
            "radial-gradient(circle, rgba(1,207,181,0.05) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
