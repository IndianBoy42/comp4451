maxHealth = 10;

export class Character {
    constructor(name) {
        this.health = maxHealth;
        this.shields = [];
    }

    mightyPowers() {
        throw new Error(
            "Called mightyPowers() on abstract Character, You have to use a subclass of Character"
        );
    }
    defaultDeck() {
        throw new Error(
            "Called defaultDeck() on abstract Character, You have to use a subclass of Character"
        );
    }

    targetable() {
        return true;
    }
    numTargets() {
        return 1; // return -1 for all, return >1 for multiattack
    }
    get shield() {
        return this.shields.map(a => a.current).reduce(0, (a, b) => a + b);
    }
    get dead() {
        return this.health <= 0;
    }

    get effectiveHealth() {
        return this.health + this.shield;
    }
    doDamage(other, amt) {
        other.getDamaged(amt, this);
    }
    directDamage(amt, by) {
        if (this.health > amt) {
            this.health -= amt;
            return 0;
        } else {
            amt -= this.health;
            this.health = 0;
            return amt;
        }
    }
    getDamaged(amt, by) {
        if (!this.targetable()) return amt;
        for (var i = this.shields.length - 1; i >= 0; i--) {
            const shield = this.shields[i];
            amt = shield.getDamaged(amt, by, this);
            if (shield.current == 0) {
                shield.pop();
            }
            if (amt == 0) return 0;
        }
        this.directDamage(amt, by);
    }
    heal(amt) {
        this.health = Math.min(this.health + amt, maxHealth);
    }
    addShield(shield) {
        this.shields.push(shield);
    }
    swap(other) {
        if (!this.targetable()) return;
        const tmp = other.health;
        other.health = this.health;
        this.health = tmp;
    }
    copyHealth(other) {
        this.health = other.health;
    }
    copyShield(i) {
        return this.shields[i];
    }
    stealShield(i) {
        if (!this.targetable()) return [];
        return this.shields.splice(i, 1);
    }

    endTurn() {}
}

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

    bearForme() {
        this.forme = "bear";
    }
    wolfForme() {
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
        this.bonus = 0;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }
    defaultDeck() {
        return []; // TOOD: Add defaultDeck
    }

    chargeBonus() {
        this.bonus += 1;
    }
    doDamage(other, amt) {
        super.doDamage(other, amt + this.bonus);
    }

    endTurn() {
        this.bonus = 0;
        super.endTurn();
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
