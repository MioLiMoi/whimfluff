// js/storage.js
const STORAGE_KEY = 'virtualCompanions';

export function getCharacters() { const data = localStorage.getItem(STORAGE_KEY); try { return data ? JSON.parse(data) : []; } catch (e) { console.error('Failed to parse character data:', e); return []; } }

export function setCharacters(characters) { localStorage.setItem(STORAGE_KEY, JSON.stringify(characters)); }

export function getCharacterByName(name) { const characters = getCharacters(); return characters.find(c => c.name === name); }

export function updateCharacterState(name, updateFn) { const characters = getCharacters(); const index = characters.findIndex(c => c.name === name); if (index !== -1) { updateFn(characters[index]); setCharacters(characters); } }
