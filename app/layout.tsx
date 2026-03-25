import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Providers from "./Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitCoinBoard",
  description: "Bitcoin network dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden`} style={{ backgroundColor: 'var(--theme-primary)' }}>
        <Providers>
          <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--theme-primary)' }}>
            {/* 왼쪽 고정 사이드바 */}
            <Sidebar />

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-y-auto overflow-x-hidden">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
