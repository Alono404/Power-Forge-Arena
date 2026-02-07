const screens = {
  main: document.getElementById("screen-main"),
  powers: document.getElementById("screen-powers"),
  mode: document.getElementById("screen-mode"),
  online: document.getElementById("screen-online"),
  battle: document.getElementById("screen-battle"),
  win: document.getElementById("screen-win"),
  lose: document.getElementById("screen-lose"),
};

const playButton = document.getElementById("play-button");
const powersBack = document.getElementById("powers-back");
const powersNext = document.getElementById("powers-next");
const modeBack = document.getElementById("mode-back");
const modeAi = document.getElementById("mode-ai");
const modeOnline = document.getElementById("mode-online");
const onlineBack = document.getElementById("online-back");
const onlineConnect = document.getElementById("online-connect");
const onlineStart = document.getElementById("online-start");
const attackButton = document.getElementById("attack-button");
const winContinue = document.getElementById("win-continue");
const winRetry = document.getElementById("win-retry");
const loseContinue = document.getElementById("lose-continue");
const loseRetry = document.getElementById("lose-retry");

const powerGrid = document.getElementById("power-grid");
const playerPowerLabel = document.getElementById("player-power");
const enemyPowerLabel = document.getElementById("enemy-power");
const enemyNameLabel = document.getElementById("enemy-name");
const playerHpBar = document.getElementById("player-hp");
const enemyHpBar = document.getElementById("enemy-hp");
const battleLog = document.getElementById("battle-log");
const onlineStatus = document.getElementById("online-status");
const onlineQueue = document.getElementById("online-queue");
const onlineOpponent = document.getElementById("online-opponent");

const powers = [
  "Goku Ultra Instinct",
  "Naruto Nine-Tails Chakra",
  "Sasuke Rinnegan",
  "Luffy Gear Fifth",
  "Ichigo Bankai",
  "Gojo Limitless",
  "Tanjiro Sun Breathing",
  "Zenitsu Thunderclap",
  "Eren Founding Titan",
  "Levi Ackerman",
  "Saitama Serious Punch",
  "Mob Psychic Burst",
  "Deku One For All",
  "Todoroki Half-Cold Half-Hot",
  "Bakugo Explosion",
  "Killua Godspeed",
  "Gon Jajanken",
  "Hisoka Bungee Gum",
  "Kakashi Lightning Blade",
  "Madara Perfect Susanoo",
  "Zoro Three-Sword Style",
  "Sanji Ifrit Jambe",
  "Natsu Dragon Flame",
  "Gray Ice Make",
  "Erza Requip",
  "Meliodas Full Counter",
  "Escanor Sunshine",
  "Asta Anti-Magic",
  "Yuno Spirit Dive",
  "Shoto Blue Flames",
  "Rimuru Predator",
  "Alucard Crimson",
  "Lelouch Geass",
  "Kuroko Phantom Pass",
  "Jotaro Star Platinum",
  "Dio The World",
  "Edward Fullmetal Alchemy",
  "Roy Mustang Flame",
  "Kirito Dual Blades",
  "Asuna Flash",
  "Light Yagami Mind Games",
  "Spike Spiegel Gun Kata",
  "Inuyasha Tessaiga",
  "Yusuke Spirit Gun",
  "Hiei Dragon of the Darkness Flame",
];

const state = {
  selectedPower: null,
  mode: null,
  playerHp: 100,
  enemyHp: 100,
  enemyPower: null,
  enemyName: null,
  battleActive: false,
  onlineConnected: false,
  onlineOpponentReady: false,
};

const showScreen = (screen) => {
  Object.values(screens).forEach((section) => section.classList.remove("active"));
  screens[screen].classList.add("active");
};

const resetBattle = () => {
  state.playerHp = 100;
  state.enemyHp = 100;
  state.battleActive = true;
  updateHp();
  battleLog.innerHTML = "";
  attackButton.disabled = false;
};

const updateHp = () => {
  playerHpBar.style.width = `${state.playerHp}%`;
  enemyHpBar.style.width = `${state.enemyHp}%`;
};

const logMessage = (message) => {
  const entry = document.createElement("p");
  entry.textContent = message;
  battleLog.prepend(entry);
};

const pickEnemy = () => {
  const enemyPowers = powers.filter((power) => power !== state.selectedPower);
  state.enemyPower = enemyPowers[Math.floor(Math.random() * enemyPowers.length)];
  state.enemyName = state.mode === "online" ? "Online Rival" : "AI Opponent";
  enemyPowerLabel.textContent = state.enemyPower;
  enemyNameLabel.textContent = state.enemyName;
};

const startBattle = () => {
  playerPowerLabel.textContent = state.selectedPower;
  pickEnemy();
  resetBattle();
  showScreen("battle");
  logMessage(`${state.enemyName} enters the arena wielding ${state.enemyPower}!`);
  logMessage(`You ready ${state.selectedPower} and step forward.`);
};

const finishBattle = (playerWon) => {
  state.battleActive = false;
  attackButton.disabled = true;
  showScreen(playerWon ? "win" : "lose");
};

const performAttack = () => {
  if (!state.battleActive) return;

  const playerDamage = Math.floor(Math.random() * 18) + 8;
  state.enemyHp = Math.max(0, state.enemyHp - playerDamage);
  logMessage(`You strike with ${state.selectedPower} for ${playerDamage} damage.`);

  if (state.enemyHp === 0) {
    updateHp();
    finishBattle(true);
    return;
  }

  const enemyDamage = Math.floor(Math.random() * 16) + 6;
  state.playerHp = Math.max(0, state.playerHp - enemyDamage);
  logMessage(`${state.enemyName} counters for ${enemyDamage} damage.`);

  updateHp();

  if (state.playerHp === 0) {
    finishBattle(false);
  }
};

const resetOnlineState = () => {
  state.onlineConnected = false;
  state.onlineOpponentReady = false;
  onlineStatus.textContent = "Disconnected";
  onlineQueue.textContent = "0 players";
  onlineOpponent.textContent = "None yet";
  onlineStart.disabled = true;
  onlineConnect.disabled = false;
};

const simulateOnlineMatchmaking = () => {
  state.onlineConnected = true;
  onlineStatus.textContent = "Searching...";
  onlineQueue.textContent = `${Math.floor(Math.random() * 4) + 2} players`;
  onlineOpponent.textContent = "Finding rival...";
  onlineConnect.disabled = true;
  onlineStart.disabled = true;

  setTimeout(() => {
    state.onlineOpponentReady = true;
    onlineStatus.textContent = "Match found!";
    onlineQueue.textContent = "1 player";
    onlineOpponent.textContent = "Online Rival";
    onlineStart.disabled = false;
  }, 1200);
};

const buildPowerGrid = () => {
  powerGrid.innerHTML = "";
  powers.forEach((power) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "power-card";
    card.textContent = power;
    card.addEventListener("click", () => {
      state.selectedPower = power;
      document.querySelectorAll(".power-card").forEach((item) => {
        item.classList.toggle("selected", item.textContent === power);
      });
      powersNext.disabled = false;
    });
    powerGrid.appendChild(card);
  });
};

playButton.addEventListener("click", () => {
  showScreen("powers");
});

powersBack.addEventListener("click", () => {
  showScreen("main");
});

powersNext.addEventListener("click", () => {
  showScreen("mode");
});

modeBack.addEventListener("click", () => {
  showScreen("powers");
});

modeAi.addEventListener("click", () => {
  state.mode = "ai";
  startBattle();
});

modeOnline.addEventListener("click", () => {
  state.mode = "online";
  resetOnlineState();
  showScreen("online");
});

onlineBack.addEventListener("click", () => {
  showScreen("mode");
});

onlineConnect.addEventListener("click", simulateOnlineMatchmaking);

onlineStart.addEventListener("click", () => {
  if (!state.onlineOpponentReady) return;
  startBattle();
});

attackButton.addEventListener("click", performAttack);

winContinue.addEventListener("click", () => {
  showScreen("main");
});

loseContinue.addEventListener("click", () => {
  showScreen("main");
});

winRetry.addEventListener("click", () => {
  showScreen(state.mode === "online" ? "online" : "mode");
});

loseRetry.addEventListener("click", () => {
  showScreen(state.mode === "online" ? "online" : "mode");
});

buildPowerGrid();