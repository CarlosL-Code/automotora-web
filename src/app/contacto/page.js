'use client';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <main style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
          Ponte en <span className="text-gradient">Contacto</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          ¿Tienes dudas o quieres agendar una visita? Escríbenos y un ejecutivo se pondrá en contacto contigo a la brevedad.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* Info */}
          <div>
            <div className="card glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Información</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-accent)', padding: '0.5rem', background: 'var(--color-accent-light)', borderRadius: '50%' }}><MapPin size={24} /></div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Dirección</h4>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Av. Principal 123, Ciudad, País</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-accent)', padding: '0.5rem', background: 'var(--color-accent-light)', borderRadius: '50%' }}><Phone size={24} /></div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Teléfono</h4>
                    <p style={{ color: 'var(--color-text-secondary)' }}>+56 9 1234 5678</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-accent)', padding: '0.5rem', background: 'var(--color-accent-light)', borderRadius: '50%' }}><Mail size={24} /></div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Email</h4>
                    <p style={{ color: 'var(--color-text-secondary)' }}>contacto@hmcautomotora.cl</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-accent)', padding: '0.5rem', background: 'var(--color-accent-light)', borderRadius: '50%' }}><Clock size={24} /></div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Horario</h4>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Lunes a Viernes: 09:00 - 18:30<br/>Sábados: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card glass" style={{ padding: '3rem' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Envíanos un mensaje</h3>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nombre Completo</label>
                  <input type="text" className="input" placeholder="Tu nombre" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Teléfono</label>
                  <input type="text" className="input" placeholder="+56 9 0000 0000" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email</label>
                <input type="email" className="input" placeholder="tu@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mensaje</label>
                <textarea className="input" rows="5" placeholder="¿En qué te podemos ayudar?"></textarea>
              </div>
              <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => alert('Formulario de prueba')}>
                Enviar Mensaje
              </button>
            </form>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .container > div:nth-child(3) {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </main>
  );
}
