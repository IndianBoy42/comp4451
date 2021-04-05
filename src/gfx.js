import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import evokerWizard from "./assets/evoker_wizard.glb";
import tieflingRogue from "./assets/tiefling_rogue.glb";
import table from "./assets/table.glb";
import { Vector3 } from "three";

const loader = new GLTFLoader();

function loadModel(modelpath, onComplete) {
    loader.load(
        modelpath,
        function (gltf) {
            onComplete(gltf);
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Group
            // gltf.scenes; // Array<THREE.Group>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
        },
        function (xhr) {
            console.log(
                (xhr.loaded / xhr.total) * 100 + `% loaded for ${modelpath}`
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
    const movables = [];
    const objects = [];

    loadModel(table, gltf => {
        gltf.scene.scale.multiplyScalar(10);
        gltf.scene.position.y -= 4;
        scene.add(gltf.scene);
    });

    const clipFloor = (obj, offset = 0) => {
        const f = event => {
            // obj.position.y = Math.max(obj.position.y, 0);
            obj.position.y = -offset - 0.5;
        };
        f();
        return f;
    };
    const loadToken = (path, onComplete) => {
        loadModel(path, gltf => {
            const token = gltf.scene.children[0];
            token.scale.multiplyScalar(0.03);
            token.drag = clipFloor(token);
            scene.add(token);
            onComplete(gltf, token);
        });
    };
    const makeCard = (texPath, onComplete) => {
        const cube = cube(scene, { color: 0x44aa88 });
        movables.push(cube);
        cube.scale.multiply(new Vector3(1.618, 0.01, 1));
        cube.drag = clipFloor(cube);
    };

    // let cube1 = cube(scene, { color: 0x44aa88 });
    // movables.push(cube1);
    // cube1.position.x = 0;
    // cube1.hoveron = function (event) {
    //     cube1.material.color.setHex("0xFF0000");
    // };
    // cube1.hoveroff = function (event) {
    //     cube1.material.color.setHex("0x00FF00");
    // };

    const cube2 = cube(scene, { color: 0x44aa88 });
    movables.push(cube2);
    cube2.position.x -= 2;
    cube2.scale.multiply(new Vector3(1.618, 0.01, 1));
    cube2.drag = clipFloor(cube2);

    const cube3 = cube(scene, { color: 0x44aa88 });
    movables.push(cube3);
    cube3.position.x += 2;
    cube3.drag = clipFloor(cube3);
    cube3.dragend = event => {
        cube3.material.color.setHex("0xFF0000");
    };

    loadToken(tieflingRogue, (gltf, token) => {
        movables.push(token);
    });
    loadToken(evokerWizard, (gltf, token) => {
        movables.push(token);
    });

    const light1 = dir_light(scene);
    light1.position.set(-1, 2, 4);
    const light2 = dir_light(scene);
    light2.position.set(1, 2, 4);
    const light3 = dir_light(scene);
    light3.position.set(-1, 2, -4);
    const light4 = dir_light(scene);
    light4.position.set(1, 2, -4);

    return [scene, movables];
}
