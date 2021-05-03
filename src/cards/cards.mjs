import { DMCard } from "../DMcards.mjs";
export * from "./druid.mjs";
export * from "./ranger.mjs";
export * from "./barbarian.mjs";
export * from "./paladin.mjs";
export * from "./wizard.mjs";
export * from "./rogue.mjs";
export * from "./gelcube.mjs";
export * from "./tentaculous.mjs";

export const allCardsCounter = 0;
export const allCards = [];

export function addToAllCards(card) {
    // God I hope no one data races here...
    card.indexInAllCards = allCards.length;
    allCards.push(card);
}

// // a dummy card for AI calculation: dummy cards replace drawn cards
// export function DummyCard() {
//     return new DMCard("Dummy Card", 0, 0, 0, 0, 0, [], false);
// }
