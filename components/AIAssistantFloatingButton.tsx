'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistantFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/assistant">
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.button
          className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0b3d2e] via-[#0a3427] to-[#06261c] px-6 py-4 text-white shadow-lg hover:shadow-xl transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-lg font-semibold">AI 助理</span>
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                点击进入
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>
    </Link>
  );
}

