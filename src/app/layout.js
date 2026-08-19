import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-family-inter'
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['300', '400', '500', '700', '900'],
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
    <html lang="es" suppressHydrationWarning className={`${inter.variable} ${roboto.variable}`}>
      <body className={roboto.className}>
        <ThemeProvider attribute="data-theme" defaultTheme="light">
          <div className={inter.className}>
            <Navbar />
          </div>
          {children}
          <FloatingWhatsApp />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
