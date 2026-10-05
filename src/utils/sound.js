/**
 * Audio utility for MDZZ Store / ZetXiters customer site.
 * Synthesizes a clean, subtle, premium success chime using Web Audio API.
 * No external dependencies or audio asset files required.
 */

let sharedAudioContext = null;

/**
 * Returns a singleton AudioContext instance.
 * Reuses the existing context to avoid memory leaks or browser limits.
 */
function getAudioContext() {
  if (typeof window === 'undefined') return null;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;

  if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
    try {
      sharedAudioContext = new AudioCtx();
    } catch {
      return null;
    }
  }

  return sharedAudioContext;
}

/**
 * Synthesizes a clean, premium 3-tone ascending success chime (C5 -> G5 -> C6).
 * Total duration is approx 0.7s, subtle and non-intrusive.
 *
 * @param {AudioContext} ctx
 */
function renderSuccessChime(ctx) {
  const now = ctx.currentTime;

  // Master gain node to keep the overall volume subtle and prevent harshness
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, now);
  masterGain.connect(ctx.destination);

  // Ascending notes for a crisp, high-tech positive confirmation chime
  const notes = [
    { freq: 523.25, offset: 0.0, duration: 0.28, relativeGain: 0.5 },  // C5
    { freq: 783.99, offset: 0.09, duration: 0.35, relativeGain: 0.65 }, // G5
    { freq: 1046.50, offset: 0.18, duration: 0.52, relativeGain: 0.8 }, // C6
  ];

  notes.forEach(({ freq, offset, duration, relativeGain }) => {
    const noteStart = now + offset;
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteStart);

    // Click-free attack and exponential bell-decay
    noteGain.gain.setValueAtTime(0.0001, noteStart);
    noteGain.gain.linearRampToValueAtTime(relativeGain, noteStart + 0.015);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);
    noteGain.gain.linearRampToValueAtTime(0, noteStart + duration + 0.01);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    osc.start(noteStart);
    osc.stop(noteStart + duration + 0.02);
  });
}

/**
 * Plays the success chime when order payment verification completes.
 * Respects browser autoplay policy and handles blocked audio gracefully.
 * Fails silently as progressive enhancement without disrupting UI/business logic.
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          renderSuccessChime(ctx);
        })
        .catch(() => {
          // Autoplay policy prevented playback; safely ignore
        });
      return;
    }

    renderSuccessChime(ctx);
  } catch (err) {
    // Audio is purely an enhancement; never disrupt transaction flow on error
    if (typeof console !== 'undefined' && console.debug) {
      console.debug('playSuccessSound bypassed:', err);
    }
  }
}
