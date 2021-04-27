import { MightyPower } from "../DMpower.mjs";

export class GelCubeDmgShield extends MightyPower {
    play(player, context) {
        player.character.addShield(DamagingShield(this.amount, 2));
    }
}
