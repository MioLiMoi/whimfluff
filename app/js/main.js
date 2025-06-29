import { loadCharacters, renderCharacterList, openEditor } from './ui.js';
import { saveCharacter, deleteCharacter } from './characterManager.js';

window.addEventListener('DOMContentLoaded', () => {
  loadCharacters();
  renderCharacterList();

  document.getElementById('add-character-btn').addEventListener('click', () => {
    openEditor();
  });

  document.getElementById('cancel-character-btn').addEventListener('click', () => {
    document.getElementById('character-editor').classList.add('hidden');
  });

  document.getElementById('save-character-btn').addEventListener('click', () => {
    const name = document.getElementById('char-name').value.trim();
    const mode = document.getElementById('char-mode').value;
    const description = document.getElementById('char-description').value.trim();
    if (name) {
      saveCharacter({ name, mode, description });
      document.getElementById('character-editor').classList.add('hidden');
      renderCharacterList();
    }
  });
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('✅ Service Worker registered!'))
    .catch(err => console.error('❌ Service Worker registration failed:', err));
}
