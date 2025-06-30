export default function NewsBox({ title, image }) {
  return (
    <div className="news-card-box">
      <img src={image} alt={title} />
      <p className="news-box-title">{title}</p>
    </div>
  );
}
