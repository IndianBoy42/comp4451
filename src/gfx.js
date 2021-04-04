import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import wizard from "./assets/wizard.glb";

const loader = new GLTFLoader();

export function loadModel(scene, models, objects, modelpath) {
    loader.load(
        modelpath,
        function (gltf) {
            scene.add(gltf.scene);
            models.push(gltf.scene);
            objects.push(gltf);
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Group
            // gltf.scenes; // Array<THREE.Group>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
        },
        function (xhr) {
            console.log(
                (xhr.loaded / xhr.total) * 100 + "% loaded for modelpath"
            );
        },
        function (error) {
            console.error(error);
        }
    );
}

export function loadAll(scene) {
    const models = [];
    const objects = [];

    loadModel(scene, models, objects, wizard);

    return [models, objects];
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

export function createTestScene() {
    const scene = new THREE.Scene();

    let cube1 = cube(scene, { color: 0x44aa88 });
    // cube1.position.x = 0;
    const cube2 = cube(scene, { color: 0x44aa88 });
    // cube2.position.x -= 2;
    const cube3 = cube(scene, { color: 0x44aa88 });
    // cube3.position.x += 2;
    const light1 = dir_light(scene);
    light1.position.set(-1, 2, 4);

    cube1.hoveron = function (event) {
        cube1.material.color.setHex("0xFF0000");
    };
    cube1.hoveroff = function (event) {
        cube1.material.color.setHex("0x00FF00");
    };

    const [models, loadedObjects] = loadAll(scene);
    models.push(cube1);
    models.push(cube2);
    models.push(cube3);

    return [scene, models];
}
