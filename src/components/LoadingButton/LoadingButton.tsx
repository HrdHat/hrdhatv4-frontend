import React, { useState } from 'react';
import Button from '@/components/Button/Button';
import GearIcon from '@/components/Icon/GearIcon';
import '@/styles/components/loading-button.css';

interface LoadingButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Text label to display on the button */
  label: string;
  /** Ensure at least one full rotation before calling onComplete (optional) */
  minDurationMs?: number;
  /** Async handler to run while loading */
  onClick?: () => Promise<void> | void;
  /** Button visual variant (maps to Button component variant) */
  variant?: 'primary' | 'error' | 'neutral' | 'neon' | 'green';
}

/**
 * Primary-green button with gear icon that spins while loading and snaps into
 * place when finished. The component ensures at least one full 360° rotation
 * (default 800 ms) before invoking the passed `onClick` handler.
 */
const LoadingButton: React.FC<LoadingButtonProps> = ({
  label,
  minDurationMs = 800,
  onClick,
  disabled,
  variant = 'primary',
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const [snap, setSnap] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;

    setSnap(false);
    setLoading(true);
    const start = Date.now();

    try {
      await onClick?.();
    } finally {
      const elapsed = Date.now() - start;
      const cycle = minDurationMs;
      const remainder = cycle - (elapsed % cycle);
      setTimeout(() => {
        setLoading(false);
        setSnap(true);
      }, remainder);
    }
  };

  const busy = loading || disabled;

  const iconClass = loading
    ? 'gear-icon gear-icon--spin'
    : snap
      ? 'gear-icon gear-icon--snap'
      : 'gear-icon';

  return (
    <Button
      variant={variant}
      {...rest}
      onClick={handleClick}
      className={busy ? 'btn--loading' : ''}
      style={busy ? { pointerEvents: 'none' } : undefined}
    >
      <span>{label}</span>
      <GearIcon size='2em' className={iconClass} />
    </Button>
  );
};

export default LoadingButton;
