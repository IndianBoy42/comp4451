export * from "./druid.mjs";
export * from "./ranger.mjs";
export * from "./barbarian.mjs";
export * from "./paladin.mjs";
export * from "./wizard.mjs";
export * from "./rogue.mjs";
export * from "./gelcube.mjs";

export const allCardsCounter = 0;
export const allCards = [];

export function addToAllCards(card) {
    // God I hope no one data races here...
    card.indexInAllCards = allCards.length;
    allCards.push(card);
}
