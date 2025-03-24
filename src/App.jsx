import { Outlet } from "react-router";
import "./assets/all.css";
import { Navbar } from "./Component/Navbar";
import { Footer } from "./Component/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <>
      <div className="layout">
        <div className="main-wrapper">
          <Navbar />
          <main className="main-content">
            <Outlet />
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default App;
