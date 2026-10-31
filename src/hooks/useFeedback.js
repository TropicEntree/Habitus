import { useCallback, useRef } from "react";

let audioCtx = null;

function getAudioCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

/**
 * Plays a short ascending "ding" via Web Audio API.
 * No audio file needed — synthesised on the fly.
 */
function playDing() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;
  const notes = [880, 1320]; // A5 -> E6 (bright, rewarding)
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + i * 0.08;
    const peak = 0.18;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.4);
  });
}

/**
 * Triggers haptic feedback on supported mobile devices.
 */
function vibrate(pattern = 30) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }
}

/**
 * Hook returning a fire() callback that triggers sound + vibration together.
 * Use for instant dopamine feedback on any completion action.
 */
export function useFeedback() {
  const lastFired = useRef(0);

  const fire = useCallback((opts = {}) => {
    const { sound = true, haptic = true } = opts;
    // Debounce very rapid double-fires (e.g. optimistic + real)
    const now = Date.now();
    if (now - lastFired.current < 80) return;
    lastFired.current = now;
    if (sound) playDing();
    if (haptic) vibrate([20, 15, 40]);
  }, []);

  return fire;
}