import { MightyPower } from '../DMpower.mjs';

// If in Bear Form HEAL(1)
// If in Wolf Form ATTACK(1)
export class DruidFormePower extends MightyPower {
    play(player, context) {
        const form = player.character.forme;
        if (this.forme == "bear") {
            this.heal(this.amount);
        } else if (this.forme == "wolf") {
            const other = context.choosePlayer(player);
            other.getDamaged(this.amount, this);
        }
    }
}

export class DruidShapeshiftWolf extends MightyPower {
    play(player, context) {
        player.character.shapeshift("wolf");
    }
}
export class DruidShapeshiftBear extends MightyPower {
    play(player, context) {
        player.character.shapeshift("bear");
    }
}

// You may make an animal noise to ATTACK(1) each opponent.
export class DruidAnimalMultiattack extends MightyPower {
    play(player, context) {
        if (context.makeAnimalNoise()) {
            player.character.doDamage(context.allOpponents(player), 1);
        }
    }
}

export class DruidFreeShapeshift extends MightyPower {
    play(player, context) {
        //TODO
        throw new Error("Not Implemented");
    }
}
