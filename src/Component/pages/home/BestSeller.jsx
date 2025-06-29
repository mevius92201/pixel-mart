import { useEffect, forwardRef } from "react";
import "../../../assets/best_sellers.css";
import RewardList from "./RewardList";
import RewardSection from "./RewardSection";

const BestSeller = forwardRef((props, ref) => {
  return (
    <section ref={ref} className="best-sellers" id="second-section">
      <div className="best-sellers-wrapper">
        <div className="best-sellers-title">
          <img src="src/assets/icons/torch.png" alt="Best Sellers" />
        </div>
        <RewardSection />
      </div>
    </section>
  );
});

export default BestSeller;
