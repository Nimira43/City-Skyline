import * as THREE from 'three'

const number = 120

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true 
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xeeeeee)

const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(30, aspect)
camera.position.set(6, 7, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))

for (let i = 0; i < number; i++) {
  const height = Math.random() * 5 + 1;
  const geometry = new THREE.BoxGeometry(1, height, 1) 
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x999999, 
    roughness: 0.5, 
    metalness: 0.5 
  })
  const building = new THREE.Mesh(geometry, material) 
  building.position.set(Math.random() * 20 - 10, height / 2, Math.random() * 20 - 10) 
  building.castShadow = true
  building.receiveShadow = true 
  scene.add(building)
}

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1) 
directionalLight1.position.set(10, 10, 10)
directionalLight1.castShadow = true 
scene.add(directionalLight1) 

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
directionalLight2.position.set(-10, 10, -10)
directionalLight2.castShadow = true
scene.add(directionalLight2)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

renderer.setAnimationLoop(drawFrame)

function drawFrame() {
  scene.rotation.y += 0.005
  renderer.render(scene, camera)
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight)
}

