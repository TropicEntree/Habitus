import { useEffect, useRef, useState } from "react";

/**
 * Smoothly counts from the previous value to the new value.
 * Gives instant visible feedback when XP / streaks change.
 */
export default function AnimatedCounter({ value = 0, duration = 600, className = "", format }) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    if (from === to) return;

    const start = performance.now();
    cancelAnimationFrame(rafRef.current);

    const tick = (now) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // easeOutQuart — snappy at the start, settles smoothly
      const eased = 1 - Math.pow(1 - t, 4);
      const current = from + (to - from) * eased;
      setDisplay(Math.round(current));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        setDisplay(to);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const text = format ? format(display) : display;
  return <span className={className}>{text}</span>;
}