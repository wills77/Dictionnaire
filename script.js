/* Base de données (Dictionnaire) */
const dictionary = [
    { word: "apple", translation: "pomme", type: "nom", example: "He ate a crisp red apple." },
    { word: "book", translation: "livre", type: "nom", example: "I am reading a fascinating book." },
    { word: "car", translation: "voiture", type: "nom", example: "She drives a fast car." },
    { word: "dog", translation: "chien", type: "nom", example: "The dog barked loudly at the mailman." },
    { word: "eat", translation: "manger", type: "verbe", example: "We usually eat dinner at seven." },
    { word: "friend", translation: "ami", type: "nom", example: "A good friend helps you in need." },
    { word: "good", translation: "bon / bien", type: "adjectif", example: "It was a good movie." },
    { word: "house", translation: "maison", type: "nom", example: "They bought a new house in the suburbs." },
    { word: "internet", translation: "internet", type: "nom", example: "The internet connects people worldwide." },
    { word: "jump", translation: "sauter", type: "verbe", example: "The cat can jump very high." },
    { word: "knowledge", translation: "connaissance", type: "nom", example: "Knowledge is power." },
    { word: "love", translation: "aimer / amour", type: "verbe / nom", example: "I love learning new languages." },
    { word: "mouse", translation: "souris", type: "nom", example: "The computer mouse is broken." },
    { word: "night", translation: "nuit", type: "nom", example: "The stars shine bright at night." },
    { word: "open", translation: "ouvrir", type: "verbe", example: "Please open the window." },
    { word: "people", translation: "gens / peuple", type: "nom", example: "Many people visited the museum." },
    { word: "question", translation: "question", type: "nom", example: "Can I ask you a question?" },
    { word: "run", translation: "courir", type: "verbe", example: "I run three miles every morning." },
    { word: "school", translation: "école", type: "nom", example: "Kids go to school to learn." },
    { word: "teacher", translation: "professeur", type: "nom", example: "The teacher explained the lesson clearly." },
    { word: "understand", translation: "comprendre", type: "verbe", example: "Do you understand what I mean?" },
    { word: "very", translation: "très", type: "adverbe", example: "It is very cold outside." },
    { word: "water", translation: "eau", type: "nom", example: "Drink plenty of water every day." },
    { word: "xylophone", translation: "xylophone", type: "nom", example: "She plays the xylophone in the band." },
    { word: "yellow", translation: "jaune", type: "adjectif", example: "The sun is yellow and bright." },
    { word: "zebra", translation: "zèbre", type: "nom", example: "The zebra has black and white stripes." }
];

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('result-container');
const themeToggle = document.getElementById('theme-toggle');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');
const suggestionsBox = document.getElementById('suggestions');

// Constants
const HISTORY_KEY = 'mini_dico_history';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    loadTheme();
    // Pre-load voices if possible (some browsers load asynchronously)
    window.speechSynthesis.getVoices();
    dictionary.sort((a, b) => a.word.localeCompare(b.word));
});

// Search Logic
function performSearch(query = '') {
    const rawQuery = query || searchInput.value;
    const cleanQuery = rawQuery.trim().toLowerCase();

    if (!cleanQuery) return;

    // Update input to reflect what is being searched (useful if clicked from history)
    searchInput.value = rawQuery;
    suggestionsBox.classList.add('hidden'); // hide suggestions

    // Check for exact English match or partial French match
    const match = dictionary.find(item =>
        item.word.toLowerCase() === cleanQuery ||
        item.translation.toLowerCase().includes(cleanQuery)
    );

    if (match) {
        // If searched by French, maybe we want to highlight that? 
        // For now, just showing the result is sufficient.
        displayResult(match);
        // Save the *English* word to history for consistency
        addToHistory(match.word);
    } else {
        displayNotFound(rawQuery);
    }
}

// Display Functions
function displayResult(item) {
    resultContainer.classList.remove('hidden');

    // Animate container re-entry
    resultContainer.style.animation = 'none';
    resultContainer.offsetHeight; // trigger reflow
    resultContainer.style.animation = 'slideUp 0.4s ease-out';

    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <div class="result-header-left">
                    <span class="word-en">${capitalize(item.word)}</span>
                    <button class="speak-btn" onclick="speakWord('${item.word}')" title="Écouter la prononciation">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                </div>
                <span class="grammar-type">${item.type}</span>
            </div>
            
            <div class="definition-group">
                <span class="label">Traduction Français</span>
                <div class="word-fr">${capitalize(item.translation)}</div>
            </div>

            <div class="example-box">
                <span class="label">Exemple</span>
                <p class="sentence">"${item.example}"</p>
            </div>
        </div>
    `;
}

function speakWord(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set to English
        utterance.rate = 0.9; // Slightly slower for clarity
        window.speechSynthesis.speak(utterance);
    } else {
        alert("La synthèse vocale n'est pas supportée par votre navigateur.");
    }
}

// Make speakWord global so it works in onclick
window.speakWord = speakWord;

function displayNotFound(query) {
    resultContainer.classList.remove('hidden');
    resultContainer.innerHTML = `
        <div class="not-found">
            <div class="error-icon">¯\\_(ツ)_/¯</div>
            <p>Désolé, le mot <strong>"${query}"</strong> n'a pas été trouvé dans notre mini base de données.</p>
            <p style="margin-top:0.5rem; font-size:0.8rem; color: var(--text-light)">Essayez avec "apple", "school", ou "love".</p>
        </div>
    `;
}

// History Functions
function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    renderHistory(history);
}

function addToHistory(word) {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    // Remove if exists to move to top
    history = history.filter(w => w !== word);
    // Add to front
    history.unshift(word);
    // Limit to 10
    if (history.length > 10) history.pop();

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory(history);
}

function renderHistory(history) {
    historyList.innerHTML = '';
    if (history.length === 0) {
        historyList.innerHTML = '<li style="color:var(--text-light); font-size:0.9rem;">Aucune recherche récente.</li>';
        return;
    }

    history.forEach(word => {
        const li = document.createElement('li');
        li.className = 'history-tag';
        li.textContent = word;
        li.onclick = () => performSearch(word);
        historyList.appendChild(li);
    });
}

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory([]);
});

// Auto-Suggestions
searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();

    if (val.length < 1) {
        suggestionsBox.classList.add('hidden');
        return;
    }

    const matches = dictionary
        .filter(item => item.word.toLowerCase().startsWith(val))
        .slice(0, 5); // Limit to 5 suggestions

    if (matches.length > 0) {
        suggestionsBox.innerHTML = matches.map(m =>
            `<div class="suggestion-item" onclick="selectSuggestion('${m.word}')">${m.word}</div>`
        ).join('');
        suggestionsBox.classList.remove('hidden');
    } else {
        suggestionsBox.classList.add('hidden');
    }
});

// Need to attach to window so onclick in HTML string works
window.selectSuggestion = (word) => {
    searchInput.value = word;
    suggestionsBox.classList.add('hidden');
    performSearch(word);
};

// Event Listeners
searchBtn.addEventListener('click', () => performSearch());

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

// Theme Management
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    setTheme(theme);
}

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Utility
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Close suggestions on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        suggestionsBox.classList.add('hidden');
    }
});
