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
  title: "HMC Automotora Premium | Venta de Vehículos en Temuco, Chile 🇨🇱",
  description: "Automotora HMC Premium en Temuco, Región de La Araucanía. Venta de vehículos usados y seminuevos con garantía, financiamiento y asesoría personalizada. Visítanos en Av. Caupolicán 579, Temuco.",
  keywords: "automotora temuco, venta de autos temuco, vehículos usados temuco, autos seminuevos araucanía, concesionario temuco, HMC automotora, comprar auto temuco chile",
  authors: [{ name: "HMC Automotora Premium" }],
  creator: "HMC Automotora Premium",
  metadataBase: new URL("https://hmcautomotora.cl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "HMC Automotora Premium | Vehículos en Temuco, Chile",
    description: "Tu concesionario de confianza en Temuco. Vehículos usados y seminuevos con garantía, financiamiento flexible y atención personalizada.",
    url: "https://hmcautomotora.cl",
    siteName: "HMC Automotora Premium",
    locale: "es_CL",
    type: "website",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "HMC Automotora Premium - Concesionario en Temuco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HMC Automotora Premium | Vehículos en Temuco",
    description: "Automotora de confianza en Temuco, Chile. Vehículos con garantía y financiamiento.",
    images: ["/hero-bg.jpg"],
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  other: {
    "geo.region": "CL-AR",
    "geo.placename": "Temuco",
    "geo.position": "-38.7369;-72.5938",
    "ICBM": "-38.7369, -72.5938",
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
