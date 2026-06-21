'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function VehicleDetailsClient({ vehicle, images, mainImage }) {
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
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/vehiculos" style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ← Volver al catálogo
          </Link>
        </div>

        <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Gallery - Embla Carousel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '100%' }}>
            {images.length > 0 ? (
              <div className="embla" ref={emblaRef} style={{ overflow: 'hidden', borderRadius: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                <div className="embla__container" style={{ display: 'flex' }}>
                  {images.map((img, index) => (
                    <div className="embla__slide" key={index} style={{ flex: '0 0 100%', minWidth: 0, position: 'relative', paddingTop: '60%' }}>
                      <img src={img} alt={`${vehicle.marca} ${vehicle.modelo} - Imagen ${index + 1}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  ))}
                </div>
                {/* Dots indicator */}
                {images.length > 1 && (
                  <div style={{ position: 'absolute', bottom: '1rem', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '0.5rem', zIndex: 10 }}>
                    {images.map((_, index) => (
                      <button 
                        key={index} 
                        onClick={() => emblaApi?.scrollTo(index)}
                        style={{ width: '10px', height: '10px', borderRadius: '50%', background: index === selectedIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', padding: 0 }}
                        aria-label={`Ir a la imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ width: '100%', borderRadius: '1rem', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)', paddingTop: '60%', position: 'relative' }}>
                <img src={mainImage} alt={`${vehicle.marca} ${vehicle.modelo}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="card glass" style={{ padding: '3rem' }}>
            {vehicle.estado !== 'DISPONIBLE' && (
              <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: vehicle.estado === 'VENDIDO' ? 'var(--color-danger)' : '#f59e0b', color: '#fff', borderRadius: '20px', fontWeight: 'bold', marginBottom: '1rem' }}>
                {vehicle.estado}
              </div>
            )}
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{vehicle.marca} <span className="text-gradient">{vehicle.modelo}</span></h1>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-accent)', marginBottom: '2rem' }}>
              ${vehicle.precio.toLocaleString('es-CL')}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Año</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.ano}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Kilometraje</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.kilometraje.toLocaleString('es-CL')} km</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Transmisión</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.transmision}</p>
              </div>
              <div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Combustible</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.combustible}</p>
              </div>
              {vehicle.motor && (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Motor</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.motor}</p>
                </div>
              )}
              {vehicle.color && (
                <div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Color</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{vehicle.color}</p>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Descripción</h3>
              <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
                {vehicle.descripcion || 'Sin descripción adicional.'}
              </p>
            </div>

            <Link href="/contacto" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', textAlign: 'center', display: 'block' }}>
              Solicitar Información
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}
