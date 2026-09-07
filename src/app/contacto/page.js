'use client';
import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ nombre: '', telefono: '', email: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: '¡Mensaje enviado exitosamente! Te contactaremos pronto.' });
        setFormData({ nombre: '', telefono: '', email: '', mensaje: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Hubo un error al enviar el mensaje.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error de red al enviar el mensaje.' });
    }
    setLoading(false);
  };

  return (
    <main style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '5rem' }}>
      <div className="container">
        
        {/* Premium Header */}
        <div className="text-center slide-up" style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1.2rem', background: 'rgba(15, 113, 67, 0.05)', border: '1px solid rgba(15, 113, 67, 0.1)', borderRadius: '100px', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--color-accent)', borderRadius: '50%', animation: 'pulse-dot 2s infinite' }}></span>
            Contacto
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', letterSpacing: '-0.03em', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
            Ponte en <span style={{ color: '#0F7143' }}>Contacto</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            ¿Tienes dudas o quieres agendar una visita? Escríbenos y un ejecutivo de alto nivel se pondrá en contacto contigo a la brevedad.
          </p>
        </div>

        <div className="contact-grid slide-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Columna Izquierda: Info y Mapa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Info Card */}
            <div className="premium-card">
              <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Icon icon="solar:info-circle-bold-duotone" width="28" style={{ color: '#0F7143' }} />
                Información
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="info-item">
                  <div className="info-icon"><Icon icon="solar:map-point-bold-duotone" width="24" /></div>
                  <div>
                    <h4>Dirección</h4>
                    <p>Avenida Caupolicán 579, Temuco</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><Icon icon="solar:phone-calling-bold-duotone" width="24" /></div>
                  <div>
                    <h4>Teléfono</h4>
                    <p>(+56) 9 58251226</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><Icon icon="solar:letter-bold-duotone" width="24" /></div>
                  <div>
                    <h4>Email</h4>
                    <p>contacto@hmcautomotora.cl</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon"><Icon icon="solar:clock-circle-bold-duotone" width="24" /></div>
                  <div>
                    <h4>Horario</h4>
                    <p>Lunes a Viernes: 9:00 - 19:00<br/>Sábado: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa Card */}
            <div className="premium-card" style={{ padding: '0.5rem', height: '300px', overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.4116499692415!2d-72.593798!3d-38.7369344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c3337a4453%3A0xc6657c91ba2d6c6e!2sAv.%20Caupolic%C3%A1n%20579%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1rem', filter: 'contrast(1.1) saturate(1.1)' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Automotora HMC"
              ></iframe>
            </div>
          </div>

          {/* Columna Derecha: Formulario Premium */}
          <div className="premium-card form-card">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', fontWeight: '800' }}>Envíanos un mensaje</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Completa el formulario y te daremos prioridad en la atención.</p>
            
            {status && (
              <div style={{ padding: '1rem', marginBottom: '2rem', borderRadius: '1rem', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                <Icon icon={status.type === 'success' ? "solar:check-circle-bold-duotone" : "solar:danger-triangle-bold-duotone"} width="20" />
                {status.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-row">
                <div className="input-group">
                  <label>Nombre Completo</label>
                  <div className="input-wrapper">
                    <Icon icon="solar:user-rounded-bold-duotone" width="20" className="input-icon" />
                    <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Tu nombre" />
                  </div>
                </div>
                <div className="input-group">
                  <label>Teléfono</label>
                  <div className="input-wrapper">
                    <Icon icon="solar:phone-bold-duotone" width="20" className="input-icon" />
                    <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+56 9 0000 0000" />
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <Icon icon="solar:letter-bold-duotone" width="20" className="input-icon" />
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="tu@email.com" />
                </div>
              </div>
              <div className="input-group">
                <label>Mensaje</label>
                <div className="input-wrapper" style={{ alignItems: 'flex-start' }}>
                  <Icon icon="solar:pen-bold-duotone" width="20" className="input-icon" style={{ marginTop: '1rem' }} />
                  <textarea required name="mensaje" value={formData.mensaje} onChange={handleChange} rows="5" placeholder="¿En qué te podemos ayudar?"></textarea>
                </div>
              </div>
              <button type="submit" disabled={loading} className="premium-btn" style={{ marginTop: '1rem' }}>
                {loading ? <Icon icon="solar:spinner-bold-duotone" width="24" className="spin" /> : <Icon icon="solar:plain-bold-duotone" width="24" />}
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>

        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 3rem;
          align-items: start;
        }
        
        .premium-card {
          background: var(--color-bg-card);
          border: 1px solid var(--color-border);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .premium-card:hover {
          box-shadow: 0 15px 50px rgba(0,0,0,0.06);
        }

        .form-card {
          padding: 3rem;
        }

        .info-item {
          display: flex;
          gap: 1.2rem;
          align-items: flex-start;
        }

        .info-icon {
          color: #0F7143;
          padding: 0.8rem;
          background: rgba(15, 113, 67, 0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        [data-theme='dark'] .info-icon {
          color: #22a061;
          background: rgba(34, 160, 97, 0.15);
        }

        .info-item h4 {
          margin-bottom: 0.2rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .info-item p {
          color: var(--color-text-secondary);
          line-height: 1.5;
          font-size: 0.95rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--color-text-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 0.2rem;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.2rem;
          color: var(--color-text-secondary);
          opacity: 0.7;
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .input-wrapper input,
        .input-wrapper textarea {
          width: 100%;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 16px;
          padding: 1rem 1.2rem 1rem 3.5rem;
          font-family: inherit;
          font-size: 1rem;
          color: var(--color-text-primary);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
        }

        .input-wrapper textarea {
          padding-top: 1.2rem;
          resize: vertical;
        }

        .input-wrapper input:focus,
        .input-wrapper textarea:focus {
          outline: none;
          border-color: #0F7143;
          box-shadow: 0 0 0 4px rgba(15, 113, 67, 0.1);
          background: var(--color-bg-card);
        }

        .input-wrapper input:focus + .input-icon,
        .input-wrapper textarea:focus + .input-icon,
        .input-wrapper input:focus ~ .input-icon,
        .input-wrapper textarea:focus ~ .input-icon {
          color: #0F7143;
          opacity: 1;
        }

        .premium-btn {
          background: #0F7143;
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 100px;
          font-weight: 800;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 20px rgba(15, 113, 67, 0.2);
        }

        .premium-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(15, 113, 67, 0.3);
          background: #0c5a35;
        }

        .premium-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 992px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .form-card {
            padding: 2rem 1.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}
