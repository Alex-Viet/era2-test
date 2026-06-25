import { useEffect, useState } from 'react';

/**
 * Держит элемент в DOM на время exit-анимации перед размонтированием.
 */
export function useDelayedVisibility(active: boolean, delayMs = 300) {
  const [mounted, setMounted] = useState(active);
  const [visible, setVisible] = useState(active);

  useEffect(() => {
    if (active) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => {
        cancelAnimationFrame(frame);
      };
    }

    setVisible(false);
    const timer = window.setTimeout(() => {
      setMounted(false);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [active, delayMs]);

  return { mounted, visible };
}
