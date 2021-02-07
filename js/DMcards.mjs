import { Shield, DamagingShield } from "DMshields.js";

export class DMCard {
    constructor(
        name,
        shieldValue = 0,
        healValue = 0,
        dmgValue = 0,
        extraActions = 0,
        extraPowers = []
    ) {
        this.name = name;
        this.shieldValue = shieldValue;
        this.healValue = healValue;
        this.dmgValue = dmgValue;
        this.extraActions = extraActions;
        this.extraPowers = extraPowers;
        this.animation = {}; //TODO: figure out how to handle animations
    }

    static shieldCard(name, amount) {
        return DMCard(name, amount, 0, 0, 0);
    }
    static healCard(name, amount) {
        return DMCard(name, 0, amount, 0, 0);
    }
    static damageCard(name, amount) {
        return DMCard(name, 0, 0, amount, 0);
    }
    static actionCard(name, amount) {
        return DMCard(name, 0, 0, 0, amount);
    }
    static powerCard(name, power, extraPowers = []) {
        return DMCard(name, 0, 0, 0, 0, [power].concat(extraPowers));
    }

    addHeal(amount) {
        this.healValue = amount;
        return this;
    }
    addShield(amount) {
        this.shieldValue = amount;
        return this;
    }
    addDamage(amount) {
        this.dmgValue = amount;
        return this;
    }
    addActions(amount) {
        this.extraActions = amount;
        return this;
    }

    /**
     * Play the card
     *
     * @param {*} player The object of the player playing this card rn
     * See DMplayer.js
     * @param {*} context A object that gives access to the game context (players etc)
     * See DMgame.js
     */
    play(player, context) {
        if (this.shieldValue != 0) {
            player.character.addShield(Shield(this.shieldValue));
        }
        if (this.healValue != 0) {
            player.character.heal(this.healValue);
        }
        if (this.extraActions != 0) {
            player.addExtraAction(this.extraActions);
        }
        if (this.dmgValue != 0) {
            const targets = context.choosePlayer();
            for (const target of targets) {
                player.character.doDamage(target, this.dmgValue);
            }
        }
        for (const p of this.extraPowers) {
            p.play(player, context);
        }
    }
}
