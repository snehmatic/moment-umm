import { useState, useEffect } from 'react';

export interface UserSettings {
    username: string;
    model: string;
    apiKey: string;
    systemPrompt: string;
}

export const defaultSettings: UserSettings = {
    username: '',
    model: 'gemini-2.0-flash',
    apiKey: '',
    systemPrompt: ''
};

export function useSettings() {
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('moment_umm_settings');
        if (stored) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(stored) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        localStorage.setItem('moment_umm_settings', JSON.stringify(updated));
    };

    return {
        settings,
        updateSettings,
        isOpen,
        setIsOpen
    };
}
