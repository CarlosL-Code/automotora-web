import { prisma } from '@/lib/prisma';
import { Phone, Mail } from 'lucide-react';

export const revalidate = 0;

export default async function EjecutivosPage() {
  const staff = await prisma.staff.findMany({
    where: { esEjecutivo: true },
    orderBy: { orden: 'asc' }
  });

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
          Nuestros <span className="text-gradient">Ejecutivos</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          Contacta directamente a uno de nuestros ejecutivos comerciales para recibir atención rápida y personalizada.
        </p>

        {staff.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem' }}>
            {staff.map(person => (
              <div key={person.id} className="card glass" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: '150px', height: '150px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-accent)', padding: '3px' }}>
                  {person.imagenUrl ? (
                    <img src={person.imagenUrl} alt={person.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '2rem' }}>
                      👤
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{person.nombre}</h3>
                <p style={{ color: 'var(--color-accent)', fontWeight: '600', marginBottom: '1rem' }}>{person.cargo}</p>
                {person.descripcion && (
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{person.descripcion}</p>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                  {person.telefono && (
                    <a href={`tel:${person.telefono.replace(/\s+/g, '')}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: '100%', gap: '0.5rem' }}>
                      <Phone size={16} /> Llamar
                    </a>
                  )}
                  {person.email && (
                    <a href={`mailto:${person.email}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: '100%', gap: '0.5rem' }}>
                      <Mail size={16} /> Email
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-bg-glass)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>Aún no hay ejecutivos registrados.</p>
          </div>
        )}
      </div>
    </main>
  );
}
