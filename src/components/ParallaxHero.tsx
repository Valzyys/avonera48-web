"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

type Props = {
  /** jumlah member yang lagi live, dipakai di banner */
  liveCount?: number;
  video?: string;
  poster?: string;
};

export function ParallaxHero({ liveCount = 0, video, poster }: Props) {
  const hostRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      host.style.setProperty("--p", "0");
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = host.getBoundingClientRect();
      // total jarak scroll yang tersedia sebelum hero lepas dari sticky
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const p = Math.min(Math.max(-rect.top / travel, 0), 1);
      // easing biar transisinya gak linier kaku
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      host.style.setProperty("--p", eased.toFixed(4));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" ref={hostRef as any} style={{ "--p": 0 } as any}>
      <div className="hero-sticky">
        <div className="hero-frame" ref={frameRef}>
          <video
            className="hero-video"
            src={video || process.env.NEXT_PUBLIC_HERO_VIDEO || "/hero.mp4"}
            poster={poster || process.env.NEXT_PUBLIC_HERO_POSTER || "/hero-poster.jpg"}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="hero-veil" />

          <div className="hero-copy">
            <h1 className="display d1">
              Panggungnya jalan terus.
              <br />
              Lo tinggal nonton.
            </h1>
            <p className="lede" style={{ marginTop: 18 }}>
              Avonera48 nempel ke JKT48Connect buat ngasih tau siapa yang lagi
              siaran, jadwal theater minggu ini, dan kabar terbaru — tanpa lo
              harus buka lima aplikasi.
            </p>
          </div>

          <div className="hero-band">
            <span className="display d3">avonera48</span>
            <span className="hero-rule" />
            <span className="pill pill-spot">
              {liveCount > 0 ? `${liveCount} member live` : "Belum ada yang live"}
            </span>
            <Link href="/live" className="btn">
              Lihat live
            </Link>
          </div>

          <span className="scroll-hint">scroll</span>
        </div>
      </div>
    </section>
  );
}
