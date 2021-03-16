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
        [opponent, ishield] = context.chooseShield();
        const shield = opponent.character.stealShield(ishield);
        opponent.disCard(shield);
    }
}

// steal discarded card and play
export class RogueStealDiscard extends MightyPower {
    play(player, context) {
        const opponent = context.choosePlayer();
        const card = opponent.getFromDiscard(true);
        card.play(player, context);
    }
}