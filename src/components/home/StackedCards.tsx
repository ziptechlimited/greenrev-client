"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// ─── Card data ─────────────────────────────────────────────────────────────────
const CARDS = [
  {
    id: "compare",
    title: "Compare \nand Decide.",
    description:
      "Utilize our advanced side-by-side analysis tool to evaluate performance metrics, aerodynamics, and bespoke options.",
    cta: "Launch Comparison",
    href: "/compare",
    image: "/images/home/compare.jpeg",
  },
  {
    id: "relinquish",
    title: "Relinquish\nYour Machine.",
    description:
      "Experience a seamless and discreet transition. Our expert appraisers provide accurate valuations that reflect true pedigree.",
    cta: "Get Valuation",
    href: "/sell",
    image: "/images/home/relinquish.png",
  },
  {
    id: "sourcing",
    title: "Private\nSourcing.",
    description:
      "Leverage our global network to find the exact configuration and provenance you desire, handled with utmost discretion.",
    cta: "Request Sourcing",
    href: "/sourcing",
    image: "/images/home/comparison.png",
  },
];

// ─── Per-card scroll phases ─────────────────────────────────────────────────
// Each card takes 0.5 of the 0-1 scroll range.
// Card i:  enters at  i*0.40,  is full by i*0.40 + 0.28
//          starts shrinking when the NEXT card begins entering (i*0.40 + 0.20)
// Card N-1 (last): never shrinks.
function getPhase(i: number, total: number) {
  // Calculate step dynamically so that the last card finishes entering around 0.95
  const step = total > 1 ? 0.67 / (total - 1) : 0;
  const enterStart  = i * step;
  const enterEnd    = enterStart + 0.28;
  // second card starts entering when first card is 50% through its entry
  const nextEnter   = (i + 1) * step;
  const shrinkStart = nextEnter;              // starts shrinking when next card appears
  const shrinkEnd   = nextEnter + 0.28;       // fully thumbnail when next card is full
  const isLast      = i === total - 1;
  return { enterStart, enterEnd, shrinkStart, shrinkEnd, isLast };
}

// ─── Intro heading ─────────────────────────────────────────────────────────────
function IntroHeading({ progress }: { progress: MotionValue<number> }) {
  // Fades in and scales up as the section first enters view
  const opacity = useTransform(
    progress,
    [0, 0.06, 0.12, 0.20],
    [0,  1,    1,   0]
  );
  const scale = useTransform(
    progress,
    [0, 0.06, 0.12, 0.20],
    [0.88, 1, 1, 1.06]
  );
  const y = useTransform(
    progress,
    [0, 0.06],
    [30, 0]
  );

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="absolute inset-0 flex flex-col items-center justify-start pt-24 md:pt-32 z-50 pointer-events-none"
    >
      <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tight text-center leading-tight">
        Experience Highlights
      </h2>
    </motion.div>
  );
}

// ─── Individual card ───────────────────────────────────────────────────────────
function Card({
  card,
  index,
  total,
  progress,
  thumbX,   // pixel offset to top-left corner
  thumbY,
  enterFromX, // pixel offset for enter-from-bottom-right (0 for first card)
  enterFromY,
}: {
  card: (typeof CARDS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  thumbX: number;
  thumbY: number;
  enterFromX: number;
  enterFromY: number;
}) {
  const phase = getPhase(index, total);

  const THUMB_SCALE = 0.22;
  const ENTER_SCALE = 0.22;

  // ─ Scale ───────────────────────────────────────────────────────────────────
  const scaleInput = phase.isLast
    ? [phase.enterStart, phase.enterEnd]
    : [phase.enterStart, phase.enterEnd, phase.shrinkStart, phase.shrinkEnd];
  const scaleOutput = phase.isLast
    ? [ENTER_SCALE, 1]
    : [ENTER_SCALE, 1, 1, THUMB_SCALE];

  const scale = useTransform(progress, scaleInput, scaleOutput);

  // ─ X position ──────────────────────────────────────────────────────────────
  const xInput = phase.isLast
    ? [phase.enterStart, phase.enterEnd]
    : [phase.enterStart, phase.enterEnd, phase.shrinkStart, phase.shrinkEnd];
  const xOutput = phase.isLast
    ? [enterFromX, 0]
    : [enterFromX, 0, 0, thumbX];

  const x = useTransform(progress, xInput, xOutput);

  // ─ Y position ──────────────────────────────────────────────────────────────
  const yInput = phase.isLast
    ? [phase.enterStart, phase.enterEnd]
    : [phase.enterStart, phase.enterEnd, phase.shrinkStart, phase.shrinkEnd];
  const yOutput = phase.isLast
    ? [enterFromY, 0]
    : [enterFromY, 0, 0, thumbY];

  const y = useTransform(progress, yInput, yOutput);

  // ─ Opacity ─────────────────────────────────────────────────────────────────
  const opacity = useTransform(
    progress,
    [phase.enterStart, phase.enterStart + 0.05],
    [0, 1]
  );

  // ─ Border radius ───────────────────────────────────────────────────────────
  const radiusInput = phase.isLast
    ? [phase.enterStart, phase.enterEnd]
    : [phase.enterStart, phase.enterEnd, phase.shrinkStart, phase.shrinkEnd];
  const radiusOutput = phase.isLast
    ? [12, 28]
    : [12, 28, 28, 12];

  const borderRadius = useTransform(progress, radiusInput, radiusOutput);

  // ─ Text opacity: visible only when card is large ───────────────────────────
  const textInput = phase.isLast
    ? [phase.enterEnd - 0.1, phase.enterEnd]
    : [phase.enterEnd - 0.1, phase.enterEnd, phase.shrinkStart, phase.shrinkStart + 0.06];
  const textOutput = phase.isLast
    ? [0, 1]
    : [0, 1, 1, 0];

  const textOpacity = useTransform(progress, textInput, textOutput);

  // ─ Parallax: image drifts upward as scroll advances through this card ──────
  // Maps the card's full scroll window to a vertical image offset
  const parallaxStart = phase.enterStart;
  const parallaxEnd   = phase.isLast ? 1 : phase.shrinkEnd;
  const parallaxY = useTransform(
    progress,
    [parallaxStart, parallaxEnd],
    [50, -50]
  );

  const sx = useSpring(x,        { stiffness: 65, damping: 22, restDelta: 0.5 });
  const sy = useSpring(y,        { stiffness: 65, damping: 22, restDelta: 0.5 });
  const ss = useSpring(scale,    { stiffness: 65, damping: 22 });
  const spy = useSpring(parallaxY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      style={{
        x: sx,
        y: sy,
        scale: ss,
        opacity,
        borderRadius,
        zIndex: 10 + index,
        // Cards are centered; scale expands from center
        transformOrigin: "center center",
      }}
      className="absolute inset-0 overflow-hidden will-change-transform"
    >
      {/* Parallax image layer — oversized so shift doesn't clip */}
      <motion.div
        style={{ y: spy }}
        className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform"
      >
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute bottom-10 left-10 right-10 space-y-4"
      >
        <h2 className="text-4xl md:text-5xl font-display text-white tracking-tight leading-[1.05] whitespace-pre-line">
          {card.title}
        </h2>
        {/* <p className="text-white/55 text-sm font-light leading-relaxed max-w-xs">
          {card.description}
        </p> */}
        <Link
          href={card.href}
          className="inline-flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-[0.3em] hover:gap-4 transition-all duration-300"
        >
          {card.cta} <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Right-side descriptor (one per card, separate component for hook rules) ──
function Descriptor({
  text,
  href,
  cta,
  rangeIn,
  rangeOut,
  progress,
}: {
  text: string;
  href: string;
  cta: string;
  rangeIn: [number, number];
  rangeOut: [number, number] | null;
  progress: MotionValue<number>;
}) {
  const opacityInput = rangeOut
    ? [rangeIn[0], rangeIn[1], rangeOut[0], rangeOut[1]]
    : [rangeIn[0], rangeIn[1]];
  const opacityOutput = rangeOut ? [0, 1, 1, 0] : [0, 1];

  const opacity = useTransform(progress, opacityInput, opacityOutput);
  const y = useTransform(progress, [rangeIn[0], rangeIn[1]], [16, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 space-y-3 pointer-events-auto"
    >
      <p className="text-white/85 text-lgmd:text-xl font-light leading-relaxed">{text}</p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-colors mt-1"
      >
        {cta} <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function StackedCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Compute pixel offsets for thumbnail/enter positions at runtime
  const [offsets, setOffsets] = useState({
    thumbX: -500, thumbY: -320,
    enterX: 500,  enterY: 320,
  });

  useEffect(() => {
    function compute() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Card dimensions match the stage element
      const cw = Math.min(vw * 0.65, 900);
      const ch = Math.min(vh * 0.88, 940);
      const thumbScale = 0.22;
      const gap = 12; // gap between thumbnail edge and main card edge

      const tw = cw * thumbScale; // thumbnail width
      const th = ch * thumbScale; // thumbnail height

      // Top-left thumbnail: sits just to the left of and near the top of the main card
      // Main card left edge is at: vw/2 - cw/2
      // We want the thumbnail's right edge to be `gap` away from the card's left edge
      const txCenter = (vw / 2 - cw / 2) - gap - tw / 2;
      // Align thumbnail top with the card top + a small inset
      const tyCenter = (vh / 2 - ch / 2) + th / 2 + gap;
      const thumbX = txCenter - vw / 2;  // delta from viewport center
      const thumbY = tyCenter - vh / 2;

      // Bottom-right thumbnail: sits just to the right of and near the bottom of the main card
      // Main card right edge is at: vw/2 + cw/2
      const exCenter = (vw / 2 + cw / 2) + gap + tw / 2;
      const eyCenter = (vh / 2 + ch / 2) - th / 2 - gap;
      const enterX = exCenter - vw / 2;
      const enterY = eyCenter - vh / 2;

      setOffsets({ thumbX, thumbY, enterX, enterY });
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  const total = CARDS.length;
  // Scroll height: give ~200vh per card
  const scrollHeight = `${total * 200 + 100}vh`;

  return (
    <div ref={containerRef} style={{ height: scrollHeight }} className="relative bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Cinematic intro heading — fades in as section enters, fades before cards appear */}
        <IntroHeading progress={progress} />

        {/* Card stage — centered, fixed aspect */}
        <div
          className="absolute"
          style={{
            // Center the stage in the viewport
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(50vw, 900px)",
            height: "min(88vh, 940px)",
          }}
        >
          {CARDS.map((card, i) => (
            <Card
              key={card.id}
              card={card}
              index={i}
              total={total}
              progress={progress}
              thumbX={offsets.thumbX}
              thumbY={offsets.thumbY}
              // First card enters from bottom-center (x=0), rest from bottom-right
              enterFromX={i === 0 ? 0 : offsets.enterX}
              enterFromY={offsets.enterY}
            />
          ))}
        </div>

        {/* Right-side descriptors — pinned just outside the card's right edge */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-[220px] pointer-events-none z-50"
          style={{ left: "calc(50% + min(32.5vw, 450px) + 28px)" }}
        >
          <div className="relative h-36">
            {CARDS.map((card, i) => {
              const phase = getPhase(i, total);
              const isLast = i === total - 1;
              return (
                <Descriptor
                  key={card.id}
                  text={card.description}
                  href={card.href}
                  cta="Discover the Experience"
                  rangeIn={[phase.enterEnd - 0.08, phase.enterEnd + 0.04]}
                  rangeOut={isLast ? null : [phase.shrinkStart, phase.shrinkStart + 0.1]}
                  progress={progress}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
