import "../../../../assets/map.css";
function VideoPlayer({ videoId }) {
  return (
    <div className="youtube-wrapper">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default VideoPlayer;
