'use client';

/*
  RECORDING INSTRUCTIONS:
  1. Open this page in Chrome fullscreen (F11)
  2. Use OBS Studio or Xbox Game Bar (Win+G) to record
  3. Set recording to 1920x1080 at 30fps
  4. Let it play for one full loop (30 seconds)
  5. Upload to YouTube as unlisted
  6. Add YouTube URL to Google Ads
*/

import { useEffect, useState, useCallback } from 'react';

const T = 1000;
const EARTH_BG =
  'https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg';

export default function VideoPage() {
  const [scene1Visible, setScene1Visible] = useState(false);
  const [scene2Visible, setScene2Visible] = useState(false);
  const [scene3Visible, setScene3Visible] = useState(false);
  const [scene4Visible, setScene4Visible] = useState(false);
  const [scene5Visible, setScene5Visible] = useState(false);
  const [blackoutVisible, setBlackoutVisible] = useState(false);

  const [line1Chars, setLine1Chars] = useState<string[]>([]);
  const [line2Chars, setLine2Chars] = useState<string[]>([]);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  const [stat1Visible, setStat1Visible] = useState(false);
  const [stat2Visible, setStat2Visible] = useState(false);
  const [stat3Visible, setStat3Visible] = useState(false);
  const [stat1Struck, setStat1Struck] = useState(false);
  const [stat2Struck, setStat2Struck] = useState(false);
  const [stat3Struck, setStat3Struck] = useState(false);

  const [betterWayVisible, setBetterWayVisible] = useState(false);
  const [mockupVisible, setMockupVisible] = useState(false);
  const [analyzingText, setAnalyzingText] = useState('');
  const [progressAnimate, setProgressAnimate] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);

  const [t1Visible, setT1Visible] = useState(false);
  const [t2Visible, setT2Visible] = useState(false);
  const [t3Visible, setT3Visible] = useState(false);

  const [urgencyVisible, setUrgencyVisible] = useState(false);

  const runTimeline = useCallback(() => {
    setScene1Visible(false);
    setScene2Visible(false);
    setScene3Visible(false);
    setScene4Visible(false);
    setScene5Visible(false);
    setBlackoutVisible(false);
    setLine1Chars([]);
    setLine2Chars([]);
    setSubtitleVisible(false);
    setStat1Visible(false);
    setStat2Visible(false);
    setStat3Visible(false);
    setStat1Struck(false);
    setStat2Struck(false);
    setStat3Struck(false);
    setBetterWayVisible(false);
    setMockupVisible(false);
    setAnalyzingText('');
    setProgressAnimate(false);
    setResultVisible(false);
    setT1Visible(false);
    setT2Visible(false);
    setT3Visible(false);
    setUrgencyVisible(false);

    setTimeout(() => setScene1Visible(true), 100);

    // Line 1 letter by letter from 1s
    const line1 = 'Where are you';
    line1.split('').forEach((char, i) => {
      setTimeout(() => setLine1Chars((prev) => [...prev, char]), 1 * T + i * 80);
    });

    // Line 2 from 2s
    const line2 = 'REALLY from?';
    line2.split('').forEach((char, i) => {
      setTimeout(() => setLine2Chars((prev) => [...prev, char]), 2 * T + i * 80);
    });

    setTimeout(() => setSubtitleVisible(true), 4 * T);

    setTimeout(() => {
      setScene1Visible(false);
      setScene2Visible(true);
    }, 5 * T);

    setTimeout(() => setStat1Visible(true), 5.5 * T);
    setTimeout(() => setStat2Visible(true), 7 * T);
    setTimeout(() => setStat3Visible(true), 8.5 * T);
    setTimeout(() => setStat1Struck(true), 9 * T);
    setTimeout(() => setStat2Struck(true), 9.3 * T);
    setTimeout(() => setStat3Struck(true), 9.6 * T);

    setTimeout(() => {
      setScene2Visible(false);
      setScene3Visible(true);
      setBetterWayVisible(true);
    }, 10 * T);

    setTimeout(() => {
      setBetterWayVisible(false);
      setMockupVisible(true);
      const analyzing = 'Analyzing... Martinez';
      for (let i = 0; i <= analyzing.length; i++) {
        setTimeout(() => setAnalyzingText(analyzing.slice(0, i)), 11 * T + i * 60);
      }
      setProgressAnimate(true);
    }, 11 * T);

    setTimeout(() => {
      setAnalyzingText('Analyzing... Martinez');
      setResultVisible(true);
    }, 13 * T);

    setTimeout(() => {
      setScene3Visible(false);
      setScene4Visible(true);
    }, 18 * T);
    setTimeout(() => setT1Visible(true), 18 * T);
    setTimeout(() => setT2Visible(true), 20 * T);
    setTimeout(() => setT3Visible(true), 22 * T);

    setTimeout(() => {
      setScene4Visible(false);
      setScene5Visible(true);
    }, 24 * T);

    setTimeout(() => setUrgencyVisible(true), 28 * T);
    setTimeout(() => setBlackoutVisible(true), 29.5 * T);
    setTimeout(() => runTimeline(), 31 * T);
  }, []);

  useEffect(() => {
    runTimeline();
  }, [runTimeline]);

  return (
    <div
      className="fixed inset-0 w-[1920px] h-[1080px] overflow-hidden bg-[#0d1117] cursor-none"
      style={{ fontFamily: 'var(--font-playfair), "Playfair Display", serif' }}
    >

      {/* Scene 1 — Hook */}
      <div
        className="absolute inset-0 transition-opacity duration-500 ease-out"
        style={{ opacity: scene1Visible ? 1 : 0 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${EARTH_BG})` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-20">
          <div className="text-[56px] font-semibold text-white tracking-wide mb-4 min-h-[70px] flex flex-wrap justify-center">
            {line1Chars.map((c, i) => (
              <span key={i}>
                {c}
              </span>
            ))}
          </div>
          <div className="text-[72px] font-bold text-[#C1440E] tracking-wide min-h-[90px] flex flex-wrap justify-center">
            {line2Chars.map((c, i) => (
              <span key={i} style={{ opacity: 1 }}>{c}</span>
            ))}
          </div>
          <p
            className="absolute bottom-[180px] text-[28px] text-white/90 transition-opacity duration-[800ms] ease-out"
            style={{ opacity: subtitleVisible ? 1 : 0 }}
          >
            Most people don&apos;t know the full story...
          </p>
        </div>
      </div>

      {/* Scene 2 — Problem */}
      <div
        className="absolute inset-0 bg-[#0d1117] flex flex-col items-center justify-center gap-12 p-20 transition-opacity duration-300"
        style={{ opacity: scene2Visible ? 1 : 0, pointerEvents: scene2Visible ? 'auto' : 'none' }}
      >
        <div
          className={`text-[42px] text-white transition-all duration-500 ease-out ${stat1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
        >
          <span className={`video-stat-text relative inline-block ${stat1Struck ? 'video-stat-struck' : ''}`}>
            23andMe costs $99 💸
          </span>
        </div>
        <div
          className={`text-[42px] text-white transition-all duration-500 ease-out ${stat2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
        >
          <span className={`video-stat-text relative inline-block ${stat2Struck ? 'video-stat-struck' : ''}`}>
            Results take 6-8 weeks ⏳
          </span>
        </div>
        <div
          className={`text-[42px] text-white transition-all duration-500 ease-out ${stat3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
        >
          <span className={`video-stat-text relative inline-block ${stat3Struck ? 'video-stat-struck' : ''}`}>
            Requires a DNA kit 🧬
          </span>
        </div>
      </div>

      {/* Scene 3 — Solution */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ opacity: scene3Visible ? 1 : 0, pointerEvents: scene3Visible ? 'auto' : 'none' }}
      >
        <div className="absolute inset-0 bg-[#C1440E]" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[72px] font-bold text-white transition-opacity duration-1000"
          style={{ opacity: betterWayVisible ? 1 : 0 }}
        >
          There&apos;s a better way.
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${mockupVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-[520px] rounded-3xl bg-[#161b22] p-10 shadow-2xl border border-[#30363d]">
            <div className="text-[28px] font-semibold text-white text-center mb-7">OrigineTrace</div>
            <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-[#21262d] border-[3px] border-[#C1440E] relative overflow-hidden">
              <span
                className="absolute w-6 h-0.5 left-1/2 -ml-3 top-5 bg-[#C1440E]"
                style={{ animation: 'video-bracket-pulse 1.5s ease-in-out infinite' }}
              />
              <span
                className="absolute w-0.5 h-6 left-5 top-1/2 -mt-3 bg-[#C1440E]"
                style={{ animation: 'video-bracket-pulse 1.5s ease-in-out infinite' }}
              />
            </div>
            <div className="text-xl text-white/90 mb-5 min-h-[28px]">
              {analyzingText}
              <span
                className="inline-block w-0.5 h-5 bg-white align-middle ml-0.5"
                style={{ animation: 'video-blink 0.8s step-end infinite' }}
              />
            </div>
            <div className="h-2 bg-[#21262d] rounded overflow-hidden mb-6">
              <div
                className="h-full bg-[#C1440E] transition-[width] duration-[2s] ease-linear"
                style={{ width: progressAnimate ? '100%' : '0%' }}
              />
            </div>
            <div
              className={`transition-opacity duration-700 ${resultVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                className="w-full h-20 rounded-lg mb-3 bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(${EARTH_BG})` }}
              />
              <div className="text-base text-white text-center">
                North African 43% · Southern European 31%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scene 4 — Social proof */}
      <div
        className="absolute inset-0 bg-[#0d1117] flex items-center justify-center gap-8 p-20 transition-opacity duration-300"
        style={{ opacity: scene4Visible ? 1 : 0, pointerEvents: scene4Visible ? 'auto' : 'none' }}
      >
        <div
          className={`w-[380px] rounded-2xl bg-[#161b22] p-7 border border-[#30363d] transition-all duration-500 ease-out ${t1Visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[200px]'}`}
        >
          <div className="text-[22px] text-[#f0c14b] mb-3">⭐⭐⭐⭐⭐</div>
          <div className="text-xl text-white/95 leading-relaxed mb-4">
            &quot;I discovered I was 43% Berber. Mind blown.&quot;
          </div>
          <div className="text-base text-white/70">— Sophie M. 🇫🇷</div>
        </div>
        <div
          className={`w-[380px] rounded-2xl bg-[#161b22] p-7 border border-[#30363d] transition-all duration-500 ease-out ${t2Visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[200px]'}`}
        >
          <div className="text-[22px] text-[#f0c14b] mb-3">⭐⭐⭐⭐⭐</div>
          <div className="text-xl text-white/95 leading-relaxed mb-4">
            &quot;Cheaper than 23andMe and instant results!&quot;
          </div>
          <div className="text-base text-white/70">— James R. 🇺🇸</div>
        </div>
        <div
          className={`w-[380px] rounded-2xl bg-[#161b22] p-7 border border-[#30363d] transition-all duration-500 ease-out ${t3Visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[200px]'}`}
        >
          <div className="text-[22px] text-[#f0c14b] mb-3">⭐⭐⭐⭐⭐</div>
          <div className="text-xl text-white/95 leading-relaxed mb-4">
            &quot;My whole family tried it. We were shocked.&quot;
          </div>
          <div className="text-base text-white/70">— Karim B. 🇧🇪</div>
        </div>
      </div>

      {/* Scene 5 — CTA */}
      <div
        className="absolute inset-0 bg-[#C1440E] flex flex-col items-center justify-center p-20 transition-opacity duration-1000"
        style={{ opacity: scene5Visible ? 1 : 0, pointerEvents: scene5Visible ? 'auto' : 'none' }}
      >
        <div className="text-[64px] font-bold text-white mb-5">Discover your origins</div>
        <div className="text-[28px] text-white/95 mb-4">30 seconds · No DNA kit · Only $4.90</div>
        <div
          className="mt-6 px-12 py-4 bg-white text-[#C1440E] text-2xl font-semibold rounded-xl"
          style={{ animation: 'video-pulse-btn 1.5s ease-in-out infinite' }}
        >
          Try it now → originetrace.com
        </div>
        <p
          className="absolute bottom-[120px] text-2xl text-white/95 transition-opacity duration-500"
          style={{ opacity: urgencyVisible ? 1 : 0 }}
        >
          ⚡ 4,847 people discovered their origins this week
        </p>
      </div>

      {/* Blackout */}
      <div
        className="fixed inset-0 bg-black z-[100] transition-opacity duration-[1500ms] ease-out"
        style={{ opacity: blackoutVisible ? 1 : 0, pointerEvents: 'none' }}
      />
    </div>
  );
}
