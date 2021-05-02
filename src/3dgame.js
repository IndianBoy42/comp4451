import { DungeonMayhem } from "./DMgame.mjs";
import { Player } from "./DMplayer.mjs";
import { RemotePlayer } from "./DMRemotePlayer.mjs";
import { AIPlayer } from "./DMAIPlayer.mjs";
import * as Characters from "./characters/characters.mjs";
import { initRenderPlayer, renderPlayer, updatePlayerToken } from "./gfx.js";

export async function gameLoop(game) {
    const numPlayers = game.players.length;

    console.log("====================================");
    for (const pl of game.players) {
        pl.debugLogMe();
    }

    await game.start();

    const hostPlayer = (() => {
        let hostPlayers = game.players.filter(p => p.isLocalOnHost());
        if (hostPlayers.length == 1) {
            return hostPlayers[0];
        } else {
            return null;
        }
    })();
    console.log({hostPlayer: hostPlayer});

    while (true) {
        console.log(
            "==========PLAYER " + (game.playerTurn + 1) + " TURN " + game.round + "==========="
        );

        await game.processNextTurn(hostPlayer);

        for (const pl of game.players) {
            console.log(
                "" + pl.name + " has " + pl.character.health + " hp left"
            );
        }

        for (const pl of game.players) {
            renderPlayer(pl);
        }

        if (game.gameEnded()) break;
    }

    game.updateGameState();
    console.log("==============GAME END==============");
    for (const pl of game.players) {
        pl.debugLogMe();
    }
}

export let numPlayers;
export let currentGame;

function renderGame(scene, movables) {
    currentGame.players.forEach(initRenderPlayer);

    setInterval(() => {
        // currentGame.updateGameState();
    }, 1000);

    return currentGame;
}

export function startLocalGame(scene, movables) {
    const game = new DungeonMayhem();

    // const p3 = new Player("P3", new Characters.Ranger(), game);
    // const p1 = new Player("P1", new Characters.Rogue(), game);
    // const p2 = new Player("P2", new Characters.Paladin(), game);
    // const p4 = new Player("P4", new Characters.Wizard(), game);
    // const p5 = new Player("P5", new Characters.Barbarian(), game);
    // const p6 = new Player("P6", new Characters.Druid(), game);

    currentGame = game;

    return renderGame(scene, movables);
}

export async function addAIPlayer(name, character) {
    const player = new AIPlayer(name, character, currentGame);

    initRenderPlayer(player);
    await currentGame.updateGameState();

    return player;
}
export async function addLocalPlayer(name, character) {
    const player = new Player(name, character, currentGame);

    initRenderPlayer(player);
    await currentGame.updateGameState();

    return player;
}
export async function addRemotePlayer(playerValues, name, character) {
    const player = new RemotePlayer(playerValues, name, character, currentGame);

    initRenderPlayer(player);
    await currentGame.updateGameState();
    await player.sendPlayerID();

    return player;
}

export function startCurrentGame() {
    gameLoop(currentGame);
}
