import { Player } from './DMPlayer.mjs';
import { GameState, Decision } from './DMAI.mjs';

export class AIPlayer extends Player {
    constructor(name, character, context, isClone = false) {
        super(name, character, context, isClone);
        this.resetDecisions();
    }

    clone(context, isClone) {
        let clone = super(context, isClone);
        clone.rootGameState = this.rootGameState;
        return clone;
    }

    /**
     * Reset decision related variables
     * - finalDecisions: Filled with the optimal decisions when tree simulation is finished
     * - cloneParentDecisions: Used by clones. 
     *                  Take decisions from here to get to its parent's position + the testing decision
     * - cloneDecisionIndex: Used by clones. Index of cloneParentDecisions to take from
     */
    resetDecisions() {
        this.finalDecisions = [];
        this.cloneParentDecisions = [];
        this.cloneDecisionIndex = 0;
    }

    /**
     * Return -1 if cloneDecisionIndex = cloneParentDecisions.length
     * Otherwise, return the next parent decision and increment cloneDecisionIndex
     */
    getNextParentDecision() {
        if (this.cloneDecisionIndex === this.cloneParentDecisions.length) {
            return -1;
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
        this.resetDecisions();
        for (const decision in newDecisions) {
            const newParentDecisions = parentDecisions.push(decision);
            let child = this.rootGameState.clone(newParentDecisions);
            await child.progress();
            if (child.getScore() > maxScore) {
                maxScore = child.getScore();
                bestDecision = decision;
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
        /**
         * If this is a clone:
         * - Use getParentNextDecision() to get the next decision
         * - If it is not -1, just use it as the decision
         * - Else, create new children nodes
         *      //TODO
         *   When finished, store the finalDecisions of the best node in this one.
         *   Append cloneParentDecisions[last] at the beginning
         *   Calculate score (//TODO?)
         */
        if (this.isClone) {
            const nextDecision = this.getNextParentDecision();
            if (nextDecision != -1) {
                return nextDecision;
            }
            else {
                const bestDecisions = await this.generateChildrenStates(
                    this.cloneParentDecisions.slice(0),
                    decisions
                );
                return bestDecisions;
            }
        }
        /**
         * Else, this is the original AI player
         * - If finalDecisions is not empty, use it to get the next decision
         * - Else, 
         *      + Reset decision params and start the simulation tree 
         *      + For each decision, clone the root GameState and assign decision in cloneParentDecisions
         *      + Let the GameState progress and get the score for that child node
         */
        else {
            if (this.finalDecisions.length > 0) {
                return this.finalDecisions.splice(0, 1);
            }
            else {
                const bestDecisions = await this.generateChildrenStates(
                    [],
                    decisions
                );
                return bestDecisions;
            }
        }
    }

    /**
     * Selects a card to play from hand
     * @returns index of chosen card
     */
    async selectCard() {
        //TODO
        let decisions = [];
        for (const cardIndex in this.hand) {
            decisions.push(new Decision('Card', cardIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.decision;
    }

    /**
     * Selects a player from an array of players
     * @param players array of selectable players
     * @returns 1 chosen player
     */
    async selectPlayer(players) {
        //TODO
        let decisions = [];
        for (const playerIndex in players) {
            decisions.push(new Decision('Player', playerIndex));
        }
        const decision = await this.makeDecision(decisions);
        return players[decision.decision];
    }

    /**
     * Selects a shield from array of shields
     * @param player player whose shields is chosen
     * @returns index of chosen shield
     */
    async selectShield(player) {
        //TODO
        //special cases
        if (player.character.shields.length < 1) return -1;
        else if (player.character.shields.length === 1) return 0;

        let decisions = [];
        for (const shieldIndex in player.character.shields) {
            decisions.push(new Decision('Shield', shieldIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.decision;
    }

    /**
     * Selects a card to pick from discard pile
     * @returns index of chosen card
     */
    async selectDiscardedCard(player) {
        //TODO
        //special cases
        if (player.discardPile.length < 1) return -1;
        else if (player.discardPile.length === 1) return 0;

        let decisions = [];
        for (const discardIndex in player.discardPile) {
            decisions.push(new Decision('Discard', discardIndex));
        }
        const decision = await this.makeDecision(decisions);
        return decision.decision;
    }
}