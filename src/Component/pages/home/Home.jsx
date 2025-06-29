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
          <RopeClimber isActive={inView} />
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
