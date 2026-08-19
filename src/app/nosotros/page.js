import { prisma } from '@/lib/prisma';
import { ShieldCheck, Heart, Search, Star, Handshake, Users } from 'lucide-react';
import Image from 'next/image';
import StaffGallery from '@/components/StaffGallery';
import styles from './nosotros.module.css';

export const revalidate = 0;

export default async function NosotrosPage() {
  const staff = await prisma.staff.findMany({
    orderBy: { orden: 'asc' }
  });

  return (
    <main className={styles.pageWrapper}>
      <div className="container">
        
        {/* Clean Hero Section - Vidyard Style */}
        <section className={styles.heroSection}>
          <div className={`${styles.heroText} slide-up`}>
            <h1 className="text-gradient">Más que una empresa, una familia.</h1>
            <p>
              Fundada en 2025, nacimos por el interés familiar en el rubro automotriz, con el firme propósito de entregar un servicio más cercano, transparente y confiable. 
              <strong> Te acompañamos en cada paso</strong> para que encuentres el vehículo perfecto sin letra chica ni sorpresas.
            </p>
          </div>
          
          <div className={`${styles.heroVisual} slide-up`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.dotsPattern + ' ' + styles.dots1}></div>
            <div className={styles.dotsPattern + ' ' + styles.dots2}></div>
            <div className={styles.abstractShape}></div>
            
            <div className={styles.blobWrapper}>
              <Image 
                src="https://images.unsplash.com/photo-1573273787173-0eb81a833b34?auto=format&fit=crop&q=80&w=800" 
                alt="Familia recibiendo llaves de su nuevo auto" 
                fill 
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </section>

        {/* Visual Pillars Section */}
        <section className={`${styles.valuesSection} slide-up`} style={{ animationDelay: '0.4s' }}>
          <h2 className={styles.valuesTitle}>Nuestros Pilares</h2>
          
          <div className={styles.pillarsGrid}>
            
            {/* Pilar 1 */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarImageWrapper}>
                <Image 
                  src="/transparencia.jpg" 
                  alt="Trato transparente y familiar" 
                  fill 
                />
              </div>
              <div className={styles.pillarContent}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNumber}>01</span>
                  <Handshake size={24} />
                </div>
                <h3 className={styles.pillarTitle}>Transparencia Total</h3>
                <p className={styles.pillarText}>
                  Vamos siempre con la verdad por delante. Informamos con claridad el estado real de cada vehículo. <strong>Sin letra chica, sin sorpresas.</strong>
                </p>
              </div>
            </div>

            {/* Pilar 2 */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarImageWrapper}>
                <Image 
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600" 
                  alt="Revisión mecánica rigurosa" 
                  fill 
                />
              </div>
              <div className={styles.pillarContent}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNumber}>02</span>
                  <Search size={24} />
                </div>
                <h3 className={styles.pillarTitle}>Inspección Rigurosa</h3>
                <p className={styles.pillarText}>
                  Cada auto pasa por revisión mecánica y escáner profesional. Te entregamos la verdadera <strong>hoja de vida</strong> del vehículo.
                </p>
              </div>
            </div>

            {/* Pilar 3 */}
            <div className={styles.pillarCard}>
              <div className={styles.pillarImageWrapper}>
                <Image 
                  src="/servicio-integral.jpg" 
                  alt="Atención integral en concesionario" 
                  fill 
                />
              </div>
              <div className={styles.pillarContent}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNumber}>03</span>
                  <Star size={24} />
                </div>
                <h3 className={styles.pillarTitle}>Servicio Integral</h3>
                <p className={styles.pillarText}>
                  Te ofrecemos consignaciones, financiamiento y apoyo en transferencias. Todo gestionado en <strong>un solo lugar</strong>.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Vision Banner */}
        <section className={`${styles.visionBanner} slide-up`} style={{ animationDelay: '0.6s' }}>
          <h2>Nuestra Visión hacia el Futuro</h2>
          <p>
            Nuestra meta principal no es solo crecer en tamaño, sino consolidarnos como la automotora familiar <strong>más confiable y recomendada</strong> de Temuco y la región. Queremos que la post-venta sea igual de fuerte: te respaldamos incluso después de entregarte las llaves.
          </p>
        </section>

        {/* Staff Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Nuestro <span className="text-gradient">Equipo</span></h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Las personas detrás de HM&C Motors, listas para ayudarte.</p>
          </div>
          <StaffGallery staff={staff} />
        </section>

      </div>
    </main>
  );
}
