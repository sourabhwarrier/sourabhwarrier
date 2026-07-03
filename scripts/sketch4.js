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

const NUM_LAYERS = 6;
const BASE_RADIUS = 250;
const LAYER_SPACING = 200;
const FONT_SIZE = 50;
const LETTER_DEPTH = 0.1;
const CAMERA_DISTANCE = 300;

// NEW — local font path
const FONT_PATH =
  './fonts/NotoSansMath-Regular.json';


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

  // math operators
  '∞','∅','∇','∂','∫','∑',
  '∏','√','≈','≠','≤','≥',
  '±','×','÷',

  // set theory
  '∈','∉','⊂','⊃','∪','∩',

  // logic
  '∀','∃','¬','⇒','⇔',

  // misc
  '⊕','⊗','∝','∴','∵'
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

  const { w, h } =
    getViewportSize();

  scene =
    new THREE.Scene();

  scene.background =
    new THREE.Color(
      0xffffff
    );

  camera =
    new THREE.PerspectiveCamera(
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

  renderer =
    new THREE.WebGLRenderer({
      antialias: true
    });

  renderer.setSize(
    w,
    h
  );

  document.body.appendChild(
    renderer.domElement
  );

  controls =
    new OrbitControls(
      camera,
      renderer.domElement
    );

  controls.enableDamping =
    true;

  const ambient =
    new THREE.AmbientLight(
      0xffffff,
      0.9
    );

  scene.add(
    ambient
  );

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

  scene.add(
    directional
  );

  outerGroup =
    new THREE.Group();

  scene.add(
    outerGroup
  );

  const loader =
    new FontLoader();

  // changed path
  loader.load(
    FONT_PATH,

    function (
      loadedFont
    ) {

      font =
        loadedFont;

      for (
        let i = 0;
        i < NUM_LAYERS;
        i++
      ) {

        const radius =
          BASE_RADIUS +
          (
            i *
            LAYER_SPACING
          );

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

  const latSteps =
    4 +
    (
      layerIndex * 2
    );

  const lonSteps =
    6 +
    (
      layerIndex * 3
    );

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

      mesh.lookAt(
        0,
        0,
        0
      );

      outerGroup.add(
        mesh
      );

      index++;
    }
  }
}


// =============================
// ANIMATION
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

function map(
  value,
  a1,
  a2,
  b1,
  b2
) {
  return (
    b1 +
    (
      (
        value - a1
      ) *
      (
        b2 - b1
      )
    ) /
    (
      a2 - a1
    )
  );
}

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
        (
          i + 1
        )
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

init();