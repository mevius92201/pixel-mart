import BestSeller from "./BestSeller";
import ParallaxStars from "./LandingParallax";

function Home() {
  return (
    <>
      <section className="home">
        <div className="home-main-wrapper">
          <ParallaxStars />
          <BestSeller />
        </div>
      </section>
    </>
  );
}
export default Home;
