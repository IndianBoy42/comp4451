import { DMCard } from "../DMcards.mjs";
import {
    RangerStealCards,
    RangerBonusDamage,
    RangerRotateHP,
} from "../powers/ranger.mjs";

/**
 * Notes:
 * - done
 */

function KrydleAndShandie() {
    //x1
    return new DMCard("Krydle And Shandie").addShield(3);
}
function WrapItUp() {
    //x1
    return new DMCard("Wrap It Up").addHeal(1).addDrawCards(1);
}
function ScoutingOuting() {
    //x2
    return new DMCard("Scouting Outing").addMightyPower(new RangerStealCards());
}
function SqueakyWheel() {
    //x3
    return new DMCard("Squeaky Wheel Gets the Kick").addActions(1).addDamage(1);
}
function TwiceTheSmiting() {
    //x3
    return new DMCard("Twice The Smiting").addDamage(2);
}
function PalePriestessNerys() {
    //x2
    return new DMCard("Pale Priestess Nerys").addShield(1).addHeal(1);
}
function MinscMightyMount() {
    //x2
    return new DMCard("Minsc's Mighty Mount").addShield(2);
}
function GoForTheEyesBoo() {
    //x3
    return new DMCard("Go For The Eyes, BOO!!!").addDamage(3);
}
function BooWhatDoWeDo() {
    //x2
    return new DMCard("Boo, What Do We Do?").addDrawCards(2);
}
function Swapportunity() {
    //x2
    return new DMCard("Swapportunity").addMightyPower(new RangerRotateHP());
}
function JusticeWaitsForNoOne() {
    //x2
    return new DMCard("Justice Waits For No One").addActions(2);
}
function SomeoneHoldMyRodent() {
    //x2
    return new DMCard("Someone Hold My Rodent").addDamage(2).addHeal(1);
}
function TimeToPunchEvil() {
    //x1
    return new DMCard("Time To Punch Evil!").addDamage(2).addActions(1);
}
function FavoredFrienemies() {
    //x2
    return new DMCard("Favored Frienemies")
        .addActions(1)
        .addMightyPower(new RangerBonusDamage());
}

export function getRangerDeck() {
    return [
        KrydleAndShandie(),
        WrapItUp(),
        ScoutingOuting(),
        ScoutingOuting(),
        SqueakyWheel(),
        SqueakyWheel(),
        SqueakyWheel(),
        TwiceTheSmiting(),
        TwiceTheSmiting(),
        TwiceTheSmiting(),
        PalePriestessNerys(),
        PalePriestessNerys(),
        MinscMightyMount(),
        MinscMightyMount(),
        GoForTheEyesBoo(),
        GoForTheEyesBoo(),
        GoForTheEyesBoo(),
        BooWhatDoWeDo(),
        BooWhatDoWeDo(),
        Swapportunity(),
        Swapportunity(),
        JusticeWaitsForNoOne(),
        JusticeWaitsForNoOne(),
        SomeoneHoldMyRodent(),
        SomeoneHoldMyRodent(),
        TimeToPunchEvil(),
        FavoredFrienemies(),
        FavoredFrienemies(),
    ];
}
