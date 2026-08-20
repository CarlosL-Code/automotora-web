import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import { ArrowRight, ShieldCheck, Users, Wallet, Phone } from 'lucide-react';

export const revalidate = 0; // Disable static rendering to avoid Vercel build failures with Hostinger DB

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
            display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.5rem 1.25rem', borderRadius: '99px', 
            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '2rem', fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
            color: '#ffffff', textShadow: 'none'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="20" height="14" style={{ borderRadius: '2px', display: 'block' }}>
              <rect width="3" height="2" fill="#d52b1e"/>
              <rect width="3" height="1" fill="#ffffff"/>
              <rect width="1" height="1" fill="#0039a6"/>
              <polygon points="0.5,0.25 0.58,0.45 0.8,0.45 0.63,0.6 0.7,0.8 0.5,0.7 0.3,0.8 0.37,0.6 0.2,0.45 0.42,0.45" fill="#ffffff"/>
            </svg>
            Concesionario en Temuco
          </div>

          <h1 className="hero-animate hero-delay-2" style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: '800', lineHeight: '1.05', 
            marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#ffffff', maxWidth: '700px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)'
          }}>
            Encuentra el auto<br/>
            <span style={{ color: '#2ecc71', textShadow: '0 2px 30px rgba(46, 204, 113, 0.4)' }}>que mereces.</span>
          </h1>

          <p className="hero-animate hero-delay-3" style={{ 
            fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', marginBottom: '3rem', 
            maxWidth: '500px', lineHeight: '1.7', fontWeight: '400',
            textShadow: '0 1px 10px rgba(0,0,0,0.5)'
          }}>
            Selección curada de vehículos con garantía, financiamiento a tu medida y la confianza de un equipo que te acompaña.
          </p>

          <div className="hero-animate hero-delay-4" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/vehiculos" className="hero-btn-primary">
              Explorar Catálogo <ArrowRight size={18} />
            </Link>
            <Link href="/contacto" className="hero-btn-secondary">
              <Phone size={18} /> Contáctanos
            </Link>
          </div>
        </div>
      </section>

        {/* Brands Marquee Section */}
        <section className="brands-marquee-container">
          <div className="brands-marquee-content">
            {[
              { name: 'Toyota', domain: 'toyota.com' },
              { name: 'Peugeot', domain: 'peugeot.com' },
              { name: 'Hyundai', domain: 'hyundai.com' },
              { name: 'Chevrolet', domain: 'chevrolet.com' },
              { name: 'Citroen', domain: 'citroen.com' },
              { name: 'Ford', domain: 'ford.com' },
              { name: 'Volkswagen', domain: 'volkswagen.com' },
              { name: 'Kia', domain: 'kia.com' },
              { name: 'Mazda', domain: 'mazda.com' },
              { name: 'Fiat', domain: 'fiat.com' },
              { name: 'Ram', domain: 'ramtrucks.com' },
              { name: 'Suzuki', domain: 'suzuki.com' },
              { name: 'Renault', domain: 'renault.com' },
              { name: 'Nissan', domain: 'nissan.com' },
              { name: 'Jeep', domain: 'jeep.com' },
              { name: 'Chery', domain: 'cheryinternational.com' },
              // Duplicado para efecto infinito suave
              { name: 'Toyota', domain: 'toyota.com' },
              { name: 'Peugeot', domain: 'peugeot.com' },
              { name: 'Hyundai', domain: 'hyundai.com' },
              { name: 'Chevrolet', domain: 'chevrolet.com' },
              { name: 'Citroen', domain: 'citroen.com' },
              { name: 'Ford', domain: 'ford.com' },
              { name: 'Volkswagen', domain: 'volkswagen.com' },
              { name: 'Kia', domain: 'kia.com' },
              { name: 'Mazda', domain: 'mazda.com' },
              { name: 'Fiat', domain: 'fiat.com' },
              { name: 'Ram', domain: 'ramtrucks.com' },
              { name: 'Suzuki', domain: 'suzuki.com' },
              { name: 'Renault', domain: 'renault.com' },
              { name: 'Nissan', domain: 'nissan.com' },
              { name: 'Jeep', domain: 'jeep.com' },
              { name: 'Chery', domain: 'cheryinternational.com' }
            ].map((brand, index) => (
              <div key={index} className="brand-pill">
                <img 
                  src={`https://logo.clearbit.com/${brand.domain}`} 
                  alt={`${brand.name} logo`}
                  style={{ width: '28px', height: '28px', objectFit: 'contain', marginRight: '12px', borderRadius: '4px', backgroundColor: '#fff', padding: '2px' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {brand.name}
              </div>
            ))}
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
