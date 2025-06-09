import React from 'react';

interface BooleanFieldComponentProps {
  fieldKey: string;
  fieldConfig: any;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const BooleanFieldComponent: React.FC<BooleanFieldComponentProps> = ({
  fieldKey,
  fieldConfig,
  value,
  onChange,
}) => {
  return (
    <div className='boolean-field'>
      <div className='checkbox-container'>
        <input
          id={fieldKey}
          type='checkbox'
          checked={value}
          onChange={e => onChange(e.target.checked)}
          className='field-checkbox'
        />

        <label htmlFor={fieldKey} className='checkbox-label'>
          {fieldConfig.label}
          {fieldConfig.required && <span className='required'>*</span>}
        </label>
      </div>

      {fieldConfig.helperText1 && (
        <div className='helper-text'>
          <small>{fieldConfig.helperText1}</small>
          {fieldConfig.helperText2 && <small>{fieldConfig.helperText2}</small>}
        </div>
      )}
    </div>
  );
};
