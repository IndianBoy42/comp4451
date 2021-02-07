import DMCard from "../DMcards.mjs";
import {
    RangerStealCards,
    RangerBonusDamage,
    RangerRotateHP,
} from "../powers/ranger";

function KrydleAndShandie() {
    return DMCard.shieldCard("Krydle and Shandie", 3);
}
function WrapItUp() {
    return DMCard("Wrap It Up").addHeal(1).addDrawCards(1);
}
function ScoutingOuting() {
    return DMCard.powerCard("Scouting Outing", RangerStealCards(1));
}
function SqueakyWheel() {
    return DMCard("Squeaky Wheel Gets the Kick").addActions(1).addDamage(1);
}
function TwiceTheSmiting() {
    return DMCard.damageCard("Twice the Smiting").addDamage(2);
}
function PalePriestessNerys() {
    return DMCard("Pale Priestess Nerys").addShield(1).addHeal(1);
}
function MinscMightyMount() {
    return DMCard.shieldCard("Minsc's Mighty Mount", 2);
}
function GoForTheEyesBoo() {
    return DMCard.damageCard("Go for the Eyes, BOO!!!", 3);
}
function BooWhatDoWeDo() {
    return DMCard.drawCardsCard("Boo, What Do We Do?", 2);
}
function Swapportunity() {
    return DMCard.powerCard("Swapportunity", RangerRotateHP(1));
}
function JusticeWaitsForNoOne() {
    return DMCard.actionCard("Justice Waits For No One", 2);
}
function SomeoneHoldMyRodent() {
    return DMCard("Someone Hold My Rodent").addDamage(2).addHeal(1);
}
function TimeToPunchEvil() {
    return DMCard("Time to Punch Evil!").addDamage(2).addActions(1);
}
function FavoredFrienemies() {
    return DMCard("Favored Frienemies")
        .addActions(1)
        .addMightyPower(RangerBonusDamage(1));
}
