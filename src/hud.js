import * as THREE from "three";
import * as dat from "dat.gui";
import { createPeer } from "./p2p";
import { Base64 } from "js-base64";
import { GeometryUtils } from "three";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export function createGui() {
    const values = {
        playerCount: 0,
        players: [],
        host: true,
    };
    const gui = new dat.GUI({
        hidable: true,
        // closed: true,
        closeOnTop: true,
        name: "Dungeon Mayhem Online",
    });
    gui.remember(values);

    function add(name, value, g = gui) {
        values[name] = value;
        console.log(values);
        return g.add(values, name);
    }

    // var folderLMP = gui.addFolder("Local Multiplayer");
    function addPeer(subValues, folder, initiator) {
        function addp(name, value) {
            subValues[name] = value;
            console.log(subValues);
            return folder.add(subValues, name);
        }

        addp("status", "Please Wait");
        const { peer, signalOut, connected } = createPeer(
            new Promise(resolve => {
                addp("token", "Token").onFinishChange(() => {
                    const code = subValues.token;
                    const signal = Base64.decode(code);
                    resolve(signal);
                });
                addp("paste", () => {
                    navigator.clipboard.readText().then(code => {
                        subValues.token = code;
                        gui.updateDisplay();
                        const signal = Base64.decode(code);
                        resolve(signal);
                    });
                });
            }),
            initiator // joining a game is a different part of the GUI, this guy is always the initiator
        );
        signalOut.then(signal => {
            console.log(signal);
            subValues.signalOut = signal;
            if (initiator) {
                subValues.status = "Please Copy";
            } else {
                subValues.status = "Answer Copied";
                const code = Base64.encode(subValues.signalOut);
                navigator.clipboard.writeText(code);
            }
            gui.updateDisplay();
        });
        connected.then(() => {
            subValues.status = "Connected";
            gui.updateDisplay();
        });
        if (initiator) {
            addp("copy", () => {
                subValues.status = "Paste Answer";
                gui.updateDisplay();
                const code = Base64.encode(subValues.signalOut);
                navigator.clipboard.writeText(code);
            });
        } else {
            subValues.status = "Paste Offer";
            gui.updateDisplay();
        }
        peer.on("data", data => {
            subValues.msg = data;
            gui.updateDisplay();
        });
        addp("ping", () => {
            peer.send("hello world");
        });
        addp("msg", "<Blank>");
    }
    const addPlayerBtn = add("Add Player", () => {
        const i = values.playerCount;
        values.playerCount += 1;
        const folder = gui.addFolder(`Player ${i + 1}`);
        values.players.push({});
        gui.remove(addPlayerBtn);
        gui.remove(joinGameBtn);
        addPeer(values.players[i], folder, true);
    });
    const joinGameBtn = add("Join Game", () => {
        let folder = gui.addFolder("Game");
        values.joinedGame = {};
        values.host = false;
        gui.remove(addPlayerBtn);
        gui.remove(joinGameBtn);
        addPeer(values.joinedGame, folder, false);
    });
    add("hello", 10.0);

    return [gui, values];
}

export function createHud() {
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

    function onMouseMove(event) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
    }
    window.addEventListener("mousemove", onMouseMove, false);

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
