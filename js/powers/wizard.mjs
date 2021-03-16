import { MightyPower } from '../DMpower.mjs';

// do 3 damage to everyone
export class WizardFireball extends MightyPower {
    play(player, context) {
        player.character.doDamage(context.players, 3);
    }
}

// steal a shield
export class WizardStealShield extends MightyPower {
    play(player, context) {
        [opponent, ishield] = context.chooseShield();
        const shield = opponent.character.stealShield(ishield);
        player.character.addShield(shield);
    }
}

// swap hp with another player
export class WizardSwapHP extends MightyPower {
    play(player, context) {
        const opponent = context.choosePlayer(player);
        player.character.swapHealth(opponent.character);
    }
}
