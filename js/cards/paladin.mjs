import { DMCard } from "../DMcards.mjs";
import {
    PaladinGetDiscard,
    PaladinDestroyShields,
} from "../powers/paladin.mjs";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

function ForTheMostJustice() { //x2
    return new DMCard("For The Most Justice!").addDamage(3);
}
function ForEvenMoreJustice() { //x4
    return new DMCard("For Even More Justice!").addDamage(2);
}
function ForJustice() { //x3
    return new DMCard("For Justice!").addDamage(1).addActions(1);
}
function FingerwagOfJudgment() { //x2
    return new DMCard("Finger-wag Of Judgment").addActions(2); //[sic]
}
function DivineSmite() { //x3
    return new DMCard("Divine Smite").addDamage(3).addHeal(1);
}
function FightingWords() { //x3
    return new DMCard("Fighting Words").addDamage(2).addHeal(1);
}
function HighCharisma() { //x2
    return new DMCard("High Charisma").addDrawCards(2);
}
function CureWounds() { //x1
    return new DMCard("Cure Wounds").addDrawCards(2).addHeal(1);
}
function SpinningParry() { //x2
    return new DMCard("Spinning Parry").addShield(1).addDrawCards(1);
}
function DivineShield() { //x2
    return new DMCard("Divine Shield").addShield(3);
}
function Fluffly() { //x1
    return new DMCard("Fluffly").addShield(2);
}
function BanishingSmite() { //x1
    return new DMCard("Banishing Smite").addMightyPower(new PaladinDestroyShields()).addActions(1);
}
function DivineInspiration() { //x2
    return new DMCard("Divine Inspiration").addMightyPower(new PaladinGetDiscard()).addHeal(2);
}

export function getPaladinDeck() {
    return [
        ForTheMostJustice(), ForTheMostJustice(),
        ForEvenMoreJustice(), ForEvenMoreJustice(), ForEvenMoreJustice(), ForEvenMoreJustice(),
        ForJustice(), ForJustice(), ForJustice(),
        FingerwagOfJudgment(), FingerwagOfJudgment(),
        DivineSmite(), DivineSmite(), DivineSmite(),
        FightingWords(), FightingWords(), FightingWords(),
        HighCharisma(), HighCharisma(),
        CureWounds(),
        SpinningParry(), SpinningParry(),
        DivineShield(), DivineShield(),
        Fluffly(),
        BanishingSmite(),
        DivineInspiration(), DivineInspiration(),
    ];
}


