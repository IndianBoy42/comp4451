import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as cardTextures from "./cards/textures.js";
import table from "./assets/table.glb";
import { Vector3 } from "three";
import { startLocalGame } from "./3dgame";
import { clipFloor } from "./controls";
import * as DMChars from "./DMchars.mjs";

export const textureLoader = new THREE.TextureLoader();
export const modelLoader = new GLTFLoader();

export const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

export const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;
renderer.setClearColor(0xff0000, 0);
renderer.shadowMap.enabled = true;

export const loaders = {};
export function loaderProgress(name) {
    return xhr => {
        const pc = (xhr.loaded / xhr.total) * 100;
        loaders[name] = pc;
        console.log(`${pc} % loaded for ${name}`);
    };
}
export function loaderError(error) {
    console.error(error);
}

import museum from "./assets/skycubes/museum.jpg";
function loadBackground(scene) {
    textureLoader.load(
        museum,
        texture => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            scene.background = rt.texture;
        },
        loaderProgress("backgroundTexture"),
        loaderError
    );
}

export function loadModel(modelpath, onComplete) {
    modelLoader.load(
        modelpath,
        function (gltf) {
            onComplete(gltf);
            // gltf.animations; // Array<THREE.AnimationClip>
            // gltf.scene; // THREE.Group
            // gltf.scenes; // Array<THREE.Group>
            // gltf.cameras; // Array<THREE.Camera>
            // gltf.asset; // Object
        },
        loaderProgress(modelpath),
        loaderError
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

export function addSpotLightTo(obj, color = 0xff0000) {
    obj.selectionLight = new THREE.SpotLight(color, 5);
    obj.selectionLight.angle = Math.PI / 6;
    obj.selectionLight.penumbra = 0;
    obj.selectionLight.position.set(0, 2 / obj.modelInWorld.scale.length(), 0);
    obj.selectionLight.target = obj.modelInWorld;
    obj.modelInWorld.add(obj.selectionLight);
    return obj;
}

function circlePos(angle, dist = 1) {
    return new Vector3(dist * Math.cos(angle), 0, dist * Math.sin(angle));
}
const positionFromHealthArray = [new Vector3()];
for (let i = 1; i <= DMChars.maxHealth; i++) {
    positionFromHealthArray.push(
        circlePos(i * ((Math.PI * 2) / DMChars.maxHealth))
    );
}
function positionFromHealth(health) {
    return positionFromHealthArray[health];
}
export function updatePlayerToken(player) {
    if (player.modelInWorld)
        player.modelInWorld.position.copy(
            positionFromHealth(player.character.health)
        );
}

let gameScene, gameMovables;
export const renderPlayer = async (player, i, first = false) => {
    const numPlayers = player.context.players.length;
    const scene = gameScene;
    const movables = gameMovables;
    // console.log(`Rendering ${player.id} ${first ? "init" : ""}`);
    if (first) {
        player.modelGroup = new THREE.Object3D();
        scene.add(player.modelGroup);
    }
    const group = player.modelGroup;

    if (first || 1) {
        const angle =
            Math.PI / 2 + ((2 * Math.PI) / numPlayers) * (player.id - 1);
        const dist = 5;
        const pos = new Vector3(
            dist * Math.cos(angle),
            0,
            dist * Math.sin(angle)
        );
        group.position.copy(pos);
        group.rotation.set(0, -angle + Math.PI / 2, 0);
        // group.rotateY(-angle + Math.PI / 2);
        // group.rotation.set(0, -angle + Math.PI / 2, 0);
    }

    if (first) {
        loadModel(player.character.modelPath(), gltf => {
            const token = gltf.scene.children[0];
            group.add(token);
            token.castShadow = true;
            player.character.modelInWorld = token;
            player.modelInWorld = token;

            token.scale.multiplyScalar(0.03);
            token.rotateY(Math.PI);
            updatePlayerToken(player);
            token.dragend = clipFloor(token);
            movables.push(token);
        });
    } else {
        updatePlayerToken(player);
    }

    if (first) {
        for (let j = 1; j <= DMChars.maxHealth; j++) {
            let card = await makeCardObject(`${j}`, {
                w: 0.3,
                h: 0.3,
                minLines: 1,
            });
            card.position.copy(positionFromHealth(j));
            group.add(card);
            card.modelGroup = group;
        }
    }

    if (first) {
        player.discardPile.forEach(async (card, i) => {
            card.modelInWorld = await makeCardObject(card.getCardText());
            group.add(card.modelInWorld);
            card.modelGroup = group;
            moveCardToDiscard(card, player, i);
        });
        player.deck.forEach(async (card, i) => {
            card.modelInWorld = await makeCardObject(card.getCardText());
            group.add(card.modelInWorld);
            card.modelGroup = group;
            moveCardToDeck(card, player, i);
        });
        player.hand.forEach(async (card, i) => {
            card.modelInWorld = await makeCardObject(card.getCardText());
            group.add(card.modelInWorld);
            card.modelGroup = group;
            moveCardToHand(card, player, i);
        });
    } else {
        player.discardPile.forEach((card, i) => {
            moveCardToDiscard(card, player, i);
        });
        player.deck.forEach((card, i) => {
            moveCardToDeck(card, player, i);
        });
        player.hand.forEach((card, i) => {
            moveCardToHand(card, player, i);
        });
    }
};
export const initRenderPlayer = (player, i) => {
    return renderPlayer(player, i, true);
};
const DiscardPilePosition = new Vector3(2, -0.49, 0);
const HandPosition = new Vector3(0, 0.49, 1.2);
const ShieldsPosition = new Vector3(0, -0.49, -2);
const DeckPosition = new Vector3(-2, -0.49, 0);
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
        if (card.modelGroup != player.modelGroup) {
            card.modelGroup.remove(card);
            card.modelGroup = player.modelGroup.add(card.modelInWorld);
        }
        setCardPos(card, DiscardPilePosition);
        card.modelInWorld.position.y += i * 0.01;
        card.hideShow(false);
    }
}
export function moveCardToHand(card, player, i = 0) {
    if (card.modelInWorld) {
        if (card.modelGroup != player.modelGroup) {
            card.modelGroup.remove(card);
            card.modelGroup = player.modelGroup.add(card.modelInWorld);
        }
        const sign = i % 2 == 0 ? +1 : -1;
        const cardsPerRow = 5;
        const offy = Math.floor(i / cardsPerRow);
        const offx = sign * Math.ceil((i % cardsPerRow) / 2);
        setCardPos(card, HandPosition);
        card.modelInWorld.position.x += 1.2 * offx;
        card.modelInWorld.position.y += 1.8 * offy;
        card.modelInWorld.rotateX(Math.PI / 2);
    }
}
export function moveCardToShields(card, player, i = 0) {
    if (card.modelInWorld) {
        if (card.modelGroup != player.modelGroup) {
            card.modelGroup.remove(card);
            card.modelGroup = player.modelGroup.add(card.modelInWorld);
        }
        const sign = i % 2 == 0 ? +1 : -1;
        const cardsPerRow = 5;
        const offy = Math.floor(i / cardsPerRow);
        const offx = Math.ceil((i % cardsPerRow) / 2);
        setCardPos(card, ShieldsPosition);
        card.modelInWorld.position.x += 1.2 * offx * sign;
        card.modelInWorld.position.y += 1.6 * offy;
        card.hideShow(false);
    }
}
export function moveCardToDeck(card, player, i = 0) {
    if (card.modelInWorld) {
        if (card.modelGroup != player.modelGroup) {
            card.modelGroup.remove(card);
            card.modelGroup = player.modelGroup.add(card.modelInWorld);
        }
        setCardPos(card, DeckPosition);
        card.modelInWorld.position.y += i * 0.01;
        card.modelInWorld.rotateX(Math.PI);
        card.hideShow(false);
    }
}

export function createGameScene() {
    const scene = new THREE.Scene();
    const movables = [];

    loadBackground(scene);

    loadModel(table, gltf => {
        const scale = 20;
        gltf.scene.scale.multiplyScalar(scale);
        gltf.scene.position.y -= 0.35 * scale + 0.5;
        gltf.scene.receiveShadow = true;
        scene.add(gltf.scene);
    });

    // let cube1 = cube(scene, { color: 0x44aa88 });
    // movables.push(cube1);
    // cube1.position.x = 0;
    // cube1.hoveron = function (event) {
    //     cube1.material.color.setHex("0xFF0000");
    // };
    // cube1.hoveroff = function (event) {
    //     cube1.material.color.setHex("0x00FF00");
    // };

    gameScene = scene;
    gameMovables = movables;
    const game = startLocalGame(scene, movables);

    // const cube2 = cube(scene, { color: 0x44aa88 });
    // movables.push(cube2);
    // cube2.position.x -= 2;
    // cube2.scale.multiply(new Vector3(1.618, 0.01, 1));
    // cube2.drag = clipFloor(cube2);

    // const cube3 = cube(scene, { color: 0x44aa88 });
    // movables.push(cube3);
    // cube3.position.x += 2;
    // cube3.drag = clipFloor(cube3);
    // cube3.dragend = event => {
    //     cube3.material.color.setHex("0xFF0000");
    //     console.log(game.players);
    //     chooseFromObjects(
    //         "Choose a Player",
    //         0,
    //         game.players.length,
    //         game.players
    //     ).then(i => gameLoop(game));
    // };

    // loadToken(tieflingRogue, (gltf, token) => {
    //     movables.push(token);
    // });
    // loadToken(evokerWizard, (gltf, token) => {
    //     movables.push(token);
    // });
    // const startGameCard = makeCardObject("Start Game");
    // chooseFromObjects("Start Game", 0, 1, [{ modelInWorld: startGameCard }]).then(i =>
    //     gameLoop(game)
    // );
    // startGameCard.rotateX(Math.PI / 2);
    // scene.add(startGameCard);

    const light1 = dir_light(scene);
    light1.position.set(-1, 2, 4);
    light1.castShadow = true;
    const light2 = dir_light(scene);
    light2.position.set(1, 2, 4);
    light2.castShadow = true;
    const light3 = dir_light(scene);
    light3.position.set(-1, 2, -4);
    light3.castShadow = true;
    const light4 = dir_light(scene);
    light4.position.set(1, 2, -4);
    light4.castShadow = true;

    return [scene, movables];
}

/**
 * Divide an entire phrase in an array of phrases, all with the max pixel length given.
 * The words are initially separated by the space char.
 * From https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
 * @param phrase
 * @param length
 * @return
 */
function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    ctx.font = "2px Arial";

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

export function setCardObjectText(
    canvas,
    context,
    texture,
    text,
    color,
    minLines = 5
) {
    const HARDCODE_WIDTH = 10;

    const textHeight = 400;
    canvas.width = textHeight;
    canvas.height = textHeight;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = color;
    const drawText = (textToPrint, i = 0, lines = 1) => {
        lines = Math.max(lines, minLines);
        let height = textHeight / lines;
        const textWidth = context.measureText(textToPrint).width;
        const tempHeight = height;
        if (textWidth > HARDCODE_WIDTH) {
            height = height / (textWidth / HARDCODE_WIDTH);
        }
        const temp = context.font;
        context.font = "" + height + "px Arial";
        context.fillText(
            textToPrint,
            canvas.width / 2,
            textHeight - (tempHeight * (lines - 1 - i) + tempHeight / 2)
        );
        context.font = temp;
    };
    const name_lines = getLines(context, text, HARDCODE_WIDTH);
    for (const i in name_lines) {
        drawText(name_lines[i], i, name_lines.length);
    }

    texture.needsUpdate = true;
}

export function uvFromCorner(x0, y0, x1, y1) {
    return [x0, y1, x1, y1, x0, y0, x1, y0];
}
export function uvFromGrid(i, rows = 7, cols = 10) {
    const r = rows - 1 - Math.floor(i / cols);
    const c = i % cols;
    return uvFromCorner(c / cols, r / rows, (c + 1) / cols, (r + 1) / rows);
}
export async function makeCardObject(
    name,
    { w, h, minLines, texFront, texBack } = {
        w: 1,
        h: 1.618,
        minLines: 5,
        texFront: null,
        texBack: null,
    }
) {
    let canvas, context;
    if (texFront == null) {
        canvas = document.createElement("canvas");
        context = canvas.getContext("2d");
        texFront = new THREE.Texture(canvas);
        setCardObjectText(canvas, context, texFront, name, "#00ff00", minLines);
        texFront.isDummyTextTexture = true;
    }

    const materialFront = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        // side: THREE.DoubleSide,
        map: texFront,
    });
    const materialBack = new THREE.MeshLambertMaterial({
        color: texBack ? 0xffffff : 0,
        map: texBack,
    });
    const front = new THREE.PlaneGeometry(w, h);
    const back = new THREE.PlaneGeometry(w, h);
    const backUV = back.attributes.uv;
    backUV.set(uvFromCorner(0, 0.8, 0.1, 1));
    backUV.needsUpdate = true;
    back.rotateY(Math.PI);
    // back.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));

    const card = new THREE.Object3D();
    card.add(new THREE.Mesh(front, materialFront));
    card.add(new THREE.Mesh(back, materialBack));

    card.lookAt(new Vector3(0, 10000, 0));
    card.canvas = canvas;
    card.context = context;
    card.texture = texFront;
    card.castShadow = true;

    return card;
}
