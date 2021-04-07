import { MightyPower } from "../DMpower.mjs";

// Each player gives their hit point total to the player on their right
export class RangerRotateHP extends MightyPower {
    play(player, context) {
        const players = context.players.slice();
        for (const i in players) {
            if (!players[i].character.targetable()) {
                players.splice(i, 1);
            }
        }
        for (let i = 1; i < players.length; i++) {
            const a = players[i];
            const b = players[i - 1];
            a.character.swapHealth(b.character);
        }
    }
}

// Draw a card from the top of each opponent's deck
export class RangerStealCards extends MightyPower {
    play(player, context) {
        const players = context.players;
        for (const other of players) {
            if (other == player) continue;
            const card = other.drawCard();
            player.addCardToHand(card);
        }
    }
}

// Your Damage cards deal one bonues damage this turn
export class RangerBonusDamage extends MightyPower {
    play(player, context) {
        if (typeof player.character.chargeBonus === "function") {
            player.character.chargeBonus();
        }
    }
}
