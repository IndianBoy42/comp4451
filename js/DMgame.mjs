class DungeonMayhem {
    constructor() {
        this.players = [];
        //this.shields = [];
    }

    choosePlayer() {
        // TODO: pop up GUI for choosing the target
        //TODO: choose left/right only vs choose anyone
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
}
