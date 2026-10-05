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
    return {
      bind(...params) {
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
            if (query.trim().startsWith('SELECT * FROM orders WHERE order_id = ?')) {
              const [order_id] = params;
              return db.orders.get(order_id) || null;
            }
            return null;
          }
        };
      }
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

  const env = {
    DB: new MockD1Database()
  };

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

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
