function SocialMedia() {
  const socialMedia = [
    {
      name: "facebook",
      href: "https://facebook.com",
      img: "/src/assets/icons/social_media_fb.png",
    },
    {
      name: "instagram",
      href: "https://instagram.com",
      img: "/src/assets/icons/social_media_ig.png",
    },
    {
      name: "X",
      href: "https://X.com",
      img: "/src/assets/icons/social_media_x.png",
    },
  ];
  return (
    <div className="follow-social-medias">
      <p>追蹤以獲得最新資訊</p>
      <div className="social-media-group">
        {socialMedia.map((item, index) => {
          return (
            <a
              key={index}
              className="news-social-media-icons"
              href={item.href}
              target="_blank"
            >
              <img src={item.img} alt={item.name} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
export default SocialMedia;
