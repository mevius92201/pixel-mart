import PropTypes from "prop-types";
import { Link } from "react-router";
import Icon from "../../Icon";
import "../../../assets/news.css";
function NewsCard({ news, isPinned = false }) {
  return (
    <div className={`news-block ${isPinned ? "pinned" : ""}`} key={news.id}>
      <div className="news-article">
        <div className="news-list-article-content">
          <div className="news-article-left">
            <div className="news-title">
              <span className="news-category-tag">{news.category}</span>
              {news.title}
            </div>
            <div className="news-summary">
              <div className="news-summary-txt">{news.summary}</div>
            </div>

            <div className="news-info-btn">
              <Link to={news.id} className="news-article-link">
                READ MORE {">>"}
              </Link>
            </div>
          </div>
          <div className="news-article-right">
            <div className="news-banner">
              <div className="news-banner-frame"></div>
              {news.banner && (
                <img
                  className="news-banner-img"
                  src={news.banner}
                  alt={news.title}
                />
              )}
            </div>
          </div>
        </div>
        {isPinned && (
          <div className="pinned-icon">
            <Icon type="pin" />
          </div>
        )}
      </div>
      <div className="news-date">
        <div className="news-date-txt">
          {new Date(news.created_at._seconds * 1000).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}
        </div>
      </div>
    </div>
  );
}

NewsCard.propTypes = {
  news: PropTypes.object.isRequired,
  isPinned: PropTypes.bool,
};
export default NewsCard;
