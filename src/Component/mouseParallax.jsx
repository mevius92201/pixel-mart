import { useEffect, useRef } from "react";

export default function MouseParallaxWrapper({
  children,
  strength = 20, // 移動幅度
  style,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const handleMouseMove = (e) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 2; // -1 ~ 1
      const y = ((e.clientY - top) / height - 0.5) * 2;

      const moveX = x * strength;
      const moveY = y * strength;

      container.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    const reset = () => {
      container.style.transform = `translate(0px, 0px)`;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", reset);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", reset);
    };
  }, [strength]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        transition: "transform 0.1s ease-out",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
