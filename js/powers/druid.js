// If in Bear Form HEAL(1)
// If in Wolf Form ATTACK(1)
export class DruidFormePower extends MightyPower {
    play(player, context) {
        const form = player.character.forme;
        if (this.forme == "bear") {
            this.heal(amt);
        } else if (this.forme == "wolf") {
            other.getDamaged(amt);
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
            for (const other of context.allPlayers) {
                play.character.doDamage(other, 1);
            }
        }
    }
}

export class DruidFreeShapeshift extends MightyPower {
    play(player, context) {
        throw new Error("Not Implemented");
    }
}
