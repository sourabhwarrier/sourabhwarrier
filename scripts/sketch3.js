// =============================
// IMPORTS
// =============================

import * as THREE from 'https://esm.sh/three@0.161.0';

import { OrbitControls } from 'https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js';

import { FontLoader } from 'https://esm.sh/three@0.161.0/examples/jsm/loaders/FontLoader.js';

import { TextGeometry } from 'https://esm.sh/three@0.161.0/examples/jsm/geometries/TextGeometry.js';


// =============================
// CONFIGURATION
// =============================

// number of concentric spherical shells
const NUM_LAYERS = 4;

// radius of innermost shell
const BASE_RADIUS = 250;

// spacing between shells
const LAYER_SPACING = 200;

// font size
const FONT_SIZE = 50;

// extrusion thickness
const LETTER_DEPTH = 0.1;

// initial camera zoom distance
const CAMERA_DISTANCE = 200;


// =============================
// SYMBOL POOL
// =============================

const SYMBOL_POOL = [

  // lowercase greek
  'α','β','γ','δ','ε','ζ',
  'η','θ','ι','κ','λ','μ',
  'ν','ξ','ο','π','ρ','σ',
  'τ','υ','φ','χ','ψ','ω',

  // uppercase greek
  'Γ','Δ','Θ','Λ','Ξ',
  'Π','Σ','Φ','Ψ','Ω',

  // math symbols
  '∞','∅','∇','∂','∫','∑',
  '∏','√','≈','≠','≤','≥',
  '±','×','÷','∈','∉',
  '∀','∃'
];


// =============================
// VIEWPORT
// =============================

function getViewportSize() {
  return {
    w: document.documentElement.clientWidth,
    h: document.documentElement.clientHeight
  };
}


let scene, camera, renderer, controls;
let outerGroup;
let font;


// =============================
// SETUP
// =============================

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

  camera.position.set(
    0,
    0,
    CAMERA_DISTANCE
  );

  // Renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(w, h);

  document.body.appendChild(
    renderer.domElement
  );

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

  // Main group
  outerGroup = new THREE.Group();
  scene.add(outerGroup);

  // Font loader
  const loader = new FontLoader();

  loader.load(
    'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',

    function (loadedFont) {

      font = loadedFont;

      // build shells
      for (
        let i = 0;
        i < NUM_LAYERS;
        i++
      ) {

        const radius =
          BASE_RADIUS +
          (i * LAYER_SPACING);

        buildLetterSphere(
          radius,
          i
        );
      }
    }
  );

  animate();
}


// =============================
// BUILD SPHERE
// =============================

function buildLetterSphere(
  radius,
  layerIndex
) {

  let index = 0;

  // denser outer shells
  const latSteps =
    4 + (layerIndex * 2);

  const lonSteps =
    6 + (layerIndex * 3);

  // randomized symbol order
  const shellSymbols =
    shuffleArray(
      SYMBOL_POOL
    );

  for (
    let lat = 0;
    lat < latSteps;
    lat++
  ) {

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

    for (
      let lon = 0;
      lon < lonSteps;
      lon++
    ) {

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

      // unique until pool exhausted
      const letter =
        shellSymbols[
          index %
          shellSymbols.length
        ];

      const textGeometry =
        new TextGeometry(
          letter,
          {
            font: font,

            size: FONT_SIZE,

            height: LETTER_DEPTH,

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

      // face center
      mesh.lookAt(
        0,
        0,
        0
      );

      outerGroup.add(mesh);

      index++;
    }
  }
}


// =============================
// ANIMATION LOOP
// =============================

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


// =============================
// HELPERS
// =============================

// map function
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


// random shuffle
function shuffleArray(
  array
) {

  const copy =
    [...array];

  for (
    let i =
      copy.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() *
        (i + 1)
      );

    [
      copy[i],
      copy[j]
    ] =
    [
      copy[j],
      copy[i]
    ];
  }

  return copy;
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