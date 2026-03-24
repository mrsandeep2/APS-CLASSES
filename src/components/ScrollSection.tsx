import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollSectionProps {
  children: ReactNode;
  direction?: "up" | "left" | "right" | "rotate" | "zoom";
}

const variants = {
  up: {
    hidden: { opacity: 0, y: 80, rotateX: 8, scale: 0.95, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: "blur(0px)" },
  },
  left: {
    hidden: { opacity: 0, x: -100, rotateY: 12, scale: 0.92, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, rotateY: 0, scale: 1, filter: "blur(0px)" },
  },
  right: {
    hidden: { opacity: 0, x: 100, rotateY: -12, scale: 0.92, filter: "blur(8px)" },
    visible: { opacity: 1, x: 0, rotateY: 0, scale: 1, filter: "blur(0px)" },
  },
  rotate: {
    hidden: { opacity: 0, y: 60, rotateZ: -3, rotateX: 10, scale: 0.9, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, rotateZ: 0, rotateX: 0, scale: 1, filter: "blur(0px)" },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8, rotateX: 15, filter: "blur(10px)" },
    visible: { opacity: 1, scale: 1, rotateX: 0, filter: "blur(0px)" },
  },
};

const ScrollSection = ({ children, direction = "up" }: ScrollSectionProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={variants[direction]}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    style={{ perspective: 1200, transformStyle: "preserve-3d" }}
  >
    {children}
  </motion.div>
);

export default ScrollSection;
