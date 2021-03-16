import { shuffle } from "./shuffle.mjs";

export class Player {
    constructor(name, character) {
        this.name = name;
        this.character = character;
        this.discardPile = [];
        this.deck = this.character.defaultDeck();
        shuffle(this.deck);
        this.hand = [];
        this.drawCards(3);
    }

    drawCard() {
        if (this.deck.length == 0) {
            this.deck = this.discardPile;
            this.discardPile = [];
            shuffle(this.deck);
        }
        return this.deck.pop();
    }
    drawCards(numCards) {
        for (let i = 0; i < numCards; i++) {
            this.hand.push(this.drawCard());
        }
    }
    addCardToHand(card) {
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
    getFromDiscard(top) {
        if (top) {
            return this.discardPile.pop();
        }
        else {
            //TODO: let player pick any from discard pile
        }
    }

    addExtraAction() {
        // TODO:
    }

    startTurn() {
        this.character.startTurn();
    }
    endTurn() {
        this.character.endTurn();
    }
}
