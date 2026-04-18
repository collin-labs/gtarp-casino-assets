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
    <html lang="pt-BR" style={{ overflow: "hidden", height: "100%", margin: 0, background: "transparent" }}>
      <head>
        {/* Detecta ambiente antes do React: browser recebe #000 (evita flash), FiveM fica transparente */}
        <script dangerouslySetInnerHTML={{ __html: `if(!window.location.href.includes('cfx-nui-')){document.documentElement.style.background='#0a0a0a';}` }} />
      </head>
      <body style={{ overflow: "hidden", height: "100%", margin: 0, background: "transparent" }}>
        {children}
      </body>
    </html>
  );
}
