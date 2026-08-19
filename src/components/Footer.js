'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <footer style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', padding: '4rem 0 2rem', marginTop: '4rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <img src="/logo.png" alt="HMC Premium Logo" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }} />
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-text-primary)', display: 'none' }}>HMC Premium</span>
            </Link>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              Líderes en venta de vehículos de alta gama. Encuentra el auto de tus sueños con nosotros, con la mejor atención y calidad garantizada.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Enlaces Rápidos</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link href="/" style={{ color: 'var(--color-text-secondary)' }}>Inicio</Link></li>
              <li><Link href="/vehiculos" style={{ color: 'var(--color-text-secondary)' }}>Catálogo de Vehículos</Link></li>
              <li><Link href="/ejecutivos" style={{ color: 'var(--color-text-secondary)' }}>Ejecutivos</Link></li>
              <li><Link href="/nosotros" style={{ color: 'var(--color-text-secondary)' }}>Nosotros</Link></li>
              <li><Link href="/contacto" style={{ color: 'var(--color-text-secondary)' }}>Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem' }}>Contacto</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--color-text-secondary)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> Avenida Caupolican 579, Temuco</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={18} /> (+56) 9 58251226</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={18} /> contacto@hmcautomotora.cl</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '2rem', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} HMC Automotora Premium. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
