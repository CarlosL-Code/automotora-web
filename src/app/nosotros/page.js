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

        {/* Luxury List - Pilares */}
        <section className={`${styles.valuesSection} slide-up`} style={{ animationDelay: '0.4s' }}>
          <h2 className={styles.valuesTitle}>Nuestros Pilares</h2>
          
          <div className={styles.luxuryList}>
            <div className={styles.luxuryRow}>
              <div className={styles.luxuryNumber}>01</div>
              <div className={styles.luxuryTitleWrapper}>
                <div className={styles.luxuryIcon}><Handshake size={28} /></div>
                <div className={styles.luxuryTitle}>Transparencia Total</div>
              </div>
              <div className={styles.luxuryText}>
                Vamos siempre con la verdad por delante. Informamos con claridad el estado real, condiciones y valores de cada vehículo. <strong>Sin letra chica, sin sorpresas.</strong>
              </div>
            </div>

            <div className={styles.luxuryRow}>
              <div className={styles.luxuryNumber}>02</div>
              <div className={styles.luxuryTitleWrapper}>
                <div className={styles.luxuryIcon}><Search size={28} /></div>
                <div className={styles.luxuryTitle}>Inspección Rigurosa</div>
              </div>
              <div className={styles.luxuryText}>
                Previo a la venta, cada auto pasa por revisión mecánica, escáner profesional y chequeo de historial Autofact. Te entregamos la <strong>verdadera hoja de vida</strong> del vehículo.
              </div>
            </div>

            <div className={styles.luxuryRow}>
              <div className={styles.luxuryNumber}>03</div>
              <div className={styles.luxuryTitleWrapper}>
                <div className={styles.luxuryIcon}><Star size={28} /></div>
                <div className={styles.luxuryTitle}>Servicio Integral</div>
              </div>
              <div className={styles.luxuryText}>
                Te ofrecemos consignaciones, financiamiento, recepción en parte de pago y apoyo en transferencias. Todo gestionado <strong>en un solo lugar</strong> para tu comodidad.
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
