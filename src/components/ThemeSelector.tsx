import React, { useState } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { ThemeMode, CustomTheme } from '../types/theme';

interface ThemeSelectorProps {
  currentMode: ThemeMode;
  onThemeChange: (mode: ThemeMode, customTheme?: CustomTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentMode,
  onThemeChange,
}) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    background: '#ffffff',
    text: '#1f2937',
    primary: '#2563eb',
    secondary: '#64748b',
    accent: '#3b82f6',
  });

  return (
    <div className="relative">
      <div className="flex gap-2">
        <button
          onClick={() => onThemeChange('light')}
          className={`p-2 rounded-lg ${
            currentMode === 'light' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Light Mode"
        >
          <Sun size={20} />
        </button>
        <button
          onClick={() => onThemeChange('dark')}
          className={`p-2 rounded-lg ${
            currentMode === 'dark' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Dark Mode"
        >
          <Moon size={20} />
        </button>
        <button
          onClick={() => setShowCustomizer(!showCustomizer)}
          className={`p-2 rounded-lg ${
            currentMode === 'custom' ? 'bg-gray-200' : 'hover:bg-gray-100'
          }`}
          title="Custom Theme"
        >
          <Palette size={20} />
        </button>
      </div>

      {showCustomizer && (
        <div className="absolute right-0 mt-2 p-4 bg-white rounded-lg shadow-lg w-64">
          <h3 className="font-semibold mb-3">Custom Theme</h3>
          <div className="space-y-3">
            {Object.entries(customTheme).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm mb-1 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </label>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => {
                    const newTheme = { ...customTheme, [key]: e.target.value };
                    setCustomTheme(newTheme);
                    onThemeChange('custom', newTheme);
                  }}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};