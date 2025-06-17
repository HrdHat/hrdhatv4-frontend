import { createContext, useContext } from 'react';

interface DrawerContextValue {
  open: boolean;
  toggle: () => void;
}

export const GalleryDrawerContext = createContext<DrawerContextValue | null>(
  null
);

export const useGalleryDrawer = () => {
  const ctx = useContext(GalleryDrawerContext);
  if (!ctx) {
    throw new Error('useGalleryDrawer must be used within GalleryLayout');
  }
  return ctx;
};
