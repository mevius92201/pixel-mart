import BestSeller from "./BestSeller";
import ParallaxStars from "./LandingParallax";
import { useInView } from "react-intersection-observer";
import RopeClimber from "../../RopeClimber";
import HomeNews from "./home_news";
import Map from "./Map";
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
          <HomeNews />
          <Map />
        </div>
      </section>
    </>
  );
}
export default Home;
