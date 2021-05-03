import { DMCard } from "../DMcards.mjs";
import { uvFromGrid } from "../gfx.js";
import {
    DruidFormePower,
    DruidShapeshiftWolf,
    DruidShapeshiftBear,
    DruidAnimalMultiattack,
    DruidFreeShapeshift,
} from "../powers/druid.mjs";
import { cardTexture38 } from "./textures.js";

/**
 * Notes:
 * - done
 */

const backTex = async () => {
    return {
        texture: await cardTexture38,
        uvCoords: uvFromGrid(28, 3),
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture38,
            uvCoords: uvFromGrid(i, 3),
        };
    };
};

function Poochie() {
    //x2
    return new DMCard("Poochie")
        .addShield(1)
        .addDamage(1)
        .setFrontTexture(frontTex(3))
        .setBackTexture(backTex);
}
function TheEldestElk() {
    //x1
    return new DMCard("The Eldest Elk")
        .addShield(3)
        .setFrontTexture(frontTex(9))
        .setBackTexture(backTex);
}
function ThornWhip() {
    //x3
    return new DMCard("Thorn Whip")
        .addDamage(1)
        .addActions(1)
        .setFrontTexture(frontTex(20))
        .setBackTexture(backTex);
}
function GiftOfSilvanus() {
    //x2
    return new DMCard("Gift Of Silvanus")
        .addMightyPower(new DruidFormePower())
        .addDamage(2)
        .setFrontTexture(frontTex(7))
        .setBackTexture(backTex);
}
function CommuneWNature() {
    //x2
    return new DMCard("Commune With Nature")
        .addDrawCards(2)
        .addMightyPower(new DruidFreeShapeshift())
        .setFrontTexture(frontTex(23))
        .setBackTexture(backTex);
}
function DruidicBalance() {
    //x2
    return new DMCard("Druidic Balance")
        .addHeal(1)
        .addDrawCards(1)
        .addDamage(1)
        .setFrontTexture(frontTex(5))
        .setBackTexture(backTex);
}
function QuickAsAFox() {
    //x2
    return new DMCard("Quick As A Fox")
        .addActions(2)
        .setFrontTexture(frontTex(16))
        .setBackTexture(backTex);
}
function Bearnard() {
    //x2
    return new DMCard("Bearnard")
        .addShield(1)
        .addMightyPower(new DruidFormePower())
        .setFrontTexture(frontTex(18))
        .setBackTexture(backTex);
}
function ShapeshiftBear() {
    //x2
    return new DMCard("Shapeshift: Bear")
        .addHeal(2)
        .addMightyPower(new DruidShapeshiftBear())
        .setFrontTexture(frontTex(10))
        .setBackTexture(backTex);
}
function ShapeshiftWolf() {
    //x3
    return new DMCard("Shapeshift: Wolf")
        .addDamage(2)
        .addMightyPower(new DruidShapeshiftWolf())
        .setFrontTexture(frontTex(25))
        .setBackTexture(backTex);
}
function CallLightning() {
    //x3
    return new DMCard("Call Lightning")
        .addDamage(3)
        .setFrontTexture(frontTex(0))
        .setBackTexture(backTex);
}
function PrimalStrike() {
    //x2
    return new DMCard("Primal Strike")
        .addActions(1)
        .addMightyPower(new DruidAnimalMultiattack())
        .setFrontTexture(frontTex(14))
        .setBackTexture(backTex);
}
function WildRush() {
    //x2
    return new DMCard("Wild Rush")
        .addDrawCards(2)
        .addMightyPower(new DruidFormePower())
        .setFrontTexture(frontTex(12))
        .setBackTexture(backTex);
}

export function getDruidDeck() {
    return [
        Poochie(),
        Poochie(),
        TheEldestElk(),
        ThornWhip(),
        ThornWhip(),
        ThornWhip(),
        GiftOfSilvanus(),
        GiftOfSilvanus(),
        CommuneWNature(),
        CommuneWNature(),
        DruidicBalance(),
        DruidicBalance(),
        QuickAsAFox(),
        QuickAsAFox(),
        Bearnard(),
        Bearnard(),
        ShapeshiftBear(),
        ShapeshiftBear(),
        ShapeshiftWolf(),
        ShapeshiftWolf(),
        ShapeshiftWolf(),
        CallLightning(),
        CallLightning(),
        CallLightning(),
        PrimalStrike(),
        PrimalStrike(),
        WildRush(),
        WildRush(),
    ];
}
