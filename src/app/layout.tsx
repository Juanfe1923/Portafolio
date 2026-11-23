import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackgroundCanvas from "@/components/BackgroundCanvas";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Juan Felipe Uribe Romero — Desarrollador Full Stack",
  description:
    "Portafolio de Juan Felipe Uribe Romero, Desarrollador Full Stack en Medellín, Colombia. Desarrollo enfocado en rendimiento, seguridad, diseño y experiencia de usuario.",
  keywords: [
    "Juan Felipe Uribe Romero",
    "Desarrollador Full Stack",
    "React",
    "Django",
    "Next.js",
    "Medellín",
    "Sigif",
  ],
  authors: [{ name: "Juan Felipe Uribe Romero" }],
  openGraph: {
    title: "Juan Felipe Uribe Romero — Desarrollador Full Stack",
    description:
      "Desarrollo enfocado en rendimiento, seguridad, diseño y experiencia de usuario.",
    type: "website",
    locale: "es_CO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${jakarta.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <BackgroundCanvas />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}