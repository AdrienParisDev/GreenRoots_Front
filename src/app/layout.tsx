import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/index.css";
import Header from "@/components/Header";
import Footer from "@/components/Commun/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenRoots Boutique | Offrez un arbre, soutenez la reforestation",
  description:
    "GreenRoots est une boutique en ligne écoresponsable qui permet de financer la plantation d’arbres. Participez simplement à la reforestation et contribuez à l'environnement.",
  icons: {
    icon: "/logo_green.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
