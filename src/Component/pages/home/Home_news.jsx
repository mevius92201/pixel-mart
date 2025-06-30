import "../../../assets/home_news.css";
import newsData from "../../../data/newsData.json";
import FadeInSectionEffect from "../../FadeInSectionEffect";
import NewsBox from "./NewsBox";
function HomeNews() {
  return (
    <section className="home_news">
      <div className="home_news-wrapper">
        <div className="cloud" data-speed="0.4" data-scale-speed="-0.002"></div>
        <div className="home_news-list">
          {newsData.map((news, index) => {
            console.log(newsData);
            return (
              <FadeInSectionEffect
                key={news.id}
                style={{ position: "relative", delay: `${index} * 0.5s` }}
              >
                <NewsBox {...news} />
              </FadeInSectionEffect>
            );
          })}
        </div>
      </div>
      <div className="parallax-content"></div>
    </section>
  );
}

export default HomeNews;
