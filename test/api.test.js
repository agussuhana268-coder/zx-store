/**
 * Unit test for src/utils/api.js
 * Uses mock global fetch to test all client API methods without live network.
 */
import { createOrder, getOrder, markOrderPaid, API_BASE_URL } from '../src/utils/api.js';

async function runApiTests() {
  console.log('--- Running Frontend API Client Tests ---');
  let passed = 0;
  let failed = 0;

  function testAssert(condition, name) {
    if (condition) {
      console.log(`✓ ${name}`);
      passed++;
    } else {
      console.error(`✗ FAILED: ${name}`);
      failed++;
    }
  }

  const originalFetch = globalThis.fetch;

  try {
    // Test 1: API_BASE_URL default
    testAssert(
      API_BASE_URL === 'https://mdzz-store-api.agussuhana268.workers.dev',
      'API_BASE_URL defaults to the production worker'
    );

    // Test 2: createOrder sends correct POST payload and returns order
    {
      let capturedUrl, capturedOptions;
      globalThis.fetch = async (url, options) => {
        capturedUrl = url;
        capturedOptions = options;
        return {
          ok: true,
          status: 201,
          json: async () => ({
            success: true,
            order: {
              order_id: 'ZX-261005-1234',
              orderId: 'ZX-261005-1234',
              status: 'PENDING_PAYMENT',
              total: 'Rp 45.000',
              customer_name: 'Budi',
              customer_contact: '08123456789',
              payment_method: 'QRIS_DANA',
            },
          }),
        };
      };

      const result = await createOrder({
        product: { name: 'Varian 1' },
        total: 'Rp 45.000',
        customerName: 'Budi',
        customerContact: '08123456789',
        paymentMethod: 'QRIS_DANA',
      });

      testAssert(capturedUrl === `${API_BASE_URL}/api/orders`, 'createOrder calls /api/orders');
      testAssert(capturedOptions.method === 'POST', 'createOrder uses method POST');
      const body = JSON.parse(capturedOptions.body);
      testAssert(body.customer_name === 'Budi', 'Body has customer_name');
      testAssert(body.total === 'Rp 45.000', 'Body has total');
      testAssert(result.orderId === 'ZX-261005-1234', 'Returns created order with orderId');
    }

    // Test 3: createOrder throws error on failure response
    {
      globalThis.fetch = async () => ({
        ok: false,
        status: 400,
        json: async () => ({ success: false, error: 'Field "total" is required.' }),
      });

      let threw = false;
      try {
        await createOrder({ product: 'Test' });
      } catch (err) {
        threw = true;
        testAssert(err.message === 'Field "total" is required.', 'createOrder throws backend error message');
      }
      testAssert(threw, 'createOrder rejects when response is not ok');
    }

    // Test 4: getOrder retrieves order by orderId
    {
      let capturedUrl;
      globalThis.fetch = async (url) => {
        capturedUrl = url;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            order: {
              orderId: 'ZX-261005-9999',
              status: 'WAITING_VERIFICATION',
            },
          }),
        };
      };

      const res = await getOrder('ZX-261005-9999');
      testAssert(capturedUrl === `${API_BASE_URL}/api/orders/ZX-261005-9999`, 'getOrder requests correct URL');
      testAssert(res.status === 'WAITING_VERIFICATION', 'getOrder returns order data');
    }

    // Test 5: getOrder validates orderId presence
    {
      let threw = false;
      try {
        await getOrder('');
      } catch (err) {
        threw = true;
        testAssert(err.message === 'Order ID wajib disertakan.', 'getOrder requires orderId');
      }
      testAssert(threw, 'getOrder throws when orderId is empty');
    }

    // Test 6: markOrderPaid sends POST to /paid endpoint
    {
      let capturedUrl, capturedMethod;
      globalThis.fetch = async (url, options) => {
        capturedUrl = url;
        capturedMethod = options.method;
        return {
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            order: {
              orderId: 'ZX-261005-1234',
              status: 'WAITING_VERIFICATION',
            },
          }),
        };
      };

      const res = await markOrderPaid('ZX-261005-1234');
      testAssert(
        capturedUrl === `${API_BASE_URL}/api/orders/ZX-261005-1234/paid`,
        'markOrderPaid calls /api/orders/:orderId/paid'
      );
      testAssert(capturedMethod === 'POST', 'markOrderPaid uses POST');
      testAssert(res.status === 'WAITING_VERIFICATION', 'markOrderPaid returns updated status');
    }

    // Test 7: markOrderPaid throws on backend rejection
    {
      globalThis.fetch = async () => ({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          error: 'Invalid status transition: order status "WAITING_VERIFICATION" cannot be changed.',
        }),
      });

      let threw = false;
      try {
        await markOrderPaid('ZX-261005-1234');
      } catch (err) {
        threw = true;
        testAssert(
          err.message.includes('Invalid status transition'),
          'markOrderPaid throws backend error message'
        );
      }
      testAssert(threw, 'markOrderPaid rejects on HTTP 400');
    }

    console.log(`\nAPI Tests finished: ${passed} passed, ${failed} failed.`);
    if (failed > 0) process.exit(1);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

runApiTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
