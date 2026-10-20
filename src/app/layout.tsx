import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

const jakarta = localFont({
  src: "../../public/fonts/PlusJakartaSans.ttf",
  variable: "--font-jakarta",
  display: "swap",
  weight: "200 800",
});
export const metadata: Metadata = {
  title: {
    default: "SMA Widya Darma — Profil sekolah",
    template: "%s — SMA Widya Darma",
  },
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} antialiased`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Lewati ke konten
        </a>
        {children}
        {process.env.NODE_ENV === "development" && (
          <Script id="figma-capture-preparation" strategy="afterInteractive">{`
            if (location.hash.includes('figmacapture=')) {
              const style = document.createElement('style');
              style.textContent = 'html{scroll-behavior:auto!important}body{min-width:1440px}main div[style*="opacity"]{opacity:1!important;transform:none!important}nextjs-portal{display:none!important}';
              document.head.appendChild(style);
            }
          `}</Script>
        )}
        {process.env.NODE_ENV === "development" && (
          <Script
            src="https://mcp.figma.com/mcp/html-to-design/capture.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
