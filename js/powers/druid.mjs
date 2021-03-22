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
        let shapeshiftCards = [];
        for (const card of player.hand) {
            if (card.extraPowers.length > 0) {
                if (card.extraPowers[0].constructor.name === "DruidShapeshiftWolf" || 
                    card.extraPowers[0].constructor.name === "DruidShapeshiftBear") {
                    shapeshiftCards.push(card);
                }
            }
        }
        if (shapeshiftCards.length > 0) {
            const card = shapeshiftCards[Math.floor(Math.random() * shapeshiftCards.length)];
            card.play(player, context);
        }
    }
}
