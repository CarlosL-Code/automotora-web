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
        
        {/* Premium Hero Section */}
        <section className={styles.heroSection}>
          <div className={`${styles.heroText} slide-up`}>
            <div className={styles.premiumTag}>
              <span className={styles.premiumTagDot}></span>
              Nuestra Historia
            </div>
            <h1>Más que una empresa,<br/> <span style={{ color: '#0F7143' }}>una familia.</span></h1>
            <p>
              Fundada en 2025, nacimos por el interés familiar en el rubro automotriz, con el firme propósito de entregar un servicio más cercano, transparente y confiable. 
              <br/><br/>
              <strong>Te acompañamos en cada paso</strong> para que encuentres el vehículo perfecto sin letra chica ni sorpresas. Tu tranquilidad es nuestro mayor éxito.
            </p>
          </div>
          
          <div className={`${styles.heroVisual} slide-up`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <Image 
                  src="/transparencia.jpg" 
                  alt="Atención personalizada en concesionario" 
                  fill 
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className={styles.floatingImage}>
                <Image 
                  src="/hero-bg.jpg" 
                  alt="Vehículo premium" 
                  fill 
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.experienceBadge}>
                <div className={styles.badgeNumber}>100%</div>
                <div className={styles.badgeText}>Transparencia<br/>Garantizada</div>
              </div>
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

        {/* Team Section */}
        <section className={styles.teamSection}>
          <div className="text-center slide-up" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Nuestro <span style={{ color: '#0F7143' }}>Equipo</span>
            </h2>
            <p className="subtitle" style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Los profesionales detrás de HM&C Motors, comprometidos con tu tranquilidad.
            </p>
          </div>
          
          <StaffGallery staff={staff} />
        </section>

      </div>
    </main>
  );
}
