export const maxHealth = 10;

export class Character {
    /**
     * Character constructor
     * @param name Character's name
     */
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
        this.multiAttack = false; //owl

        // other special callbacks
        this.startTurnCallbacks = [];
        this.endTurnCallbacks = [];
    }

    encode() {
        return {
            name: this.name,
            class: this.constructor.name,
            health: this.health,
            shields: this.shields.map(shield => shield.encode()),
            actionsLeft: this.actionsLeft,
            bonus: this.bonus,
            disguised: this.disguised,
            forme: this.forme,
            ignoringShields: this.ignoringShields,
            multiAttack: this.multiAttack,
        };
    }
    decode(obj) {
        this.name = obj.name;
        this.health = obj.health;
        // this.shields: handled by player because....
        this.actionsLeft = obj.actionsLeft;
        this.bonus = obj.bonus;
        this.disguised = obj.disguised;
        this.forme = obj.forme;
        this.ignoringShields = obj.ignoringShields;
        this.multiAttack = obj.multiAttack;
    }

    /**
     * Create a clone of the character
     * NOTE: the type of the clone is Character, may need to change if needs to be specific classes
     * @returns the cloned character
     */
    clone() {
        let clone = new Character(this.name);
        // copy attributes (except the .player attribute)
        clone.health = this.health;
        clone.shields = this.shields.slice(0);
        clone.actionsLeft = this.actionsLeft;
        clone.bonus = this.bonus;
        clone.disguised = this.disguised;
        clone.forme = this.forme;
        clone.ignoringShields = this.ignoringShields;
        clone.multiAttack = this.multiAttack;
        clone.startTurnCallbacks = this.startTurnCallbacks.slice(0); //TODO???
        clone.endTurnCallbacks = this.endTurnCallbacks.slice(0); //TODO???
        return clone;
    }

    async healthCardTexture() {
        return {
            texture: null,
        };
    }
    async instrCardTexture() {
        return {
            texture: null,
        };
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
    modelPath(i = 0) {
        return null;
    }

    /**
     * Check if player can be targetted, or has used Rogue's disguise
     * @returns if the player can be targetted
     */
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
    /**
     * Do damage on other players
     * @param others Array of targetted *players*
     * @param amt Amount of damage
     */
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
    /**
     * Receive damage directly (bypass shield)
     * @param amt Amount of incoming damage
     * @param by Player who attacked
     * @returns remaining unreceived damage
     */
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
    /**
     * Receive damage (including shield)
     * @param amt Amount of incoming damage
     * @param by Player who attacked
     * @returns remaining unreceived damage
     */
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
    /**
     * Removes a shield from the character's shields
     * For destroying shields, "steal" it then add to the stolen player's discard pile
     * For stealing shields, "steal" it then add to the stealing player's shields
     * @param i index of selected shield
     * @returns the removed shield
     */
    stealShield(i) {
        if (!this.targetable() || this.shields.length === 0) return null;
        return this.shields.splice(i, 1)[0];
    }
    chargeBonus() {
        this.bonus += 1;
    }
    shapeshift(forme) {
        this.forme = forme;
    }

    /**
     * Start turn sequences
     * Includes:
     * * Setting disguised to false
     * * Set number of remaining actions to 1
     * * Additional start turn callbacks
     */
    startTurn() {
        this.disguised = false;
        this.actionsLeft = 1;
        while (this.startTurnCallbacks.length > 0) {
            const func = this.startTurnCallbacks.pop();
            func();
        }
    }
    /**
     * End turn sequences
     * Includes:
     * * Set Ranger bonus damage to 0
     * * Set Owl multiAttack to false
     * * Set IceCube's ignoreShield to false
     * * Additional end turn callbacks
     */
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
