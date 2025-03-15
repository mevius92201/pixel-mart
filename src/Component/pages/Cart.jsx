import { useState } from "react";
import "../../assets/all.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import LoadingEffect from "../LoadingEffect.jsx";
import LoadingEffectV2 from "../LoadingEffectV2.jsx";
import GetCart from "../GetCart.jsx";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function Cart() {
  const [cartProductData, setCartProductData] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <section className="cart-center">
        <div className="cart-center-main-wrapper">
          <GetCart
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
            cartProductData={cartProductData}
            setCartProductData={setCartProductData}
            setLoading={setLoading}
          />
        </div>
      </section>
      <div>
        <ToastContainer />
        <LoadingEffectV2 loadingState={loading} />
      </div>
    </>
  );
}
export default Cart;
