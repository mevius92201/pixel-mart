import { useEffect } from "react";

function useCloseOutside(ref, handler) {
  useEffect(() => {
    const handleCloseOutside = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      handler(e);
    };
    document.addEventListener("click", handleCloseOutside);
    return () => {
      document.removeEventListener("click", handleCloseOutside);
    };
  }, [handler, ref]);
}

export default useCloseOutside;
