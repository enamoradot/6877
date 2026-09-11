import React, { useEffect, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info, Trophy, DollarSign } from 'lucide-react';
import type { Notification, NotificationType } from '../../types';
import { useGameStore } from '../../store/gameStore';

const typeConfig: Record<NotificationType, { borderColor: string; icon: React.ReactNode }> = {
  success: {
    borderColor: 'var(--success)',
    icon: <CheckCircle className="w-5 h-5 text-[var(--success)]" />,
  },
  warning: {
    borderColor: 'var(--warning)',
    icon: <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />,
  },
  info: {
    borderColor: 'var(--info)',
    icon: <Info className="w-5 h-5 text-[var(--info)]" />,
  },
  achievement: {
    borderColor: '#a855f7',
    icon: <Trophy className="w-5 h-5 text-purple-500" />,
  },
  money: {
    borderColor: 'var(--money)',
    icon: <DollarSign className="w-5 h-5 text-[var(--money)]" />,
  },
};

interface ToastItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ notification, onDismiss }) => {
  const config = typeConfig[notification.type] || typeConfig.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  return (
    <div
      className="animate-notification bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg flex items-start gap-3 p-3 pr-2 min-w-[280px] max-w-[360px]"
      style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
    >
      <div className="flex-shrink-0 mt-0.5">{config.icon}</div>
      <p className="flex-1 text-sm text-[var(--text-primary)] leading-snug">
        {notification.message}
      </p>
      <button
        onClick={() => onDismiss(notification.id)}
        className="flex-shrink-0 p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const NotificationToast: React.FC = () => {
  const notifications = useGameStore((s) => s.notifications);
  const [visible, setVisible] = useState<Notification[]>([]);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      setVisible((prev) => {
        if (prev.some((n) => n.id === latest.id)) return prev;
        const next = [...prev, latest];
        return next.slice(-4);
      });
    }
  }, [notifications]);

  const dismiss = useCallback((id: string) => {
    setVisible((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
      {visible.map((n) => (
        <ToastItem key={n.id} notification={n} onDismiss={dismiss} />
      ))}
    </div>
  );
};
