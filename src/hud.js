import * as THREE from "three";
import * as dat from "dat.gui";
import { createPeer } from "./p2p";
import { Base64 } from "js-base64";
import { addLocalPlayer, addAIPlayer, startCurrentGame } from "./3dgame";
import { remotePlayerConnect, remotePlayerData } from "./DMRemotePlayer.mjs";
import { remoteGameConnect, remoteGameData } from "./remoteGame.mjs";
import { loaders } from "./gfx";
import { allCharacters, characterMap } from "./characters/characters.mjs";
import { DEBUG_RNG_INPUT, setDebugRngInput } from "./controls.js";
import { hashDict } from "./url.js";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export const guiValues = {
    playerCount: 0,
    players: [],
    host: true,
    debug_auto: false,
};
export function createGui() {
    const values = guiValues;
    const gui = new dat.GUI({
        // hidable: true,
        // closed: true,
        closeOnTop: true,
        name: "Dungeon Mayhem Online",
    });
    gui.remember(values);

    function add(name, value, g = gui, vals = values) {
        vals[name] = value;
        return g.add(vals, name);
    }

    function newPlayerFolder() {
        const i = values.playerCount;
        values.playerCount += 1;
        return gui.addFolder(`Player ${i + 1}`);
    }

    function addPeer(subValues, folder, initiator) {
        function addp(name, value) {
            subValues[name] = value;
            return folder.add(subValues, name);
        }

        addp("status", "Please Wait").listen();
        const { peer, signalOut, connected } = createPeer(
            new Promise(resolve => {
                subValues.signalResolver = resolve;
                subValues.tokenField = addp("token", "Token").onFinishChange(
                    () => {
                        const code = subValues.token;
                        const signal = Base64.decode(code);
                        subValues.signalResolver(signal);
                        folder.remove(subValues.copyBtn);
                    }
                );
                subValues.pasteBtn = addp("paste", () => {
                    navigator.clipboard.readText().then(code => {
                        subValues.token = code;
                        const signal = Base64.decode(code);
                        subValues.signalResolver(signal);
                        if (subValues.copyBtn) folder.remove(subValues.copyBtn);
                    });
                });
            }),
            initiator // joining a game is a different part of the GUI, this guy is always the initiator
        );
        subValues.peer = peer;
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
        });
        let conn = connected.then(() => {
            subValues.status = "Connected";
            folder.remove(subValues.pasteBtn);
            folder.remove(subValues.tokenField);
        });
        if (initiator) {
            subValues.copyBtn = addp("copy", () => {
                subValues.status = "Paste Answer";
                const code = Base64.encode(subValues.signalOut);
                navigator.clipboard.writeText(code);
            });
        } else {
            subValues.status = "Paste Offer";
        }

        addp("debug_ping", () => {
            peer.send("hello world");
        });
        addp("debug_msg", "<Blank>").listen();

        return conn;
    }
    const addRemotePlayerBtn = add("addRemotePlayer", () => {
        const folder = newPlayerFolder();
        folder.open();
        const player = {};
        values.players.push(player);
        try {
            gui.remove(joinGameBtn);
        } catch (e) {}
        const connected = addPeer(player, folder, true);

        connected.then(() => remotePlayerConnect(player));
        player.peer.on("data", data => {
            player.msg = data;
            remotePlayerData(player, data);
        });
    }).name("Add Remote Player");

    values.aiPlayerButtons = {};
    const addAIPlayerFolder = gui.addFolder("Add AI Player");
    add("Name", "Player", addAIPlayerFolder);
    let newPlayerAI = async c => {
        const p = await addAIPlayer(values.Name, new c());
        const folder = newPlayerFolder();
        add("Name (AI): " + values.Name, () => {}, folder);
        add("Class: " + c.name, () => {}, folder);
        const deckFolder = folder.addFolder("Deck");
        for (const cardIndex in p.character.defaultDeck()) {
            const card = p.character.defaultDeck()[cardIndex];
            const cardFolder = deckFolder.addFolder(
                "Card " + (+cardIndex + 1) + ": " + card.name
            );
            add("Name: " + card.name, () => {}, cardFolder);
            add("Dmg: " + card.dmgValue, () => {}, cardFolder);
            add("Heal: " + card.healValue, () => {}, cardFolder);
            add("Shield: " + card.shieldValue, () => {}, cardFolder);
            add("Extra: " + card.extraActions, () => {}, cardFolder);
            add("Draw: " + card.drawCards, () => {}, cardFolder);
            add(
                "Power: " +
                    (card.extraPowers.length > 0
                        ? card.extraPowers[0].constructor.name
                        : "None"),
                () => {},
                cardFolder
            );
        }
    };
    values.localPlayerButtons = {};
    const addLocalPlayerFolder = gui.addFolder("Add Local Player");
    add("Name", "Player", addLocalPlayerFolder);
    let newPlayerLocal = async c => {
        const p = await addLocalPlayer(values.Name, new c());
        const folder = newPlayerFolder();
        add("Name: " + values.Name, () => {}, folder);
        add("Class: " + c.name, () => {}, folder);
        const deckFolder = folder.addFolder("Deck");
        for (const cardIndex in p.character.defaultDeck()) {
            const card = p.character.defaultDeck()[cardIndex];
            const cardFolder = deckFolder.addFolder(
                "Card " + (+cardIndex + 1) + ": " + card.name
            );
            add("Name: " + card.name, () => {}, cardFolder);
            add("Dmg: " + card.dmgValue, () => {}, cardFolder);
            add("Heal: " + card.healValue, () => {}, cardFolder);
            add("Shield: " + card.shieldValue, () => {}, cardFolder);
            add("Extra: " + card.extraActions, () => {}, cardFolder);
            add("Draw: " + card.drawCards, () => {}, cardFolder);
            add(
                "Power: " +
                    (card.extraPowers.length > 0
                        ? card.extraPowers[0].constructor.name
                        : "None"),
                () => {},
                cardFolder
            );
        }
    };
    allCharacters.forEach(c => {
        add(
            c.name,
            () => newPlayerLocal(c),
            addLocalPlayerFolder,
            values.localPlayerButtons
        );
    });
    allCharacters.forEach(c => {
        add(
            c.name,
            () => newPlayerAI(c),
            addAIPlayerFolder,
            values.aiPlayerButtons
        );
    });

    const joinGameBtn = add("Join Game", () => {
        let folder = gui.addFolder("Game");
        folder.open();
        values.joinedGame = {};
        values.host = false;
        try {
            gui.remove(addRemotePlayerBtn);
        } catch (e) {}
        try {
            gui.removeFolder(addAIPlayerFolder);
        } catch (e) {}
        try {
            gui.removeFolder(addLocalPlayerFolder);
        } catch (e) {}
        try {
            gui.remove(joinGameBtn);
        } catch (e) {}
        try {
            gui.remove(startGameBtn);
        } catch (e) {}
        add("name", "", folder, values.joinedGame).name("Name");
        add(
            "class",
            "class" in hashDict /* hashDict.hasOwnProperty("char") */
                ? hashDict["class"]
                : "Wizard",
            folder,
            values.joinedGame
        )
            .options(allCharacters.map(c => c.name))
            .name("Class");
        const connected = addPeer(values.joinedGame, folder, false);

        values.joinedGame.peer.on("data", data =>
            remoteGameData(values.joinedGame, data)
        );
        connected.then(() => remoteGameConnect(values.joinedGame));
    });

    const startGameBtn = add("start", () => {
        try {
            gui.remove(addRemotePlayerBtn);
        } catch (e) {}
        try {
            gui.remove(joinGameBtn);
        } catch (e) {}
        // try {
        //     gui.remove(startGameBtn);
        // } catch (e) {}
        try {
            gui.removeFolder(addAIPlayerFolder);
        } catch (e) {}
        try {
            gui.removeFolder(addLocalPlayerFolder);
        } catch (e) {}
        startGameBtn.name("Restart Game");
        startCurrentGame();
    }).name("Start Game");

    add("debug_auto", false).onFinishChange(setDebugRngInput).listen();

    if (false) {
        // FIXME: This is not so reliable as things load on demand now
        const loadingBar = add("loading", 0).name("Loading").listen();
        const loadingBarMonitor = setInterval(() => {
            let pc = 0;
            let c = 0;
            loaders.forEach(loader => {
                pc += loader;
                c++;
            });
            values.loading = pc / c;
            if (pc >= c * 100) {
                clearInterval(loadingBarMonitor);
                try {
                    gui.remove(loadingBar);
                } catch (e) {
                    e;
                }
            }
        }, 250);
    }

    if ("join" in hashDict) {
        values["Join Game"]();
    }
    if (hashDict.hasOwnProperty("auto")) {
        values["debug_auto"] = true;
        setDebugRngInput(true);
    }
    ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"].forEach(p => {
        if (p in hashDict) {
            if ("remote".startsWith(hashDict[p].toLowerCase())) {
                values["addRemotePlayer"]();
            } else {
                const newP = (f, cls) => {
                    if (characterMap[cls]) f(characterMap[cls]);
                };
                if (hashDict[p].startsWith("AI"))
                    newP(newPlayerAI, hashDict[p].substr(2));
                else newP(newPlayerLocal, hashDict[p]);
            }
        }
    });

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
