import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Key, Cpu, MessageSquare } from 'lucide-react';
import type { UserSettings } from '../hooks/useSettings';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onUpdate: (s: Partial<UserSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
    // Local state for the form to avoid constant re-renders/writes to localStorage on every keystroke
    // We only save on "Save" or blur? Let's save on specific actions or just keep it simple and bind directly but maybe debounced.
    // For simplicity, let's bind directly for now, or use a local copy and save on close/save button.
    // Actually, "Save" button is better UI for settings.

    // STARTING WITH DIRECT BINDING FOR INSTANT FEEDBACK UX, 
    // but typically explicit save is safer for API keys.
    // Let's do: Local state -> Save button -> Persist.

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]">

                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surfaceHighlight/30">
                                <h2 className="text-xl font-bold text-text flex items-center gap-2">
                                    Settings
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-textSecondary hover:text-text bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                                {/* Username */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                                        <User size={16} className="text-primary" /> Username / Nickname
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.username}
                                        onChange={(e) => onUpdate({ username: e.target.value })}
                                        placeholder="e.g., Captain, Boss, Friend"
                                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                                    />
                                </div>

                                {/* Model */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                                        <Cpu size={16} className="text-primary" /> AI Model
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={settings.model}
                                            onChange={(e) => onUpdate({ model: e.target.value })}
                                            className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="gemini-2.0-flash">Gemini 2.0 Flash (Default)</option>
                                            <option value="gemini-pro">Gemini Pro</option>
                                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                                            {/* Add more as needed, or make it a text input if they want total freedom */}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-textSecondary">
                                            ▼
                                        </div>
                                    </div>
                                    <p className="text-xs text-textSecondary/50">
                                        Select the model to use for task decomposition.
                                    </p>
                                </div>

                                {/* API Key */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                                        <Key size={16} className="text-primary" /> Custom API Key
                                    </label>
                                    <input
                                        type="password"
                                        value={settings.apiKey}
                                        onChange={(e) => onUpdate({ apiKey: e.target.value })}
                                        placeholder="Overrides the default server key"
                                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm placeholder:font-sans"
                                    />
                                    <p className="text-xs text-textSecondary/50">
                                        Your key is stored locally in your browser and sent directly to the server.
                                    </p>
                                </div>

                                {/* System Prompt */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                                        <MessageSquare size={16} className="text-primary" /> Custom System Persona
                                    </label>
                                    <textarea
                                        value={settings.systemPrompt}
                                        onChange={(e) => onUpdate({ systemPrompt: e.target.value })}
                                        placeholder="You are a helpful assistant..."
                                        className="w-full bg-background/50 border border-white/10 rounded-lg px-4 py-3 text-text focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all min-h-[120px] resize-y"
                                    />
                                    <p className="text-xs text-textSecondary/50">
                                        Define how the AI should behave. Use this to change the tone or coaching style.
                                    </p>
                                </div>

                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-white/5 bg-surfaceHighlight/10 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="bg-primary hover:bg-primaryHover text-background font-bold py-2.5 px-6 rounded-lg flex items-center gap-2 transition-all shadow-glow hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.4)]"
                                >
                                    <Save size={18} /> Done
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
