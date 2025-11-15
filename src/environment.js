import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
export { THREE };

// Environment and renderer configuration
const CAMERA_FOV = 60;
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 1000;
const CAMERA_POSITION = { x: 120, y: 80, z: 130 };
const CAMERA_LOOK_AT = { x: 30, y: 30, z: 0 };
const RENDERER_ANTIALIAS = true;
const SCENE_BG_COLOR = 0x111111;

const DIRECTIONAL_LIGHT_COLOR = 0xffffff;
const DIRECTIONAL_LIGHT_INTENSITY = 1.0;
const DIRECTIONAL_LIGHT_POSITION = { x: 100, y: 200, z: 100 };
const AMBIENT_LIGHT_COLOR = 0xffffff;
const AMBIENT_LIGHT_INTENSITY = 0.5;

const GRID_SIZE = 200;
const GRID_DIVISIONS = 20;
const GRID_COLOR = 0xffffff;
const GRID_OPACITY = 0.25;
// Axes helper to visualize X(red), Y(green), Z(blue) at origin
const SHOW_AXES = true;
const AXES_SIZE = GRID_SIZE * 1.5; // match grid half-extent so axes end at grid edge
const AXES_COLOR = 0xF7F7F7;
const AXES_OPACITY = 0.3; // 軸の透明度

export function setupEnvironment() {
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(SCENE_BG_COLOR);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    CAMERA_NEAR,
    CAMERA_FAR
  );
  camera.position.set(
    CAMERA_POSITION.x,
    CAMERA_POSITION.y,
    CAMERA_POSITION.z
  );
  camera.lookAt(
    CAMERA_LOOK_AT.x,
    CAMERA_LOOK_AT.y,
    CAMERA_LOOK_AT.z
  );

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: RENDERER_ANTIALIAS });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const directionalLight = new THREE.DirectionalLight(
    DIRECTIONAL_LIGHT_COLOR,
    DIRECTIONAL_LIGHT_INTENSITY
  );
  directionalLight.position.set(
    DIRECTIONAL_LIGHT_POSITION.x,
    DIRECTIONAL_LIGHT_POSITION.y,
    DIRECTIONAL_LIGHT_POSITION.z
  );
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(
    AMBIENT_LIGHT_COLOR,
    AMBIENT_LIGHT_INTENSITY
  );
  scene.add(ambientLight);

  // Grid helper
  const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_DIVISIONS, GRID_COLOR, GRID_COLOR);
  gridHelper.material.opacity = GRID_OPACITY;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Axes helper at the world origin to clarify axis directions
  if (SHOW_AXES) {
    const axesHelper = new THREE.AxesHelper(AXES_SIZE);
    // Override default RGB axis colors with pale white and set opacity
    const applyColor = (mat) => {
      if (!mat) return;
      if ('vertexColors' in mat) mat.vertexColors = false;
      if (mat.color) mat.color.set(AXES_COLOR);
      if ('toneMapped' in mat) mat.toneMapped = false;
      if ('opacity' in mat) {
        mat.opacity = AXES_OPACITY;
        mat.transparent = true;
        mat.depthWrite = false; // ソートのため透明軸だけ
      }
    };
    if (Array.isArray(axesHelper.material)) {
      axesHelper.material.forEach(applyColor);
    } else if (axesHelper.material) {
      applyColor(axesHelper.material);
    }
    scene.add(axesHelper);
  }

  // Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}

// Updater registry (modules can register per-frame callbacks)
const updaters = [];
export function addUpdater(fn) {
  if (typeof fn === 'function') updaters.push(fn);
}

// Camera auto-orbit state managed in environment
const autoOrbit = {
  enabled: false,
  target: new THREE.Vector3(CAMERA_LOOK_AT.x, CAMERA_LOOK_AT.y, CAMERA_LOOK_AT.z),
  radius: Math.hypot(CAMERA_POSITION.x - CAMERA_LOOK_AT.x, CAMERA_POSITION.z - CAMERA_LOOK_AT.z),
  height: CAMERA_POSITION.y,
  speed: 0.003,
  angle: 0,
};

export function enableCameraAutoOrbit({ target, radius, speed, height } = {}) {
  if (target) {
    autoOrbit.target = new THREE.Vector3(target.x, target.y, target.z);
  }
  if (typeof radius === 'number') autoOrbit.radius = radius;
  if (typeof speed === 'number') autoOrbit.speed = speed;
  if (typeof height === 'number') autoOrbit.height = height;
  autoOrbit.enabled = true;
}

export function startRenderLoop({ scene, camera, renderer }, onUpdate) {
  // Backward compatibility: accept a single updater, but prefer addUpdater()
  if (typeof onUpdate === 'function') addUpdater(onUpdate);

  function animate() {
    requestAnimationFrame(animate);
    if (autoOrbit.enabled) {
      autoOrbit.angle += autoOrbit.speed;
      const x = autoOrbit.target.x + Math.cos(autoOrbit.angle) * autoOrbit.radius;
      const z = autoOrbit.target.z + Math.sin(autoOrbit.angle) * autoOrbit.radius;
      camera.position.set(x, autoOrbit.height, z);
      camera.lookAt(autoOrbit.target);
    }
    for (const fn of updaters) {
      try { fn(); } catch (_) { /* no-op */ }
    }
    renderer.render(scene, camera);
  }
  animate();
}
