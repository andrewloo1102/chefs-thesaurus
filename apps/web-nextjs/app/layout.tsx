import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chef's Thesaurus",
  description: "Find the perfect cooking substitutions with precise measurements and helpful tips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
