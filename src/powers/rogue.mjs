import { MightyPower } from '../DMpower.mjs';

// immune for 1 turn
export class RogueImmune extends MightyPower {
    play(player, context) {
        player.character.disguised = true;
    }
}

// destroy shield
export class RogueDestroyShield extends MightyPower {
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

// steal discarded card and play
export class RogueStealDiscard extends MightyPower {
    async play(player, context) {
        //TODO only pick from players with discard pile
        const o = await context.choosePlayer(player, true);
        const opponent = o[0];
        const card = await opponent.getFromDiscard(true);
        if (!(card === null)) await card.play(player, context);
    }
}