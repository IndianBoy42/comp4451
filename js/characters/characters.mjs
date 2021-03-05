import Character from '../DMchars.mjs';
import * as Cards from '../cards/cards.js';
import * as Powers from '../powers/powers.js'

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
}

export class Paladin extends Character {
    constructor() {
        super("Lia");
    }
    mightyPowers() {
        return [
            Powers.PaladinGetDiscard,
            Powers.PaladinDestroyShields,
        ];
    }
    defaultDeck() {
        return Cards.getPaladinDeck();
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

    endTurn() {
        super.endTurn();
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

    endTurn() {
        super.endTurn();
    }
}