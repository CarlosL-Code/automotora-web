import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import { ArrowRight, ShieldCheck, Users, Wallet, Phone } from 'lucide-react';

export const revalidate = 60; // Enable ISR (update every 60s) for blazing fast initial loads

export default async function Home() {
  const featuredVehicles = await prisma.vehicle.findMany({
    where: { estado: 'DISPONIBLE' }, // O donde destacado sea true
    orderBy: { createdAt: 'desc' },
    take: 6
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section" style={{ 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'flex-end', 
        justifyContent: 'flex-start',
        overflow: 'hidden'
      }}>
        {/* Local Hero Image - Espejado + animación Ken Burns */}
        <Image 
          src="/hero-bg.jpg"
          alt="Automotora HMC Premium - Concesionario"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="hero-image"
          style={{ objectFit: 'cover', objectPosition: 'center 60%', zIndex: 0, transform: 'scaleX(-1)' }}
        />
        {/* Gradient Overlay - elegante degradado de abajo hacia arriba */}
        <div style={{ 
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)', 
          zIndex: 1 
        }}></div>
        {/* Subtle noise texture overlay for premium feel */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 30% 80%, rgba(15, 113, 67, 0.08) 0%, transparent 70%)',
          zIndex: 1
        }}></div>

        <div className="container hero-content" style={{ zIndex: 2, color: '#ffffff', position: 'relative', paddingBottom: '6rem' }}>
          {/* Tagline */}
          <div className="hero-animate hero-delay-1" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', borderRadius: '99px', 
            backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            marginBottom: '2rem', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'inline-block', animation: 'pulse-dot 2s infinite' }}></span>
            Automotora Premium
          </div>

          <h1 className="hero-animate hero-delay-2" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.05', 
            marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: '700px'
          }}>
            Encuentra el auto<br/>
            <span style={{ color: 'var(--color-accent)' }}>que mereces.</span>
          </h1>

          <p className="hero-animate hero-delay-3" style={{ 
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)', marginBottom: '3rem', 
            maxWidth: '500px', lineHeight: '1.7', fontWeight: '400'
          }}>
            Selección curada de vehículos con garantía, financiamiento a tu medida y la confianza de un equipo que te acompaña.
          </p>

          <div className="hero-animate hero-delay-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/vehiculos" className="btn btn-primary" style={{ 
              padding: '1rem 2.5rem', fontSize: '1.05rem', gap: '0.75rem', 
              borderRadius: '14px', fontWeight: '700'
            }}>
              Explorar Catálogo <ArrowRight size={18} />
            </Link>
            <Link href="/contacto" className="btn" style={{ 
              padding: '1rem 2.5rem', fontSize: '1.05rem', gap: '0.75rem',
              borderRadius: '14px', fontWeight: '600',
              background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)',
              color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}>
              <Phone size={18} /> Contáctanos
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Recién <span className="text-gradient">Llegados</span></h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>Los últimos vehículos en ingresar a nuestro inventario premium.</p>
            </div>
            <Link href="/vehiculos" style={{ color: 'var(--color-accent)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Ver todos →
            </Link>
          </div>

          {featuredVehicles.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {featuredVehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No hay vehículos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>Por qué <span className="text-gradient">Elegirnos</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', textAlign: 'center' }}>
            <div className="card glass" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
                <ShieldCheck size={40} />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Garantía Total</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Todos nuestros vehículos pasan por una rigurosa inspección de 100 puntos antes de ser entregados.</p>
            </div>
            <div className="card glass" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
                <Users size={40} />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Asesoría Experta</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Te acompañamos en cada paso con atención personalizada para que tomes la mejor decisión de compra.</p>
            </div>
            <div className="card glass" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', marginBottom: '1.5rem' }}>
                <Wallet size={40} />
              </div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Financiamiento</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>Múltiples opciones de financiamiento adaptadas a tus necesidades, presupuesto y comodidad.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
