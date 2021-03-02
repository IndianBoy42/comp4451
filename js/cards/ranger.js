import DMCard from "../DMcards.mjs";
import {
    RangerStealCards,
    RangerBonusDamage,
    RangerRotateHP,
} from "../powers/ranger";

/**
 * Notes:
 * - done
 */

function KrydleAndShandie() { //x1
    return DMCard.shieldCard("Krydle And Shandie", 3);
}
function WrapItUp() { //x1
    return DMCard("Wrap It Up").addHeal(1).addDrawCards(1);
}
function ScoutingOuting() { //x2
    return DMCard.powerCard("Scouting Outing", RangerStealCards(1));
}
function SqueakyWheel() { //x3
    return DMCard("Squeaky Wheel Gets the Kick").addActions(1).addDamage(1);
}
function TwiceTheSmiting() { //x3
    return DMCard.damageCard("Twice The Smiting").addDamage(2);
}
function PalePriestessNerys() { //x2
    return DMCard("Pale Priestess Nerys").addShield(1).addHeal(1);
}
function MinscMightyMount() { //x2
    return DMCard.shieldCard("Minsc's Mighty Mount", 2);
}
function GoForTheEyesBoo() { //x3
    return DMCard.damageCard("Go For The Eyes, BOO!!!", 3);
}
function BooWhatDoWeDo() { //x2
    return DMCard.drawCardsCard("Boo, What Do We Do?", 2);
}
function Swapportunity() { //x2
    return DMCard.powerCard("Swapportunity", RangerRotateHP(1));
}
function JusticeWaitsForNoOne() { //x2
    return DMCard.actionCard("Justice Waits For No One", 2);
}
function SomeoneHoldMyRodent() { //x2
    return DMCard("Someone Hold My Rodent").addDamage(2).addHeal(1);
}
function TimeToPunchEvil() { //x1
    return DMCard("Time To Punch Evil!").addDamage(2).addActions(1);
}
function FavoredFrienemies() { //x2
    return DMCard("Favored Frienemies")
        .addActions(1)
        .addMightyPower(RangerBonusDamage(1));
}

export function getRangerDeck() {
    return [
        KrydleAndShandie(),
        WrapItUp(),
        ScoutingOuting(), ScoutingOuting(),
        SqueakyWheel(), SqueakyWheel(), SqueakyWheel(),
        TwiceTheSmiting(), TwiceTheSmiting(), TwiceTheSmiting(),
        PalePriestessNerys(), PalePriestessNerys(),
        MinscMightyMount(), MinscMightyMount(),
        GoForTheEyesBoo(), GoForTheEyesBoo(), GoForTheEyesBoo(),
        BooWhatDoWeDo(), BooWhatDoWeDo(),
        Swapportunity(), Swapportunity(),
        JusticeWaitsForNoOne(), JusticeWaitsForNoOne(),
        SomeoneHoldMyRodent(), SomeoneHoldMyRodent(),
        TimeToPunchEvil(),
        FavoredFrienemies(), FavoredFrienemies(),
    ];
}
