import { MightyPower } from "../DMpower.mjs";
import { chooseFromObjects } from ".././controls.js";
import { allPowers } from "../DMpower.mjs";

// If in Bear Form HEAL(1)
// If in Wolf Form ATTACK(1)
export class DruidFormePower extends MightyPower {
    async play(player, context) {
        const form = player.character.forme;
        if (form == "bear") {
            player.character.heal(this.amount);
        } else if (form == "wolf") {
            const others = await context.choosePlayer(player);
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
    async play(player, context) {
        const shapeshiftCardsIndex = [];
        const shapeshiftCards = [];
        let j = 0; //shapeshiftCardsIndex.length
        for (const i in player.hand) {
            const card = player.hand[i];
            if (card.extraPowers.length > 0) {
                if (
                    card.extraPowers[0].constructor.name ===
                        "DruidShapeshiftWolf" ||
                    card.extraPowers[0].constructor.name ===
                        "DruidShapeshiftBear"
                ) {
                    //console.log("Playable card " + j + ": " + card.name);
                    ++j;
                    shapeshiftCardsIndex.push(i);
                    shapeshiftCards.push(card);
                }
            }
        }
        if (j > 0) {
            // const k = await chooseFromObjects(
            //     "Choose shapeshift card to play for free: ",
            //     0,
            //     j - 1,
            //     shapeshiftCards
            // );
            const k = await player.selectCardCustom(shapeshiftCards, "Choose shapeshift card to play for free: ");
            const cardIndex = shapeshiftCardsIndex[k];
            await player.playCard(cardIndex, context);
        }
    }
}

allPowers.DruidFormePower = DruidFormePower;
allPowers.DruidShapeshiftWolf = DruidShapeshiftWolf;
allPowers.DruidShapeshiftBear = DruidShapeshiftBear;
allPowers.DruidAnimalMultiattack = DruidAnimalMultiattack;
allPowers.DruidFreeShapeshift = DruidFreeShapeshift;