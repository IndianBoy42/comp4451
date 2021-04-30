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
    let round = 1;
    let playerTurn = 1;

    await game.start();

    const hostPlayer = (() => {
        let hostPlayers = game.players.filter(p => p.isLocalOnHost());
        if (hostPlayers.length == 1) {
            return hostPlayers[0];
        } else {
            return null;
        }
    })();

    while (true) {
        console.log(
            "==========PLAYER " + playerTurn + " TURN " + round + "==========="
        );
        var player;

        game.playerTurn = playerTurn;
        player = game.players[playerTurn - 1];

        if (player.character.health > 0) {
            player.startTurn(!(hostPlayer && hostPlayer.id == player.id));
            player.drawCards(1);
            await player.playerTurn();
            player.endTurn(!(hostPlayer && hostPlayer.id == player.id));
        } else {
            // ghost ping
            const opp = await game.choosePlayer(
                player,
                true,
                false,
                false,
                true
            );
            if (opp.length > 0) player.character.doDamage(opp, 1);
        }

        ++playerTurn;
        if (playerTurn > numPlayers) {
            playerTurn = 1;
            ++round;
        }
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

export async function addLocalPlayer(name, character) {
    const player = new Player(name, character, currentGame);

    initRenderPlayer(player);
    await currentGame.updateGameState();
}
export async function addRemotePlayer(playerValues, name, character) {
    const player = new RemotePlayer(playerValues, name, character, currentGame);

    initRenderPlayer(player);
    await currentGame.updateGameState();
    await player.sendPlayerID();
}

export function startCurrentGame() {
    gameLoop(currentGame);
}
