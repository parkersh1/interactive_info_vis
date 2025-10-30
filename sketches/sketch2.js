registerSketch('sk2', function (p) {
  // Basic configuration
  const CANVAS_SIZE = 800;
  const TOTAL_DURATION = 600000; // 10 minutes in ms (shared)
  let startTime = 0; // will be set in setup

  // helper: format ms -> MM:SS
  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${mm}:${ss}`;
  }

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

    // Text (notes are intentionally blank in this sketch)
    if (this.text) {
      p.fill(30);
      p.textSize(14);
      p.textAlign(p.LEFT, p.TOP);
      p.text(this.text, -this.w / 2 + 10, -this.h / 2 + 10, this.w - 18, this.h - 18);
    }

    // Time encoding: three small bars showing hour, minute, second proportionally
    const barW = this.w * 0.36;
    const barH = 6;
    const gap = 4;
    const startX = this.w / 2 - barW - 10;
    const startY = this.h / 2 - barH * 3 - gap * 2 - 8;

    // Hour (0-23) normalized to 0-1
    const hNorm = p.hour() / 23;
    p.noStroke();
    p.fill(80, 140, 200, 220);
    p.rect(startX, startY, barW * hNorm, barH, 3);

    // Minute (0-59) normalized
    const mNorm = p.minute() / 59;
    p.fill(120, 200, 140, 220);
    p.rect(startX, startY + barH + gap, barW * mNorm, barH, 3);

    // Second (0-59) normalized
    const sNorm = p.second() / 59;
    p.fill(220, 160, 80, 220);
    p.rect(startX, startY + (barH + gap) * 2, barW * sNorm, barH, 3);
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
  // set shared startTime for timer and scheduling
  startTime = p.millis();
  const interval = TOTAL_DURATION / NOTE_COUNT; // ms between each note start
    
    // Physics / timing properties for each note
    for (let i = 0; i < p.notes.length; i++) {
      const note = p.notes[i];
      note.vx = p.random(-0.3, 0.3);
      note.vy = 0;
      note.ay = 0.18; // gravity
      note.isFalling = false; // becomes true when its drop time is reached
      note.dropAt = startTime + i * interval; // absolute millis when it should start falling
      note.gone = false; // set true when fully off-screen
    }
  };

  p.draw = function () {
    p.background(220);

    // Title
    p.push();
    p.fill(50);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(18);
  p.text('HWK #4. A — Sticky Notes', p.width / 2, 8);
    p.pop();

    const now = p.millis();

    // Update and draw notes. When their scheduled time is reached, they start falling.
    for (let i = 0; i < p.notes.length; i++) {
      const n = p.notes[i];
      if (!n.gone) {
        if (!n.isFalling && now >= n.dropAt) {
          n.isFalling = true;
          // give them a little kick when they start falling
          n.vx += p.random(-0.5, 0.5);
          n.vy += p.random(0, 1);
        }

        if (n.isFalling) {
          n.vy += n.ay;
          n.x += n.vx;
          n.y += n.vy;
          n.rot += n.vx * 0.02; // slight spin

          // If the note is well past the bottom, mark gone
          if (n.y - n.h / 2 > CANVAS_SIZE + 60) {
            n.gone = true;
          }
        }

        // Draw only if not gone
        if (!n.gone) n.draw();
      }
    }

    // Optionally: show remaining count in the corner (useful for debugging)
    p.push();
    p.fill(60);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.textSize(12);
    const remaining = p.notes.filter(n => !n.gone).length;
    p.text(`${remaining} notes remaining`, p.width - 8, p.height - 8);
    p.pop();

    // Bottom-left timer: show elapsed and remaining (MM:SS)
    p.push();
    p.fill(60);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.textSize(12);
    const elapsedMs = Math.max(0, now - startTime);
    const remainingMs = Math.max(0, TOTAL_DURATION - elapsedMs);
    p.text(`Elapsed: ${formatTime(elapsedMs)}`, 8, p.height - 8);
    p.text(`Remaining: ${formatTime(remainingMs)}`, 8, p.height - 26);
    p.pop();
  };

  // Keep canvas fixed at 800x800 for this sketch (no automatic resize)
  p.windowResized = function () { /* intentionally left blank to preserve 800x800 */ };
});
