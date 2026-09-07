import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowBigRight, ArrowRight } from "lucide-react";

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutQuart — gentler settle than cubic, less "snap" at the end
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [trigger, target, duration]);

  return value;
}

function StatCounter({
  target,
  label,
  description,
  imageSrc,
}: {
  target: number;
  label: string;
  description: string;
  imageSrc: string;
}) {
  const statRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = statRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "-15% 0px -15% 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(target, 2200, isInView);

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-[90dvw] min-h-[120px] gap-6 lg:gap-0 mb-16 lg:mb-10">
      {/* Image + number grouped as one unit */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end w-full lg:w-auto">
        <div className="w-full md:w-[300px] lg:w-[400px] h-48 md:h-[300px] lg:h-[400px] relative shrink-0">
          <Image
            src={imageSrc}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 300px, 400px"
            alt={`${label}-image`}
            className="rounded-2xl object-cover"
          />
        </div>

        <div
          ref={statRef}
          className="relative flex flex-row items-center text-7xl sm:text-8xl md:text-[150px] lg:text-[220px] font-light leading-none tabular-nums mt-2 md:mt-0"
        >
          <span className="mx-2 md:mx-6 lg:mx-10">+</span>
          <div className="relative">
            <span
              className={`absolute -top-4 md:-top-6 left-1 md:left-2 -rotate-6 bg-orange-500 text-white text-xs md:text-base font-light px-3 md:px-4 py-1 md:py-1.5 rounded-2xl rounded-bl-sm shadow-md z-10 whitespace-nowrap ${
                isInView ? "animate-badge-bounce" : "opacity-0"
              }`}
            >
              {label}
            </span>
            <p>{count.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <p className="text-sm sm:text-base w-full lg:w-96 text-left lg:text-right text-gray-500">{description}</p>
    </div>
  );
}

export default function PlacementAnalytics() {
  return (
    <section
      className="w-full flex flex-col gap-8 items-center py-16 px-6 bg-white"
      id="statistics"
    >
      <div className="flex flex-col justify-evenly items-center w-full">
        <StatCounter
          target={2100}
          label="Total Offers"
          imageSrc="/studio-humi-SgoYeJZsX90-unsplash.jpg"
          description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam ipsa nulla sed, nisi quia, magni ratione excepturi nesciunt odit necessitatibus mollitia voluptatem consequuntur voluptatibus amet quidem tenetur deserunt. Cumque, veritatis."
        />
        <StatCounter
          target={200}
          label="Recruiters"
          imageSrc="/shahid-mehmood-jBgGBq1Q5a0-unsplash.jpg"
          description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam ipsa nulla sed, nisi quia, magni ratione excepturi nesciunt odit necessitatibus mollitia voluptatem consequuntur voluptatibus amet quidem tenetur deserunt. Cumque, veritatis."
        />
        <StatCounter
          target={24}
          label="Highest LPA"
          imageSrc="/willy-the-wizard-8bWvdH7YxRw-unsplash.jpg"
          description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam ipsa nulla sed, nisi quia, magni ratione excepturi nesciunt odit necessitatibus mollitia voluptatem consequuntur voluptatibus amet quidem tenetur deserunt. Cumque, veritatis."
        />
        <Link href="/statistics" className="mt-8 mb-4">
          <Button variant="outline" className="w-56 h-14 px-4 py-3 border border-gray-800 rounded-3xl cursor-pointer">
            <span className="text-md">View Detailed Analytics</span>
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </section>
  );
}
