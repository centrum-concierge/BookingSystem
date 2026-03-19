"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Slide = {
  src: string;
  name: string;
  location: string;
};

type HeroSlideshowProps = {
  slides: Slide[];
};

export default function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = slides.length;

  useEffect(() => {
    if (slideCount <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % slideCount);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [slideCount]);

  const activeSlide = useMemo(() => {
    if (slideCount === 0) {
      return null;
    }

    return slides[activeIndex];
  }, [activeIndex, slideCount, slides]);

  if (!activeSlide) {
    return (
      <div className="relative min-h-[380px] w-full bg-[#324a74] sm:min-h-[460px] lg:min-h-[640px] lg:w-[52vw] lg:max-w-[780px]" />
    );
  }

  return (
    <div className="relative min-h-[380px] w-full sm:min-h-[460px] lg:min-h-[640px] lg:w-[52vw] lg:max-w-[780px]">
      {slides.map((slide, index) => (
        <Image
          key={`${slide.src}-${index}`}
          src={slide.src}
          alt={slide.name}
          fill
          className={`object-cover transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 52vw"
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(11,24,43,0.08),_rgba(11,24,43,0.34))]" />
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 bg-[linear-gradient(180deg,_transparent,_rgba(11,24,43,0.8))] px-6 pb-7 pt-20 text-white md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#e5edf7]">
          {activeSlide.location}
        </p>
        <h2 className="font-display text-4xl md:text-5xl">{activeSlide.name}</h2>
      </div>
    </div>
  );
}