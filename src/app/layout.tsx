import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ExtensionShield from "@/components/ExtensionShield";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ritesh Patel — Performance Marketing & Digital Growth",
  description: "Digital marketing, performance campaigns, social content and experimentation — built around creative execution and measurable outcomes.",
  keywords: ["Digital Marketing", "Performance Marketing", "Growth Marketing", "Ritesh Patel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} antialiased scroll-smooth`}
    >
      <head>
        <Script
          id="extension-error-shield"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var isExt = function(s) {
                  if (!s) return false;
                  var str = String(s);
                  return str.indexOf('chrome-extension://') !== -1 ||
                         str.indexOf('moz-extension://') !== -1 ||
                         str.indexOf('embed_script.js') !== -1 ||
                         str.indexOf('oihbmmeelledioenpfcfehdjhdnlfibj') !== -1 ||
                         str.indexOf('Minified React error #299') !== -1 ||
                         str.indexOf('invariant=299') !== -1;
                };

                var origError = window.onerror;
                window.onerror = function(msg, url, line, col, err) {
                  if (isExt(msg) || isExt(url) || (err && isExt(err.stack))) {
                    return true;
                  }
                  return origError ? origError.apply(this, arguments) : false;
                };

                window.addEventListener('error', function(e) {
                  if (isExt(e.message) || isExt(e.filename) || (e.error && isExt(e.error.stack))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);

                window.addEventListener('unhandledrejection', function(e) {
                  if (e.reason && (isExt(e.reason.message) || isExt(e.reason.stack) || isExt(e.reason))) {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-white text-[#0f172a] font-sans selection:bg-[#ff3e8d] selection:text-white overflow-x-hidden min-h-screen"
      >
        <ExtensionShield />
        {children}
      </body>
    </html>
  );
}
