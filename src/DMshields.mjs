export class Shield {
    constructor(max) {
        this.max = max;
        this.current = max;
    }

    encode() {
        return {
            max: this.max,
            current: this.current,
        };
    }
    static decode(obj) {
        const con = new Shield();
        con.max = obj.max;
        con.current = obj.current;
        return con;
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
    encode() {
        return {
            ...super.encode(),
            dmg: this.dmg,
        };
    }
    static decode(obj) {
        const con = Shield.decode(obj);
        con.dmg = obj.dmg;
        return con;
    }

    async getDamaged(amt, by, owner) {
        const ret = this.getDamaged(amt, by);
        if (this.current == 0) {
            const others = await context.choosePlayer(
                owner.player,
                true,
                false,
                false,
                false,
                true
            );
            owner.doDamage(others, this.dmg);
        }
        return ret;
    }
}

export const allShields = {
    Shield: Shield,
    DamagingShield: DamagingShield,
};
