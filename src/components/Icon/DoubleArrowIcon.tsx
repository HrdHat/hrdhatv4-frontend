import React from 'react';

interface DoubleArrowIconProps {
  /** 'left' or 'right'; default 'right' */
  direction?: 'left' | 'right';
  /** Optional additional className */
  className?: string;
}

/**
 * Neon green double arrow icon (40 × 40).
 * Uses inline SVG to avoid external asset dependency and allows easy flipping.
 */
const DoubleArrowIcon: React.FC<DoubleArrowIconProps> = ({
  direction = 'right',
  className = '',
}) => {
  const transform = direction === 'left' ? 'scale(-1,1)' : undefined;
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 -960 960 960'
      width='40'
      height='40'
      fill='var(--color-neon-green)'
      className={className}
      style={transform ? { transform } : undefined}
      aria-hidden='true'
      focusable='false'
    >
      <path d='m242-200 200-280-200-280h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z' />
    </svg>
  );
};

export default DoubleArrowIcon;
