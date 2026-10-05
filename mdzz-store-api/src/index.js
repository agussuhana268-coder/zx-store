/**
 * Cloudflare Worker Backend for mdzz-store-api
 * Connected to Cloudflare D1 Database binding 'DB' (mdzz-store-db)
 */

const ALLOWED_ORIGIN = 'https://mdzzofficialstore.biz.id';

const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  WAITING_VERIFICATION: 'WAITING_VERIFICATION',
  SUCCESS: 'SUCCESS',
  CANCELLED: 'CANCELLED',
};

/**
 * Generate standard Order ID (format: ZX-YYMMDD-XXXX)
 */
function generateOrderId() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const randomSegment = Math.floor(1000 + Math.random() * 9000);
  return `ZX-${yy}${mm}${dd}-${randomSegment}`;
}

/**
 * Helper to construct CORS headers
 */
function getCorsHeaders(request) {
  const origin = request.headers.get('Origin');
  let allowOrigin = ALLOWED_ORIGIN;

  // Allow production domain and local development origins
  if (
    origin &&
    (origin === ALLOWED_ORIGIN ||
      origin.endsWith('.mdzzofficialstore.biz.id') ||
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:'))
  ) {
    allowOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Helper to return consistent JSON responses
 */
function jsonResponse(data, status = 200, request = null) {
  const corsHeaders = request ? getCorsHeaders(request) : {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
    },
  });
}

/**
 * Format order row from D1 database
 */
function formatOrder(row) {
  if (!row) return null;

  let parsedProduct = row.product;
  if (typeof row.product === 'string') {
    try {
      parsedProduct = JSON.parse(row.product);
    } catch {
      parsedProduct = row.product;
    }
  }

  return {
    order_id: row.order_id,
    orderId: row.order_id,
    product: parsedProduct,
    total: row.total,
    status: row.status,
    customer_name: row.customer_name || '',
    customerName: row.customer_name || '',
    customer_contact: row.customer_contact || '',
    customerContact: row.customer_contact || '',
    payment_method: row.payment_method || '',
    paymentMethod: row.payment_method || '',
    created_at: row.created_at,
    createdAt: row.created_at,
    updated_at: row.updated_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Customer Orders API Handler
 */
export default {
  async fetch(request, env, _ctx) {
    // 1. Handle CORS Preflight (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    try {
      // 2. Health check endpoint
      if (method === 'GET' && (pathname === '/' || pathname === '/api/health')) {
        return jsonResponse(
          {
            success: true,
            service: 'mdzz-store-api',
            status: 'online',
            timestamp: new Date().toISOString(),
          },
          200,
          request
        );
      }

      // 3. POST /api/orders -> Create new order
      if (method === 'POST' && pathname === '/api/orders') {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse(
            { success: false, error: 'Invalid JSON request body.' },
            400,
            request
          );
        }

        const product = body.product;
        const total = body.total ?? body.totalPrice;
        const customerName = (body.customer_name ?? body.customerName ?? '').trim();
        const customerContact = (body.customer_contact ?? body.customerContact ?? '').trim();
        const paymentMethod = body.payment_method ?? body.paymentMethod ?? 'QRIS_DANA';

        if (!product) {
          return jsonResponse(
            { success: false, error: 'Field "product" is required.' },
            400,
            request
          );
        }

        if (total === undefined || total === null || total === '') {
          return jsonResponse(
            { success: false, error: 'Field "total" is required.' },
            400,
            request
          );
        }

        if (!env.DB) {
          return jsonResponse(
            { success: false, error: 'Database binding "DB" is not configured.' },
            500,
            request
          );
        }

        const orderId = body.order_id || body.orderId || generateOrderId();
        const productStr = typeof product === 'object' ? JSON.stringify(product) : String(product);
        const totalStr = String(total);
        const now = new Date().toISOString();
        const initialStatus = ORDER_STATUS.PENDING_PAYMENT;

        await env.DB.prepare(
          `INSERT INTO orders (
            order_id, product, total, status,
            customer_name, customer_contact, payment_method,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(
            orderId,
            productStr,
            totalStr,
            initialStatus,
            customerName,
            customerContact,
            paymentMethod,
            now,
            now
          )
          .run();

        const createdOrder = {
          order_id: orderId,
          orderId,
          product,
          total: totalStr,
          status: initialStatus,
          customer_name: customerName,
          customerName,
          customer_contact: customerContact,
          customerContact,
          payment_method: paymentMethod,
          paymentMethod,
          created_at: now,
          createdAt: now,
          updated_at: now,
          updatedAt: now,
        };

        return jsonResponse(
          {
            success: true,
            order: createdOrder,
            data: createdOrder,
          },
          201,
          request
        );
      }

      // 4. POST /api/orders/:orderId/paid -> Mark order as waiting verification
      const paidMatch = pathname.match(/^\/api\/orders\/([^/]+)\/paid\/?$/);
      if (method === 'POST' && paidMatch) {
        const orderId = decodeURIComponent(paidMatch[1]);

        if (!env.DB) {
          return jsonResponse(
            { success: false, error: 'Database binding "DB" is not configured.' },
            500,
            request
          );
        }

        const existing = await env.DB.prepare(
          'SELECT * FROM orders WHERE order_id = ?'
        )
          .bind(orderId)
          .first();

        if (!existing) {
          return jsonResponse(
            { success: false, error: `Order with ID "${orderId}" not found.` },
            404,
            request
          );
        }

        // Only allow transition from PENDING_PAYMENT to WAITING_VERIFICATION
        if (existing.status !== ORDER_STATUS.PENDING_PAYMENT) {
          return jsonResponse(
            {
              success: false,
              error: `Invalid status transition: order status "${existing.status}" cannot be changed to "${ORDER_STATUS.WAITING_VERIFICATION}".`,
              current_status: existing.status,
            },
            400,
            request
          );
        }

        const updatedAt = new Date().toISOString();
        const targetStatus = ORDER_STATUS.WAITING_VERIFICATION;

        await env.DB.prepare(
          'UPDATE orders SET status = ?, updated_at = ? WHERE order_id = ?'
        )
          .bind(targetStatus, updatedAt, orderId)
          .run();

        const updatedRow = {
          ...existing,
          status: targetStatus,
          updated_at: updatedAt,
        };

        const formattedOrder = formatOrder(updatedRow);

        return jsonResponse(
          {
            success: true,
            order: formattedOrder,
            data: formattedOrder,
          },
          200,
          request
        );
      }

      // 5. GET /api/orders/:orderId -> Get single order
      const getMatch = pathname.match(/^\/api\/orders\/([^/]+)\/?$/);
      if (method === 'GET' && getMatch) {
        const orderId = decodeURIComponent(getMatch[1]);

        if (!env.DB) {
          return jsonResponse(
            { success: false, error: 'Database binding "DB" is not configured.' },
            500,
            request
          );
        }

        const existing = await env.DB.prepare(
          'SELECT * FROM orders WHERE order_id = ?'
        )
          .bind(orderId)
          .first();

        if (!existing) {
          return jsonResponse(
            { success: false, error: `Order with ID "${orderId}" not found.` },
            404,
            request
          );
        }

        const formattedOrder = formatOrder(existing);

        return jsonResponse(
          {
            success: true,
            order: formattedOrder,
            data: formattedOrder,
          },
          200,
          request
        );
      }

      // 6. 404 Route Not Found
      return jsonResponse(
        {
          success: false,
          error: `Endpoint "${method} ${pathname}" not found.`,
        },
        404,
        request
      );
    } catch (err) {
      console.error('API Error:', err);
      return jsonResponse(
        {
          success: false,
          error: err.message || 'Internal Server Error',
        },
        500,
        request
      );
    }
  },
};
