import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { DragControls } from "three/examples/jsm/controls/DragControls";
import { DragControls } from "./DragControls.js";

export function initControls(objects, camera, renderer) {
    // OrbitControls for moving cmaera
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.update();
    // orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    // orbitControls.dampingFactor = 0.15;
    // orbitControls.screenSpacePanning = false;
    // orbitControls.minDistance = 50;
    // orbitControls.maxDistance = 200;
    // orbitControls.maxPolarAngle = Math.PI / 2;

    // DragControls for moving objects
    const dragControls = new DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener("dragstart", function (event) {
        orbitControls.enabled = false;
        console.log("event.object.dragstart");
        if (event.object.dragstart) {
            event.object.dragstart(event);
        }
    });
    dragControls.addEventListener("dragend", function (event) {
        orbitControls.enabled = true;
        console.log("event.object.dragend");
        if (event.object.dragend) {
            event.object.dragend(event);
        }
    });
    dragControls.addEventListener("hoveron", function (event) {
        console.log("event.object.hoveron");
        if (event.object.hoveron) {
            event.object.hoveron(event);
        }
    });
    dragControls.addEventListener("hoveroff", function (event) {
        console.log("event.object.hoveroff");
        if (event.object.hoveroff) {
            event.object.hoveroff(event);
        }
    });

    return [orbitControls, dragControls];
}
