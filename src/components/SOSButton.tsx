import { motion } from "framer-motion";

interface SOSButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SOSButton = ({ onClick, disabled }: SOSButtonProps) => {
  return (
    <div className="relative flex items-center justify-center">
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        className="relative z-10 w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-primary text-primary-foreground font-black text-4xl sm:text-5xl tracking-wider shadow-[0_0_18px_rgba(255,0,0,0.55),0_0_45px_rgba(255,0,0,0.25)] ring-2 ring-primary/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none"
      >
        SOS
      </motion.button>
    </div>
  );
};

export default SOSButton;
