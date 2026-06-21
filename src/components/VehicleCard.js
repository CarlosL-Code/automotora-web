'use client';
import Link from 'next/link';
import { CalendarDays, Gauge, Settings } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
  const images = vehicle.imagenes ? JSON.parse(vehicle.imagenes) : [];
  const mainImage = images.length > 0 ? images[0] : '/placeholder-car.jpg';

  return (
    <Link href={`/vehiculos/${vehicle.id}`}>
      <div className="card" style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <img 
            src={mainImage} 
            alt={`${vehicle.marca} ${vehicle.modelo}`} 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{vehicle.marca} {vehicle.modelo}</span>
          </h3>
          <p style={{ color: 'var(--color-accent)', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            ${vehicle.precio.toLocaleString('es-CL')}
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: 'auto', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CalendarDays size={16} /> {vehicle.ano}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Gauge size={16} /> {vehicle.kilometraje.toLocaleString('es-CL')} km</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Settings size={16} /> {vehicle.transmision}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
