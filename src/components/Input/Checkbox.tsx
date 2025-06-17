import React from 'react';
import '@/styles/components/checkbox.css';

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  id,
  className = '',
  ...rest
}) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <label className={`c-checkbox ${className}`.trim()} htmlFor={inputId}>
      <input
        type='checkbox'
        id={inputId}
        className='c-checkbox__input'
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
