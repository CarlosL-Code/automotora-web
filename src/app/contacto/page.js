'use client';
import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';

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
    <main style={{ paddingTop: '1rem', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container slide-up">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
          Ponte en <span className="text-gradient">Contacto</span>
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem', padding: '0 1rem' }}>
          ¿Tienes dudas o quieres agendar una visita? Escríbenos y un ejecutivo se pondrá en contacto contigo a la brevedad.
        </p>

        <div className="contact-grid">
          
          {/* Columna Izquierda: Info y Mapa */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Info Card */}
            <div className="card glass" style={{ padding: '2.5rem' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Información</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-accent)', padding: '0.5rem', background: 'var(--color-accent-light)', borderRadius: '50%' }}><MapPin size={24} /></div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Dirección</h4>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Avenida Caupolicán 579, Temuco</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ color: 'var(--color-accent)', padding: '0.5rem', background: 'var(--color-accent-light)', borderRadius: '50%' }}><Phone size={24} /></div>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Teléfono</h4>
                    <p style={{ color: 'var(--color-text-secondary)' }}>(+56) 9 58251226</p>
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
                    <p style={{ color: 'var(--color-text-secondary)' }}>Lunes a Viernes: 9:00 AM - 19:00 PM<br/>Sábado: 10:00 AM - 14:00 PM<br/>Domingo: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa Card */}
            <div className="card glass" style={{ padding: '1rem', height: '350px', overflow: 'hidden' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.4116499692415!2d-72.593798!3d-38.7369344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9614d3c3337a4453%3A0xc6657c91ba2d6c6e!2sAv.%20Caupolic%C3%A1n%20579%2C%20Temuco%2C%20Araucan%C3%ADa!5e0!3m2!1ses-419!2scl!4v1700000000000!5m2!1ses-419!2scl" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '0.5rem' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Automotora HMC"
              ></iframe>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="card glass" style={{ padding: '3rem' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Envíanos un mensaje</h3>
            {status && (
              <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}` }}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-row">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nombre Completo</label>
                  <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="input" placeholder="Tu nombre" />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Teléfono</label>
                  <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className="input" placeholder="+56 9 0000 0000" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="tu@email.com" />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Mensaje</label>
                <textarea required name="mensaje" value={formData.mensaje} onChange={handleChange} className="input" rows="5" placeholder="¿En qué te podemos ayudar?"></textarea>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                {loading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
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
          gap: 4rem;
          align-items: start;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
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
          .card {
            padding: 1.5rem !important;
          }
          h1 {
            fontSize: 2.5rem !important;
          }
        }
      `}</style>
    </main>
  );
}
