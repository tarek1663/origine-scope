import { Marquee } from '@/components/ui/3d-testimonials';
import Image from "next/image";
import Link from "next/link";
import { FadeInSection } from "@/components/FadeInSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { LandingNavbar } from "@/components/LandingNavbar";

const EARTH_IMAGE_URL =
  "https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg";
  const testimonials = [
    { name: 'Sophie M.', username: '@sophie_m', country: '🇫🇷 France', img: 'https://randomuser.me/api/portraits/women/32.jpg', body: 'I always knew I had Mediterranean roots but seeing 43% North African nearly made me cry.' },
    { name: 'Karim B.', username: '@karim_b', country: '🇧🇪 Belgium', img: 'https://randomuser.me/api/portraits/men/45.jpg', body: 'My family never talked about our origins. OrigineScope gave me a starting point.' },
    { name: 'Laura T.', username: '@laura_t', country: '🇨🇦 Canada', img: 'https://randomuser.me/api/portraits/women/68.jpg', body: 'I shared my results and 6 friends immediately tried it. We compared maps for hours.' },
    { name: 'James R.', username: '@james_r', country: '🇺🇸 USA', img: 'https://randomuser.me/api/portraits/men/22.jpg', body: '38% Irish, 29% Scottish. As an American with no clue where I came from, this was mind blowing.' },
    { name: 'Amira N.', username: '@amira_n', country: '🇲🇦 Morocco', img: 'https://randomuser.me/api/portraits/women/53.jpg', body: '51% North African and 31% Middle Eastern. Exactly what I suspected. Beautiful to see on a map.' },
    { name: 'Diego F.', username: '@diego_f', country: '🇦🇷 Argentina', img: 'https://randomuser.me/api/portraits/men/61.jpg', body: 'My grandmother always said we had indigenous roots. OrigineScope confirmed 22%. She was right.' },
    { name: 'Yuki H.', username: '@yuki_h', country: '🇯🇵 Japan', img: 'https://randomuser.me/api/portraits/women/45.jpg', body: 'Surprisingly accurate. 89% East Asian with 11% Southeast Asian I never knew about.' },
    { name: 'Fatou D.', username: '@fatou_d', country: '🇸🇳 Senegal', img: 'https://randomuser.me/api/portraits/women/89.jpg', body: 'Simple, fast and emotional. I cried when I saw the map. Sent it to my whole family.' },
  ];
  
  function TestimonialCard({ name, username, country, img, body }: typeof testimonials[number]) {
    return (
      <div className="w-72 rounded-xl border border-white/10 bg-[#1a1f2e] p-5 mx-2 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5">
        <div className="flex items-center gap-3 mb-3">
          <Image src={img} alt={name} width={40} height={40} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-white text-[15px] font-medium truncate">{name} <span className="text-xs opacity-60">{country}</span></p>
            <p className="text-white/40 text-xs truncate">{username}</p>
          </div>
        </div>
        <div className="flex gap-0.5 mb-2" aria-hidden>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-[#C1440E] transition-transform duration-200 ${i === 0 ? "text-base" : "text-sm"}`}>★</span>
          ))}
        </div>
        <p className="text-white/70 text-[15px] leading-relaxed">{body}</p>
      </div>
    );
  }
export default function HomePage() {
  return (
    <>
      <LandingNavbar />

      {/* SECTION 1 — Hero: content in top 60%, Earth visible in bottom half */}
      <section
        className="relative min-h-screen flex flex-col px-4 pt-24 pb-0 overflow-hidden"
        style={{
          backgroundImage: `url(${EARTH_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        {/* Overlay: deep blue → terracotta → dark */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(27, 58, 107, 0.7) 0%, rgba(193, 68, 14, 0.4) 50%, rgba(10, 15, 26, 0.8) 100%)",
          }}
          aria-hidden
        />
        {/* Bottom fade: directly into dark (How it works) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[240px] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, #0d1117 100%)",
          }}
          aria-hidden
        />

        <div className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          <p className="text-secondary glow-sand text-sm font-medium mb-8 tracking-wide px-3 py-1.5 rounded-full border border-white/10 bg-white/5 inline-block">
            🌍 Used by 12,000+ people worldwide
          </p>

          <h1
            className="font-heading font-bold text-white text-[36px] leading-tight sm:text-5xl md:text-[72px] mb-6 tracking-tight"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.5), 0 0 1px rgba(0,0,0,0.3)" }}
          >
            You are more than
            <br />
            where you were born.
          </h1>

          <p className="text-secondary text-lg sm:text-xl max-w-[500px] mb-4 leading-relaxed">
            Discover the hidden origins behind your face, your name, and your
            family. In 30 seconds.
          </p>

          <p className="text-secondary/70 text-sm mb-8 tracking-widest font-medium">
            No DNA kit. No waiting. No laboratory.
          </p>

          <Link
            href="/analyze"
            className="rounded-2xl bg-primary text-white font-semibold text-lg sm:text-xl shadow-soft-lg hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 animate-pulse hover:animate-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            style={{ padding: "18px 48px" }}
          >
            Discover my origins →
          </Link>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-8 text-secondary/90 text-sm">
            <span className="flex items-center gap-1.5 transition-all duration-200 hover:opacity-100 opacity-90 hover:scale-105 origin-center">🔒 Secure payment</span>
            <span className="text-white/40 select-none">·</span>
            <span className="flex items-center gap-1.5 transition-all duration-200 hover:opacity-100 opacity-90 hover:scale-105 origin-center">⚡ Result in 30 seconds</span>
            <span className="text-white/40 select-none">·</span>
            <span className="flex items-center gap-1.5 transition-all duration-200 hover:opacity-100 opacity-90 hover:scale-105 origin-center">🎁 Free preview</span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — How it works */}
      <HowItWorksSection />

      {/* SECTION 3 — Testimonials (dark, 3D marquee) — connects seamlessly to How it works */}
      <section className="bg-[#0d1117] py-24 overflow-hidden">
  <div className="text-center mb-16">
    <p className="text-[#C1440E] uppercase tracking-widest text-xs font-semibold mb-3 flex items-center justify-center gap-2">
      <span className="w-1 h-1 rounded-full bg-[#C1440E]" aria-hidden />
      What people say
    </p>
    <h2 className="font-heading text-4xl text-white mb-4 tracking-tight">They discovered who they really are</h2>
    <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">Join 12,000+ people who found their roots</p>
  </div>
  <div
    className="relative flex h-[600px] w-full flex-row items-center justify-center overflow-hidden gap-3"
    style={{ perspective: '300px' }}
  >
    <div
      className="flex flex-row items-center gap-4"
      style={{ transform: 'translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)' }}
    >
      <Marquee vertical pauseOnHover repeat={3} className="[--duration:35s]">
        {testimonials.map((t) => <TestimonialCard key={t.username} {...t} />)}
      </Marquee>
      <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:40s]">
        {testimonials.map((t) => <TestimonialCard key={t.username} {...t} />)}
      </Marquee>
      <Marquee vertical pauseOnHover repeat={3} className="[--duration:45s]">
        {testimonials.map((t) => <TestimonialCard key={t.username} {...t} />)}
      </Marquee>
      <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:38s]">
        {testimonials.map((t) => <TestimonialCard key={t.username} {...t} />)}
      </Marquee>
    </div>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#0d1117]" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0d1117]" />
    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#0d1117]" />
    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#0d1117]" />
  </div>
      </section>

      {/* SECTION 4 — Final CTA */}
      <section
        className="relative min-h-[300px] flex flex-col items-center justify-center py-20 px-4 overflow-hidden"
        style={{ backgroundColor: "#1B3A6B" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden />
        <FadeInSection className="relative z-10 w-full flex flex-col items-center justify-center">
          <h2 className="font-heading text-white text-3xl sm:text-[52px] font-bold text-center leading-tight mb-10 max-w-2xl mx-auto tracking-tight">
            Your story has been waiting.
            <br />
            It&apos;s time to discover it.
          </h2>

          <div className="flex flex-col items-center">
            <Link
              href="/analyze"
              className="rounded-2xl bg-primary text-white font-semibold text-lg sm:text-xl px-8 py-4 hover:bg-primary/90 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(193,68,14,0.5)] active:scale-[0.99] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B3A6B]"
              style={{ boxShadow: "0 0 40px rgba(193, 68, 14, 0.4)" }}
            >
              Start now — it&apos;s free →
            </Link>
            <p className="text-secondary/60 text-sm mt-4 text-center max-w-md">
              Then <span className="font-semibold text-white/80">$4.90</span> to unlock your full results. One-time payment, no
              subscription.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/30 text-xs">
              <Link href="/privacy" className="hover:text-white/60 transition-colors underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/60 transition-colors underline-offset-2 hover:underline">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white/60 transition-colors underline-offset-2 hover:underline">
                Contact
              </Link>
            </div>
            <p className="text-white/20 text-xs mt-4 tracking-wide">
              © 2026 OrigineScope. All rights reserved.
            </p>
          </div>
        </FadeInSection>
      </section>
    </>
  );
}
