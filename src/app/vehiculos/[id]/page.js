import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/vehiculos" style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ← Volver al catálogo
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: '100%', borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <img src={mainImage} alt={`${vehicle.marca} ${vehicle.modelo}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
                {images.slice(1).map((img, i) => (
                  <div key={i} style={{ borderRadius: '0.5rem', overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent' }}>
                    <img src={img} alt={`Thumbnail ${i}`} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="card glass" style={{ padding: '3rem' }}>
            {vehicle.estado !== 'DISPONIBLE' && (
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: vehicle.estado === 'VENDIDO' ? 'var(--color-danger)' : '#f59e0b', color: '#fff', borderRadius: '20px', fontWeight: 'bold', marginBottom: '1rem' }}>
                {vehicle.estado}
              </div>
            )}
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{vehicle.marca} <span className="text-gradient">{vehicle.modelo}</span></h1>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-accent)', marginBottom: '2rem' }}>
              ${vehicle.precio.toLocaleString('es-CL')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Año</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.ano}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Kilometraje</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.kilometraje.toLocaleString('es-CL')} km</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Transmisión</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.transmision}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Combustible</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.combustible}</p>
              </div>
              {vehicle.motor && (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Motor</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.motor}</p>
                </div>
              )}
              {vehicle.color && (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Color</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.color}</p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Descripción</h3>
              <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
                {vehicle.descripcion || 'Sin descripción adicional.'}
              </p>
            </div>

            <Link href="/contacto" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              Solicitar Información
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}
