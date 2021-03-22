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
    allAliveOpponents(player) {
        let opp = [];
        for (const other of this.players) {
            if (other === player || other.character.health === 0 || !other.character.targetable()) continue;
            opp.push(other);
        }
        return opp;
    }

    choosePlayer(player) {
        // TODO: pop up GUI for choosing the target
        //TODO: choose left/right only vs choose anyone
        let allOpps = this.allAliveOpponents(player);
        return [allOpps[Math.floor(Math.random() * allOpps.length)]];
    }

    chooseShield() {
        //TODO
        let player = this.players[Math.floor(Math.random() * this.players.length)];
        let ishield = -1;
        if (player.character.shields.length > 0)
            player.character.shields[Math.floor(Math.random() * player.character.shields.length)];
        return [player, ishield];
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
