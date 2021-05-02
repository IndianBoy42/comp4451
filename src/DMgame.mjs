import { Player } from "./DMplayer.mjs";
import { initRenderPlayer, spotlightPlayerTurn } from "./gfx.js";

export class DungeonMayhem {
    constructor() {
        this.players = [];
        this.playerTurn = 0;
        this.round = 1;
    }

    clone() {
        let clone = new DungeonMayhem();
        //dont copy players, when making new player clones add them to this clone
        clone.playerTurn = this.playerTurn;
        clone.round = this.round;
        return clone;
    }

    encode() {
        return {
            players: this.players.map(p => p.encode()),
            turn: this.playerTurn,
            round: this.round,
        };
    }
    decode(obj) {
        this.players.forEach((p, i) => p.decode(obj.players[i]));
        for (let i = this.players.length; i < obj.players.length; i++) {
            const newPlayerData = obj.players[i];
            const player = Player.newFrom(newPlayerData, this);
            initRenderPlayer(player);
        }
        this.playerTurn = obj.turn;
        this.round = obj.round;
    }

    async start() {
        for (const player of this.players) {
            player.endTurn(false);
            player.drawCards(3);
        }
        await Promise.all(this.players.flatMap(p => p.newGameStart()));
    }

    allOpponents(player) {
        let opp = [];
        for (const other of this.players) {
            if (other === player) continue;
            opp.push(other);
        }
        return opp;
    }
    allAliveOpponents(
        player,
        targetSelf = false,
        targetDisguise = false,
        isGhostPing = false
    ) {
        let opps = [];
        for (const opp of this.players) {
            if (
                !this.isValidOpponent(
                    player,
                    opp,
                    targetSelf,
                    targetDisguise,
                    isGhostPing
                )
            )
                continue;
            opps.push(opp);
        }
        return opps;
    }
    isValidOpponent(
        player,
        opp,
        targetSelf = false,
        targetDisguise = false,
        isGhostPing = false
    ) {
        let valid = opp.character.health > (isGhostPing ? 1 : 0);
        if (!targetSelf) valid = valid && !(opp === player);
        if (!targetDisguise) valid = valid && opp.character.targetable();
        return valid;
    }
    isValidOpponentIndex(
        player,
        oppIndex,
        targetSelf = false,
        targetDisguise = false,
        isGhostPing = false
    ) {
        const opp = this.players[oppIndex];
        return this.isValidOpponent(
            player,
            opp,
            targetSelf,
            targetDisguise,
            isGhostPing
        );
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
    async choosePlayer(
        player,
        chooseAnyone = false,
        targetSelf = false,
        targetDisguise = false,
        isGhostPing = false
    ) {
        let opps = [];
        if (chooseAnyone) {
            opps = this.allAliveOpponents(
                player,
                targetSelf,
                targetDisguise,
                isGhostPing
            );
        } else {
            const allPlayers = this.allAliveOpponents(player, true); //ghostPing doesnt care about left/right
            //TODO can rewrite this part using ID
            let thisIndex = 0;
            for (const pIndex in allPlayers) {
                if (player === allPlayers[pIndex]) {
                    thisIndex = pIndex;
                    break;
                }
            }
            const leftOppIndex =
                (thisIndex - 1 + allPlayers.length) % allPlayers.length;
            const leftOpp = allPlayers[leftOppIndex];
            if (
                this.isValidOpponent(
                    player,
                    leftOpp,
                    targetSelf,
                    targetDisguise,
                    isGhostPing
                )
            ) {
                opps.push(leftOpp);
            }
            const rightOppIndex = (+thisIndex + 1) % allPlayers.length; //oh my god i hate javascript
            const rightOpp = allPlayers[rightOppIndex];
            if (
                rightOppIndex != leftOppIndex &&
                this.isValidOpponent(player, rightOpp, targetSelf)
            ) {
                opps.push(rightOpp);
            }
        }

        if (opps.length === 0 || opps.length === 1) return opps;
        const i = await player.selectPlayer(opps);
        return [opps[i]];
    }

    /**
     * Select a shield in the game
     * @param player player doing the selection
     * @param targetSelf whether to target own shields
     * @returns array of the targetted player and the index of the chosen shield (to be used in stealShield())
     */
    async chooseShield(player, targetSelf = false) {
        const t = await this.choosePlayer(player, true, targetSelf);
        console.trace(t);
        if (t.length === 0) return [null, -1];
        const target = t[0];
        let ishield = -1;
        if (target.character.shields.length == 1) ishield = 0;
        else if (target.character.shields.length > 1)
            ishield = await player.selectShield(target);
        return [target, ishield];
    }

    makeAnimalNoise() {
        // TODO: Fun UI for this
        return true;
    }

    gameEnded() {
        let playerDead = 0;
        for (const player of this.players) {
            if (player.character.health === 0) ++playerDead;
        }
        return playerDead + 1 >= this.players.length;
    }

    updateGameState() {
        return Promise.all(this.players.flatMap(p => p.updateGameState()));
    }

    getWinner() {
        if (!this.gameEnded()) return null;
        for (const player of this.players) {
            if (player.character.health > 0) return player;
        }
        return null; //in case everyone dies
    }


    /**
     * Process a turn in the game
     * Automatically updates playerTurn and round
     * @param hostPlayer if not null, this is the actual game and will hide/show cards
     * @param midTurnSim is true, this is simulating from the middle of a player's turn, so don't do startTurn
     */
    async processNextTurn(hostPlayer = null, midTurnSim = false) {
        const player = this.players[this.playerTurn];
        spotlightPlayerTurn(player);

        if (player.character.health > 0) {
            if (!midTurnSim) player.startTurn(!(hostPlayer && hostPlayer.id == player.id));
            if (!midTurnSim) player.drawCards(1);
            await player.playerTurn();
            player.endTurn(!(hostPlayer && hostPlayer.id == player.id));
        } else {
            // ghost ping
            await player.playerDeadTurn();
        }

        //end turn, update playerTurn and round
        this.playerTurn += 1;
        if (this.playerTurn === this.players.length) {
            this.playerTurn = 0;
            this.round += 1;
        }
    }

}
