maxHealth = 10;

class Shield {
    constructor(max) {
        this.max = max;
        this.current = max;
    }

    getDamaged(amt, by, owner) {
        if (this.current > amt) {
            this.current -= amt;
            return 0;
        } else {
            amt -= this.current;
            this.current = 0;
            return amt;
        }
    }

    reset() {
        this.current = this.max;
    }
}

class DamagingShield extends Shield {
    constructor(max, dmg) {
        this.max = max;
        this.current = max;
        this.dmg = dmg;
    }


    getDamaged(amt, by, owner) {
        const ret = this.getDamaged(amt, by);
        if (this.current == 0) {
            by.getDamaged(this.dmg, owner);
        }
        return ret;
    }
}

class Character {
    constructor(name) {
        this.health = maxHealth;
        this.shields = [];
    }

    mightyPowers() {
        return [];
    }

    targetable() {
        return true;
    }
    get shield() {
        return this.shields.map((a) => a.current).reduce(0, (a, b) => (a + b));
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

    endTurn() { }
}

class Druid extends Character {
    constructor(name) {
        super(name);
        this.forme = '';
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }

    bearForme() {
        this.forme = 'bear';
    }
    wolfForme() {
        this.forme = 'wolf';
    }
    formeAction(other) {
        if (this.forme == 'bear') {
            this.heal(n);
        } else if (this.forme == 'wolf') {
            other.getDamaged(n);
        }
    }
}

class Rogue extends Character {
    constructor(name) {
        super(name);
        this.disguised = false;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
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

class Ranger extends Character {
    constructor(name) {
        super(name);
        this.bonus = 0;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }

    chargeBonus() {
        this.bonus += 1;
    }
    doDamage(other, amt) {
        super.doDamage(other, amt + this.bonus)
    }

    endTurn() {
        this.bonus = 0;
        super.endTurn();
    }
}

class GelatinousCube extends Character {
    constructor(name) {
        super(name);
        this.ignoring = false;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }

    ignoreShields() {
        this.ignoring = true;
    }
    doDamage(other, amt) {
        if (this.ignoring) { other.directDamage(amt); }
        else { other.getDamaged(amt); }
    }

    endTurn() {
        this.ignoring = false;
        super.endTurn();
    }
}

class OwlBear extends Character {
    constructor(name) {
        super(name);
        this.multi = false;
    }
    mightyPowers() {
        return []; // TODO: Add mightyPowers
    }


    endTurn() {
        this.multi = false;
        super.endTurn();
    }
}