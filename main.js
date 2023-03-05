import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x7A7A7A);
scene.fog = new THREE.FogExp2(0xffffff, 0.002);

const spotLight = new THREE.SpotLight('white', 0.7);
spotLight.castShadow = true;
spotLight.position.set(0,1,0);
spotLight.shadow.mapSize.width = 1024;  
spotLight.shadow.mapSize.height = 1024; 
spotLight.shadow.camera.near = 0.1;    
spotLight.shadow.camera.far = 5;  
scene.add(spotLight);

scene.add(new THREE.AmbientLight('white', 0.3));

const camera = new THREE.PerspectiveCamera();
camera.position.x = 4;
camera.position.y = 1;
camera.position.z = 3;
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true;
controls.enablePan = false;
controls.enableDamping = true;

const count = 256;
const box = new THREE.BoxGeometry();
const radius = 1.1;
const strip = new THREE.Object3D();
scene.add(strip)
for (let i=0; i<count; i++) {
  const a = Math.PI/count*2*i;
  const o = new THREE.Object3D();
  o.position.set(Math.cos(a), Math.sin(a*5)/30, Math.sin(a))
  o.position.multiplyScalar(radius);
  o.lookAt(scene.position);
  strip.add(o);
  const mat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(`hsl(${a*360/Math.PI},55%,55%)`)
      // color: new THREE.Color(0x20162D)
  });
  const mesh = new THREE.Mesh(box, mat);
  mesh.scale.set(0.05, 0.7, 0.001)
  mesh.castShadow = true;
  //mesh.receiveShadow  = true;
  mesh.rotation.x = a/1;
  o.add(mesh)    
}

// const floor = new THREE.Mesh(box, new THREE.MeshStandardMaterial({
//   color: new THREE.Color('steelblue')
// }));
// floor.scale.set(20,0.01,20);
// floor.position.y = -0.5;
// floor.castShadow = true;
// floor.receiveShadow  = true;
// scene.add(floor)


requestAnimationFrame(function render(t) {
  if (renderer.width !== innerWidth || renderer.height !== innerHeight){
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth/innerHeight;
      camera.updateProjectionMatrix();
  }
  strip.rotation.y += 0.001;
  strip.traverse(o => {
      o.material && (o.rotation.x += 0.004)
  })
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
});

