import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      // what are entries exactly
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observeTarget);
    return () => {
      // clean-up function
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);
  return dimensions;
};

export default useResizeObserver;
