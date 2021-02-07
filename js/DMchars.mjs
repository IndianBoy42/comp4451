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
