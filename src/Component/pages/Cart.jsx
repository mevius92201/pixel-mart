import { useState } from "react";
// import AuthPage from "./Component/AuthPage.jsx";
import "../../assets/all.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingEffect from "../LoadingEffect.jsx";
import GetCart from "../GetCart.jsx";
// import PaymentForm from "./Component/PaymentForm.js";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function Cart() {
  const [cartProductData, setCartProductData] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* <AuthPage getProducts={getProduct} setIsAuth={false} /> */}
      <div id="app">
        <div className="container">
          <GetCart
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
            cartProductData={cartProductData}
            setCartProductData={setCartProductData}
            setLoading={setLoading}
          />
          {/* <PaymentForm
            setLoading={setLoading}
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
            cartProductData={cartProductData}
          /> */}
        </div>
      </div>
      <div>
        <ToastContainer />
        <LoadingEffect loadingState={loading} />
      </div>
    </>
  );
}
export default Cart;
