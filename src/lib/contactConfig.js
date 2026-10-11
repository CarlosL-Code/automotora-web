/**
 * Configuración centralizada de contactos para HM&C Motors.
 * Separa el teléfono corporativo oficial de la automotora del canal de WhatsApp de consultas web.
 */

// Teléfono oficial corporativo de HM&C Motors (fijo en Temuco / línea principal de la empresa)
export const CORPORATE_PHONE = {
  raw: '56958251226',
  e164: '+56958251226',
  display: '(+56) 9 58251226',
};

// Configuración comercial de WhatsApp para Consultas Web
export const WEB_SALES_CONFIG = {
  // Número comercial de atención web (lee variable de entorno o usa el número operativo actual por defecto)
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '56958251226',
  advisorRole: 'Asesor de Consultas Web — HM&C Motors',
  email: 'contacto@hmcautomotora.cl',
  address: 'Avenida Caupolicán 579, Temuco',

  /**
   * Obtiene el número limpio en formato de solo dígitos para enlaces tel o wa.me
   */
  getCleanNumber() {
    return (this.whatsappNumber || '').replace(/\D/g, '');
  },

  /**
   * Formatea dinámicamente el número configurado para visualización legible (ej: (+56) 9 5825 1226 o (+56) 9 58251226)
   */
  getDisplayPhone() {
    const clean = this.getCleanNumber();
    if (clean.startsWith('569') && clean.length === 11) {
      return `(+56) 9 ${clean.slice(3)}`;
    }
    if (clean.startsWith('56') && clean.length >= 10) {
      return `(+56) ${clean.slice(2)}`;
    }
    return clean ? `+${clean}` : CORPORATE_PHONE.display;
  },

  /**
   * Genera enlaces válidos de WhatsApp con o sin mensaje precargado, manejando caracteres especiales correctamente
   */
  getWhatsAppUrl(message = '') {
    const clean = this.getCleanNumber();
    if (!message || typeof message !== 'string') {
      return `https://wa.me/${clean}`;
    }
    return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
  }
};
