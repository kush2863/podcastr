import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import  ConvexClerkProvider  from "./providers/ConvexClerkProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generate Podcasts using AI",
  icons:{
    icon: '/icons/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  className="dark" lang="en">
      <body className={inter.className}>
       <ConvexClerkProvider>
          {children}  
        </ConvexClerkProvider> 
        </body>
    </html>
  );
}
