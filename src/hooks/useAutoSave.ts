import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useAutoSave(intervalMs: number = 60000) {
  const hasStarted = useGameStore((s) => s.hasStarted);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const saveGame = useGameStore((s) => s.saveGame);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!hasStarted || isGameOver) return;

    timerRef.current = setInterval(() => {
      saveGame();
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [hasStarted, isGameOver, saveGame, intervalMs]);
}
