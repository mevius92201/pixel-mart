import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingEffect from "../LoadingEffect.jsx";
import GetProduct from "../GetProduct.jsx";
import CenterMode from "../Slider.jsx";
import sliderData from "../../data.json";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function Product() {
  const [cartChanged, setCartChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);

  const getProduct = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/products/all`);
      setProductsData(res.data.products);
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
      <section className="product-display">
        <CenterMode sliderData={sliderData} />
      </section>
      <section className="product-display">
        <div className="product-display-main-wrapper">
          <GetProduct
            productsData={productsData}
            cartChanged={cartChanged}
            setCartChanged={setCartChanged}
          />
        </div>
      </section>
      <div>
        <LoadingEffect loadingState={loading} />
      </div>
    </>
  );
}
export default Product;
