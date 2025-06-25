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
        <div>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-content">{article.content}</p>
        </div>
      </div>
    </section>
  );
}
export default NewsArticle;
