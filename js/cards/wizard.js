import DMCard from "../DMcards.mjs";
import {
    WizardFireball,
    WizardStealShield,
    WizardSwapHP,
} from "../powers/wizard.js";

/**
 * Notes:
 * - done
 * - TODO: check powers
 */

function LightningBolt() { //x4
    return DMCard("Lightning Bolt").addDamage(3);
}
function BurningHands() { //x3
    return DMCard("Burning Hands").addDamage(2);
}
function MagicMissile() { //x3
    return DMCard("Magic Missile").addDamage(1).addActions(1);
}
function SpeedOfThought() { //x3
    return DMCard("Speed Of Thought").addActions(2);
}
function EvilSneer() { //x2
    return DMCard("Evil Sneer").addHeal(1).addActions(1);
}
function KnowledgeIsPower() { //x3
    return DMCard("Knowledge Is Power").addDrawCards(3);
}
function Shield() { //x2
    return DMCard("Shield").addShield(1).addDrawCards(1);
}
function Stoneskin() { //x1
    return DMCard("Stoneskin").addShield(2);
}
function MirrorImage() { //x1
    return DMCard("Mirror Image").addShield(3);
}
function Fireball() { //x2
    return DMCard("Fireball").addMightyPower(WizardFireball);
}
function Charm() { //x2
    return DMCard("Charm").addMightyPower(WizardStealShield);
}
function VampiricTouch() { //x2
    return DMCard("Vampiric Touch").addMightyPower(WizardSwapHP);
}

export function getWizardDeck() {
    return [
        LightningBolt(), LightningBolt(), LightningBolt(), LightningBolt(),
        BurningHands(), BurningHands(), BurningHands(),
        MagicMissile(), MagicMissile(), MagicMissile(),
        SpeedOfThought(), SpeedOfThought(), SpeedOfThought(),
        EvilSneer(), EvilSneer(),
        KnowledgeIsPower(), KnowledgeIsPower(), KnowledgeIsPower(),
        Shield(), Shield(),
        Stoneskin(),
        MirrorImage(),
        Fireball(), Fireball(),
        Charm(), Charm(),
        VampiricTouch(), VampiricTouch(),
    ];
}

