import React, { useEffect, useRef, useState } from 'react';
import '@/styles/components/floating-input.css';
import MessageBox from '@/components/MessageBox/MessageBox';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Floating label text */
  label: string;
  /** Optional helper text displayed after delay */
  helperText?: string;
  /** Position of the tooltip */
  position?: 'above' | 'below';
}

/**
 * Pluggable input component.
 *
 * The component intentionally carries minimal styling so that deleting
 * `src/styles/components/input.css` (or omitting its import) removes ONLY the
 * visual layer while the structural markup remains intact. This follows the
 * ITCSS component-layer plug-and-play principle.
 */
const Input: React.FC<InputProps> = ({
  label,
  helperText,
  id,
  className = '',
  position = 'below',
  ...rest
}) => {
  // If the caller doesn't supply an id, generate a stable one per instance
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const [showHelper, setShowHelper] = useState(false);
  const timerRef = useRef<number | null>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (helperText && e.currentTarget.value === '') {
      timerRef.current = window.setTimeout(() => {
        setShowHelper(true);
      }, 10000);
    }
  };

  const clearHelper = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowHelper(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value !== '') {
      clearHelper();
    }
    rest.onChange?.(e);
  };

  const handleBlur = () => {
    clearHelper();
  };

  const tooltipPos = showHelper ? position : 'below';

  return (
    <div className='form-group'>
      <input
        id={inputId}
        className={`field-input ${className}`.trim()}
        placeholder=' '
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInput}
        {...rest}
      />
      <label className='field-label' htmlFor={inputId}>
        {label}
      </label>
      {helperText && showHelper && (
        <div className={`helper-tooltip helper-tooltip--${position}`}>
          <MessageBox variant='helper'>{helperText}</MessageBox>
        </div>
      )}
    </div>
  );
};

export default Input;
