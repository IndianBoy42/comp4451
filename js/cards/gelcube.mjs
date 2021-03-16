import { DMCard } from "../DMcards.mjs";
import { GelCubeDmgShield } from "../powers/powers.mjs";

function GelCubeDmgShieldCard() {
    // return new DMCard("[GelCubeDmgShieldCard]", 0, 0, 0, 0, [
    //     GelCubeDmgShield(3),
    // ]);
    return new DMCard.powerCard("[GelCubeDmgShieldCard]", GelCubeDmgShield(3));
}