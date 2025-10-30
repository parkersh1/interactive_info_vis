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
      const jitter = p.random(-0.15, 0.15);
      let c;
      if (jitter > 0) {
        c = p.lerpColor(base, p.color(255, 255, 255), jitter);
      } else {
        c = p.lerpColor(base, p.color(0, 0, 0), -jitter);
      }
      p.dotColors.push(c);
    }
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

    // draw circle of dots
    for (let i = 0; i < DOT_COUNT; i++) {
      const angle = (360 / DOT_COUNT) * i - 90; // start at top
      const x = cx + RADIUS * p.cos(angle);
      const y = cy + RADIUS * p.sin(angle);

      p.noStroke();
      p.fill(p.dotColors[i]);
      p.ellipse(x, y, DOT_R * 2, DOT_R * 2);
    }

    // center placeholder (timer will go here later)
    p.push();
    p.noFill();
    p.stroke(200);
    p.strokeWeight(2);
    p.ellipse(cx, cy, 220, 220);
    p.fill(240);
    p.noStroke();
    p.ellipse(cx, cy, 200, 200);
    p.fill(60);
    p.textSize(20);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Timer', cx, cy);
    p.pop();
  };

  // fixed canvas size
  p.windowResized = function () { /* fixed 800x800 canvas */ };
});
