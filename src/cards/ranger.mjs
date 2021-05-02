import { DMCard } from "../DMcards.mjs";
import { uvFromCorner, uvFromGrid } from "../gfx.js";
import {
    RangerStealCards,
    RangerBonusDamage,
    RangerRotateHP,
} from "../powers/ranger.mjs";
import { cardTexture36, cardTexture42 } from "./textures.js";

/**
 * Notes:
 * - done
 */

const backTex = async () => {
    return {
        texture: await cardTexture36,
        uvCoords: uvFromGrid(0, 1, 1)
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture42,
            uvCoords: uvFromGrid(i),
        };
    };
};

function KrydleAndShandie() {
    //x1
    return new DMCard("Krydle And Shandie")
        .addShield(3)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(9));
}
function WrapItUp() {
    //x1
    return new DMCard("Wrap It Up")
        .addHeal(1)
        .addDrawCards(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(27));
}
function ScoutingOuting() {
    //x2
    return new DMCard("Scouting Outing")
        .addMightyPower(new RangerStealCards())
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(17));
}
function SqueakyWheel() {
    //x3
    return new DMCard("Squeaky Wheel Gets the Kick")
        .addActions(1)
        .addDamage(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(20));
}
function TwiceTheSmiting() {
    //x3
    return new DMCard("Twice The Smiting")
        .addDamage(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(26));
}
function PalePriestessNerys() {
    //x2
    return new DMCard("Pale Priestess Nerys")
        .addShield(1)
        .addHeal(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(12));
}
function MinscMightyMount() {
    //x2
    return new DMCard("Minsc's Mighty Mount")
        .addShield(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(10));
}
function GoForTheEyesBoo() {
    //x3
    return new DMCard("Go For The Eyes, BOO!!!")
        .addDamage(3)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(4));
}
function BooWhatDoWeDo() {
    //x2
    return new DMCard("Boo, What Do We Do?")
        .addDrawCards(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(0));
}
function Swapportunity() {
    //x2
    return new DMCard("Swapportunity")
        .addMightyPower(new RangerRotateHP())
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(19));
}
function JusticeWaitsForNoOne() {
    //x2
    return new DMCard("Justice Waits For No One")
        .addActions(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(8));
}
function SomeoneHoldMyRodent() {
    //x2
    return new DMCard("Someone Hold My Rodent")
        .addDamage(2)
        .addHeal(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(14));
}
function TimeToPunchEvil() {
    //x1
    return new DMCard("Time To Punch Evil!")
        .addDamage(2)
        .addActions(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(23));
}
function FavoredFrienemies() {
    //x2
    return new DMCard("Favored Frienemies")
        .addActions(1)
        .addMightyPower(new RangerBonusDamage())
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(2));
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
