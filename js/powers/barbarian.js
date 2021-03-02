// everyone discard hand, then draw 3 cards
export class BarbarianDiscardHand extends MightyPower {
    play(player, context) {
        for (const other of context.allPlayers) {
            other.discardHand(3);
        }
    }
}

// destroy a shield card
export class BarbarianDestroyShield extends MightyPower {
    play(player, context) {
        [opponent, ishield] = context.chooseShield();
        const shield = opponent.character.stealShield(ishield);
        opponent.disCard(shield);
    }
}

// for each opponent, attack 1 and heal 1
export class BarbarianHeal extends MightyPower {
    play(player, context) {
        for (const other of context.allOpponents(player)) {
            player.character.doDamage([other], 1);
            player.character.heal(1);
        }
    }
}