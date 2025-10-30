registerSketch('sk2', function (p) {
  // Basic configuration
  const CANVAS_SIZE = 800;

  // Sticky note constructor (uses p in outer scope)
  function StickyNote(x, y, w, h, color, text) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.text = text;
    this.rot = p.random(-0.12, 0.12);
  }
  StickyNote.prototype.draw = function () {
    p.push();
    p.translate(this.x, this.y);
    p.rotate(this.rot);
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill(this.color);
    p.rect(0, 0, this.w, this.h, 8);

    // Slight folded shadow/top-right highlight
    p.fill(0, 0, 0, 20);
    p.rect(this.w * 0.18, -this.h * 0.38, this.w * 0.18, this.h * 0.18, 4);

    // Text
    p.fill(30);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.text(this.text, -this.w / 2 + 10, -this.h / 2 + 10, this.w - 18, this.h - 18);
    p.pop();
  };

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);

    // Create a set of sticky notes
    p.notes = [];
    const palette = ['#FFF176', '#FFCC80', '#F8BBD0', '#C8E6C9']; // yellow, orange, pink, green
    const NOTE_COUNT = 50;
    const margin = 20;
    const noteW = 140;
    const noteH = 120;

    // Create NOTE_COUNT notes at random positions (allow overlap)
    for (let i = 0; i < NOTE_COUNT; i++) {
      const x = p.random(margin + noteW / 2, CANVAS_SIZE - margin - noteW / 2);
      // offset vertically a bit to avoid overlapping the title area at the top
      const y = p.random(margin + noteH / 2 + 30, CANVAS_SIZE - margin - noteH / 2);
      const color = p.random(palette);
      const text = ''; // intentionally empty — notes should have no visible text
      p.notes.push(new StickyNote(x, y, noteW, noteH, color, text));
    }
  };

  p.draw = function () {
    p.background(220);

    // Title
    p.push();
    p.fill(50);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(18);
    p.text('HWK #4. A — Sticky Notes (static)', p.width / 2, 8);
    p.pop();

    // Draw notes
    for (let i = 0; i < p.notes.length; i++) {
      p.notes[i].draw();
    }
  };

  // Keep canvas fixed at 800x800 for this sketch (no automatic resize)
  p.windowResized = function () { /* intentionally left blank to preserve 800x800 */ };
});
