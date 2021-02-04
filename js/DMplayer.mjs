import shuffle from "shuffle.js";

class Player {
    constructor(name, character) {
        this.character = character;
        this.discardPile = [];
        this.deck = this.character.defaultDeck();
        shuffle(this.deck);
        this.hand = [];
        for (let i = 0; i < 3; i++) {
            this.hand.push(this.drawCard());
        }
    }

    drawCard() {
        if (this.deck.length == 0) {
            this.deck = this.discardPile;
            this.discardPile = [];
            shuffle(this.deck);
        }
        return this.deck.pop();
    }
    addCardToHand(card) {
        this.hand.push(card);
    }
    disCard(card) {
        this.discardPile.push(card);
    }

    addExtraAction() {
        // TODO:
    }

    endTurn() {
        this.character.endTurn();
    }
}
