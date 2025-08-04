"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeName = 'light' | 'dark' | 'abel';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (newTheme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // 저장된 테마가 없으면 'abel' 모드를 기본값으로 설정
      return (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'abel') ? savedTheme : 'abel';
    }
    return 'abel'; // 서버 사이드 렌더링 시 기본값
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark', 'abel');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};