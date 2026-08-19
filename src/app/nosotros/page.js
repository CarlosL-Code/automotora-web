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

        {/* Clean Values Grid - Clearcover Style */}
        <section className={`${styles.valuesSection} slide-up`} style={{ animationDelay: '0.4s' }}>
          <h2 className={styles.valuesTitle}>Nuestros Pilares</h2>
          
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><Handshake size={32} /></div>
              <h3>Transparencia Total</h3>
              <p>Vamos siempre con la verdad por delante. Informamos con claridad el estado real, condiciones y valores de cada vehículo. Sin sorpresas.</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><Search size={32} /></div>
              <h3>Inspección Rigurosa</h3>
              <p>Previo a la venta, cada auto pasa por revisión mecánica, escáner y chequeo de historial Autofact. Te entregamos la verdadera hoja de vida.</p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}><Star size={32} /></div>
              <h3>Servicio Integral</h3>
              <p>Te ofrecemos consignaciones, financiamiento, recepción en parte de pago y apoyo en transferencias. Todo en un solo lugar.</p>
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
