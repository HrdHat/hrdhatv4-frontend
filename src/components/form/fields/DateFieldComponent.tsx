import React from 'react';

interface DateFieldComponentProps {
  fieldKey: string;
  fieldConfig: any;
  value: string;
  onChange: (value: string) => void;
}

export const DateFieldComponent: React.FC<DateFieldComponentProps> = ({
  fieldKey,
  fieldConfig,
  value,
  onChange,
}) => {
  const inputType = fieldConfig.type === 'time' ? 'time' : 'date';

  return (
    <div className='date-field'>
      <label htmlFor={fieldKey} className='field-label'>
        {fieldConfig.label}
        {fieldConfig.required && <span className='required'>*</span>}
      </label>

      <input
        id={fieldKey}
        type={inputType}
        value={value}
        onChange={e => onChange(e.target.value)}
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
