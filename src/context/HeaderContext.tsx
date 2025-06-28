import React, { createContext, useContext, useState } from 'react';

interface HeaderContextType {
  isHeaderDark: boolean;
  setIsHeaderDark: (dark: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isHeaderDark, setIsHeaderDark] = useState(false);

  return (
    <HeaderContext.Provider value={{ isHeaderDark, setIsHeaderDark }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = (): HeaderContextType => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}; 