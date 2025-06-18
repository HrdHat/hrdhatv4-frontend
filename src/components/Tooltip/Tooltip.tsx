import React from 'react';
import '@/styles/components/tooltip.css';

interface TooltipProps {
  /** Element that triggers the tooltip (text, icon, etc.) */
  children: React.ReactNode;
  /** Tooltip text or JSX */
  content: React.ReactNode;
}

/**
 * Accessible tooltip component.
 *
 *  - Hover or keyboard focus reveals the tooltip.
 *  - Uses theme variables for neon-yellow styling.
 *  - Pure CSS (no additional JS listeners).
 */
const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const id = React.useId();

  return (
    <span className='c-tooltip'>
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
