import { useRef, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";

/**
 * 自定義 debounce Hook
 * @param {Function} callback 要執行的函式
 * @param {number} delay 延遲毫秒數（預設 500）
 * @returns {Function} 被 debounce 處理的函式
 */
const useDebouncedUpdate = (callback, delay = 500) => {
  // 用 ref 保持對最新 callback 的引用
  const callbackRef = useRef(callback);

  // 每次 callback 變動就更新 ref
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // 只在 delay 改變時（或初次）建立 debounce 函式
  const debouncedFn = useMemo(() => {
    const fn = debounce((...args) => {
      // 真正執行時讀取最新的 callback
      callbackRef.current(...args);
    }, delay);
    return fn;
  }, [delay]);

  // 在 unmount 時取消任何 pending 的呼叫
  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
};

export default useDebouncedUpdate;
