import { MightyPower } from "../DMpower.mjs";
import { allPowers } from "../DMpower.mjs";

export class GelCubeDmgShield extends MightyPower {
    play(player, context) {
        player.character.addShield(DamagingShield(this.amount, 2));
    }
}

// TODO: the rest of gelcube powers

allPowers.GelCubeDmgShield = GelCubeDmgShield;
