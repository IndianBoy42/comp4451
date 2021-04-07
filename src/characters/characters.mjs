import { Character } from "../DMchars.mjs";
import * as Cards from "../cards/cards.mjs";
import * as Powers from "../powers/powers.mjs";

import evokerWizard from "../assets/evoker_wizard.glb";
import tieflingRogue from "../assets/tiefling_rogue.glb";

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
        if (i == 0) return tieflingRogue;
        else return null;
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
        if (i == 0) return tieflingRogue;
        else return null;
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
        if (i == 0) return tieflingRogue;
        else return null;
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
        if (i == 0) return tieflingRogue;
        else return null;
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
}
