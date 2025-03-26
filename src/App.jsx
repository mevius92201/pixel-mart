import { Outlet } from "react-router";
import "./assets/all.css";
import { Navbar } from "./Component/Navbar";
import { Footer } from "./Component/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useAuthStore from "./Component/store/auth-store";
import { useEffect } from "react";
import TestFirestore from "./Firestore";

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);
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
          <TestFirestore />
        </div>
      </div>
    </>
  );
}

export default App;
