import { Player } from "./DMplayer.mjs";
import { shuffle } from "./shuffle.mjs";
import { DummyCard } from "./cards/cards.mjs";
import { GameState, Decision, MIN_SCORE } from "./DMAI.mjs";
import { emitWarning } from "process";

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
        clone.cloneAttributes(this, isOpponent);
        return clone;
    }

    // helper function for clone()
    cloneAttributes(original, isOpponent) {
        super.cloneAttributes(original, isOpponent);
        this.rootGameState = original.rootGameState;
    }

    /**
     * Reset decision related variables
     * - bestChildDecisions: Set to decisions made by the child with best score after simulation
     * - cloneParentDecisions: Used by clones.
     *                  Take decisions from here to get to its parent's position + the testing decision
     * - cloneDecisionIndex: Used by clones. Index of cloneParentDecisions to take from
     * - gameState: GameState associated with this player/clone
     */
    resetDecisions() {
        this.bestChildDecisions = [];
        this.cloneParentDecisions = [];
        this.cloneDecisionIndex = 0;
        this.gameState = null;
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
        this.rootGameState = this.gameState = new GameState(this.context);
        this.rootGameState.addPlayerClones(this, this.context.players);
        this.rootGameState.decision = new Decision("Root", 0); //for debugging
    }

    /**
     * Get the best decision from newDecisions
     * Will create new GameState children, calculate score and find best decision
     * @param parentDecisions
     * @param newDecisions
     */
    async getBestDecision(parentDecisions, newDecisions) {
        console.log((this.isClone ? "CLONE " : "") + "GENERATING " + newDecisions[0].playType + " TREE");
        await this.gameState.generateChildrenStates(
            parentDecisions,
            newDecisions
        );
        const bestChild = await this.gameState.calculateScore();
        this.bestChildDecisions = [bestChild.decision];
        this.bestChildDecisions = this.bestChildDecisions.concat(
            bestChild.player.bestChildDecisions
        );
        return bestChild.decision;
    }

    /**
     * Unified function for AI making decisions
     * @param decisions array of Decisions representing options that can be chosen
     * @returns Decision representing chosen option
     */
    async makeDecision(decisions) {
        if (!this.isRandomSimClone) await new Promise(resolve => setInterval(() => resolve(), 100));

        // put everything in a try block. if error exists, throw warning and make a random decision
        try {
            let chosenDecision = null;
            // random simulation case
            if (this.isRandomSimClone) {
                const nextDecision = this.getNextParentDecision();
                if (nextDecision != null) {
                    //first decisions of the original player's clone is determined
                    chosenDecision = nextDecision;
                } else {
                    chosenDecision = decisions[Math.floor(Math.random() * decisions.length)];
                }
            } else if (this.isClone) {
                /**
                 * If this is a clone:
                 * - Use getParentNextDecision() to get the next decision (need to keep cloneParentDecisions unchanged)
                 * - If it is not -1, just use it as the decision
                 * - Else if bestChildDecision is not empty,
                 *      use it as decision because that means this clone has finished simulation
                 * - Else, start simulation
                 */
                const nextDecision = this.getNextParentDecision();
                if (nextDecision != null) {
                    if (
                        this.cloneDecisionIndex === this.cloneParentDecisions.length
                    ) {
                        //console.log("CLONE USING CURRENT DECISION");
                    } else {
                        //console.log("CLONE USING PARENT DECISION");
                    }
                    chosenDecision = nextDecision;
                } else if (this.bestChildDecisions.length > 0) {
                    //console.log("CLONE USING CHILD DECISION");
                    chosenDecision = this.bestChildDecisions.splice(0, 1)[0];
                } else {
                    const bestDecision = await this.getBestDecision(
                        this.cloneParentDecisions.slice(0),
                        decisions
                    );
                    chosenDecision = bestDecision;
                }
            } else {
                /**
                 * Else, this is the original AI player
                 * - If bestChildDecisions is not empty, use it to get the next decision
                 * - Else,
                 *      + Reset decision params and start the simulation tree
                 *      + For each decision, clone the root GameState and assign decision in cloneParentDecisions
                 *      + Let the GameState progress and get the score for that child node
                 */
                if (this.bestChildDecisions.length > 0) {
                    //do nothing, splice later
                    //console.log("ORIGINAL USING FINAL DECISION");
                } else {
                    //console.log("ORIGINAL GENERATING TREE");
                    this.resetDecisions();
                    this.createSimulationTree();
                    await this.getBestDecision([], decisions);
                    // console.log("FINAL DECISIONS");
                    // console.log(this.bestChildDecisions);
                }
                console.log(
                    "DECISION TAKEN: " +
                    this.bestChildDecisions[0].playType +
                    " " +
                    this.bestChildDecisions[0].playNum
                );
                chosenDecision = this.bestChildDecisions.splice(0, 1)[0];
            }
            // double check playType
            if (chosenDecision.playType != decisions[0].playType) {
                throw new Error(this.debugWrongTypeError(
                    chosenDecision.playType, 
                    decisions[0].playType)
                );
            }
            // return the chosen decision
            return chosenDecision;
        }
        catch (err) {
            console.warn(err);
            return decisions[Math.floor(Math.random() * decisions.length)];
        }
    }

    debugWrongTypeError(playType, expectedType) {
        let msg = "Wrong playType: " + playType + " instead of " + expectedType + ". ";
        msg += "Parent decision types: ";
        for (const decision of this.cloneParentDecisions) {
            msg += decision.playType + ", ";
        }
        msg += "Current index: " + this.cloneDecisionIndex + ". ";
        msg += "This " + (this.isRandomSimClone ? "IS" : "is NOT") + " randomSimClone. ";
        return msg
    }

    /**
     * Selects a card to play from a specific set of cards
     * @returns index of chosen card
     */
    async selectCardCustom(cards, message = "") {
        //due to CommuneWithNature, it is possible for simulation to draw shapeshift cards
        //but not in the actual game, causing desync
        //therefore just select randomly
        return Math.floor(Math.random() * cards.length);
    }

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        if (!this.isClone) console.log("SELECTING CARD");
        let decisions = [];
        for (const cardIndex in this.hand) {
            decisions.push(new Decision("Card", cardIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }

    /**
     * Selects a player from an array of players
     * @param opponents array of selectable players
     * @param specialCase if true, AI will just select a random player
     * @returns index of chosen player
     */
    async selectPlayer(opponents, specialCase = false) {
        if (specialCase) {
            return Math.floor(Math.random() * opponents.length);
        }
        if (!this.isClone) console.log("SELECTING PLAYER");
        let decisions = [];
        for (const playerIndex in opponents) {
            decisions.push(new Decision("Player", playerIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.playNum;
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield, -1 if player has no shield
     */
    async selectShield(player) {
        if (!this.isClone) console.log("SELECTING SHIELD");
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
     * @returns index of chosen card, -1 if player has no discard
     */
    async selectDiscardedCard(player) {
        if (!this.isClone) console.log("SELECTING DISCARD");
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
