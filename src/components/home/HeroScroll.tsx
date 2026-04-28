"use client";

import { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, useSpring } from "framer-motion";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import HeroHUD from "./HeroHUD";

const FRAME_COUNT = 224;

const getFrameString = (index: number) => {
  return `/sequence/ezgif-frame-${index.toString().padStart(3, "0")}.jpg`;
};

const images = Array.from({ length: FRAME_COUNT }, (_, i) => getFrameString(i + 1));

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesArray, setImagesArray] = useState<HTMLImageElement[]>([]);
  const { imagesPreloaded, progress } = useImagePreloader(images);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Dampen the scroll velocity for a smoother, luxurious feel
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 15,
    restDelta: 0.001,
  });

  const frameIndex = useTransform(springProgress, [0, 1], [0, FRAME_COUNT - 1]);
  const textOpacity = useTransform(springProgress, [0, 0.75, 0.95, 1], [0, 0, 1, 1]);
  const textY = useTransform(springProgress, [0, 0.75, 0.95, 1], [50, 50, 0, 0]);
  const overlayOpacity = useTransform(springProgress, [0, 0.5, 1], [0.3, 0.5, 0.8]);

  // Preload actual image elements
  useEffect(() => {
    const loadedImages = images.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });
    setImagesArray(loadedImages);
  }, []);

  // Draw to canvas
  useEffect(() => {
    if (!imagesPreloaded || imagesArray.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (index: number) => {
      const img = imagesArray[Math.floor(index)];
      if (img && img.complete) {
        // Calculate crop/scale to fill canvas while maintaining aspect ratio
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

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    // Initial render
    render(0);

    const unsubscribe = frameIndex.on("change", (latest) => {
      render(latest);
    });

    return () => unsubscribe();
  }, [imagesPreloaded, imagesArray, frameIndex]);

  // Handle canvas resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Re-render current frame on resize
        if (imagesArray.length > 0) {
          const currentIndex = Math.floor(frameIndex.get());
          const img = imagesArray[currentIndex];
          if (img && img.complete) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              const canvasRatio = canvasRef.current.width / canvasRef.current.height;
              const imgRatio = img.width / img.height;
              let drawWidth = canvasRef.current.width;
              let drawHeight = canvasRef.current.height;
              let offsetX = 0;
              let offsetY = 0;

              if (canvasRatio > imgRatio) {
                drawHeight = canvasRef.current.width / imgRatio;
                offsetY = (canvasRef.current.height - drawHeight) / 2;
              } else {
                drawWidth = canvasRef.current.height * imgRatio;
                offsetX = (canvasRef.current.width - drawWidth) / 2;
              }

              ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            }
          }
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [imagesArray, frameIndex]);

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
        
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />
        
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
