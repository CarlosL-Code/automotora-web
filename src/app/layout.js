import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

const outfit = Outfit({ 
  subsets: ["latin"],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-family-sans'
});

export const metadata = {
  title: "HMC Automotora Premium",
  description: "Encuentra el auto de tus sueños con la mejor atención.",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning className={outfit.variable}>
      <body className={outfit.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
