import { Skull, RotateCcw, Trophy, Calendar, TrendingUp, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/format';

export function GameOverScreen() {
  const { player, achievements, resetGame } = useGameStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="text-center max-w-md w-full animate-fade-in">
        <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <Skull size={48} className="text-red-400" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-2">Game Over</h1>
        <p className="text-gray-400 mb-8">Your health reached zero. Better luck next time!</p>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Final Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Calendar size={14} />
                <span className="text-xs">Days Survived</span>
              </div>
              <p className="text-2xl font-bold text-white">{player.totalDaysPlayed}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Star size={14} />
                <span className="text-xs">Max Level</span>
              </div>
              <p className="text-2xl font-bold text-white">{player.level}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <TrendingUp size={14} />
                <span className="text-xs">Net Worth</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{formatMoney(player.netWorth)}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
                <Trophy size={14} />
                <span className="text-xs">Achievements</span>
              </div>
              <p className="text-2xl font-bold text-amber-400">{achievements.length}</p>
            </div>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-500 text-white font-bold text-lg hover:bg-indigo-400 transition-all hover:scale-105 active:scale-95"
        >
          <RotateCcw size={20} /> Try Again
        </button>
      </div>
    </div>
  );
}
