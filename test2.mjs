import { DungeonMayhem } from './js/DMgame.mjs';
import { Player } from './js/DMplayer.mjs';
import * as Characters from './js/characters/characters.mjs';

const p1 = new Player("Player1", new Characters.Ranger());
const p2 = new Player("Player2", new Characters.Paladin());
const game = new DungeonMayhem();
game.players.push(p1);
game.players.push(p2);

function logPlayer(player) {
    const char = player.character;
    console.log("Player: " + player.name);
    console.log("Character: " + char.name + " (" + char.constructor.name + ")");
    console.log("HP: " + char.health);

    function logCard(card, verbose = false) {
        console.log("Card: " + card.name + (verbose ? ", shield = " + card.shieldValue + 
                    ", heal = " + card.healValue + ", dmg = " + card.dmgValue + 
                    ", extra = " + card.extraActions + ", draw = " + card.drawCards + 
                    ", super = " + 
                    (card.extraPowers.length === 0 ? "None" : card.extraPowers[0].constructor.name) : ""));
    }

    console.log("Hand:")
    for (const card of player.hand) {
        logCard(card, true);
    }

    function logShield(shield) {
        console.log("Shield: " + shield.name + "" + shield.current + "/" + shield.max);
    }

    console.log("Shields:")
    for (const shield of char.shields) {
        logShield(shield);
    }

    console.log("Discards:")
    for (const card of player.discardPile) {
        logCard(card);
    }

    console.log("====================================");
}

function playerPlayCard(player) {
    const playCard = player.hand.pop();
    console.log("Player " + player.name + " plays " + playCard.name);
    playCard.play(player, game);
    player.disCard(playCard);
    console.log("====================================");
}

//game
console.log("====================================");
logPlayer(p1);
logPlayer(p2);

p1.drawCards(1);
playerPlayCard(p1);

logPlayer(p1);
logPlayer(p2);