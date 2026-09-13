import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://unmute-ai.vercel.app"),
  applicationName: "UNMUTE",
  title: "UNMUTE — Speech and Captions to ASL",
  description:
    "Translate English speech and captions into an ASL signing plan with a 3D avatar. Import media, review the transcript, or share browser-tab audio for live meetings.",
  keywords: ["ASL", "sign language", "accessibility", "AI", "deaf", "HoH"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0F] font-body-md text-body-md text-on-surface min-h-screen antialiased selection:bg-primary selection:text-on-primary">
        {children}
      </body>
    </html>
  );
}
