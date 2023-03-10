import { useRef, useEffect } from "react";

// 速度重視でrefでやる
export const useScrollDirection = (
  headerRef: React.RefObject<HTMLDivElement>
) => {
  // 正も負もありえる
  const scrollSum = useRef(0);

  // 常に正の値
  const lastScrollY = useRef(0);

  useEffect(() => {
    // eslint-disable-next-line complexity
    const updateScrollDirection = () => {
      const offsetY = window.pageYOffset;

      // 正も負もありえる
      const diff = offsetY - lastScrollY.current;

      const isSameDirection =
        (scrollSum.current >= 0 && diff >= 0) ||
        (scrollSum.current <= 0 && diff <= 0);
      // prevとdiffの符号が異なるときは、スクロール方向が変わったと判断する
      if (isSameDirection) {
        // 同方向
        if (scrollSum.current + diff > 100) {
          if (headerRef.current) {
            // eslint-disable-next-line no-param-reassign
            headerRef.current.style.top = "-3rem";
          }
        }
        if (scrollSum.current + diff < -200) {
          if (headerRef.current) {
            // eslint-disable-next-line no-param-reassign
            headerRef.current.style.top = "0";
          }
        }
        scrollSum.current += diff;
      } else {
        // 逆方向
        scrollSum.current = diff;
      }
      lastScrollY.current = offsetY;
    };
    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [headerRef]);
};
