import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.physicallyCorrectLights = true;
document.getElementById('container').appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Texture loader for background image
const loader = new THREE.TextureLoader();
loader.load('https://images.pexels.com/photos/347140/pexels-photo-347140.jpeg?auto=compress&cs=tinysrgb&w=600', function (texture) {
  scene.background = texture;  // Set background image
});

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 5);
orbit.update();

// Stamp plane using MeshPhysicalMaterial
const stampGeometry = new THREE.PlaneGeometry(3.5, 3.75);
const stampMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.1,
  roughness: 0.3,   // Reducing roughness for a shinier material
  reflectivity: 1,
  side: THREE.DoubleSide
});
const stamp = new THREE.Mesh(stampGeometry, stampMaterial);
scene.add(stamp);

// Texture loader function
const textureLoader = new THREE.TextureLoader();
function loadTexture(url) {
  textureLoader.load(
    url,
    (texture) => {
      stampMaterial.map = texture;
      stampMaterial.needsUpdate = true;
    },
    undefined,
    (error) => {
      console.error('Error loading texture:', url, error);
      stampMaterial.color.setHex(0xff0000);  // Fallback color if texture loading fails
      stampMaterial.needsUpdate = true;
    }
  );
}

// Lighting setup with higher intensity
const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);  // Increased intensity
sunLight.position.set(-2, 2, 5);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);  // Brighter ambient light
scene.add(ambientLight);

// Stamps array with image URLs and corresponding information
const stamps = [
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/1947_India_Flag_3%C2%BD_annas.jpg',
    title: '🇮🇳 Indian Flag Map Stamp',
    year: '1947',
    country: 'India',
    value: '₹3½ Annas',
    rating: 'In Stock 1421',
    price: '₹349.99',
    offerPrice: '₹279.99',
    description: 'This stamp features the first Indian map issued post-independence.',
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/India_1947_Ashoka_Lions_1_and_half_annas.jpg/180px-India_1947_Ashoka_Lions_1_and_half_annas.jpg',
    title: '🦁 Ashoka Lions Stamp',
    year: '1947',
    country: 'India',
    value: '₹1½ Annas',
    rating: 'In Stock 2101',
    price: '₹299.99',
    offerPrice: '₹239.99',
    description: 'This iconic stamp features the Ashoka Lions, a symbol of India’s heritage.',
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/44th_Chess_Olympiad_2022_stamp_of_India.jpg/1280px-44th_Chess_Olympiad_2022_stamp_of_India.jpg',
    title: '♟️ 44th Chess Olympiad Stamp',
    year: '2022',
    country: 'India',
    value: '₹25',
    rating: 'In Stock 3201',
    price: '₹99.99',
    offerPrice: '₹79.99',
    description: 'This stamp commemorates the 44th Chess Olympiad held in India in 2022.',
  },
  {
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Netaji_Subhas_Chandra_Bose%E2%80%99s_125th_Birth_Anniversary_stamp.jpg',
    title: '🎉 Netaji Subhas Chandra Bose’s 125th Birth Anniversary Stamp',
    year: '2022',
    country: 'India',
    value: '₹10',
    rating: 'In Stock 42',
    price: '₹199.99',
    offerPrice: '₹159.99',
    description: 'This stamp celebrates the 125th birth anniversary of Netaji Subhas Chandra Bose.',
  },
  {
    imageUrl: 'data:image/jpeg;base64,[base64_encoded_image_here]',
    title: '🌟 Custom Base64 Stamp',
    year: '2024',
    country: 'India',
    value: '₹50',
    rating: 'In Stock 1421',
    price: '₹149.99',
    offerPrice: '₹119.99',
    description: 'A custom stamp with a unique design encoded in Base64 format.',
  },
];

// Keep track of the current stamp index
let currentStampIndex = 0;

// Load initial stamp texture and info
function loadStamp(index) {
  const stamp = stamps[index];
  loadTexture(stamp.imageUrl);
  updateStampInfo(stamp);
}

// Update the HTML content dynamically
function updateStampInfo(stamp) {
  const stampInfoDiv = document.getElementById('stampInfoDiv');
  stampInfoDiv.innerHTML = `
    <h2>${stamp.title}</h2>
    <p class="offer">🔖 Limited Time Offer! Get it at a discount!</p>
    <div style="margin-bottom: 20px;">
      <p><strong>Year:</strong> ${stamp.year}</p>
      <p><strong>Country:</strong> ${stamp.country}</p>
      <p><strong>Value:</strong> ${stamp.value}</p>
      <p><strong>Rating:</strong> ${stamp.rating}</p>
    </div>
    <p class="price"><strong>Price:</strong> ${stamp.price}</p>
    <p class="offer"><strong>Special Offer:</strong> Get it for ${stamp.offerPrice}!</p>
    <label for="quantity" style="display:block; margin-bottom:10px;"><strong>Quantity:</strong></label>
    <input type="number" id="quantity" name="quantity" min="1" value="1" class="quantity-input">
    <button id="addToCart">🛒 Add to Cart</button>
    <button id="wishlist">⭐ Add to Wishlist</button>
    <h3>Description:</h3>
    <p>${stamp.description}</p>
    <h3>Features:</h3>
    <ul>
      <li>High-quality print.</li>
      <li>Limited edition.</li>
      <li>Perfect for framing.</li>
    </ul>
    
   
  `;
}

// Event listener for right arrow click
document.getElementById('rightArrow').addEventListener('click', function () {
  currentStampIndex = (currentStampIndex + 1) % stamps.length; // Increment the index and loop back
  loadStamp(currentStampIndex);
});

// Event listener for left arrow click
document.getElementById('leftArrow').addEventListener('click', function () {
  currentStampIndex = (currentStampIndex - 1 + stamps.length) % stamps.length; // Decrement the index and loop back
  loadStamp(currentStampIndex);
});

// Window resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main animation loop
function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Initial call to load the first stamp
loadStamp(currentStampIndex);

// Start the animation loop
animate();
