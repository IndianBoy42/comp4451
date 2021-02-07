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
        if (typeof player.character.formeAction === "function") {
            player.character.formeAction(context.choosePlayer());
        }
    }
}
export class DruidShapeshiftWolf extends MightyPower {
    play(player, context) {
        if (typeof player.character.shapeshiftWolf === "function") {
            player.character.shapeshiftWolf();
        }
    }
}
export class DruidShapeshiftBear extends MightyPower {
    play(player, context) {
        if (typeof player.character.shapeshiftBear === "function") {
            player.character.shapeshiftBear();
        }
    }
}
