import "../../../../assets/map.css";
import VideoPlayer from "./VideoPlayer";
import MouseParallaxWrapper from "../../../mouseParallax";
function Map() {
  return (
    <section className="map">
      <div className="map-wrapper">
        <div className="land-wrapper">
          <div className="floating-book">
            <VideoPlayer videoId="D0UZyphq1U8" />
          </div>
          <div className="floating-island"></div>
        </div>
        <MouseParallaxWrapper strength={20}>
          <img src="/src/assets/images/starssss.png" className="starsss" />
        </MouseParallaxWrapper>
        <div className="cloud-wrapper-down"></div>
      </div>
    </section>
  );
}

export default Map;
