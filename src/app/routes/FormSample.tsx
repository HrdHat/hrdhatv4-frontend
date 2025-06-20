import React from 'react';
import '@/styles/components/form-general.css';

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
    </div>
  </div>
);

export default FormSample;
