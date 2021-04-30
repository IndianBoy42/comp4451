import { MightyPower } from "../DMpower.mjs";
import { allPowers } from "../DMpower.mjs";

// gain any discarded card
export class PaladinGetDiscard extends MightyPower {
    async play(player, context) {
        const card = await player.getFromDiscard(false);
        if (!(card === null)) player.addCardToHand(card);
    }
}

// destroy all shield
export class PaladinDestroyShields extends MightyPower {
    play(player, context) {
        for (const other of context.players) {
            while (true) {
                const shield = other.character.stealShield(0);
                if (shield === null) break;
                other.disCard(shield);
            }
        }
    }
}

allPowers.PaladinGetDiscard = PaladinGetDiscard;
allPowers.PaladinDestroyShields = PaladinDestroyShields;
