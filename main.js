const cameraDistance = 3; // Distance from picture
const period = 60; // Rotation time in seconds

// Variables for rotating the background
var clock = new THREE.Clock();
var matrix = new THREE.Matrix4();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, cameraDistance);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

function reportWindowSize() {
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onresize = reportWindowSize;

renderer.render(scene, camera);

// Picture
var picture;

const textureLoader = new THREE.TextureLoader();
textureLoader.load(
  // resource URL
  'textures/profile_photo.jpg',

  // onLoad callback
  function (texture) {
    // in this example we create the material when the texture is loaded
    const material = new THREE.MeshBasicMaterial({
      map: texture
    });
    picture = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
    scene.add(picture);
  },

  // onProgress callback currently not supported
  undefined,

  // onError callback
  function (err) {
    console.error('Could not retrieve profile picture with following error:\n', err);
  }
);

// Pyramides

function addPyramide() {
  const geometry = new THREE.ConeGeometry(1, 1, 3, 1, true);
  const material = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
  const cone = new THREE.Line(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  cone.rotateX(THREE.MathUtils.randFloatSpread(180));
  cone.position.set(x, y, z);
  scene.add(cone);
}

Array(100).fill().forEach(addPyramide);

// Scroll and rotate logic

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Get the normalized vector of where the camera is looking
  const normal = new THREE.Vector3();
  normal.copy(camera.position);
  normal.normalize();

  // Calculate the vector for the smalles distance
  const minimalDistance = new THREE.Vector3();
  minimalDistance.copy(normal);
  minimalDistance.multiply(new THREE.Vector3(cameraDistance, cameraDistance, cameraDistance));

  // Add the distance of the scroll to the minimal distance
  const addDistance = new THREE.Vector3();
  addDistance.copy(normal);
  const distance = t * -0.01;
  addDistance.multiply(new THREE.Vector3(distance, distance, distance));
  minimalDistance.add(addDistance);

  // put the new distance of the camera in the camera
  camera.position.copy(minimalDistance);
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  if (picture) {
    picture.rotation.y += 0.01;
    picture.rotation.z += 0.01;
  }
  matrix.makeRotationY(clock.getDelta() * 2 * Math.PI / period);

  camera.lookAt(new THREE.Vector3(0, 0, 0));
  camera.rotateY(0.4);


  camera.position.applyMatrix4(matrix);
  renderer.render(scene, camera);
}

animate();

