import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";

export const metadata: Metadata = {
  title: "DOHA Deck",
  description: "Developer project deck archive platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
