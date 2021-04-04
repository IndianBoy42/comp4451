import "./css/style.css";
import * as THREE from "three";
import * as Stats from "stats.js";
import { createTestScene } from "./gfx.js";
import { initControls } from "./controls.js";

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

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas });

const camera = newCamera();
function resizeCanvasToDisplaySize() {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update any render target sizes here
    }
}

const [scene, models] = createTestScene();

const [orbitControls, dragControls] = initControls(models, camera, renderer);

function render(time) {
    requestAnimationFrame(render);
    stats.begin();
    resizeCanvasToDisplaySize();
    orbitControls.update();

    time *= 0.001; // convert time to seconds

    // cube1.rotation.x = time;
    // cube1.rotation.y = time;

    renderer.render(scene, camera);
    stats.end();
}
requestAnimationFrame(render);
