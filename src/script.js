import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')
const earthObject = new THREE.Group()
// Scene
const scene = new THREE.Scene()
const sunLight = new THREE.DirectionalLight('white', 1)
const ambientLight = new THREE.AmbientLight('#b9d5ff', 3)
scene.add(sunLight, ambientLight);

var guiControls = new function() {
  this.color = sunLight.color.getStyle();
}();
gui.add(sunLight, 'intensity').min(.5).max(3)
gui.add(sunLight.position, 'x').min(-10).max(10).step(.1)
gui.add(sunLight.position, 'y').min(-10).max(10).step(.1)
gui.add(sunLight.position, 'z').min(-10).max(10).step(.1)

gui
  .addColor(guiControls, "color")
  .listen()
  .onChange(function(e) {
    sunLight.color.setStyle(e);
  });

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/4.png')
const earthTexture = textureLoader.load('/textures/particles/earth_atmos_2048.jpg')
const earthLights = textureLoader.load('/textures/particles/earth_lights_2048.png')
const earthNormal = textureLoader.load('/textures/particles/earth_normal_2048.jpg')
const earthClouds = textureLoader.load('/textures/particles/earth_clouds_2048.png')
earthTexture.magFilter = THREE.NearestFilter
const fog = new THREE.Fog('#262837', 1, 1)
earthObject.fog = fog

const earthGeometry = new THREE.SphereGeometry()
const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
        transparent: true,
        // alphaMap: earthSpecular,
        aoMap: earthLights,
         displacementMap: earthClouds,
        displacementScale: 0.01,
        normalMap: earthNormal
        
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earthObject.add(earth)
scene.add(earthObject);
//particles
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32)
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000;

const positions = new Float32Array(count * 3);
// const colors = new Float32Array(count * 3);

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - .5) * 10
    
}

particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3),
   
)

// particlesGeometry.setAttribute(
//      'color', new THREE.BufferAttribute(colors, 3)
// )

const particlesMaterial = new THREE.PointsMaterial({
   size: .01,
   sizeAttenuation: true,
   transparent:  true,
   alphaMap: particleTexture,
//    depthTest: false
depthWrite: false,
blending: THREE.AdditiveBlending, 

})
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // for ( let i = 0; i < count; i++) {
    //     const i3 = i * 3
    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    // }
    // particlesGeometry.attributes.position.needsUpdate = true
earth.rotation.y = elapsedTime * .2
earth.rotation.x = elapsedTime * .2
    particles.rotation.x = elapsedTime * .02
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()