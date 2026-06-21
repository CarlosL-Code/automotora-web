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
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Líderes en venta de vehículos de alta gama. Encuentra el auto de tus sueños con nosotros, con la mejor atención y calidad garantizada.
            </p>
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
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={18} /> Av. Principal 123, Ciudad</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={18} /> +56 9 1234 5678</li>
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
