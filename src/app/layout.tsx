import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/app/components/providers/theme-provider";
import { Toaster } from "@/app/components/ui/toaster";
import { SocketProvider } from "@/app/components/providers/socket-provider";
import { QueryProvider } from "@/app/components/providers/query-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnLyne | Team Collaboration Tool",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-[hsl(287,60%,95%)] dark:bg-[hsl(287,60%,5%)]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="Onlyne-theme"
          >
            <SocketProvider>
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
