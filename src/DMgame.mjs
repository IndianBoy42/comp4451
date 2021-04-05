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
    allAliveOpponents(player, targetSelf = false, targetDisguise = false, isGhostPing = false) {
        let opps = [];
        for (const opp of this.players) {
            if (!this.isValidOpponent(player, opp, targetSelf, targetDisguise, isGhostPing)) continue;
            opps.push(opp);
        }
        return opps;
    }
    isValidOpponent(player, opp, targetSelf = false, targetDisguise = false, isGhostPing = false) {
        let valid = (opp.character.health > (isGhostPing ? 1 : 0));
        if (!targetSelf) valid = valid && !(opp === player);
        if (!targetDisguise) valid = valid && opp.character.targetable();
        return valid;
    }
    isValidOpponentIndex(player, oppIndex, targetSelf = false, targetDisguise = false, isGhostPing = false) {
        const opp = this.players[oppIndex];
        return this.isValidOpponent(player, opp, targetSelf, targetDisguise, isGhostPing);
    }

    /**
     * Select a player from the game
     * Default is to select an opponent on the left or right
     * @param player the player doing the selection
     * @param chooseAnyone if true, select from all players instead of just left/right
     * @param targetSelf if true, include self in selection (e.g. for choosing shields)
     * @param targetDisguise if true, include players with disguised = true
     * @param isGhostPing if true, choose players with hp > 1 for ghost ping
     * @returns an array containing 1 player (if chosen) or 0 (if no one can be chosen)
     */
    async choosePlayer(player, chooseAnyone = false, 
                    targetSelf = false, targetDisguise = false, isGhostPing = false) 
    {
        // TODO: pop up GUI for choosing the target
        let opps = [];
        if (chooseAnyone) {
            opps = this.allAliveOpponents(player, targetSelf, targetDisguise, isGhostPing);
        }
        else {
            const allPlayers = this.allAliveOpponents(player, true); //ghostPing doesnt care about left/right
            //TODO can rewrite this part using ID
            let thisIndex = 0;
            for (const pIndex in allPlayers) {
                if (player === allPlayers[pIndex]) {
                    thisIndex = pIndex;
                    break;
                }
            }
            const leftOppIndex = (thisIndex - 1 + allPlayers.length) % allPlayers.length;
            const leftOpp = allPlayers[leftOppIndex];
            if (this.isValidOpponent(player, leftOpp, targetSelf, targetDisguise, isGhostPing)) {
                opps.push(leftOpp);
            }
            const rightOppIndex = (+thisIndex + 1) % allPlayers.length; //oh my god i hate javascript
            const rightOpp = allPlayers[rightOppIndex];
            if (rightOppIndex != leftOppIndex && this.isValidOpponent(player, rightOpp, targetSelf)) {
                opps.push(rightOpp);
            }
        }

        if (opps.length === 0 || opps.length === 1) return opps;
        const opp = await player.selectPlayer(opps);
        return [opp];

        //return [allOpps[Math.floor(Math.random() * allOpps.length)]];
    }

    /**
     * Select a shield in the game
     * @param player player doing the selection
     * @param targetSelf whether to target own shields
     * @returns array of the targetted player and the index of the chosen shield (to be used in stealShield())
     */
    async chooseShield(player, targetSelf = false) {
        //TODO
        const t = await this.choosePlayer(player, true, targetSelf);
        if (t.length === 0) return [null, -1];
        const target = t[0];
        let ishield = -1;
        if (target.character.shields.length > 0)
            ishield = await player.selectShield(target.character.shields);
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
