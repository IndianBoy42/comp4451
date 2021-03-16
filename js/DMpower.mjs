import { DamagingShield } from "./DMshields.mjs";

export class MightyPower {
    constructor(n = 1) {
        this.amount = n;
    }

    play(player, context) {
        throw new Error(
            "Called play on an abstract MightyPower, You have to use a subclass"
        );
    }
}
