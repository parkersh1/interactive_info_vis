// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  // Fixed canvas for this sketch
  const CANVAS_SIZE = 800;

  // Bar dimensions (will hold the 'water' level)
  const BAR_W = 140;
  const BAR_H = 600;
  const BAR_RADIUS = 12;

  // helper: format ms -> MM:SS
  function formatTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  }

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    // current water level (0..1), starts empty
    p.waterLevel = 0;

    // Pomodoro timing configuration (ms)
    p.pomo = {
      work: 25 * 60 * 1000,   // 25 minutes fill
      short: 5 * 60 * 1000,   // 5 minutes deplete
      long: 15 * 60 * 1000,   // 15 minutes empty
      cycles: 3               // repeat fill+deplete this many times before long empty
    };

    // compute total cycle duration and start time (real-time durations)
    p._cycleDuration = (p.pomo.work + p.pomo.short) * p.pomo.cycles + p.pomo.long;
    p._startTime = p.millis();
  };

  p.draw = function () {
    p.background(240, 240, 245);

    // Title
    p.fill(50);
    p.textSize(20);
    p.textAlign(p.CENTER, p.TOP);
    p.text('HWK #4. B — Pomodoro Water Bar', p.width / 2, 12);

    // Centered bar container
    const cx = p.width / 2;
    const cy = p.height / 2;
    const barX = cx - BAR_W / 2;
    const barY = cy - BAR_H / 2;

    // Container outline
    p.push();
    p.stroke(80);
    p.strokeWeight(2);
    p.fill(245);
    p.rect(barX, barY, BAR_W, BAR_H, BAR_RADIUS);

    // Update water level based on Pomodoro schedule
    const now = p.millis();
    const elapsed = (now - (p._startTime || now)) % p._cycleDuration;

    // Build phase list using real durations: [fill(work), deplete(short)] x cycles, then empty(long)
    const phases = [];
    for (let i = 0; i < p.pomo.cycles; i++) {
      phases.push({ type: 'fill', dur: p.pomo.work });
      phases.push({ type: 'deplete', dur: p.pomo.short });
    }
    phases.push({ type: 'empty', dur: p.pomo.long });

    // Find current phase and progress (0..1)
    let t = elapsed;
    let current = phases[phases.length - 1];
    let phaseStart = 0;
    for (let i = 0; i < phases.length; i++) {
      const ph = phases[i];
      if (t <= ph.dur) {
        current = ph;
        break;
      }
      t -= ph.dur;
      phaseStart += ph.dur;
    }
    const phaseProgress = Math.min(1, t / current.dur);

    // Map phase progress to water level
    if (current.type === 'fill') {
      p.waterLevel = phaseProgress; // 0 -> 1 over work
    } else if (current.type === 'deplete') {
      p.waterLevel = 1 - phaseProgress; // 1 -> 0 over short
    } else { // empty
      p.waterLevel = 0;
    }

    // Water fill (from bottom up)
    const fillH = BAR_H * p.waterLevel;
    if (fillH > 0) {
      p.noStroke();
      p.fill(100, 170, 220);
      p.rect(barX, barY + BAR_H - fillH, BAR_W, fillH, BAR_RADIUS);
    }

    p.pop();

    // --- Timer display: show current phase and time remaining until next study/break ---
    const remainingMs = Math.max(0, current.dur - t);
    let phaseLabel = 'Long Break';
    if (current.type === 'fill') phaseLabel = 'Study (work)';
    else if (current.type === 'deplete') phaseLabel = 'Short Break';

    // Textual timer (bottom-left)
    p.push();
    p.fill(40);
    p.textSize(14);
    p.textAlign(p.LEFT, p.BOTTOM);
    // Message: Time until the phase ends (reworded as requested)
    const caption = (current.type === 'fill') ? 'Time until break:' : 'Time until study:';
    p.text(`${phaseLabel}`, 12, p.height - 40);
    p.text(`${caption} ${formatTime(remainingMs)}`, 12, p.height - 22);
    p.pop();

  // (Top-right time visuals removed per user request)
  };

  // Keep canvas fixed at 800x800 for this sketch
  p.windowResized = function () { /* intentionally fixed size */ };
});
