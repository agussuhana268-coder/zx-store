/**
 * Cloudflare Worker Backend for mdzz-store-api
 * Connected to Cloudflare D1 Database binding 'DB' (mdzz-store-db)
 */

const ALLOWED_ORIGIN = 'https://mdzzofficialstore.biz.id';
const GITHUB_PAGES_ORIGIN = 'https://agussuhana268-coder.github.io';

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

  // Allow production domain, GitHub Pages admin, and local development origins
  if (
    origin &&
    (origin === ALLOWED_ORIGIN ||
      origin === GITHUB_PAGES_ORIGIN ||
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
 * Timing-safe string comparison to protect against timing attacks
 */
function timingSafeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Helper to encode Uint8Array buffer to Base64URL string (RFC 4648)
 */
function base64UrlEncode(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Helper to decode Base64URL string to Uint8Array
 */
function base64UrlDecode(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Sign session token payload using HMAC-SHA256 and Web Crypto API
 */
async function signSessionToken(payload, secret) {
  const encoder = new TextEncoder();
  const payloadStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(encoder.encode(payloadStr));

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(encodedPayload)
  );

  const encodedSig = base64UrlEncode(signatureBuffer);
  return `${encodedPayload}.${encodedSig}`;
}

/**
 * Verify HMAC-SHA256 session token signature, structure, and expiry
 */
async function verifySessionToken(token, secret) {
  if (typeof token !== 'string' || !token.includes('.')) {
    return { ok: false, error: 'Invalid token format.' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { ok: false, error: 'Invalid token format.' };
  }

  const [encodedPayload, encodedSig] = parts;

  let key;
  try {
    const encoder = new TextEncoder();
    key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlDecode(encodedSig);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(encodedPayload)
    );

    if (!isValid) {
      return { ok: false, error: 'Invalid token signature.' };
    }
  } catch {
    return { ok: false, error: 'Cryptographic signature verification failed.' };
  }

  try {
    const decoder = new TextDecoder();
    const payloadJson = decoder.decode(base64UrlDecode(encodedPayload));
    const payload = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || typeof payload.exp !== 'number' || payload.exp < now) {
      return { ok: false, error: 'Session token has expired.' };
    }

    if (payload.role !== 'admin') {
      return { ok: false, error: 'Invalid session role.' };
    }

    return { ok: true, payload };
  } catch {
    return { ok: false, error: 'Malformed session payload.' };
  }
}

/**
 * Helper to verify Admin authentication
 * Supports two modes:
 * Mode A: Bearer ADMIN_API_KEY (Master key for CLI / automated backend)
 * Mode B: Bearer SESSION_TOKEN (HMAC-SHA256 signed session token for web dashboard)
 */
async function verifyAdminAuth(request, env) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader) {
    return {
      ok: false,
      status: 401,
      error: 'Unauthorized: Missing Authorization header.',
    };
  }

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return {
      ok: false,
      status: 401,
      error: 'Unauthorized: Invalid Authorization format. Expected "Bearer <TOKEN>".',
    };
  }

  const providedToken = match[1].trim();

  // Mode A: Master ADMIN_API_KEY verification
  const adminApiKey = env && env.ADMIN_API_KEY;
  if (adminApiKey && typeof adminApiKey === 'string' && adminApiKey.trim() !== '') {
    if (timingSafeCompare(providedToken, adminApiKey.trim())) {
      return { ok: true, mode: 'api_key' };
    }
  }

  // Mode B: Ephemeral Session Token verification
  const signingSecret = env && (env.SESSION_SECRET || env.ADMIN_PASSWORD);
  if (signingSecret && typeof signingSecret === 'string' && signingSecret.trim() !== '') {
    const sessionRes = await verifySessionToken(providedToken, signingSecret.trim());
    if (sessionRes.ok) {
      return { ok: true, mode: 'session_token', payload: sessionRes.payload };
    }
  }

  // Generic 401 response without leaking internal configuration state
  return {
    ok: false,
    status: 401,
    error: 'Unauthorized: Invalid credentials.',
  };
}

/**
 * Customer & Admin Orders API Handler
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

      // 3. Admin Authentication Guard for all /api/admin/* endpoints EXCEPT /api/admin/login
      if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
        const auth = await verifyAdminAuth(request, env);
        if (!auth.ok) {
          return jsonResponse(
            {
              success: false,
              error: auth.error,
            },
            auth.status,
            request
          );
        }
      }

      // 4. Admin API Endpoints
      // 4.0. POST /api/admin/login -> Authenticate admin and return ephemeral HMAC session token
      if (method === 'POST' && pathname === '/api/admin/login') {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse(
            { success: false, error: 'Unauthorized: Invalid credentials.' },
            401,
            request
          );
        }

        const providedPassword = (body && typeof body.password === 'string') ? body.password.trim() : '';
        const adminPassword = (env && typeof env.ADMIN_PASSWORD === 'string') ? env.ADMIN_PASSWORD.trim() : '';

        // JANGAN gunakan ADMIN_API_KEY sebagai password dashboard.
        // Validasi HANYA terhadap ADMIN_PASSWORD.
        if (
          !adminPassword ||
          !providedPassword ||
          !timingSafeCompare(providedPassword, adminPassword)
        ) {
          return jsonResponse(
            { success: false, error: 'Unauthorized: Invalid credentials.' },
            401,
            request
          );
        }

        const expiresIn = 14400; // 4 hours in seconds
        const now = Math.floor(Date.now() / 1000);
        const payload = {
          role: 'admin',
          iat: now,
          exp: now + expiresIn,
          jti: (typeof crypto.randomUUID === 'function') ? crypto.randomUUID() : Math.random().toString(36).slice(2),
        };

        const signingSecret = (env && env.SESSION_SECRET) || adminPassword;
        const sessionToken = await signSessionToken(payload, signingSecret);

        return jsonResponse(
          {
            success: true,
            token: sessionToken,
            expiresIn,
          },
          200,
          request
        );
      }

      // 4.1. GET /api/admin/orders -> List orders (supports optional ?status= filter)
      if (method === 'GET' && pathname === '/api/admin/orders') {
        if (!env.DB) {
          return jsonResponse(
            { success: false, error: 'Database binding "DB" is not configured.' },
            500,
            request
          );
        }

        const statusFilter = url.searchParams.get('status');
        let results;

        if (statusFilter) {
          const stmt = env.DB.prepare(
            'SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC'
          ).bind(statusFilter.toUpperCase());
          const res = await stmt.all();
          results = res.results || [];
        } else {
          const stmt = env.DB.prepare(
            'SELECT * FROM orders ORDER BY created_at DESC'
          );
          const res = typeof stmt.all === 'function' ? await stmt.all() : await stmt.bind().all();
          results = res.results || [];
        }

        const orders = results.map(formatOrder);

        return jsonResponse(
          {
            success: true,
            count: orders.length,
            total: orders.length,
            orders,
            data: orders,
          },
          200,
          request
        );
      }

      // 4.2. POST /api/admin/orders/:orderId/complete -> Complete order (WAITING_VERIFICATION -> SUCCESS)
      const adminCompleteMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/complete\/?$/);
      if (method === 'POST' && adminCompleteMatch) {
        const orderId = decodeURIComponent(adminCompleteMatch[1]);

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

        // Only allow transition from WAITING_VERIFICATION to SUCCESS
        if (existing.status !== ORDER_STATUS.WAITING_VERIFICATION) {
          return jsonResponse(
            {
              success: false,
              error: `Invalid status transition: order status "${existing.status}" cannot be changed to "${ORDER_STATUS.SUCCESS}". Only orders with status "${ORDER_STATUS.WAITING_VERIFICATION}" can be completed.`,
              current_status: existing.status,
            },
            400,
            request
          );
        }

        const updatedAt = new Date().toISOString();
        const targetStatus = ORDER_STATUS.SUCCESS;

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
            message: 'Order completed successfully.',
            order: formattedOrder,
            data: formattedOrder,
          },
          200,
          request
        );
      }

      // 4.3. POST /api/admin/orders/:orderId/cancel -> Cancel order (WAITING_VERIFICATION -> CANCELLED)
      const adminCancelMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)\/cancel\/?$/);
      if (method === 'POST' && adminCancelMatch) {
        const orderId = decodeURIComponent(adminCancelMatch[1]);

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

        // Status rule: WAITING_VERIFICATION -> CANCELLED only. Do NOT allow cancel from PENDING_PAYMENT for now.
        if (existing.status !== ORDER_STATUS.WAITING_VERIFICATION) {
          return jsonResponse(
            {
              success: false,
              error: `Invalid status transition: order status "${existing.status}" cannot be changed to "${ORDER_STATUS.CANCELLED}". Only orders with status "${ORDER_STATUS.WAITING_VERIFICATION}" can be cancelled.`,
              current_status: existing.status,
            },
            400,
            request
          );
        }

        const updatedAt = new Date().toISOString();
        const targetStatus = ORDER_STATUS.CANCELLED;

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
            message: 'Order cancelled successfully.',
            order: formattedOrder,
            data: formattedOrder,
          },
          200,
          request
        );
      }

      // 5. POST /api/orders -> Create new order
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
