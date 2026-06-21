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
      <section style={{ 
        position: 'relative', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* LCP Image Optimized */}
        <Image 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
          alt="Auto de lujo fondo HMC Premium"
          fill
          priority
          sizes="100vw"
          quality={85}
          style={{ objectFit: 'cover', zIndex: 0 }}
        />
        {/* Overlay Dark */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(rgba(15, 17, 21, 0.6), rgba(15, 17, 21, 0.9))', zIndex: 1 }}></div>

        <div className="container text-center slide-up" style={{ zIndex: 2, color: '#ffffff', position: 'relative' }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)', color: '#ffffff' }}>
            Encuentra el auto de tus <span className="text-gradient" style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sueños</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Descubre nuestra selección premium de vehículos garantizados. Experiencia, calidad y confianza en cada kilómetro.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/vehiculos" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', gap: '0.5rem' }}>
              Ver Catálogo <ArrowRight size={20} />
            </Link>
            <Link href="/contacto" className="btn btn-outline" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: '#ffffff', borderColor: '#ffffff', gap: '0.5rem' }}>
              <Phone size={20} /> Contáctanos
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
