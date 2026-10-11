import ContactClient from './ContactClient';

export const metadata = {
  title: "Contacto y Ubicación en Temuco | HM&C Motors",
  description: "Visítanos en Avenida Caupolicán 579, Temuco o contáctanos por teléfono y WhatsApp. Asesoría directa para comprar o financiar tu auto.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto | HM&C Motors Temuco",
    description: "Ponte en contacto con nosotros o visítanos en Temuco para cotizar tu próximo vehículo.",
    url: "https://hmcautomotora.cl/contacto",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
