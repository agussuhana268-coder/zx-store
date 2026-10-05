/**
 * API Client for mdzz-store-api Cloudflare Worker
 * Handles Customer Order API interactions with the live backend.
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'https://mdzz-store-api.agussuhana268.workers.dev';

/**
 * Create a new customer order on the Cloudflare Worker backend (D1 Database)
 *
 * @param {Object} params
 * @param {Object|string} params.product - Product object or name
 * @param {string} params.total - Total payment formatted string (e.g. 'Rp 75.000')
 * @param {string} [params.customerName] - Customer full name
 * @param {string} [params.customerContact] - Customer WhatsApp/phone number
 * @param {string} [params.paymentMethod] - Payment method ('QRIS_DANA')
 * @returns {Promise<Object>} Created order object returned by backend
 */
export async function createOrder({
  product,
  total,
  customerName = '',
  customerContact = '',
  paymentMethod = 'QRIS_DANA',
}) {
  const payload = {
    product,
    total,
    customer_name: customerName,
    customer_contact: customerContact,
    payment_method: paymentMethod,
  };

  const response = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Gagal membuat pesanan (Status ${response.status}).`);
  }

  return data.order || data.data;
}

/**
 * Retrieve current order details from the Cloudflare Worker backend
 *
 * @param {string} orderId - Standard Order ID (e.g. 'ZX-261005-4819')
 * @returns {Promise<Object>} Order object returned by backend
 */
export async function getOrder(orderId) {
  if (!orderId) {
    throw new Error('Order ID wajib disertakan.');
  }

  const response = await fetch(`${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error || `Pesanan tidak ditemukan (Status ${response.status}).`);
  }

  return data.order || data.data;
}

/**
 * Report order as paid by customer (transition PENDING_PAYMENT -> WAITING_VERIFICATION)
 *
 * @param {string} orderId - Standard Order ID
 * @returns {Promise<Object>} Updated order object returned by backend
 */
export async function markOrderPaid(orderId) {
  if (!orderId) {
    throw new Error('Order ID wajib disertakan.');
  }

  const response = await fetch(
    `${API_BASE_URL}/api/orders/${encodeURIComponent(orderId)}/paid`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(
      data.error || `Gagal memverifikasi pembayaran (Status ${response.status}).`
    );
  }

  return data.order || data.data;
}
