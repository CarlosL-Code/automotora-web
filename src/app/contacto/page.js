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
                    <p style={{ color: 'var(--color-text-secondary)' }}>Avenida Caupolican 579, Temuco</p>
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
          </div>

          {/* Form */}
          <div className="card glass" style={{ padding: '3rem' }}>
            <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Envíanos un mensaje</h3>
            {status && (
              <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}` }}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {loading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
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
