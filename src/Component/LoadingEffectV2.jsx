import { useEffect } from "react";
import PropTypes from "prop-types";
function LoadingEffectV2({ loadingState }) {
  useEffect(() => {
    const scrollH = document.documentElement.scrollHeight;
    const wh = window.innerHeight;

    const loadingBlock = document.querySelector(".loadingBlock");
    const loadingContainer = document.querySelector(".loadingContainer");

    if (loadingBlock) {
      loadingBlock.style.height = `${scrollH}px`;
    }
    if (loadingContainer) {
      loadingContainer.style.height = `${wh}px`;
      loadingContainer.style.textAlign = "center";
      loadingContainer.style.lineHeight = `${wh}px`;
      console.log(loadingContainer);
    }
  }, []);
  return (
    <>
      {loadingState && (
        <div className="loadingBlock">
          <div className="loadingContainer">
            <div className="loadingAnimation">
              {loadingState && <div className="loading-cat-effect"></div>}
            </div>
            <div className="loadingTextV2">loading...</div>
          </div>
        </div>
      )}
    </>
  );
}
LoadingEffectV2.propTypes = {
  loadingState: PropTypes.bool.isRequired,
};
export default LoadingEffectV2;
