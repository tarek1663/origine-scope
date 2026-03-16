"use client";
import { useEffect, useState } from "react";

export default function VideoPage() {
  const [scene, setScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [particles, setParticles] = useState<{x:number,y:number,size:number,speed:number,opacity:number}[]>([]);

  useEffect(() => {
    const p = Array.from({length: 80}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(p);

    const timeline = [
      { time: 0, scene: 0 },
      { time: 5000, scene: 1 },
      { time: 10000, scene: 2 },
      { time: 18000, scene: 3 },
      { time: 24000, scene: 4 },
      { time: 30000, scene: 0 },
    ];

    const timers = timeline.map(({ time, scene }) =>
      setTimeout(() => setScene(scene), time)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (scene === 2) {
      const text = "Martinez";
      let i = 0;
      setTyped("");
      setProgress(0);
      setShowResult(false);
      const typing = setInterval(() => {
        if (i < text.length) {
          setTyped(text.slice(0, ++i));
        } else {
          clearInterval(typing);
          let p = 0;
          const bar = setInterval(() => {
            if (p < 100) {
              setProgress(++p);
            } else {
              clearInterval(bar);
              setShowResult(true);
            }
          }, 20);
        }
      }, 100);
      return () => clearInterval(typing);
    }
  }, [scene]);

  return (
    <div style={{
      position: "fixed", inset: 0, overflow: "hidden",
      background: "#0d1117", cursor: "none",
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: "white",
          opacity: p.opacity,
          animation: `float ${p.speed * 10}s linear infinite`,
        }}/>
      ))}

      {/* SCENE 0 — Hook */}
      {scene === 0 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.8s ease",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(https://eoimages.gsfc.nasa.gov/images/imagerecords/79000/79765/dnb_land_ocean_ice.2012.3600x1800.jpg)",
            backgroundSize: "cover", backgroundPosition: "center",
            opacity: 0.4,
          }}/>
          <div style={{ position: "relative", textAlign: "center", zIndex: 1 }}>
            <div style={{
              fontSize: 22, color: "#C1440E", letterSpacing: 6,
              textTransform: "uppercase", marginBottom: 24,
              animation: "slideUp 1s ease 0.5s both",
            }}>OrigineTrace</div>
            <div style={{
              fontSize: 96, fontFamily: "Playfair Display, serif",
              color: "white", lineHeight: 1.1, fontWeight: 700,
              animation: "slideUp 1s ease 1s both",
            }}>Where are you</div>
            <div style={{
              fontSize: 96, fontFamily: "Playfair Display, serif",
              color: "#C1440E", lineHeight: 1.1, fontWeight: 700,
              animation: "slideUp 1s ease 1.5s both",
              textShadow: "0 0 60px rgba(193,68,14,0.8)",
            }}>REALLY from?</div>
            <div style={{
              fontSize: 24, color: "rgba(255,255,255,0.6)",
              marginTop: 32, animation: "fadeIn 1s ease 3s both",
            }}>Most people don&apos;t know the full story...</div>
          </div>
          <div style={{
            position: "absolute", bottom: 40,
            display: "flex", gap: 8, animation: "fadeIn 1s ease 4s both",
          }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i === 0 ? "#C1440E" : "rgba(255,255,255,0.3)",
              }}/>
            ))}
          </div>
        </div>
      )}

      {/* SCENE 1 — Problem */}
      {scene === 1 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 40, animation: "fadeIn 0.5s ease",
        }}>
          <div style={{
            fontSize: 28, color: "rgba(255,255,255,0.4)",
            letterSpacing: 4, textTransform: "uppercase",
            animation: "slideUp 0.8s ease both",
          }}>Did you know?</div>
          {[
            { text: "Most people never find their true origins 🌍", delay: "0.3s" },
            { text: "DNA tests cost hundreds of dollars 💸", delay: "1s" },
            { text: "And take weeks to get results ⏳", delay: "1.7s" },
          ].map((item, i) => (
            <div key={i} style={{
              fontSize: 48, color: "white", fontWeight: 700,
              textAlign: "center", maxWidth: 800,
              animation: `slideUp 0.8s ease ${item.delay} both`,
            }}>
              {item.text}
            </div>
          ))}
          <div style={{
            fontSize: 32, color: "#C1440E", fontWeight: 700,
            animation: "slideUp 0.8s ease 2.8s both",
            textAlign: "center",
          }}>
            Until now. ✨
          </div>
        </div>
      )}

      {/* SCENE 2 — Solution */}
      {scene === 2 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.5s ease",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24, padding: "48px 64px",
            width: 600, textAlign: "center",
            boxShadow: "0 0 100px rgba(193,68,14,0.3)",
          }}>
            <div style={{
              fontSize: 13, color: "#C1440E", letterSpacing: 4,
              textTransform: "uppercase", marginBottom: 32,
            }}>OrigineTrace AI</div>

            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              border: "3px solid #C1440E", margin: "0 auto 24px",
              position: "relative", display: "flex",
              alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 40px rgba(193,68,14,0.5)",
            }}>
              <div style={{ fontSize: 48 }}>👤</div>
              {[0,1,2,3].map(i => (
                <div key={i} style={{
                  position: "absolute",
                  width: 16, height: 16,
                  borderTop: i < 2 ? "3px solid #C1440E" : "none",
                  borderBottom: i >= 2 ? "3px solid #C1440E" : "none",
                  borderLeft: i % 2 === 0 ? "3px solid #C1440E" : "none",
                  borderRight: i % 2 === 1 ? "3px solid #C1440E" : "none",
                  top: i < 2 ? -3 : "auto", bottom: i >= 2 ? -3 : "auto",
                  left: i % 2 === 0 ? -3 : "auto", right: i % 2 === 1 ? -3 : "auto",
                }}/>
              ))}
            </div>

            <div style={{
              fontSize: 28, color: "white", marginBottom: 24,
              fontFamily: "monospace",
            }}>
              {typed}<span style={{ animation: "blink 1s infinite" }}>|</span>
            </div>

            <div style={{
              height: 8, background: "rgba(255,255,255,0.1)",
              borderRadius: 4, overflow: "hidden", marginBottom: 24,
            }}>
              <div style={{
                height: "100%", width: `${progress}%`,
                background: "linear-gradient(90deg, #C1440E, #EF9F27)",
                borderRadius: 4, transition: "width 0.02s linear",
                boxShadow: "0 0 20px rgba(193,68,14,0.8)",
              }}/>
            </div>

            {showResult && (
              <div style={{ animation: "scaleIn 0.5s ease" }}>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                  {[
                    { label: "North African", pct: "43%", color: "#EF9F27" },
                    { label: "Southern European", pct: "31%", color: "#C1440E" },
                    { label: "Middle Eastern", pct: "18%", color: "#3B8BD4" },
                    { label: "Other", pct: "8%", color: "#888" },
                  ].map((r, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.06)",
                      border: `1px solid ${r.color}40`,
                      borderLeft: `3px solid ${r.color}`,
                      borderRadius: 8, padding: "8px 16px",
                      color: "white", fontSize: 14,
                    }}>
                      <span style={{ color: r.color, fontWeight: 700 }}>{r.pct}</span> {r.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCENE 3 — Social proof */}
      {scene === 3 && (
        <div style={{
          position: "absolute", inset: 0, display: "flex",
          flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 24, animation: "fadeIn 0.5s ease",
        }}>
          <div style={{
            fontSize: 20, color: "rgba(255,255,255,0.4)",
            letterSpacing: 4, textTransform: "uppercase", marginBottom: 16,
          }}>What people say</div>
          {[
            { text: "I discovered I was 43% Berber. Mind blown.", name: "Sophie M.", flag: "🇫🇷", delay: "0s" },
            { text: "Cheaper than 23andMe and instant results!", name: "James R.", flag: "🇺🇸", delay: "0.8s" },
            { text: "My whole family tried it. We were shocked.", name: "Karim B.", flag: "🇧🇪", delay: "1.6s" },
          ].map((t, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, padding: "20px 32px",
              width: 560, animation: `slideLeft 0.8s ease ${t.delay} both`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}>
              <div style={{ color: "#EF9F27", fontSize: 18, marginBottom: 8 }}>★★★★★</div>
              <div style={{ color: "white", fontSize: 20, marginBottom: 12 }}>&quot;{t.text}&quot;</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>{t.flag} {t.name}</div>
            </div>
          ))}
        </div>
      )}

      {/* SCENE 4 — CTA */}
      {scene === 4 && (
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #C1440E, #8B2500)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.5s ease",
        }}>
          <div style={{
            fontSize: 96, fontFamily: "Playfair Display, serif",
            color: "white", fontWeight: 700, textAlign: "center",
            lineHeight: 1.1, animation: "scaleIn 0.8s ease both",
            textShadow: "0 4px 40px rgba(0,0,0,0.3)",
          }}>Discover your<br/>origins</div>
          <div style={{
            fontSize: 28, color: "rgba(255,255,255,0.8)",
            marginTop: 24, animation: "slideUp 0.8s ease 0.5s both",
          }}>30 seconds · No DNA kit · Only $4.90</div>
          <div style={{
            marginTop: 40, background: "white", color: "#C1440E",
            padding: "20px 48px", borderRadius: 50,
            fontSize: 24, fontWeight: 700,
            animation: "scaleIn 0.8s ease 1s both",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>Try it now → originetrace.com</div>
          <div style={{
            marginTop: 32, color: "rgba(255,255,255,0.7)",
            fontSize: 18, animation: "fadeIn 1s ease 2s both",
          }}>⚡ 4,847 people discovered their origins this week</div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(60px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.8) } to { opacity: 1; transform: scale(1) } }
        @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes strikethrough { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes float { 0% { transform: translateY(0) } 100% { transform: translateY(-100vh) } }
      `}</style>
    </div>
  );
}
