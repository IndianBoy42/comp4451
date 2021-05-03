import { MightyPower } from "../DMpower.mjs";
import { allPowers } from "../DMpower.mjs";

//swap hand with another
export class TentaculousSwapHand extends MightyPower {
    async play(player, context) {
        const o = await context.choosePlayer(player, true);
        if (o.length === 0) return;
        const opponent = o[0];
        const temp = opponent.hand.splice(0, opponent.hand.length);
        opponent.hand.push(...player.hand.splice(0, player.hand.length));
        player.hand.push(...temp);
    }
}

//add top card from opponent's discard to hand
export class TentaculousStealCards extends MightyPower {
    async play(player, context) {
        const players = context.players;
        for (const other of players) {
            if (other === player) continue;
            const card = await other.getFromDiscard(true);
            if (card != null) player.addCardToHand(card);
        }
    }
}

//attack opponent for each card they have in hand
export class TentaculousAttackHand extends MightyPower {
    async play(player, context) {
        const o = await context.choosePlayer(player);
        if (o.length === 0) return;
        const opponent = o[0];
        const damage = Math.min(opponent.hand.length, 5);
        player.character.doDamage([opponent], damage);
    }
}

allPowers.TentaculousSwapHand = TentaculousSwapHand;
allPowers.TentaculousStealCards = TentaculousStealCards;
allPowers.TentaculousAttackHand = TentaculousAttackHand;
