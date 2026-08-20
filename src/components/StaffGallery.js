'use client';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Phone, MessageCircle, Briefcase, Monitor, Wrench, Users, ShieldCheck } from 'lucide-react';

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
    if (/(informátic|sistemas|\bti\b|\bit\b|programador|desarrollador|software|soporte)/.test(cargo)) return 'TI';
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
      
      const isIT_A = /(informátic|sistemas|\bti\b|\bit\b|programador|desarrollador|software|soporte)/.test(cargoA);
      const isIT_B = /(informátic|sistemas|\bti\b|\bit\b|programador|desarrollador|software|soporte)/.test(cargoB);
      
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
          gap: '2.5rem',
        }}>
          {filteredStaff.map((person, index) => {
            const cat = getCategory(person);
            return (
            <div key={person.id} className="staff-card slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
              
              <div className="staff-image-bg">
                {person.imagenUrl ? (
                  <Image 
                    src={person.imagenUrl} 
                    alt={person.nombre} 
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: 'cover' }} 
                    className="staff-img-element"
                  />
                ) : (
                  <div className="staff-placeholder">
                    <Users size={64} opacity={0.3} />
                  </div>
                )}
                <div className="staff-overlay"></div>
                
                <div className="dept-badge">
                  {getIconForCategory(cat)}
                  {cat}
                </div>

                <div className="staff-info">
                  <h3 className="staff-name">{person.nombre}</h3>
                  <p className="staff-role">
                    {person.cargo && person.cargo.includes(' | [') ? person.cargo.split(' | [')[0] : person.cargo}
                  </p>
                  
                  <div className="staff-actions-reveal">
                    {person.telefono && (
                      <>
                        <a href={`tel:${person.telefono.replace(/\s+/g, '')}`} className="staff-btn btn-call" title="Llamar">
                          <Phone size={18} /> Llamar
                        </a>
                        <a 
                          href={`https://wa.me/${person.telefono.replace(/[\s+]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="staff-btn btn-wa" 
                          title="WhatsApp"
                        >
                          <MessageCircle size={18} /> WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--color-bg-glass)', borderRadius: '1.5rem', border: '1px solid var(--color-border)' }}>
          <Users size={64} style={{ color: 'var(--color-border)', margin: '0 auto 1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>Aún no hay personal registrado en esta categoría.</p>
        </div>
      )}

      <style jsx>{`
        .staff-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 3/4;
          cursor: pointer;
          transform: translateY(0);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        
        .staff-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 20px rgba(var(--color-accent-rgb), 0.2);
        }

        .staff-image-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .staff-img-element {
          transition: transform 0.7s ease !important;
        }

        .staff-card:hover .staff-img-element {
          transform: scale(1.1) !important;
        }

        .staff-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-card);
        }

        .staff-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%);
          transition: opacity 0.4s ease;
        }

        .dept-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(15, 113, 67, 0.9);
          backdrop-filter: blur(8px);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 10;
          transform: translateY(0);
          transition: transform 0.4s ease;
        }

        .staff-card:hover .dept-badge {
          transform: translateY(-5px);
        }

        .staff-info {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 2rem 1.5rem;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }

        .staff-name {
          color: white;
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.2rem;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }

        .staff-role {
          color: var(--color-accent);
          font-size: 0.95rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1rem;
          transform: translateY(20px);
          transition: transform 0.4s ease;
        }

        .staff-actions-reveal {
          display: flex;
          gap: 0.75rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.4s ease;
          pointer-events: none;
        }

        .staff-card:hover .staff-name,
        .staff-card:hover .staff-role {
          transform: translateY(0);
        }

        .staff-card:hover .staff-actions-reveal {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          transition-delay: 0.1s;
        }

        .staff-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: transform 0.2s ease, filter 0.2s ease;
        }

        .staff-btn:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        .btn-call {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .btn-wa {
          background: #25D366;
          color: white;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
        }
      `}</style>
    </div>
  );
}
