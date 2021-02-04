import { DamagingShield } from "./DMshields.mjs";

export class MightyPower {
    constructor(n) {
        this.amount = n;
    }

    play(player, context) {
        throw new Error('Called play on an abstract MightyPower, You have to use a subclass');
    }
}

export class GelCubeDmgShield extends MightyPower {
    constructor(n) {
        super(n);
    }

    play(player, context) {
        player.character.addShield(DamagingShield(this.amount, 2))
    }
}