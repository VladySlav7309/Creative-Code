// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

const palettes = require('nice-color-palettes');
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const eases = require('eases');
const BezierEasing = require('bezier-easing');

const settings = {
  dimensions: [ 512, 512 ],
  fps: 30,
  duration: 4,
  animate: true,
  context: "webgl",
};

const sketch = ({ context, width, height }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera, we will update its settings on resize
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  // Setup a mesh with geometry + material
  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
      color: random.pick(palette),
      wireframe: false
    }));
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    )
    mesh.scale.multiplyScalar(.9)
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 0%, 25%)'));

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(0, 0, 4);
  scene.add(light);

  const bezierEasingFunc = new BezierEasing(.47,.21,0,1.16);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;
      const zoom = 2;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const zR = Math.sin(playhead * Math.PI * 2);
      scene.rotation.z = bezierEasingFunc(zR);
      // scene.rotation.z = eases.expoInOut(zR);
      // const yR = Math.cos(playhead * Math.PI * 2);
      // scene.rotation.y = eases.quadInOut(yR);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
