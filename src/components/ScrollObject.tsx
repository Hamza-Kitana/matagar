import { useEffect, useRef } from "react";
import { whenIdle } from "@/lib/idle";

export function ScrollObject() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    // three.js is the heaviest asset, so it loads only after the page has painted and gone idle.
    const cancelIdle = whenIdle(() => {
      import("./phoneScene")
        .then(({ mountPhoneScene }) => {
          if (disposed || !canvasRef.current) return;
          cleanup = mountPhoneScene(canvasRef.current);
        })
        .catch(() => {});
    });

    return () => {
      disposed = true;
      cancelIdle();
      cleanup?.();
    };
  }, []);

  return <canvas ref={canvasRef} className="scroll-object" aria-hidden="true" />;
}
