import { useEffect } from "react";
import "../../../assets/parallax.css";
import starsYellow from "../../../assets/images/stars_yellow.png";
import starsWhite from "../../../assets/images/stars_white.png";
import island from "../../../assets/images/landing_island.png";
function LandingParallax() {
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
    <section className="parallax-landing">
      <div className="parallax-wrapper">
        <div
          className="parallax-layer"
          data-speed="0.2"
          data-scale-speed="-0.0005"
          style={{
            backgroundImage: `url(${starsYellow})`,
            top: "-3%",
            left: "28%",
          }}
        ></div>
        <div
          className="parallax-layer"
          data-speed="0.4"
          data-scale-speed="-0.002"
          style={{ backgroundImage: `url(${starsWhite})`, top: "5%" }}
        ></div>
        <div className="parallax-layer" data-speed="1" data-scale-speed="0.003">
          <div
            className="island-layer"
            style={{
              backgroundImage: `url(${island})`,
              backgroundSize: "cover",
              height: "500px",
              width: "450px",
              top: "30%",
              left: "55%",
              position: "absolute",
            }}
          ></div>
        </div>
      </div>
      <div className="parallax-content">
        <p className="parallax-content-txt">SCROLL</p>
      </div>
    </section>
  );
}

export default LandingParallax;
