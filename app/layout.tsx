import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arts Council Wheel Chooser",
  description: "Made by Yang Xue for the John Fraser Arts Council with ❤️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
