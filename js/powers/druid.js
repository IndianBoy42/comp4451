// If in Bear Form HEAL(1)
// If in Wolf Form ATTACK(1)
export class DruidFormePower extends MightyPower {
    play(player, context) {
        if (typeof player.character.formeAction === "function") {
            player.character.formeAction(context.choosePlayer(), this.amount);
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
