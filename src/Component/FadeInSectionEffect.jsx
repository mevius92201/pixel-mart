import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useState } from "react";

export default function FadeInSectionEffect({
  children,
  duration = 0.8,
  delay = 0,
  threshold = 0.1, //進入視窗口比例已觸發動畫
  triggerOnce = true,
  style,
  direction = "up",
  stagger = false, //子元素逐一延遲進場
  staggerDelay = 0.2,
  effect = "slide",
}) {
  const { ref, inView } = useInView({ triggerOnce, threshold });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (inView) setVisible(true);
  }, [inView]);

  let initial = {};
  switch (direction) {
    case "left":
      initial = { x: -50 };
      break;
    case "right":
      initial = { x: 100 };
      break;
    case "up":
    default:
      initial = { y: 100 };
      break;
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger ? staggerDelay : 0,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      ...initial,
      ...(effect === "zoom" ? { scale: 0.8 } : {}),
      ...(effect === "spin" ? { rotate: -30 } : {}),
    },
    visible: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 },
  };

  return (
    <motion.section
      ref={ref}
      initial={stagger ? "hidden" : childVariants.hidden}
      animate={visible ? (stagger ? "visible" : childVariants.visible) : {}}
      variants={stagger ? containerVariants : undefined}
      transition={{ duration, delay }}
      style={style}
    >
      {stagger
        ? React.Children.map(children, (child, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              transition={{ duration: duration }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.section>
  );
}
