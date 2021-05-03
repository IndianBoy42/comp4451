import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { DragControls } from "three/examples/jsm/controls/DragControls";
import { DragControls } from "./DragControls.js"; // Fix a bug by pulling in the source myself
import * as THREE from "three";
import { addSpotLightTo, removeSpotLightFrom } from "./gfx.js";

let objectChoices = [];
let objectChoicesIntersectables = [];
let objectChoiceResolve = i => {};

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseIntersectionCamera = null;

function mouseIntersection(objectIntersectables) {
    const intersects = raycaster.intersectObjects(objectIntersectables, true);
    return intersects;
}
function onMouseMove(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components

    if (mouseIntersectionCamera) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, mouseIntersectionCamera);
    }
}
function onMouseClick(event) {
    if (objectChoices.length > 0) {
        console.log("clicked");
        const intersects = mouseIntersection(objectChoicesIntersectables);

        // for (const inte of intersects) {
        //     console.log("intersected");
        //     console.log(inte);
        // }
        if (intersects.length == 0) return;
        const intersectionIndex = objectChoicesIntersectables.findIndex(
            e => e == intersects[0].object || e == intersects[0].object.parent
        );
        if (intersectionIndex >= 0) {
            objectChoiceResolve(intersectionIndex);
            const len = objectChoices.length;
            for (let i = 0; i < len; i++) {
                const e = objectChoices.pop();
                removeSpotLightFrom(e);
            }
            objectChoicesIntersectables = [];
        }
    }
}
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("click", onMouseClick, false);

export function initControls(objects, camera, renderer) {
    mouseIntersectionCamera = camera;

    // OrbitControls for moving camera
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    orbitControls.dampingFactor = 0.15;
    orbitControls.screenSpacePanning = true;
    // orbitControls.minDistance = 50;
    // orbitControls.maxDistance = 200;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.minPolarAngle = 0;
    orbitControls.enableKeys = true;

    // DragControls for moving objects
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener("drag", function (event) {
        orbitControls.enabled = false;
        if (event.object.drag) {
            event.object.drag(event);
        }
    });
    dragControls.addEventListener("dragstart", function (event) {
        orbitControls.enabled = false;
        // console.log("event.object.dragstart");
        if (event.object.dragstart) {
            event.object.dragstart(event);
        }
    });
    dragControls.addEventListener("dragend", function (event) {
        orbitControls.enabled = true;
        // console.log("event.object.dragend");
        if (event.object.dragend) {
            event.object.dragend(event);
        }
    });
    dragControls.addEventListener("hoveron", function (event) {
        // console.log("event.object.hoveron");
        if (event.object.hoveron) {
            event.object.hoveron(event);
        }
    });
    dragControls.addEventListener("hoveroff", function (event) {
        // console.log("event.object.hoveroff");
        if (event.object.hoveroff) {
            event.object.hoveroff(event);
        }
    });

    const controlUpdate = () => {
        orbitControls.update();

        if (objectChoices.length > 0) {
            const intersects = mouseIntersection(objectChoicesIntersectables);

            // for (const inte of intersects) {
            //     console.log("intersected");
            //     console.log(inte);
            // }
            let intersectionIndex = -1;
            if (intersects.length != 0) {
                intersectionIndex = objectChoicesIntersectables.findIndex(
                    e =>
                        e == intersects[0].object ||
                        e == intersects[0].object.parent
                );
            }
            for (let i = 0; i < objectChoices.length; i++) {
                objectChoices[i].selectionLight.color =
                    i == intersectionIndex
                        ? new THREE.Color(0x0000ff)
                        : new THREE.Color(0xff0000);
            }
        }
    };

    return [orbitControls, dragControls, controlUpdate];
}
export const clipFloor = (obj, offset = 0) => {
    // FIXME: The motion doesnt follow the cursor very well if we do this
    // We should just change DragControls to find the intersection of mouse and table
    const f = event => {
        // obj.position.y = Math.max(obj.position.y, 0);
        obj.position.y = -offset - 0.5;
    };
    f();
    return f;
};

/**
 * Game selection functions
 * set DEBUG_RNG_INPUT to true to play a fully randomized automatic game
 */
export let DEBUG_RNG_INPUT = false;
export function setDebugRngInput(v) {
    DEBUG_RNG_INPUT = v;
    console.log("DEBUG_RNG_INPUT " + DEBUG_RNG_INPUT);
}

export function chooseFromObjects(query, min, max, objects) {
    if (DEBUG_RNG_INPUT) {
        return new Promise(resolve => {
            setTimeout(() => {
                const i = Math.floor(Math.random() * (max - min + 1)) + min;
                resolve(i);
            }, 100);
        });
    }
    console.log(query);
    return new Promise(resolve => {
        // https://stackoverflow.com/questions/26341396/outline-a-3d-object-in-three-js
        objectChoices = objects.map(obj => addSpotLightTo(obj));
        objectChoicesIntersectables = objects.map(obj => obj.modelInWorld);
        objectChoiceResolve = resolve;
    });
}
