import { Player } from './js/DMplayer.mjs';
import * as Characters from './js/characters/characters.mjs';

const p1 = new Player("Player1", new Characters.Wizard());

console.log(p1.name);
console.log(p1.character.name);