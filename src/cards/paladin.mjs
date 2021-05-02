import { DMCard } from "../DMcards.mjs";
import { uvFromGrid } from "../gfx.js";
import {
    PaladinGetDiscard,
    PaladinDestroyShields,
} from "../powers/paladin.mjs";
import { cardTexture1, cardTexture2 } from "./textures.js";

/**
 * Notes:
 * - done
 */

const backTex = async () => {
    return {
        texture: await cardTexture1,
        uvCoords: uvFromGrid(0, 1, 1)
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture2,
            uvCoords: uvFromGrid(i, 2),
        };
    };
};

function ForTheMostJustice() {
    //x2
    return new DMCard("For The Most Justice!")
        .addDamage(3)
        .setFrontTexture(frontTex(10))
        .setBackTexture(backTex);
}
function ForEvenMoreJustice() {
    //x4
    return new DMCard("For Even More Justice!")
        .addDamage(2)
        .setFrontTexture(frontTex(8))
        .setBackTexture(backTex);
}
function ForJustice() {
    //x3
    return new DMCard("For Justice!")
        .addDamage(1)
        .addActions(1)
        .setFrontTexture(frontTex(9))
        .setBackTexture(backTex);
}
function FingerwagOfJudgment() {
    //x2
    return new DMCard("Finger-wag Of Judgment") //[sic]
        .addActions(2)
        .setFrontTexture(frontTex(6))
        .setBackTexture(backTex);
}
function DivineSmite() {
    //x3
    return new DMCard("Divine Smite")
        .addDamage(3)
        .addHeal(1)
        .setFrontTexture(frontTex(4))
        .setBackTexture(backTex);
}
function FightingWords() {
    //x3
    return new DMCard("Fighting Words")
        .addDamage(2)
        .addHeal(1)
        .setFrontTexture(frontTex(5))
        .setBackTexture(backTex);
}
function HighCharisma() {
    //x2
    return new DMCard("High Charisma")
        .addDrawCards(2)
        .setFrontTexture(frontTex(11))
        .setBackTexture(backTex);
}
function CureWounds() {
    //x1
    return new DMCard("Cure Wounds")
        .addDrawCards(2)
        .addHeal(1)
        .setFrontTexture(frontTex(1))
        .setBackTexture(backTex);
}
function SpinningParry() {
    //x2
    return new DMCard("Spinning Parry")
        .addShield(1)
        .addDrawCards(1)
        .setFrontTexture(frontTex(14))
        .setBackTexture(backTex);
}
function DivineShield() {
    //x2
    return new DMCard("Divine Shield")
        .addShield(3)
        .setFrontTexture(frontTex(3))
        .setBackTexture(backTex);
}
function Fluffly() {
    //x1
    return new DMCard("Fluffly")
        .addShield(2)
        .setFrontTexture(frontTex(7))
        .setBackTexture(backTex);
}
function BanishingSmite() {
    //x1
    return new DMCard("Banishing Smite")
        .addMightyPower(new PaladinDestroyShields())
        .addActions(1)
        .setFrontTexture(frontTex(0))
        .setBackTexture(backTex);
}
function DivineInspiration() {
    //x2
    return new DMCard("Divine Inspiration")
        .addMightyPower(new PaladinGetDiscard())
        .addHeal(2)
        .setFrontTexture(frontTex(2))
        .setBackTexture(backTex);
}

export function getPaladinDeck() {
    return [
        ForTheMostJustice(),
        ForTheMostJustice(),
        ForEvenMoreJustice(),
        ForEvenMoreJustice(),
        ForEvenMoreJustice(),
        ForEvenMoreJustice(),
        ForJustice(),
        ForJustice(),
        ForJustice(),
        FingerwagOfJudgment(),
        FingerwagOfJudgment(),
        DivineSmite(),
        DivineSmite(),
        DivineSmite(),
        FightingWords(),
        FightingWords(),
        FightingWords(),
        HighCharisma(),
        HighCharisma(),
        CureWounds(),
        SpinningParry(),
        SpinningParry(),
        DivineShield(),
        DivineShield(),
        Fluffly(),
        BanishingSmite(),
        DivineInspiration(),
        DivineInspiration(),
    ];
}
