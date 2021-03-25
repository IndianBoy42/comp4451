import { askIntInput } from '../input.mjs';

export class DungeonMayhem {
    constructor() {
        this.players = [];
        //this.shields = [];
    }

    allOpponents(player) {
        let opp = [];
        for (const other of this.players) {
            if (other === player) continue;
            opp.push(other);
        }
        return opp;
    }
    allAliveOpponents(player, targetSelf = false) {
        let opp = [];
        for (const oppIndex in this.players) {
            if (!this.isValidOpponent(player, oppIndex, targetSelf)) continue;
            opp.push(this.players[oppIndex]);
        }
        return opp;
    }
    isValidOpponent(player, oppIndex, targetSelf = false, targetDisguise = false) {
        const opp = this.players[oppIndex];
        let valid = (opp.character.health > 0);
        if (!targetSelf) valid = valid && !(opp === player);
        if (!targetDisguise) valid = valid && opp.character.targetable();
        return valid;
    }

    async choosePlayer(player, targetSelf = false) {
        // TODO: pop up GUI for choosing the target
        //TODO: choose left/right only vs choose anyone 
        let allOpps = this.allAliveOpponents(player, targetSelf);
        let finish = (allOpps.length === 0);
        let overflowCount = 0;
        while (!finish) {
            const input = await askIntInput("Choose target from 1 to 6: ", 1, 6);
            const oppIndex = input - 1;
            if (this.isValidOpponent(player, oppIndex, targetSelf)) {
                //finish = true;
                console.log("Target player " + input);
                return [this.players[oppIndex]];
            }
            ++overflowCount;
            if (overflowCount > 100) throw new Error("Infinite loop in choosePlayer(), " + allOpps.length);
            console.log("Invalid target!");
        }
        return [];
        //return [allOpps[Math.floor(Math.random() * allOpps.length)]];
    }

    async chooseShield(player, targetSelf = false) {
        //TODO
        const t = await this.choosePlayer(player, targetSelf);
        if (t.length === 0) return [null, -1];
        const target = t[0];
        let ishield = -1;
        if (target.character.shields.length > 0)
            ishield = await askIntInput("Choose shield index: ", 0, target.character.shields.length-1);
            //target.character.shields[Math.floor(Math.random() * target.character.shields.length)];
        return [target, ishield];
    }

    makeAnimalNoise() {
        return true;
    }

    gameEnded() {
        let playerDead = 0;
        for (const player of this.players) {
            if (player.character.health === 0) ++playerDead;
        }
        return (playerDead + 1 >= this.players.length);
    }
}
