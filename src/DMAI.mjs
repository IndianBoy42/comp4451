import { DungeonMayhem } from './DMgame.mjs';
import { Player } from './DMplayer.mjs';

class GameState {
    constructor(clones, plays) {
        this.context = new DungeonMayhem();
        this.context.players.push(clones);
        this.plays = plays;
    }
}

export class AI {
    constructor(player) {
        this.player = player;
        this.resetPlays();
    }

    resetPlays() {
        this.explorePlays = [];
        this.optimalPlays = [];
    }

    getOptimalPlay(choices) {
        //set up 
        const clones = [];
        clones.push(this.player.clone());
        for (const opp in this.player.context.allOpponents(this.player)) {
            clones.push(opp.clone());
        }

        for (const choice of choices) {

        }
    }

}