import { useEffect } from "react";
import "../../../assets/best_sellers.css";

const BestSeller = () => {
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
    <section className="best-sellers">
      <div className="best-sellers-wrapper">
        <div className="stone-group">
          <div className="stone01">
            <img
              src="src/assets/images/001.png"
              alt="Stone 1"
              style={{
                width: "200px",
                height: "200px",
                left: "108px",
                position: "absolute",
                top: "117px",
              }}
            />
          </div>
          <div className="stone02">
            <img
              src="src/assets/images/001.png"
              alt="Stone 1"
              style={{
                width: "200px",
                height: "200px",
                left: "108px",
                position: "absolute",
                top: "117px",
              }}
            />
          </div>
          <div className="stone03">
            <img
              src="src/assets/images/001.png"
              alt="Stone 1"
              style={{
                width: "200px",
                height: "200px",
                left: "108px",
                position: "absolute",
                top: "117px",
              }}
            />
          </div>
        </div>
      </div>
      <div className="best-sellers-content">
        <p className="parallax-content-txt">SCROLL</p>
      </div>
    </section>
  );
};

export default BestSeller;
