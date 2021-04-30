import { DungeonMayhem } from "./DMgame.mjs";
import { Player } from "./DMplayer.mjs";
import { RemotePlayer } from "./DMRemotePlayer.mjs";
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

    game.start();

    while (true) {
        console.log(
            "==========PLAYER " + playerTurn + " TURN " + round + "==========="
        );
        var player;

        game.playerTurn = playerTurn;
        player = game.players[playerTurn - 1];

        if (player.character.health > 0) {
            player.startTurn();
            player.drawCards(1);
            // ok i figured out how to read from console
            while (player.character.actionsLeft > 0) {
                player.debugLogMe();
                const cardPos = await player.selectCard();
                await player.playCard(cardPos, game);
                if (game.gameEnded()) break;
            }
            player.endTurn();
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

    console.log("==============GAME END==============");
    for (const pl of game.players) {
        pl.debugLogMe();
    }
}

export let numPlayers;
let currentGame;

function renderGame(scene, movables) {
    const game = currentGame;

    numPlayers = game.players.length;

    game.players.forEach(initRenderPlayer(scene, movables, numPlayers));

    return game;
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

export function createMPGameMenu(scene, movables) {
    const game = new DungeonMayhem();
    currentGame = game;

    let me = new Player("Me", Characters.chooseCharacter(), game);

    renderGame(scene, movables);

    return game;
}

export function addLocalPlayer(name, character) {
    const player = new Player(name, character, currentGame);

    initRenderPlayer()(player);
    currentGame.updateGameState();
}
export function addRemotePlayer(playerValues, name, character) {
    const player = new RemotePlayer(playerValues, name, character, currentGame);

    initRenderPlayer()(player);
    currentGame.updateGameState();
}

export function startCurrentGame() {
    gameLoop(currentGame);
}
