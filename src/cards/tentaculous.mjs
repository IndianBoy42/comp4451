import { DMCard } from "../DMcards.mjs";
import { uvFromGrid } from "../gfx.js";
import {
    TentaculousSwapHand,
    TentaculousStealCards,
    TentaculousAttackHand,
} from "../powers/tentaculous.mjs";
import { cardTexture3, cardTexture19 } from "./textures.js";

/**
 * Notes:
 * - done
 */

const backTex = async () => {
    return {
        texture: await cardTexture19,
        uvCoords: uvFromGrid(0, 1, 1),
    };
};
const frontTex = i => {
    return async () => {
        return {
            texture: await cardTexture3,
            uvCoords: uvFromGrid(i),
        };
    };
};

function IDInsinuation() {
    //x3
    return new DMCard("ID Insinuation")
        .addDamage(1)
        .addActions(1)
        .setFrontTexture(frontTex(0))
        .setBackTexture(backTex);
}

function Receptionist() {
    //x1
    return new DMCard("Receptionist")
        .addShield(1)
        .addDamage(1)
        .setFrontTexture(frontTex(1))
        .setBackTexture(backTex);
}

function JustANibble() {
    //x1
    return new DMCard("Just a Nibble")
        .addDrawCards(1)
        .addHeal(1)
        .addActions(1)
        .setFrontTexture(frontTex(2))
        .setBackTexture(backTex);
}

function EgoWhip() {
    //x2
    return new DMCard("Ego Whip")
        .addDamage(2)
        .setFrontTexture(frontTex(3))
        .setBackTexture(backTex);
}

function TellMeAboutYourMother() {
    //x2
    return new DMCard("Tell Me About Your Mother")
        .addMightyPower(new TentaculousStealCards())
        .setFrontTexture(frontTex(5))
        .setBackTexture(backTex);
}

function EnthralledThrall() {
    //x2
    return new DMCard("Entralled Thrall")
        .addShield(2)
        .setFrontTexture(frontTex(7))
        .setBackTexture(backTex);
}

function MindBlast() {
    //x2
    return new DMCard("Mind Blast")
        .addMightyPower(new TentaculousAttackHand())
        .setFrontTexture(frontTex(9))
        .setBackTexture(backTex);
}

function SipTea() {
    //x2
    return new DMCard("Sip Tea")
        .addHeal(2)
        .addDrawCards(1)
        .setFrontTexture(frontTex(13))
        .setBackTexture(backTex);
}

function SuperegoWhip() {
    //x2
    return new DMCard("Superego Whip")
        .addDamage(3)
        .setFrontTexture(frontTex(15))
        .setBackTexture(backTex);
}

function PuppetTherapy() {
    //x3
    return new DMCard("Puppet Therapy")
        .addShield(1)
        .addDamage(2)
        .setFrontTexture(frontTex(17))
        .setBackTexture(backTex);
}

function RelaxAfterWork() {
    //x1
    return new DMCard("RelaxAfterWork")
        .addDrawCards(3)
        .setFrontTexture(frontTex(20))
        .setBackTexture(backTex);
}

function DiagnosisEvil() {
    //x3
    return new DMCard("Diagnosis: Evil!")
        .addDrawCards(1)
        .addDamage(2)
        .setFrontTexture(frontTex(21))
        .setBackTexture(backTex);
}

function PhDInPsychology() {
    //x2
    return new DMCard("PhD in Psychology")
        .addActions(2)
        .setFrontTexture(frontTex(24))
        .setBackTexture(backTex);
}

function MindGames() {
    //x2
    return new DMCard("Mind Games")
        .addMightyPower(new TentaculousSwapHand())
        .setFrontTexture(frontTex(26))
        .setBackTexture(backTex);
}

export function getTentaculousDeck() {
    return [
        IDInsinuation(),
        IDInsinuation(),
        IDInsinuation(),
        Receptionist(),
        JustANibble(),
        EgoWhip(),
        EgoWhip(),
        TellMeAboutYourMother(),
        TellMeAboutYourMother(),
        EnthralledThrall(),
        EnthralledThrall(),
        MindBlast(),
        MindBlast(),
        SipTea(),
        SipTea(),
        SuperegoWhip(),
        SuperegoWhip(),
        PuppetTherapy(),
        PuppetTherapy(),
        PuppetTherapy(),
        RelaxAfterWork(),
        DiagnosisEvil(),
        DiagnosisEvil(),
        DiagnosisEvil(),
        PhDInPsychology(),
        PhDInPsychology(),
        MindGames(),
        MindGames(),
    ];
}
