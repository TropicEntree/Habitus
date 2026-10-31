import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const THRESHOLD = 70;
const MAX = 100;

/**
 * Reusable Pull-to-Refresh container driven by React touch gestures
 * (onTouchStart / onTouchMove / onTouchEnd). It auto-detects its nearest
 * scrollable ancestor so it works inside per-tab scroll containers (and
 * falls back to the window). Call onRefresh (must return a Promise) when
 * the pull crosses the threshold. Backward-compatible with desktop (no
 * touch → no-op).
 */
export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);
  const scrollEl = useRef(null);
  const onRefreshRef = useRef(onRefresh);
  onRefreshRef.current = onRefresh;

  useEffect(() => { pullRef.current = pull; }, [pull]);

  const findScroll = (el) => {
    let node = el?.parentElement;
    while (node && node !== document.body) {
      const { overflowY } = window.getComputedStyle(node);
      if (overflowY === "auto" || overflowY === "scroll") return node;
      node = node.parentElement;
    }
    return null;
  };

  const getTop = () => (scrollEl.current ? scrollEl.current.scrollTop : window.scrollY);

  const onTouchStart = (e) => {
    if (refreshing) return;
    scrollEl.current = findScroll(e.currentTarget);
    if (getTop() > 0) return;
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  };

  const onTouchMove = (e) => {
    if (!pulling.current || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) {
      if (pullRef.current > 0) setPull(0);
      return;
    }
    // 8px dead zone so taps / small drags on buttons never trigger a pull.
    if (getTop() <= 0 && dy > 8) {
      setPull(Math.min((dy - 8) * 0.5, MAX));
    } else if (pullRef.current > 0) {
      setPull(0);
    }
  };

  const onTouchEnd = () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullRef.current >= THRESHOLD) setRefreshing(true);
    else setPull(0);
  };

  useEffect(() => {
    if (!refreshing) return;
    let active = true;
    (async () => {
      try {
        await onRefreshRef.current();
      } finally {
        if (active) {
          setRefreshing(false);
          setPull(0);
        }
      }
    })();
    return () => { active = false; };
  }, [refreshing]);

  const distance = refreshing ? THRESHOLD : pull;
  const progress = Math.min(pull / THRESHOLD, 1);
  const showSpinner = pull > 0 || refreshing;
  const animate = !pulling.current && !refreshing;

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      <div
        className="fixed top-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
        style={{
          transform: `translateY(${distance}px)`,
          opacity: showSpinner ? 1 : 0,
          transition: animate ? "transform 0.2s ease, opacity 0.2s ease" : "none",
        }}
      >
        <div className="mt-2" style={{ transform: `scale(${0.6 + (refreshing ? 1 : progress) * 0.4})` }}>
          <Loader2 size={26} className="text-purple-400 animate-spin" style={{ opacity: refreshing ? 1 : progress }} />
        </div>
      </div>
      <div style={{ transform: `translateY(${distance}px)`, transition: animate ? "transform 0.2s ease" : "none" }}>
        {children}
      </div>
    </div>
  );
}