// =============================
// IMPORTS (NEW)
// =============================

import * as THREE from 'https://esm.sh/three@0.161.0';

import { OrbitControls } from 'https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js';

import { FontLoader } from 'https://esm.sh/three@0.161.0/examples/jsm/loaders/FontLoader.js';

import { TextGeometry } from 'https://esm.sh/three@0.161.0/examples/jsm/geometries/TextGeometry.js';

// =============================
// GREEK LETTER SPHERES (3D)
// =============================

// viewport helper
function getViewportSize() {
  return {
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
  };
}


// greek alphabet
const greekLetters = [
  'α','β','γ','δ','ε','ζ',
  'η','θ','ι','κ','λ','μ',
  'ν','ξ','ο','π','ρ','σ',
  'τ','υ','φ','χ','ψ','ω'
];


let scene, camera, renderer, controls;
let outerGroup;
let font;


// ----------------------------
// SETUP
// ----------------------------
function init() {

  const { w, h } = getViewportSize();

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    w / h,
    0.1,
    3000
  );

  camera.position.set(0, 0, 1200);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(w, h);

  document.body.appendChild(renderer.domElement);

  // Orbit controls
  controls = new OrbitControls(
    camera,
    renderer.domElement
  );

  controls.enableDamping = true;

  // Lighting
  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      0.9
    );

  scene.add(ambient);

  const directional =
    new THREE.DirectionalLight(
      0xffffff,
      1.5
    );

  directional.position.set(
    5,
    5,
    5
  );

  scene.add(directional);

  // Main object holder
  outerGroup = new THREE.Group();
  scene.add(outerGroup);

  // Font loader
  const loader = new FontLoader();

  loader.load(
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',

    function (loadedFont) {

      font = loadedFont;

      // 2 shells
      buildLetterSphere(250);
      buildLetterSphere(450);
    }
  );

  animate();
}


// ----------------------------
// BUILD SPHERE
// ----------------------------
function buildLetterSphere(radius) {

  let index = 0;

  const latSteps = 4;
  const lonSteps = 6;

  for (let lat = 0; lat < latSteps; lat++) {

    const theta =
      THREE.MathUtils.degToRad(
        map(
          lat,
          0,
          latSteps - 1,
          20,
          160
        )
      );

    for (let lon = 0; lon < lonSteps; lon++) {

      const phi =
        THREE.MathUtils.degToRad(
          map(
            lon,
            0,
            lonSteps,
            0,
            360
          )
        );

      const letter =
        greekLetters[index];

      const textGeometry =
        new TextGeometry(
          letter,
          {
            font: font,

            size: 40,

            height: 18,

            curveSegments: 12,

            bevelEnabled: true,

            bevelThickness: 2,

            bevelSize: 1.5
          }
        );

      textGeometry.center();

      const material =
        new THREE.MeshStandardMaterial({
          color: 0x000000
        });

      const mesh =
        new THREE.Mesh(
          textGeometry,
          material
        );

      // spherical coordinates
      const x =
        radius *
        Math.sin(theta) *
        Math.cos(phi);

      const y =
        radius *
        Math.cos(theta);

      const z =
        radius *
        Math.sin(theta) *
        Math.sin(phi);

      mesh.position.set(
        x,
        y,
        z
      );

      // face toward center
      mesh.lookAt(
        0,
        0,
        0
      );

      outerGroup.add(mesh);

      index++;

      if (
        index >= greekLetters.length
      ) {
        return;
      }
    }
  }
}


// ----------------------------
// ANIMATION LOOP
// ----------------------------
function animate() {

  requestAnimationFrame(
    animate
  );

  outerGroup.rotation.y +=
    0.002;

  controls.update();

  renderer.render(
    scene,
    camera
  );
}


// ----------------------------
// HELPERS
// ----------------------------
function map(
  value,
  a1,
  a2,
  b1,
  b2
) {
  return (
    b1 +
    ((value - a1) *
      (b2 - b1)) /
      (a2 - a1)
  );
}


// resize handler
window.addEventListener(
  'resize',
  () => {

    const { w, h } =
      getViewportSize();

    camera.aspect =
      w / h;

    camera.updateProjectionMatrix();

    renderer.setSize(
      w,
      h
    );
  }
);


// start
init();