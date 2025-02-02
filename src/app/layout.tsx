import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: `Ramadan Timer | ${new Date().getFullYear()}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
