import { useEffect } from "react";
import "../../../assets/home_news.css";

function HomeNews() {
  useEffect(() => {
    const handleScroll = () => {
      const layers = document.querySelectorAll(".parallax-layer");
      const scrollY = window.scrollY;

      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.speed) || 0;
        const scaleSpeed = parseFloat(layer.dataset.scaleSpeed) || 0;

        const translateY = scrollY * speed;
        const scale = 1 + scrollY * scaleSpeed;

        layer.style.transform = `translateY(${translateY}px) scale(${scale})`;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="home_news">
      <div className="home_news-wrapper">
        <div
          className="cloud-island"
          data-speed="0.4"
          data-scale-speed="-0.002"
        ></div>
        <div className="cloud" data-speed="0.4" data-scale-speed="-0.002"></div>
      </div>
      <div className="parallax-content">
        <p className="parallax-content-txt">SCROLL</p>
      </div>
    </section>
  );
}

export default HomeNews;
