import { DMCard } from "../DMcards.mjs";
import { uvFromCorner, uvFromGrid } from "../gfx.js";
import {
    WizardFireball,
    WizardStealShield,
    WizardSwapHP,
} from "../powers/wizard.mjs";
import { cardTexture17, cardTexture27 } from "./textures.js";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

const backTex = async () => {
    return {
        texture: await cardTexture17,
        uvCoords: uvFromGrid(0, 1, 1)
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture27,
            uvCoords: uvFromGrid(i),
        };
    };
};

function LightningBolt() {
    //x4
    return new DMCard("Lightning Bolt")
        .addDamage(3)
        .setFrontTexture(frontTex(5))
        .setBackTexture(backTex);
}
function BurningHands() {
    //x3
    return new DMCard("Burning Hands")
        .addDamage(2)
        .setFrontTexture(frontTex(0))
        .setBackTexture(backTex);
}
function MagicMissile() {
    //x3
    return new DMCard("Magic Missile")
        .addDamage(1)
        .addActions(1)
        .setFrontTexture(frontTex(6))
        .setBackTexture(backTex);
}
function SpeedOfThought() {
    //x3
    return new DMCard("Speed Of Thought")
        .addActions(2)
        .setFrontTexture(frontTex(9))
        .setBackTexture(backTex);
}
function EvilSneer() {
    //x2
    return new DMCard("Evil Sneer")
        .addHeal(1)
        .addActions(1)
        .setFrontTexture(frontTex(2))
        .setBackTexture(backTex);
}
function KnowledgeIsPower() {
    //x3
    return new DMCard("Knowledge Is Power")
        .addDrawCards(3)
        .setFrontTexture(frontTex(4))
        .setBackTexture(backTex);
}
function Shield() {
    //x2
    return new DMCard("Shield")
        .addShield(1)
        .addDrawCards(1)
        .setFrontTexture(frontTex(8))
        .setBackTexture(backTex);
}
function Stoneskin() {
    //x1
    return new DMCard("Stoneskin")
        .addShield(2)
        .setFrontTexture(frontTex(10))
        .setBackTexture(backTex);
}
function MirrorImage() {
    //x1
    return new DMCard("Mirror Image")
        .addShield(3)
        .setFrontTexture(frontTex(7))
        .setBackTexture(backTex);
}
function Fireball() {
    //x2
    return new DMCard("Fireball")
        .addMightyPower(new WizardFireball())
        .setFrontTexture(frontTex(3))
        .setBackTexture(backTex);
}
function Charm() {
    //x2
    return new DMCard("Charm")
        .addMightyPower(new WizardStealShield())
        .setFrontTexture(frontTex(1))
        .setBackTexture(backTex);
}
function VampiricTouch() {
    //x2
    return new DMCard("Vampiric Touch")
        .addMightyPower(new WizardSwapHP())
        .setFrontTexture(frontTex(11))
        .setBackTexture(backTex);
}

export function getWizardDeck() {
    return [
        LightningBolt(),
        LightningBolt(),
        LightningBolt(),
        LightningBolt(),
        BurningHands(),
        BurningHands(),
        BurningHands(),
        MagicMissile(),
        MagicMissile(),
        MagicMissile(),
        SpeedOfThought(),
        SpeedOfThought(),
        SpeedOfThought(),
        EvilSneer(),
        EvilSneer(),
        KnowledgeIsPower(),
        KnowledgeIsPower(),
        KnowledgeIsPower(),
        Shield(),
        Shield(),
        Stoneskin(),
        MirrorImage(),
        Fireball(),
        Fireball(),
        Charm(),
        Charm(),
        VampiricTouch(),
        VampiricTouch(),
    ];
}
