/**
 * Utility functions for Order & QRIS Payment processing
 */

export const ADMIN_WHATSAPP_NUMBER = '6287833947151';

/**
 * Standard Order Statuses
 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  WAITING_VERIFICATION: 'WAITING_VERIFICATION',
  SUCCESS: 'SUCCESS',
  CANCELLED: 'CANCELLED',
};


/**
 * Validates whether a status transition is permitted based on user role
 * 
 * Rules:
 * - CUSTOMER: PENDING_PAYMENT -> WAITING_VERIFICATION
 * - ADMIN:    WAITING_VERIFICATION -> SUCCESS
 *             WAITING_VERIFICATION -> CANCELLED
 * - Other transitions are rejected.
 */
export function canTransitionStatus(currentStatus, targetStatus, role) {
  if (!role || !currentStatus || !targetStatus) {
    return false;
  }

  const normalizedRole = String(role).trim().toUpperCase();

  if (normalizedRole === 'CUSTOMER') {
    return (
      currentStatus === ORDER_STATUS.PENDING_PAYMENT &&
      targetStatus === ORDER_STATUS.WAITING_VERIFICATION
    );
  }

  if (normalizedRole === 'ADMIN') {
    return (
      currentStatus === ORDER_STATUS.WAITING_VERIFICATION &&
      (targetStatus === ORDER_STATUS.SUCCESS || targetStatus === ORDER_STATUS.CANCELLED)
    );
  }

  return false;
}

/**
 * Helper to update order status while updating the `updatedAt` timestamp
 * Throws an Error if transition is not permitted
 */
export function updateOrderStatus(order, targetStatus, role) {
  if (!order || typeof order !== 'object') {
    throw new Error('Objek order tidak valid.');
  }

  if (!canTransitionStatus(order.status, targetStatus, role)) {
    throw new Error(
      `Transisi status dari '${order.status}' ke '${targetStatus}' tidak diizinkan untuk role '${role}'.`
    );
  }

  return {
    ...order,
    status: targetStatus,
    updatedAt: new Date().toISOString(),
  };
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
