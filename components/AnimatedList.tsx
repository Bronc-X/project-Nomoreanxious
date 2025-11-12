'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeUp } from '@/lib/animations';

type AnimatedListProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => React.ReactNode;
  className?: string;
};

export default function AnimatedList<T>({
  items,
  getKey,
  renderItem,
  className,
}: AnimatedListProps<T>) {
  return (
    <motion.ul
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className={className}
    >
      {items.map((item) => (
        <motion.li
          key={getKey(item)}
          layout
          initial="initial"
          animate="animate"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.995 }}
          variants={fadeUp}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {renderItem(item)}
        </motion.li>
      ))}
    </motion.ul>
  );
}


