import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function useTimeSystem() {
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPaused = useGameStore((s) => s.time.isPaused);
  const speed = useGameStore((s) => s.time.speed);
  const hasStarted = useGameStore((s) => s.hasStarted);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const advanceTime = useGameStore((s) => s.advanceTime);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!hasStarted || isPaused || isGameOver) {
      setIsRunning(false);
      return;
    }

    const ms = Math.round(1000 / speed);
    intervalRef.current = setInterval(() => {
      advanceTime(1);
    }, ms);
    setIsRunning(true);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, speed, hasStarted, isGameOver, advanceTime]);

  return { isRunning };
}
