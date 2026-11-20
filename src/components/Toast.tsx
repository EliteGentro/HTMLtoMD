import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import type { ToastType } from '../types';

interface ToastProps {
  message: string;
  type?: ToastType;
  onDismiss: () => void;
  duration?: number;
}

const EXIT_ANIMATION_MS = 200;

export default function Toast({ message, type = 'success', onDismiss, duration = 2500 }: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    let exitTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(() => {
      setVisible(false);
      exitTimer = setTimeout(onDismiss, EXIT_ANIMATION_MS);
    }, duration);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      clearTimeout(exitTimer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium transition-all duration-200 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${
        type === 'success'
          ? 'bg-brand-600 text-white dark:bg-brand-500'
          : 'bg-red-600 text-white'
      }`}
    >
      {type === 'success' ? <Check size={16} /> : <X size={16} />}
      {message}
    </div>
  );
}
