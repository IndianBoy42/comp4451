import * as THREE from "three";
import { DungeonMayhem } from "./DMgame.mjs";
import { Player } from "./DMplayer.mjs";
import * as Characters from "./characters/characters.mjs";
import { initRenderPlayer, loadModel, updatePlayerToken } from "./gfx.js";
import { chooseFromObjects, chooseFromPlayerHand } from "./controls";

export async function gameLoop(game) {
    const NUM_PLAYERS = game.players.length;

    console.log("====================================");
    for (const pl of game.players) {
        pl.debugLogMe();
    }
    let round = 1;
    let playerTurn = 1;

    while (true) {
        console.log(
            "==========PLAYER " + playerTurn + " TURN " + round + "==========="
        );
        var player;

        player = game.players[playerTurn - 1];

        if (player.character.health > 0) {
            player.startTurn();
            player.drawCards(1);
            // ok i figured out how to read from console
            while (player.character.actionsLeft > 0) {
                player.debugLogMe();
                const cardPos = await chooseFromPlayerHand(player);
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
        if (playerTurn > NUM_PLAYERS) {
            playerTurn = 1;
            ++round;
        }
        for (const pl of game.players) {
            console.log(
                "" + pl.name + " has " + pl.character.health + " hp left"
            );
        }
        if (game.gameEnded()) break;

        for (const pl of game.players) {
            updatePlayerToken(pl);
        }
    }

    console.log("==============GAME END==============");
    for (const pl of game.players) {
        pl.debugLogMe();
    }
}

export function startGame(scene, movables) {
    const game = new DungeonMayhem();

    const p1 = new Player("P1", new Characters.Rogue());
    game.players.push(p1);
    const p2 = new Player("P2", new Characters.Paladin());
    game.players.push(p2);
    // const p3 = new Player("P3", new Characters.Ranger());
    // game.players.push(p3);
    const p4 = new Player("P4", new Characters.Wizard());
    game.players.push(p4);
    // const p5 = new Player("P5", new Characters.Barbarian());
    // game.players.push(p5);
    // const p6 = new Player("P6", new Characters.Druid());
    // game.players.push(p6);

    const NUM_PLAYERS = game.players.length;

    game.players.forEach(
        initRenderPlayer(scene, movables, NUM_PLAYERS, (player, token) => {
            movables.push(token);
        })
    );

    return game;
}
