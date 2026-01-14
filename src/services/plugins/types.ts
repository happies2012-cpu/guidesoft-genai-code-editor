export interface ThemeDefinition {
    colors: Record<string, string>;
    tokenColors: Array<{
        scope: string | string[];
        settings: {
            foreground?: string;
            fontStyle?: string;
        };
    }>;
}

export interface PluginManifest {
    id: string;
    version: string;
    name: string;
    description: string;
    author: string;
    type: 'theme' | 'functional' | 'language';
    theme?: ThemeDefinition;
    repository?: string;
}

export interface InstalledPlugin extends PluginManifest {
    installDate: string;
    isEnabled: boolean;
}
