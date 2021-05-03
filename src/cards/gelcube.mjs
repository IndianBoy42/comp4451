import { DMCard } from "../DMcards.mjs";
import { uvFromGrid } from "../gfx.js";
import {
    GelCubeDestroyShield,
    GelCubeIgnoreShield,
    GelCubeDmgShield,
} from "../powers/gelcube.mjs";
import { cardTexture34 } from "./textures.js";

/**
 * Notes:
 * - done
 */

const backTex = async () => {
    return {
        texture: await cardTexture34,
        uvCoords: uvFromGrid(69),
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture34,
            uvCoords: uvFromGrid(i),
        };
    };
};

function CombatCubed() {
    //x3
    return new DMCard("Combat Cubed")
        .addDamage(3)
        .setFrontTexture(frontTex(9))
        .setBackTexture(backTex);
}

function D6OfDoom() {
    //x2
    return new DMCard("D6 of Doom")
        .addDamage(2)
        .setFrontTexture(frontTex(12))
        .setBackTexture(backTex);
}

function ClericALaSlime() {
    //x2
    return new DMCard("Cleric a la Slime")
        .addDamage(2)
        .addHeal(1)
        .setFrontTexture(frontTex(23))
        .setBackTexture(backTex);
}

function ArcaneAppetizer() {
    //x2
    return new DMCard("Arcane Appetizer")
        .addDamage(2)
        .addDrawCards(1)
        .setFrontTexture(frontTex(21))
        .setBackTexture(backTex);
}

function FastestCubeAlive() {
    //x3
    return new DMCard("Fastest Cube Alive")
        .addDamage(1)
        .addDrawCards(1)
        .addHeal(1)
        .setFrontTexture(frontTex(14))
        .setBackTexture(backTex);
}

function AcidBurp() {
    //x2
    return new DMCard("Acid Burp")
        .addDamage(1)
        .addActions(1)
        .setFrontTexture(frontTex(19))
        .setBackTexture(backTex);
}

function SlimeTime() {
    //x2
    return new DMCard("Slime Time")
        .addActions(2)
        .setFrontTexture(frontTex(5))
        .setBackTexture(backTex);
}

function CubesHaveFeelingsToo() {
    //x2
    return new DMCard("Cubes Have Feelings Too")
        .addHeal(1)
        .addActions(2)
        .setFrontTexture(frontTex(25))
        .setBackTexture(backTex);
}

function OpenWide() {
    //x1
    return new DMCard("Open Wide!")
        .addDrawCards(2)
        .addActions(1)
        .setFrontTexture(frontTex(27))
        .setBackTexture(backTex);
}

function SugarRush() {
    //x2
    return new DMCard("Sugar Rush")
        .addDrawCards(2)
        .setFrontTexture(frontTex(17))
        .setBackTexture(backTex);
}

function FormerFriends() {
    //x1
    return new DMCard("Former Friends")
        .addShield(2)
        .setFrontTexture(frontTex(4))
        .setBackTexture(backTex);
}

function Hugs() {
    //x2
    return new DMCard("Hugs!")
        .addMightyPower(new GelCubeDestroyShield())
        .setFrontTexture(frontTex(2))
        .setBackTexture(backTex);
}

function HereICome() {
    //x2
    return new DMCard("Here I Come!")
        .addMightyPower(new GelCubeIgnoreShield())
        .addDamage(3)
        .setFrontTexture(frontTex(7))
        .setBackTexture(backTex);
}

function BurpedUpBones() {
    //x2
    return new DMCard("Here I Come!")
        .addMightyPower(new GelCubeDmgShield())
        .setFrontTexture(frontTex(0))
        .setBackTexture(backTex);
}

export function getGelCubeDeck() {
    return [
        CombatCubed(),
        CombatCubed(),
        CombatCubed(),
        D6OfDoom(),
        D6OfDoom(),
        ClericALaSlime(),
        ClericALaSlime(),
        ArcaneAppetizer(),
        ArcaneAppetizer(),
        FastestCubeAlive(),
        FastestCubeAlive(),
        FastestCubeAlive(),
        AcidBurp(),
        AcidBurp(),
        SlimeTime(),
        SlimeTime(),
        CubesHaveFeelingsToo(),
        CubesHaveFeelingsToo(),
        OpenWide(),
        SugarRush(),
        SugarRush(),
        FormerFriends(),
        Hugs(),
        Hugs(),
        HereICome(),
        HereICome(),
        BurpedUpBones(),
        BurpedUpBones(),
    ];
}
