"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-6 bg-transparent">
      <div className="flex items-center justify-center gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-4 w-4 rounded-full bg-primary-red"
            initial={{ scale: 0.3, opacity: 0.3, y: 0 }}
            animate={{ scale: 1, opacity: 1, y: -10 }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <motion.p
        className="text-sm font-bold tracking-widest text-primary-red/80 uppercase"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        Loading
      </motion.p>
    </div>
  );
}
