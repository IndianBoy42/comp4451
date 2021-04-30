import { DungeonMayhem } from './DMgame.mjs';
import { Player } from './DMplayer.mjs';

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
}

export class GameState {
    constructor() {
        this.context = new DungeonMayhem();
        this.player = null;
        this.allPlayers = [];
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
            if (p === player) this.player = c;
            this.allPlayers.push(c);
        }
    }

    /**
     * Create a clone of this GameState
     * @param parentDecisions 
     * @returns 
     */
    makeClone(parentDecisions) {
        let cloneState = new GameState();
        cloneState.addPlayerClones(this.player, this.allPlayers);
        cloneState.player.cloneParentDecisions = parentDecisions;
        return cloneState;
    }

    /**
     * Let the clone GameState progress until it reaches end of parentDecisions
     * The clone would now either be the root of more branches,
     * or it has reached a state where 
     * 
     * TODO: GameState needs to know what functions were called originally so that it can catch up
     * In case of normal turn, just call player.selectCard() and player.playCard()
     * and the turn should progress normally (until it reaches decision branching time)
     * For other cases where AI would be invoked (ghost ping, shield attack, etc),
     * how to let this function know what functions should be called?
     * Maybe handle those cases separately idk, reserve this for decision making in player's turn
     */
    async progress() {
        console.log(this.player);
        const nextPlay = this.player.cloneParentDecisions[0].playType;
        switch (nextPlay) {
            case 'Card':
                const cardPos = await this.player.selectCard();
                await this.player.playCard(cardPos, this.context);
                break;
            case 'Player':
                const opp = await this.context.choosePlayer(
                    this.player,
                    true,
                    false,
                    false,
                    true
                );
                if (opp.length > 0) this.player.character.doDamage(opp, 1);
                break;
            case 'Shield':
                //TODO
                console.log(this.player.cloneParentDecisions);
                throw new Error("Unsupported.");
                break;
            case 'Discard':
                //TODO
                console.log(this.player.cloneParentDecisions);
                throw new Error("Unsupported.");
                break;
            default:
                throw new Error("Invalid playType: " + nextPlay);
        }
    }

    /**
     * Get the score for this GameState
     */
    getScore() {
        //TODO
        return this.player.character.health;
    }

}

// export class AI {
//     constructor(player) {
//         this.player = player;
//         this.resetPlays();
//     }

//     resetPlays() {
//         this.explorePlays = [];
//         this.optimalPlays = [];
//     }

//     getOptimalPlay(choices) {
//         //set up 
//         const clones = [];
//         clones.push(this.player.clone());
//         for (const opp in this.player.context.allOpponents(this.player)) {
//             clones.push(opp.clone());
//         }

//         for (const choice of choices) {

//         }
//     }

// }