export class GelCubeDmgShield extends MightyPower {
    constructor(n) {
        super(n);
    }
    play(player, context) {
        player.character.addShield(DamagingShield(this.amount, 2));
    }
}
export class DruidFormePower extends MightyPower {
    play(player, context) {
        if (typeof myObj.formeAction === "function") {
            player.character.formeAction(context.choosePlayer());
        }
    }
}
