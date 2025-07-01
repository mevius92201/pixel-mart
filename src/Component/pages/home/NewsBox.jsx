import { Link } from "react-router";

export default function NewsBox({ id, title, image, index }) {
  return (
    <Link to={`/news/${id}`}>
      <div className={`news-card-box floatingStone-${index + 1}`}>
        <img src={image} alt={title} />
        <div className="news-box-title ">{title}</div>
      </div>
    </Link>
  );
}
