import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Substitute - Chef's Thesaurus",
  description: "Find the perfect cooking substitutions with precise measurements and helpful tips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
