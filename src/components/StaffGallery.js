'use client';
import { useState, useMemo } from 'react';
import { Phone, Mail, Briefcase, Monitor, Wrench, Users, ShieldCheck } from 'lucide-react';

export default function StaffGallery({ staff }) {
  const [activeTab, setActiveTab] = useState('Todos');

  const categories = ['Todos', 'Administración', 'Ventas', 'TI'];

  const getCategory = (person) => {
    const cargoFull = person.cargo || '';
    if (cargoFull.includes(' | [')) {
      const tag = cargoFull.split(' | [')[1].replace(']', '').trim();
      if (tag === 'Administración') return 'Administración';
      if (tag === 'Ventas') return 'Ventas';
      if (tag === 'TI') return 'TI';
    }
    const cargo = cargoFull.toLowerCase();
    if (/(informátic|sistemas|ti|it|programador|desarrollador|software|soporte)/.test(cargo)) return 'TI';
    if (/(jefe|admin|gerent|director|encargado)/.test(cargo)) return 'Administración';
    if (person.esEjecutivo || /(ejecutiv|venta|comercial|asesor|mecánic|taller|servicio|técnico|mantenimiento)/.test(cargo)) return 'Ventas';
    return 'Otros';
  };

  const getIconForCategory = (cat) => {
    switch (cat) {
      case 'TI': return <Monitor size={16} />;
      case 'Administración': return <ShieldCheck size={16} />;
      case 'Ventas': return <Wrench size={16} />;
      default: return <Briefcase size={16} />;
    }
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
            className={`btn ${activeTab === cat ? 'btn-primary' : 'btn-outline'} staff-tab`}
            style={{
              padding: '0.6rem 1.8rem',
              borderRadius: '2rem',
              fontSize: '0.95rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: '600'
            }}
          >
            {getIconForCategory(cat)}
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
        }}>
          {filteredStaff.map((person, index) => {
            const cat = getCategory(person);
            return (
            <div key={person.id} className="staff-card card glass slide-up" style={{ 
              animationDelay: `${index * 0.1}s`,
              textAlign: 'center', 
              padding: '3rem 2rem 2.5rem', 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible'
            }}>
              
              {/* Badge del Departamento */}
              <div className="dept-badge" style={{
                position: 'absolute',
                top: '-15px',
                right: '20px',
                background: 'var(--color-accent)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                zIndex: 10
              }}>
                {getIconForCategory(cat)}
                {cat.toUpperCase()}
              </div>

              {/* Contenedor de Imagen con Efectos */}
              <div className="staff-img-wrapper" style={{ 
                width: '130px', 
                height: '130px', 
                margin: '0 auto 1.5rem', 
                borderRadius: '50%', 
                padding: '4px',
                background: 'linear-gradient(135deg, var(--color-accent) 0%, transparent 100%)',
                position: 'relative'
              }}>
                <div className="staff-img-inner" style={{
                  width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden', backgroundColor: 'var(--color-bg)'
                }}>
                  {person.imagenUrl ? (
                    <img src={person.imagenUrl} alt={person.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '3rem' }}>
                      👤
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className="staff-name" style={{ fontSize: '1.4rem', marginBottom: '0.25rem', fontWeight: '800' }}>{person.nombre}</h3>
              <p className="staff-role" style={{ color: 'var(--color-accent)', fontWeight: '700', marginBottom: '1rem', fontSize: '0.9rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                {person.cargo && person.cargo.includes(' | [') ? person.cargo.split(' | [')[0] : person.cargo}
              </p>
              
              <div style={{ width: '40px', height: '3px', background: 'var(--color-border)', margin: '0 auto 1.5rem', borderRadius: '2px' }}></div>

              {person.descripcion && (
                <p className="staff-desc" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', flexGrow: 1, lineHeight: '1.6' }}>{person.descripcion}</p>
              )}
              
              <div className="staff-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: 'auto' }}>
                {person.telefono && (
                  <a href={`tel:${person.telefono.replace(/\s+/g, '')}`} className="staff-btn staff-btn-primary" title="Llamar">
                    <Phone size={18} /> <span>Llamar</span>
                  </a>
                )}
                {person.email && (
                  <a href={`mailto:${person.email}`} className="staff-btn staff-btn-secondary" title="Enviar Email">
                    <Mail size={18} /> <span>Email</span>
                  </a>
                )}
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--color-bg-glass)', borderRadius: '1.5rem', border: '1px solid var(--color-border)' }}>
          <Users size={64} style={{ color: 'var(--color-border)', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Aún no hay personal registrado en esta categoría.</p>
        </div>
      )}

      <style jsx>{`
        .staff-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform: translateY(0);
          border: 1px solid rgba(255,255,255,0.05);
        }
        .staff-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(var(--color-accent-rgb), 0.2);
          border-color: rgba(255,255,255,0.1);
        }
        .staff-img-wrapper {
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .staff-card:hover .staff-img-wrapper {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 0 10px 25px rgba(var(--color-accent-rgb), 0.4);
        }
        .staff-img-inner img {
          transition: transform 0.5s ease;
        }
        .staff-card:hover .staff-img-inner img {
          transform: scale(1.1);
        }
        .dept-badge {
          transition: all 0.3s ease;
        }
        .staff-card:hover .dept-badge {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(var(--color-accent-rgb), 0.5);
        }
        
        .staff-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 2rem;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          text-decoration: none;
          flex: 1;
        }
        .staff-btn-primary {
          background: var(--color-accent);
          color: white;
          box-shadow: 0 4px 15px rgba(var(--color-accent-rgb), 0.3);
        }
        .staff-btn-primary:hover {
          background: var(--color-accent-light);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(var(--color-accent-rgb), 0.5);
        }
        .staff-btn-secondary {
          background: transparent;
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }
        .staff-btn-secondary:hover {
          background: var(--color-accent-light);
          transform: translateY(-2px);
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        .staff-tab:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
