import React from 'react';
import { useOutletContext } from 'react-router-dom';
import DoubleArrowIcon from '@/components/Icon/DoubleArrowIcon';
import '@/styles/components/panel-header.css';

interface PanelHeaderProps {
  title: string;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({ title }) => {
  // Attempt to retrieve sidebar controls from React Router outlet context – if the
  // component is rendered outside an <Outlet context={...}>, the call will
  // return `undefined`. We fall back to "no-op" behaviour to avoid runtime
  // errors and simply omit the toggle button when the controls are missing.

  const outletCtx =
    (useOutletContext<{
      toggleSidebar?: () => void;
      sidebarOpen?: boolean;
    }>() as
      | {
          toggleSidebar?: () => void;
          sidebarOpen?: boolean;
        }
      | undefined) ?? {};

  const { toggleSidebar, sidebarOpen } = outletCtx;

  return (
    <header className='panel-header'>
      {typeof toggleSidebar === 'function' &&
        typeof sidebarOpen === 'boolean' && (
          <button
            type='button'
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            className='panel-header-toggle'
          >
            <DoubleArrowIcon direction={sidebarOpen ? 'left' : 'right'} />
          </button>
        )}
      <h2 className='panel-header-title'>{title}</h2>
    </header>
  );
};

export default PanelHeader;
