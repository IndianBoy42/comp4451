import "./css/style.css";

import * as THREE from "three";
import * as Stats from "stats.js";
import {
    createGameScene,
    renderer,
    canvas,
    setCanvas,
    setRenderer,
} from "./gfx.js";
import { initControls } from "./controls.js";
import { createGui, createHud } from "./hud";
import { hashDict } from "./url";

THREE.Cache.enabled = true;

startGame();

function startGame() {
    document
        .querySelectorAll("link[rel=stylesheet]")
        .forEach(e => e.parentNode.removeChild(e));
    console.log(require("./css/style.css"));
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    setCanvas(document.createElement("canvas"));
    document.body.innerHTML = "";
    document.body.appendChild(canvas);

    setRenderer(new THREE.WebGLRenderer({ canvas }));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.setClearColor(0xff0000, 0);
    renderer.shadowMap.enabled = true;

    function newCamera() {
        const fov = 75;
        const aspect = 2; // the canvas default
        const near = 0.1;
        const far = 50;
        const newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        newCamera.position.set(0, 4, 10);
        newCamera.lookAt(0, 0, 0);

        return newCamera;
    }
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

    const [scene, movables] = createGameScene();
    const [gui, guiValues] = createGui();
    const [hudScene, hudCamera, hudUpdate] = createHud();

    const [orbitControls, dragControls, controlUpdate] = initControls(
        movables,
        camera,
        renderer
    );

    function render(time) {
        stats.begin();

        requestAnimationFrame(render);

        resizeCanvasToDisplaySize();
        controlUpdate();

        time *= 0.001; // convert time to seconds

        renderer.render(scene, camera);
        renderer.clearDepth();
        hudUpdate(renderer);

        stats.end();
    }
    requestAnimationFrame(render);
}