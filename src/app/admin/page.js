'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ vehicles: 0, staff: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/vehicles').then(res => res.json()),
      fetch('/api/staff').then(res => res.json())
    ]).then(([vehiclesData, staffData]) => {
      setStats({
        vehicles: vehiclesData.length || 0,
        staff: staffData.length || 0
      });
    }).catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-gradient">Panel de Control</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Bienvenido al sistema de administración de Automotora Premium.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Vehículos en Inventario</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
            {stats.vehicles}
          </div>
        </div>
        <div className="card glass" style={{ padding: '2rem' }}>
          <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Personal Registrado</h3>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
            {stats.staff}
          </div>
        </div>
      </div>
    </div>
  );
}
