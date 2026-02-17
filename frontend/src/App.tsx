import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskBreaker } from './components/TaskBreaker';
import { ContextAnchor } from './components/ContextAnchor';
import { SettingsModal } from './components/SettingsModal';
import { useSettings } from './hooks/useSettings';
import { LayoutDashboard, Anchor, Settings } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState<'breaker' | 'anchor'>('breaker');
  const { settings, updateSettings, isOpen: isSettingsOpen, setIsOpen: setIsSettingsOpen } = useSettings();

  return (
    <div className="min-h-screen bg-background text-text font-sans flex flex-col items-center relative overflow-hidden selection:bg-primary/20 selection:text-primary">

      {/* Background Ambience - subtle gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] opacity-30 mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-3xl flex flex-col min-h-screen px-6 py-12 md:py-20">

        {/* Header - Minimal */}
        <header className="mb-12 md:mb-16 flex items-center justify-between relative">
          <div className="flex-1"></div> {/* Spacer for centering if needed, or just justify-between */}

          <div className="text-center">
            <h1 className="text-sm font-semibold tracking-[0.2em] uppercase text-textSecondary opacity-80">
              moment-umm
            </h1>
            {settings.username && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-primary/80 mt-1 font-medium"
              >
                Hello, {settings.username}
              </motion.p>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-textSecondary hover:text-text hover:bg-white/5 rounded-full transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {activeTab === 'breaker' ? (
                <TaskBreaker settings={settings} />
              ) : (
                <ContextAnchor />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Navigation Island */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <nav className="flex items-center gap-1 p-1.5 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50 ring-1 ring-white/5">
            <button
              onClick={() => setActiveTab('breaker')}
              className={clsx(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === 'breaker'
                  ? "text-background"
                  : "text-textSecondary hover:text-text hover:bg-white/5"
              )}
            >
              {activeTab === 'breaker' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_-3px_rgba(234,179,8,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <LayoutDashboard size={16} strokeWidth={2.5} />
                <span>Breaker</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('anchor')}
              className={clsx(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === 'anchor'
                  ? "text-background"
                  : "text-textSecondary hover:text-text hover:bg-white/5"
              )}
            >
              {activeTab === 'anchor' && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full shadow-[0_0_15px_-3px_rgba(234,179,8,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Anchor size={16} strokeWidth={2.5} />
                <span>Anchor</span>
              </span>
            </button>
          </nav>
        </div>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdate={updateSettings}
        />

      </div>
    </div>
  );
}

export default App;
