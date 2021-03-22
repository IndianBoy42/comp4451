import { MightyPower } from '../DMpower.mjs';

// If in Bear Form HEAL(1)
// If in Wolf Form ATTACK(1)
export class DruidFormePower extends MightyPower {
    play(player, context) {
        const form = player.character.forme;
        if (form == "bear") {
            player.character.heal(this.amount);
        } else if (form == "wolf") {
            const others = context.choosePlayer(player);
            player.character.doDamage(others, this.amount);
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
        let shapeshiftCardsIndex = [];
        for (const i in player.hand) {
            const card = player.hand[i];
            if (card.extraPowers.length > 0) {
                if (card.extraPowers[0].constructor.name === "DruidShapeshiftWolf" || 
                    card.extraPowers[0].constructor.name === "DruidShapeshiftBear") {
                    shapeshiftCardsIndex.push(i);
                }
            }
        }
        if (shapeshiftCardsIndex.length > 0) {
            // TODO choose card
            const cardIndex = shapeshiftCardsIndex[Math.floor(Math.random() * shapeshiftCardsIndex.length)];
            const card = player.hand.splice(cardIndex, 1)[0];
            card.play(player, context);
        }
    }
}
