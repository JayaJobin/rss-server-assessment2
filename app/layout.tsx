import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutPreferenceProvider } from "@/components/LayoutPreferenceProvider";
import { ToastProvider } from "@/components/ToastProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RSS Server — Frontend",
  description:
    "Frontend for an RSS Server feeding an LMS. CSE5006 Assessment 1: Frontend design and usability.",
};

// Runs before hydration so the stored theme applies immediately and the
// page never flashes the wrong theme on load.
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem('rss-server-theme');
    var theme = stored === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);

    var compact = window.localStorage.getItem('rss-server-compact-layout');
    document.documentElement.setAttribute('data-compact', compact === 'true');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <LayoutPreferenceProvider>
            <ToastProvider>
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
            </ToastProvider>
          </LayoutPreferenceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
