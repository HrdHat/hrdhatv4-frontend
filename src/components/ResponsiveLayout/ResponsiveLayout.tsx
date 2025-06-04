import React, { useEffect, useState } from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

function getDeviceType(width: number) {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [device, setDevice] = useState(getDeviceType(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDeviceType(window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (device === 'mobile') return <MobileLayout>{children}</MobileLayout>;
  if (device === 'tablet') return <TabletLayout>{children}</TabletLayout>;
  return <DesktopLayout>{children}</DesktopLayout>;
}

function DesktopLayout({ children }: ResponsiveLayoutProps) {
  return <div data-layout='desktop'>{children}</div>;
}

function TabletLayout({ children }: ResponsiveLayoutProps) {
  return <div data-layout='tablet'>{children}</div>;
}

function MobileLayout({ children }: ResponsiveLayoutProps) {
  return <div data-layout='mobile'>{children}</div>;
}
