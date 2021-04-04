import "./css/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as Stats from "stats.js";
import { loadAll } from "./gfx.js";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function newCamera() {
    const fov = 75;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 50;
    const newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    newCamera.position.z = 2;

    return newCamera;
}

function cube(scene, matprops = { color: 0x44aa88 }) {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshPhongMaterial(matprops);

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
    scene.add(cube);

    return cube;
}

function dir_light(scene) {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(-1, 2, 4);

    scene.add(light);

    return light;
}

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas });

const cam = newCamera();
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

let cube1 = cube(scene, { color: 0x44aa88 });
// cube1.position.x = 0;
const cube2 = cube(scene, { color: 0x44aa88 });
// cube2.position.x -= 2;
const cube3 = cube(scene, { color: 0x44aa88 });
// cube3.position.x += 2;
const light1 = dir_light(scene);
light1.position.set(-1, 2, 4);

const [models, loadedObjects] = loadAll(scene);
models.push(cube1);
models.push(cube2);
models.push(cube3);

// OrbitControls for moving camera
const orbitControls = new OrbitControls(cam, renderer.domElement);
orbitControls.update();

// DragControls for moving objects
const dragControls = new DragControls(models, cam, renderer.domElement);
dragControls.addEventListener("dragstart", function () {
    orbitControls.enabled = false;
});
dragControls.addEventListener("dragend", function () {
    orbitControls.enabled = true;
});

function render(time) {
    requestAnimationFrame(render);
    stats.begin();
    resizeCanvasToDisplaySize();
    orbitControls.update();

    time *= 0.001; // convert time to seconds

    // cube1.rotation.x = time;
    // cube1.rotation.y = time;

    renderer.render(scene, cam);
    stats.end();
}
requestAnimationFrame(render);
