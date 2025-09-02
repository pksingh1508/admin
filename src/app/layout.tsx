import Navbar from "@/components/ui/Navbar";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-900 min-h-screen">
          <Theme>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </Theme>
        </body>
      </html>
    </ClerkProvider>
  );
}
