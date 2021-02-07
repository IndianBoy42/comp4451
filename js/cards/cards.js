import DMCard from "../DMcards.mjs";
import GelCubeDmgShield from "../powers/powers.js";
export * from 'druid.js';

function GelCubeDmgShieldCard() {
    // return new DMCard("[GelCubeDmgShieldCard]", 0, 0, 0, 0, [
    //     GelCubeDmgShield(3),
    // ]);
    return DMCard.powerCard("[GelCubeDmgShieldCard]", GelCubeDmgShield(3));
}
