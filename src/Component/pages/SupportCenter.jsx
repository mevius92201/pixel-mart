import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingEffect from "../LoadingEffect.jsx";
import SupportForm from "../supportForm.jsx";

// import PaymentForm from "./Component/PaymentForm.js";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function SupportCenter() {
  const [cartProductData, setCartProductData] = useState([]);
  const [cartChanged, setCartChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);

  const getProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
      setProductsData(res.data.products);
      // console.log(res.data);
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
    }
  };
  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <section className="support-center">
        <div className="support-center-main-wrapper">
          <SupportForm setLoading={setLoading} />
        </div>
      </section>
      <div>
        <LoadingEffect loadingState={loading} />
      </div>
    </>
  );
}
export default SupportCenter;
