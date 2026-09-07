'use client';

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function RevealBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        box,
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.8,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: box,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, box);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={boxRef} className={className}>
      {children}
    </div>
  );
}

export default RevealBox;