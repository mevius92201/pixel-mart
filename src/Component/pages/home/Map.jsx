import { useEffect } from "react";
import "../../../assets/map.css";

function Map() {
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
    <section className="map">
      <div className="map-wrapper">
        <div className="land"></div>
        <div></div>
        <div className="parallax-layer" data-speed="1" data-scale-speed="0.003">
          <div></div>
        </div>
      </div>
      <div className="parallax-content">
        <p className="parallax-content-txt">SCROLL</p>
      </div>
    </section>
  );
}

export default Map;
