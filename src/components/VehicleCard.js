import Link from 'next/link';
import Image from 'next/image';
import { CalendarDays, Gauge, Settings } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  const images = vehicle.imagenes ? JSON.parse(vehicle.imagenes) : [];
  const mainImage = images.length > 0 ? images[0] : '/placeholder-car.jpg';

  return (
    <Link href={`/vehiculos/${vehicle.id}`}>
      <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <Image 
            src={mainImage} 
            alt={`${vehicle.marca} ${vehicle.modelo}`} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            className="vehicle-img"
          />
          {vehicle.estado === 'RESERVADO' && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#f59e0b', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2 }}>
              RESERVADO
            </div>
          )}
          {vehicle.estado === 'VENDIDO' && (
            <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--color-danger)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 2 }}>
              VENDIDO
            </div>
          )}
        </div>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3 style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>{vehicle.marca}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{vehicle.modelo}</span>
          </h3>
          <p style={{ color: 'var(--color-text-primary)', fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ${vehicle.precio.toLocaleString('es-CL')}
            <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--color-text-secondary)', background: 'var(--color-bg)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>CLP</span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'var(--color-bg)', padding: '0.5rem', borderRadius: '8px' }}>
              <CalendarDays size={16} color="var(--color-accent)" />
              <span style={{ fontWeight: '600' }}>{vehicle.ano}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'var(--color-bg)', padding: '0.5rem', borderRadius: '8px' }}>
              <Gauge size={16} color="var(--color-accent)" />
              <span style={{ fontWeight: '600' }}>{vehicle.kilometraje >= 1000 ? (vehicle.kilometraje/1000).toFixed(0) + 'k' : vehicle.kilometraje} km</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', background: 'var(--color-bg)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
              <Settings size={16} color="var(--color-accent)" />
              <span style={{ fontWeight: '600', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{vehicle.transmision}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
