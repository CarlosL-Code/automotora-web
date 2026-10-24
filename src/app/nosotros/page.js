import { prisma } from '@/lib/prisma';
import { ShieldCheck, Heart, Search, Star, Handshake, Users } from 'lucide-react';
import Image from 'next/image';
import StaffGallery from '@/components/StaffGallery';
import styles from './nosotros.module.css';

export const revalidate = 0;

export const metadata = {
  title: "Sobre Nosotros | HM&C Motors Temuco",
  description: "Conoce la historia y el equipo de HM&C Motors en Temuco. Más de una década ofreciendo confianza, transparencia y autos garantizados en La Araucanía.",
  alternates: {
    canonical: "/nosotros",
  },
  openGraph: {
    title: "Sobre Nosotros | HM&C Motors Temuco",
    description: "Conoce a la familia HM&C Motors. Tu automotora de confianza en Avenida Caupolicán 579, Temuco.",
    url: "https://hmcautomotora.cl/nosotros",
  },
};

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
                  src="/images/automotora/galeria_4x3/04_exhibicion-frontal.webp" 
                  alt="Sucursal HM&C Motors en Avenida Caupolicán 579, Temuco" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 500px"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>
              <div className={styles.floatingImage}>
                <Image 
                  src="/images/automotora/galeria_4x3/06_exhibicion-bajo-carpa.webp" 
                  alt="Showroom y patio de exhibición HM&C Motors" 
                  fill 
                  sizes="(max-width: 768px) 60vw, 320px"
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
                  src="/images/automotora/galeria_4x3/02_vista-general-concesionaria.webp" 
                  alt="Exhibición de vehículos inspeccionados en HM&C Motors" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px"
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
                  src="/images/automotora/galeria_4x3/05_sedan-changan.webp" 
                  alt="Atención integral y financiamiento Autofin en concesionario" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className={styles.pillarContent}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNumber}>03</span>
                  <Star size={24} />
                </div>
                <h3 className={styles.pillarTitle}>Servicio Integral</h3>
                <p className={styles.pillarText}>
                  Te ofrecemos consignaciones, financiamiento con Autofin y apoyo en transferencias. Todo gestionado en <strong>un solo lugar</strong>.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Panoramic Real Dealership Showcase */}
        <section className="slide-up" style={{ marginBottom: '6rem' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '2 / 1', minHeight: '300px', borderRadius: '28px', overflow: 'hidden', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-lg)' }}>
            <Image
              src="/images/automotora/hero/hero-fotografia-real-1920x960.webp"
              alt="Vista panorámica real de HM&C Motors en Avenida Caupolicán 579, Temuco"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'clamp(1.5rem, 4vw, 3.5rem)',
              color: '#ffffff'
            }}>
              <span style={{ display: 'inline-block', width: 'fit-content', padding: '0.35rem 1rem', borderRadius: '999px', background: '#0F7143', fontSize: '0.78rem', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Casa Matriz · Av. Caupolicán 579, Temuco
              </span>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', marginBottom: '0.5rem', color: '#ffffff' }}>
                Un espacio pensado para tu confianza
              </h2>
              <p style={{ maxWidth: '720px', color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: 'clamp(0.95rem, 2vw, 1.1rem)' }}>
                Contamos con patio de exhibición y showroom techado en pleno corazón de Temuco para que revises, pruebes y financies tu próximo vehículo con total respaldo.
              </p>
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
          <div className="slide-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
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
