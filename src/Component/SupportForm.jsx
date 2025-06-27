import { toast } from "react-toastify";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import useAuthStore from "./store/auth-store";
import PropTypes from "prop-types";

function SupportForm({ setLoading }) {
  const user = useAuthStore((state) => state.user);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: user?.email || "",
      tel: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await addDoc(collection(db, "feedbacks"), {
        name: data.name,
        email: data.email,
        tel: data.tel,
        message: data.message,
        created_at: new Date(),
      });
      toast.success("感謝您的回饋！", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
      reset({ name: "", email: "", tel: "", message: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "送出失敗", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        theme: "colored",
      });
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  useEffect(() => {
    reset((prev) => ({ ...prev, email: user?.email || "" }));
  }, [user]);

  return (
    <div className="support-form-container">
      <form className="support-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="support-input-fields">
          <div className="support-floating">
            <div className="support-form__inner">
              <label htmlFor="name" className="support-form-label">
                姓名
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: {
                    value: true,
                    message: "此欄位位必填",
                  },
                  minLength: {
                    value: 2,
                    message: "請輸入至少2個字",
                  },
                  maxLength: {
                    value: 20,
                    message: "請勿超過20個字",
                  },
                })}
                className={
                  errors.name ? "error_support-input" : "support-input"
                }
                placeholder="大胖狗"
              />
              {errors.name && (
                <div className="invalid-hint">{errors?.name?.message}</div>
              )}
            </div>
            <div className="support-form__inner">
              <label htmlFor="email" className="support-form-label">
                信箱
              </label>
              <input
                id="email"
                name="email"
                type="email"
                {...register("email", {
                  required: {
                    value: true,
                    message: "此欄位必填",
                  },
                  pattern: {
                    value: /^\S+@\S+\.\S+$/i,
                    message: "請輸入正確的 Email 格式",
                  },
                })}
                className={
                  errors.email ? "error_support-input" : "support-input"
                }
                placeholder="example@example.com"
              />
              {errors.email && (
                <div className="invalid-hint">{errors?.email?.message}</div>
              )}
            </div>

            {/* <div className="support-form__inner">
              <label htmlFor="tel" className="support-form-label">
                電話
              </label>
              <input
                id="tel"
                name="電話"
                type="text"
                {...register("tel", {
                  required: {
                    value: true,
                    message: "此欄位必填",
                  },
                  pattern: {
                    value: /^09\d{8}$|^09\d{2}-\d{3}-\d{3}$/,
                    message: "請輸入正確的手機格式",
                  },
                })}
                className={errors.tel ? "error_auth-input" : "auth-input"}
                placeholder="09XXXXXXXX"
              />
              {errors.tel && (
                <div className="invalid-hint">{errors?.tel?.message}</div>
              )}
            </div> */}
            <div className="support-form__inner">
              <label htmlFor="message" className="support-form-label">
                留言
              </label>
              <textarea
                id="message"
                maxLength="300"
                className="support-form-msg"
                {...register("message", {
                  maxLength: {
                    value: 300,
                    message: "請勿超過300個字",
                  },
                })}
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <div className="form-submit-btn">
              <button type="submit" className="btn form-btn-submit">
                提交
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

SupportForm.propTypes = {
  setLoading: PropTypes.func.isRequired,
  // watch: PropTypes.func.isRequired,
};
export default SupportForm;
