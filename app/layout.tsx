import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Bangers } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { AuthProvider } from "./providers";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const bangers = Bangers({ weight: "400", subsets: ["latin"], variable: "--font-bangers" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Hack-o-Veda 2026 | SMVITM",
  description: "Official Hack-o-Veda Portal. Design. Build. Lead.",
  keywords: ["hack-o-veda", "hackathon", "SMVITM", "college", "competition", "coding"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${bangers.variable} font-sans min-h-screen bg-[#fffcf0] text-black selection:bg-pink-500 selection:text-white overflow-x-hidden relative`}>
        {/* Global Halftone Filter */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '12px 12px' }} />

        <AuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  // EMERGENCY CLEANUP: Unregister Service Worker if it exists to fix full-page reloads on localhost
                  if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                      for(let registration of registrations) {
                        registration.unregister();
                      }
                    });
                  }
                  /* 
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js').then(
                      function(registration) {
                        if (registration.update) registration.update();
                      },
                      function(err) {
                        // console.log('Service Worker registration failed: ', err);
                      }
                    );
                  });
                  */
                }
              `,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}