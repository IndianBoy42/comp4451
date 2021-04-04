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
