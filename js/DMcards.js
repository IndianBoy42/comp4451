import { Shield, DamagingShield } from 'DMshields.js';
// TODO: 
export class DMCard {
    constructor(name, shieldValue, healValue, dmgValue, actionsValue) {
        this.name = name;
        this.shieldValue = shieldValue;
        this.healValue = healValue;
        this.dmgValue = dmgValue;
        this.actionsValue = actionsValue;
    }
    /**
     * Play the card, override this to give the card unique actions
     * 
     * @param {*} player The object of the player playing this card rn
     * See DMplayer.js
     * @param {*} context A object that gives access to the game context (players etc) 
     * See DMgame.js
     */
    play(player, context) {
        if (this.shieldValue != 0) {
            player.character.addShield(self.shield());
        }
        if (this.healValue != 0) {
            player.character.heal(this.healValue);
        }
        if (this.actionsValue != 0) {
            player.addExtraAction(this.actionsValue);
        }
        if (this.dmgValue != 0) {
            const targets = context.choosePlayer();
            for (const target of targets) {
                player.character.doDamage(target, this.dmgValue);
            }
        }

    }

    // override this
    shield() {
        return Shield(this.shieldValue);
    }
}