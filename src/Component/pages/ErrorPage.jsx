import { useEffect, lazy, Suspense } from "react";
import { Navigate, useNavigate } from "react-router";
const Spline = lazy(() => import("@splinetool/react-spline"));
function ErrorPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      style={{
        height: `calc(100vh - 6.4rem)`,
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        backgroundImage: `url("/src/assets/images/error.jpg")`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        paddingTop: "6.4rem",
        backgroundPosition: "center",
        backgroundColor: "#1e1d36",
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <Spline
          scene="https://prod.spline.design/BefX4YZVB0SVzfhX/scene.splinecode"
          // onSplineLookAt={onSplineLookAt}
        />
      </Suspense>
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "70%",
          color: "white",
          zIndex: 10,
          maxWidth: "400px",
          fontSize: "3rem",
        }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
          404 - 頁面不存在
        </div>
        <div>5 秒後自動返回首頁...</div>
      </div>
    </div>
  );
}
export default ErrorPage;
