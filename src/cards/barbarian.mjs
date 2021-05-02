import { DMCard } from "../DMcards.mjs";
import { uvFromCorner, uvFromGrid } from "../gfx.js";
import {
    BarbarianDiscardHand,
    BarbarianDestroyShield,
    BarbarianHeal,
} from "../powers/barbarian.mjs";
import { cardTexture23, cardTexture39 } from "./textures.js";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

const backTex = async () => {
    return {
        texture: await cardTexture23,
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture39,
            uvCoords: uvFromGrid(i),
        };
    };
};

function BrutalPunch() {
    //x2
    return new DMCard("Brutal Punch")
        .addDamage(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(3));
}
function TwoAxes() {
    //x2
    return new DMCard("Two Axes Are Better Than One")
        .addActions(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(13));
}
function HeadButt() {
    //x2
    return new DMCard("Head Butt")
        .addDamage(1)
        .addActions(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(5));
}
function BigAxe() {
    //x5
    return new DMCard("Big Axe Is Best Axe")
        .addDamage(3)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(2));
}
function Rage() {
    //x2
    return new DMCard("RAGE!")
        .addDamage(4)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(9));
}
function Raff() {
    //x2
    return new DMCard("Riff")
        .addShield(3)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(8));
}
function SpikedShield() {
    //x1
    return new DMCard("Spiked Shield")
        .addShield(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(12));
}
function BagOfRats() {
    //x1
    return new DMCard("Bag Of Rats")
        .addShield(1)
        .addDrawCards(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(0));
}
function SnackTime() {
    //x1
    return new DMCard("Snack Time")
        .addDrawCards(2)
        .addHeal(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(11));
}
function OpenTheArmory() {
    //x2
    return new DMCard("Open The Armory")
        .addDrawCards(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(7));
}
function Flex() {
    //x2
    return new DMCard("Flex!")
        .addHeal(1)
        .addDrawCards(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(4));
}
function BattleRoar() {
    //x2
    return new DMCard("Battle Roar")
        .addMightyPower(new BarbarianDiscardHand())
        .addActions(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(1));
}
function MightyToss() {
    //x2
    return new DMCard("Mighty Toss")
        .addMightyPower(new BarbarianDestroyShield())
        .addDrawCards(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(6));
}
function WhirlingAxes() {
    //x1
    return new DMCard("Whirling Axes")
        .addMightyPower(new BarbarianHeal())
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(0));
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
