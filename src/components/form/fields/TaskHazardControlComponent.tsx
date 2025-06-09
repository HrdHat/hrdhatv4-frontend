import React from 'react';
import {
  MODULE_CONSTRAINTS,
  getRiskColor,
  getRiskLabel,
} from '@/config/moduleConstraints';

interface TaskHazardControlComponentProps {
  moduleData: any;
  moduleDefinition: any;
  onChange: (moduleData: any) => void;
}

interface THCEntry {
  task: { value: string };
  hazard: { value: string };
  hazard_risk: { value: number };
  control: { value: string };
  control_risk: { value: number };
}

export const TaskHazardControlComponent: React.FC<
  TaskHazardControlComponentProps
> = ({ moduleData, moduleDefinition, onChange }) => {
  const entries = moduleData?.entries || [];
  const maxEntries =
    moduleDefinition.maxEntries ||
    MODULE_CONSTRAINTS.taskHazardControl.maxEntries;

  const addEntry = () => {
    if (entries.length >= maxEntries) return;

    const newEntry: THCEntry = {
      task: { value: '' },
      hazard: { value: '' },
      hazard_risk: { value: 1 },
      control: { value: '' },
      control_risk: { value: 1 },
    };

    const updatedEntries = [...entries, newEntry];
    onChange({ entries: updatedEntries });
  };

  const removeEntry = (index: number) => {
    const updatedEntries = entries.filter((_: any, i: number) => i !== index);
    onChange({ entries: updatedEntries });
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: { value },
    };
    onChange({ entries: updatedEntries });
  };

  return (
    <div className='task-hazard-control'>
      <div className='thc-header'>
        <button
          type='button'
          onClick={addEntry}
          disabled={entries.length >= maxEntries}
          className='add-entry-btn'
        >
          + Add Task/Hazard/Control Entry
        </button>
        <span className='entry-count'>
          {entries.length} / {maxEntries} entries
        </span>
      </div>

      {entries.length === 0 && (
        <div className='empty-state'>
          <p>
            No task/hazard/control entries yet. Click "Add Entry" to get
            started.
          </p>
        </div>
      )}

      {entries.map((entry: THCEntry, index: number) => (
        <div key={index} className='thc-entry'>
          <div className='entry-header'>
            <h4>Entry #{index + 1}</h4>
            <button
              type='button'
              onClick={() => removeEntry(index)}
              className='remove-entry-btn'
            >
              Remove
            </button>
          </div>

          <div className='entry-fields'>
            <div className='field-group'>
              <label>Task Description</label>
              <textarea
                value={entry.task?.value || ''}
                onChange={e => updateEntry(index, 'task', e.target.value)}
                placeholder='Describe the specific task'
                rows={2}
              />
            </div>

            <div className='field-group'>
              <label>Identified Hazard</label>
              <textarea
                value={entry.hazard?.value || ''}
                onChange={e => updateEntry(index, 'hazard', e.target.value)}
                placeholder='What hazards are present?'
                rows={2}
              />
            </div>

            <div className='risk-fields'>
              <div className='risk-field'>
                <label>Risk Before Controls</label>
                <div className='risk-input-group'>
                  <select
                    value={entry.hazard_risk?.value || 1}
                    onChange={e =>
                      updateEntry(
                        index,
                        'hazard_risk',
                        parseInt(e.target.value)
                      )
                    }
                    style={{
                      backgroundColor: getRiskColor(
                        entry.hazard_risk?.value || 1
                      ),
                    }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} - {getRiskLabel(i + 1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='risk-field'>
                <label>Risk After Controls</label>
                <div className='risk-input-group'>
                  <select
                    value={entry.control_risk?.value || 1}
                    onChange={e =>
                      updateEntry(
                        index,
                        'control_risk',
                        parseInt(e.target.value)
                      )
                    }
                    style={{
                      backgroundColor: getRiskColor(
                        entry.control_risk?.value || 1
                      ),
                    }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} - {getRiskLabel(i + 1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className='field-group'>
              <label>Control Measures</label>
              <textarea
                value={entry.control?.value || ''}
                onChange={e => updateEntry(index, 'control', e.target.value)}
                placeholder='How will you control this hazard?'
                rows={3}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
