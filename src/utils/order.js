/**
 * Utility functions for Order & QRIS Payment processing
 */

export const ADMIN_WHATSAPP_NUMBER = '6287833947151';

/**
 * Generates a unique, readable Order ID
 * Format: ZX-YYMMDD-XXXX (e.g. ZX-261005-4819)
 */
export function generateOrderId() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateSegment = `${year}${month}${day}`;
  const randomSegment = Math.floor(1000 + Math.random() * 9000);
  return `ZX-${dateSegment}-${randomSegment}`;
}

/**
 * Builds the automated WhatsApp confirmation message for QRIS payments
 */
export function buildQrisConfirmationMessage({
  orderId,
  productName,
  totalPrice,
  customerName = '',
  customerContact = '',
}) {
  const lines = [
    'Halo Admin Zet Xiters, saya ingin konfirmasi pembayaran via QRIS DANA:',
    '',
    `📋 *Order ID:* ${orderId}`,
    `📦 *Nama Produk:* ${productName}`,
    `💰 *Total Pembayaran:* ${totalPrice}`,
    `📌 *Status Pembayaran:* Menunggu verifikasi`,
    ...(customerName ? [`👤 *Nama Pemesan:* ${customerName}`] : []),
    ...(customerContact ? [`📞 *Nomor WhatsApp:* ${customerContact}`] : []),
    '',
    'Saya sudah melakukan pembayaran melalui QRIS DANA dan melampirkan konfirmasi ini.',
    'Mohon bantuannya untuk verifikasi pembayaran dan pengiriman lisensi/file.',
    '',
    'Terima kasih.'
  ];

  return lines.join('\n');
}

/**
 * Builds WhatsApp chat URL with message
 */
export function getWhatsAppUrl(phone, message) {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
