import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = 'https://hmcautomotora.cl';

  // Páginas públicas estáticas institucionales
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vehiculos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ejecutivos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Obtener vehículos activos (DISPONIBLE y RESERVADO) protegidos con try/catch ante fallas de BD
  let vehicleRoutes = [];
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        estado: {
          in: ['DISPONIBLE', 'RESERVADO'],
        },
      },
      select: {
        id: true,
        updatedAt: true,
        estado: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    vehicleRoutes = vehicles.map((v) => ({
      url: `${baseUrl}/vehiculos/${v.id}`,
      lastModified: v.updatedAt || new Date(),
      changeFrequency: v.estado === 'DISPONIBLE' ? 'daily' : 'weekly',
      priority: v.estado === 'DISPONIBLE' ? 0.8 : 0.5,
    }));
  } catch (error) {
    console.error('Error generando sitemap dinámico de vehículos:', error);
    // Retorna al menos las rutas estáticas si la base de datos no está disponible
  }

  return [...staticRoutes, ...vehicleRoutes];
}
