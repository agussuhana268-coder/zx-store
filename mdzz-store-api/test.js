/**
 * Automated test suite for mdzz-store-api worker
 */
import worker from './src/index.js';

class MockD1Database {
  constructor() {
    this.orders = new Map();
  }

  prepare(query) {
    const db = this;
    function createExecutor(params = []) {
      return {
        async run() {
          if (query.trim().startsWith('INSERT INTO orders')) {
            const [
              order_id, product, total, status,
              customer_name, customer_contact, payment_method,
              created_at, updated_at
            ] = params;
            db.orders.set(order_id, {
              order_id, product, total, status,
              customer_name, customer_contact, payment_method,
              created_at, updated_at
            });
            return { success: true };
          }

          if (query.trim().startsWith('UPDATE orders')) {
            const [status, updated_at, order_id] = params;
            const row = db.orders.get(order_id);
            if (row) {
              row.status = status;
              row.updated_at = updated_at;
            }
            return { success: true };
          }

          return { success: true };
        },
        async first() {
          if (query.includes('SELECT * FROM orders WHERE order_id = ?')) {
            const [order_id] = params;
            return db.orders.get(order_id) || null;
          }
          return null;
        },
        async all() {
          let rows = Array.from(db.orders.values());
          if (query.includes('WHERE status = ?')) {
            const [status] = params;
            rows = rows.filter(r => r.status === status);
          }
          rows.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          return { results: rows, success: true };
        }
      };
    }

    return {
      bind(...params) {
        return createExecutor(params);
      },
      ...createExecutor([])
    };
  }
}

async function runTests() {
  console.log('--- Starting mdzz-store-api unit tests ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✓ ${message}`);
      passed++;
    } else {
      console.error(`✗ FAILED: ${message}`);
      failed++;
    }
  }

  const ADMIN_SECRET = 'super-secret-admin-token-12345';
  const ADMIN_PASSWORD = 'super-secret-dashboard-password-98765';
  const env = {
    DB: new MockD1Database(),
    ADMIN_API_KEY: ADMIN_SECRET,
    ADMIN_PASSWORD: ADMIN_PASSWORD,
  };

  async function createCustomSessionToken(payload, secret) {
    const encoder = new TextEncoder();
    const payloadStr = JSON.stringify(payload);
    let binary = '';
    const bytes = encoder.encode(payloadStr);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const encodedPayload = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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
    const sigBytes = new Uint8Array(signatureBuffer);
    let sigBinary = '';
    for (let i = 0; i < sigBytes.byteLength; i++) {
      sigBinary += String.fromCharCode(sigBytes[i]);
    }
    const encodedSig = btoa(sigBinary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${encodedPayload}.${encodedSig}`;
  }

  // Test 1: OPTIONS request (CORS Preflight)
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://mdzzofficialstore.biz.id',
        'Access-Control-Request-Method': 'POST'
      }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 204, 'OPTIONS returns 204 No Content');
    assert(
      res.headers.get('Access-Control-Allow-Origin') === 'https://mdzzofficialstore.biz.id',
      'OPTIONS has correct Access-Control-Allow-Origin'
    );
  }

  // Test 2: Health check
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/health', {
      method: 'GET'
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Health check returns 200');
    const json = await res.json();
    assert(json.status === 'online', 'Health check json has status online');
  }

  // Test 3: POST /api/orders validation failure
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 400, 'POST /api/orders without body returns 400');
  }

  // Test 4: POST /api/orders success
  let createdOrderId;
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://mdzzofficialstore.biz.id'
      },
      body: JSON.stringify({
        product: { name: 'ZX Extreme V7', license: 'Lifetime' },
        total: 'Rp 75.000',
        customer_name: 'John Doe',
        customer_contact: '08123456789',
        payment_method: 'QRIS_DANA'
      })
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 201, 'POST /api/orders returns 201 Created');
    const json = await res.json();
    assert(json.success === true, 'Response success is true');
    assert(json.order.status === 'PENDING_PAYMENT', 'Initial status is PENDING_PAYMENT');
    assert(json.order.order_id.startsWith('ZX-'), 'Order ID generated with ZX- prefix');
    assert(json.order.customer_name === 'John Doe', 'Customer name is saved correctly');
    createdOrderId = json.order.order_id;
  }

  // Test 5: GET /api/orders/:orderId found
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${createdOrderId}`, {
      method: 'GET',
      headers: { Origin: 'https://mdzzofficialstore.biz.id' }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'GET /api/orders/:orderId returns 200');
    const json = await res.json();
    assert(json.order.order_id === createdOrderId, 'GET returns matching order_id');
    assert(json.order.status === 'PENDING_PAYMENT', 'GET returns PENDING_PAYMENT status');
  }

  // Test 6: GET /api/orders/:orderId not found
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders/ZX-NONEXISTENT', {
      method: 'GET'
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 404, 'GET nonexistent order returns 404');
    const json = await res.json();
    assert(json.success === false, 'Error response has success: false');
  }

  // Test 7: POST /api/orders/:orderId/paid success transition
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${createdOrderId}/paid`, {
      method: 'POST',
      headers: { Origin: 'https://mdzzofficialstore.biz.id' }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'POST /api/orders/:orderId/paid returns 200');
    const json = await res.json();
    assert(json.success === true, 'Response has success: true');
    assert(json.order.status === 'WAITING_VERIFICATION', 'Status is updated to WAITING_VERIFICATION');
  }

  // Test 8: POST /api/orders/:orderId/paid reject invalid transition (already WAITING_VERIFICATION)
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${createdOrderId}/paid`, {
      method: 'POST',
      headers: { Origin: 'https://mdzzofficialstore.biz.id' }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 400, 'Reject transition when already WAITING_VERIFICATION returns 400');
    const json = await res.json();
    assert(json.success === false, 'Response has success: false');
  }

  // Test 9: POST /api/orders/:orderId/paid for nonexistent order returns 404
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders/ZX-NOTFOUND/paid', {
      method: 'POST'
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 404, 'POST paid for nonexistent order returns 404');
  }

  // -------------------------------------------------------------
  // ADMIN API TESTS
  // -------------------------------------------------------------

  // Test 10: Admin endpoint missing Authorization header returns 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET'
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Admin GET /orders without auth header returns 401');
    const json = await res.json();
    assert(json.success === false, '401 response has success: false');
  }

  // Test 11: Admin endpoint with malformed Authorization header returns 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: 'Basic somebase64credentials' }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Admin request with non-Bearer auth returns 401');
  }

  // Test 12: Admin endpoint with invalid Bearer token returns 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: 'Bearer wrong-secret-token' }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Admin request with wrong token returns 401');
    const json = await res.json();
    assert(json.error === 'Unauthorized: Invalid credentials.', 'Error message indicates invalid credentials');
  }

  // Test 13: Admin endpoint when ADMIN_API_KEY secret is not configured in env returns 401
  {
    const envNoSecret = { DB: env.DB };
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, envNoSecret);
    assert(res.status === 401, 'Admin request with unconfigured ADMIN_API_KEY returns 401');
  }

  // Test 14: OPTIONS CORS preflight on admin endpoint succeeds without auth
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://mdzzofficialstore.biz.id',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Authorization'
      }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 204, 'Admin OPTIONS preflight returns 204');
    assert(
      res.headers.get('Access-Control-Allow-Headers').includes('Authorization'),
      'CORS headers allow Authorization header'
    );
  }

  // Test 15: GET /api/admin/orders with valid credentials returns 200 and list
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${ADMIN_SECRET}`,
        Origin: 'https://mdzzofficialstore.biz.id'
      }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Admin GET /orders returns 200');
    const json = await res.json();
    assert(json.success === true, 'Admin GET /orders success is true');
    assert(Array.isArray(json.orders), 'Admin GET /orders returns array of orders');
    assert(json.count >= 1, 'Admin GET /orders count is at least 1');
    assert(json.orders[0].order_id === createdOrderId, 'Admin GET /orders contains created order');
  }

  // Test 16: GET /api/admin/orders?status=WAITING_VERIFICATION filters correctly
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders?status=WAITING_VERIFICATION', {
      method: 'GET',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'GET /admin/orders with status filter returns 200');
    const json = await res.json();
    assert(json.orders.every(o => o.status === 'WAITING_VERIFICATION'), 'All returned orders match status WAITING_VERIFICATION');
  }

  // Create a second order in PENDING_PAYMENT state to test invalid transitions
  let secondOrderId;
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: 'Varian 2',
        total: 'Rp 100.000',
        customer_name: 'Jane Doe',
        customer_contact: '08987654321',
        payment_method: 'QRIS_DANA'
      })
    });
    const res = await worker.fetch(req, env);
    const json = await res.json();
    secondOrderId = json.order.order_id;
  }

  // Test 17: Admin POST /complete on PENDING_PAYMENT order rejected (400)
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${secondOrderId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 400, 'Admin complete on PENDING_PAYMENT rejected with 400');
    const json = await res.json();
    assert(json.success === false, 'Complete on PENDING_PAYMENT has success: false');
  }

  // Test 18: Admin POST /cancel on PENDING_PAYMENT order rejected (400)
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${secondOrderId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 400, 'Admin cancel on PENDING_PAYMENT rejected with 400');
    const json = await res.json();
    assert(json.success === false, 'Cancel on PENDING_PAYMENT has success: false');
  }

  // Test 19: Admin POST /complete on WAITING_VERIFICATION order succeeds (200) -> SUCCESS
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${createdOrderId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_SECRET}`,
        Origin: 'https://mdzzofficialstore.biz.id'
      }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Admin complete on WAITING_VERIFICATION returns 200');
    const json = await res.json();
    assert(json.success === true, 'Complete order response has success: true');
    assert(json.order.status === 'SUCCESS', 'Order status is now SUCCESS');
  }

  // Test 20: Admin POST /complete on already SUCCESS order rejected (400)
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${createdOrderId}/complete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 400, 'Admin complete on already SUCCESS order rejected with 400');
  }

  // Transition second order to WAITING_VERIFICATION
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${secondOrderId}/paid`, {
      method: 'POST'
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Second order transitioned to WAITING_VERIFICATION');
  }

  // Test 21: Admin POST /cancel on WAITING_VERIFICATION order succeeds (200) -> CANCELLED
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${secondOrderId}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ADMIN_SECRET}`,
        Origin: 'https://mdzzofficialstore.biz.id'
      }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Admin cancel on WAITING_VERIFICATION returns 200');
    const json = await res.json();
    assert(json.success === true, 'Cancel order response has success: true');
    assert(json.order.status === 'CANCELLED', 'Order status is now CANCELLED');
  }

  // Test 22: Admin POST /cancel on already CANCELLED order rejected (400)
  {
    const req = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${secondOrderId}/cancel`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 400, 'Admin cancel on already CANCELLED order rejected with 400');
  }

  // Test 23: Admin POST /complete on nonexistent order returns 404
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders/ZX-NONEXISTENT/complete', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 404, 'Admin complete on nonexistent order returns 404');
  }

  // Test 24: Admin POST /cancel on nonexistent order returns 404
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders/ZX-NONEXISTENT/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 404, 'Admin cancel on nonexistent order returns 404');
  }

  // Test 25: Admin unknown route with valid credentials returns 404
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/unknown-endpoint', {
      method: 'GET',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` }
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 404, 'Admin unknown endpoint returns 404');
  }

  // Test 26: CORS GitHub Pages origin handling
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://agussuhana268-coder.github.io',
        'Access-Control-Request-Method': 'POST',
      },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 204, 'GitHub Pages OPTIONS preflight returns 204');
    assert(
      res.headers.get('Access-Control-Allow-Origin') === 'https://agussuhana268-coder.github.io',
      'CORS allows GitHub Pages origin'
    );
    assert(
      res.headers.get('Access-Control-Allow-Headers').includes('Authorization'),
      'CORS allows Authorization header for GitHub Pages'
    );
    assert(
      res.headers.get('Access-Control-Allow-Headers').includes('Content-Type'),
      'CORS allows Content-Type header for GitHub Pages'
    );
  }

  // Test 27: CORS Customer website origin handling
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://mdzzofficialstore.biz.id',
        'Access-Control-Request-Method': 'GET',
      },
    });
    const res = await worker.fetch(req, env);
    assert(
      res.headers.get('Access-Control-Allow-Origin') === 'https://mdzzofficialstore.biz.id',
      'CORS continues to allow customer website origin'
    );
  }

  // Test 28: OPTIONS preflight on /api/admin/login from GitHub Pages
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://agussuhana268-coder.github.io',
        'Access-Control-Request-Method': 'POST',
      },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 204, 'OPTIONS preflight on /api/admin/login returns 204');
  }

  // Test 29: Admin Login Invalid (Wrong password) returns 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://agussuhana268-coder.github.io',
      },
      body: JSON.stringify({ password: 'wrong-admin-password' }),
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Login with wrong password returns 401');
    const json = await res.json();
    assert(json.success === false, 'Invalid login response success is false');
    assert(json.error === 'Unauthorized: Invalid credentials.', 'Invalid login returns generic error');
  }

  // Test 30: Admin Login Invalid (Empty / missing password) returns 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: '' }),
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Login with empty password returns 401');
  }

  // Test 31: Admin Login Invalid (Malformed JSON body) returns 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-non-json-body',
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Login with malformed body returns 401');
  }

  // Test 32: Admin Login Invalid (Unconfigured ADMIN_PASSWORD) returns 401 without leakage
  {
    const envNoPass = { DB: env.DB, ADMIN_API_KEY: ADMIN_SECRET };
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    const res = await worker.fetch(req, envNoPass);
    assert(res.status === 401, 'Login when ADMIN_PASSWORD is not configured returns 401');
    const json = await res.json();
    assert(json.error === 'Unauthorized: Invalid credentials.', 'Unconfigured password returns generic error');
  }

  // Test 33: Admin Login Invalid: attempting to use ADMIN_API_KEY as password rejected with 401
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: ADMIN_SECRET }),
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Attempt to login using ADMIN_API_KEY rejected with 401');
  }

  // Test 34: Admin Login Valid returns 200, stateless session token, and expiresIn 14400
  let sessionToken = '';
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://agussuhana268-coder.github.io',
      },
      body: JSON.stringify({ password: ADMIN_PASSWORD }),
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Valid admin login returns 200');
    assert(
      res.headers.get('Access-Control-Allow-Origin') === 'https://agussuhana268-coder.github.io',
      'Valid login response has CORS header for GitHub Pages'
    );
    const json = await res.json();
    assert(json.success === true, 'Login response has success: true');
    assert(typeof json.token === 'string' && json.token.includes('.'), 'Session token is dot-delimited string');
    assert(json.expiresIn === 14400, 'Session token expiresIn is 14400 (4 hours)');
    sessionToken = json.token;
  }

  // Test 35: Admin GET /orders using valid Session Token (Bearer SESSION_TOKEN)
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Origin: 'https://agussuhana268-coder.github.io',
      },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Admin GET /orders with session token returns 200');
    const json = await res.json();
    assert(json.success === true, 'Admin GET /orders with session token success is true');
    assert(Array.isArray(json.orders), 'Admin GET /orders with session token returns orders array');
  }

  // Test 36: Session token with invalid signature rejected (401)
  {
    const parts = sessionToken.split('.');
    const tamperedSig = parts[0] + '.' + 'invalidsignaturebytes123';
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tamperedSig}` },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Session token with invalid signature rejected with 401');
  }

  // Test 37: Session token with tampered payload rejected (401)
  {
    const parts = sessionToken.split('.');
    const tamperedPayload = 'eyJyYW5kb20iOiJ0YW1wZXJlZCJ9.' + parts[1];
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tamperedPayload}` },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Session token with tampered payload rejected with 401');
  }

  // Test 38: Session token signed with different secret rejected (401)
  {
    const now = Math.floor(Date.now() / 1000);
    const forgedToken = await createCustomSessionToken(
      { role: 'admin', iat: now, exp: now + 3600 },
      'wrong-attacker-secret'
    );
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${forgedToken}` },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Session token with wrong secret rejected with 401');
  }

  // Test 39: Expired session token rejected (401)
  {
    const now = Math.floor(Date.now() / 1000);
    const expiredToken = await createCustomSessionToken(
      { role: 'admin', iat: now - 7200, exp: now - 3600 },
      ADMIN_PASSWORD
    );
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Expired session token rejected with 401');
  }

  // Test 40: Session token with non-admin role rejected (401)
  {
    const now = Math.floor(Date.now() / 1000);
    const nonAdminToken = await createCustomSessionToken(
      { role: 'guest', iat: now, exp: now + 3600 },
      ADMIN_PASSWORD
    );
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${nonAdminToken}` },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 401, 'Session token with non-admin role rejected with 401');
  }

  // Test 41: Complete order using Session Token
  let sessionTestOrderId = '';
  {
    const createReq = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: { title: 'Session Test Product' },
        total: '75000',
        customer_name: 'Session Customer',
      }),
    });
    const createRes = await worker.fetch(createReq, env);
    const createJson = await createRes.json();
    sessionTestOrderId = createJson.order.order_id;

    // Transition to WAITING_VERIFICATION
    await worker.fetch(new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${sessionTestOrderId}/paid`, { method: 'POST' }), env);

    // Complete using Session Token
    const completeReq = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${sessionTestOrderId}/complete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Origin: 'https://agussuhana268-coder.github.io',
      },
    });
    const completeRes = await worker.fetch(completeReq, env);
    assert(completeRes.status === 200, 'Complete order with session token returns 200');
    const completeJson = await completeRes.json();
    assert(completeJson.success === true, 'Complete order with session token has success: true');
    assert(completeJson.order.status === 'SUCCESS', 'Order status completed to SUCCESS');
  }

  // Test 42: Cancel order using Session Token
  let sessionCancelOrderId = '';
  {
    const createReq = new Request('https://api.mdzzofficialstore.biz.id/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: { title: 'Cancel Test Product' },
        total: '50000',
        customer_name: 'Cancel Customer',
      }),
    });
    const createRes = await worker.fetch(createReq, env);
    const createJson = await createRes.json();
    sessionCancelOrderId = createJson.order.order_id;

    // Transition to WAITING_VERIFICATION
    await worker.fetch(new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${sessionCancelOrderId}/paid`, { method: 'POST' }), env);

    // Cancel using Session Token
    const cancelReq = new Request(`https://api.mdzzofficialstore.biz.id/api/admin/orders/${sessionCancelOrderId}/cancel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        Origin: 'https://agussuhana268-coder.github.io',
      },
    });
    const cancelRes = await worker.fetch(cancelReq, env);
    assert(cancelRes.status === 200, 'Cancel order with session token returns 200');
    const cancelJson = await cancelRes.json();
    assert(cancelJson.success === true, 'Cancel order with session token has success: true');
    assert(cancelJson.order.status === 'CANCELLED', 'Order status cancelled to CANCELLED');
  }

  // Test 43: ADMIN_API_KEY master authentication remains valid (Backward compatibility verified)
  {
    const req = new Request('https://api.mdzzofficialstore.biz.id/api/admin/orders', {
      method: 'GET',
      headers: { Authorization: `Bearer ${ADMIN_SECRET}` },
    });
    const res = await worker.fetch(req, env);
    assert(res.status === 200, 'Master ADMIN_API_KEY continues to return 200');
    const json = await res.json();
    assert(json.success === true, 'Master ADMIN_API_KEY response success is true');
  }

  // Test 44: Customer API endpoints remain intact and functional
  {
    const getReq = new Request(`https://api.mdzzofficialstore.biz.id/api/orders/${sessionTestOrderId}`, {
      method: 'GET',
    });
    const getRes = await worker.fetch(getReq, env);
    assert(getRes.status === 200, 'Customer GET /api/orders/:orderId returns 200');
    const getJson = await getRes.json();
    assert(getJson.order.order_id === sessionTestOrderId, 'Customer order matches requested ID');
    assert(getJson.order.status === 'SUCCESS', 'Customer order status reflects updated state');
  }

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
