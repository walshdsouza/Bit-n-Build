import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GestureSync AI — Real-Time ASL Sign Language Translation",
  description:
    "Transform any spoken audio, recorded video, or live conferencing call into real-time, expressive 3D American Sign Language avatars via an ultra-low-latency LLM semantic glossing pipeline.",
  keywords: ["ASL", "sign language", "accessibility", "AI", "deaf", "HoH"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0A0A0F] font-body-md text-body-md text-on-surface min-h-screen antialiased selection:bg-primary selection:text-on-primary">
        {children}
      </body>
    </html>
  );
}
