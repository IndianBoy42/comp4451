import { DMCard } from "../DMcards.mjs";
import {
    BarbarianDiscardHand,
    BarbarianDestroyShield,
    BarbarianHeal,
} from "../powers/barbarian.mjs";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

function BrutalPunch() {
    //x2
    return new DMCard("Brutal Punch").addDamage(2);
}
function TwoAxes() {
    //x2
    return new DMCard("Two Axes Are Better Than One").addActions(2);
}
function HeadButt() {
    //x2
    return new DMCard("Head Butt").addDamage(1).addActions(1);
}
function BigAxe() {
    //x5
    return new DMCard("Big Axe Is Best Axe").addDamage(3);
}
function Rage() {
    //x2
    return new DMCard("RAGE!").addDamage(4);
}
function Raff() {
    //x2
    return new DMCard("Riff").addShield(3);
}
function SpikedShield() {
    //x1
    return new DMCard("Spiked Shield").addShield(2);
}
function BagOfRats() {
    //x1
    return new DMCard("Bag Of Rats").addShield(1).addDrawCards(1);
}
function SnackTime() {
    //x1
    return new DMCard("Snack Time").addDrawCards(2).addHeal(1);
}
function OpenTheArmory() {
    //x2
    return new DMCard("Open The Armory").addDrawCards(2);
}
function Flex() {
    //x2
    return new DMCard("Flex!").addHeal(1).addDrawCards(1);
}
function BattleRoar() {
    //x2
    return new DMCard("Battle Roar")
        .addMightyPower(new BarbarianDiscardHand())
        .addActions(1);
}
function MightyToss() {
    //x2
    return new DMCard("Mighty Toss")
        .addMightyPower(new BarbarianDestroyShield())
        .addDrawCards(1);
}
function WhirlingAxes() {
    //x1
    return new DMCard("Whirling Axes").addMightyPower(new BarbarianHeal());
}

export function getBarbarianDeck() {
    return [
        BrutalPunch(),
        BrutalPunch(),
        TwoAxes(),
        TwoAxes(),
        HeadButt(),
        HeadButt(),
        BigAxe(),
        BigAxe(),
        BigAxe(),
        BigAxe(),
        BigAxe(),
        Rage(),
        Rage(),
        Raff(),
        Raff(),
        SpikedShield(),
        BagOfRats(),
        SnackTime(),
        OpenTheArmory(),
        OpenTheArmory(),
        Flex(),
        Flex(),
        BattleRoar(),
        BattleRoar(),
        MightyToss(),
        MightyToss(),
        WhirlingAxes(),
    ];
}
