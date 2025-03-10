import { Outlet, Link, useNavigate } from "react-router";
import { useParams } from "react-router";
import NewsArticle from "./NewsArticle";

function NewsCategory() {
  const params = useParams();
  console.log(params);
  const { id } = params;
  const navigate = useNavigate();

  function handleNavigate(e, news) {
    e.preventDefault();
    navigate(`/newsCategory/${news.id}`);
  }
  return (
    <>
      news category
      <Link to={`/newsCategory/${news.id}`}></Link>
      <a href="#" onClick={(e) => handleNavigate(e, news)}></a>
      <Outlet />
    </>
  );
}
export default NewsCategory;
