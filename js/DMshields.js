
export class Shield {
    constructor(max) {
        this.max = max;
        this.current = max;
    }

    getDamaged(amt, by, owner) {
        if (this.current > amt) {
            this.current -= amt;
            return 0;
        } else {
            amt -= this.current;
            this.current = 0;
            return amt;
        }
    }

    reset() {
        this.current = this.max;
    }
}

export class DamagingShield extends Shield {
    constructor(max, dmg) {
        this.max = max;
        this.current = max;
        this.dmg = dmg;
    }


    getDamaged(amt, by, owner) {
        const ret = this.getDamaged(amt, by);
        if (this.current == 0) {
            by.getDamaged(this.dmg, owner);
        }
        return ret;
    }
}