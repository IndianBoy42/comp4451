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
        this.isRandomSimClone = false;
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
        clone.cloneAttributes(this, isOpponent);
        return clone;
    }

    // helper function for clone(), to be used by AIPlayer as well
    cloneAttributes(original, isOpponent) {
        //copy attributes
        this.id = original.id;
        this.discardPile = original.discardPile.slice(0);
        if (isOpponent) {
            //randomize the deck + hand to simulate not knowing opponent's hand
            let deckhand = original.deck.slice(0);
            deckhand.push(original.hand.slice(0));
            shuffle(deckhand);
            this.hand = deckhand.splice(0, original.hand.length);
            this.deck = deckhand;
        } else {
            this.hand = original.hand.slice(0);
            // (nvm should keep original deck for simulator) replace deck with a deck full of dummy cards for AI simulations
            this.deck = original.deck.slice(0);
            shuffle(this.deck);
            // this.deck = [];
            // for (const i in original.deck) {
            //     this.deck.push(DummyCard());
            // }
        }
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
            GFX.setCardObjectText(
                card.modelInWorld.canvas,
                card.modelInWorld.context,
                card.modelInWorld.texture,
                card.getCardText(),
                hidden ? "#000000" : "#00ff00"
            );
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
     */
    async playerTurn() {
        while (this.character.actionsLeft > 0) {
            //this.debugLogMe();
            const cardPos = await this.selectCard();
            await this.playCard(cardPos, this.context);
            if (this.context.gameEnded()) break;
        }
    }

    /**
     * Perform player's turn while dead
     */
     async playerDeadTurn() {
        const opp = await this.context.choosePlayer(
            this,
            true,
            false,
            false,
            true
        );
        if (opp.length > 0) this.character.doDamage(opp, 1);
    }

    /**
     * =================================================================================
     * Selection functions
     * Call this function to let the player or AI decide what card/target/etc to select
     * =================================================================================
     */

    /**
     * Unified function to select from object
     * If this is a random simulation clone, return a random selection
     * @param objects objects to select from
     * @param message message to be displayed
     * @returns index of chosen object
     */
    async selectObject(objects, message = "") {
        if (this.isRandomSimClone) {
            return Math.floor(Math.random() * (objects.length));
        }
        else {
            await this.context.updateGameState();
            return await chooseFromObjects(
                message, 
                0, 
                objects.length - 1, 
                objects
            );
        }
    }

    /**
     * Selects a card to play from a specific set of cards
     * @param cards card objects to select from
     * @param message message to be displayed
     * @returns index of chosen card
     */
    async selectCardCustom(cards, message = "") {
        return await this.selectObjects(
            message, 
            cards
        );
    }

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        return await this.selectObjects(
            "Choose card to play: ", 
            this.hand
        );
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns index of chosen player
     */
    async selectPlayer(opponents) {
        return await this.selectObjects(
            "Choose target: ", 
            opponents
        );
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield, -1 if player has no shield
     */
    async selectShield(player) {
        if (player.character.shields.length === 0) return -1;
        return await this.selectObjects(
            "Choose shield to play: ", 
            player.character.shields
        );
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card, -1 if player has no discard
     */
    async selectDiscardedCard(player) {
        if (player.discardPile.length === 0) return -1;
        return await this.selectObjects(
            "Choose discarded card: ", 
            player.discardPile
        );
    }
}
