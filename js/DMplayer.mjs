import { shuffle } from "./shuffle.mjs";
import { askIntInput, DEBUG_RNG_INPUT } from '../input.mjs';
import { AI } from './DMAI.mjs';

export class Player {
    static id = 1;

    /**
     * Player constructor
     * @param name Player's name
     * @param character The character played as
     * @param context The game context
     * @param isAI set to true if the player is an AI
     * @param isClone set to true if this is a cloned player
     */
    constructor(name, character, context, isAI = false, isClone = false) {
        this.name = name;
        this.character = character;
        this.character.player = this;
        this.context = context;
        this.context.players.push(this);

        this.isAI = isAI;
        if (this.isAI) this.AI = new AI(this);

        this.isClone = isClone;
        if (!isClone) {
            this.id = Player.id;
            ++Player.id;
            
            //init player deck
            this.discardPile = [];
            this.deck = this.character.defaultDeck();
            shuffle(this.deck);
            this.hand = [];
            this.drawCards(3);
        }
    }

    /**
     * Clone the player
     * @param context the cloned (actually new) game context
     * @param isOpponent if the clone is an opponent, shuffle deck *and* hand
     * @returns the clone
     */
    clone(context, isOpponent) {
        let clone = new Player(this.name, this.character.clone(), context, this.isAI, true);
        //copy attributes
        clone.id = this.id;
        clone.AI = this.AI;
        clone.discardPile = this.discardPile.slice(0);
        if (isOpponent) {
            //randomize the deck + hand to simulate not knowing opponent's hand
            let deckhand = this.deck.slice(0);
            deckhand.push(this.hand.slice(0));
            shuffle(deckhand);
            clone.hand = deckhand.splice(0, this.hand.length);
            clone.deck = deckhand;
        }
        else {
            clone.hand = this.hand.slice(0);
            clone.deck = this.deck.slice(0);
            shuffle(clone.deck);
        }
        return clone;
    }

    /**
     * Draws a card
     * Shuffles discard pile into deck if needed
     * NOTE: use drawCards() in order to push the new cards into hand
     * @returns a DMCard
     */
    drawCard() {
        if (this.deck.length === 0) {
            if (this.discardPile.length === 0) return null;
            this.deck = this.discardPile.slice();
            this.discardPile = [];
            shuffle(this.deck);
        }
        return this.deck.pop();
    }
    /**
     * Draw several cards and add to hand
     * @param numCards number of cards to draw
     */
    drawCards(numCards) {
        for (let i = 0; i < numCards; i++) {
            const card = this.drawCard();
            this.addCardToHand(card);
        }
    }
    /**
     * Add a card to hand
     * @param card card to be added
     */
    addCardToHand(card) {
        if (card === null) return;
        this.hand.push(card);
    }
    /**
     * Discard a card (put it in player's discard pile)
     * @param card card to be discarded
     */
    disCard(card) {
        this.discardPile.push(card);
    }
    /**
     * Discard the player's whole hand, then redraw
     * @param numCardsRedraw number of cards to redraw
     */
    discardHand(numCardsRedraw) {
        while (this.hand.length > 0) {
            this.disCard(this.hand.pop());
        }
        this.drawCards(numCardsRedraw);
    }
    /**
     * Take a card from discard pile
     * NOTE: For Paladin's power, use with await (and set top to false)
     * @param top true if just taking the top card, no need to choose
     * @returns a DMCard
     */
    async getFromDiscard(top = true) {
        if (this.discardPile.length === 0) return null;
        if (top) {
            return this.discardPile.pop();
        }
        else {
            const i = await this.selectDiscardedCard();
            return this.discardPile.splice(i, 1)[0];
        }
    }
    /**
     * Add more actions to player's current turn
     * @param numExtraActions number of extra actions
     */
    addExtraAction(numExtraActions) {
        this.character.actionsLeft += numExtraActions;
    }

    /**
     * Call the character's start turn sequence
     */
    startTurn() {
        this.character.startTurn();
    }
    /**
     * Call the character's end turn sequence
     */
    endTurn() {
        this.character.endTurn();
    }

    /**
     * =================================================================================
     * Selection functions
     * Call this function to let the player or AI decide what card/target/etc to select
     * 
     * TODO implement player selection with GUI
     * =================================================================================
     */

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        if (this.isAI) {
            //TODO
        }
        else {
            const input = await askIntInput("Choose card to play: ", 0, this.hand.length - 1);
            return input;
        }
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns 1 chosen player
     */
    async selectPlayer(players) {
        if (this.isAI) {
            //TODO
        }
        else {
            if (DEBUG_RNG_INPUT) {
                const input = await askIntInput("Choose player to target: ", 0, players.length - 1);
                return players[input];
            }
            else {
                let overflowCount = 0;
                while (true) {
                    const input = await askIntInput("Choose player ID to target: ", 1, this.context.players.length);
                    for (const opp of players) {
                        if (opp.id === input) return opp;
                    }
                    
                    ++overflowCount;
                    if (overflowCount > 100) throw new Error("Infinite loop in choosePlayer()");
                    console.log("Invalid target!");
                }
            }
        }
    }

    /**
     * Selects a shield from array of shields
     * @param shields array of selectable shields
     * @returns index of chosen shield
     */
    async selectShield(shields) {
        if (this.isAI) {
            //TODO
        }
        else {
            const input = await askIntInput("Choose shield index: ", 0, shields.length-1);
            return input;
        }
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card
     */
     async selectDiscardedCard() {
        if (this.isAI) {
            //TODO
        }
        else {
            const input = await askIntInput("Choose discarded card: ", 0, this.discardPile.length-1);
            return input;
        }
    }

}
