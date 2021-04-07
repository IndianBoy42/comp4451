import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import evokerWizard from "./assets/evoker_wizard.glb";
import tieflingRogue from "./assets/tiefling_rogue.glb";
import table from "./assets/table.glb";
import { Vector3 } from "three";
import { startGame, gameLoop } from "./3dgame";
import { chooseFromObjects, clipFloor } from "./controls";

const loader = new GLTFLoader();

export function loadModel(modelpath, onComplete) {
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

export function addSpotLightTo(obj) {
    obj.selectionLight = new THREE.SpotLight(0xff0000, 10000);
    obj.selectionLight.angle = Math.PI / 6;
    obj.selectionLight.penumbra = 0;
    obj.selectionLight.position.set(0, 1, 0);
    obj.selectionLight.target = obj.modelInWorld;
    obj.modelInWorld.add(obj.selectionLight);
    return obj;
}

export const initRenderPlayer = (scene, movables, NUM_PLAYERS, onComplete) => {
    return (player, i) => {
        const angle = ((2 * Math.PI) / NUM_PLAYERS) * i;
        const dist = 5;
        const pos = new Vector3(
            dist * Math.cos(angle),
            0,
            dist * Math.sin(angle)
        );
        const group = new THREE.Object3D();
        group.position.set(pos.x, pos.y, pos.z);
        group.rotateY(-angle + Math.PI / 2);

        loadModel(player.character.modelPath(), gltf => {
            const token = gltf.scene.children[0];
            token.scale.multiplyScalar(0.03);
            // token.position.set(
            //     dist * Math.cos(((2 * Math.PI) / NUM_PLAYERS) * i),
            //     0,
            //     dist * Math.sin(((2 * Math.PI) / NUM_PLAYERS) * i)
            // );
            token.dragend = clipFloor(token);
            token.rotateY(Math.PI);
            group.add(token);
            player.character.modelInWorld = token;
            player.modelInWorld = token;

            onComplete(player, token);
        });
        scene.add(group);

        player.deck.forEach((card, i) => {
            card.modelInWorld = makeCardObject(card.name);
            group.add(card.modelInWorld);
            moveCardToDeck(card, player, i);
        });
        player.hand.forEach((card, i) => {
            card.modelInWorld = makeCardObject(card.name);
            group.add(card.modelInWorld);
            moveCardToHand(card, player, i);
        });
    };
};

const DiscardPilePosition = new Vector3(1.5, -0.49, 0);
const HandPosition = new Vector3(0, 0.49, 1.5);
const ShieldsPosition = new Vector3(0, -0.49, -1.5);
const DeckPosition = new Vector3(-1.5, -0.49, 0);
const ZeroPosition = new Vector3();
// TODO: Can be animated
function setCardPos(card, pos) {
    card.modelInWorld.position.copy(ZeroPosition);
    card.modelInWorld.lookAt(new Vector3(0, 10000, 0));
    card.modelInWorld.rotateZ(Math.PI);
    card.modelInWorld.position.copy(pos);
}
export function moveCardToDiscard(card, player, i = 0) {
    if (card.modelInWorld) {
        setCardPos(card, DiscardPilePosition);
        card.modelInWorld.position.y += i * 0.01;
    }
}
export function moveCardToHand(card, player, i = 0) {
    if (card.modelInWorld) {
        const sign = i % 2 == 0 ? +1 : -1;
        const offs = Math.round(i / 2);
        setCardPos(card, HandPosition);
        card.modelInWorld.position.x += 2 * offs * sign;
        card.modelInWorld.rotateX(Math.PI / 4);
    }
}
export function moveCardToShields(card, player, i = 0) {
    if (card.modelInWorld) {
        const sign = i % 2 == 0 ? +1 : -1;
        const offs = Math.round(i / 2);
        setCardPos(card, ShieldsPosition);
        card.modelInWorld.position.x += 2 * offs * sign;
        card.modelInWorld.position.y = 0.01;
    }
}
export function moveCardToDeck(card, player, i = 0) {
    if (card.modelInWorld) {
        setCardPos(card, DeckPosition);
        card.modelInWorld.position.y += i * 0.01;
        card.modelInWorld.rotateX(Math.PI);
    }
}

export function createTestScene() {
    const scene = new THREE.Scene();
    const movables = [];

    loadModel(table, gltf => {
        const scale = 20;
        gltf.scene.scale.multiplyScalar(scale);
        gltf.scene.position.y -= 0.35 * scale + 0.5;
        scene.add(gltf.scene);
    });
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

    const game = startGame(scene, movables);

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
        console.log(game.players);
        chooseFromObjects(
            "Choose a Player",
            0,
            game.players.length,
            game.players
        ).then(i => gameLoop(game));
    };

    // loadToken(tieflingRogue, (gltf, token) => {
    //     movables.push(token);
    // });
    // loadToken(evokerWizard, (gltf, token) => {
    //     movables.push(token);
    // });
    const card = makeCardObject("Hello World");
    chooseFromObjects("Start Game", 0, 1, [{ modelInWorld: card }]).then(i =>
        gameLoop(game)
    );

    scene.add(card);

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

export function makeCardObject(name, w = 1.618, h = 1) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const textHeight = 100;
    const actualFontSize = 2;
    context.font = "normal " + textHeight + "px Arial";
    const metrics = context.measureText(name);
    const textWidth = metrics.width;
    canvas.width = textWidth;
    canvas.height = textHeight;
    context.font = "normal " + textHeight + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#00ff00";
    context.fillText(name, textWidth / 2, textHeight / 2);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const materialFront = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // side: THREE.DoubleSide,
        map: texture,
    });
    const materialBack = new THREE.MeshPhongMaterial({
        color: 0x000000,
    });
    const front = new THREE.PlaneGeometry(w, h);
    const back = new THREE.PlaneGeometry(w, h);
    back.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));

    const card = new THREE.Object3D();
    card.add(new THREE.Mesh(front, materialFront));
    card.add(new THREE.Mesh(back, materialBack));

    card.lookAt(new Vector3(0, 10000, 0));

    return card;
}
