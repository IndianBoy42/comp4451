import { shuffle } from "./shuffle.mjs";
import { chooseFromDiscardPile } from "./controls.js";
import * as GFX from "./gfx.js";

export class Player {
    constructor(name, character, isAI = false) {
        this.name = name;
        this.character = character;
        this.character.player = this;
        this.discardPile = [];
        this.deck = this.character.defaultDeck();
        shuffle(this.deck);
        this.hand = [];
        this.drawCards(3);
    }

    drawCard() {
        if (this.deck.length === 0) {
            if (this.discardPile.length === 0) return null;
            const len = this.discardPile.length;
            for (let i = 0; i < len; i++) {
                const card = this.discardPile.pop();
                GFX.moveCardToDeck(card, this, i);
                this.deck.push(card);
            }
            // this.deck = this.discardPile.slice();
            // this.discardPile = [];
            shuffle(this.deck);
        }
        return this.deck.pop();
    }
    drawCards(numCards) {
        for (let i = 0; i < numCards; i++) {
            const card = this.drawCard();
            this.addCardToHand(card);
        }
    }
    addCardToHand(card) {
        if (card === null) return;
        this.hand.push(card);
        this.hand.forEach((card, i) => GFX.moveCardToHand(card, this, i));
    }
    disCard(card) {
        this.discardPile.push(card);
        GFX.moveCardToDiscard(card, this, this.discardPile.length - 1);
    }
    addShield(card) {
        this.character.addShield(card);
        this.character.shields.forEach((card, i) =>
            GFX.moveCardToShields(card, this, i)
        );
    }
    async playCard(index, game) {
        const playCard = this.hand.splice(index, 1)[0];
        await playCard.play(this, game);
    }
    discardHand(numCardsRedraw) {
        while (this.hand.length > 0) {
            this.disCard(this.hand.pop());
        }
        this.drawCards(numCardsRedraw);
    }
    async getFromDiscard(top) {
        if (this.discardPile.length === 0) return null;
        if (top) {
            return this.discardPile.pop();
        } else {
            const i = chooseFromDiscardPile(this);
            return this.discardPile.splice(i, 1)[0];
        }
    }

    addExtraAction(numExtraActions) {
        this.character.actionsLeft += numExtraActions;
    }

    debugLogMe() {
        const char = this.character;
        console.log("Player: " + this.name);
        console.log(
            "Character: " + char.name + " (" + char.constructor.name + ")"
        );
        console.log("HP: " + char.health);

        function logCard(card, verbose = false, cardNo = "") {
            console.log(
                "Card " +
                    cardNo +
                    ": " +
                    card.name.padEnd(30) +
                    (verbose
                        ? ", shield = " +
                          card.shieldValue +
                          ", heal = " +
                          card.healValue +
                          ", dmg = " +
                          card.dmgValue +
                          ", extra = " +
                          card.extraActions +
                          ", draw = " +
                          card.drawCards +
                          ", super = " +
                          (card.extraPowers.length === 0
                              ? "None"
                              : card.extraPowers[0].constructor.name)
                        : "")
            );
        }

        console.log("Hand:");
        let i = 0;
        for (const card of this.hand) {
            logCard(card, true, i);
            ++i;
        }

        function logShield(shield) {
            console.log(
                "Shield: " +
                    shield.name +
                    "-" +
                    shield.shieldObj.current +
                    "/" +
                    shield.shieldObj.max
            );
        }

        console.log("Shields:");
        for (const shield of char.shields) {
            logShield(shield);
        }

        console.log("Discards:");
        for (const card of this.discardPile) {
            logCard(card);
        }

        console.log("Cards left in deck: " + this.deck.length);

        console.log("====================================");
    }

    startTurn() {
        this.character.startTurn();
    }
    endTurn() {
        this.character.endTurn();
    }
}
