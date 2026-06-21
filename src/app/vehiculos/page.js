import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';

export const revalidate = 0; // Disable static rendering

export default async function VehiclesCatalog({ searchParams }) {
  const params = await searchParams;
  const marca = params.marca;
  const transmisio = params.transmision;

  // Simple filtering
  let whereClause = {};
  if (marca) whereClause.marca = { contains: marca };
  if (transmisio) whereClause.transmision = transmisio;

  const vehicles = await prisma.vehicle.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container slide-up" style={{ paddingBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
          Catálogo de <span className="text-gradient">Vehículos</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '3rem' }}>
          Explora nuestra selección y encuentra el modelo perfecto para ti.
        </p>

        {/* Basic Filters placeholder (could be made interactive with Client Components) */}
        <div className="card glass" style={{ padding: '1.5rem', marginBottom: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontWeight: '600' }}>Filtros Rápidos:</span>
          <a href="/vehiculos" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Todos</a>
          <a href="/vehiculos?transmision=Automática" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Automáticos</a>
          <a href="/vehiculos?transmision=Manual" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Manuales</a>
        </div>

        {vehicles.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>No se encontraron vehículos que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>
    </main>
  );
}
