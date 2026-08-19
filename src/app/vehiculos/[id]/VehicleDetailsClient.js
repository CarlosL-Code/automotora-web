'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { Phone, MessageCircle, Calendar, Gauge, Settings, Fuel, Palette, Wrench } from 'lucide-react';

const SpecCard = ({ icon, label, value }) => (
  <div className="spec-card" style={{ 
    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', 
    backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', 
    borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  }}>
    <div style={{ 
      color: 'var(--color-accent)', padding: '0.75rem', 
      backgroundColor: 'var(--color-accent-light)', borderRadius: '12px', 
      display: 'flex', alignItems: 'center', justifyContent: 'center' 
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', fontWeight: '600' }}>{label}</p>
      <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>{value}</p>
    </div>
  </div>
);

export default function VehicleDetailsClient({ vehicle, images, mainImage, ejecutivos = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <main style={{ paddingTop: '2rem', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <div style={{ marginBottom: '2rem', marginTop: '80px' }}>
          <Link href="/vehiculos" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '99px', backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)', transition: 'all 0.2s' }} className="hover-accent">
            ← Volver al catálogo
          </Link>
        </div>

        <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* Gallery - Sticky Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', position: 'sticky', top: '100px' }}>
            {images.length > 0 ? (
              <div className="embla" ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '24px', backgroundColor: 'var(--color-bg-card)', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                <div className="embla__container" style={{ display: 'flex' }}>
                  {images.map((img, index) => (
                    <div className="embla__slide" key={index} style={{ flex: '0 0 100%', minWidth: 0, position: 'relative', paddingTop: '75%' }}>
                      <img src={img} alt={`${vehicle.marca} ${vehicle.modelo} - Imagen ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
                {/* Dots indicator */}
                {images.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '1.5rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 10 }}>
                    {images.map((_, index) => (
                      <button 
                        key={index} 
                        onClick={() => emblaApi?.scrollTo(index)}
                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: index === selectedIndex ? '#ffffff' : 'rgba(255,255,255,0.4)', border: index === selectedIndex ? '2px solid rgba(0,0,0,0.2)' : 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s' }}
                        aria-label={`Ir a la imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ width: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: 'var(--color-bg-card)', paddingTop: '75%', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                <img src={mainImage} alt={`${vehicle.marca} ${vehicle.modelo}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
          </div>

          {/* Details - Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Header / Title */}
            <div>
              {vehicle.estado !== 'DISPONIBLE' && (
                <div style={{ display: 'inline-block', padding: '0.4rem 1rem', background: vehicle.estado === 'VENDIDO' ? 'var(--color-danger)' : '#f59e0b', color: '#fff', borderRadius: '99px', fontWeight: '700', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                  {vehicle.estado}
                </div>
              )}
              <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
                {vehicle.marca} <span style={{ fontWeight: '300', color: 'var(--color-text-secondary)' }}>{vehicle.modelo}</span>
              </h1>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ${vehicle.precio.toLocaleString('es-CL')}
              </div>
            </div>

            {/* Bento Grid Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <SpecCard icon={<Calendar size={20} />} label="Año" value={vehicle.ano} />
              <SpecCard icon={<Gauge size={20} />} label="Kilometraje" value={`${vehicle.kilometraje.toLocaleString('es-CL')} km`} />
              <SpecCard icon={<Settings size={20} />} label="Transmisión" value={vehicle.transmision} />
              <SpecCard icon={<Fuel size={20} />} label="Combustible" value={vehicle.combustible} />
              {vehicle.motor && <SpecCard icon={<Wrench size={20} />} label="Motor" value={vehicle.motor} />}
              {vehicle.color && <SpecCard icon={<Palette size={20} />} label="Color" value={vehicle.color} />}
            </div>

            {/* Description Area */}
            <div className="card glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ width: '4px', height: '24px', backgroundColor: 'var(--color-accent)', borderRadius: '4px' }}></span>
                Descripción
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '1.05rem' }}>
                {vehicle.descripcion || 'Sin descripción adicional.'}
              </p>
            </div>

            <Link href="/contacto" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: '700', borderRadius: '16px', textAlign: 'center', display: 'block', boxShadow: '0 10px 25px rgba(15, 113, 67, 0.3)' }}>
              Solicitar Información
            </Link>

          </div>
        </div>

        {/* Carousel de Ejecutivos */}
        {ejecutivos && ejecutivos.length > 0 && (
          <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>¿Te interesa este vehículo? <br/><span className="text-gradient">Contacta a un ejecutivo</span></h3>
            
            {/* Contenedor scrolleable (carrusel simple) */}
            <div className="ejecutivos-carousel" style={{ 
              display: 'flex', 
              gap: '1.5rem', 
              overflowX: 'auto', 
              paddingBottom: '1.5rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--color-accent) rgba(0,0,0,0.1)'
            }}>
              {ejecutivos.map(person => (
                <div key={person.id} className="card glass" style={{ minWidth: '280px', maxWidth: '300px', flex: '0 0 auto', scrollSnapAlign: 'start', textAlign: 'center', padding: '2rem 1.5rem' }}>
                  <div style={{ width: '100px', height: '100px', margin: '0 auto 1rem', borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--color-accent)', padding: '2px' }}>
                    {person.imagenUrl ? (
                      <img src={person.imagenUrl} alt={person.nombre} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)', fontSize: '1.5rem' }}>
                        👤
                      </div>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{person.nombre}</h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{person.cargo}</p>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    {person.telefono && (
                      <>
                        <a href={`tel:${person.telefono.replace(/\s+/g, '')}`} className="btn btn-primary" style={{ padding: '0.5rem', fontSize: '0.85rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={14} /> Llamar
                        </a>
                        <a 
                          href={`https://wa.me/${person.telefono.replace(/[\s+]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-whatsapp" 
                          style={{ padding: '0.5rem', fontSize: '0.85rem', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.3rem' }}
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
        .ejecutivos-carousel::-webkit-scrollbar {
          height: 6px;
        }
        .ejecutivos-carousel::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
          border-radius: 10px;
        }
        .ejecutivos-carousel::-webkit-scrollbar-thumb {
          background-color: var(--color-accent);
          border-radius: 10px;
        }
      `}</style>
    </main>
  );
}
