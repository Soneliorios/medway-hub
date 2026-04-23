import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";
import { OrbBackground } from "@/components/shared/OrbBackground";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Medway Hub",
  description: "Plataforma centralizada de projetos Medway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body
        className="antialiased"
        style={{
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
          backgroundColor: "var(--mw-bg-base)",
          color: "var(--mw-text-primary)",
        }}
      >
        <Providers>
          <OrbBackground />
          <div className="relative" style={{ zIndex: 1 }}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
