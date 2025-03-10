import axios from "axios";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [passwordType, setPasswordType] = useState("password");
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const hasPasswordShow = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    if (!token) return;
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      setIsAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("送出的 data:", data);
      const res = await axios.post(`${API_BASE}/admin/signin`, data);
      const { token, expired } = res.data;
      document.cookie = `access_token=${token};expires=${new Date(
        expired
      )};path=/`;
      axios.defaults.headers.common.Authorization = token;
      setIsAuth(true);
      navigate("/admin");
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="input-fields">
        <div className="floating">
          <div className="floating__inner">
            <input
              id="signInUsername"
              className={errors.username ? "error_auth-input" : "auth-input"}
              {...register("username", {
                required: {
                  value: true,
                  message: "此欄位必填",
                },
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "請輸入正確的 Email 格式",
                },
              })}
              placeholder=""
            />
            <label htmlFor="signInUsername" className="userName">
              Email
            </label>
          </div>
          {errors.email && (
            <div className="error-hint">{errors?.username?.message}</div>
          )}
        </div>
        <div className="floating">
          <div className="floating__inner">
            <input
              id="signInPassword"
              className={errors.password ? "error_auth-input" : "auth-input"}
              {...register("password", {
                required: "請輸入密碼",
              })}
              type={passwordType}
              placeholder=""
            />
            <label htmlFor="signInPassword" className="passWord">
              Password
            </label>
          </div>
          {errors.password && (
            <div className="error-hint">{errors?.password?.message}</div>
          )}
        </div>
      </div>
      <label className="form-check-label">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={hasPasswordShow}
        />{" "}
        顯示密碼
      </label>
      <button type="submit" className="signin-btn">
        登入
      </button>
    </form>
  );
};
LoginForm.propTypes = {
  setIsAuth: PropTypes.func.isRequired,
};
export default LoginForm;
