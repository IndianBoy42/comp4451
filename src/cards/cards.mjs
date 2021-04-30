export * from "./druid.mjs";
export * from "./ranger.mjs";
export * from "./barbarian.mjs";
export * from "./paladin.mjs";
export * from "./wizard.mjs";
export * from "./rogue.mjs";
export * from "./gelcube.mjs";

import { DMCard } from "../DMcards.mjs";
// a dummy card for AI calculation: dummy cards replace drawn cards
export function DummyCard() {
    return new DMCard("Dummy Card");
}
