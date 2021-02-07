import Character from '../DMchars.mjs';

export class Wizard extends Character {
    constructor(name) {
        super(name);
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }
}

export class Paladin extends Character {
    constructor(name) {
        super(name);
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }
}

export class Barbarian extends Character {
    constructor(name) {
        super(name);
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }
}

export class Rogue extends Character {
    constructor(name) {
        super(name);
        this.disguised = false;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }

    targetable() {
        return !this.disguised;
    }
    disguise() {
        this.disguised = true;
    }

    endTurn() {
        this.disguised = false;
        super.endTurn();
    }
}

export class Druid extends Character {
    constructor(name) {
        super(name);
        this.forme = "";
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }

    shapeshiftBear() {
        this.forme = "bear";
    }
    shapeshiftWolf() {
        this.forme = "wolf";
    }
    formeAction(other, amt) {
        if (this.forme == "bear") {
            this.heal(amt);
        } else if (this.forme == "wolf") {
            other.getDamaged(amt);
        }
    }
}

export class Ranger extends Character {
    constructor(name) {
        super(name);
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }
}

export class GelatinousCube extends Character {
    constructor(name) {
        super(name);
        this.ignoringShields = false;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }

    ignoreShields() {
        this.ignoringShields = true;
    }
    doDamage(other, amt) {
        if (this.ignoringShields) {
            other.directDamage(amt);
        } else {
            other.getDamaged(amt);
        }
    }

    endTurn() {
        this.ignoringShields = false;
        super.endTurn();
    }
}

export class OwlBear extends Character {
    constructor(name) {
        super(name);
        this.multi = false;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }

    numTargets() {
        if (this.multi) {
            return -1;
        } else {
            return 1;
        }
    }

    endTurn() {
        this.multi = false;
        super.endTurn();
    }
}