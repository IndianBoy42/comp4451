import { DungeonMayhem } from './js/DMgame.mjs';
import { Player } from './js/DMplayer.mjs';
import * as Characters from './js/characters/characters.mjs';

// import * as readline from 'readline';
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
// var userInput;
// var userHasInput = false;
// rl.on('line', (input) => {
//     //console.log(`Received: ${input}`);
//     userInput = input;
//     userHasInput = true;
// });

const p1 = new Player("P1", new Characters.Ranger());
const p2 = new Player("P2", new Characters.Paladin());
const p3 = new Player("P3", new Characters.Rogue());
const p4 = new Player("P4", new Characters.Wizard());
const p5 = new Player("P5", new Characters.Barbarian());
const p6 = new Player("P6", new Characters.Druid());
const game = new DungeonMayhem();
game.players.push(p1);
game.players.push(p2);
game.players.push(p3);
game.players.push(p4);
game.players.push(p5);
game.players.push(p6);
const NUM_PLAYERS = game.players.length;

function logPlayer(player) {
    const char = player.character;
    console.log("Player: " + player.name);
    console.log("Character: " + char.name + " (" + char.constructor.name + ")");
    console.log("HP: " + char.health);

    function logCard(card, verbose = false, cardNo = "") {
        console.log("Card " + cardNo + ": " + card.name + (verbose ? ", shield = " + card.shieldValue + 
                    ", heal = " + card.healValue + ", dmg = " + card.dmgValue + 
                    ", extra = " + card.extraActions + ", draw = " + card.drawCards + 
                    ", super = " + 
                    (card.extraPowers.length === 0 ? "None" : card.extraPowers[0].constructor.name) : ""));
    }

    console.log("Hand:")
    let i = 0;
    for (const card of player.hand) {
        logCard(card, true, i);
        ++i;
    }

    function logShield(shield) {
        console.log("Shield: " + shield.name + "-" + shield.shieldObj.current + "/" + shield.shieldObj.max);
    }

    console.log("Shields:")
    for (const shield of char.shields) {
        logShield(shield);
    }

    console.log("Discards:")
    for (const card of player.discardPile) {
        logCard(card);
    }

    console.log("Cards left in deck: " + player.deck.length);

    console.log("====================================");
}

function playerPlayCard(player, cardPos) {
    const playCard = player.hand.splice(cardPos, 1)[0];
    playCard.play(player, game);
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
        logPlayer(player);
        // AAAAAAAAAAAA I DONT KNOW HOW TO READ FROM CONSOLE REEEEEEEEEEEEEE
        while (player.character.actionsLeft > 0) {
            var cardPos = Math.floor(Math.random() * player.hand.length);
            playerPlayCard(player, cardPos);
            if (game.gameEnded()) break;
        }
        player.endTurn();
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
