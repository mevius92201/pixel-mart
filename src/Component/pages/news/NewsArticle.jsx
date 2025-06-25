import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
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
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}
export default NewsArticle;
