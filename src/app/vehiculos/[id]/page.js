import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import VehicleDetailsClient from './VehicleDetailsClient';

export const revalidate = 0;

/**
 * Consulta compartida memoizada para el ciclo de vida de la petición actual (React cache).
 * Evita duplicar la consulta a Prisma entre generateMetadata() y VehicleDetails().
 */
const getVehicleById = cache(async (vehicleId) => {
  if (isNaN(vehicleId)) return null;
  return await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });
});

/**
 * Genera metadatos dinámicos nativos de Next.js App Router por vehículo.
 */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const vehicleId = parseInt(id);

  if (isNaN(vehicleId)) {
    return {
      title: 'Vehículo no encontrado | HM&C Motors',
      robots: { index: false, follow: false },
    };
  }

  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) {
    return {
      title: 'Vehículo no encontrado | HM&C Motors',
      robots: { index: false, follow: false },
    };
  }

  // Parsear imágenes reales
  let images = [];
  try {
    images = vehicle.imagenes ? JSON.parse(vehicle.imagenes) : [];
  } catch (e) {
    images = [];
  }
  const mainImage = images.length > 0 ? images[0] : 'https://hmcautomotora.cl/hero-bg.jpg';

  const formattedPrice = `$${vehicle.precio.toLocaleString('es-CL')}`;
  const title = `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} | Venta en Temuco - HM&C Motors`;
  
  // Descripción precisa con datos reales sin inventar atributos
  const description = `${vehicle.marca} ${vehicle.modelo} año ${vehicle.ano}, ${vehicle.kilometraje.toLocaleString('es-CL')} km, transmisión ${vehicle.transmision}, combustible ${vehicle.combustible}. Precio contado: ${formattedPrice} CLP. Encuéntralo en HM&C Motors, Temuco.`;

  // Política de indexación: Si está vendido, marcar noindex para desindexación limpia
  const isVendido = vehicle.estado === 'VENDIDO';

  return {
    title,
    description,
    alternates: {
      canonical: `/vehiculos/${vehicle.id}`,
    },
    robots: {
      index: !isVendido,
      follow: true,
    },
    openGraph: {
      title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} (${formattedPrice})`,
      description,
      url: `https://hmcautomotora.cl/vehiculos/${vehicle.id}`,
      type: 'website',
      images: [
        {
          url: mainImage,
          width: 1200,
          height: 800,
          alt: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} en HM&C Motors Temuco`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano} | HM&C Motors`,
      description,
      images: [mainImage],
    },
  };
}

export default async function VehicleDetails({ params }) {
  const { id } = await params;
  const vehicleId = parseInt(id);

  if (isNaN(vehicleId)) return notFound();

  // Reutiliza la misma consulta memoizada en el contexto de esta solicitud
  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) return notFound();

  let images = [];
  try {
    images = vehicle.imagenes ? JSON.parse(vehicle.imagenes) : [];
  } catch (e) {
    images = [];
  }
  const mainImage = images.length > 0 ? images[0] : '/placeholder-car.jpg';

  const ejecutivos = await prisma.staff.findMany({
    where: { esEjecutivo: true },
    orderBy: { orden: 'asc' },
  });

  // Estructura JSON-LD Schema.org Car con disponibilidad precisa y semántica
  const availabilityMap = {
    DISPONIBLE: 'https://schema.org/InStock',
    RESERVADO: 'https://schema.org/LimitedAvailability',
    VENDIDO: 'https://schema.org/SoldOut',
  };

  const carJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano}`,
    description: vehicle.descripcion || `${vehicle.marca} ${vehicle.modelo} año ${vehicle.ano} en HM&C Motors Temuco`,
    image: images.length > 0 ? images : ['https://hmcautomotora.cl/hero-bg.jpg'],
    url: `https://hmcautomotora.cl/vehiculos/${vehicle.id}`,
    brand: {
      '@type': 'Brand',
      name: vehicle.marca,
    },
    model: vehicle.modelo,
    vehicleModelDate: vehicle.ano.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.kilometraje,
      unitCode: 'KMT',
    },
    vehicleTransmission: vehicle.transmision,
    fuelType: vehicle.combustible,
    offers: {
      '@type': 'Offer',
      price: vehicle.precio,
      priceCurrency: 'CLP',
      availability: availabilityMap[vehicle.estado] || 'https://schema.org/InStock',
      url: `https://hmcautomotora.cl/vehiculos/${vehicle.id}`,
      seller: {
        '@type': 'AutoDealer',
        name: 'HM&C Motors',
        telephone: '+56958251226',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Avenida Caupolicán 579',
          addressLocality: 'Temuco',
          addressRegion: 'La Araucanía',
          addressCountry: 'CL',
        },
      },
    },
  };

  if (vehicle.motor) carJsonLd.vehicleEngine = { '@type': 'EngineSpecification', name: vehicle.motor };
  if (vehicle.color) carJsonLd.color = vehicle.color;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(carJsonLd) }}
      />
      <VehicleDetailsClient
        vehicle={vehicle}
        images={images}
        mainImage={mainImage}
        ejecutivos={ejecutivos}
      />
    </>
  );
}
