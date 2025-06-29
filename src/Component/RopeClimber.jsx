import { useEffect, useRef, useState } from "react";
import "../assets/rope_climb.css";

function RopeClimber() {
  const climberRef = useRef(null);
  const [isClimbing, setIsClimbing] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const secondSection = document.getElementById("second-section");
      if (!secondSection || !climberRef.current) return;

      const navbarHeight = 69.4;
      const climberHeight = 512 * 0.3;
      const fixY = 928;

      const sectionTop = secondSection.offsetTop;
      const sectionTopInViewport = secondSection.getBoundingClientRect().top;

      console.log({
        scrollY,
        sectionTop,
        navbarHeight,
        fixY,
        climberHeight,
        state:
          scrollY + climberHeight < fixY
            ? "爬動階段"
            : sectionTopInViewport > navbarHeight
            ? "停住階段"
            : "繼續爬動",
      });
      // 控制 sprite 動畫
      if (scrollY !== lastScrollY.current) {
        clearTimeout(scrollTimeout.current);
        setIsClimbing(true);
        scrollTimeout.current = setTimeout(() => {
          setIsClimbing(false);
        }, 200);
        lastScrollY.current = scrollY;
      }

      const climber = climberRef.current;

      const climberBottomY = scrollY + climberHeight;

      if (climberBottomY < fixY) {
        // 第一段：角色往下爬
        climber.style.position = "absolute";
        climber.style.top = "0";
        climber.style.left = "40px";
        climber.style.transform = `translateY(${scrollY}px) scale(0.3)`;
        // } else if (sectionTopInViewport > navbarHeight) {
        //   // 第二段：角色在 fixY 停住，慢慢被畫面推上去
        //   climber.style.position = "absolute";
        //   climber.style.top = "0";
        //   climber.style.left = "40px";
        //   climber.style.transform = `translateY(${fixY}px) scale(0.3)`;
        //   setIsClimbing(false);
      } else {
        // 第三段：第二屏頂部碰到 navbar，繼續往下爬
        const offset = fixY + (scrollY - (sectionTop - navbarHeight));
        climber.style.position = "absolute";
        climber.style.top = "0";
        climber.style.left = "40px";
        climber.style.transform = `translateY(${offset}px) scale(0.3)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, []);

  return (
    <>
      <div className="rope-container">
        <div className="rope-line"></div>
      </div>
      <div
        ref={climberRef}
        className={`climber-sprite ${isClimbing ? "climbing" : ""}`}
      ></div>
    </>
  );
}

export default RopeClimber;
