import { useState, useEffect } from "react";
import axios from "axios";
import Icon from "./Icon";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth";
import useAuthStore from "./store/auth-store";
import useDebouncedUpdate from "../Hook/useDebouncedUpdate";
import { checkout } from "../utils/firebaseApi";
import { useShallow } from "zustand/shallow";

// const API_BASE = "https://ec-course-api.hexschool.io/v2";
// const API_PATH = "mevius";
const GET_CART_URL =
  "https://us-central1-pixel-mart-14008.cloudfunctions.net/getCart";
const REMOVE_CART_PRODUCT_URL =
  "https://us-central1-pixel-mart-14008.cloudfunctions.net/removeCartProduct";
const CLEAR_CART_URL =
  "https://us-central1-pixel-mart-14008.cloudfunctions.net/clearCart";
const ADJUST_CART_PRODUCT_QTY_URL =
  "https://us-central1-pixel-mart-14008.cloudfunctions.net/updateCartItem";
function GetCart({
  cartChanged,
  setCartChanged,
  cartProductData,
  setCartProductData,
  setLoading,
}) {
  const [showDetailProducts, setShowDetailProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const authReady = useAuthStore((state) => state.authReady);
  const { user, setUser } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
      cart: state.cart,
      setUser: state.setUser,
    }))
  );
  useEffect(() => {
    const getCartProducts = async () => {
      try {
        // const res = await axios.get(GET_CART_URL);
        // console.log(res.data.data.carts);
        // setCartProductData(res.data.data.carts);
        // setProductQuantity(res.data.data.carts.map((product) => product.qty));
        setLoading(true);
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

        const token = await user.getIdToken();

        const res = await axios.get(GET_CART_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const cartData = res.data.data;
        console.log(cartData);
        setCartProductData(cartData.carts);
        setProductQuantity(cartData.carts.map((item) => item.qty));
      } catch (err) {
        toast.error(err?.response?.data?.message?.[0] || "產品獲取失敗", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
      } finally {
        setLoading(false);
      }
    };
    if (authReady) {
      getCartProducts();
    }
  }, [cartChanged, authReady]);

  const removeCartProduct = async (id) => {
    try {
      setLoading(true);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("請先登入", {
          position: "top-center",
          autoClose: 1500,
          theme: "colored",
        });
        return;
      }

      const token = await user.getIdToken();

      await axios.delete(`${REMOVE_CART_PRODUCT_URL}?product_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!toast.isActive("remove-toast")) {
        toast.success("商品已刪除", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
      }
      setCartChanged((prev) => !prev);
    } catch (err) {
      toast.error(err.response.data.message, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
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
      const token = await user.getIdToken();
      await axios.delete(CLEAR_CART_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("購物車已清空", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      setCartChanged(!cartChanged);
    } catch (err) {
      toast.error(err?.response?.data?.message || "請重新嘗試一遍", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasProductDetailShow = (productId) => {
    setShowDetailProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  function calTotalPrice() {
    return cartProductData.reduce((acc, cur) => acc + cur.final_total, 0);
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const res = await checkout();

      toast.success("付款成功", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      console.log("res.data!!", res.data.remaining_balance);
      setCartChanged((prev) => !prev);
      setUser({
        ...user,
        balance: res.data.remaining_balance,
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "付款失敗", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };
  // const updateProductQuantity = async (id, index, value) => {
  //   const current = productQuantity[index];
  //   const updateQuantity = current + value;

  //   if (updateQuantity > 99 || updateQuantity < 1) {
  //     toast.error("數量超出限制", {
  //       position: "top-center",
  //       autoClose: 1500,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: false,
  //       theme: "colored",
  //     });
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const auth = getAuth();
  //     const user = auth.currentUser;
  //     if (!user) {
  //       toast.error("請先登入", {
  //         position: "top-center",
  //         autoClose: 1500,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: false,
  //         draggable: false,
  //         theme: "colored",
  //       });
  //       return;
  //     }

  //     const token = await user.getIdToken();
  //     await axios.put(
  //       ADJUST_CART_PRODUCT_QTY_URL,
  //       {
  //         data: {
  //           product_id: id,
  //           qty: updateQuantity,
  //         },
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     setCartChanged(!cartChanged);
  //   } catch (err) {
  //     toast.error(err.response.data.message, {
  //       position: "top-center",
  //       autoClose: 1500,
  //       hideProgressBar: true,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: false,
  //       theme: "colored",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const updateProductQuantity = (productId, index, delta) => {
    const current = productQuantity[index];
    const newQty = current + delta;

    if (newQty < 1 || newQty > 99) {
      toast.error("數量超出限制", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
      });
      return;
    }

    //立即更新UI
    const newQuantityArray = [...productQuantity];
    newQuantityArray[index] = newQty;
    setProductQuantity(newQuantityArray);
    //發送 debounced API
    debouncedUpdate(productId, newQty);
  };
  //建立debounce包裝函式(只送last)
  const debouncedUpdate = useDebouncedUpdate(async (productId, qty) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("請先登入", { position: "top-center", autoClose: 1500 });
        return;
      }
      const token = await user.getIdToken();
      await axios.put(
        ADJUST_CART_PRODUCT_QTY_URL,
        {
          data: {
            product_id: productId,
            qty,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //成功後更新cartChanged
      setCartChanged((prev) => !prev);
    } catch (err) {
      toast.error(err?.response?.data?.message || "更新失敗", {
        position: "top-center",
        autoClose: 1500,
        theme: "colored",
      });
    }
  }, 500);

  return (
    <div className="cart_container">
      <div className="cart_header">
        <div className="cart_header_container">
          <button
            className="clear_cart_button"
            type="button"
            onClick={clearCart}
          >
            <div className="clear_cart_button_bg">REMOVE</div>
          </button>
          {/* <div className="remove_all_products_button_bg">清空購物車</div> */}
        </div>
      </div>
      <hr></hr>
      <table className="cart-table">
        <thead>
          <tr style={{ fontSize: "1.6rem" }}>
            <th>
              <div style={{ paddingRight: "7rem" }}>訂單商品</div>
            </th>
            <th>
              <div
                style={{
                  textAlign: "left",
                }}
              >
                單價
              </div>
            </th>
            <th>
              <div
                style={{
                  paddingLeft: "2.2rem",
                  textAlign: "left",
                }}
              >
                數量
              </div>
            </th>
            <th>
              <div
                style={{
                  paddingRight: "2.2rem",
                  textAlign: "right",
                }}
              >
                總價
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {cartProductData.length > 0 ? (
            cartProductData.map((cartProduct, index) => (
              <tr className="cart_product-row-container" key={cartProduct.id}>
                <td className="cart-product-order-info">
                  <div
                    className="cart-product-image"
                    style={{
                      backgroundImage: `url(${cartProduct.product?.image?.main})`,
                    }}
                  ></div>
                  <div className="cart-product-info">
                    <div
                      className="h6"
                      style={{
                        fontSize: "1.6rem",
                      }}
                    >
                      {cartProduct.product.name}
                    </div>
                    <div
                      className="cart-product-detail-group"
                      onClick={() => hasProductDetailShow(cartProduct.id)}
                    >
                      <div className="cart-product-detail-title">
                        <Icon
                          type={`down_arrow ${
                            showDetailProducts.includes(cartProduct.id)
                              ? "icon-rotate"
                              : ""
                          }`}
                        />
                        <span style={{ fontSize: "1.28rem", color: "#d394d6" }}>
                          {showDetailProducts.includes(cartProduct.id)
                            ? "隱藏商品詳細資訊"
                            : "點擊展開商品顯示詳情"}
                        </span>
                      </div>
                      {showDetailProducts.includes(cartProduct.id) && (
                        <div className="product-details">
                          <div className="details">
                            {cartProduct.product.summary}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="cart-product-price">
                  <span
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <Icon type="CP" />
                    <div style={{ fontSize: "2.08rem" }}>
                      {cartProduct.product.discount_price}
                    </div>
                  </span>
                </td>
                <td className="cart-product-quantity">
                  <div className="quantity-group">
                    <div
                      className="minus-container"
                      onClick={() => {
                        updateProductQuantity(cartProduct.id, index, -1);
                      }}
                    >
                      <div>-</div>
                    </div>
                    <div className="product-quantity">{cartProduct.qty}</div>
                    <div
                      className="plus-container"
                      onClick={() => {
                        updateProductQuantity(cartProduct.id, index, 1);
                      }}
                    >
                      <div>+</div>
                    </div>
                  </div>
                </td>
                <td className="cart-product-totalPrice">
                  <div className="cart-product-totalPrice-wrapper">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "2.08rem",
                      }}
                    >
                      <Icon type="CP" />
                      {cartProduct.final_total}
                    </span>
                    <div className="remove">
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Icon type="remove" />
                      </span>
                      <button
                        className="remove-btn"
                        type="button"
                        onClick={() => removeCartProduct(cartProduct.id)}
                      >
                        移除
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>
                <div className="no-product-txt">
                  <span className="no-product-txt-typing">
                    no product in the cart yet...
                  </span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot></tfoot>
      </table>
      <hr className="separate-line-in-cart" />
      <div className="cart-price-total">
        <span>總計</span>
        <div className="cart-price-total-num">
          <Icon type="CP" />
          {calTotalPrice()}
        </div>
      </div>
      <div className="checkout-btn-container">
        <div className="checkout-btn-wrapper">
          <button
            className="checkout-button"
            type="button"
            onClick={handleCheckout}
            // onClick={() => {
            //   toast.error("尚未開放", {
            //     position: "top-center",
            //     autoClose: 1500,
            //     hideProgressBar: true,
            //     closeOnClick: true,
            //     pauseOnHover: false,
            //     draggable: false,
            //     theme: "colored",
            //   });
            // }}
          >
            <div className="checkout-button-txt">花錢消災去</div>
          </button>
        </div>
      </div>
    </div>
  );
}
GetCart.propTypes = {
  cartProductData: PropTypes.array.isRequired,
  setCartProductData: PropTypes.func.isRequired,
  cartChanged: PropTypes.bool.isRequired,
  setCartChanged: PropTypes.func.isRequired,
  setLoading: PropTypes.bool.isRequired,
};

export default GetCart;
