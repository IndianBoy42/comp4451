import { Character } from "../DMchars.mjs";
import * as Cards from "../cards/cards.mjs";
import * as Powers from "../powers/powers.mjs";

import evokerWizard from "../assets/evoker_wizard.glb";
import tieflingRogue from "../assets/tiefling_rogue.glb";
import sunPaladin from "../assets/sun_paladin.glb";
import halflingDruid from "../assets/halfling_druid.glb";
import orcBarbarian from "../assets/orc_barbarian.glb";
import crossbowRanger from "../assets/crossbow_ranger.glb";
import * as Tex from "../cards/textures.js";
import { uvFromCorner, uvFromGrid } from "../gfx.js";

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randBool() {
    return Math.random() > 0.5;
}
function randIndex(arr) {
    return randInt(0, arr.length - 1);
}
function randChoose(arr) {
    return arr[randIndex(arr)];
}
export function chooseCharacter(i = -1) {
    if (i < 0) {
        i = randIndex(allCharacters);
    }
    const constructor = allCharacters[i];
    return new constructor();
}

export class Wizard extends Character {
    constructor() {
        super("Azzan");
    }
    mightyPowers() {
        return [
            Powers.WizardFireball,
            Powers.WizardStealShield,
            Powers.WizardSwapHP,
        ];
    }
    defaultDeck() {
        return Cards.getWizardDeck();
    }
    modelPath(i = 0) {
        if (i == 0) return evokerWizard;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture32,
            uvCoords: uvFromGrid(0, 1, 2),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture32,
            textureBack: await Tex.cardTexture12,
            uvCoords: uvFromGrid(1, 1, 2),
        };
    }
}

export class Paladin extends Character {
    constructor() {
        super("Lia");
    }
    mightyPowers() {
        return [Powers.PaladinGetDiscard, Powers.PaladinDestroyShields];
    }
    defaultDeck() {
        return Cards.getPaladinDeck();
    }
    modelPath(i = 0) {
        if (i == 0) return sunPaladin;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture47,
            uvCoords: uvFromGrid(0, 1, 2),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture47,
            textureBack: await Tex.cardTexture12,
            uvCoords: uvFromGrid(1, 1, 2),
        };
    }
}

export class Barbarian extends Character {
    constructor() {
        super("Sutha");
    }
    mightyPowers() {
        return [
            Powers.BarbarianHeal,
            Powers.BarbarianDiscardHand,
            Powers.BarbarianDestroyShield,
        ];
    }
    defaultDeck() {
        return Cards.getBarbarianDeck();
    }
    modelPath(i = 0) {
        if (i == 0) return orcBarbarian;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture20,
            uvCoords: uvFromGrid(0, 1, 2),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture20,
            textureBack: await Tex.cardTexture7,
            uvCoords: uvFromGrid(1, 1, 2),
        };
    }
}

export class Rogue extends Character {
    constructor() {
        super("Oriax");
    }
    mightyPowers() {
        return [
            Powers.RogueImmune,
            Powers.RogueDestroyShield,
            Powers.RogueStealDiscard,
        ];
    }
    defaultDeck() {
        return Cards.getRogueDeck();
    }
    modelPath(i = 0) {
        if (i == 0) return tieflingRogue;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture16,
            uvCoords: uvFromGrid(0, 1, 2),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture16,
            textureBack: await Tex.cardTexture26,
            uvCoords: uvFromGrid(1, 1, 2),
        };
    }
}

export class Druid extends Character {
    constructor() {
        super("Jaheira");
    }
    mightyPowers() {
        return [
            Powers.DruidAnimalMultiattack,
            Powers.DruidFormePower,
            Powers.DruidFreeShapeshift,
        ];
    }
    defaultDeck() {
        return Cards.getDruidDeck();
    }
    modelPath(i = 0) {
        if (i == 0) return halflingDruid;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture21,
            // uvCoords: uvFromGrid(0, 1, 2),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture33,
            textureBack: await Tex.cardTexture8,
            // uvCoords: uvFromGrid(0, 1, 2),
        };
    }
}

export class Ranger extends Character {
    constructor() {
        super("Minsc & Boo");
    }
    mightyPowers() {
        return [
            Powers.RangerRotateHP,
            Powers.RangerStealCards,
            Powers.RangerBonusDamage,
        ];
    }
    defaultDeck() {
        return Cards.getRangerDeck();
    }
    modelPath(i = 0) {
        if (i == 0) return crossbowRanger;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture28,
            // uvCoords: uvFromGrid(0, 1, 2),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture44,
            textureBack: await Tex.cardTexture25,
            // uvCoords: uvFromGrid(0, 1, 2),
        };
    }
}

export class GelatinousCube extends Character {
    constructor() {
        super("Blorp");
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }
    modelPath(i = 0) {
        if (i == 0) return tieflingRogue;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture28,
            uvCoords: uvFromGrid(0),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture29,
            textureBack: await Tex.cardTexture24,
            uvCoords: uvFromGrid(1),
        };
    }
}

export class OwlBear extends Character {
    constructor() {
        super("Hoots McGoots");
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }
    modelPath(i = 0) {
        if (i == 0) return tieflingRogue;
        else return null;
    }
    async healthCardTexture() {
        return {
            texture: await Tex.cardTexture30,
            uvCoords: uvFromGrid(0),
        };
    }
    async instrCardTexture() {
        return {
            texture: await Tex.cardTexture30,
            textureBack: await Tex.cardTexture22,
            uvCoords: uvFromGrid(1),
        };
    }
}

export const allCharacters = [
    Wizard,
    Paladin,
    Barbarian,
    Rogue,
    Druid,
    Ranger,
    GelatinousCube,
    OwlBear,
];
export let characterMap = {};
allCharacters.forEach(c => {
    characterMap[c.name] = c;
});
