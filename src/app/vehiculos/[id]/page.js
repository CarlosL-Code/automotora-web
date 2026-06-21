import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import VehicleDetailsClient from './VehicleDetailsClient';

export const revalidate = 0;

export default async function VehicleDetails({ params }) {
  const { id } = await params;
  const vehicleId = parseInt(id);
  
  if (isNaN(vehicleId)) return notFound();

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId }
  });

  if (!vehicle) return notFound();

  const images = vehicle.imagenes ? JSON.parse(vehicle.imagenes) : [];
  const mainImage = images.length > 0 ? images[0] : '/placeholder-car.jpg';

  const ejecutivos = await prisma.staff.findMany({
    where: { esEjecutivo: true },
    orderBy: { orden: 'asc' }
  });

  // Componente de cliente para el carrusel
  return <VehicleDetailsClient vehicle={vehicle} images={images} mainImage={mainImage} ejecutivos={ejecutivos} />;
}
