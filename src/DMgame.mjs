import { askIntInput, DEBUG_RNG_INPUT } from "./input.mjs";

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
        // TODO: pop up GUI for choosing the target
        if (chooseAnyone) {
            let allOpps = this.allAliveOpponents(
                player,
                targetSelf,
                targetDisguise,
                isGhostPing
            );
            let finish = allOpps.length === 0;
            let overflowCount = 0;
            while (!finish) {
                let input = 0;
                let opp = null;
                if (DEBUG_RNG_INPUT) {
                    input = await askIntInput(
                        "Choose target: ",
                        0,
                        allOpps.length - 1
                    );
                    opp = allOpps[input];
                } else {
                    input = await askIntInput(
                        "Choose target from 1 to 6: ",
                        1,
                        6
                    );
                    opp = this.players[input - 1];
                }
                if (
                    this.isValidOpponent(
                        player,
                        opp,
                        targetSelf,
                        targetDisguise,
                        isGhostPing
                    )
                ) {
                    //finish = true;
                    console.log(
                        "Target player " + (DEBUG_RNG_INPUT ? opp.name : input)
                    );
                    return [opp];
                }
                ++overflowCount;
                if (overflowCount > 100)
                    throw new Error(
                        "Infinite loop in choosePlayer(), " + allOpps.length
                    );
                console.log("Invalid target!");
            }
        } else {
            const allPlayers = this.allAliveOpponents(player, true); //ghostPing doesnt care about left/right
            let thisIndex = 0;
            for (const pIndex in allPlayers) {
                if (player === allPlayers[pIndex]) {
                    thisIndex = pIndex;
                    break;
                }
            }
            let opps = [];
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

            if (opps.length === 2) {
                const input = await askIntInput(
                    "Choose 0 to target left, 1 to target right: ",
                    0,
                    1
                );
                return [opps[input]];
            } else if (opps.length === 1 || opps.length === 0) return opps;
            else {
                throw new Error("WHAT\n\n\nHOW");
            }
        }

        return [];
        //return [allOpps[Math.floor(Math.random() * allOpps.length)]];
    }

    async chooseShield(player, targetSelf = false) {
        //TODO
        const t = await this.choosePlayer(player, true, targetSelf);
        if (t.length === 0) return [null, -1];
        const target = t[0];
        let ishield = -1;
        if (target.character.shields.length > 0)
            ishield = await askIntInput(
                "Choose shield index: ",
                0,
                target.character.shields.length - 1
            );
        //target.character.shields[Math.floor(Math.random() * target.character.shields.length)];
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
}
