import React from 'react';
import { logger } from '@/utils/logger';
import type { ModuleDefinition } from '@/types/form';

// Field components
import { TextFieldComponent } from './fields/TextFieldComponent';
import { BooleanFieldComponent } from './fields/BooleanFieldComponent';
import { DateFieldComponent } from './fields/DateFieldComponent';
import { TaskHazardControlComponent } from './fields/TaskHazardControlComponent';
import { PhotoModule } from './fields/PhotoModule';
import { SignatureModule } from './fields/SignatureModule';

interface ModuleRendererProps {
  moduleKey: string;
  moduleDefinition: ModuleDefinition;
  moduleData: any;
  onFieldChange: (fieldKey: string, value: any) => void;
  onModuleChange: (moduleData: any) => void;
}

export const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  moduleKey,
  moduleDefinition,
  moduleData,
  onFieldChange,
  onModuleChange,
}) => {
  logger.log('Rendering module', {
    moduleKey,
    renderType: moduleDefinition.renderType,
  });

  const renderSimpleModule = () => {
    if (!moduleDefinition.fields) {
      logger.warn('Simple module missing fields', { moduleKey });
      return <div>Module configuration error</div>;
    }

    return (
      <div className='module-fields'>
        {Object.entries(moduleDefinition.fields).map(
          ([fieldKey, fieldConfig]) => {
            const fieldData = moduleData?.[fieldKey];
            const fieldValue = fieldData?.value || '';

            return (
              <div key={fieldKey} className='field-container'>
                {renderField(fieldKey, fieldConfig, fieldValue)}
              </div>
            );
          }
        )}
      </div>
    );
  };

  const renderField = (fieldKey: string, fieldConfig: any, value: any) => {
    const commonProps = {
      fieldKey,
      fieldConfig,
      value,
      onChange: (newValue: any) => onFieldChange(fieldKey, newValue),
    };

    switch (fieldConfig.type) {
      case 'string':
        return <TextFieldComponent {...commonProps} />;

      case 'boolean':
        return <BooleanFieldComponent {...commonProps} />;

      case 'date':
      case 'time':
        return <DateFieldComponent {...commonProps} />;

      default:
        logger.warn('Unknown field type', { fieldKey, type: fieldConfig.type });
        return <TextFieldComponent {...commonProps} />;
    }
  };

  const renderCustomModule = () => {
    switch (moduleKey) {
      case 'taskHazardControl':
        return (
          <TaskHazardControlComponent
            moduleData={moduleData}
            moduleDefinition={moduleDefinition}
            onChange={onModuleChange}
          />
        );

      case 'photos':
        return (
          <PhotoModule
            moduleData={moduleData}
            moduleDefinition={moduleDefinition}
            onChange={onModuleChange}
          />
        );

      case 'signatures':
        return (
          <SignatureModule
            moduleData={moduleData}
            moduleDefinition={moduleDefinition}
            onChange={onModuleChange}
          />
        );

      default:
        logger.warn('Unknown custom module', { moduleKey });
        return <div>Unknown module: {moduleKey}</div>;
    }
  };

  return (
    <div className='module-container' data-module={moduleKey}>
      <div className='module-header'>
        <h2 className='module-title'>{moduleDefinition.title}</h2>
        {moduleDefinition.description && (
          <p className='module-description'>{moduleDefinition.description}</p>
        )}
      </div>

      <div className='module-content'>
        {moduleDefinition.renderType === 'simple'
          ? renderSimpleModule()
          : renderCustomModule()}
      </div>
    </div>
  );
};
