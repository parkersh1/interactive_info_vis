// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  const CANVAS_SIZE = 800;
  const DOT_COUNT = 60;
  const RADIUS = 230; // radius of the circle where dots sit
  const DOT_R = 12;

  // Calming blue & pink pastel palette
  const PALETTE = [
    '#E3F2FD', // very light blue
    '#BBDEFB', // baby blue
    '#B3E5FC', // sky blue
    '#E1F5FE', // pale azure
    '#FCE4EC', // very light pink
    '#F8BBD0', // soft pink
    '#F3E5F5', // lavender-pink
    '#FCEFF6'  // blush
  ];

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.angleMode(p.DEGREES);
    // precompute dot colors (cycle through palette with slight variation)
    p.dotColors = [];
    for (let i = 0; i < DOT_COUNT; i++) {
      const base = p.color(PALETTE[i % PALETTE.length]);
      // apply a slight brightness/lightness jitter by lerping towards white or black
      const jitter = p.random(-0.12, 0.12);
      let c;
      if (jitter > 0) {
        c = p.lerpColor(base, p.color(255, 255, 255), jitter);
      } else {
        c = p.lerpColor(base, p.color(0, 0, 0), -jitter);
      }
      // make baseline slightly darker overall so pastels read calmer
      c = p.lerpColor(c, p.color(20, 24, 40), 0.08);
      p.dotColors.push(c);
    }
    // Pomodoro timing for this sketch (real time)
    p.pomo = {
      work: 25 * 60 * 1000, // 25 minutes
      short: 5 * 60 * 1000, // 5 minutes
      long: 15 * 60 * 1000, // 15 minutes
      cycles: 3
    };
    p._cycleDuration = (p.pomo.work + p.pomo.short) * p.pomo.cycles + p.pomo.long;
    p._startTime = p.millis();
  };

  p.draw = function () {
    p.background(250, 250, 250);

    // title
    p.fill(50);
    p.textSize(18);
    p.textAlign(p.CENTER, p.TOP);
    p.text('HWK #4. C — Calming Circular Timer', p.width / 2, 12);

    const cx = p.width / 2;
    const cy = p.height / 2;

    // draw circle of dots and animate per-second lighting using a continuous position
    const nowSecFloat = p.millis() / 1000.0;
    const pos = nowSecFloat % 60; // continuous position (seconds + fraction)
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (360 / DOT_COUNT) * i - 90; // start at top
      const x = cx + RADIUS * p.cos(angle);
      const y = cy + RADIUS * p.sin(angle);

      // baseline color slightly dark
      const baseCol = p.dotColors[i];
      const base = p.lerpColor(baseCol, p.color(20, 24, 40), 0.06);

      // compute shortest signed distance around the ring from the current continuous position
      let diff = (i - pos + DOT_COUNT) % DOT_COUNT;
      if (diff > DOT_COUNT / 2) diff -= DOT_COUNT;
      const dist = Math.abs(diff);

      // glow falls off over ~3 positions; use smoothstep for nicer easing
      const falloff = 3.0;
      let glow = Math.max(0, 1 - dist / falloff);
      // smoothstep
      glow = glow * glow * (3 - 2 * glow);

      // bright color to lerp toward when glowing
      const bright = p.lerpColor(baseCol, p.color(255, 255, 255), 0.7);
      const col = p.lerpColor(base, bright, glow);

      // slightly enlarge when glowing
      const r = DOT_R * (1 + 0.55 * glow);

      p.noStroke();
      p.fill(col);
      p.ellipse(x, y, r * 2, r * 2);
    }

    // --- Pomodoro countdown in center ---
    // compute current phase and remaining time
    const now = p.millis();
    const elapsed = (now - (p._startTime || now)) % p._cycleDuration;
    const phases = [];
    for (let i = 0; i < p.pomo.cycles; i++) {
      phases.push({ type: 'work', dur: p.pomo.work });
      phases.push({ type: 'short', dur: p.pomo.short });
    }
    phases.push({ type: 'long', dur: p.pomo.long });

    let t = elapsed;
    let current = phases[phases.length - 1];
    for (let i = 0; i < phases.length; i++) {
      const ph = phases[i];
      if (t <= ph.dur) { current = ph; break; }
      t -= ph.dur;
    }
    const remainingMs = Math.max(0, current.dur - t);

    // format time mm:ss
    function formatTime(ms) {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const minutes = Math.floor(totalSec / 60);
      const seconds = totalSec % 60;
      return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
    }

    // label
    let label = '';
    if (current.type === 'work') label = 'Study Time';
    else if (current.type === 'short') label = 'Short Break';
    else label = 'Long Break';

    // Draw center circle overlay and text
    p.push();
    p.fill(240);
    p.noStroke();
    p.ellipse(cx, cy, 200, 200);
    p.fill(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);
    p.text(formatTime(remainingMs), cx, cy - 6);
    p.textSize(14);
    p.text(label, cx, cy + 26);
    p.pop();

  };

  // fixed canvas size
  p.windowResized = function () { /* fixed 800x800 canvas */ };
});
