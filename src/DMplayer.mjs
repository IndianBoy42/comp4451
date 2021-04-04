import { shuffle } from "./shuffle.mjs";
import { askIntInput } from '../input.mjs';

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
            this.deck = this.discardPile.slice();
            this.discardPile = [];
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
    }
    disCard(card) {
        this.discardPile.push(card);
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
        }
        else {
            const i = await askIntInput("Choose discarded card: ", 0, this.discardPile.length-1);
            return this.discardPile.splice(i, 1)[0];
        }
    }

    addExtraAction(numExtraActions) {
        this.character.actionsLeft += numExtraActions;
    }

    startTurn() {
        this.character.startTurn();
    }
    endTurn() {
        this.character.endTurn();
    }
}
