document.getElementById("themeSelect").addEventListener("change", e => {
    currentTheme = e.target.value;
    applyTheme();
});

function applyTheme() {
    document.body.classList.remove("theme-dark", "theme-light");
    if (currentTheme === "dark") {
        document.body.classList.add("theme-dark");
    } else if (currentTheme === "light") {
        document.body.classList.add("theme-light");
    }
}

const categories = {
  Fish: ["Barracuda","Pufferfish","Clownfish","Swordfish","Sardine","Salmon",
         "Anglerfish","Butterflyfish","Surgeonfish","Lionfish","Parrotfish"],
  Sharks: ["Hammerhead","Great White","Tiger","Bull","Nurse",
           "Whale","Zebra","Basking","Mako","Thresher","Angel"],
  Mammals: ["Dolphin","Humpback Whale","Orca","Seal","Sea Lion","Beluga",
            "Narwhal","Manatee","Walrus","Penguin","Otter"],
  Shellfish: ["Shrimp","Crab","Lobster","Crawfish","Oyster","Abalone",
              "Mussel","Barnacle","Scallop","Clam","Sea Urchin"],
  Mystery: ["Sea Turtle","Sea Crocodile","Jellyfish","Octopus","Sting Ray",
            "Blobfish","Sea Bunny","Squid","Star Fish","Sea Snake","Sea Pig"]
};

const sharkImages = [
  "", "1.png", "2.png", "3.png", "4.png", "5.png", "6.png"
];

let chosenCategory = "";
let word = "";
let hiddenWord = [];
let wrongGuesses = 0;
let preloadedImages = [];

let soundOn = true;
let musicOn = true;
let currentTheme = "default";
let currentBackground = "background.jpg";

let bgMusic = new Audio("music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;

let intenseMusic = new Audio("Jaws-theme-song.mp3");
intenseMusic.loop = true;
intenseMusic.volume = 0.4;

let currentMusic = bgMusic;

document.addEventListener("DOMContentLoaded", () => {
  preloadImages();
  createMenuButtons();
  setupNavigation();
});

//

function preloadImages() {
    const assets = [...sharkImages,
        "7.png", "background.jpg", "background2.jpg", "background3.jpeg"
    ];
    const uniqueAssets = [...new Set(assets)].filter(src => src.length > 0);
    
    console.log(`[System] Preloading ${uniqueAssets.length} unique assets for faster gameplay...`);

    uniqueAssets.forEach(src => {
      const img = new Image();
        img.src = src;
        preloadedImages.push(img);
    });
}

function createMenuButtons() {
  const catDiv = document.getElementById("category-buttons");
  catDiv.innerHTML = "";

  Object.keys(categories).forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "category-btn";
    btn.addEventListener("click", () => startGame(cat));
    catDiv.appendChild(btn);
  });
}

function setupNavigation() {
  const pages = ["main-menu","categories","settings","about","game"];

  function showPage(pageId) {
    pages.forEach(id => {
      document.getElementById(id).style.display = id === pageId ? "flex" : "none";
    });
  }

  document.getElementById("playBtn").onclick = () => showPage("categories");
  document.getElementById("settingsBtn").onclick = () => showPage("settings");
  document.getElementById("aboutBtn").onclick = () => showPage("about");

  document.getElementById("backToMain1").onclick =
  document.getElementById("backToMain2").onclick =
  document.getElementById("backToMain3").onclick = () => showPage("main-menu");

  document.getElementById("randomBtn").onclick = () => {
    const allCategories = Object.keys(categories);
    const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
    startGame(randomCategory);
  };

  document.getElementById("backToMenu").onclick = () => {
    resetGame();
    showPage("categories");
  };

  document.getElementById("soundToggle").addEventListener("change", e => {
    soundOn = e.target.checked;
  });

  document.getElementById("musicToggle").addEventListener("change", e => {
    musicOn = e.target.checked;
    if (musicOn) currentMusic.play(); else currentMusic.pause();
  });

  document.getElementById("themeSelect").addEventListener("change", e => {
    currentTheme = e.target.value;
    applyTheme();
  });

  document.getElementById("backgroundSelect").addEventListener("change", e => {
    currentBackground = e.target.value;
    document.body.style.backgroundImage = `url('${currentBackground}')`;
  });
}

function startGame(cat) {
  const pages = ["main-menu","categories","settings","about","game"];
  pages.forEach(id => {
    document.getElementById(id).style.display = id === "game" ? "block" : "none";
  });

  chosenCategory = cat;
  document.getElementById("category-name").textContent = cat;

  const words = categories[cat];
  word = words[Math.floor(Math.random() * words.length)].toUpperCase();
  hiddenWord = Array.from(word).map(ch => (ch === " " ? " " : "_"));
  wrongGuesses = 0;

  const img = document.getElementById("stage");
  img.src = "";

  updateSharkStage();
  updateWordDisplay();
  createLetterButtons();

  document.getElementById("message").textContent = "";
  document.getElementById("end-controls").style.display = "none";

  switchMusic(bgMusic);
}

function updateWordDisplay() {
  document.getElementById("word").textContent = hiddenWord.join(" ");
}

function createLetterButtons() {
  const lettersDiv = document.getElementById("letters");
  lettersDiv.innerHTML = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let ch of alphabet) {
    const btn = document.createElement("button");
    btn.textContent = ch;
    btn.className = "letter-btn";
    btn.addEventListener("click", () => handleGuess(ch, btn));
    lettersDiv.appendChild(btn);
  }
}

function handleGuess(letter, btn) {
  btn.disabled = true;
  let correct = false;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      hiddenWord[i] = letter;
      correct = true;
    }
  }

  updateWordDisplay();

  if (!correct) {
    wrongGuesses++;
    updateSharkStage();
    if (soundOn) playSound("wrong");

    if (wrongGuesses === 3) {
            switchMusic(intenseMusic);
        }

    if (wrongGuesses >= sharkImages.length - 1) endGame(false);
  } else {
    if (soundOn) playSound("correct");
    if (!hiddenWord.includes("_")) endGame(true);
  }
}

function updateSharkStage() {
  const img = document.getElementById("stage");
  const src = sharkImages[wrongGuesses];
  if (src) {
    img.src = src;
    img.style.visibility = "visible";
  } else {
    img.style.visibility = "hidden";
  }
}

function endGame(won) {
  const msg = document.getElementById("message");
  const img = document.getElementById("stage");

  if (won) {
    msg.textContent = `🎉 You saved it! The word was: ${word}`;
    img.src = "7.png";
    img.style.visibility = "visible";
    if (soundOn) playSound("win");
    switchMusic(bgMusic);
  } else {
    msg.textContent = `💀 Game Over! The word was: ${word}`;
    if (soundOn) playSound("lose");
  }

  document.getElementById("letters").innerHTML = "";
  document.getElementById("end-controls").style.display = "flex";
}

function resetGame() {
  chosenCategory = "";
  word = "";
  hiddenWord = [];
  wrongGuesses = 0;
  document.getElementById("word").textContent = "";
  document.getElementById("letters").innerHTML = "";
  document.getElementById("message").textContent = "";
  document.getElementById("end-controls").style.display = "none";

  const img = document.getElementById("stage");
  img.src = "";
  img.style.visibility = "hidden";
}

function switchMusic(newTrack) {
    if (!musicOn) return;
    currentMusic.pause();    
    if (currentMusic === bgMusic) {
        intenseMusic.pause();
    } else {
        bgMusic.pause();
    }
    currentMusic = newTrack;
    currentMusic.currentTime = 0; 
    currentMusic.play().catch(error => {
        console.log("Autoplay blocked or playback failed:", error);
    });
}

document.getElementById("play-again").addEventListener("click", () => {
  startGame(chosenCategory);
});

document.getElementById("new-category").addEventListener("click", () => {
  resetGame();
  const pages = ["main-menu","categories","settings","about","game"];
  pages.forEach(id => {
    document.getElementById(id).style.display = id === "categories" ? "block" : "none";
  });
});

function playSound(type) {
  const sounds = {
    correct: "correct.mp3",
    wrong: "wrong.mp3",
    win: "win.mp3",
    lose: "lose.mp3"
  };
  const s = new Audio(sounds[type]);
  s.volume = 0.4;
  s.play();
}