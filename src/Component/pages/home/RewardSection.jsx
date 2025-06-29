import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import RewardList from "./RewardList";

export default function RewardSection() {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.1 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) setVisible(true);
  }, [inView]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9 }}
    >
      <RewardList />
    </motion.section>
  );
}
