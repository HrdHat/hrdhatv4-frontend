import React from 'react';

export interface ArrowIconProps {
  /** Direction the arrow points. Defaults to 'right'. */
  direction?: 'left' | 'right';
  /** Icon size in pixels (square). Defaults to 32. */
  size?: number;
  /** Additional className(s). */
  className?: string;
}

/**
 * Double-chevron arrow icon used for opening/closing drawers. Uses `currentColor`
 * fill so it inherits text color from parent (e.g., white in primary buttons).
 * The underlying path comes from `double-arrow.svg` asset (cleaned and inline).
 */
const ArrowIcon: React.FC<ArrowIconProps> = ({
  direction = 'right',
  size = 32,
  className,
}) => {
  const transform = direction === 'left' ? 'scaleX(-1)' : undefined;

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 -960 960 960'
      width={size}
      height={size}
      fill='currentColor'
      style={{ transform }}
      className={className}
      aria-hidden='true'
      focusable='false'
    >
      <path d='M242-200 442-480 242-760h98l200 280-200 280h-98Zm238 0 200-280-200-280h98l200 280-200 280h-98Z' />
    </svg>
  );
};

export default ArrowIcon;
