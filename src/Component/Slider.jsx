import Slider from "react-slick";
import "../assets/sliders.css";
const Sliders = ({ sliderData }) => {
  if (!Array.isArray(sliderData) || sliderData.length <= 0) {
    return null;
  }
  const settings = {
    className: "center",
    dots: true,
    centerMode: true,
    infinite: true,
    focusOnSelect: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true,
    speed: 500,
    responsive: [
      {
        breakpoints: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
    ],
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {sliderData.map((item, index) => {
          return (
            <div key={index}>
              <img
                src={item.image}
                alt={item.alt}
                key={index}
                className="image"
                style={{
                  objectFit: "contain",
                  width: "1076px",
                  height: "615px",
                }}
              />
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Sliders;
