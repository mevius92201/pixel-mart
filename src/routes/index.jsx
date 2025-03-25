// import Home from "../pages/Home"
import App from "../App";
import Product from "../Component/pages/Product";
import Cart from "../Component/pages/Cart";
import News from "../Component/pages/news/News";
import NewsArticle from "../Component/pages/news/NewsArticle";
import Admin from "../Component/pages/admin/Admin";
import CustomerService from "../Component/pages/admin/CustomerService";
import ProductConfig from "../Component/pages/admin/ProductConfig";
import NewsConfig from "../Component/pages/admin/NewsConfig";
import Auth from "../Component/pages/Auth";
import Home from "../Component/pages/Home";
import SupportCenter from "../Component/pages/SupportCenter";

const routes = [
  {
    path: "",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      {
        path: "products",
        element: <Product />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "news",
        element: <News />,
      },
      {
        path: "news/:id",
        element: <NewsArticle />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "support",
        element: <SupportCenter />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "product_config",
        element: <ProductConfig />,
      },
      {
        path: "news_config",
        element: <NewsConfig />,
      },
      {
        path: "customer_service",
        element: <CustomerService />,
      },
    ],
  },
];

export default routes;
