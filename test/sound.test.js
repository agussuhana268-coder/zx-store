/**
 * Unit test for src/utils/sound.js and status transition logic.
 */
import { playSuccessSound } from '../src/utils/sound.js';
import { ORDER_STATUS } from '../src/utils/order.js';

async function runSoundTests() {
  console.log('--- Running Sound & Status Transition Tests ---');
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

  // Test 1: Node environment where window is undefined -> playSuccessSound runs safely without throwing
  {
    let threw = false;
    try {
      playSuccessSound();
    } catch {
      threw = true;
    }
    testAssert(!threw, 'playSuccessSound safely no-ops in non-browser environment without throwing');
  }

  // Test 2: Web Audio API mock environment -> creates nodes, plays chime, and reuses AudioContext
  {
    let contextCreationCount = 0;
    let oscCreatedCount = 0;
    let gainCreatedCount = 0;
    let oscStartedCount = 0;

    class MockAudioContext {
      constructor() {
        contextCreationCount++;
        this.state = 'running';
        this.currentTime = 0.5;
        this.destination = {};
      }

      createGain() {
        gainCreatedCount++;
        return {
          gain: {
            setValueAtTime: () => {},
            linearRampToValueAtTime: () => {},
            exponentialRampToValueAtTime: () => {},
          },
          connect: () => {},
        };
      }

      createOscillator() {
        oscCreatedCount++;
        return {
          frequency: {
            setValueAtTime: () => {},
          },
          type: 'sine',
          connect: () => {},
          start: () => {
            oscStartedCount++;
          },
          stop: () => {},
        };
      }

      async resume() {
        this.state = 'running';
      }
    }

    // Setup global browser mock
    globalThis.window = {
      AudioContext: MockAudioContext,
    };

    // First call: initializes context and renders 3 chime notes
    playSuccessSound();
    testAssert(contextCreationCount === 1, 'AudioContext is instantiated on first playback');
    testAssert(gainCreatedCount === 4, 'Creates 4 gain nodes (1 master gain + 3 note gains)');
    testAssert(oscCreatedCount === 3, 'Creates exactly 3 harmonic oscillator notes (C5, G5, C6)');
    testAssert(oscStartedCount === 3, 'Starts 3 oscillators for chime');

    // Second call: must REUSE the existing AudioContext (no new instance created)
    playSuccessSound();
    testAssert(contextCreationCount === 1, 'AudioContext is reused across invocations (no duplicate AudioContext)');

    // Test 3: Autoplay suspended state with resume rejection -> must not throw or crash
    let resumeRejectMockCtx = new MockAudioContext();
    resumeRejectMockCtx.state = 'suspended';
    resumeRejectMockCtx.resume = async () => {
      throw new Error('Autoplay blocked by browser');
    };
    globalThis.window.AudioContext = function() {
      return resumeRejectMockCtx;
    };

    let suspendedThrew = false;
    try {
      playSuccessSound();
    } catch {
      suspendedThrew = true;
    }
    testAssert(!suspendedThrew, 'Blocked autoplay policy is handled gracefully without error');

    // Clean up mock window
    delete globalThis.window;
  }

  // Test 4: Simulation of QrisPaymentModal status transition detection logic
  {
    function createTransitionDetector() {
      let prevStatus = null;
      let prevOrderId = null;
      let hasPlayed = false;
      let playCount = 0;

      return {
        onRender(orderId, currentStatus) {
          // Initialize refs on first render
          if (prevStatus === null) {
            prevStatus = currentStatus;
            prevOrderId = orderId;
            return { soundPlayed: false, playCount };
          }

          if (prevOrderId !== orderId) {
            prevOrderId = orderId;
            hasPlayed = false;
          }

          let didPlayThisTick = false;
          if (
            prevStatus === ORDER_STATUS.WAITING_VERIFICATION &&
            currentStatus === ORDER_STATUS.SUCCESS &&
            !hasPlayed
          ) {
            hasPlayed = true;
            playCount++;
            didPlayThisTick = true;
          }

          prevStatus = currentStatus;
          return { soundPlayed: didPlayThisTick, playCount };
        },
      };
    }

    // Case 4A: Normal flow: Mount with PENDING_PAYMENT -> Submit to WAITING_VERIFICATION -> Verified to SUCCESS
    const normalFlow = createTransitionDetector();
    let r1 = normalFlow.onRender('ZX-001', ORDER_STATUS.PENDING_PAYMENT);
    testAssert(!r1.soundPlayed && r1.playCount === 0, 'No sound on mount with PENDING_PAYMENT');

    let r2 = normalFlow.onRender('ZX-001', ORDER_STATUS.WAITING_VERIFICATION);
    testAssert(!r2.soundPlayed && r2.playCount === 0, 'No sound when transitioning to WAITING_VERIFICATION');

    // Repeated polling ticks while in WAITING_VERIFICATION
    let r3 = normalFlow.onRender('ZX-001', ORDER_STATUS.WAITING_VERIFICATION);
    let r4 = normalFlow.onRender('ZX-001', ORDER_STATUS.WAITING_VERIFICATION);
    testAssert(!r3.soundPlayed && !r4.soundPlayed && r4.playCount === 0, 'No sound during repeated WAITING_VERIFICATION polling ticks');

    // Admin verifies order: WAITING_VERIFICATION -> SUCCESS
    let r5 = normalFlow.onRender('ZX-001', ORDER_STATUS.SUCCESS);
    testAssert(r5.soundPlayed && r5.playCount === 1, 'Sound plays EXACTLY ONCE on WAITING_VERIFICATION -> SUCCESS transition');

    // Subsequent re-renders or poll checks while SUCCESS
    let r6 = normalFlow.onRender('ZX-001', ORDER_STATUS.SUCCESS);
    let r7 = normalFlow.onRender('ZX-001', ORDER_STATUS.SUCCESS);
    testAssert(!r6.soundPlayed && !r7.soundPlayed && r7.playCount === 1, 'No sound on subsequent renders when status stays SUCCESS');

    // Case 4B: Page reload directly into SUCCESS
    const reloadSuccess = createTransitionDetector();
    let reload1 = reloadSuccess.onRender('ZX-002', ORDER_STATUS.SUCCESS);
    let reload2 = reloadSuccess.onRender('ZX-002', ORDER_STATUS.SUCCESS);
    testAssert(!reload1.soundPlayed && !reload2.soundPlayed && reload2.playCount === 0, 'No sound when page reloads with status already SUCCESS');

    // Case 4C: Page reload directly into WAITING_VERIFICATION
    const reloadWaiting = createTransitionDetector();
    let reloadW1 = reloadWaiting.onRender('ZX-003', ORDER_STATUS.WAITING_VERIFICATION);
    testAssert(!reloadW1.soundPlayed && reloadW1.playCount === 0, 'No sound when page reloads into WAITING_VERIFICATION');

    // Polling then receives SUCCESS
    let reloadW2 = reloadWaiting.onRender('ZX-003', ORDER_STATUS.SUCCESS);
    testAssert(reloadW2.soundPlayed && reloadW2.playCount === 1, 'Sound plays when polling verifies order after reload');

    // Case 4D: Order cancelled: WAITING_VERIFICATION -> CANCELLED
    const cancelledFlow = createTransitionDetector();
    cancelledFlow.onRender('ZX-004', ORDER_STATUS.WAITING_VERIFICATION);
    let cancelRes = cancelledFlow.onRender('ZX-004', ORDER_STATUS.CANCELLED);
    testAssert(!cancelRes.soundPlayed && cancelRes.playCount === 0, 'No sound when order transitions to CANCELLED');
  }

  console.log(`\nSound & Transition Tests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) {
    process.exit(1);
  }
}

runSoundTests();
