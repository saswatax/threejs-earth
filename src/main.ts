import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function main() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.y = 5;
  camera.position.z = 10;

  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const loader = new THREE.TextureLoader();
  const geometry = new THREE.SphereGeometry(5, 64, 32);

  const material = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/earthmap1k.jpg"),
  });
  const earth = new THREE.Mesh(geometry, material);
  earthGroup.add(earth);

  const cloudMaterial = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/earthcloudmap.jpg"),
    blending: THREE.AdditiveBlending,
  });
  const cloud = new THREE.Mesh(geometry, cloudMaterial);
  cloud.scale.setScalar(1.002);
  earthGroup.add(cloud);

  const stars = getStarfield();
  scene.add(stars);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(-2, 1, 1);
  scene.add(light);

  const controls = new OrbitControls(camera, renderer.domElement);

  function animate() {
    earth.rotation.y += 0.004;
    cloud.rotation.y += 0.006;
    renderer.render(scene, camera);
  }
  renderer.setAnimationLoop(animate);
}

export default function getStarfield({ numStars = 500 } = {}) {
  function randomSpherePoint() {
    const radius = Math.random() * 25 + 25;
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = radius * Math.sin(phi) * Math.cos(theta);
    let y = radius * Math.sin(phi) * Math.sin(theta);
    let z = radius * Math.cos(phi);

    return {
      pos: new THREE.Vector3(x, y, z),
      hue: 0.6,
      minDist: radius,
    };
  }
  const verts = [];
  const colors = [];
  const positions = [];
  let col;
  for (let i = 0; i < numStars; i += 1) {
    let p = randomSpherePoint();
    const { pos, hue } = p;
    positions.push(p);
    col = new THREE.Color().setHSL(hue, 0.2, Math.random());
    verts.push(pos.x, pos.y, pos.z);
    colors.push(col.r, col.g, col.b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    map: new THREE.TextureLoader().load("./textures/circle.png"),
  });
  const points = new THREE.Points(geo, mat);
  return points;
}

main();
