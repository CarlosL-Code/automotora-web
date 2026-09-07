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
            className={activeTab === cat ? 'staff-tab-active' : 'staff-tab'}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 280px))', 
          justifyContent: 'center',
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
                
                <div className="dept-badge">
                  {getIconForCategory(cat)}
                  {cat}
                </div>
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
        .staff-tab {
          padding: 0.6rem 1.8rem;
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .staff-tab:hover {
          background: rgba(15, 113, 67, 0.05);
          color: var(--color-text-primary);
        }

        .staff-tab-active {
          padding: 0.6rem 1.8rem;
          border-radius: 100px;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #0F7143;
          border: 1px solid #0F7143;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(15, 113, 67, 0.3);
        }

        .staff-card {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: var(--color-bg-card);
          cursor: pointer;
          transform: translateY(0);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
        }
        
        .staff-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }

        .staff-image-bg {
          position: relative;
          width: 100%;
          aspect-ratio: 1/1;
          overflow: hidden;
          background: #f0f0f0;
        }

        [data-theme='dark'] .staff-image-bg {
          background: #111;
        }

        .staff-img-element {
          transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
        }

        .staff-card:hover .staff-img-element {
          transform: scale(1.05) !important;
        }

        .staff-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-card);
        }

        .dept-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 10;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .staff-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .staff-name {
          color: var(--color-text-primary);
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 0.2rem;
        }

        .staff-role {
          color: #0F7143;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.5rem;
        }

        [data-theme='dark'] .staff-role {
          color: #22a061;
        }

        .staff-actions-reveal {
          display: flex;
          gap: 0.5rem;
          margin-top: auto;
        }

        .staff-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.7rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .btn-call {
          background: var(--color-bg);
          color: var(--color-text-primary);
          border: 1px solid var(--color-border);
        }

        .btn-call:hover {
          background: rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }

        [data-theme='dark'] .btn-call:hover {
          background: rgba(255,255,255,0.05);
        }

        .btn-wa {
          background: #25D366;
          color: white;
        }

        .btn-wa:hover {
          background: #20b858;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }
      `}</style>
    </div>
  );
}
