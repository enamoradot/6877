import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export function useNotifications() {
  const notifications = useGameStore((s) => s.notifications);
  const dismissNotification = useGameStore((s) => s.dismissNotification);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const lastFive = notifications.slice(-5);

  useEffect(() => {
    for (const n of lastFive) {
      if (!timersRef.current.has(n.id)) {
        const timer = setTimeout(() => {
          dismissNotification(n.id);
          timersRef.current.delete(n.id);
        }, 8000);
        timersRef.current.set(n.id, timer);
      }
    }

    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, [lastFive, dismissNotification]);

  const dismiss = useCallback(
    (id: string) => {
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
      dismissNotification(id);
    },
    [dismissNotification],
  );

  return { notifications: lastFive, dismiss };
}
