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
              padding: '0.4rem 1.2rem', borderRadius: '100px', 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '2rem', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.9)', textShadow: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="16" height="11" style={{ borderRadius: '2px', display: 'block' }}>
                <rect width="3" height="2" fill="#d52b1e"/>
                <rect width="3" height="1" fill="#ffffff"/>
                <rect width="1" height="1" fill="#0039a6"/>
                <polygon points="0.5,0.25 0.58,0.45 0.8,0.45 0.63,0.6 0.7,0.8 0.5,0.7 0.3,0.8 0.37,0.6 0.2,0.45 0.42,0.45" fill="#ffffff"/>
              </svg>
              Concesionario Premium
            </div>
  
            <h1 className="hero-animate hero-delay-2" style={{ 
              fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: '800', lineHeight: '1', 
              marginBottom: '1.5rem', letterSpacing: '-0.04em', color: '#ffffff', maxWidth: '800px',
              textShadow: '0 4px 30px rgba(0,0,0,0.3)'
            }}>
              Encuentra el auto<br/>
              <span style={{ 
                background: 'linear-gradient(135deg, #22a061 0%, #0F7143 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent', 
                textShadow: 'none',
                display: 'inline-block'
              }}>que mereces.</span>
            </h1>
  
            <p className="hero-animate hero-delay-3" style={{ 
              fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '3.5rem', 
              maxWidth: '550px', lineHeight: '1.8', fontWeight: '400', letterSpacing: '-0.01em',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              Selección curada de vehículos con garantía, financiamiento a tu medida y la confianza de un equipo que te acompaña paso a paso.
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
        <style dangerouslySetInnerHTML={{__html: `
          .marquee-box { overflow: hidden; width: 100%; background: var(--color-bg-card); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 2.5rem 0; display: flex; align-items: center; position: relative; }
          .marquee-box::before, .marquee-box::after { content: ""; position: absolute; top: 0; bottom: 0; width: 150px; z-index: 2; pointer-events: none; }
          .marquee-box::before { left: 0; background: linear-gradient(to right, var(--color-bg-card), transparent); }
          .marquee-box::after { right: 0; background: linear-gradient(to left, var(--color-bg-card), transparent); }
          .marquee-track { display: flex; gap: 4rem; width: max-content; animation: scroll-track 40s linear infinite; padding-left: 4rem; align-items: center; }
          .marquee-box:hover .marquee-track { animation-play-state: paused; }
          
          .marquee-item { display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; font-size: 1.25rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-secondary); opacity: 0.6; }
          .marquee-item:hover { opacity: 1; transform: scale(1.05); color: var(--color-text-primary); }
          
          .marquee-logo { width: 50px; height: 50px; object-fit: contain; }
          
          /* Invert logos to white in dark mode, keep black in light mode */
          [data-theme='dark'] .marquee-logo { filter: invert(1); }
          
          @keyframes scroll-track { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @media (max-width: 768px) { .marquee-box { padding: 2rem 0; } .marquee-item { font-size: 1.1rem; } .marquee-logo { width: 40px; height: 40px; } .marquee-box::before, .marquee-box::after { width: 60px; } }
        `}} />
        <section className="marquee-box">
          <div className="marquee-track">
            {[
              { name: 'Toyota', icon: 'toyota' },
              { name: 'Peugeot', icon: 'peugeot' },
              { name: 'Hyundai', icon: 'hyundai' },
              { name: 'Chevrolet', icon: 'chevrolet' },
              { name: 'Citroen', icon: 'citroen' },
              { name: 'Ford', icon: 'ford' },
              { name: 'Volkswagen', icon: 'volkswagen' },
              { name: 'Kia', icon: 'kia' },
              { name: 'Mazda', icon: 'mazda' },
              { name: 'Fiat', icon: 'fiat' },
              { name: 'Ram', icon: 'ram' },
              { name: 'Changan', icon: null },
              { name: 'Suzuki', icon: 'suzuki' },
              { name: 'Maxus', icon: null },
              { name: 'JAC', icon: null },
              { name: 'Sinotruk', icon: null },
              { name: 'Renault', icon: 'renault' },
              { name: 'Samsung', icon: 'samsung' },
              { name: 'Nissan', icon: 'nissan' },
              { name: 'Jeep', icon: 'jeep' },
              { name: 'Foton', icon: null },
              { name: 'Chery', icon: null },
              // Repetido para efecto infinito
              { name: 'Toyota', icon: 'toyota' },
              { name: 'Peugeot', icon: 'peugeot' },
              { name: 'Hyundai', icon: 'hyundai' },
              { name: 'Chevrolet', icon: 'chevrolet' },
              { name: 'Citroen', icon: 'citroen' },
              { name: 'Ford', icon: 'ford' },
              { name: 'Volkswagen', icon: 'volkswagen' },
              { name: 'Kia', icon: 'kia' },
              { name: 'Mazda', icon: 'mazda' },
              { name: 'Fiat', icon: 'fiat' },
              { name: 'Ram', icon: 'ram' },
              { name: 'Changan', icon: null },
              { name: 'Suzuki', icon: 'suzuki' },
              { name: 'Maxus', icon: null },
              { name: 'JAC', icon: null },
              { name: 'Sinotruk', icon: null },
              { name: 'Renault', icon: 'renault' },
              { name: 'Samsung', icon: 'samsung' },
              { name: 'Nissan', icon: 'nissan' },
              { name: 'Jeep', icon: 'jeep' },
              { name: 'Foton', icon: null },
              { name: 'Chery', icon: null }
            ].map((brand, index) => (
              <div key={index} className="marquee-item">
                {brand.icon ? (
                  <img 
                    src={`https://cdn.simpleicons.org/${brand.icon}/000000`} 
                    alt={`${brand.name} logo`}
                    className="marquee-logo"
                  />
                ) : (
                  brand.name
                )}
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
