import { useRef, useEffect } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      isDown = true;
      startX = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.classList.add("scrolling");
    };

    const onMouseLeaveOrUp = () => {
      isDown = false;
      el.classList.remove("scrolling");
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - el.offsetLeft;
      const walk = (x - startX) * 1.5;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseleave", onMouseLeaveOrUp);
    el.addEventListener("mouseup", onMouseLeaveOrUp);
    el.addEventListener("mousemove", onMouseMove);

    el.addEventListener("touchstart", onMouseDown);
    el.addEventListener("touchend", onMouseLeaveOrUp);
    el.addEventListener("touchmove", onMouseMove);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseleave", onMouseLeaveOrUp);
      el.removeEventListener("mouseup", onMouseLeaveOrUp);
      el.removeEventListener("mousemove", onMouseMove);

      el.removeEventListener("touchstart", onMouseDown);
      el.removeEventListener("touchend", onMouseLeaveOrUp);
      el.removeEventListener("touchmove", onMouseMove);
    };
  }, []);

  return ref;
}
