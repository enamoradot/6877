import React, { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const StartScreen: React.FC = () => {
  const { startGame, loadGame } = useGameStore();
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [hasSave, setHasSave] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const save = localStorage.getItem('lifeSimSave');
      setHasSave(!!save);
    } catch {
      setHasSave(false);
    }
  }, []);

  const handleNewGame = () => {
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }
    if (playerName.trim().length === 0) return;
    setLoading(true);
    setTimeout(() => {
      startGame(playerName.trim());
    }, 500);
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      loadGame();
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNewGame();
    if (e.key === 'Escape') {
      setShowNameInput(false);
      setPlayerName('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--accent)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, transparent, var(--accent) 10%, transparent 20%)',
            opacity: 0.03,
            animationDuration: '60s',
          }}
        />
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, color-mix(in srgb, var(--success) 6%, transparent) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
        {/* Game icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--success))',
            boxShadow: '0 8px 32px color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        >
          <Play className="w-10 h-10 text-white ml-1" />
        </div>

        {/* Title */}
        <h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-2"
          style={{
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Life Simulator
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] font-medium mb-12">
          Build Your Empire
        </p>

        {/* Name input */}
        {showNameInput && (
          <div className="w-full max-w-xs mb-4 animate-fadeIn">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] text-center text-lg font-medium placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-20 transition-all"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleNewGame}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-lg text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 80%, var(--success)))',
              boxShadow: '0 4px 20px color-mix(in srgb, var(--accent) 30%, transparent)',
            }}
          >
            {showNameInput ? 'Start Game' : 'New Game'}
          </button>

          {hasSave && !showNameInput && (
            <button
              onClick={handleContinue}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Continue
            </button>
          )}

          {showNameInput && (
            <button
              onClick={() => { setShowNameInput(false); setPlayerName(''); }}
              className="w-full py-2.5 px-6 rounded-xl font-medium text-sm text-[var(--text-tertiary)] transition-all hover:text-[var(--text-secondary)]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Version */}
      <p className="absolute bottom-4 text-xs text-[var(--text-tertiary)] opacity-60">
        v1.0
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};
