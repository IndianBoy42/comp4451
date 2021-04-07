import * as THREE from "three";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("mousemove", onMouseMove, false);

function cube(scene, matprops = { color: 0x44aa88 }) {
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const material = new THREE.MeshBasicMaterial(matprops);

    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    cube.rotation.set(0, 0, 0);
    scene.add(cube);

    return cube;
}

export function createGui() {
    const scene = new THREE.Scene();

    // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
    // const plane = new THREE.PlaneBufferGeometry(0.4, 0.4);
    // const quad = new THREE.Mesh(plane, material);
    // quad.position.z = 5;
    // quad.position.x = 0.5;
    // quad.position.y = 0.5;
    // scene.add(quad);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -10, 10);
    camera.position.z = 0;

    const update = renderer => {
        // raycaster.setFromCamera(mouse, camera);
        //
        // const intersects = raycaster.intersectObjects([quad]);
        // for (const inte of intersects) {
        //     inte.object.material.color.set(0xff0000);
        //     console.log(inte);
        // }
        // renderer.render(scene, camera);
    };

    return [scene, camera, update];
}
