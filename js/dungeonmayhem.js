maxHealth = 10;

class Shield {
    constructor(max) {
        this.max = max;
        this.current = max;
    }

    damage(amt) {
        if (this.current > amt) {
            this.current -= amt;
            return 0;
        } else {
            amt -= this.current;
            this.current = 0;
            return amt;
        }
    }
}

class Character {
    constructor(name) {
        this.health = maxHealth;
        this.shields = [];
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
    damage(amt) {
        for (const shield of shields) {
            amt = shield.damage(amt);
            if (amt == 0) return 0;
        }
        if (this.health > amt) {
            this.health -= amt;
            return 0;
        } else {
            amt -= this.health;
            this.health = 0;
            return amt;
        }
    }

    heal(amt) {
        this.health = Math.min(this.health + amt, maxHealth);
    }
    defend(shield) {
        this.shields.push(shield);
    }
    swap(other) {
        const tmp = other.health;
        other.health = this.health;
        this.health = tmp;
    }
    stealShield(i) {
        return this.shields.splice(i, 1);
    }
}

