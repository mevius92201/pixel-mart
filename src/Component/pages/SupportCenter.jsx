import { useState } from "react";
import LoadingEffect from "../LoadingEffect.jsx";
import SupportForm from "../supportForm.jsx";

// import PaymentForm from "./Component/PaymentForm.js";
const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "mevius";
function SupportCenter() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <section className="support-center">
        <div className="support-center-main-wrapper">
          <SupportForm setLoading={setLoading} />
        </div>
      </section>
      <div>
        <LoadingEffect loadingState={loading} />
      </div>
    </>
  );
}
export default SupportCenter;
