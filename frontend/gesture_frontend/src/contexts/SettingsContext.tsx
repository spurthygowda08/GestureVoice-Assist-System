import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AppContext = 'Presentation' | 'Browser' | 'Media Player' | 'Custom';
export type FontSize = 'normal' | 'large' | 'extra-large';

interface Settings {
  // Gesture settings
  gestureSensitivity: number;
  contentAwareMode: boolean;
  appContext: AppContext;

  // Voice settings
  microphoneLanguage: string;
  voiceFeedback: boolean;
  soundCues: boolean;
  hapticCues: boolean;

  // Accessibility settings
  fontSize: FontSize;
  highContrastMode: boolean;
  colorBlindMode: boolean;
  theme: 'dark' | 'light';
}

const defaultSettings: Settings = {
  gestureSensitivity: 70,
  contentAwareMode: true,
  appContext: 'Presentation',
  microphoneLanguage: 'en-US',
  voiceFeedback: true,
  soundCues: true,
  hapticCues: false,
  fontSize: 'normal',
  highContrastMode: false,
  colorBlindMode: false,
  theme: 'dark',
};

interface SettingsContextType {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('gesture-voice-settings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('gesture-voice-settings', JSON.stringify(settings));
    
    // Apply theme
    document.documentElement.classList.remove('dark', 'light', 'high-contrast');
    if (settings.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.add(settings.theme);
    }

    // Apply font size
    const fontSizeMap: Record<FontSize, string> = {
      'normal': '16px',
      'large': '18px',
      'extra-large': '20px',
    };
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize];
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
