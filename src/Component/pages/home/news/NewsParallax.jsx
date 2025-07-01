import "../../../../assets/news_parallax.css";
import newsData from "../../../../data/newsData.json";
import FadeInSectionEffect from "../../../FadeInSectionEffect";
import NewsBox from "./NewsBox";
import SocialMedia from "./SocialMedia";
import { useEffect, useState, memo } from "react";
const layers = [
  {
    speed: 0.4,
    scaleSpeed: -0.002,
    style: {
      backgroundImage: `url(/src/assets/images/cloud.png)`,
      top: "-10%",
      left: "60%",
    },
  },
];
function renderLayers(config, index) {
  return (
    <div key={index} className="news-parallax-layer" style={config.style}></div>
  );
}
function NewsParallax() {
  const [transforms, setTransforms] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newTransforms = layers.map((_, index) => {
        const { speed, scaleSpeed } = layers[index] || {
          speed: 0,
          scaleSpeed: 0,
        };
        const translateY = Math.floor(scrollY * speed);
        const scale = 1 + scrollY * scaleSpeed;

        return `translateY(${translateY}px) scale(${scale})`;
      });
      setTransforms(newTransforms);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="home_news">
      <div className="home_news-wrapper">
        {layers.map((config, index) => {
          return renderLayers(
            {
              ...config,
              style: {
                ...config.style,
                transform: transforms[index] || "translateY(0) scale(1)",
              },
            },
            index
          );
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
    </section>
  );
}

export default memo(NewsParallax);
