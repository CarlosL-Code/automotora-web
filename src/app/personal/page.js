import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { orden: 'asc' }
  });

  return (
    <main style={{ paddingTop: '1rem', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
          Nuestro <span className="text-gradient">Personal</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          Conoce al equipo de expertos detrás de Automotora Premium. Estamos aquí para brindarte la mejor atención y asesoría en tu próxima compra.
        </p>

        {staff.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem' }}>
            {staff.map(person => (
              <div key={person.id} className="card glass" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: '150px', height: '150px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-accent)', padding: '3px' }}>
                  {person.imagenUrl ? (
                    <img src={person.imagenUrl} alt={person.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '2rem' }}>
                      👤
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{person.nombre}</h3>
                <p style={{ color: 'var(--color-accent)', fontWeight: '600', marginBottom: '1rem' }}>{person.cargo}</p>
                {person.descripcion && (
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{person.descripcion}</p>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  {person.telefono && <span>📞 {person.telefono}</span>}
                  {person.email && <span>✉️ {person.email}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>Aún no hay personal registrado.</p>
          </div>
        )}
      </div>
    </main>
  );
}
