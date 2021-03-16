import { DMCard } from "../DMcards.mjs";
import {
    DruidFormePower,
    DruidShapeshiftWolf,
    DruidShapeshiftBear,
    DruidAnimalMultiattack,
    DruidFreeShapeshift,
} from "../powers/druid.mjs";

/**
 * Notes:
 * - done
 */

function Poochie() { //x2
    return new DMCard("Poochie").addShield(1).addDamage(1);
}
function TheEldestElk() { //x1
    return new DMCard("The Eldest Elk").addShield(3);
}
function ThornWhip() { //x3
    return new DMCard("Thorn Whip").addDamage(1).addActions(1);
}
function GiftOfSilvanus() { //x2
    return new DMCard("Gift Of Silvanus")
        .addMightyPower(DruidFormePower(1))
        .addDamage(2);
}
function CommuneWNature() { //x2
    return new DMCard("Commune With Nature")
        .addDrawCards(2)
        .addMightyPower(DruidFreeShapeshift(1));
}
function DruidicBalance() { //x2
    return new DMCard("Druidic Balance").addHeal(1).addDrawCards(1).addDamage(1);
}
function QuickAsAFox() { //x2
    return new DMCard("Quick As A Fox").addActions(2);
}
function Bearnard() { //x2
    return new DMCard("Bearnard").addShield(1).addMightyPower(DruidFormePower(1));
}
function ShapeshiftBear() { //x2
    return new DMCard("Shapeshift: Bear")
        .addHeal(2)
        .addMightyPower(DruidShapeshiftBear(1));
}
function ShapeshiftWolf() { //x3
    return new DMCard("Shapeshift: Wolf")
        .addDamage(2)
        .addMightyPower(DruidShapeshiftWolf(1));
}
function CallLightning() { //x3
    return new DMCard("Call Lightning").addDamage(3);
}
function PrimalStrike() { //x2
    return new DMCard("Primal Strike")
        .addActions(1)
        .addMightyPower(DruidAnimalMultiattack(1));
}
function WildRush() { //x2
    return new DMCard("Wild Rush")
        .addDrawCards(2)
        .addMightyPower(DruidFormePower(1));
}

export function getDruidDeck() {
    return [
        Poochie(), Poochie(),
        TheEldestElk(),
        ThornWhip(), ThornWhip(), ThornWhip(), 
        GiftOfSilvanus(), GiftOfSilvanus(),
        CommuneWNature(), CommuneWNature(),
        DruidicBalance(), DruidicBalance(),
        QuickAsAFox(), QuickAsAFox(),
        Bearnard(), Bearnard(),
        ShapeshiftBear(), ShapeshiftBear(),
        ShapeshiftWolf(), ShapeshiftWolf(), ShapeshiftWolf(),
        CallLightning(), CallLightning(), CallLightning(),
        PrimalStrike(), PrimalStrike(),
        WildRush(), WildRush(),
    ];
}
