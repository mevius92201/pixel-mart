import { useState } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import useAuthStore from "./store/auth-store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

// const API_BASE = "https://ec-course-api.hexschool.io/v2";

const RegisterForm = () => {
  const { register: registerUser } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");

  const hasPasswordShow = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const onSubmit = async (data) => {
    const cleanedData = {
      email: (data.email || "").trim(),
      password: (data.password || "").trim(),
      confirmPassword: (data.confirmPassword || "").trim(),
    };
    try {
      const { success, message } = await registerUser(
        cleanedData.email,
        cleanedData.password,
        cleanedData.confirmPassword
      );
      if (success) {
        toast.success("註冊成功", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
        navigate("/");
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          theme: "colored",
        });
      }
      // const { token, expired } = res.data;
      // document.cookie = `access_token=${token};expires=${new Date(expired)};`;
      // axios.defaults.headers.common.Authorization = token;
      // setIsAuth(true);
      // getProducts();
    } catch (error) {
      alert("註冊失敗: " + error.response.data.message);
    }
  };
  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="input-fields">
        <div className="floating">
          <div className="floating__inner">
            <input
              id="createUsername"
              className={errors.email ? "error_auth-input" : "auth-input"}
              {...register("email", {
                required: {
                  value: true,
                  message: "請填入信箱",
                },
                pattern: {
                  value: /^\S+@\S+\.\S+$/i,
                  message: "請輸入正確的Email格式",
                },
              })}
              placeholder=""
            />
            <label htmlFor="createUsername" className="userName">
              Email
            </label>
          </div>
          {errors.email && (
            <div className="error-hint">{errors?.email?.message}</div>
          )}
        </div>
        <div className="floating">
          <div className="floating__inner">
            <input
              id="createPassword"
              className={errors.password ? "error_auth-input" : "auth-input"}
              {...register("password", {
                required: {
                  value: true,
                  message: "此欄位位必填",
                },
                minLength: {
                  value: 6,
                  message: "密碼需要至少6字元",
                },
                maxLength: {
                  value: 20,
                  message: "不要超過20字元^^",
                },
              })}
              placeholder=""
              type={passwordType}
            />
            <label htmlFor="createPassword" className="passWord">
              Password
            </label>
          </div>
          {errors.password && (
            <div className="error-hint">{errors?.password?.message}</div>
          )}
        </div>
        <div className="floating">
          <div className="floating__inner">
            <input
              id="createConfirmPassword"
              className={
                errors.confirmPassword ? "error_auth-input" : "auth-input"
              }
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "請確認密碼",
                },
                validate: (value) =>
                  value === watch("password") || "密碼好像不一樣？",
              })}
              placeholder=""
              type={passwordType}
            />
            <label htmlFor="createConfirmPassword" className="passWord">
              Confirm Password
            </label>
          </div>
          {errors.confirmPassword && (
            <div className="error-hint">{errors?.confirmPassword?.message}</div>
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
      <button type="submit" className="create-btn">
        註冊
      </button>
    </form>
  );
};
RegisterForm.propTypes = {
  setIsAuth: PropTypes.bool.isRequired,
  getProducts: PropTypes.func.isRequired,
};
export default RegisterForm;
