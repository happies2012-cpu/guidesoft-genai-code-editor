// Material Design 3 Color System
export const md3Colors = {
    primary: {
        main: '#6750A4',
        light: '#7F67BE',
        dark: '#4F378B',
        container: '#EADDFF',
        onContainer: '#21005D',
    },
    secondary: {
        main: '#625B71',
        light: '#7A7289',
        dark: '#4A4458',
        container: '#E8DEF8',
        onContainer: '#1D192B',
    },
    tertiary: {
        main: '#7D5260',
        light: '#986977',
        dark: '#633B48',
        container: '#FFD8E4',
        onContainer: '#31111D',
    },
    error: {
        main: '#B3261E',
        light: '#DC362E',
        dark: '#8C1D18',
        container: '#F9DEDC',
        onContainer: '#410E0B',
    },
    background: {
        main: '#FFFBFE',
        dark: '#1C1B1F',
    },
    surface: {
        main: '#FFFBFE',
        variant: '#E7E0EC',
        dark: '#1C1B1F',
        darkVariant: '#49454F',
    },
    outline: {
        main: '#79747E',
        variant: '#CAC4D0',
    },
};

// Apply MD3 theme to document
export const applyMD3Theme = (isDark = true) => {
    const root = document.documentElement;

    if (isDark) {
        root.style.setProperty('--md3-primary', md3Colors.primary.light);
        root.style.setProperty('--md3-background', md3Colors.background.dark);
        root.style.setProperty('--md3-surface', md3Colors.surface.dark);
        root.style.setProperty('--md3-surface-variant', md3Colors.surface.darkVariant);
    } else {
        root.style.setProperty('--md3-primary', md3Colors.primary.main);
        root.style.setProperty('--md3-background', md3Colors.background.main);
        root.style.setProperty('--md3-surface', md3Colors.surface.main);
        root.style.setProperty('--md3-surface-variant', md3Colors.surface.variant);
    }
};

// Smooth transitions
export const md3Transitions = {
    fast: '100ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    medium: '250ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
    emphasized: '500ms cubic-bezier(0.2, 0.0, 0, 1)',
};
