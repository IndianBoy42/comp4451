// import { DMCard } from './DMCards.mjs';
import { DungeonMayhem } from "./DMgame.mjs";
import { Player } from "./DMplayer.mjs";
import * as Characters from "./characters/characters.mjs";
import { askIntInput } from "./input.mjs";

const game = new DungeonMayhem();
const p1 = new Player("P1", new Characters.Rogue());
game.players.push(p1);
const p2 = new Player("P2", new Characters.Paladin());
game.players.push(p2);
const p3 = new Player("P3", new Characters.Ranger());
game.players.push(p3);
const p4 = new Player("P4", new Characters.Wizard());
game.players.push(p4);
const p5 = new Player("P5", new Characters.Barbarian());
game.players.push(p5);
const p6 = new Player("P6", new Characters.Druid());
game.players.push(p6);
const NUM_PLAYERS = game.players.length;

//======testing setups======//
// import * as Powers from './powers/powers.mjs';
// p1.hand.push(new DMCard("Clever Disguise").addMightyPower(new Powers.RogueImmune()));
// p5.hand.push(new DMCard("Mighty Toss").addMightyPower(new Powers.BarbarianDestroyShield()).addDrawCards(1));
//======testing setups======//

function logPlayer(player) {
    const char = player.character;
    console.log("Player: " + player.name);
    console.log("Character: " + char.name + " (" + char.constructor.name + ")");
    console.log("HP: " + char.health);

    function logCard(card, verbose = false, cardNo = "") {
        console.log(
            "Card " +
                cardNo +
                ": " +
                card.name.padEnd(30) +
                (verbose
                    ? ", shield = " +
                      card.shieldValue +
                      ", heal = " +
                      card.healValue +
                      ", dmg = " +
                      card.dmgValue +
                      ", extra = " +
                      card.extraActions +
                      ", draw = " +
                      card.drawCards +
                      ", super = " +
                      (card.extraPowers.length === 0
                          ? "None"
                          : card.extraPowers[0].constructor.name)
                    : "")
        );
    }

    console.log("Hand:");
    let i = 0;
    for (const card of player.hand) {
        logCard(card, true, i);
        ++i;
    }

    function logShield(shield) {
        console.log(
            "Shield: " +
                shield.name +
                "-" +
                shield.shieldObj.current +
                "/" +
                shield.shieldObj.max
        );
    }

    console.log("Shields:");
    for (const shield of char.shields) {
        logShield(shield);
    }

    console.log("Discards:");
    for (const card of player.discardPile) {
        logCard(card);
    }

    console.log("Cards left in deck: " + player.deck.length);

    console.log("====================================");
}

async function playerPlayCard(player, cardPos) {
    const playCard = player.hand.splice(cardPos, 1)[0];
    await playCard.play(player, game);
    console.log("====================================");
}

//game
console.log("====================================");
for (const pl of game.players) {
    logPlayer(pl);
}

let turn = 1;
let pTurn = 1;

while (true) {
    console.log("==========PLAYER " + pTurn + " TURN " + turn + "===========");
    var player;

    player = game.players[pTurn - 1];

    if (player.character.health > 0) {
        player.startTurn();
        player.drawCards(1);
        // ok i figured out how to read from console
        while (player.character.actionsLeft > 0) {
            logPlayer(player);
            const cardPos = await askIntInput(
                "Choose card to play: ",
                0,
                player.hand.length - 1
            );
            await playerPlayCard(player, cardPos);
            if (game.gameEnded()) break;
        }
        player.endTurn();
    } else {
        // ghost ping
        const opp = await game.choosePlayer(player, true, false, false, true);
        if (opp.length > 0) player.character.doDamage(opp, 1);
    }

    ++pTurn;
    if (pTurn > NUM_PLAYERS) {
        pTurn = 1;
        ++turn;
    }
    for (const pl of game.players) {
        console.log("" + pl.name + " has " + pl.character.health + " hp left");
    }
    if (game.gameEnded()) break;
}

console.log("==============GAME END==============");
for (const pl of game.players) {
    logPlayer(pl);
}

// rl.close();