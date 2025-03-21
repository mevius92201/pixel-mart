import { Outlet } from "react-router";
import "./assets/all.css";
import { Navbar } from "./Component/Navbar";
import { Footer } from "./Component/Footer";

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
        </div>
      </div>
    </>
  );
}

export default App;
