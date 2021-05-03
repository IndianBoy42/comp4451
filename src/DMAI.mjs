import { DungeonMayhem } from "./DMgame.mjs";
import { Player } from "./DMplayer.mjs";

//Simulation parameters
const NUM_SIM_GAMES = 200;
const NUM_SIM_ROUNDS = 5;
const PLAYER_HP_WEIGHT = 0.5;
const OPPONENT_HP_WEIGHT = 0.5;
const PLAYER_HAND_WEIGHT = 0.05;
//theoretical worst scenario: for all NUM_SIM_GAMES, playerHP = 0 while opponentHP combined = 10
export const MIN_SCORE = -NUM_SIM_GAMES * 20;

export class Decision {
    /**
     * Object containing AI decision
     * @param playType String of what type of decision: 'Card', 'Player', 'Shield', 'Discard'
     * @param playNum Int index of selected card/player/shield
     */
    constructor(playType, playNum) {
        this.playType = playType;
        this.playNum = playNum;
    }

    toString() {
        return this.playType[0] + "" + this.playNum;
    }
}

export class GameState {
    constructor(context) {
        this.context = context.clone();
        this.player = null;
        this.allPlayers = [];
        this.score = MIN_SCORE;
        this.children = [];
        this.decision = null;
        this.decisionChain = ""; //for debug
    }

    /**
     * Add players to the GameState as clones
     * They should be added to this GameState's context automatically
     * @param player The AI player (or one of its clones) invoking this GameState object
     * @param allPlayers All players (or their clones)
     */
    addPlayerClones(player, allPlayers) {
        for (const p of allPlayers) {
            const c = p.clone(this.context, !(p === player));
            if (p === player) {
                this.player = c;
                this.player.gameState = this;
            }
            this.allPlayers.push(c);
        }
    }

    /**
     * Create a clone of this GameState
     * @param parentDecisions decisions used by the player to reach the needed state
     * @returns clone
     */
    clone(parentDecisions) {
        let cloneState = new GameState(this.context);
        cloneState.addPlayerClones(this.player, this.allPlayers);
        cloneState.player.cloneParentDecisions = parentDecisions;
        return cloneState;
    }

    /**
     * Generate child GameStates
     * @param parentDecisions
     * @param newDecisions
     */
    async generateChildrenStates(parentDecisions, newDecisions) {
        for (const decision of newDecisions) {
            // generate new parent decisions
            let newParentDecisions = parentDecisions.slice(0);
            //console.log("PARENT DECISIONS");
            //console.log(newParentDecisions);
            newParentDecisions.push(decision);
            // create child node
            // in the clone function, the cloned player's gameState is set to be this child
            let child = this.player.rootGameState.clone(newParentDecisions);
            child.decision = decision;
            this.children.push(child);
            // let it progress until end
            await child.progress();
        }
    }

    /**
     * Let the clone GameState progress until it reaches end of parentDecisions
     * The clone would now either be the root of more branches,
     * or it has finished simulating everything related to making the first decision.
     *
     * Note: GameState needs to know what functions were called originally so that it can catch up
     * In case of normal turn, just call player.selectCard() and player.playCard()
     * and the turn should progress normally (until it reaches decision branching time)
     * For other cases where AI would be invoked (ghost ping, shield attack, etc),
     * how to let this function know what functions should be called?
     * Maybe handle those cases separately idk, reserve this for decision making in player's turn
     *
     */
    async progress() {
        //console.log(this.player);
        const nextPlay = this.player.cloneParentDecisions[0].playType;
        switch (nextPlay) {
            case "Card":
                const cardPos = await this.player.selectCard();
                await this.player.playCard(cardPos, this.context);
                break;
            case "Player":
            case "Shield":
            case "Discard":
                console.log(this.player.cloneParentDecisions);
                throw new Error("PlayType " + nextPlay + " unsupported.");
                break;
            default:
                throw new Error("Invalid playType: " + nextPlay);
        }

        //console.log("GAMESTATE FINISHED PROGRESS");
    }

    /**
     * Calculate score for this GameState
     * @returns GameState child with best score (itself if it does not have any children)
     */
    async calculateScore() {
        //if this GameState has children, just get score from the best of its children
        if (this.children.length > 0) {
            let maxScore = MIN_SCORE;
            let bestChild = null;
            for (const child of this.children) {
                await child.calculateScore();
                if (child.score >= maxScore) {
                    if (child.score === maxScore && Math.random() < 0.5) {
                        //if scores are the same, randomize decision
                        continue;
                    }
                    maxScore = child.score;
                    bestChild = child;
                }
            }
            this.score = maxScore;
            this.decisionChain =
                this.decision.toString() + " " + bestChild.decisionChain;
            console.log(
                "BEST CHILD SCORE: " +
                    this.score +
                    " DECISIONS " +
                    this.decisionChain
            );
            return bestChild;
        }

        //else, this GameState is one where the player has enough cloneParentDecisions to reach end of card play
        //do random game simulations
        if (this.score > MIN_SCORE) return this; //if score is somehow calculated already
        this.score = 0;

        //for NUM_SIM_GAMES times:
        for (const t in Array.from(Array(NUM_SIM_GAMES))) {
            // create a clone of the context
            // this context is cloned from the player.rootGameState.context, which is currently at that player's turn
            // the playerTurn and round variables are before the player's turn had actually happened
            // but if player has played card before, it should be reflected in the players already
            // therefore, just need to keep track of what decision the player has made for this new card
            // and randomize the rest
            // also game shouldn't do startTurn() for the first player
            let simContext = this.player.rootGameState.context.clone();
            let simPlayer = null;
            for (const p of this.player.rootGameState.allPlayers) {
                let c = p.clone(
                    simContext,
                    !(p === this.player.rootGameState.player)
                );
                //set everyone to be in randomSim mode
                c.isRandomSimClone = true;
                //copy this player's parent decisions to the clone
                if (p === this.player.rootGameState.player) {
                    simPlayer = c;
                    simPlayer.cloneParentDecisions = this.player.cloneParentDecisions;
                }
            }
            //let the simContext run for NUM_SIM_ROUND rounds
            let remainingTurns = NUM_SIM_ROUNDS * simContext.players.length;
            let midTurnSim = true;
            while (remainingTurns > 0 && !simContext.gameEnded()) {
                await simContext.processNextTurn(null, midTurnSim, true);
                midTurnSim = false;
                remainingTurns -= 1;
            }
            //calculate score of this run
            let playerHP = simPlayer.character.effectiveHealth;
            let playerHand = (playerHP === 0 ? 0 : simPlayer.hand.length);
            let oppHP = 0;
            for (const opp of simContext.players) {
                if (opp === simPlayer) continue;
                oppHP += opp.character.effectiveHealth;
            }
            if (oppHP === 0) playerHP *= 100; //win bonus
            const simScore =
                playerHP * PLAYER_HP_WEIGHT +
                playerHand * PLAYER_HAND_WEIGHT -
                (oppHP * OPPONENT_HP_WEIGHT) / (simContext.players.length - 1);
            if (isNaN(simScore)) {
                console.log(simPlayer);
                throw new Error(
                    "player hp: " + playerHP + ", opp hp: " + oppHP
                );
            }
            this.score += simScore;
        }

        console.log("GAMESTATE FINISHED CALCULATING SCORE");
        this.decisionChain = this.decision.toString();
        console.log("SCORE: " + this.score + " DECISION " + this.decisionChain);
        return this;
    }
}
