import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import "../../../assets/all.css";
import "../../../assets/news.css";
import LoadingEffectV2 from "../../LoadingEffectV2";
function NewsArticle() {
  const params = useParams();
  const { id } = params;
  console.log(id);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const getArticle = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://getarticle-3xt565hwvq-uc.a.run.app/${id}`
      );
      console.log(res.data.article);
      setArticle(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) getArticle();
  }, [id]);
  if (loading || !article) return <LoadingEffectV2 />;
  return (
    <section className="news-article-page">
      <div className="news-article-main-wrapper">
        <div className="article-block">
          <div className="article-image">
            {article.banner && (
              <img
                className="article-banner-img"
                src={article.image}
                alt={article.title}
              />
            )}
          </div>
          <div className="article-date">
            {new Date(article.created_at._seconds * 1000).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            )}
          </div>
          <h1 className="article-title">{article.title}</h1>
          <hr
            style={{
              padding: "0 80px",
              border: "0.5px solid #8d8a8a",
              margin: "0 8rem",
            }}
          />
          <p className="article-content">{article.content}</p>
        </div>
      </div>
      <div>
        <LoadingEffectV2 loadingState={loading} />
      </div>
    </section>
  );
}
export default NewsArticle;
