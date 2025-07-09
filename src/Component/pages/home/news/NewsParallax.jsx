import "../../../../assets/news_parallax.css";
import newsData from "../../../../data/newsData.json";
import FadeInSectionEffect from "../../../FadeInSectionEffect";
import NewsBox from "./NewsBox";
import SocialMedia from "./SocialMedia";
import { useEffect, useState, memo } from "react";
const layers = [
  {
    speed: 0.4,
    scaleSpeed: 0.001,
    style: {
      backgroundImage: `url(/src/assets/images/cloud.png)`,
      top: "-50%",
      left: "25%",
      width: "100rem",
      height: "40rem",
    },
  },
];
function renderLayers(scrollY, index) {
  const { speed = 0, scaleSpeed = 0, style = {} } = layers[index] || {};
  const translateY = Math.floor(scrollY * speed);
  const scale = 1 + scrollY * scaleSpeed;
  const transform = `translateY(${translateY}px) scale(${scale})`;
  return (
    <div
      key={index}
      className="news-parallax-layer"
      style={{ ...style, transform }}
    ></div>
  );
}
function NewsParallax() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="home_news">
      <div className="home_news-wrapper">
        {layers.map((_, index) => {
          return renderLayers(scrollY, index);
        })}
        <div className="home_news-list">
          {newsData.map((news, index) => {
            console.log(newsData);
            return (
              <FadeInSectionEffect
                key={news.id}
                style={{ position: "relative" }}
                delay={index * 0.2}
                direction="left"
                duration={1.2}
                threshold={0.3}
                stagger
                staggerDelay={0.3}
              >
                <NewsBox {...news} index={index} />
              </FadeInSectionEffect>
            );
          })}
        </div>
        <FadeInSectionEffect direction="up">
          <SocialMedia />
        </FadeInSectionEffect>
      </div>
      <div className="cloud-wrapper-up"></div>
    </section>
  );
}

export default memo(NewsParallax);
