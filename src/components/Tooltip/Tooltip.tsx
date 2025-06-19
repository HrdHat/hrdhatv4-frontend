import React from 'react';
import '@/styles/components/tooltip.css';

interface TooltipProps {
  /** Element that triggers the tooltip (text, icon, etc.) */
  children: React.ReactNode;
  /** Tooltip text or JSX */
  content: React.ReactNode;
  /** Show tooltip permanently (e.g., validation message) */
  forceOpen?: boolean;
  /** Horizontal placement of bubble: center (default) or right-aligned */
  placement?: 'center' | 'right';
}

/**
 * Accessible tooltip component.
 *
 *  - Hover or keyboard focus reveals the tooltip.
 *  - Uses theme variables for neon-yellow styling.
 *  - Pure CSS (no additional JS listeners).
 */
const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  forceOpen,
  placement = 'center',
}) => {
  const id = React.useId();

  const classes = [
    'c-tooltip',
    forceOpen ? 'is-open' : '',
    placement === 'right' ? 'c-tooltip--right' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      <span
        className='c-tooltip-trigger'
        role='button'
        tabIndex={0}
        aria-describedby={id}
      >
        {children}
      </span>
      <span className='c-tooltip-content' role='tooltip' id={id}>
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
