import { useParams } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
const { VITE_APP_API_BASE, VITE_APP_API_PATH } = import.meta.env;
function NewsArticle() {
  const params = useParams();
  const { id } = params;
  console.log(id);
  const [article, setArticle] = useState([]);
  const getArticle = async () => {
    try {
      const res = await axios.get(
        `${VITE_APP_API_BASE}/api/${VITE_APP_API_PATH}/article/${id}`
      );
      console.log(res.data.article);
      setArticle(res.data.article);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getArticle();
  }, [id]);
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}
export default NewsArticle;
