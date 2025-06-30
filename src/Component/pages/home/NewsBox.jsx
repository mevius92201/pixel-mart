import { Link } from "react-router";

export default function NewsBox({ id, title, image }) {
  return (
    <Link to={`/news/${id}`}>
      <div className="news-card-box">
        <img src={image} alt={title} />
        <p className="news-box-title">{title}</p>
      </div>
    </Link>
  );
}
