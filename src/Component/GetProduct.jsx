import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import Icon from "./Icon";
import { getAuth } from "firebase/auth";

// const API_BASE = "https://ec-course-api.hexschool.io/v2";
// const API_PATH = "mevius";
const ADD_CART_URL =
  "https://us-central1-pixel-mart-14008.cloudfunctions.net/addCart";
function GetProduct({ productsData, cartChanged, setCartChanged }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [clickedProduct, setClickedProduct] = useState(null);
  const [cardInfoPosition, setCardInfoPosition] = useState("right");

  const addProductToCart = async (productId) => {
    // try {
    //   setIsButtonDisabled(true);
    // await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
    //   data: {
    //     product_id: productId,
    //     qty: 1,
    //   },
    // });
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("請先登入", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
        return;
      }
      if (isButtonDisabled) return;
      setIsButtonDisabled(true);
      const token = await user.getIdToken();

      await axios.post(
        ADD_CART_URL,
        {
          product_id: productId,
          qty: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("商品已加入購物車", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      setCartChanged(!cartChanged);
      setTimeout(() => setIsButtonDisabled(false), 1000);
    } catch (err) {
      console.error("加入購物車失敗", err);
      toast.error(
        err.response?.data?.message || "加入購物車失敗，請稍後再試試",
        {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        }
      );
    }
  };

  const handleMouseEnter = (e) => {
    const cardRect = e.target.getBoundingClientRect();
    console.log("cardRect", cardRect.right, window.innerWidth);
    if (cardRect.right > window.innerWidth / 1.3) {
      setCardInfoPosition("left");
    } else {
      setCardInfoPosition("right");
    }
  };

  return (
    <div className="product-board">
      {productsData.map((product, index) => (
        <div
          className="product-card"
          key={index}
          onMouseEnter={handleMouseEnter}
        >
          <div className="product-card-body">
            <div className="product-title">{product.name}</div>
            <Icon type="frame" />
            <div
              style={{
                backgroundImage: product?.image?.main
                  ? `url(${product.image.main})`
                  : "none",
              }}
              className="product-main-img"
              alt="..."
            />
            <div className="product-price-display">
              <Icon type="CP" style={{ marginRight: "2px" }} />
              {product.origin_price > product.discount_price ? (
                <>
                  <del
                    style={{
                      color: "rgb(102 102 102)",
                      fontSize: "1.6rem",
                      padding: "0 .4rem 0 0rem",
                    }}
                  >
                    {product.origin_price}
                  </del>
                  <div
                    style={{
                      color: "#000",
                      fontSize: "2rem",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {product.discount_price}
                  </div>
                </>
              ) : (
                <div style={{ color: "#000", fontSize: "2rem" }}>
                  {product.origin_price}
                </div>
              )}
            </div>
            <div className="product-card-body-mask">
              <div className="product-info-hovered">
                <div
                  className="generate-info-btn"
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() =>
                    setClickedProduct((prev) =>
                      prev === product.id ? null : product.id
                    )
                  }
                >
                  <div className="generate-info-icon"></div>
                  查看
                </div>
                <div
                  className={`product-info-board product-info-board-${cardInfoPosition}`}
                  // style={{ display: hoveredProduct === product.id || clickedProduct === product.id
                  //       ? "block"
                  //       : "none",
                  // }}> //他照成畫面閃爍的混亂ㄌ凸
                >
                  <div className="product-info-container">
                    <div className="product-info-card">
                      <div className="product-info-card-content">
                        <div className="product-info">
                          <div className="product-info-title h5">INFO</div>
                          <div className="product-info-product-name">
                            商品：
                            <span style={{ color: "rgb(248 248 248 / 77%)" }}>
                              {product.name}
                            </span>
                          </div>
                          <div className="product-info-product-category">
                            分類：
                            <span style={{ color: "rgb(248 248 248 / 77%)" }}>
                              {product.category}
                            </span>
                          </div>
                          <div className="product-info-product-description">
                            說明：
                            <span style={{ color: "rgb(248 248 248 / 77%)" }}>
                              {product.summary}
                            </span>
                          </div>
                          <div className="product-info-product-content">
                            <div className="product-info-product-content-title">
                              <span>商品描述</span>
                            </div>
                            <div className="product-info-product-content-content">
                              <span>{product.content}</span>
                            </div>
                          </div>
                          <div className="product-info-price-display">
                            售價：
                            <Icon type="CP" style={{ marginRight: "2px" }} />
                            {product.origin_price > product.discount_price ? (
                              <>
                                <del
                                  style={{
                                    fontSize: "1.6rem",
                                    paddingRight: ".3rem",
                                    color: "rgb(248 248 248 / 77%)",
                                  }}
                                >
                                  {product.origin_price}
                                </del>
                                <div>{product.discount_price}</div>
                              </>
                            ) : (
                              <div>{product.discount_price}</div>
                            )}
                          </div>
                          {/* <div className="product-info-product-thumbnail">
                              {(product.imagesUrl.map((item)=><><img src=item alt="..."/></>))} 
                            </div> */}
                        </div>
                      </div>
                      <div className="product-add-cart">
                        <button
                          className={`product-add-cart-btn 
                          ${isButtonDisabled ? "btn-disabled" : ""}`}
                          type="button"
                          onClick={() => addProductToCart(product.id)}
                          disabled={isButtonDisabled}
                        >
                          加入購物車
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
GetProduct.propTypes = {
  productsData: PropTypes.array.isRequired,
  cartChanged: PropTypes.bool.isRequired,
  setCartChanged: PropTypes.func.isRequired,
};

export default GetProduct;
