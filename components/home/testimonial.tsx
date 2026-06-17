import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TestimonialCardProps {
  name: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  youtubeId?: string;
  isYoutube?: boolean;
  className?: string;
}

export function getYoutubeThumbnail(
  youtubeId?: string,
  videoUrl?: string,
): string | undefined {
  if (youtubeId)
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  if (videoUrl) {
    const match = videoUrl.match(/embed\/([a-zA-Z0-9_-]+)/);
    if (match)
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return undefined;
}

export function TestimonialCard({
  name,
  description,
  videoUrl,
  thumbnailUrl,
  youtubeId,
  isYoutube,
  className,
}: TestimonialCardProps) {
  const [playing, setPlaying] = useState(false);

  const thumbnail = thumbnailUrl ?? getYoutubeThumbnail(youtubeId, videoUrl);

  return (
    <Card
      className={cn(
        "overflow-hidden h-full flex flex-col pt-0 border border-border",
        className,
      )}
    >
      {videoUrl && (
        <div className="relative aspect-video w-full bg-black flex-shrink-0">
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={videoUrl}
              title={`${name}'s testimonial`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 w-full h-full flex items-center justify-center group"
              aria-label={`Play ${name}'s testimonial`}
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={`${name} testimonial thumbnail`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <span className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
              <span className="relative w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                <svg
                  className="w-6 h-6 text-gray-900 ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      )}
      <CardHeader className="gap-2 pt-4 pb-4 mt-2 mb-2">
        {isYoutube && (
          <Badge
            variant="destructive"
            className="w-fit flex items-center gap-1"
          >
            <svg
              className="w-3 h-3 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
            </svg>
            YouTube
          </Badge>
        )}
        <CardTitle className="text-lg flex justify-between">
          <h1>{name}</h1>
          <Quote />
        </CardTitle>
        <CardDescription>
          <p className="italic text-sm leading-relaxed text-foreground/80">
            {description}
          </p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

const primary = {
  name: "Abhiram A R",
  description:
    "The CGPU cell provided immense support throughout the placement season. The mock interviews and technical workshops were instrumental in helping me secure a position at my dream company. I'm truly grateful for the guidance and opportunities provided by the college.",
  videoUrl:
    "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&loop=1&modestbranding=1",
  youtubeId: "tOwjEOt1zYU",
  isYoutube: true,
};

const secondary = [
  {
    name: "Sarah Johnson",
    description:
      "The placement cell was incredibly helpful in preparing me for the technical rounds. I landed a dream job at a top tech firm!",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
  },
  {
    name: "Michael Chen",
    description:
      "The training programs here are top-notch. I learned more in two months than I did in a whole year of self-study.",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
  },
  {
    name: "Elena Rodriguez",
    description:
      "Great experience with the mock interviews. It really boosted my confidence for the actual placement rounds.",
    videoUrl:
      "https://www.youtube.com/embed/tOwjEOt1zYU?controls=1&autoplay=1&mute=1&modestbranding=1",
    youtubeId: "tOwjEOt1zYU",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-16 md:py-24 border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
        <Badge variant="outline">Testimonials</Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Words from Those Who{" "}
          <span className="italic font-normal text-muted-foreground">
            lived it
          </span>
        </h2>
        <div className="flex flex-col gap-4 w-full mt-8">
          {/* Primary large card */}
          <TestimonialCard {...primary} />

          {/* Three sub cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {secondary.map((t, i) => (
              <TestimonialCard key={i} {...t} />
            ))}
          </div>
        </div>

        <Link href="/testimonials">
          <Button
            variant="link"
            className="mt-8 cursor-pointer text-primary-red hover:text-primary-red-hover font-semibold"
          >
            See More Testimonials
          </Button>
        </Link>
      </div>
    </section>
  );
}
