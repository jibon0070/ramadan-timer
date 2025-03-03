import type { Metadata } from "next";
import "./globals.scss";
import { Toaster } from "@/components/ui/toaster";
import Providers from "./providers";

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
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
