import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingEffectV2 from "../LoadingEffectV2.jsx";
import GetProduct from "../GetProduct.jsx";
import CenterMode from "../Slider.jsx";
import sliderData from "../../data.json";
import SearchBar from "../SearchBar.jsx";
import ScrollToTop from "../ScrollToTop.jsx";
import FilterTabs from "../FilterTabs.jsx";
import SortItems from "../SortItems.jsx";
function Product() {
  const [cartChanged, setCartChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState("");
  const [tabs, setTabs] = useState(["全部", "食材", "飾品", "藥劑"]);
  const [sortOptions, setSortOptions] = useState([
    { label: "價格低到高", value: "price_asc" },
    { label: "價格高到低", value: "price_desc" },
    { label: "預設排序", value: "name" },
  ]);
  const [sort, setSort] = useState("name");

  const clearSearch = () => {
    setKeyword("");
    setCategory("");
    setPage(1);
    setSort("");
    getProduct();
  };
  const getProduct = async (searchTerm = "", cursor = null) => {
    const category = selectedTab === "全部" ? "" : selectedTab;
    // const querySort = sort === "name" ? "" : sort;
    try {
      setLoading(true);
      const res = await axios.get(
        "https://getproducts-3xt565hwvq-uc.a.run.app",
        {
          params: {
            keyword: searchTerm,
            category,
            page,
            sort,
            lastVisible: cursor?.id || "",
            lastPrice: cursor?.final_price || "",
          },
        }
      );
      // console.log("res", res);
      setProductsData(res.data?.products || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "無法取得商品資料", {
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
  useEffect(() => {
    getProduct();
  }, [selectedTab, sort]);

  const handleSearch = (value) => {
    setKeyword(value);
    getProduct(value);
  };
  return (
    <>
      <section className="product-display">
        <div className="product-display-main-wrapper">
          <CenterMode sliderData={sliderData} />
          <div className="product-display">
            <SearchBar onSearch={handleSearch} />
            <div className="product-tabs-group">
              <div className="product-tabs-container">
                <FilterTabs
                  tabs={tabs}
                  activeTab={selectedTab}
                  onChange={setSelectedTab}
                />
                <SortItems
                  sortOptions={sortOptions}
                  sort={sort}
                  onChange={setSort}
                />
              </div>
            </div>
            <GetProduct
              productsData={productsData}
              cartChanged={cartChanged}
              setCartChanged={setCartChanged}
            />
            <ScrollToTop />
          </div>
        </div>
      </section>
      <div>
        <LoadingEffectV2 loadingState={loading} />
      </div>
    </>
  );
}
export default Product;
