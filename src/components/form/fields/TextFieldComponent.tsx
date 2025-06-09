import React from 'react';

interface TextFieldComponentProps {
  fieldKey: string;
  fieldConfig: any;
  value: string;
  onChange: (value: string) => void;
}

export const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  fieldKey,
  fieldConfig,
  value,
  onChange,
}) => {
  return (
    <div className='text-field'>
      <label htmlFor={fieldKey} className='field-label'>
        {fieldConfig.label}
        {fieldConfig.required && <span className='required'>*</span>}
      </label>

      <input
        id={fieldKey}
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={`Enter ${fieldConfig.label.toLowerCase()}`}
        className='field-input'
      />

      {fieldConfig.helperText1 && (
        <div className='helper-text'>
          <small>{fieldConfig.helperText1}</small>
          {fieldConfig.helperText2 && <small>{fieldConfig.helperText2}</small>}
        </div>
      )}
    </div>
  );
};
