import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import * as dat from 'dat.gui'

const params = {
  'Directional Light Intensity 1': 2,
  'Directional Light Intensity 2': 2,
  'Ambient Light Intensity': 0.6,
  'Scene Rotation Speed': 0.005,
  'Number of Buildings': 120,
  'Max Building Height': 5,
  'Building Colour': 0xcccccc,
  'Building Metalness': 0.9,
  'Outline Thickness': 0.5
}

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x00b5e2)

const aspect = window.innerWidth / window.innerHeight
const camera = new THREE.PerspectiveCamera(30, aspect)
camera.position.set(12, 14, 30)
camera.lookAt(new THREE.Vector3(0, 0, 0))

const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

const groundGeometry = new THREE.PlaneGeometry(50, 50)
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x524d50 })
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI / 2
ground.receiveShadow = true
scene.add(ground)

const buildings = []

const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera  
)
outlinePass.edgeStrength = 1.0
outlinePass.edgeGlow = 0.0
outlinePass.edgeThickness = 0.5
outlinePass.visibleEdgeColor.set('#000000')
outlinePass.hiddenEdgeColor.set('#190a05')

function createBuildings() {
  buildings.forEach(building => scene.remove(building))
  buildings.length = 0
  
  for (let i = 0; i < params['Number of Buildings']; i++) {
    const height = Math.random() * params['Max Building Height'] + 1
    const geometry = new THREE.BoxGeometry(1, height, 1)
    const material = new THREE.MeshStandardMaterial({
      color: params['Building Color'],
      roughness: 0.1,
      metalness: params['Building Metalness']
    })
    const building = new THREE.Mesh(geometry, material)
    building.position.set(
      Math.random() * 20 - 10, 
      height / 2, 
      Math.random() * 20 - 10
    )
    building.castShadow = true
    building.receiveShadow = true
    scene.add(building)
    buildings.push(building)
  }
  outlinePass.selectedObjects = buildings
}

createBuildings()

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2)
directionalLight1.position.set(10, 10, 10)
directionalLight1.castShadow = true
scene.add(directionalLight1)

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2)
directionalLight2.position.set(-10, 10, -10)
directionalLight2.castShadow = true
scene.add(directionalLight2)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
scene.add(ambientLight)

const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass)
composer.addPass(outlinePass)

const gui = new dat.GUI()

gui.add(params, 'Directional Light Intensity 1', 0, 10).onChange(value => {
  directionalLight1.intensity = value
})
gui.add(params, 'Directional Light Intensity 2', 0, 10).onChange(value => {
  directionalLight2.intensity = value
})
gui.add(params, 'Ambient Light Intensity', 0, 10).onChange(value => {
  ambientLight.intensity = value
})
gui.add(params, 'Scene Rotation Speed', 0, 0.05)
gui.add(params, 'Number of Buildings', 10, 300).step(1).onChange(value => {
  params['Number of Buildings'] = value
  createBuildings()
})
gui.add(params, 'Max Building Height', 1, 10).step(1).onChange(value => {
  params['Max Building Height'] = value
  createBuildings()
})
gui.addColor(params, 'Building Colour').onChange(value => {
  params['Building Colour'] = value
  createBuildings()
})
gui.add(params, 'Building Metalness', 0, 1).step(0.1).onChange(value => {
  params['Building Metalness'] = value
  createBuildings()
})
gui.add(params, 'Outline Thickness', 0, 3).step(0.1).onChange(value => {
  outlinePass.edgeThickness = value
})

renderer.setAnimationLoop(drawFrame)

function drawFrame() {
  scene.rotation.y += params['Scene Rotation Speed']
  controls.update()
  composer.render()
}

window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
}
