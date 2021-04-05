const maxHealth = 10;

//TODO put all special powers related stuff in start/endTurnCallbacks?

export class Character {
    constructor(name) {
        this.name = name;
        this.health = maxHealth;
        this.shields = [];
        this.actionsLeft = 0;

        // mighty powers
        this.bonus = 0; //ranger
        this.disguised = false; //rogue
        this.forme = ""; //druid
        this.ignoringShields = false; //icecube
        this.multiattack = false; //owl

        // other special callbacks
        this.startTurnCallbacks = [];
        this.endTurnCallbacks = [];
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
        return !this.disguised;
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
    doDamage(others, amt) {
        //others are PLAYERS not CHARACTERS
        for (const oth of others) {
            if (oth === undefined) continue; //prevent passing no one into others
            if (this.ignoringShields) {
                oth.character.directDamage(amt + this.bonus, this);
            } else {
                oth.character.getDamaged(amt + this.bonus, this);
            }
        }
    }
    directDamage(amt, by) {
        console.log("" + this.player.name + " took " + amt + " damage");
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
            const shield = this.shields[i].shieldObj;
            amt = shield.getDamaged(amt, by, this);
            if (shield.current == 0) {
                console.log("" + this.shields[i].name + " destroyed");
                this.player.disCard(this.stealShield(i));
            }
            if (amt == 0) return 0;
        }
        this.directDamage(amt, by);
    }
    heal(amt) {
        console.log("" + this.player.name + " healed " + amt + " hp");
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
        //same as destroyShield, just dont add it to player
        if (!this.targetable() || this.shields.length === 0) return null;
        return this.shields.splice(i, 1)[0];
    }
    chargeBonus() {
        this.bonus += 1;
    }
    shapeshift(forme) {
        this.forme = forme;
    }

    startTurn() {
        this.disguised = false;
        this.actionsLeft = 1;
        while (this.startTurnCallbacks.length > 0) {
            const func = this.startTurnCallbacks.pop();
            func();
        }
    }
    endTurn() {
        this.bonus = 0;
        this.multiAttack = false;
        this.ignoringShields = false;
        while (this.endTurnCallbacks.length > 0) {
            const func = this.endTurnCallbacks.pop();
            func();
        }
    }
}
