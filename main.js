import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


// Countries and their coordinates
const countries = [
    { name: 'Netherlands', lat: 52.3667, lon: 4.8945 },
    { name: 'Belgium', lat: 50.8503, lon: 4.3517 },
    { name: 'Germany', lat: 51.1657, lon: 10.4515 },
    { name: 'Austria', lat: 47.5162, lon: 14.5501 },
    { name: 'Sweden', lat: 59.3293, lon: 18.0686 },
    { name: 'Finland', lat: 60.1699, lon: 24.9384 },
    { name: 'Norway', lat: 59.9139, lon: 10.7522 },
    { name: 'Denmark', lat: 55.6761, lon: 12.5683 },
    { name: 'UK', lat: 51.5074, lon: -0.1278 },
];

// Create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = 0;
document.body.appendChild(labelRenderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Create a sphere geometry 
const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
const texture = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg');
const bumpTexture = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg');
const specularTexture = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg');
const earthMaterial = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bumpTexture, bumpScale: 0.05, specularMap: specularTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Light
scene.add(new THREE.AmbientLight(0x333333));

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,3,5);
scene.add(light);

// Add pinpoint markers for each country
countries.forEach(country => {
    const markerGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial, country.name);
    const countryName = country.name;
    marker.name = countryName;
    // Convert latitude and longitude to 3D coordinates
    const phi = (90 - country.lat) * Math.PI / 180;
    const theta = (country.lon + 180) * Math.PI / 180;

    marker.position.setFromSphericalCoords(5, phi, theta);
    earth.add(marker);
    displayCountryName(countryName, marker);
    
});


function displayCountryName(countryName, marker) {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'label';
    labelDiv.textContent = countryName;
    labelDiv.style.marginTop = '-1em';
    labelDiv.style.backgroundColor = 'rgba(0,0,0,0.5)'; 
    labelDiv.style.color = 'white';
    labelDiv.style.fontFamily = 'Arial';
    const labelObject = new CSS2DObject(labelDiv);
    labelObject.position.set(marker.position.x, marker.position.y, marker.position.z);
    labelObject.name = countryName;
    earth.add(labelObject);
}


// Set camera position and look at the Earth
camera.position.z = 10;
camera.position.y = 10;
camera.position.x = 0;
camera.lookAt(earth.position);
// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the Earth
    earth.rotation.y += 0.01;
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();