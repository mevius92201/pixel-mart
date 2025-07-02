import { useEffect } from "react";
import "../../../../assets/map.css";
import VideoPlayer from "./VideoPlayer";
import MouseParallaxWrapper from "../../../mouseParallax";
function Map() {
  return (
    <section className="map">
      <div className="map-wrapper">
        <div className="land-wrapper">
          <div className="floating-book"></div>
          <VideoPlayer videoId="D0UZyphq1U8" />
          <div className="floating-island"></div>
        </div>
        <MouseParallaxWrapper strength={10}>
          <img src="/src/assets/images/starssss.png" className="starsss" />
        </MouseParallaxWrapper>
        <div className="cloud-wrapper-down"></div>
      </div>
    </section>
  );
}

export default Map;
