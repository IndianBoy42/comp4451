import { MightyPower } from "../DMpower.mjs";
import { allPowers } from "../DMpower.mjs";

// everyone discard hand, then draw 3 cards
export class BarbarianDiscardHand extends MightyPower {
    play(player, context) {
        for (const other of context.players) {
            other.discardHand(3);
        }
    }
}

// destroy a shield card
export class BarbarianDestroyShield extends MightyPower {
    async play(player, context) {
        const ps = await context.chooseShield(player);
        const opponent = ps[0];
        const ishield = ps[1];
        if (ishield > -1) {
            const shield = opponent.character.stealShield(ishield);
            opponent.disCard(shield);
        }
    }
}

// for each opponent, attack 1 and heal 1
export class BarbarianHeal extends MightyPower {
    play(player, context) {
        for (const other of context.allAliveOpponents(player)) {
            player.character.doDamage([other], 1);
            player.character.heal(1);
        }
    }
}

allPowers.BarbarianDiscardHand = BarbarianDiscardHand;
allPowers.BarbarianDestroyShield = BarbarianDestroyShield;
allPowers.BarbarianHeal = BarbarianHeal;
