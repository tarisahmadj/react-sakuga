import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sakuga VFX × React (Next.js) + PostgreSQL",
  description:
    "Ordinary UI controls that react like anime — integrated with Next.js App Router and PostgreSQL (postgres15).",
};

const SAKUGA_SCRIPTS = [
  "/sakuga-vfx/button.js",
  "/sakuga-vfx/toggle.js",
  "/sakuga-vfx/slider.js",
  "/sakuga-vfx/checkbox.js",
  "/sakuga-vfx/radio.js",
  "/sakuga-vfx/input.js",
  "/sakuga-vfx/tabs.js",
  "/sakuga-vfx/progress.js",
  "/sakuga-vfx/rating.js",
  "/sakuga-vfx/toast.js",
  "/sakuga-vfx/tooltip.js",
  "/sakuga-vfx/like-button.js",
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        {SAKUGA_SCRIPTS.map((src) => (
          <Script key={src} src={src} strategy="beforeInteractive" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
