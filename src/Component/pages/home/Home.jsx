import BestSeller from "./bestSellers/BestSeller";
import ParallaxStars from "./landing/LandingParallax";
import { useInView } from "react-intersection-observer";
import RopeClimber from "../../RopeClimber";
import NewsParallax from "./news/NewsParallax";
import Map from "./map/MapParallax";
function Home() {
  const { ref, inView } = useInView({ threshold: 1.0 });
  return (
    <>
      <section className="home">
        <div className="home-main-wrapper">
          <RopeClimber
            fixSectionId="second-section"
            fixRatio={0.075}
            spriteImage="/src/assets/images/climb_cat.png"
            scale={0.3}
            leftOffset="40px"
          />
          <ParallaxStars />
          <BestSeller ref={ref} />
          <NewsParallax />
          <Map />
        </div>
      </section>
    </>
  );
}
export default Home;
