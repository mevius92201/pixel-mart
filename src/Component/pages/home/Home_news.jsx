import "../../../assets/home_news.css";
import newsData from "../../../data/newsData.json";
import FadeInSectionEffect from "../../FadeInSectionEffect";
import NewsBox from "./NewsBox";
import { useEffect, useState, memo } from "react";
const layers = [
  {
    speed: 0.3,
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
function HomeNewsParallax() {
  const [transforms, setTransforms] = useState([]);
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
          return renderLayers({
            ...config,
            style: {
              ...config.style,
              transform: transforms[index] || "translateY(0) scale(1)",
            },
            index,
          });
        })}
        <div className="home_news-list">
          {newsData.map((news, index) => {
            console.log(newsData);
            return (
              <FadeInSectionEffect
                key={news.id}
                style={{ position: "relative", delay: `${index} * 0.5s` }}
              >
                <NewsBox {...news} />
              </FadeInSectionEffect>
            );
          })}
        </div>
      </div>
      <div className="parallax-content"></div>
    </section>
  );
}

export default memo(HomeNewsParallax);
