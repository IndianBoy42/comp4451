import { MightyPower } from '../DMpower.mjs';

// immune for 1 turn
export class RogueImmune extends MightyPower {
    play(player, context) {
        player.character.disguised = true;
        player.character.startTurnCallbacks.push(function() {
            player.character.disguised = false;
        });
    }
}

// destroy shield
export class RogueDestroyShield extends MightyPower {
    play(player, context) {
        const ps = context.chooseShield();
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
    play(player, context) {
        const opponent = context.choosePlayer(player)[0];
        const card = opponent.getFromDiscard(true);
        if (!(card === null)) card.play(player, context);
    }
}