import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/lib/use-app-state";
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: "Publishing OS - Demo",
  description: "A comprehensive publishing workflow management system for indie authors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-zinc-50">
        <AppStateProvider>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </AppStateProvider>
      </body>
    </html>
  );
}
