import { useState } from "react";
import PropTypes from "prop-types";
import RegisterForm from "../RegisterForm";
import LoginForm from "../LoginForm";

const Login = ({ getProducts, setIsAuth }) => {
  const [tab, setTab] = useState("login");

  return (
    <section className="auth-center">
      <div className="auth-center-main-wrapper">
        <div className="auth-container">
          <div className="router-container">
            <div className="form-container">
              <div className="signIn-createAccount-tab">
                <button
                  className={`accountTab ${tab === "register" ? "active" : ""}`}
                  onClick={() => setTab("register")}
                >
                  Create Account
                </button>
                <button
                  className={`accountTab ${tab === "login" ? "active" : ""}`}
                  onClick={() => setTab("login")}
                >
                  Sign In
                </button>
              </div>
              <div className="form-content">
                {tab === "login" ? (
                  <LoginForm getProducts={getProducts} setIsAuth={setIsAuth} />
                ) : (
                  <RegisterForm
                    getProducts={getProducts}
                    setIsAuth={setIsAuth}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

Login.propTypes = {
  setIsAuth: PropTypes.bool.isRequired,
  getProducts: PropTypes.func.isRequired,
};
export default Login;
