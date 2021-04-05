import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import wizard from "./assets/diviner.glb";

const loader = new GLTFLoader();

function modelLoader(url) {
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            data => resolve(data),
            function (xhr) {
                console.log(
                    (xhr.loaded / xhr.total) * 100 + "% loaded for modelpath"
                );
            },
            reject
        );
    });
}
function loadModel(scene, models, modelpath, onComplete) {
    loader.load(
        modelpath,
        function (gltf) {
            scene.add(gltf.scene);
            models.push(gltf.scene);
            onComplete(gltf);
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
    const models = [];
    const objects = [];

    loadModel(scene, models, wizard, gltf => {
        gltf.scene.scale.multiplyScalar(0.1);
    });

    let cube1 = cube(scene, { color: 0x44aa88 });
    cube1.position.x = 0;
    const cube2 = cube(scene, { color: 0x44aa88 });
    cube2.position.x -= 2;
    const cube3 = cube(scene, { color: 0x44aa88 });
    cube3.position.x += 2;
    const light1 = dir_light(scene);
    light1.position.set(-1, 2, 4);

    cube1.hoveron = function (event) {
        cube1.material.color.setHex("0xFF0000");
    };
    cube1.hoveroff = function (event) {
        cube1.material.color.setHex("0x00FF00");
    };

    models.push(cube1);
    models.push(cube2);
    models.push(cube3);

    return [scene, models];
}
