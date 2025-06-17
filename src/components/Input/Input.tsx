import React from 'react';
import '@/styles/components/floating-input.css';
import Tooltip from '@/components/Tooltip/Tooltip';
import InfoIcon from '@/components/Icon/InfoIcon';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Floating label text */
  label: string;
  /** Tooltip content shown on hover/focus */
  tooltip?: React.ReactNode;
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
  id,
  className = '',
  tooltip,
  ...rest
}) => {
  // If the caller doesn't supply an id, generate a stable one per instance
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div className='form-group'>
      <input
        id={inputId}
        className={`field-input ${className}`.trim()}
        placeholder=' '
        {...rest}
      />
      <label className='field-label' htmlFor={inputId}>
        {label}
      </label>
      {tooltip && (
        <span style={{ position: 'absolute', top: 0, right: '2px' }}>
          <Tooltip content={tooltip}>
            <InfoIcon size={16} />
          </Tooltip>
        </span>
      )}
    </div>
  );
};

export default Input;
