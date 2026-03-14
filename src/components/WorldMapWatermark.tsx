export function WorldMapWatermark() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Simplified world outline - faint watermark */}
        <path
          fill="white"
          fillOpacity="0.05"
          d="M 150 120 L 280 100 L 380 130 L 420 180 L 400 250 L 350 280 L 280 260 L 200 220 L 150 180 Z M 420 150 L 520 140 L 620 160 L 680 200 L 720 280 L 700 350 L 620 380 L 520 360 L 450 320 L 420 250 Z M 200 280 L 320 300 L 400 350 L 420 420 L 380 480 L 280 460 L 180 400 L 150 340 Z M 720 180 L 820 160 L 920 200 L 950 280 L 920 360 L 820 400 L 720 380 L 650 320 Z M 500 380 L 620 400 L 720 450 L 750 500 L 650 500 L 500 450 L 400 500 L 250 500 L 300 420 Z"
        />
      </svg>
    </div>
  );
}
