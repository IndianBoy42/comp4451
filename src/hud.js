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
    add("Add Player", () => {
        const i = values.playerCount;
        values.playerCount += 1;
        const folder = gui.addFolder(`Player ${i + 1}`);
        values.players.push({});
        const player = values.players[i];

        function addp(name, value) {
            player[name] = value;
            console.log(player);
            return folder.add(player, name);
        }

        addp("status", "Please Wait");
        const { peer, signalOut, connected } = createPeer(
            new Promise(resolve => {
                addp("token", "Token").onFinishChange(() => {
                    const code = player.token;
                    const signal = Base64.decode(code);
                    resolve(signal);
                });
                addp("paste", () => {
                    navigator.clipboard.readText().then(code => {
                        player.token = code;
                        gui.updateDisplay();
                        const signal = Base64.decode(code);
                        resolve(signal);
                    });
                });
            }),
            true // joining a game is a different part of the GUI, this guy is always the initiator
        );
        signalOut.then(signal => {
            console.log(signal);
            player.signalOut = signal;
            player.status = "Please Copy";
            gui.updateDisplay();
        });
        connected.then(() => {
            player.status = "Connected";
            gui.updateDisplay();
        });
        addp("copy", () => {
            player.status = "Paste Answer";
            gui.updateDisplay();
            const code = Base64.encode(player.signalOut);
            navigator.clipboard.writeText(code);
        });
        peer.on("data", data => {
            player.msg = data;
            gui.updateDisplay();
        });
        addp("ping", () => {
            peer.send("hello world");
        });
        addp("msg", "<Blank>");
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
