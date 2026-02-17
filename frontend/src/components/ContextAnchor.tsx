import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RefreshCcw } from 'lucide-react';

interface ContextLog {
  id: number;
  original_thought: string;
  timestamp: string;
}

export const ContextAnchor: React.FC = () => {
  const [thought, setThought] = useState('');
  const [savedLog, setSavedLog] = useState<ContextLog | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought.trim()) return;

    setIsSaving(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/v1/context/anchor', { original_thought: thought });
      setSavedLog(res.data);
      setThought(''); // Clear input
    } catch (err) {
      console.error("Failed to save context", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRecover = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/v1/context/recover');
      setSavedLog(res.data);
    } catch (err) {
      console.error("Failed to recover context", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center space-y-4 mb-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-text">
          Context <span className="text-primary selection:text-white">Anchor</span>
        </h2>
        <p className="text-textSecondary text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
          Save your mental state before a distraction. Recover instantly later.
        </p>
      </motion.div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-primary/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <form onSubmit={handleSave} className="relative bg-surface/50 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/10 transition-all hover:ring-primary/20 hover:bg-surface/80">
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="Where are you right now? What's the very next step?"
            className="w-full bg-transparent border-0 rounded-xl p-6 text-xl md:text-2xl text-text placeholder:text-textSecondary/30 focus:outline-none focus:ring-0 transition-colors resize-none h-48 md:h-64 scrollbar-hide font-medium leading-relaxed"
          />
          <div className="absolute bottom-4 right-4 flex gap-3">
            <button
              type="button"
              onClick={handleRecover}
              className="bg-surfaceHighlight hover:bg-zinc-700 text-textSecondary hover:text-text font-medium py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all border border-white/5"
              title="Recover last saved context"
            >
              <RefreshCcw size={16} /> <span className="hidden sm:inline">Recover</span>
            </button>
            <button
              type="submit"
              disabled={isSaving || !thought}
              className="bg-primary hover:bg-primaryHover text-background font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-glow hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSaving ? "Saving..." : <><Save size={18} /> Anchor</>}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12">
        <AnimatePresence mode="popLayout">
          {savedLog && (
            <motion.div
              key={savedLog.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface/40 backdrop-blur-sm p-8 rounded-2xl border border-primary/20 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]"
            >
              <div className="absolute -top-3 left-8 bg-surface border border-primary/20 text-primary px-3 py-1 text-xs font-bold tracking-widest uppercase rounded-full shadow-lg">
                Resumed Context
              </div>

              <p className="text-2xl text-text font-serif leading-relaxed italic opacity-90">
                "{savedLog.original_thought}"
              </p>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-textSecondary uppercase tracking-wider font-semibold">
                  Timestamp
                </span>
                <span className="text-sm text-textSecondary font-mono">
                  {new Date(savedLog.timestamp).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
