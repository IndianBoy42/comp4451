export class DungeonMayhem {
    constructor() {
        this.players = [];
        //this.shields = [];
    }

    choosePlayer(player) {
        // TODO: pop up GUI for choosing the target
        //TODO: choose left/right only vs choose anyone
        return this.allOpponents(player);
    }

    allOpponents(player) {
        let opp = [];
        for (const other of this.players) {
            if (other === player) continue;
            opp.push(other);
        }
        return opp;
    }

    chooseShield() {
        //TODO
        //return [player, ishield];
    }

    makeAnimalNoise() {
        return true;
    }
}
