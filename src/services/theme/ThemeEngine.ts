import { create } from 'zustand';

export interface ThemeColors {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    border: string;
}

const DRACULA: ThemeColors = {
    background: '#282a36',
    foreground: '#f8f8f2',
    primary: '#bd93f9',
    secondary: '#ff79c6',
    border: '#44475a'
};

export const useThemeEngine = create((set) => ({
    currentTheme: DRACULA,
    applyTheme: (theme: ThemeColors) => {
        const root = document.documentElement;
        root.style.setProperty('--bg-primary', theme.background);
        root.style.setProperty('--text-primary', theme.foreground);
        root.style.setProperty('--border-color', theme.border);
        set({ currentTheme: theme });
    }
}));
