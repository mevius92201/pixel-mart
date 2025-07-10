import { forwardRef } from "react";
import "../../../../assets/best_sellers.css";
import RewardList from "./RewardList";
import FadeInSectionEffect from "../../../FadeInSectionEffect";

const BestSeller = forwardRef((props, ref) => {
  return (
    <section ref={ref} className="best-sellers" id="second-section">
      <div className="best-sellers-wrapper">
        <div className="best-sellers-title">
          <div className="torch_sprite" />
          <div className="best-sellers-board"></div>
          <div className="best-sellers-txt">BEST SELLERS</div>
        </div>
        <FadeInSectionEffect style={{ position: "relative", top: "10rem" }}>
          <RewardList />
        </FadeInSectionEffect>
      </div>
    </section>
  );
});

export default BestSeller;
