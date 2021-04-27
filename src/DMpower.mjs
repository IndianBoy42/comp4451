export const allPowers = {};

export class MightyPower {
    constructor(n = 1) {
        this.amount = n;
    }

    encode() {
        return {
            id: this.constructor.name,
            amount: this.amount,
        };
    }

    async play(player, context) {
        throw new Error(
            "Called play on an abstract MightyPower, You have to use a subclass"
        );
    }
}
