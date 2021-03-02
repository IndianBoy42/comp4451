import DMCard from "../DMcards.mjs";
import {
    BarbarianDiscardHand,
    BarbarianDestroyShield,
    BarbarianHeal
} from "../powers/barbarian.js";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

function BrutalPunch() { //x2
    return DMCard("Brutal Punch").addDamage(2);
}
function TwoAxes() { //x2
    return DMCard("Two Axes Are Better Than One").addActions(2);
}
function HeadButt() { //x2
    return DMCard("Head Butt").addDamage(1).addActions(1);
}
function BigAxe() { //x5
    return DMCard("Big Axe Is Best Axe").addDamage(3);
}
function Rage() { //x2
    return DMCard("RAGE!").addDamage(4);
}
function Raff() { //x2
    return DMCard("Riff").addShield(3);
}
function SpikedShield() { //x1
    return DMCard("Spiked Shield").addShield(2);
}
function BagOfRats() { //x1
    return DMCard("Bag Of Rats").addShield(1).addDrawCards(1);
}
function SnackTime() { //x1
    return DMCard("Snack Time").addDrawCards(2).addHeal(1);
}
function OpenTheArmory() { //x2
    return DMCard("Open The Armory").addDrawCards(2);
}
function Flex() { //x2
    return DMCard("Flex!").addHeal(1).addDrawCards(1);
}
function BattleRoar() { //x2
    return DMCard("Battle Roar").addMightyPower(BarbarianDiscardHand).addActions(1);
}
function MightyToss() { //x2
    return DMCard("Mighty Toss").addMightyPower(BarbarianDestroyShield).addDrawCards(1);
}
function WhirlingAxes() { //x1
    return DMCard("Whirling Axes").addMightyPower(BarbarianHeal);
}

export function getBarbarianDeck() {
    return [
        BrutalPunch(), BrutalPunch(),
        TwoAxes(), TwoAxes(),
        HeadButt(), HeadButt(),
        BigAxe(), BigAxe(), BigAxe(), BigAxe(), BigAxe(),
        Rage(), Rage(),
        Raff(), Raff(),
        SpikedShield(),
        BagOfRats(),
        SnackTime(),
        OpenTheArmory(), OpenTheArmory(),
        Flex(), Flex(),
        BattleRoar(), BattleRoar(),
        MightyToss(), MightyToss(),
        WhirlingAxes(),
    ];
}
