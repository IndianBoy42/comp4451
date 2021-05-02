import { shuffle } from "./shuffle.mjs";
import {
    chooseFromDiscardPile,
    chooseFromObjects,
    chooseFromPlayerHand,
    chooseOpponent,
    chooseShieldOf,
    DEBUG_RNG_INPUT,
} from "./controls.js";
import { DummyCard } from "./cards/cards.mjs";
import * as GFX from "./gfx.js";
import { allCards } from "./cards/cards.mjs";
import { characterMap } from "./characters/characters.mjs";

let globalPlayerIdCounter = 1;
export class Player {
    /**
     * Player constructor
     * @param name Player's name
     * @param character The character played as
     * @param context The game context
     * @param isClone set to true if this is a cloned player
     */
    constructor(name, character, context, isClone = false) {
        this.name = name;
        this.character = character;
        this.character.player = this;
        this.context = context;
        this.context.players.push(this);

        this.isClone = isClone;
        if (!isClone) {
            this.id = globalPlayerIdCounter;
            ++globalPlayerIdCounter;

            //init player deck
            this.discardPile = [];
            console.log(this.character);
            this.deck = this.character.defaultDeck();
            shuffle(this.deck);
            this.hand = [];
            this.drawCards(3);
        }
    }

    isLocalOnHost() {
        // Remember this is only valid on host
        // On remote use the currentPlayer variable in remoteGame.js
        return this.constructor.name == "DMplayer";
    }

    encode() {
        return {
            name: this.name,
            character: this.character.encode(),
            discardPile: this.discardPile.map(card => card.encode()),
            deck: this.deck.map(card => card.encode()),
            hand: this.hand.map(card => card.encode()),
        };
    }
    static newFrom(obj, game) {
        const char = characterMap[obj.character.class];
        const p = new Player(obj.name, new char(), game);
        p.decode(obj);
        return p;
    }
    decode(obj) {
        this.name = obj.name;
        this.character.decode(obj.character);
        this.discardPile.length = 0;
        this.deck.length = 0;
        this.hand.length = 0;
        this.character.shields.push(
            ...obj.character.shields.map((cardObj, i) => {
                let card = allCards[cardObj.indexInAllCards];
                GFX.moveCardToShields(card, this, i);
                return card;
            })
        );
        this.discardPile.push(
            ...obj.discardPile.map((cardObj, i) => {
                let card = allCards[cardObj.indexInAllCards];
                GFX.moveCardToDiscard(card, this, i);
                return card;
            })
        );
        this.deck.push(
            ...obj.deck.map((cardObj, i) => {
                let card = allCards[cardObj.indexInAllCards];
                GFX.moveCardToDeck(card, this, i);
                return card;
            })
        );
        this.hand.push(
            ...obj.hand.map((cardObj, i) => {
                let card = allCards[cardObj.indexInAllCards];
                GFX.moveCardToHand(card, this, i);
                return card;
            })
        );
        // this.discardPile.map((card, i) => card.decode(obj.discardPile[i]));
        // this.deck.map((card, i) => card.decode(obj.deck[i]));
        // this.hand.map((card, i) => card.decode(obj.hand[i]));
    }

    /**
     * Clone the player
     * @param context the cloned (actually new) game context
     * @param isOpponent if the clone is an opponent, shuffle deck *and* hand
     * @returns the clone
     */
    clone(context, isOpponent) {
        let clone = new Player(
            this.name,
            this.character.clone(),
            context,
            true
        );
        //copy attributes
        //clone.id = this.id;
        clone.discardPile = this.discardPile.slice(0);
        if (isOpponent) {
            //randomize the deck + hand to simulate not knowing opponent's hand
            let deckhand = this.deck.slice(0);
            deckhand.push(this.hand.slice(0));
            shuffle(deckhand);
            clone.hand = deckhand.splice(0, this.hand.length);
            clone.deck = deckhand;
        } else {
            clone.hand = this.hand.slice(0);
            //replace deck with a deck full of dummy cards for AI simulations
            // clone.deck = this.deck.slice(0);
            // shuffle(clone.deck);
            clone.deck = [];
            for (const i in this.deck) {
                clone.deck.push(DummyCard());
            }
        }
        return clone;
    }

    updatePlayerRender() {
        GFX.renderPlayer(this, this.id);
    }
    newGameStart() {
        return [];
    }
    updateGameState() {
        this.updatePlayerRender();
        return [];
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
            const len = this.discardPile.length;
            for (let i = 0; i < len; i++) {
                const card = this.discardPile.pop();
                if (!this.isClone) GFX.moveCardToDeck(card, this, i);
                this.deck.push(card);
            }
            // this.deck = this.discardPile.slice();
            // this.discardPile = [];
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
        if (!this.isClone)
            this.hand.forEach((card, i) => GFX.moveCardToHand(card, this, i));
    }
    /**
     * Discard a card (put it in player's discard pile)
     * @param card card to be discarded
     */
    disCard(card) {
        this.discardPile.push(card);
        if (!this.isClone) {
            GFX.moveCardToDiscard(card, this, this.discardPile.length - 1);
            this.hand.forEach((card, i) => GFX.moveCardToHand(card, this, i));
        }
    }
    addShield(card) {
        this.character.addShield(card);
        if (!this.isClone) {
            this.character.shields.forEach((card, i) =>
                GFX.moveCardToShields(card, this, i)
            );
        }
    }
    async playCard(index, game) {
        const playCard = this.hand.splice(index, 1)[0];
        await playCard.play(this, game);
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
        } else {
            const i = await this.selectDiscardedCard(this);
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
     * Log the player info in console
     */
    debugLogMe(verboseCard = false) {
        if (DEBUG_RNG_INPUT) return;
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
            logCard(card, verboseCard, i);
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

    handHideShow(hidden) {
        for (const card of this.hand) {
            card.hideShow(hidden);
        }
    }

    /**
     * Call the character's start turn sequence
     */
    startTurn(hideCards = true) {
        if (!this.isClone && hideCards) {
            this.handHideShow(false);
        }
        this.character.startTurn();
    }
    /**
     * Call the character's end turn sequence
     */
    endTurn(showCards = true) {
        if (!this.isClone && showCards) {
            this.handHideShow(true);
        }
        this.character.endTurn();
    }

    /**
     * Perform player's turn
     * To be overridden by AI
     */
    async playerTurn() {
        while (this.character.actionsLeft > 0) {
            this.debugLogMe();
            const cardPos = await this.selectCard();
            await this.playCard(cardPos, this.context);
            if (this.context.gameEnded()) break;
        }
    }

    /**
     * =================================================================================
     * Selection functions
     * Call this function to let the player or AI decide what card/target/etc to select
     * =================================================================================
     */

    /**
     * Selects a card to play from a specific set of cards
     * @returns index of chosen card
     */
    async selectCardCustom(cards, message = "") {
        return await chooseFromObjects(message, 0, cards.length - 1, cards);
    }

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        await this.context.updateGameState();
        return await chooseFromObjects(
            "Choose card to play: ",
            0,
            this.hand.length - 1,
            this.hand
        );
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns 1 chosen player
     */
    async selectPlayer(opponents) {
        await this.context.updateGameState();
        return await chooseFromObjects(
            "Choose target: ",
            0,
            opponents.length - 1,
            opponents
        );
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield
     */
    async selectShield(player) {
        await this.context.updateGameState();
        return await chooseFromObjects(
            "Choose shield index: ",
            0,
            player.character.shields.length - 1,
            player.character.shields
        );
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card
     */
    async selectDiscardedCard(player) {
        await this.context.updateGameState();
        return await chooseFromObjects(
            "Choose discarded card: ",
            0,
            player.discardPile.length - 1,
            player.discardPile
        );
    }
}
