import { Shield } from "./DMshields.mjs";

export class DMCard {
    constructor(
        name,
        shieldValue = 0,
        healValue = 0,
        dmgValue = 0,
        extraActions = 0,
        drawCards = 0,
        extraPowers = []
    ) {
        this.name = name;
        this.shieldValue = shieldValue;
        this.healValue = healValue;
        this.dmgValue = dmgValue;
        this.extraActions = extraActions;
        this.drawCards = drawCards;
        this.extraPowers = extraPowers;
        this.animation = {}; //TODO: figure out how to handle animations
    }

    static shieldCard(name, amount) {
        return new DMCard(name, amount, 0, 0, 0, 0);
    }
    static healCard(name, amount) {
        return new DMCard(name, 0, amount, 0, 0, 0);
    }
    static damageCard(name, amount) {
        return new DMCard(name, 0, 0, amount, 0, 0);
    }
    static actionCard(name, amount) {
        return new DMCard(name, 0, 0, 0, amount, 0);
    }
    static drawCardsCard(name, amount) {
        return new DMCard(name, 0, 0, 0, 0, amount);
    }
    static powerCard(name, power, extraPowers = []) {
        return new DMCard(name, 0, 0, 0, 0, 0, [power].concat(extraPowers));
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
    addDrawCards(amount) {
        this.drawCards = amount;
        return this;
    }
    addMightyPower(power) {
        this.extraPowers.push(power);
        return this;
    }

    /**
     * Play the card
     *
     * @param {*} player The object of the player playing this card rn
     * See DMplayer.mjs
     * @param {*} context A object that gives access to the game context (players etc)
     * See DMgame.mjs
     */
    play(player, context) {
        let discard = true;
        player.character.actionsLeft -= 1;
        if (this.shieldValue != 0) {
            this.shieldObj = new Shield(this.shieldValue);
            player.character.addShield(this);
            discard = false;
        }
        if (this.healValue != 0) {
            player.character.heal(this.healValue);
        }
        if (this.extraActions != 0) {
            player.addExtraAction(this.extraActions);
        }
        if (this.dmgValue != 0) {
            const targets = context.choosePlayer(player);
            // TODO: OWl multiattack
            player.character.doDamage(targets, this.dmgValue);   
        }
        if (this.drawCards != 0) {
            player.drawCards(this.drawCards);
        }
        for (const p of this.extraPowers) {
            p.play(player, context);
            //TODO some effects need to be kept like for druid?
            //although that can be discarded fine
        }
        if (discard) player.disCard(this);
        if (player.hand.length === 0) {
            player.drawCards(2);
        }
    }
}
