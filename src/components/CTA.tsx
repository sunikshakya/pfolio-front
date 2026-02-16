export default function CTA() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <h2 className="font-serif text-3xl font-medium leading-snug text-white sm:text-4xl">
          Ready to create something timeless?
        </h2>
        <a
          href="#contact"
          className="mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/30 px-8 py-3.5 text-sm font-medium tracking-wider text-white uppercase transition-colors hover:border-white hover:bg-white hover:text-black"
        >
          Book a Session
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
        <a
          href="#portfolio"
          className="mt-6 text-sm text-muted transition-colors hover:text-white"
        >
          Explore Full Archive
        </a>
      </div>
    </section>
  );
}
