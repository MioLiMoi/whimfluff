import { getCharacterByName, updateCharacterState } from './storage.js';

let companion = null;
let chatLog = [];

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = 'YOUR_API_KEY';

function $(id) {
  return document.getElementById(id);
}

function init() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  companion = getCharacterByName(name);

  if (!companion) {
    alert('Character not found!');
    window.location.href = 'index.html';
    return;
  }

  const virtualAge = calculateAge(companion.createdAt);
  $('companion-name').textContent = `${companion.name} (age ${virtualAge})`;
  $('back-btn').addEventListener('click', () => window.location.href = 'index.html');
  $('send-btn').addEventListener('click', handleSend);

  chatLog = companion.chatLog || [];
  chatLog.forEach(msg => addMessage(msg.role === 'user' ? 'You' : companion.name, msg.content));
}

function calculateAge(createdAt) {
  if (!createdAt) return '?';
  const now = Date.now();
  const diffInDays = Math.floor((now - createdAt) / (1000 * 60 * 60 * 24));
  return diffInDays + 1;
}

function addMessage(sender, text) {
  const chatWindow = $('chat-window');
  const entry = document.createElement('div');
  entry.className = 'chat-entry';
  entry.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatWindow.appendChild(entry);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getAffectionChange(message) {
  const lower = message.toLowerCase();
  const negativeWords = ['bad', 'hate', 'stupid', 'ignore', 'annoy'];
  const negativeEmojis = ['😢', '😠', '💔', '🙄', '😡'];
  const positiveWords = ['love', 'cute', 'good', 'happy', 'sweet'];
  const positiveEmojis = ['😊', '🥰', '❤️', '😘', '😍'];

  let score = 0;

  negativeWords.forEach(word => { if (lower.includes(word)) score -= 1; });
  positiveWords.forEach(word => { if (lower.includes(word)) score += 1; });
  negativeEmojis.forEach(emo => { if (message.includes(emo)) score -= 1; });
  positiveEmojis.forEach(emo => { if (message.includes(emo)) score += 1; });

  return score;
}

async function handleSend() {
  const input = $('chat-input');
  const userMsg = input.value.trim();
  if (!userMsg) return;

  addMessage('You', userMsg);
  chatLog.push({ role: 'user', content: userMsg });
  input.value = '';

  const basePrompt = `You are ${companion.name}, a ${companion.mode === 'pet' ? 'caring pet-like companion' : 'creative roleplay character'}. ${companion.description} Speak warmly and emotionally.`;
  const messages = [
    { role: 'system', content: basePrompt },
    ...chatLog.slice(-6)
  ];

  const affectionDelta = getAffectionChange(userMsg);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openchat/openchat-3.5',
        messages: messages
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || '*snuggles you silently*';
    addMessage(companion.name, reply);
    chatLog.push({ role: 'assistant', content: reply });

    updateCharacterState(companion.name, (char) => {
      char.chatLog = chatLog;
      char.affection = Math.max(0, (char.affection || 0) + affectionDelta);
    });
  } catch (err) {
    console.error(err);
    addMessage(companion.name, 'Sorry, I had trouble responding just now...');
  }
}

init();
