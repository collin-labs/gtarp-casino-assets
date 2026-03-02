import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Blackout Casino — GTA RP",
  description: "Painel flutuante premium para FiveM NUI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
