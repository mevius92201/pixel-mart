import { memo, useEffect, useState } from "react";
import "../../../../assets/parallax.css";
import starsYellow from "../../../../assets/images/stars_yellow.png";
import starsWhite from "../../../../assets/images/stars_white.png";
import starsPink from "../../../../assets/images/stars_pink.png";
import island from "../../../../assets/images/landing_island.png";
import starsLittle from "../../../../assets/images/stars_little.png";

const layers = [
  {
    speed: 0.2,
    scaleSpeed: -0.0005,
    style: {
      backgroundImage: `url(${starsYellow})`,
      top: "-5%",
      left: "5rem",
      width: "153.6rem",
      height: "102.4rem",
    },
  },
  {
    speed: 0.4,
    scaleSpeed: -0.002,
    style: {
      backgroundImage: `url(${starsWhite})`,
      top: "-11%",
      left: "20%",
      width: "153.6rem",
      height: "102.4rem",
    },
  },
  {
    speed: 0.4,
    scaleSpeed: -0.002,
    style: {
      backgroundImage: `url(${starsPink})`,
      top: "-5%",
      left: "19%",
      width: "153.6rem",
      height: "102.4rem",
    },
  },
  {
    speed: 0.4,
    scaleSpeed: -0.002,
    style: {
      backgroundImage: `url(${starsLittle})`,
      width: "153.6rem",
      height: "102.4rem",
    },
  },
  {
    speed: 1,
    scaleSpeed: 0.003,
    isIsland: true,
  },
];

function renderLayer(config, index) {
  return (
    <div key={index} className="parallax-layer" style={config.style}>
      {config.isIsland && (
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
      )}
    </div>
  );
}

function LandingParallax() {
  const [transforms, setTransforms] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      const nextTransforms = layers.map((_, index) => {
        const { speed, scaleSpeed } = layers[index] || {
          speed: 0,
          scaleSpeed: 0,
        };

        const translateY = Math.floor(scrollY * speed);
        const scale = 1 + scrollY * scaleSpeed;

        return `translateY(${translateY}px) scale(${scale})`;
      });

      setTransforms(nextTransforms);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="parallax-landing">
      <div className="parallax-wrapper">
        {layers.map((config, index) => {
          return renderLayer(
            {
              ...config,
              style: { ...config.style, transform: transforms[index] },
            },
            index
          );
        })}
      </div>
      <div className="parallax-content">
        <p className="parallax-content-txt">SCROLL</p>
      </div>
    </section>
  );
}

export default memo(LandingParallax);
