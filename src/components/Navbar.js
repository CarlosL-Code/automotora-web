'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Car, Users, Briefcase, PhoneCall, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar el menú al navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevenir scroll en el fondo cuando el menú está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      {/* --- DESKTOP & MOBILE TOP NAV --- */}
      <nav className={`main-top-nav ${isScrolled ? 'scrolled' : ''}`}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="logo-wrapper">
            <Image 
              src="/logo.png" 
              alt="HMC Premium Logo" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </Link>
        
        {/* Solo visible en Desktop */}
        <div className="desktop-menu">
          <Link href="/" className="nav-link">Inicio</Link>
          <Link href="/vehiculos" className="nav-link">Vehículos</Link>
          <Link href="/ejecutivos" className="nav-link">Ejecutivos</Link>
          <Link href="/nosotros" className="nav-link">Nosotros</Link>
          <Link href="/contacto" className="nav-link">Contacto</Link>
          <div style={{ marginLeft: '1rem' }}><ThemeToggle /></div>
        </div>

        {/* Solo visible en Mobile */}
        <div className="mobile-top-actions">
          <button onClick={() => setIsMobileMenuOpen(true)} aria-label="Abrir menú" style={{ color: 'inherit', padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* --- OFF-CANVAS MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="offcanvas-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="offcanvas-menu" onClick={(e) => e.stopPropagation()}>
            <div className="offcanvas-header">
              <span style={{ fontSize: '1.25rem', fontWeight: '800' }}>Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Cerrar menú" style={{ color: 'var(--color-text-primary)', padding: '0.5rem' }}>
                <X size={28} />
              </button>
            </div>
            
            <div className="offcanvas-links">
              <Link href="/" className="offcanvas-link">Inicio</Link>
              <Link href="/vehiculos" className="offcanvas-link">Catálogo de Vehículos</Link>
              <Link href="/ejecutivos" className="offcanvas-link">Nuestro Staff</Link>
              <Link href="/nosotros" className="offcanvas-link">Sobre Nosotros</Link>
              <Link href="/contacto" className="offcanvas-link">Contacto Directo</Link>
            </div>

            <div className="offcanvas-footer">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '1rem', background: 'var(--color-bg)', borderRadius: '1rem', border: '1px solid var(--color-border)' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Modo Oscuro</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MOBILE BOTTOM NAV (APP-LIKE CON BOTON CENTRAL) --- */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
          <div className="icon-wrapper"><Home size={22} /></div>
          <span className="nav-label">Inicio</span>
        </Link>
        <Link href="/vehiculos" className={`mobile-nav-item ${pathname.startsWith('/vehiculos') ? 'active' : ''}`}>
          <div className="icon-wrapper"><Car size={22} /></div>
          <span className="nav-label">Catálogo</span>
        </Link>

        {/* BOTÓN CENTRAL WHATSAPP */}
        <div className="mobile-nav-center-btn">
          <a href="https://wa.me/56958251226" target="_blank" rel="noopener noreferrer" className="whatsapp-fab" aria-label="WhatsApp">
            {/* Logo Oficial WhatsApp SVG */}
            <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.052 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </a>
        </div>

        <Link href="/ejecutivos" className={`mobile-nav-item ${pathname.startsWith('/ejecutivos') ? 'active' : ''}`}>
          <div className="icon-wrapper"><Users size={22} /></div>
          <span className="nav-label">Staff</span>
        </Link>
        <Link href="/nosotros" className={`mobile-nav-item ${pathname.startsWith('/nosotros') ? 'active' : ''}`}>
          <div className="icon-wrapper"><Briefcase size={22} /></div>
          <span className="nav-label">Nosotros</span>
        </Link>
      </nav>

      {/* Spacer para que el contenido no quede debajo del Nav superior */}
      {pathname !== '/' && !pathname.startsWith('/admin') && (
        <div className={`top-spacer ${isScrolled ? 'scrolled' : ''}`} aria-hidden="true" />
      )}
    </>
  );
}
