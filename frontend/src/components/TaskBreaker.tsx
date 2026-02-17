import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2 } from 'lucide-react';

import type { UserSettings } from '../hooks/useSettings';

interface MicroStep {
  step_number: number;
  description: string;
  estimated_duration: string;
}

interface TaskBreakerProps {
  settings: UserSettings;
}

export const TaskBreaker: React.FC<TaskBreakerProps> = ({ settings }) => {
  const [objective, setObjective] = useState('');
  const [steps, setSteps] = useState<MicroStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim()) return;

    setIsLoading(true);
    setError(null);
    setSteps([]);

    try {
      // Assuming FastAPI runs on port 8000
      const payload = {
        objective,
        model: settings.model,
        api_key: settings.apiKey,
        system_instruction: settings.systemPrompt
      };

      const res = await axios.post('http://127.0.0.1:8000/api/v1/tasks/decompose', payload);
      setSteps(res.data);
    } catch (err) {
      setError("Failed to decompose task. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
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
          Break the <span className="text-primary selection:text-white">Paralysis</span>
        </h2>
        <p className="text-textSecondary text-lg md:text-xl font-light max-w-lg mx-auto leading-relaxed">
          Transform overwhelming tasks into laughable micro-steps.
        </p>
      </motion.div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <form onSubmit={handleSubmit} className="relative bg-surface/50 backdrop-blur-md rounded-2xl p-1.5 shadow-2xl ring-1 ring-white/10 transition-all hover:ring-primary/20 hover:bg-surface/80">
          <textarea
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder={settings.username ? `What's stuck, ${settings.username}? (e.g., 'Clean the kitchen')` : "What's causing the freeze? (e.g., 'Clean the kitchen')"}
            className="w-full bg-transparent border-0 rounded-xl p-6 text-xl md:text-2xl text-text placeholder:text-textSecondary/30 focus:outline-none focus:ring-0 transition-colors resize-none h-48 md:h-64 scrollbar-hide font-medium leading-relaxed"
          />
          <div className="absolute bottom-4 right-4">
            <button
              type="submit"
              disabled={isLoading || !objective}
              className="bg-primary hover:bg-primaryHover text-background font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all shadow-glow hover:shadow-[0_0_30px_-5px_rgba(234,179,8,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <span className="animate-spin text-xl">⏳</span>
              ) : (
                <>
                  Decompose <Sparkles size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-300 text-center bg-red-950/30 p-4 rounded-xl border border-red-500/20 backdrop-blur-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4 mt-12 pb-24">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className="bg-surface/40 backdrop-blur-sm p-5 rounded-xl border border-white/5 flex items-start gap-5 hover:bg-surface/60 hover:border-primary/20 transition-all group duration-300"
            >
              <div className="flex-shrink-0 mt-1 text-textSecondary group-hover:text-primary transition-colors">
                <CheckCircle2 size={22} className="opacity-50 group-hover:opacity-100" />
              </div>
              <div className="flex-1">
                <p className="text-lg text-text/90 group-hover:text-text font-medium leading-relaxed">{step.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-primary/80 uppercase bg-primary/10 px-2 py-1 rounded">
                    Action
                  </span>
                  <span className="text-xs text-textSecondary font-mono flex items-center gap-1">
                    ⏱ {step.estimated_duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
