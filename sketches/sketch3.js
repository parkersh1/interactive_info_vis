// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  // Fixed canvas for this sketch
  const CANVAS_SIZE = 800;

  // Bar dimensions (will hold the 'water' level)
  const BAR_W = 140;
  const BAR_H = 600;
  const BAR_RADIUS = 12;

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    // current water level (0..1), starts empty
    p.waterLevel = 0;
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

    // Water fill (from bottom up) — currently p.waterLevel = 0 so empty
    const fillH = BAR_H * p.waterLevel;
    if (fillH > 0) {
      p.noStroke();
      p.fill(100, 170, 220);
      p.rect(barX, barY + BAR_H - fillH, BAR_W, fillH, BAR_RADIUS);
    }

    p.pop();
  };

  // Keep canvas fixed at 800x800 for this sketch
  p.windowResized = function () { /* intentionally fixed size */ };
});
