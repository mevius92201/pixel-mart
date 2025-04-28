import { useRef } from "react";
function ScrollToTop() {
  const topRef = useRef(null);
  const scrollToTop = () => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="scroll-to-top" onClick={scrollToTop} ref={topRef}>
      <div className="scroll-to-top-icon"></div>
      <div className="scroll-to-top-text">
        <span className="scroll-to-top-txt">Go to Top</span>
      </div>
    </div>
  );
}
export default ScrollToTop;
