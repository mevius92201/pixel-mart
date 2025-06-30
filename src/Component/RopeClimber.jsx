import { useEffect, useRef, useState } from "react";
import "../assets/rope_climb.css";

function RopeClimber({
  fixSectionId = "second-section",
  fixRatio = 0.075,
  spriteImage = "/src/assets/images/climb_cat.png",
  scale = 0.3,
  leftOffset = "40px",
  topOffset = "0px",
}) {
  const climberRef = useRef(null);
  const [isClimbing, setIsClimbing] = useState(false);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const climber = climberRef.current;
    const section = document.getElementById(fixSectionId);
    if (!climber) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (!section) {
        climber.style.transform = `translateY(${scrollY}px) scale(${scale})`;
        return;
      }

      const navbarHeight = 69.4;
      const climberHeight = 512 * scale;
      const fixY = section.offsetTop - window.innerHeight * fixRatio; //第二屏距離整頁頂端的位置，讓角色停在螢幕高度的7.5%處
      // const sectionTop = secondSection.offsetTop;
      const sectionTopInViewport = section.getBoundingClientRect().top; //第二屏的頂部，相對於視窗頂部的位置

      const climberBottomY = scrollY + climberHeight;

      console.log({
        scrollY,
        // sectionTop,
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

      climber.style.position = "absolute";
      climber.style.top = topOffset;
      climber.style.left = leftOffset;
      climber.style.backgroundImage = `url(${spriteImage})`;

      if (climberBottomY < fixY) {
        // 第一段：角色往下爬
        climber.style.transform = `translateY(${scrollY}px) scale(${scale})`;
      } else if (sectionTopInViewport > navbarHeight) {
        // 第二段：角色在 fixY 停住，慢慢被畫面推上去
        climber.style.transform = `translateY(${fixY}px) scale(${scale})`;
        setIsClimbing(false);
      } else {
        // 第三段：第二屏頂部碰到 navbar，繼續往下爬
        const offset = fixY + (scrollY - (section.offsetTop - navbarHeight));
        climber.style.transform = `translateY(${offset}px) scale(${scale})`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); //初始化時執行
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout.current);
    };
  }, [fixSectionId, fixRatio, leftOffset, spriteImage, scale]);

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
