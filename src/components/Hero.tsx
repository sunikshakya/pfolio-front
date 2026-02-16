import Image from "next/image";

interface HeroProps {
  heroImageUrl?: string | null;
}

export default function Hero({ heroImageUrl }: HeroProps) {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      {heroImageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={heroImageUrl}
            alt="Hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0b0b0b]" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-[#0b0b0b]" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-white sm:text-7xl md:text-8xl">
          Sunik Shakya
        </h1>
        <div className="mt-6 h-px w-16 bg-white/30" />
        <p className="mt-6 text-base tracking-wide text-white/70 sm:text-lg">
          Capturing the Soul of the Earth
        </p>
      </div>
    </section>
  );
}
