import { Player } from "./DMplayer.mjs";
import { shuffle } from "./shuffle.mjs";
import { DummyCard } from "./cards/cards.mjs";
import { GameState, Decision } from "./DMAI.mjs";

export class AIPlayer extends Player {
    constructor(name, character, context, isClone = false) {
        super(name, character, context, isClone);
        this.resetDecisions();
    }

    /**
     * Clone the player
     * Copied from DMplayer because the constructor needed to be changed to AIPlayer
     * @param context the cloned (actually new) game context
     * @param isOpponent if the clone is an opponent, shuffle deck *and* hand
     * @returns the clone
     */
    clone(context, isOpponent) {
        let clone = new AIPlayer(
            this.name,
            this.character.clone(),
            context,
            true
        );
        //copy attributes
        //clone.id = this.id;
        clone.discardPile = this.discardPile.slice(0);
        clone.rootGameState = this.rootGameState;
        if (isOpponent) {
            //randomize the deck + hand to simulate not knowing opponent's hand
            let deckhand = this.deck.slice(0);
            deckhand.push(this.hand.slice(0));
            shuffle(deckhand);
            clone.hand = deckhand.splice(0, this.hand.length);
            clone.deck = deckhand;
        } else {
            clone.hand = this.hand.slice(0);
            // (nvm no need, gonna need deck for random sim) replace deck with a deck full of dummy cards for AI simulations
            clone.deck = this.deck.slice(0);
            shuffle(clone.deck);
            // clone.deck = [];
            // for (const i in this.deck) {
            //     clone.deck.push(DummyCard());
            // }
        }
        return clone;
    }

    /**
     * Reset decision related variables
     * - finalDecisions: Filled with the optimal decisions when tree simulation is finished
     * - cloneParentDecisions: Used by clones.
     *                  Take decisions from here to get to its parent's position + the testing decision
     * - cloneDecisionIndex: Used by clones. Index of cloneParentDecisions to take from
     * - cloneBestChildDecisions: Used by clones. Set to decisions made by the child with best score after simulation
     */
    resetDecisions() {
        this.finalDecisions = [];
        this.cloneParentDecisions = [];
        this.cloneDecisionIndex = 0;
        this.cloneBestChildDecisions = [];
    }

    /**
     * Return null if cloneDecisionIndex = cloneParentDecisions.length
     * Otherwise, return the next parent decision and increment cloneDecisionIndex
     */
    getNextParentDecision() {
        if (this.cloneDecisionIndex === this.cloneParentDecisions.length) {
            return null;
        }
        const decision = this.cloneParentDecisions[this.cloneDecisionIndex];
        ++this.cloneDecisionIndex;
        return decision;
    }

    /**
     * Perform AIPlayer's turn
     * While the player still has turns or has cards left,
     */
    async playerTurn() {
        while (this.character.actionsLeft > 0) {
            this.debugLogMe();
            const cardPos = await this.selectCard();
            await this.playCard(cardPos, this.context);
            if (this.context.gameEnded()) break;
        }
        this.endTurn();
    }

    /**
     * =================================================================================
     * Selection functions
     * Call this function to let the player or AI decide what card/target/etc to select
     *
     * TODO implement AI
     * =================================================================================
     */

    /**
     * Start simulation tree by creating a new root GameState node
     */
    createSimulationTree() {
        this.rootGameState = new GameState();
        this.rootGameState.addPlayerClones(this, this.context.players);
    }

    /**
     * Helper function for generating child nodes
     * @param parentDecisions array of previous decisions by parent, to be appended with new decision
     * @param newDecisions array of Decisions representing options that can be chosen
     * @returns Decision representing chosen option
     */
    async generateChildrenStates(parentDecisions, newDecisions) {
        let maxScore = -100; //TODO: -inf?
        let bestDecision = null;
        for (const decision of newDecisions) {
            // generate new parent decisions
            let newParentDecisions = parentDecisions.slice(0);
            console.log("PARENT DECISIONS");
            console.log(newParentDecisions);
            newParentDecisions.push(decision);
            // create child node
            let child = this.rootGameState.makeClone(newParentDecisions);
            // let it progress until end
            await child.progress();
            console.log("CHILD FINISHED PROGRESS");
            // calculate optimal play
            if (child.getScore() > maxScore) {
                maxScore = child.getScore();
                bestDecision = decision;
                this.cloneBestChildDecisions = [decision];
                this.cloneBestChildDecisions = this.cloneBestChildDecisions.concat(
                    child.player.cloneBestChildDecisions
                );
            }
        }
        return bestDecision;
    }

    /**
     * Unified function for AI making decisions
     * @param decisions array of Decisions representing options that can be chosen
     * @returns Decision representing chosen option
     */
    async makeDecision(decisions) {
        console.log("MAKING DECISION");
        //simple case
        // if (decisions.length === 1) {
        //     return decisions[0];
        // }
        /**
         * If this is a clone:
         * - Use getParentNextDecision() to get the next decision (need to keep cloneParentDecisions unchanged)
         * - If it is not -1, just use it as the decision
         * - Else if cloneBestChildDecision is not empty,
         *      use it as decision because that means this clone has finished simulation
         * - Else, start simulation
         */
        if (this.isClone) {
            const nextDecision = this.getNextParentDecision();
            if (nextDecision != null) {
                if (
                    this.cloneDecisionIndex === this.cloneParentDecisions.length
                ) {
                    console.log("CLONE USING CURRENT DECISION");
                } else {
                    console.log("CLONE USING PARENT DECISION");
                }
                return nextDecision;
            } else if (this.cloneBestChildDecisions.length > 0) {
                console.log("CLONE USING CHILD DECISION");
                return this.cloneBestChildDecisions.splice(0, 1)[0];
            } else {
                console.log("CLONE GENERATING TREE");
                const bestDecision = await this.generateChildrenStates(
                    this.cloneParentDecisions.slice(0),
                    decisions
                );
                return bestDecision;
            }
        } else {
        /**
         * Else, this is the original AI player
         * - If finalDecisions is not empty, use it to get the next decision
         * - Else,
         *      + Reset decision params and start the simulation tree
         *      + For each decision, clone the root GameState and assign decision in cloneParentDecisions
         *      + Let the GameState progress and get the score for that child node
         */
            if (this.finalDecisions.length > 0) {
                //do nothing, splice later
                console.log("ORIGINAL USING FINAL DECISION");
            } else {
                console.log("ORIGINAL GENERATING TREE");
                this.resetDecisions();
                this.createSimulationTree();
                const bestDecisions = await this.generateChildrenStates(
                    [],
                    decisions
                );
                console.log("FINAL DECISIONS");
                console.log(this.cloneBestChildDecisions);
                this.finalDecisions = this.cloneBestChildDecisions;
            }
            console.log(
                "DECISION TAKEN: " +
                    this.finalDecisions[0].playType +
                    " " +
                    this.finalDecisions[0].playNum
            );
            return this.finalDecisions.splice(0, 1)[0];
        }
    }

    /**
     * Selects a card to play from a specific set of cards
     * @returns index of chosen card
     */
    async selectCardCustom(cards) {
        //TODO
        console.log((this.isClone ? "CLONE " : "") + "SELECTING CARD CUSTOM");
        let decisions = [];
        for (const cardIndex in cards) {
            // if (this.hand[cardIndex].name === "Dummy Card") {
            //     // don't put dummy cards in the decision pool
            //     continue;
            // }
            decisions.push(new Decision("Card", cardIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        //TODO
        console.log((this.isClone ? "CLONE " : "") + "SELECTING CARD");
        let decisions = [];
        for (const cardIndex in this.hand) {
            // if (this.hand[cardIndex].name === "Dummy Card") {
            //     // don't put dummy cards in the decision pool
            //     continue;
            // }
            decisions.push(new Decision("Card", cardIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns 1 chosen player
     */
    async selectPlayer(players) {
        //TODO
        console.log((this.isClone ? "CLONE " : "") + "SELECTING PLAYER");
        let decisions = [];
        for (const playerIndex in players) {
            decisions.push(new Decision("Player", playerIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield
     */
    async selectShield(player) {
        //TODO
        console.log((this.isClone ? "CLONE " : "") + "SELECTING SHIELD");
        //special cases
        if (player.character.shields.length < 1) return -1;

        let decisions = [];
        for (const shieldIndex in player.character.shields) {
            decisions.push(new Decision("Shield", shieldIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card
     */
    async selectDiscardedCard(player) {
        //TODO
        console.log((this.isClone ? "CLONE " : "") + "SELECTING DISCARD");
        //special cases
        if (player.discardPile.length < 1) return -1;

        let decisions = [];
        for (const discardIndex in player.discardPile) {
            decisions.push(new Decision("Discard", discardIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }
}
