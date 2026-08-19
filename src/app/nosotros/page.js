import { prisma } from '@/lib/prisma';
import { Phone, Mail, ShieldCheck, Heart, Search, Handshake, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import StaffGallery from '@/components/StaffGallery';

export const revalidate = 0;

export default async function NosotrosPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { orden: 'asc' }
  });

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Hero Section (Imagen de fondo) */}
      <div style={{ position: 'relative', width: '100%', height: '50vh', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Image 
          src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=2000" 
          alt="Showroom de Autos Premium" 
          fill 
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, var(--color-bg) 100%)' }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', paddingTop: '4rem' }}>
          <h1 className="slide-up" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: '#ffffff', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Acerca de <span className="text-gradient">HM&C Motors</span>
          </h1>
          <p className="slide-up" style={{ animationDelay: '0.2s', fontSize: '1.25rem', color: '#e2e8f0', maxWidth: '800px', margin: '0 auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Fundada en 2025, nacimos por el interés familiar en el rubro automotriz, con el firme propósito de entregar un servicio más cercano, transparente y confiable.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-4rem', position: 'relative', zIndex: 10 }}>
        
        {/* Premium Alternating Feature 1 */}
        <div className="feature-row slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="feature-img-wrapper">
            <Image src="https://images.unsplash.com/photo-1573273787173-0eb81a833b34?auto=format&fit=crop&q=80&w=800" alt="Espíritu Familiar" fill style={{ objectFit: 'cover' }} className="feature-img" />
          </div>
          <div className="feature-text card glass">
            <div className="icon-badge"><Heart size={24} /></div>
            <h2>Espíritu Familiar & Transparencia</h2>
            <p>
              No somos solo una empresa, <strong>somos una familia</strong>. Entregamos un trato humano, amigable y paciente, acompañándote en cada paso para que te sientas en casa.
            </p>
            <p>
              Vamos siempre con la verdad por delante. Informamos con claridad el estado real, condiciones y valores de cada vehículo. <strong>Sin sorpresas ni letra chica.</strong>
            </p>
          </div>
        </div>

        {/* Premium Alternating Feature 2 */}
        <div className="feature-row reverse slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="feature-img-wrapper">
            <Image src="https://images.unsplash.com/photo-1632823465306-ed26938dc860?auto=format&fit=crop&q=80&w=800" alt="Inspección Rigurosa" fill style={{ objectFit: 'cover' }} className="feature-img" />
          </div>
          <div className="feature-text card glass">
            <div className="icon-badge"><Search size={24} /></div>
            <h2>Inspección Rigurosa & Calidad</h2>
            <p>
              Previo a la venta, cada auto pasa por revisión mecánica profunda, escáner profesional y chequeo de historial Autofact.
            </p>
            <ul className="feature-list">
              <li><ShieldCheck size={18} color="var(--color-accent)"/> Revisión mecánica certificada</li>
              <li><Star size={18} color="var(--color-accent)"/> Hoja de vida real del vehículo</li>
              <li><Handshake size={18} color="var(--color-accent)"/> Apoyo integral en transferencias y financiamiento</li>
            </ul>
          </div>
        </div>

        {/* Vision Banner */}
        <div className="vision-banner slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="vision-content glass">
            <h2>Nuestra Visión hacia el Futuro</h2>
            <p>
              Desde nuestro primer día hemos evolucionado enormemente. Nuestra meta principal no es solo crecer en tamaño, sino consolidarnos como la automotora familiar <strong>más confiable y recomendada</strong> de Temuco y la región. Queremos que la post-venta sea igual de fuerte: te respaldamos incluso después de entregarte las llaves.
            </p>
          </div>
        </div>

        {/* Staff Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '6rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Nuestro <span className="text-gradient">Equipo</span></h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Las personas detrás de HM&C Motors, listas para ayudarte en lo que necesites.</p>
        </div>

        <StaffGallery staff={staff} />
      </div>
    </main>
  );
}
