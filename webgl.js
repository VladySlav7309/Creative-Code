// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

const palettes = require('nice-color-palettes');
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [ 512, 512 ],
  fps: 30,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
};

const sketch = ({ context, width, height }) => {
  console.log(`width : ${width}, height: ${height}`);
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('hsl(0, 0%, 95%)', 1);

  // Setup a camera, we will update its settings on resize
  const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -1, 1, 1000);

  // Setup your scene
  const scene = new THREE.Scene();
  global.scene = scene;

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
    mesh.scale.multiplyScalar(1.9)
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 0%, 25%)'));

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(3, -3, 0);
  scene.add(light);

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      console.log(`viewportWidth : ${viewportWidth}, viewportHeight: ${viewportHeight}`)
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.85;

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
      camera.aspect = aspect * 3;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      scene.rotation.y = playhead * Math.PI * 2;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
