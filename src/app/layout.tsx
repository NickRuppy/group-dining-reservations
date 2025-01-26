import "./globals.css";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Group Dining Reservations",
  description: "Organize group dinners effortlessly!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-gray-50 border-t">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <nav className="flex justify-center space-x-6 text-sm text-gray-500">
                  <a href="/terms" className="hover:text-gray-900">Terms of Use</a>
                  <a href="/privacy" className="hover:text-gray-900">Privacy Policy</a>
                  <a href="/support" className="hover:text-gray-900">Support</a>
                </nav>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
