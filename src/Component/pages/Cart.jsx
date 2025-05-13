import { useState } from "react";
// import LoadingEffect from "../LoadingEffect.jsx";
import LoadingEffectV2 from "../LoadingEffectV2.jsx";
import GetCart from "../GetCart.jsx";

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
        <LoadingEffectV2 loadingState={loading} />
      </div>
    </>
  );
}
export default Cart;
