import { useEffect } from "react";

function useCloseOutside(ref, handler) {
  useEffect(() => {
    const handleCloseOutside = (e) => {
      if (!ref.current || ref.current.contains(e.target)) {
        return;
      }
      handler(e);
    };
    document.addEventListener("mousedown", handleCloseOutside);
    return () => {
      document.removeEventListener("mousedown", handleCloseOutside);
    };
  }, [handler, ref]);
}

export default useCloseOutside;
