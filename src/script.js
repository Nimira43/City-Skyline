import * as THREE from 'three'

const number = 120;

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x00b5e2)

const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(30, aspect)
camera.position.set(6, 7, 20)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const geometry = new THREE.BoxGeometry(1, 5, 1)
const material = new THREE.MeshPhongMaterial()
for (let i = 0; i < number; i++) {
  const building = new THREE.Mesh(geometry, material)
  building.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)
  scene.add(building)
}

const light1 = new THREE.PointLight(0xffffff, 1)
light1.position.set(3, 7, 9)
scene.add(light1)

const light2 = new THREE.PointLight(0xffffff, 1)
light2.position.set(3, 7, -9)
scene.add(light2)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

renderer.setAnimationLoop(drawFrame)

function drawFrame() {
  scene.rotation.y += 0.005
  renderer.render(scene, camera)
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
