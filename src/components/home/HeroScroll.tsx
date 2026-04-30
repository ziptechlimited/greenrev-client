"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import HeroHUD from "./HeroHUD";

const FRAME_COUNT = 219;

// Lerp factor: 0.0 = never moves, 1.0 = instant snap. 0.08 gives a silky lag.
const LERP_FACTOR = 0.08;

const getFrameString = (index: number) => {
  return `/sequence/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;
};

const images = Array.from({ length: FRAME_COUNT }, (_, i) => getFrameString(i + 1));

// Shared draw logic to avoid duplication
function drawFrame(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement
) {
  const canvasRatio = canvas.width / canvas.height;
  const imgRatio = img.width / img.height;
  let drawWidth = canvas.width;
  let drawHeight = canvas.height;
  let offsetX = 0;
  let offsetY = 0;

  if (canvasRatio > imgRatio) {
    drawHeight = canvas.width / imgRatio;
    offsetY = (canvas.height - drawHeight) / 2;
  } else {
    drawWidth = canvas.height * imgRatio;
    offsetX = (canvas.width - drawWidth) / 2;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesArray, setImagesArray] = useState<HTMLImageElement[]>([]);
  const { imagesPreloaded, progress } = useImagePreloader(images);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Spring is only used for the HUD and overlay/text — not the canvas.
  // Keeps those UI elements smooth while the canvas runs on its own rAF loop.
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
    restDelta: 0.001,
  });

  const textOpacity = useTransform(springProgress, [0, 0.75, 0.95, 1], [0, 0, 1, 1]);
  const textY = useTransform(springProgress, [0, 0.75, 0.95, 1], [50, 50, 0, 0]);
  const overlayOpacity = useTransform(springProgress, [0, 0.5, 1], [0.3, 0.5, 0.8]);

  // Preload all image elements
  useEffect(() => {
    const loadedImages = images.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    setImagesArray(loadedImages);
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Core: Raw rAF loop with lerp for butter-smooth frame scrubbing.
  // This completely bypasses Framer Motion for the canvas draw, eliminating
  // the spring chain latency and making the animation frame-perfect.
  useEffect(() => {
    if (!imagesPreloaded || imagesArray.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // currentFrame is our lerped position; targetFrame is what scroll dictates.
    let currentFrame = 0;
    let lastDrawnFrame = -1;
    let rafId: number;

    const loop = () => {
      // Read the raw scroll progress directly — no spring, no transform overhead.
      const rawProgress = scrollYProgress.get();
      const targetFrame = rawProgress * (FRAME_COUNT - 1);

      // Lerp toward the target each frame tick.
      currentFrame += (targetFrame - currentFrame) * LERP_FACTOR;

      const frameIndex = Math.round(currentFrame);

      // Only redraw if the rounded frame has actually changed.
      if (frameIndex !== lastDrawnFrame) {
        const clampedIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));
        const img = imagesArray[clampedIndex];
        if (img && img.complete) {
          drawFrame(canvas, ctx, img);
          lastDrawnFrame = frameIndex;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    // Draw frame 0 immediately so canvas isn't blank
    const firstImg = imagesArray[0];
    if (firstImg && firstImg.complete) {
      drawFrame(canvas, ctx, firstImg);
    }

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [imagesPreloaded, imagesArray, scrollYProgress]);

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-background w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {!imagesPreloaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-background">
            <div className="text-accent tracking-widest text-sm uppercase mb-4">Igniting Engine</div>
            <div className="w-48 h-1 bg-white/10 overflow-hidden relative">
              <div
                className="absolute top-0 left-0 h-full bg-accent transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 text-xs text-subtle">{Math.round(progress)}%</div>
          </div>
        )}

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

        <HeroHUD scrollYProgress={springProgress} />

        <motion.div
          className="absolute inset-0 bg-black z-10 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-6 text-center"
          style={{ opacity: textOpacity, y: textY }}
        >
          <h1 className="text-5xl md:text-8xl font-display uppercase tracking-widest text-white mb-6">
            Command the Road.
          </h1>
          <p className="text-lg md:text-2xl text-subtle max-w-2xl font-light">
            Curated performance machines for those who move differently.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
