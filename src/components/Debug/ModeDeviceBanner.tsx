import type { CSSProperties } from 'react';

/* eslint-disable import/no-restricted-paths */
import { useFormMode } from '@/features/form-editor/FormModeProvider';
/* eslint-enable import/no-restricted-paths */
import useBreakpoint from '@/hooks/useBreakpoint';

// Set VITE_SHOW_MODE_BANNER=false in production to hide this banner
const shouldShow = import.meta.env.VITE_SHOW_MODE_BANNER !== 'false';

const styles: CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  background: 'rgba(0,0,0,0.6)',
  color: '#fff',
  padding: '2px 6px',
  fontSize: '12px',
  fontFamily: 'monospace',
  zIndex: 1000,
  borderBottomLeftRadius: '4px',
};

export default function ModeDeviceBanner() {
  const { mode } = useFormMode();
  const bp = useBreakpoint();

  if (!shouldShow) return null;

  const modeAbbrev = mode === 'quick' ? 'QF' : 'GM';
  const deviceAbbrev = bp === 'mobile' ? 'MO' : bp === 'tablet' ? 'TA' : 'DE';

  return (
    <div
      style={styles}
      aria-label={`mode-${modeAbbrev} device-${deviceAbbrev}`}
    >
      {modeAbbrev} · {deviceAbbrev}
    </div>
  );
}
