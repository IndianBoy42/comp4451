import { MightyPower } from "../DMpower.mjs";
import { allPowers } from "../DMpower.mjs";

//destroy a shield card then heal
export class GelCubeDestroyShield extends MightyPower {
    async play(player, context) {
        const ps = await context.chooseShield(player);
        const opponent = ps[0];
        const ishield = ps[1];
        if (ishield > -1) {
            const shield = opponent.character.stealShield(ishield);
            player.character.heal(shield.shieldObj.max);
            opponent.disCard(shield);
        }
    }
}

//ignore shield cards this turn
export class GelCubeIgnoreShield extends MightyPower {
    play(player, context) {
        player.character.ignoringShields = true;
    }
}

//when this card is destroyed, do 2 damage
export class GelCubeDmgShield extends MightyPower {
    play(player, context) {
        //handled in DMcards.play()
    }
}

allPowers.GelCubeDestroyShield = GelCubeDestroyShield;
allPowers.GelCubeIgnoreShield = GelCubeIgnoreShield;
allPowers.GelCubeDmgShield = GelCubeDmgShield;
