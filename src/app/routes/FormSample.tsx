import React from 'react';
import '@/styles/components/form-general.css';
import '@/styles/components/form-modules.css';

const FormSample: React.FC = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}
  >
    <div className='paper-object'>
      <section className='form-module'>
        <span className='form-module__label'>General Information</span>
        <div className='general-info-grid'>
          <label htmlFor='project-name'>Project Name:</label>
          <input id='project-name' type='text' />
          <label htmlFor='task-location'>Task Location:</label>
          <input id='task-location' type='text' />
          <label htmlFor='supervisor-name'>Supervisor's Name:</label>
          <input id='supervisor-name' type='text' />
          <label htmlFor='todays-date'>Today's Date:</label>
          <input id='todays-date' type='date' />
        </div>
      </section>

      {/* Checklist section */}
      <section className='form-module'>
        <span className='form-module__label'>FLRA Pre-Job/Task Checklist</span>
        <div className='checklist-grid'>
          <label>
            <input type='checkbox' /> Well-rested and fit for duty
          </label>
          <label>
            <input type='checkbox' /> Competent for tasks today
          </label>
          <label>
            <input type='checkbox' /> Reviewed work area for hazards
          </label>
          <label>
            <input type='checkbox' /> Inspected tools and equipment
          </label>
          <label>
            <input type='checkbox' /> PPE required for today
          </label>
          <label>
            <input type='checkbox' /> Control measures reviewed
          </label>
        </div>
      </section>

      {/* PPE & Platform section */}
      <section className='form-module'>
        <span className='form-module__label'>PPE & Platform Inspection</span>
        <div className='ppe-platform-section'>
          <div className='ppe-subheading'>
            Personal Protective Equipment (PPE)
          </div>
          <label>
            <input type='checkbox' /> Hardhat
          </label>
          <label>
            <input type='checkbox' /> Safety Vest
          </label>
          <label>
            <input type='checkbox' /> Safety Glasses
          </label>
          <label>
            <input type='checkbox' /> Gloves
          </label>
          <div className='ppe-subheading'>Equipment Platforms</div>
          <label>
            <input type='checkbox' /> Ladder
          </label>
          <label>
            <input type='checkbox' /> Scissor Lift
          </label>
          <label>
            <input type='checkbox' /> Boom Lift
          </label>
        </div>
      </section>

      {/* THC table placeholder */}
      <section className='form-module'>
        <span className='form-module__label'>Task, Hazard, Control</span>
        <table className='thc-table'>
          <thead>
            <tr>
              <th>Task</th>
              <th>Hazard</th>
              <th>Risk</th>
              <th>Control</th>
              <th>Residual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} style={{ height: '80px' }} />
            </tr>
          </tbody>
        </table>
      </section>

      {/* Signatures placeholder */}
      <section className='form-module'>
        <span className='form-module__label'>Signature & Confirmation</span>
        <p className='signature-note'>
          By signing below, you confirm you have reviewed today's tasks and
          hazards.
        </p>
        <div className='signature-grid'>
          <div>
            <div className='signature-placeholder' />
            <span className='signature-label'>Worker Signature</span>
          </div>
          <div>
            <div className='signature-placeholder' />
            <span className='signature-label'>Supervisor Signature</span>
          </div>
        </div>
      </section>

      {/* Photos placeholder */}
      <section className='form-module'>
        <span className='form-module__label'>Photos</span>
        <div className='photos-placeholder'>
          Photo thumbnails will appear here.
        </div>
      </section>
    </div>
  </div>
);

export default FormSample;
