import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Providers } from "@/components/providers";

import { Toaster } from "@workspace/ui/components/sonner";

import "@workspace/ui/globals.css";
import { DashboardLayout } from "@/modules/ui/layout";
import { ModalProvider } from "@/components/modal-provider";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <NuqsAdapter>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
          >
            <Providers>
              <DashboardLayout>
                {children}
                <ModalProvider />
                <Toaster duration={3000} />
              </DashboardLayout>
            </Providers>
          </body>
        </html>
      </NuqsAdapter>
    </TRPCReactProvider>
  );
}
