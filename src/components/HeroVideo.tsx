import { useEffect, useRef, useState } from "react";
import { whenIdle } from "@/lib/idle";

const VIDEO_ID = "1ae-IoCKpxw";
const VIDEO_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&rel=0&playsinline=1&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&enablejsapi=1`;
const HERO_POSTER = `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`;

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

function canAffordVideo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !connection?.saveData && !/(^|-)(2g|3g)$/.test(connection?.effectiveType ?? "");
}

export function HeroVideo() {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!canAffordVideo()) return;
    return whenIdle(() => setEnabled(true), 2500);
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = "";
    const update = () => {
      frame = 0;
      const progress = Math.min(1, window.scrollY / window.innerHeight).toFixed(3);
      if (progress === last) return;
      last = progress;
      mediaRef.current?.style.setProperty("--hero-progress", progress);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Pausing the off-screen video frees the decoder and main thread for the rest of the page.
  useEffect(() => {
    if (!ready || !mediaRef.current) return;
    const command = (func: "playVideo" | "pauseVideo") =>
      frameRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
    let visible = true;
    const sync = () => command(visible && !document.hidden ? "playVideo" : "pauseVideo");
    const observer = new IntersectionObserver(([entry]) => { visible = !!entry?.isIntersecting; sync(); });
    observer.observe(mediaRef.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ready]);

  return (
    <div className={ready ? "hero-media is-playing" : "hero-media"} ref={mediaRef} aria-hidden="true">
      <div className="hero-poster" style={{ backgroundImage: `url(${HERO_POSTER})` }} />
      {enabled && (
        // YouTube flashes its title bar while booting, so the frame fades in only after it settles.
        <iframe
          ref={frameRef}
          className={ready ? "hero-video is-ready" : "hero-video"}
          src={VIDEO_SRC}
          title="VYBE background video"
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => window.setTimeout(() => setReady(true), 2200)}
        />
      )}
      <div className="hero-shade" />
      <div className="hero-grain" />
    </div>
  );
}
