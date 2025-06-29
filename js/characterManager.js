import { getCharacters, setCharacters } from './storage.js';

const MAX_CHARACTERS = 5;

export function saveCharacter(character) { let characters = getCharacters();

// If editing existing character const index = characters.findIndex(c => c.name === character.name); if (index >= 0) { characters[index] = character; } else { if (characters.length >= MAX_CHARACTERS) { alert('You can only have up to 5 companions.'); return; } characters.push(character); }

setCharacters(characters); }

export function deleteCharacter(name) { let characters = getCharacters(); characters = characters.filter(c => c.name !== name); setCharacters(characters); }
