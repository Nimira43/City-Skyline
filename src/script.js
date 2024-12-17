import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

const number = 120

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87CEEB)

const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(30, aspect)
camera.position.set(12, 14, 30)
camera.lookAt(new THREE.Vector3(0, 0, 0))


const groundGeometry = new THREE.PlaneGeometry(50, 50)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x008000 })
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const buildings = []
for (let i = 0; i < number; i++) {
  const height = Math.random() * 5 + 1
  const geometry = new THREE.BoxGeometry(1, height, 1)
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xcccccc, roughness: 0.3, metalness: 0.6
  })
  const building = new THREE.Mesh(geometry, material);
  building.position.set(Math.random() * 20 - 10, height / 2, Math.random() * 20 - 10);
  building.castShadow = true
  building.receiveShadow = true
  scene.add(building)
  buildings.push(building)
}

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2)
directionalLight1.position.set(10, 10, 10)
directionalLight1.castShadow = true
scene.add(directionalLight1)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(-10, 10, -10)
directionalLight2.castShadow = true
scene.add(directionalLight2)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)

const outlinePass = new OutlinePass(
  new THREE.Vector2(
    window.innerWidth, 
    window.innerHeight
  ), 
  scene, 
  camera
)
outlinePass.selectedObjects = buildings
outlinePass.edgeStrength = 1.0
outlinePass.edgeGlow = 0.0
outlinePass.edgeThickness = 0.5
outlinePass.visibleEdgeColor.set('#000000')
outlinePass.hiddenEdgeColor.set('#190a05')
composer.addPass(outlinePass)

renderer.setAnimationLoop(drawFrame)

function drawFrame() {
  scene.rotation.y += 0.005
  composer.render()
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}
