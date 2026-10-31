import { useEffect, useRef, useState } from "react";

export function useCountUp(target, duration = 1100) {
    const [v, setV] = useState(0);
    const prev = useRef(0);
    useEffect(() => {
        const from = prev.current;
        const start = performance.now();
        let raf;
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            setV(target);
            prev.current = target;
            return;
        }
        const tick = (n) => {
            const t = Math.min((n - start) / duration, 1);
            const e = 1 - Math.pow(1 - t, 3);
            setV(Math.round(from + (target - from) * e));
            if (t < 1) raf = requestAnimationFrame(tick);
            else prev.current = target;
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return v;
}

/* ---------- animated number ---------- */
export function useCountUpFromZero(target, duration = 1200) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let raf;
        const start = performance.now();
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        if (reduce) {
            setVal(target);
            return;
        }
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setVal(Math.round(target * eased));
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);
    return val;
}
