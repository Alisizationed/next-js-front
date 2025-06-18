import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import CustomNavbar from "@/components/CustomNavbar";
import Footer from "@/components/ui/footer";
import Wrapper from "@/components/Wrapper";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "Created at CTIF practice 2025",
  icons: [{ rel: "icon", url: "/logo_cookie.png" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Providers>
          <Wrapper>
            <CustomNavbar />
            {children}
            <Footer />
          </Wrapper>
        </Providers>
      </body>
    </html>
  );
}
