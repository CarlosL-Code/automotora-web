'use client';
import { useState, useMemo } from 'react';
import { Phone, Mail } from 'lucide-react';

export default function StaffGallery({ staff }) {
  const [activeTab, setActiveTab] = useState('Todos');

  const categories = ['Todos', 'Administración', 'Ventas', 'TI'];

  const getCategory = (person) => {
    const cargo = person.cargo.toLowerCase();
    
    // TI / Informática
    if (/(informátic|sistemas|ti|it|programador|desarrollador|software|soporte)/.test(cargo)) {
      return 'TI';
    }
    
    // Administración
    if (/(jefe|admin|gerent|director|encargado)/.test(cargo)) {
      return 'Administración';
    }
    
    // Ventas (Ejecutivos y Mecánicos)
    if (person.esEjecutivo || /(ejecutiv|venta|comercial|asesor|mecánic|taller|servicio|técnico|mantenimiento)/.test(cargo)) {
      return 'Ventas';
    }
    
    return 'Otros';
  };

  const filteredStaff = useMemo(() => {
    let list = staff;
    if (activeTab !== 'Todos') {
      list = staff.filter(person => getCategory(person) === activeTab);
    }
    
    // Lógica para ordenar a los de informática hacia atrás en Administración (que queden terceros)
    return list.sort((a, b) => {
      // Si ambos tienen un orden asignado en BD que no sea 0, respetamos la BD
      if (a.orden !== b.orden && a.orden !== 0 && b.orden !== 0) {
        return a.orden - b.orden;
      }
      
      const cargoA = a.cargo.toLowerCase();
      const cargoB = b.cargo.toLowerCase();
      
      const isIT_A = /(informátic|sistemas|ti|it|programador|desarrollador|software|soporte)/.test(cargoA);
      const isIT_B = /(informátic|sistemas|ti|it|programador|desarrollador|software|soporte)/.test(cargoB);
      
      // Si A es informática y B no lo es, A va después (al final/terceros)
      if (isIT_A && !isIT_B) return 1;
      // Si B es informática y A no lo es, B va después
      if (!isIT_A && isIT_B) return -1;
      
      return 0; // Se mantienen igual
    });
  }, [staff, activeTab]);

  return (
    <div className="staff-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Tabs / Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`btn ${activeTab === cat ? 'btn-primary' : 'btn-outline'}`}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '2rem',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Staff Grid */}
      {filteredStaff.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '3rem',
          opacity: 1,
          animation: 'fadeIn 0.5s ease-in-out'
        }}>
          {filteredStaff.map((person) => (
            <div key={person.id} className="card glass slide-up" style={{ textAlign: 'center', padding: '3rem 2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-accent)', padding: '3px' }}>
                {person.imagenUrl ? (
                  <img src={person.imagenUrl} alt={person.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '2rem' }}>
                    👤
                  </div>
                )}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{person.nombre}</h3>
              <p style={{ color: 'var(--color-accent)', fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>{person.cargo}</p>
              {person.descripcion && (
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flexGrow: 1 }}>{person.descripcion}</p>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: 'auto', paddingTop: '1.5rem' }}>
                {person.telefono && (
                  <a href={`tel:${person.telefono.replace(/\s+/g, '')}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={16} /> Llamar
                  </a>
                )}
                {person.email && (
                  <a href={`mailto:${person.email}`} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} /> Email
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--color-bg-glass)', borderRadius: '1rem' }}>
          <p style={{ color: 'var(--color-text-secondary)' }}>Aún no hay personal registrado en esta categoría.</p>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
