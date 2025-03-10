import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
function ErrorPage() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("");
    }, 1000);
  }, []);

  return <>error</>;
}
export default ErrorPage;
