import { MightyPower } from '../DMpower.mjs';

// do 3 damage to everyone
export class WizardFireball extends MightyPower {
    play(player, context) {
        player.character.doDamage(context.players, 3);
    }
}

// steal a shield
export class WizardStealShield extends MightyPower {
    async play(player, context) {
        const ps = await context.chooseShield(player);
        const opponent = ps[0];
        const ishield = ps[1];
        if (ishield > -1) {
            const shield = opponent.character.stealShield(ishield);
            player.character.addShield(shield);
        }
    }
}

// swap hp with another player
export class WizardSwapHP extends MightyPower {
    async play(player, context) {
        const o = await context.choosePlayer(player, true);
        const opponent = o[0];
        if (opponent === undefined) return;
        player.character.swapHealth(opponent.character);
    }
}
