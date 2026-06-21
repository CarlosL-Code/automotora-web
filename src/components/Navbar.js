'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const navStyle = {
    position: 'fixed',
    top: isScrolled ? '0' : '20px',
    left: '0',
    right: '0',
    margin: '0 auto',
    width: isScrolled ? '100%' : '90%',
    maxWidth: isScrolled ? '100%' : '1200px',
    zIndex: 9999,
    transition: 'all 0.3s ease',
    padding: isScrolled ? '0.75rem 2rem' : '1rem 2rem',
    borderRadius: isScrolled ? '0' : '20px',
    background: isScrolled ? 'var(--nav-bg-scrolled)' : 'var(--color-bg-glass)',
    backdropFilter: 'blur(10px)',
    border: isScrolled ? 'none' : '1px solid var(--color-border)',
    boxShadow: isScrolled ? 'var(--shadow-md)' : 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const linkStyle = {
    color: 'var(--nav-text)',
    fontWeight: '600',
    margin: '0 1rem',
    fontSize: '1rem',
    transition: 'color 0.2s ease'
  };

  return (
    <>
      <nav style={navStyle}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Aquí se carga el logo.png si existe, si no mostrará el texto alternativo */}
          <img src="/logo.png" alt="HMC Premium Logo" style={{ height: isScrolled ? '50px' : '80px', width: 'auto', objectFit: 'contain', transition: 'height 0.3s ease' }} onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }} />
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--nav-text)', display: 'none' }}>HMC Premium</span>
        </Link>
        
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" style={linkStyle}>Inicio</Link>
          <Link href="/vehiculos" style={linkStyle}>Vehículos</Link>
          <Link href="/ejecutivos" style={linkStyle}>Ejecutivos</Link>
          <Link href="/nosotros" style={linkStyle}>Nosotros</Link>
          <Link href="/contacto" style={linkStyle}>Contacto</Link>
          <div style={{ marginLeft: '1rem' }}><ThemeToggle /></div>
        </div>

        <div className="mobile-menu-btn" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <div onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ cursor: 'pointer' }}>
            {isMobileMenuOpen ? <X color="var(--nav-text)" size={28} /> : <Menu color="var(--nav-text)" size={28} />}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh',
          backgroundColor: 'var(--color-bg)', zIndex: 9998,
          display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
          gap: '2rem'
        }}>
          <Link href="/" style={{ ...linkStyle, fontSize: '2rem' }} onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
          <Link href="/vehiculos" style={{ ...linkStyle, fontSize: '2rem' }} onClick={() => setIsMobileMenuOpen(false)}>Vehículos</Link>
          <Link href="/ejecutivos" style={{ ...linkStyle, fontSize: '2rem' }} onClick={() => setIsMobileMenuOpen(false)}>Ejecutivos</Link>
          <Link href="/nosotros" style={{ ...linkStyle, fontSize: '2rem' }} onClick={() => setIsMobileMenuOpen(false)}>Nosotros</Link>
          <Link href="/contacto" style={{ ...linkStyle, fontSize: '2rem' }} onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
        </div>
      )}

      <style jsx>{`
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
