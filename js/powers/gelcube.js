export class GelCubeDmgShield extends MightyPower {
    constructor(n) {
        super(n);
    }
    play(player, context) {
        player.character.addShield(DamagingShield(this.amount, 2));
    }
}
