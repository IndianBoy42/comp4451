maxHealth = 10;

export class Character {
    constructor(name) {
        this.health = maxHealth;
        this.shields = [];
        this.bonus = 0;
        this.disguised = false;
        this.forme = "";
        this.ignoringShields = false;
        this.multiattack = 1;
        this.properties = {};
        this.propertiesTemp = {};
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

    setProperty(key, value) {
        this.properties[key] = value;
    }
    setPropertyTemp(key, value) {
        this.propertiesTemp[key] = value;
    }
    getProperty(key) {
        return this.properties[key];
    }
    getPropertyTemp(key) {
        return this.properties[key];
    }

    targetable() {
        return !this.disguised;
    }
    numTargets() {
        return this.multiattack;
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
        if (this.ignoringShields) {
            other.directDamage(amt);
        } else {
            other.getDamaged(amt);
        }
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
    swapHealth(other) {
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
    chargeBonus() {
        this.bonus += 1;
    }
    doDamage(other, amt) {
        super.doDamage(other, amt + this.bonus);
    }
    shapeshift(forme) {
        this.forme = forme;
    }

    endTurn() {
        this.bonus = 0;
        this.multi = 1;
        this.disguised = false;
        this.ignoringShields = false;
        this.propertiesTemp = {};
    }
}
