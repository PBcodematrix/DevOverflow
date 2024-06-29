/* eslint-disable camelcase */
import React from "react";
import { ClerkProvider, SignedIn } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ThemeProvider from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk  ",
});

export const metadata: Metadata = {
  title: "Devflow",
  description:
    "A community-driven platform for asking and answering programming questions.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary -text-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>
            <SignedIn>
              {/* <UserButton /> */}
            </SignedIn>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
