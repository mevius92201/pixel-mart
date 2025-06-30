import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

export default function FadeInSectionEffect({
  children,
  duration = 0.8,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  style,
}) {
  const { ref, inView } = useInView({ triggerOnce, threshold });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) setVisible(true);
  }, [inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay }}
      style={style}
    >
      {children}
    </motion.section>
  );
}
