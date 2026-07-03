let angle;
let trunkLength;

// Get CSS viewport size (similar to 100vw / 100vh)
function getViewportSize() {
  return {
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
  };
}

function setup() {
  const { w, h } = getViewportSize();

  createCanvas(w, h);

  colorMode(RGB);
  angleMode(DEGREES);

  calculateDimensions();
}

function draw() {
  background(255);

  // Mouse controls branch angle
  angle = (mouseX / width) * 90;
  angle = min(angle, 90);

  // Start from bottom center
  translate(width / 2, height);

  // Draw main trunk
  stroke(0, 0, 0);
  line(0, 0, 0, -trunkLength);

  // Move upward
  translate(0, -trunkLength);

  // Draw recursive branches
  branch(trunkLength, 0);
}

function branch(h, level) {
  // Change color based on recursion depth
  stroke(0, 0, 0);

  // Shrink each branch
  h *= 0.66;

  // Stop recursion when branch too small
  if (h > 3) {
    // Right branch
    push();
    rotate(angle);
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h, level + 1);
    pop();

    // Left branch
    push();
    rotate(-angle);
    line(0, 0, 0, -h);
    translate(0, -h);
    branch(h, level + 1);
    pop();
  }
}

// Handle browser resize
function windowResized() {
  const { w, h } = getViewportSize();

  resizeCanvas(w, h);
  calculateDimensions();
}

// Scale tree based on viewport
function calculateDimensions() {
  trunkLength = min(width, height) * 0.30;
}