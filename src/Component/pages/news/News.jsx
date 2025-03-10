import { Outlet, Link } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;
// const newsCategory = 1;
function News() {
  // const params = useParams();
  // console.log(params);
  // const { id } = params;
  // const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    const getNewsList = async () => {
      try {
        const res = await axios.get(
          `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/articles`
        );
        setNewsList(res.data.articles);

        console.log(res);
      } catch (err) {
        console.error(err);
      }
    };
    getNewsList();
  }, []);

  // let timestamp;
  // const date = new Date(timestamp);
  // const formattedDate = date.toLocaleDateString({
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // });

  // function handleNavigate(e, news) {
  //   e.preventDefault();
  //   navigate(news.id);
  // }
  return (
    <>
      <section className="news-list">
        <div className="news-list-main-wrapper">
          <div className="news-list-group">
            {newsList.map((news) => (
              <div className="news-block" key={news.id}>
                <div className="news-article">
                  <div className="news-list-article-content">
                    <div className="news-title">
                      <div className="news-title-txt">{news.title}</div>
                    </div>
                    <div className="news-description">
                      <div className="news-description-txt">
                        {news.description}
                      </div>
                    </div>
                    <div className="news-info-btn">
                      <Link to={news.id} className="news-article-link">
                        READ MORE {">>"}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="news-date">
                  <div className="news-date-txt">
                    {new Date(news.create_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
            ))}
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
}
export default News;
