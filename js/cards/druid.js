import DMCard from "../DMcards.mjs";
import {
    DruidFormePower,
    DruidShapeshiftWolf,
    DruidShapeshiftBear,
    DruidAnimalMultiattack,
    DruidFreeShapeshift,
} from "../powers/druid.js";

function Poochie() {
    return DMCard("Poochie").addShield(1).addDamage(1);
}
function TheEldestElk() {
    return DMCard("The Eldest Elk").addShield(3);
}
function ThornWhip() {
    return DMCard("Thorn Whip").addDamage(1).addActions(1);
}
function GiftOfSilvanus() {
    return DMCard("Gift of Silvanus")
        .addMightyPower(DruidFormePower(1))
        .addDamage(2);
}
function CommuneWNature() {
    return DMCard("Commune With Nature")
        .addDrawCards(2)
        .addMightyPower(DruidFreeShapeshift(1));
}
function DruidicBalance() {
    return DMCard("Druidic Balance").addHeal(1).addDrawCards(1).addDamage(1);
}
function QuickAsAFox() {
    return DMCard("Quick as a Fox").addActions(2);
}
function Bearnard() {
    return DMCard("Bearnard").addShield(1).addMightyPower(DruidFormePower(1));
}
function ShapeshiftBear() {
    return DMCard("Shapeshift: Bear")
        .addHeal(2)
        .addMightyPower(DruidShapeshiftBear(1));
}
function ShapeshiftWolf() {
    return DMCard("Shapeshift: Wolf")
        .addDamage(2)
        .addMightyPower(DruidShapeshiftWolf(1));
}
function CallLightning() {
    return DMCard("Call Lightning").addDamage(3);
}
function PrimalStrike() {
    return DMCard("Primal Strike")
        .addActions(1)
        .addMightyPower(DruidAnimalMultiattack(1));
}
function WildRush() {
    return DMCard("Wild Rush")
        .addDrawCards(2)
        .addMightyPower(DruidFormePower(1));
}
function ThornWhip() {
    return DMCard("Thorn Whip");
}
