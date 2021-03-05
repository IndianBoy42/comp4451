import DMCard from "../DMcards.mjs";
import {
    RogueImmune,
    RogueDestroyShield,
    RogueStealDiscard,
} from "../powers/rogue.js";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

function AllTheThrownDaggers() { //x3
    return DMCard("All The Thrown Daggers").addDamage(3);
}
function TwoThrownDaggers() { //x4
    return DMCard("Two Thrown Daggers").addDamage(2);
}
function OneThrownDagger() { //x5
    return DMCard("One Thrown Dagger").addDamage(1).addActions(1);
}
function CunningAction() { //x2
    return DMCard("Cunning Action").addActions(2);
}
function StolenPotion() { //x2
    return DMCard("Stolen Potion").addHeal(1).addActions(1);
}
function EvenMoreDaggers() { //x1
    return DMCard("Even More Daggers").addDrawCards(2).addHeal(1);
}
function WingedSerpent() { //x2
    return DMCard("Winged Serpent").addShield(1).addDrawCards(1);
}
function TheGoonSquad() { //x2
    return DMCard("The Goon Squad").addShield(2);
}
function MyLittleFriend() { //x1
    return DMCard("My Little Friend").addShield(3);
}
function CleverDisguise() { //x2
    return DMCard("Clever Disguise").addMightyPower(RogueImmune);
}
function SneakAttack() { //x2
    return DMCard("Sneak Attack!").addMightyPower(RogueDestroyShield).addActions(1);
}
function PickPocket() { //x2
    return DMCard("Pick Pocket").addMightyPower(RogueStealDiscard);
}

export function getRogueDeck() {
    return [
        AllTheThrownDaggers(), AllTheThrownDaggers(), AllTheThrownDaggers(),
        TwoThrownDaggers(), TwoThrownDaggers(), TwoThrownDaggers(), TwoThrownDaggers(),
        OneThrownDagger(), OneThrownDagger(), OneThrownDagger(), OneThrownDagger(), OneThrownDagger(),
        CunningAction(), CunningAction(),
        StolenPotion(), StolenPotion(),
        EvenMoreDaggers(),
        WingedSerpent(), WingedSerpent(),
        TheGoonSquad(), TheGoonSquad(),
        MyLittleFriend(),
        CleverDisguise(), CleverDisguise(),
        SneakAttack(), SneakAttack(),
        PickPocket(), PickPocket(),
    ];
}
