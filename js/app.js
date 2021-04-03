import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Stats from "stats.js";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function camera() {
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 2;

    return camera;
}

function cube(scene, matprops = { color: 0x44aa88 }) {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial(matprops);

    const cube = new THREE.Mesh(geometry, material);

    scene.add(cube);

    return cube;
}

function dir_light(scene) {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);

    scene.add(light);

    return light;
}

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas });

const cam = camera();
function resizeCanvasToDisplaySize() {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        cam.aspect = width / height;
        cam.updateProjectionMatrix();

        // update any render target sizes here
    }
}

const scene = new THREE.Scene();

const cube1 = cube(scene, { color: 0x44aa88 });
const cube2 = cube(scene, { color: 0x44aa88 });
cube2.position.x -= 2;
const cube3 = cube(scene, { color: 0x44aa88 });
cube3.position.x += 2;
const light1 = dir_light(scene);
light1.position.set(-1, 2, 4);

function render(time) {
    stats.begin();
    resizeCanvasToDisplaySize();

    time *= 0.001; // convert time to seconds

    // cube1.rotation.x = time;
    // cube1.rotation.y = time;

    renderer.render(scene, cam);
    stats.end();
    requestAnimationFrame(render);
}
requestAnimationFrame(render);
