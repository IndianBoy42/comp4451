import { MightyPower } from '../DMpower.mjs';

// gain any discarded card
export class PaladinGetDiscard extends MightyPower {
    play(player, context) {
        const card = player.getFromDiscard(false);
        player.addCardToHand(card);
    }
}

// destroy all shield
export class PaladinDestroyShields extends MightyPower {
    play(player, context) {
        for (const other of context.allPlayers) {
            while (true) {
                const shield = other.character.stealShield(0);
                if (shield === null) break;
                other.disCard(shield);
            }
        }
    }
}