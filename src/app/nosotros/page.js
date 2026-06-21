import { prisma } from '@/lib/prisma';
import { Phone, Mail, ShieldCheck, Heart, Search, Handshake, Star } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function NosotrosPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { orden: 'asc' }
  });

  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            Acerca de <span className="text-gradient">HM&C Motors</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            Fundada en 2025, nacimos por el interés familiar en el rubro automotriz, con el firme propósito de entregar un servicio más cercano, transparente y confiable a las personas en Temuco y toda la región.
          </p>
        </div>

        {/* Dynamic Pilars Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
          
          <div className="card glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Heart size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Espíritu Familiar</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              No somos solo una empresa, somos una familia. Entregamos un trato humano, amigable y paciente, acompañándote en cada paso para que te sientas en casa.
            </p>
          </div>

          <div className="card glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Handshake size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Transparencia Total</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Vamos siempre con la verdad por delante. Informamos con claridad el estado real, condiciones y valores de cada vehículo. Sin sorpresas.
            </p>
          </div>

          <div className="card glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Search size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Inspección Rigurosa</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Previo a la venta, cada auto pasa por revisión mecánica, escáner y chequeo de historial Autofact. Te entregamos la verdadera "hoja de vida" del vehículo.
            </p>
          </div>

          <div className="card glass" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
              <Star size={30} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Servicio Integral</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Te ofrecemos consignaciones, financiamiento, recepción en parte de pago y apoyo en transferencias. Todo en un solo lugar.
            </p>
          </div>

        </div>

        {/* Vision & Growth Section */}
        <div className="card glass" style={{ padding: '3rem 2rem', marginBottom: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <ShieldCheck size={50} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Nuestra Visión hacia el Futuro</h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '800px', lineHeight: '1.8', fontSize: '1.1rem' }}>
            Desde nuestro primer día hemos evolucionado enormemente en nuestro stock y servicios. Nuestra meta principal no es solo crecer en tamaño, sino consolidarnos como la automotora familiar más confiable y recomendada de Temuco y la región. Queremos que la post-venta sea igual de fuerte: te respaldamos incluso después de entregarte las llaves.
          </p>
        </div>

        {/* Staff Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Nuestro <span className="text-gradient">Equipo</span></h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Las personas detrás de HM&C Motors, listas para ayudarte.</p>
        </div>

        {staff.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem' }}>
            {staff.map(person => (
              <div key={person.id} className="card glass" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-accent)', padding: '3px' }}>
                  {person.imagenUrl ? (
                    <img src={person.imagenUrl} alt={person.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '2rem' }}>
                      👤
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{person.nombre}</h3>
                <p style={{ color: 'var(--color-accent)', fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>{person.cargo}</p>
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
            <p style={{ color: 'var(--color-text-secondary)' }}>Aún no hay personal registrado.</p>
          </div>
        )}

      </div>
    </main>
  );
}
