import { AnimatePresence, motion } from 'framer-motion';

interface SectionLoaderProps {
  loading: boolean;
  label?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ loading, label = 'Loading section' }) => {
  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          key="section-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-3xl border border-border/70 bg-background/80 shadow-xl backdrop-blur-md"
        >
          <motion.span
            className="absolute left-0 top-0 h-1 w-full origin-left bg-gradient-to-r from-primary via-primary/40 to-primary"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], repeat: Infinity }}
          />
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <motion.span
                className="flex h-2.5 w-2.5 rounded-full bg-primary"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.span
                className="flex h-2.5 w-2.5 rounded-full bg-primary/80"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />
              <motion.span
                className="flex h-2.5 w-2.5 rounded-full bg-primary/60"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              />
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground/80">{label}</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default SectionLoader;
