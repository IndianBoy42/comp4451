import { DMCard } from "../DMcards.mjs";
import {
    RogueImmune,
    RogueDestroyShield,
    RogueStealDiscard,
} from "../powers/rogue.mjs";
import { uvFromCorner, uvFromGrid } from "../gfx.js";
import { cardTexture11, cardTexture18 } from "./textures.js";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */
const backTex = async () => {
    return {
        texture: await cardTexture11,
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture18,
            uvCoords: uvFromGrid(i),
        };
    };
};

function AllTheThrownDaggers() {
    //x3
    return new DMCard("All The Thrown Daggers")
        .addDamage(3)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(0));
}
function TwoThrownDaggers() {
    //x4
    return new DMCard("Two Thrown Daggers")
        .addDamage(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(12));
}
function OneThrownDagger() {
    //x5
    return new DMCard("One Thrown Dagger")
        .addDamage(1)
        .addActions(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(5));
}
function CunningAction() {
    //x2
    return new DMCard("Cunning Action")
        .addActions(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(2));
}
function StolenPotion() {
    //x2
    return new DMCard("Stolen Potion")
        .addHeal(1)
        .addActions(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(10));
}
function EvenMoreDaggers() {
    //x1
    return new DMCard("Even More Daggers")
        .addDrawCards(2)
        .addHeal(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(3));
}
function WingedSerpent() {
    //x2
    return new DMCard("Winged Serpent")
        .addShield(1)
        .addDrawCards(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(13));
}
function TheGoonSquad() {
    //x2
    return new DMCard("The Goon Squad")
        .addShield(2)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(11));
}
function MyLittleFriend() {
    //x1
    return new DMCard("My Little Friend")
        .addShield(3)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(4));
}
function CleverDisguise() {
    //x2
    return new DMCard("Clever Disguise")
        .addMightyPower(new RogueImmune())
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(1));
}
function SneakAttack() {
    //x2
    return new DMCard("Sneak Attack!")
        .addMightyPower(new RogueDestroyShield())
        .addActions(1)
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(9));
}
function PickPocket() {
    //x2
    return new DMCard("Pick Pocket")
        .addMightyPower(new RogueStealDiscard())
        .setBackTexture(backTex)
        .setFrontTexture(frontTex(6));
}

export function getRogueDeck() {
    return [
        AllTheThrownDaggers(),
        AllTheThrownDaggers(),
        AllTheThrownDaggers(),
        TwoThrownDaggers(),
        TwoThrownDaggers(),
        TwoThrownDaggers(),
        TwoThrownDaggers(),
        OneThrownDagger(),
        OneThrownDagger(),
        OneThrownDagger(),
        OneThrownDagger(),
        OneThrownDagger(),
        CunningAction(),
        CunningAction(),
        StolenPotion(),
        StolenPotion(),
        EvenMoreDaggers(),
        WingedSerpent(),
        WingedSerpent(),
        TheGoonSquad(),
        TheGoonSquad(),
        MyLittleFriend(),
        CleverDisguise(),
        CleverDisguise(),
        SneakAttack(),
        SneakAttack(),
        PickPocket(),
        PickPocket(),
    ];
}
