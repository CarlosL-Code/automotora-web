'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Car, Users, LayoutDashboard, LogOut, Home } from 'lucide-react';
import './admin.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // If we are on the login page, don't show the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar glass">
        <div className="admin-brand">
          <h2>Automotora Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link href="/admin" className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/vehicles" className={`admin-nav-link ${pathname === '/admin/vehicles' ? 'active' : ''}`}>
            <Car size={20} />
            <span>Vehículos</span>
          </Link>
          <Link href="/admin/staff" className={`admin-nav-link ${pathname === '/admin/staff' ? 'active' : ''}`}>
            <Users size={20} />
            <span>Personal</span>
          </Link>
          
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link href="/" className="admin-nav-link">
              <Home size={20} />
              <span>Ver Sitio Público</span>
            </Link>
            <button onClick={handleLogout} className="admin-nav-link" style={{ width: '100%', textAlign: 'left', color: 'var(--color-danger)' }}>
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </aside>
      <main className="admin-main fade-in">
        {children}
      </main>
    </div>
  );
}
