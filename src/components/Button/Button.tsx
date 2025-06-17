import React from 'react';
import '@/styles/components/button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant mapped to design tokens */
  variant?: 'primary' | 'error' | 'neutral' | 'neon' | 'green';
  /** Make the button take full width of its container */
  fullWidth?: boolean;
}

/**
 * Reusable button component styled using ITCSS variables.
 * Height: 48px, horizontal padding 16px, border-radius 4px.
 * Variants map to --color-primary, --color-error, --color-neutral.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full-width' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default Button;
