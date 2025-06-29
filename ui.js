// js/ui.js
import { getCharacters } from './storage.js'; import { deleteCharacter } from './characterManager.js';

export function loadCharacters() { // placeholder if extra setup needed in future }

export function renderCharacterList() { const container = document.getElementById('character-list'); container.innerHTML = ''; const characters = getCharacters();

if (characters.length === 0) { container.innerHTML = '<p>No companions yet. Click "Create New Companion" to start!</p>'; return; }

characters.forEach((char) => { const card = document.createElement('div'); card.className = 'character-card'; card.innerHTML = <h3>${char.name}</h3> <p><em>${char.mode === 'pet' ? 'Pet Mode' : 'Roleplay Mode'}</em></p> <p>${char.description}</p> <button onclick="window.location.href='character.html?name=${encodeURIComponent(char.name)}'">Chat</button> <button class="danger" data-name="${char.name}">Delete</button>; container.appendChild(card); });

container.querySelectorAll('.danger').forEach(btn => { btn.addEventListener('click', () => { const name = btn.getAttribute('data-name'); if (confirm(Delete ${name}?)) { deleteCharacter(name); renderCharacterList(); } }); }); }

export function openEditor(existing = null) { document.getElementById('character-editor').classList.remove('hidden'); document.getElementById('editor-title').textContent = existing ? 'Edit Companion' : 'Create a Companion'; document.getElementById('char-name').value = existing?.name || ''; document.getElementById('char-mode').value = existing?.mode || 'pet'; document.getElementById('char-description').value = existing?.description || ''; }
