import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Wootad - Premier Solutions for SMEs in India and Beyond",
  description: "As a premier solutions provider, we cater to the needs of small and medium-sized enterprises across India and worldwide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
