const GAME_DURATION = 180;
const CASTLE_DISTANCE = 9200;
const FINAL_DISTANCE = 3200;
const GROUND_Y = 580;
const GRAVITY = 2100;
const JUMP_SPEED = -860;
const BASE_SCROLL_SPEED = 280;
const ABILITY_DURATION = 5;
const ABILITY_COOLDOWN = 10;
const INITIAL_DANGER = 14;
const PASSIVE_DANGER_RISE = 4.6;
const FINAL_RUN_DANGER_RISE = 6.1;
const OBSTACLE_DANGER_PENALTY = 4;
const PROTECTED_DANGER_RECOVERY = 9.5;
const FROZEN_DRAGON_DANGER_RECOVERY = 7.5;
const WIZARD_FLIGHT_HEIGHT = 132;
const FINAL_RUN_GRACE_TIME = 4;
const FINAL_RUN_START_DANGER = 10;

const obstacleTypes = {
  log: { label: "Tronco", w: 92, h: 48, kind: "log", color: "#855636" },
  thorns: { label: "Zarzas", w: 96, h: 52, kind: "thorns", color: "#407938" },
  gap: { label: "Hueco", w: 110, h: 30, kind: "gap", color: "#4f3d30" },
  chicken: { label: "Gallina", w: 62, h: 52, kind: "chicken", color: "#f2f1dd" },
};

const questions = [
  { prompt: "Mago Manuel mezcla 3 estrellas y 2 lunas. ¿Cuántas luces hay?", answers: ["5", "4", "6"], correct: 0 },
  { prompt: "Para despertar el bosque, ¿qué necesita una semilla?", answers: ["Zapato", "Agua", "Piedra"], correct: 1 },
  { prompt: "Dragon Gata ruge: miau, miau. ¿Qué animal hace ese sonido?", answers: ["Pez", "Gato", "Caballo"], correct: 1 },
  { prompt: "Sir Valentin tiene 4 llaves y encuentra 1 más. ¿Cuántas tiene?", answers: ["3", "5", "6"], correct: 1 },
  { prompt: "¿Qué palabra empieza como Manuel?", answers: ["Sol", "Montaña", "Tren"], correct: 1 },
  { prompt: "El escudo naranja brilla en el cielo. ¿Qué es naranja?", answers: ["Nieve", "Mandarina", "Carbón"], correct: 1 },
  { prompt: "Princesa Mimi busca una rima para castillo. ¿Cuál sirve?", answers: ["árbol", "pan", "brillo"], correct: 2 },
  { prompt: "Para cruzar el río, ¿qué animal nada mejor?", answers: ["Gallina", "Conejo", "Pez"], correct: 2 },
  { prompt: "Si hay 10 monedas y usas 4, ¿cuántas quedan?", answers: ["7", "6", "5"], correct: 1 },
  { prompt: "¿Cuál de estas letras es una vocal mágica?", answers: ["P", "A", "T"], correct: 1 },
  { prompt: "Mago Manuel pide la palabra más larga. ¿Cuál es?", answers: ["sol", "mariposa", "pan"], correct: 1 },
  { prompt: "Dragon Gata deja 8 huellas. Si borra 3, ¿cuántas quedan?", answers: ["5", "4", "6"], correct: 0 },
  { prompt: "¿Qué se usa para leer un cuento antes de dormir?", answers: ["Cuchara", "Nube", "Libro"], correct: 2 },
  { prompt: "¿Cuál animal tiene trompa para saludar?", answers: ["Elefante", "Gallo", "Rana"], correct: 0 },
  { prompt: "El castillo tiene una bandera azul. ¿Cuál es un color?", answers: ["Mesa", "Azul", "Sopa"], correct: 1 },
  { prompt: "¿Qué número viene después del 6 en el camino?", answers: ["5", "7", "8"], correct: 1 },
  { prompt: "Mimi guarda 2 coronas y recibe 2 más. ¿Cuántas tiene?", answers: ["4", "3", "5"], correct: 0 },
  { prompt: "¿Qué fruta puede llevar un picnic real?", answers: ["Piedra", "Manzana", "Silla"], correct: 1 },
  { prompt: "Para volar con el bastón, Manuel mira hacia...", answers: ["abajo", "arriba", "atrás"], correct: 1 },
  { prompt: "¿Qué palabra empieza con la misma letra que princesa?", answers: ["puerta", "luna", "gato"], correct: 0 },
];

const state = {
  screen: "title",
  gamePhase: "running",
  timeLeft: GAME_DURATION,
  worldDistance: 0,
  finalDistance: 0,
  currentZone: "brightForest",
  danger: INITIAL_DANGER,
  lives: 1,
  keys: 0,
  knightSkin: "classic",
  princessSkin: "classic",
  dragonSkin: "classic",
  abilityRemaining: 0,
  abilityCooldown: 0,
  activeAbility: null,
  dragonFrozenTimer: 0,
  crownProjectile: null,
  coinFlipUsed: false,
  hideAvailable: false,
  nearTree: false,
  hidden: false,
  hideTimer: 0,
  storyTimer: 0,
  castleTimer: 0,
  toastTimer: 0,
  subtitleTimer: 0,
  finalRunGraceTimer: 0,
  currentQuestionIndex: 0,
  quizMissingKeys: 0,
  activeQuestions: [],
  sparkles: [],
  obstacles: [],
  trees: [],
  keysOnField: [],
  spawnedKeys: 0,
  skyOffset: 0,
  animClock: 0,
  player: {
    x: 250,
    y: GROUND_Y,
    vy: 0,
    w: 58,
    h: 92,
    onGround: true,
    slowTimer: 0,
    speech: "",
  },
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const titleArtCanvas = document.getElementById("title-art-canvas");
const titleArtCtx = titleArtCanvas.getContext("2d");
titleArtCtx.imageSmoothingEnabled = false;
const wizardArtCanvas = document.getElementById("wizard-art-canvas");
const wizardArtCtx = wizardArtCanvas.getContext("2d");
wizardArtCtx.imageSmoothingEnabled = false;
const quizWizardArtCanvas = document.getElementById("quiz-wizard-art-canvas");
const quizWizardArtCtx = quizWizardArtCanvas.getContext("2d");
quizWizardArtCtx.imageSmoothingEnabled = false;
const winArtCanvas = document.getElementById("win-art-canvas");
const winArtCtx = winArtCanvas.getContext("2d");
winArtCtx.imageSmoothingEnabled = false;

const screens = {
  title: document.getElementById("screen-title"),
  story: document.getElementById("screen-story"),
  game: document.getElementById("screen-game"),
  castle: document.getElementById("screen-castle"),
  quiz: document.getElementById("screen-quiz"),
  gameover: document.getElementById("screen-gameover"),
  win: document.getElementById("screen-win"),
};

const labels = {
  lives: document.getElementById("lives-label"),
  keys: document.getElementById("keys-label"),
  time: document.getElementById("time-label"),
  phase: document.getElementById("phase-label"),
  danger: document.getElementById("danger-fill"),
  toast: document.getElementById("toast"),
  subtitle: document.getElementById("subtitle"),
  continueTextInline: document.getElementById("continue-text-inline"),
  castleCopy: document.getElementById("castle-scene-copy"),
  castleActions: document.getElementById("castle-actions"),
  quizProgress: document.getElementById("quiz-progress"),
  quizQuestion: document.getElementById("quiz-question"),
  quizAnswers: document.getElementById("quiz-answers"),
  valentinSkin: document.getElementById("valentin-skin-label"),
  mimiSkin: document.getElementById("mimi-skin-label"),
  dragonSkin: document.getElementById("dragon-skin-label"),
  debugState: document.getElementById("debug-state"),
  titleHeading: document.getElementById("title-heading"),
  titleLead: document.getElementById("title-lead"),
  titleCaption: document.getElementById("title-caption"),
  storyHeading: document.getElementById("story-heading"),
  storyCopy: document.getElementById("story-copy"),
  dangerName: document.getElementById("danger-name"),
  quizLine: document.getElementById("quiz-line"),
  gameoverCopy: document.getElementById("gameover-copy"),
  winHeading: document.getElementById("win-heading"),
  winCopy: document.getElementById("win-copy"),
};

const buttons = {
  play: document.getElementById("play-button"),
  valentinSkin: document.getElementById("valentin-skin-button"),
  mimiSkin: document.getElementById("mimi-skin-button"),
  dragonSkin: document.getElementById("dragon-skin-button"),
  jump: document.getElementById("jump-button"),
  hide: document.getElementById("hide-button"),
  speed: document.getElementById("speed-button"),
  coin: document.getElementById("coin-button"),
  backTitle: document.getElementById("back-title-button"),
  playAgain: document.getElementById("play-again-button"),
  debugToggle: document.getElementById("debug-toggle-button"),
};

const zoneLabels = {
  brightForest: "Bosque brillante",
  darkForest: "Bosque oscuro",
  torchRoad: "Camino de antorchas",
  finalRun: "Huida a la aldea",
};

let lastTime = performance.now();
let audioEnabled = false;
let continueTextTimeoutId = null;
let debugCollapsed = false;
let lastDebugError = "";

function ensureAudio() {
  audioEnabled = true;
}

function playSfx(_name) {
  if (!audioEnabled) {
    return;
  }
}

buttons.play.addEventListener("click", startStory);
buttons.valentinSkin.addEventListener("click", cycleKnightSkin);
buttons.mimiSkin.addEventListener("click", cyclePrincessSkin);
buttons.dragonSkin.addEventListener("click", cycleDragonSkin);
buttons.backTitle.addEventListener("click", () => setScreen("title"));
buttons.playAgain.addEventListener("click", startStory);
buttons.jump.addEventListener("click", jump);
buttons.hide.addEventListener("click", hide);
buttons.speed.addEventListener("click", activateAbility);
buttons.coin.addEventListener("click", activateCoinFlip);
buttons.debugToggle.addEventListener("click", toggleDebugPanel);

window.addEventListener("keydown", (event) => {
  if (state.screen !== "game") {
    return;
  }

  if (event.code === "ArrowUp") {
    event.preventDefault();
    jump();
  } else if (event.code === "ArrowDown") {
    event.preventDefault();
    hide();
  } else if (event.code === "ArrowRight") {
    event.preventDefault();
    activateCoinFlip();
  } else if (event.code === "ArrowLeft") {
    event.preventDefault();
    activateAbility();
  }
});

window.addEventListener("error", (event) => {
  const message = event?.message || "Error desconocido";
  const source = event?.filename ? event.filename.split("/").pop() : "archivo";
  lastDebugError = `${message} @ ${source}:${event?.lineno || 0}`;
});

window.addEventListener("unhandledrejection", (event) => {
  lastDebugError = `Promise rechazada: ${String(event.reason)}`;
});

function setScreen(name) {
  state.screen = name;
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("screen-active", key === name);
  });
  debugLog(`Pantalla -> ${name}`);
}

function debugLog(message) {
  lastDebugError = message;
}

function toggleDebugPanel() {
  debugCollapsed = !debugCollapsed;
  document.getElementById("debug-panel").classList.toggle("debug-panel-collapsed", debugCollapsed);
  buttons.debugToggle.textContent = debugCollapsed ? "Mostrar debug" : "Ocultar debug";
}

function updateDebugPanel(dt) {
  if (!labels.debugState) {
    return;
  }

  const lines = [
    `screen: ${state.screen}`,
    `fase: ${state.gamePhase}`,
    `zona: ${state.currentZone}`,
    `dt: ${dt.toFixed(4)}`,
    `tiempo: ${state.timeLeft.toFixed(2)}`,
    `danger: ${state.danger.toFixed(2)}`,
    `worldDistance: ${state.worldDistance.toFixed(1)}/${CASTLE_DISTANCE}`,
    `finalDistance: ${state.finalDistance.toFixed(1)}/${FINAL_DISTANCE}`,
    `obstacles: ${state.obstacles.length}`,
    `trees: ${state.trees.length}`,
    `keysOnField: ${state.keysOnField.length}`,
    `hidden: ${state.hidden} nearTree: ${state.nearTree}`,
    `ability: ${state.activeAbility || "none"} ${state.abilityRemaining.toFixed(2)} cooldown: ${state.abilityCooldown.toFixed(2)}`,
    `dragonFrozen: ${state.dragonFrozenTimer.toFixed(2)}`,
    `error: ${lastDebugError || "ninguno"}`,
  ];

  labels.debugState.textContent = lines.join("\n");
}

function currentPrincessSkinLabel() {
  if (state.princessSkin === "classic") {
    return "Princesa Mimi";
  }
  if (state.princessSkin === "sky") {
    return "Mimi del cielo";
  }
  return "Mimi caballera";
}

function currentKnightSkinLabel() {
  if (state.knightSkin === "classic") {
    return "Sir Valentin";
  }
  if (state.knightSkin === "mimi") {
    return "Princesa Mimi";
  }
  return "Mago Manuel";
}

function currentDragonSkinLabel() {
  return state.dragonSkin === "classic" ? "Dragon Gata" : "Dragon Tigre";
}

function heroName() {
  return currentKnightSkinLabel();
}

function rescuedName() {
  return currentPrincessSkinLabel();
}

function dragonName() {
  return currentDragonSkinLabel();
}

function currentHeroAbility() {
  if (state.knightSkin === "mimi") {
    return {
      key: "mimiCrown",
      icon: "←",
      buttonLabel: "Corona",
      activeLabel: "Corona",
      description: `${heroName()} lanza su corona y deja a ${dragonName()} sin moverse durante 5 segundos.`,
    };
  }

  if (state.knightSkin === "wizard") {
    return {
      key: "wizardFlight",
      icon: "←",
      buttonLabel: "Volar",
      activeLabel: "Volando",
      description: `${heroName()} vuela con su baston y se protege con magia naranja durante 5 segundos.`,
    };
  }

  return {
    key: "valentinShield",
    icon: "←",
    buttonLabel: "Escudo",
    activeLabel: "Escudo",
    description: `${heroName()} usa su escudo y se vuelve inmortal durante 5 segundos.`,
  };
}

function isAbilityActive(key) {
  return state.activeAbility === key && state.abilityRemaining > 0;
}

function isProtectedByAbility() {
  return isAbilityActive("valentinShield") || isAbilityActive("wizardFlight");
}

function isDragonFrozen() {
  return state.dragonFrozenTimer > 0;
}

function clearAbilityState(clearCooldown = true) {
  state.abilityRemaining = 0;
  state.activeAbility = null;
  state.dragonFrozenTimer = 0;
  state.crownProjectile = null;
  if (clearCooldown) {
    state.abilityCooldown = 0;
  }
}

function finishAbility(startCooldown = true) {
  const hadActiveAbility = Boolean(state.activeAbility);
  state.abilityRemaining = 0;
  state.activeAbility = null;
  state.crownProjectile = null;
  if (startCooldown && hadActiveAbility) {
    state.abilityCooldown = ABILITY_COOLDOWN;
  }
}

function updateNarrativeText() {
  const hero = heroName();
  const rescued = rescuedName();
  const dragon = dragonName();

  document.title = `Las aventuras de ${hero}`;
  if (labels.titleHeading) {
    labels.titleHeading.textContent = `Las aventuras de ${hero}`;
  }
  if (labels.titleLead) {
    labels.titleLead.textContent = `${hero} debe correr hasta el castillo, reunir llaves doradas, rescatar a ${rescued} y escapar de ${dragon} hasta la aldea segura.`;
  }
  if (labels.titleCaption) {
    labels.titleCaption.textContent = `${hero} corre hacia el castillo mientras ${dragon} acecha.`;
  }
  if (labels.storyHeading) {
    labels.storyHeading.textContent = `¡${hero}, corre!`;
  }
  if (labels.storyCopy) {
    labels.storyCopy.textContent = `${hero} ve el castillo a lo lejos y empieza la persecución para salvar a ${rescued}.`;
  }
  if (labels.dangerName) {
    labels.dangerName.textContent = dragon;
  }
  if (labels.quizLine) {
    labels.quizLine.textContent = `¡Resuelve mis acertijos, ${hero}!`;
  }
  if (labels.gameoverCopy) {
    labels.gameoverCopy.textContent = `${dragon} atrapó a ${hero} antes de que pudiera completar su misión.`;
  }
  if (labels.winHeading) {
    labels.winHeading.textContent = `¡Salvaste a ${rescued}!`;
  }
  if (labels.winCopy) {
    labels.winCopy.textContent = `${hero} y ${rescued} llegaron a la puerta de la aldea mientras ${dragon} huía.`;
  }
}

function updateKnightSkinLabel() {
  if (labels.valentinSkin) {
    labels.valentinSkin.textContent = currentKnightSkinLabel();
  }
}

function updatePrincessSkinLabel() {
  if (labels.mimiSkin) {
    labels.mimiSkin.textContent = currentPrincessSkinLabel();
  }
}

function updateDragonSkinLabel() {
  if (labels.dragonSkin) {
    labels.dragonSkin.textContent = currentDragonSkinLabel();
  }
}

function cycleKnightSkin() {
  if (state.knightSkin === "classic") {
    state.knightSkin = "mimi";
  } else if (state.knightSkin === "mimi") {
    state.knightSkin = "wizard";
  } else {
    state.knightSkin = "classic";
  }
  updateKnightSkinLabel();
  updateNarrativeText();
  updateAbilityButton();
  ensureAudio();
  playSfx("wizard");
}

function cyclePrincessSkin() {
  if (state.princessSkin === "classic") {
    state.princessSkin = "sky";
  } else if (state.princessSkin === "sky") {
    state.princessSkin = "valentin";
  } else {
    state.princessSkin = "classic";
  }
  updatePrincessSkinLabel();
  updateNarrativeText();
  updateAbilityButton();
  ensureAudio();
  playSfx("wizard");
}

function cycleDragonSkin() {
  state.dragonSkin = state.dragonSkin === "classic" ? "tiger" : "classic";
  updateDragonSkinLabel();
  updateNarrativeText();
  updateAbilityButton();
  ensureAudio();
  playSfx("roar");
}

function resetRunState() {
  state.gamePhase = "running";
  state.timeLeft = GAME_DURATION;
  state.worldDistance = 0;
  state.finalDistance = 0;
  state.currentZone = "brightForest";
  state.danger = INITIAL_DANGER;
  state.keys = 0;
  clearAbilityState(true);
  state.coinFlipUsed = false;
  state.hideAvailable = false;
  state.nearTree = false;
  state.hidden = false;
  state.hideTimer = 0;
  state.storyTimer = 0;
  state.castleTimer = 0;
  state.toastTimer = 0;
  state.subtitleTimer = 0;
  state.continueTimer = 0;
  state.currentQuestionIndex = 0;
  state.quizMissingKeys = 0;
  state.activeQuestions = [];
  state.finalRunGraceTimer = 0;
  state.sparkles = [];
  state.obstacles = [];
  state.trees = [];
  state.keysOnField = [];
  state.spawnedKeys = 0;
  state.skyOffset = 0;
  state.animClock = 0;
  state.player.y = GROUND_Y;
  state.player.vy = 0;
  state.player.onGround = true;
  state.player.slowTimer = 0;
  state.player.speech = "";
  labels.toast.classList.add("hidden");
  labels.subtitle.classList.add("hidden");
  labels.continueTextInline.classList.add("continue-text-hidden");
  if (continueTextTimeoutId) {
    clearTimeout(continueTextTimeoutId);
    continueTextTimeoutId = null;
  }
}

function startStory() {
  resetRunState();
  setScreen("story");
  state.storyTimer = 2.2;
}

function startGame() {
  setScreen("game");
  showSubtitle(`${heroName()} ve el castillo y empieza la carrera.`);
}

function updateHud() {
  labels.lives.textContent = String(state.lives);
  labels.keys.textContent = `${state.keys}/3`;
  labels.time.textContent = Math.max(0, Math.ceil(state.timeLeft));
  labels.phase.textContent = zoneLabels[state.currentZone];
  labels.danger.style.width = `${Math.max(0, Math.min(100, state.danger))}%`;
}

function showToast(message, duration = 1.4) {
  labels.toast.textContent = message;
  labels.toast.classList.remove("hidden");
  state.toastTimer = duration;
}

function showSubtitle(message, duration = 2.4) {
  labels.subtitle.textContent = message;
  labels.subtitle.classList.remove("hidden");
  state.subtitleTimer = duration;
}

function spawnSparkles(x, y, count = 12) {
  for (let i = 0; i < count; i += 1) {
    state.sparkles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 220,
      vy: -Math.random() * 240,
      life: 0.7 + Math.random() * 0.6,
      size: 4 + Math.random() * 5,
      hue: Math.random() > 0.5 ? "#ffd45b" : "#fff1b8",
    });
  }
}

function jump() {
  if (state.screen !== "game" || state.hidden || !state.player.onGround) {
    return;
  }

  state.player.vy = JUMP_SPEED;
  state.player.onGround = false;
}

function hide() {
  const canHideDuringRun = state.gamePhase === "running" || state.gamePhase === "finalRun";
  if (state.screen !== "game" || !state.nearTree || state.hidden || !canHideDuringRun || state.abilityRemaining > 0) {
    return;
  }

  state.hidden = true;
  state.hideTimer = 1.8;
  state.hideAvailable = false;
  state.nearTree = false;
  state.danger = Math.max(0, state.danger - 12);
  showToast(`${heroName()} se esconde.`);
}

function launchCrownProjectile() {
  const target = getDragonFocusPoint();
  state.crownProjectile = {
    startX: state.player.x + 8,
    startY: state.player.y - 106,
    x: state.player.x + 8,
    y: state.player.y - 106,
    targetX: target.x,
    targetY: target.y,
    progress: 0,
    impact: false,
  };
}

function updateCrownProjectile(dt) {
  const crown = state.crownProjectile;
  if (!crown) {
    return;
  }

  const target = getDragonFocusPoint();
  crown.targetX = target.x;
  crown.targetY = target.y;

  if (!crown.impact) {
    crown.progress = Math.min(1, crown.progress + dt * 2.8);
    const eased = 1 - (1 - crown.progress) * (1 - crown.progress);
    crown.x = crown.startX + (crown.targetX - crown.startX) * eased;
    crown.y = crown.startY + (crown.targetY - crown.startY) * eased - Math.sin(eased * Math.PI) * 86;

    if (crown.progress >= 1) {
      crown.impact = true;
      spawnSparkles(crown.targetX, crown.targetY, 24);
    }
    return;
  }

  crown.x = crown.targetX;
  crown.y = crown.targetY;
}

function activateAbility() {
  if (state.screen !== "game" || state.hidden) {
    return;
  }

  if (state.abilityRemaining > 0 || state.abilityCooldown > 0) {
    return;
  }

  const ability = currentHeroAbility();
  state.activeAbility = ability.key;
  state.abilityRemaining = ABILITY_DURATION;

  if (ability.key === "valentinShield") {
    spawnSparkles(state.player.x, state.player.y - 62, 22);
    showToast(`${heroName()} levanta su escudo.`);
    showSubtitle("Inmortal durante 5 segundos.");
  } else if (ability.key === "mimiCrown") {
    state.dragonFrozenTimer = ABILITY_DURATION;
    launchCrownProjectile();
    showToast(`${heroName()} lanza su corona.`);
    showSubtitle(`${dragonName()} queda sin moverse durante 5 segundos.`);
  } else if (ability.key === "wizardFlight") {
    spawnSparkles(state.player.x, state.player.y - 72, 28);
    showToast(`${heroName()} empieza a volar.`);
    showSubtitle("Su escudo naranja lo protege durante 5 segundos.");
  }

  updateButtons();
}

function activateCoinFlip() {
  const canUseDuringRun = state.gamePhase === "running" || state.gamePhase === "finalRun";
  if (state.screen !== "game" || state.hidden || !canUseDuringRun || state.coinFlipUsed) {
    return;
  }

  state.coinFlipUsed = true;
  const dragonShift = 50;
  const gotLucky = Math.random() < 0.5;

  if (gotLucky) {
    state.danger = Math.max(0, state.danger - dragonShift);
    showSubtitle("Cara", 5);
    showToast(`La moneda ayuda: ${dragonName()} se aleja mucho.`);
  } else {
    state.danger = Math.min(100, state.danger + dragonShift);
    showSubtitle("Cruz", 5);
    showToast(`La moneda falla: ${dragonName()} avanza mucho.`);
  }

  updateHud();
  updateButtons();
}

function getScrollSpeed() {
  const base = isAbilityActive("wizardFlight") ? BASE_SCROLL_SPEED * 1.06 : BASE_SCROLL_SPEED;
  const slowFactor = state.player.slowTimer > 0 ? 0.72 : 1;
  const hiddenFactor = state.hidden ? 0.42 : 1;
  return base * slowFactor * hiddenFactor;
}

function chooseZone() {
  if (state.gamePhase === "finalRun") {
    return "finalRun";
  }

  const progress = state.worldDistance / CASTLE_DISTANCE;
  if (progress < 0.34) {
    return "brightForest";
  }
  if (progress < 0.72) {
    return "darkForest";
  }
  return "torchRoad";
}

function maybeSpawnObstacle(dt) {
  const interval = state.gamePhase === "finalRun"
    ? (state.finalRunGraceTimer > 0 ? 1.35 : 0.92)
    : 1.18;
  state._obstacleClock = (state._obstacleClock || 0) + dt;
  if (state._obstacleClock < interval) {
    return;
  }
  state._obstacleClock = 0;

  const zone = state.currentZone;
  let typeKey = "log";
  const roll = Math.random();

  if (zone === "brightForest") {
    typeKey = roll < 0.55 ? "log" : roll < 0.9 ? "chicken" : "thorns";
  } else if (zone === "darkForest") {
    typeKey = roll < 0.6 ? "thorns" : roll < 0.82 ? "log" : "chicken";
  } else if (zone === "torchRoad" || zone === "finalRun") {
    typeKey = roll < 0.5 ? "gap" : roll < 0.82 ? "log" : "thorns";
  }

  const type = obstacleTypes[typeKey];
  state.obstacles.push({
    ...type,
    x: canvas.width + 140,
    y: GROUND_Y - type.h,
    hit: false,
    speedPenalty: type.kind === "chicken" ? 0.9 : 1,
  });
}

function maybeSpawnTree(dt) {
  state._treeClock = (state._treeClock || 0) + dt;
  if (state._treeClock < 2.6) {
    return;
  }

  if (Math.random() < 0.54) {
    state._treeClock = 0;
    state.trees.push({
      x: canvas.width + 160,
      y: GROUND_Y - 168,
      passed: false,
    });
  }
}

function maybeSpawnKey(dt) {
  if (state.spawnedKeys >= 3 || state.gamePhase !== "running") {
    return;
  }

  state._keyClock = (state._keyClock || 0) + dt;
  if (state._keyClock < 3.2) {
    return;
  }

  if (Math.random() < 0.52) {
    state._keyClock = 0;
    const airborne = Math.random() < 0.45;
    state.spawnedKeys += 1;
    state.keysOnField.push({
      x: canvas.width + 200,
      y: airborne ? GROUND_Y - 120 : GROUND_Y - 48,
      w: 30,
      h: 30,
      taken: false,
    });
  }
}

function playerRect() {
  return {
    x: state.player.x - state.player.w / 2,
    y: state.player.y - state.player.h,
    w: state.player.w,
    h: state.player.h,
  };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function applySlowPenalty(multiplier = 1) {
  if (isProtectedByAbility()) {
    spawnSparkles(state.player.x, state.player.y - 56, 12);
    return "blocked";
  }

  state.player.slowTimer = Math.max(state.player.slowTimer, 0.8 * multiplier);
  if (!isDragonFrozen()) {
    state.danger = Math.min(100, state.danger + OBSTACLE_DANGER_PENALTY);
  }
  return isDragonFrozen() ? "slowedFrozenDragon" : "slowed";
}

function checkCollisions() {
  const rect = playerRect();

  for (const obstacle of state.obstacles) {
    if (obstacle.hit) {
      continue;
    }

    const bounds = { x: obstacle.x, y: obstacle.y, w: obstacle.w, h: obstacle.h };
    if (rectsOverlap(rect, bounds)) {
      obstacle.hit = true;
      const collisionResult = applySlowPenalty(obstacle.speedPenalty);

      if (collisionResult === "blocked") {
        showToast("El escudo aguanta el golpe.");
        continue;
      }

      if (obstacle.kind === "chicken") {
        showToast("La gallina se escapa cacareando.");
      } else if (obstacle.kind === "gap") {
        showToast(`${heroName()} tropieza en el borde.`);
      } else if (obstacle.kind === "thorns") {
        showToast("Las zarzas lo pinchan.");
      } else {
        showToast(`${heroName()} tropieza.`);
      }
    }
  }

  for (const key of state.keysOnField) {
    if (key.taken) {
      continue;
    }

    const bounds = { x: key.x, y: key.y, w: key.w, h: key.h };
    if (rectsOverlap(rect, bounds)) {
      key.taken = true;
      state.keys += 1;
      spawnSparkles(key.x + key.w / 2, key.y + key.h / 2, 16);
      showToast("Llave dorada conseguida.");

      if (state.keys === 3) {
        showSubtitle("Las tres llaves estan listas.");
        spawnSparkles(state.player.x, state.player.y - 80, 28);
      }
    }
  }
}

function updateWorld(dt) {
  if (state.screen === "story") {
    state.storyTimer -= dt;
    if (state.storyTimer <= 0) {
      startGame();
    }
    return;
  }

  if (state.screen !== "game") {
    return;
  }

  state.currentZone = chooseZone();
  const scrollSpeed = getScrollSpeed();
  state.animClock += dt * Math.max(1, scrollSpeed / 120);

  if (state.gamePhase === "running") {
    state.timeLeft -= dt;
    state.worldDistance += scrollSpeed * dt;
  } else if (state.gamePhase === "finalRun") {
    state.timeLeft -= dt;
    state.finalDistance += scrollSpeed * dt;
    if (state.finalRunGraceTimer > 0) {
      state.finalRunGraceTimer -= dt;
    }
  }

  state.skyOffset += scrollSpeed * dt * 0.03;

  if (state.abilityRemaining > 0) {
    state.abilityRemaining -= dt;
    if (state.abilityRemaining <= 0) {
      finishAbility(true);
    }
  } else if (state.abilityCooldown > 0) {
    state.abilityCooldown -= dt;
    if (state.abilityCooldown < 0) {
      state.abilityCooldown = 0;
    }
  }

  if (state.dragonFrozenTimer > 0) {
    state.dragonFrozenTimer -= dt;
    if (state.dragonFrozenTimer < 0) {
      state.dragonFrozenTimer = 0;
    }
  }

  updateCrownProjectile(dt);

  if (state.hidden) {
    state.hideTimer -= dt;
    if (state.hideTimer <= 0) {
      state.hidden = false;
      showToast(`${dragonName()} mira alrededor y se aleja.`);
    }
  }

  if (state.player.slowTimer > 0) {
    state.player.slowTimer -= dt;
  }

  if (isAbilityActive("wizardFlight")) {
    const targetY = GROUND_Y - WIZARD_FLIGHT_HEIGHT + Math.sin(state.animClock * 5.4) * 10;
    state.player.y += (targetY - state.player.y) * Math.min(1, dt * 8);
    state.player.vy = 0;
    state.player.onGround = false;
  } else if (!state.hidden) {
    state.player.vy += GRAVITY * dt;
    state.player.y += state.player.vy * dt;
    if (state.player.y >= GROUND_Y) {
      state.player.y = GROUND_Y;
      state.player.vy = 0;
      state.player.onGround = true;
    }
  }

  const dangerRise = state.gamePhase === "finalRun" ? FINAL_RUN_DANGER_RISE : PASSIVE_DANGER_RISE;
  let dangerModifier = 1;
  if (state.hidden) {
    dangerModifier *= 0.22;
  }
  if (state.gamePhase === "finalRun" && state.finalRunGraceTimer > 0) {
    dangerModifier *= 0.2;
  }
  if (isProtectedByAbility() || isDragonFrozen()) {
    dangerModifier = 0;
  }
  let dangerDelta = dangerRise * dangerModifier * dt;
  if (isProtectedByAbility() && !state.hidden) {
    dangerDelta -= PROTECTED_DANGER_RECOVERY * dt;
  } else if (isDragonFrozen()) {
    dangerDelta -= FROZEN_DRAGON_DANGER_RECOVERY * dt;
  }
  state.danger = Math.max(0, Math.min(100, state.danger + dangerDelta));

  maybeSpawnObstacle(dt);
  maybeSpawnTree(dt);
  maybeSpawnKey(dt);

  for (const obstacle of state.obstacles) {
    obstacle.x -= scrollSpeed * dt;
  }
  for (const tree of state.trees) {
    tree.x -= scrollSpeed * dt;
  }
  for (const key of state.keysOnField) {
    key.x -= scrollSpeed * dt;
  }
  for (const sparkle of state.sparkles) {
    sparkle.x += sparkle.vx * dt;
    sparkle.y += sparkle.vy * dt;
    sparkle.vy += 260 * dt;
    sparkle.life -= dt;
  }

  state.sparkles = state.sparkles.filter((sparkle) => sparkle.life > 0);
  state.obstacles = state.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -50);
  state.trees = state.trees.filter((tree) => tree.x + 90 > -60);
  state.keysOnField = state.keysOnField.filter((key) => key.x + key.w > -40 && !key.taken);

  state.nearTree = false;
  for (const tree of state.trees) {
    const dx = Math.abs(tree.x - state.player.x);
    if (dx < 74 && !state.hidden) {
      state.nearTree = true;
      break;
    }
  }

  checkCollisions();
  updateButtons();
  updateHud();

  if (state.danger >= 100 && !isProtectedByAbility() && !isDragonFrozen()) {
    triggerGameOver();
    return;
  }

  if (state.timeLeft <= 0) {
    triggerGameOver();
    return;
  }

  if (state.gamePhase === "running" && state.worldDistance >= CASTLE_DISTANCE) {
    enterCastleScene();
  } else if (state.gamePhase === "finalRun" && state.finalDistance >= FINAL_DISTANCE) {
    triggerWin();
  }
}

function updateButtons() {
  const canHideDuringRun = state.gamePhase === "running" || state.gamePhase === "finalRun";
  const abilityActive = state.abilityRemaining > 0;
  buttons.hide.classList.toggle("action-button-disabled", !state.nearTree || state.hidden || !canHideDuringRun || abilityActive);
  const abilityReady = canHideDuringRun && state.abilityRemaining <= 0 && state.abilityCooldown <= 0 && !state.hidden;
  buttons.speed.classList.toggle("action-button-disabled", !abilityReady && !abilityActive);
  buttons.speed.classList.toggle("action-button-ready", abilityReady);
  buttons.speed.classList.toggle("action-button-active", abilityActive);
  updateAbilityButton();
  buttons.hide.classList.toggle("action-button-ready", state.nearTree && !state.hidden && canHideDuringRun && !abilityActive);
  const coinReady = canHideDuringRun && !state.hidden && !state.coinFlipUsed;
  buttons.coin.classList.toggle("action-button-disabled", !coinReady);
  buttons.coin.classList.toggle("action-button-ready", coinReady);
}

function updateAbilityButton() {
  const ability = currentHeroAbility();
  const icon = buttons.speed.querySelector(".icon");
  const label = buttons.speed.querySelector(".action-label") || buttons.speed.lastElementChild;

  if (icon) {
    icon.textContent = ability.icon;
  }

  if (label) {
    if (state.abilityRemaining > 0) {
      label.textContent = `${ability.activeLabel} ${Math.ceil(state.abilityRemaining)}s`;
    } else if (state.abilityCooldown > 0) {
      label.textContent = `${Math.ceil(state.abilityCooldown)}s`;
    } else {
      label.textContent = ability.buttonLabel;
    }
  }

  buttons.speed.title = ability.description;
}

function enterCastleScene() {
  if (state.danger >= 96) {
    triggerGameOver();
    return;
  }

  setScreen("castle");
  state.gamePhase = "castle";
  clearAbilityState(true);

  const missingKeys = 3 - state.keys;
  labels.castleActions.innerHTML = "";

  if (missingKeys > 0) {
    state.quizMissingKeys = missingKeys;
    labels.castleCopy.innerHTML = `
      <p>Las puertas del castillo se abren y aparece Mago Manuel con su baston magico.</p>
      <p>${heroName()} aun no tiene suficientes llaves. Necesita resolver ${missingKeys} acertijo${missingKeys > 1 ? "s" : ""} para abrir la celda de ${rescuedName()}.</p>
    `;
    const button = document.createElement("button");
    button.className = "stone-button";
    button.textContent = "Escuchar a Mago Manuel";
    button.addEventListener("click", startQuiz);
    labels.castleActions.appendChild(button);
  } else {
    labels.castleCopy.innerHTML = `
      <p>Mago Manuel sonrie y apunta con su baston a la puerta de la celda.</p>
      <p>"¡Eres realmente valiente y estas listo!"</p>
      <p>${heroName()} corre hacia la puerta para liberar a ${rescuedName()}.</p>
    `;
    const button = document.createElement("button");
    button.className = "stone-button";
    button.textContent = "Abrir la celda";
    button.addEventListener("click", freePrincess);
    labels.castleActions.appendChild(button);
  }
}

function startQuiz() {
  setScreen("quiz");
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  state.activeQuestions = shuffled.slice(0, state.quizMissingKeys);
  state.currentQuestionIndex = 0;
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const total = state.activeQuestions.length;
  const current = state.currentQuestionIndex + 1;
  const question = state.activeQuestions[state.currentQuestionIndex];
  labels.quizProgress.textContent = `Pregunta ${current} de ${total}`;
  labels.quizQuestion.textContent = question.prompt;
  labels.quizAnswers.innerHTML = "";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.className = "quiz-answer";
    button.textContent = answer;
    button.addEventListener("click", () => answerQuestion(index));
    labels.quizAnswers.appendChild(button);
  });
}

function answerQuestion(index) {
  const question = state.activeQuestions[state.currentQuestionIndex];
  if (index !== question.correct) {
    triggerGameOver();
    return;
  }

  state.currentQuestionIndex += 1;
  if (state.currentQuestionIndex >= state.activeQuestions.length) {
    freePrincess(true);
    return;
  }

  renderQuizQuestion();
}

function freePrincess(fromQuiz = false) {
  setScreen("castle");
  labels.castleActions.innerHTML = "";
  labels.castleCopy.innerHTML = `
    <p>${fromQuiz ? "La puerta del castillo brilla y se abre." : "Mago Manuel apunta a la cerradura."}</p>
    <p>La puerta de hierro se abre. ${rescuedName()} salta feliz y grita: "¡${heroName()}! ¡Me salvaste!"</p>
    <p>${rescuedName()} corre junto a ${heroName()}. Ahora deben escapar juntos hasta la aldea segura.</p>
  `;

  const button = document.createElement("button");
  button.className = "stone-button";
  button.textContent = "Correr a la aldea";
  button.addEventListener("click", startFinalRun);
  labels.castleActions.appendChild(button);
}

function startFinalRun() {
  setScreen("game");
  state.gamePhase = "finalRun";
  state.currentZone = "finalRun";
  state.finalDistance = 0;
  state.finalRunGraceTimer = FINAL_RUN_GRACE_TIME;
  state.danger = Math.min(state.danger, FINAL_RUN_START_DANGER);
  clearAbilityState(true);
  state.obstacles = [];
  state.trees = [];
  state.keysOnField = [];
  state.player.speech = `¡Vamos, ${heroName()}!`;
  showSubtitle(`${heroName()} y ${rescuedName()} corren juntos hacia la aldea. Tienen un momento para arrancar.`);
}

function triggerGameOver() {
  debugLog("Game over");
  setScreen("gameover");
}

function triggerWin() {
  debugLog("Trigger win");
  setScreen("win");
  labels.continueTextInline.classList.add("continue-text-hidden");
  if (continueTextTimeoutId) {
    clearTimeout(continueTextTimeoutId);
  }
  continueTextTimeoutId = setTimeout(() => {
    if (state.screen === "win") {
      labels.continueTextInline.classList.remove("continue-text-hidden");
    }
    continueTextTimeoutId = null;
  }, 2200);
}

function drawBackground() {
  const zone = state.currentZone;
  let sky = ["#7ac6ff", "#d8f2ff"];
  let hills = "#4b7b47";
  let ground = "#5e8d42";

  if (zone === "darkForest") {
    sky = ["#3b4f7c", "#93a3ca"];
    hills = "#355535";
    ground = "#496b33";
  } else if (zone === "torchRoad" || zone === "finalRun") {
    sky = ["#3d4667", "#f7b16f"];
    hills = "#62514a";
    ground = "#6b5845";
  }

  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, sky[0]);
  grad.addColorStop(1, sky[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawSunAndClouds();

  ctx.fillStyle = hills;
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 260 - state.skyOffset) % (canvas.width + 300)) - 120;
    ctx.beginPath();
    ctx.arc(x, 470, 220, Math.PI, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

  if (zone === "brightForest" || zone === "darkForest") {
    drawForestBackdrop(zone === "darkForest");
  } else {
    drawTorchRoadBackdrop();
  }
}

function drawSunAndClouds() {
  ctx.fillStyle = "rgba(255, 239, 177, 0.92)";
  ctx.beginPath();
  ctx.arc(1100, 130, 58, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  for (let i = 0; i < 4; i += 1) {
    const x = ((i * 320 - state.skyOffset * 1.6) % (canvas.width + 240)) - 80;
    ctx.beginPath();
    ctx.arc(x, 110 + (i % 2) * 28, 26, 0, Math.PI * 2);
    ctx.arc(x + 36, 100 + (i % 2) * 28, 32, 0, Math.PI * 2);
    ctx.arc(x + 70, 112 + (i % 2) * 28, 24, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawForestBackdrop(dark) {
  for (let i = 0; i < 9; i += 1) {
    const x = ((i * 160 - state.skyOffset * 2.8) % (canvas.width + 200)) - 60;
    const height = dark ? 180 : 160;
    ctx.fillStyle = dark ? "#233f25" : "#2f6a2f";
    ctx.fillRect(x + 28, GROUND_Y - height, 18, height);
    ctx.fillStyle = dark ? "#2a5a2b" : "#479846";
    ctx.beginPath();
    ctx.arc(x + 37, GROUND_Y - height - 12, 52, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTorchRoadBackdrop() {
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 190 - state.skyOffset * 2.3) % (canvas.width + 220)) - 80;
    ctx.fillStyle = "#4d4d58";
    ctx.fillRect(x + 42, GROUND_Y - 150, 26, 150);
    ctx.fillStyle = "#f0a243";
    ctx.fillRect(x + 32, GROUND_Y - 132, 46, 16);
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 214, 130, 0.82)";
    ctx.arc(x + 55, GROUND_Y - 152, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#7f848d";
  ctx.fillRect(0, GROUND_Y + 18, canvas.width, 18);
}

function px(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function fillPx(targetCtx, x, y, w, h, color) {
  targetCtx.fillStyle = color;
  targetCtx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function outlinePx(targetCtx, x, y, w, h, color = "#1f1a18") {
  fillPx(targetCtx, x, y, w, 2, color);
  fillPx(targetCtx, x, y + h - 2, w, 2, color);
  fillPx(targetCtx, x, y, 2, h, color);
  fillPx(targetCtx, x + w - 2, y, 2, h, color);
}

function drawPixelOutline(x, y, w, h, color = "#1f1a18") {
  px(x, y, w, 2, color);
  px(x, y + h - 2, w, 2, color);
  px(x, y, 2, h, color);
  px(x + w - 2, y, 2, h, color);
}

function blinkClosed(speed = 1, threshold = 0.08, offset = 0) {
  const cycle = (state.animClock * speed + offset) % 5.2;
  return cycle < threshold;
}

function drawSpeechBubble(x, y, text) {
  px(x, y, 206, 48, "rgba(255,255,255,0.96)");
  drawPixelOutline(x, y, 206, 48, "#3e4554");
  px(x + 24, y + 48, 12, 8, "rgba(255,255,255,0.96)");
  drawPixelOutline(x + 24, y + 48, 12, 8, "#3e4554");
  ctx.fillStyle = "#18253f";
  ctx.font = "bold 20px Trebuchet MS";
  ctx.fillText(text, x + 14, y + 31);
}

function drawTree(tree) {
  px(tree.x + 30, tree.y + 46, 10, 122, "#5c3923");
  px(tree.x + 40, tree.y + 46, 14, 122, "#7b4b2a");
  px(tree.x + 54, tree.y + 46, 10, 122, "#5c3923");
  px(tree.x + 12, tree.y + 26, 28, 28, "#2d6f31");
  px(tree.x + 38, tree.y + 10, 34, 34, "#3d8f43");
  px(tree.x + 72, tree.y + 30, 26, 26, "#327837");
  px(tree.x + 18, tree.y + 56, 26, 22, "#388540");
  px(tree.x + 54, tree.y + 50, 30, 24, "#4ba34b");
  drawPixelOutline(tree.x + 38, tree.y + 10, 34, 34, "#275628");
}

function drawObstacle(obstacle) {
  if (obstacle.kind === "gap") {
    px(obstacle.x, GROUND_Y + 4, obstacle.w, 28, "#2b1f1a");
    px(obstacle.x + 8, GROUND_Y + 8, obstacle.w - 16, 20, "#4a352a");
    return;
  }

  if (obstacle.kind === "chicken") {
    px(obstacle.x + 10, obstacle.y + 16, 40, 26, "#f4eedb");
    px(obstacle.x + 40, obstacle.y + 8, 16, 16, "#f4eedb");
    px(obstacle.x + 50, obstacle.y + 18, 10, 8, "#ef9d31");
    px(obstacle.x + 16, obstacle.y + 42, 4, 10, "#d38f2e");
    px(obstacle.x + 34, obstacle.y + 42, 4, 10, "#d38f2e");
    px(obstacle.x + 44, obstacle.y + 14, 4, 4, "#2d221f");
    px(obstacle.x + 8, obstacle.y + 18, 8, 8, "#d64e39");
    drawPixelOutline(obstacle.x + 10, obstacle.y + 16, 40, 26, "#705a47");
    return;
  }

  px(obstacle.x, obstacle.y, obstacle.w, obstacle.h, obstacle.color);
  if (obstacle.kind === "thorns") {
    for (let i = 0; i < 6; i += 1) {
      px(obstacle.x + i * 16, obstacle.y + obstacle.h - 10, 6, 10, "#274f22");
      px(obstacle.x + 6 + i * 16, obstacle.y + obstacle.h - 22, 6, 22, "#91c46c");
      px(obstacle.x + 12 + i * 16, obstacle.y + obstacle.h - 10, 6, 10, "#274f22");
    }
    drawPixelOutline(obstacle.x, obstacle.y, obstacle.w, obstacle.h, "#294e27");
  } else {
    drawPixelOutline(obstacle.x, obstacle.y, obstacle.w, obstacle.h, "#5c3c22");
  }
}

function drawKey(key) {
  px(key.x + 8, key.y + 12, 16, 6, "#ffd861");
  px(key.x + 20, key.y + 8, 8, 18, "#ffd861");
  px(key.x + 26, key.y + 18, 8, 6, "#ffd861");
  px(key.x + 4, key.y + 8, 10, 10, "#ffd861");
  drawPixelOutline(key.x + 4, key.y + 8, 10, 10, "#8d6a1f");
  px(key.x + 6, key.y + 10, 6, 6, "#fff1a8");
}

function getDragonRenderInfo() {
  const dangerProgress = Math.max(0, Math.min(1, state.danger / 100));
  return {
    dangerProgress,
    x: -240 + dangerProgress * 280,
    y: 446 - dangerProgress * 40,
    dragonScale: 0.68 + dangerProgress * 0.3,
  };
}

function getDragonFocusPoint() {
  const dragon = getDragonRenderInfo();
  return {
    x: dragon.x + 174 * dragon.dragonScale,
    y: dragon.y + 20 * dragon.dragonScale,
  };
}

function drawCrownShape(x, y, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  px(-18, 4, 36, 10, "#ffd861");
  px(-16, -8, 8, 14, "#d6b14d");
  px(-4, -14, 8, 20, "#fff1a8");
  px(8, -8, 8, 14, "#d6b14d");
  px(-19, 12, 38, 6, "#b98722");
  drawPixelOutline(-18, 4, 36, 14, "#8d6a1f");
  ctx.restore();
}

function drawCrownProjectile() {
  const crown = state.crownProjectile;
  if (!crown) {
    return;
  }

  const scale = crown.impact ? 1.25 : 1;
  drawCrownShape(crown.x, crown.y, scale);
}

function drawDragonFreezeEffect() {
  px(126, -12, 90, 62, "rgba(131, 219, 255, 0.36)");
  px(56, 18, 104, 78, "rgba(131, 219, 255, 0.26)");
  px(72, 96, 18, 34, "rgba(202, 244, 255, 0.52)");
  px(116, 98, 18, 34, "rgba(202, 244, 255, 0.52)");
  px(146, -20, 14, 14, "#d7f8ff");
  px(190, -14, 12, 12, "#d7f8ff");
  px(44, 38, 14, 14, "#d7f8ff");
}

function drawDragon() {
  const { dangerProgress, x, y, dragonScale } = getDragonRenderInfo();
  const dragonFrozen = isDragonFrozen();
  const wingFrame = dragonFrozen ? 0 : Math.floor(state.animClock * 5) % 2;
  const pawFrame = dragonFrozen ? 0 : Math.floor(state.animClock * 7) % 2;
  const wingLift = wingFrame === 0 ? 0 : -10;
  const wingSpread = dangerProgress > 0.82 ? 42 : 0;
  const frontPawOffset = pawFrame === 0 ? 0 : 8;
  const backPawOffset = pawFrame === 0 ? 8 : 0;
  const catBlink = blinkClosed(1.1, 0.11, 0.8);
  const isTigerSkin = state.dragonSkin === "tiger";
  const wingDark = isTigerSkin ? "#6f3f16" : "#775d2d";
  const wingLight = isTigerSkin ? "#b56d28" : "#90703a";
  const bodyMain = isTigerSkin ? "#b96d28" : "#7c6230";
  const bodyStripeLight = isTigerSkin ? "#d9953b" : "#9a7b43";
  const bodyStripeDark = isTigerSkin ? "#47301a" : "#665026";
  const headMain = isTigerSkin ? "#d08a3a" : "#9e7e45";
  const earColor = isTigerSkin ? "#7e4318" : "#6f4f22";
  const pawColor = isTigerSkin ? "#8b4a22" : "#6a531f";
  const wingMembrane = isTigerSkin ? "#df8d2f" : "#8f742b";
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dragonScale, dragonScale);
  px(10 - wingSpread, 44 + wingLift, 52 + wingSpread, 44, wingDark);
  px(18 - wingSpread, 36 + wingLift, 40 + wingSpread, 30, wingLight);
  px(120, 64, 42, 28, bodyStripeDark);
  px(146, 70, 34, 14, isTigerSkin ? "#d28e48" : "#8d6e3b");
  px(60, 20, 92, 70, bodyMain);
  px(72, 28, 20, 58, bodyStripeLight);
  px(94, 24, 18, 62, bodyStripeDark);
  px(112, 28, 18, 60, bodyStripeLight);
  px(130, 24, 14, 58, bodyStripeDark);
  px(138, -4, 64, 48, headMain);
  px(154, -18, 16, 18, earColor);
  px(178, -18, 16, 18, earColor);
  px(150, -10, 8, 10, "#f4c1a1");
  px(182, -10, 8, 10, "#f4c1a1");
  px(152, 8, 10, catBlink ? 4 : 10, "#9fdd5b");
  px(180, 8, 10, catBlink ? 4 : 10, "#9fdd5b");
  px(156, catBlink ? 10 : 12, 4, 4, "#1f1a18");
  px(184, catBlink ? 10 : 12, 4, 4, "#1f1a18");
  px(164, 24, 18, 6, "#d47f4c");
  px(20 - wingSpread / 2, -4 - wingLift / 2, 56, 68, pawColor);
  px(30 - wingSpread / 2, 4 - wingLift / 2, 42, 52, wingMembrane);
  px(18, 8, 8, 12, "#4d7a35");
  px(74, 86 + frontPawOffset, 18, 36, pawColor);
  px(118, 88 + backPawOffset, 18, 36, pawColor);
  px(70, 118 + frontPawOffset, 8, 12, "#e9d7a1");
  px(84, 118 + frontPawOffset, 8, 12, "#e9d7a1");
  px(114, 120 + backPawOffset, 8, 12, "#e9d7a1");
  px(128, 120 + backPawOffset, 8, 12, "#e9d7a1");
  if (isTigerSkin) {
    px(142, 6, 8, 34, "#2b1c14");
    px(166, 2, 8, 38, "#2b1c14");
    px(86, 24, 6, 54, "#2b1c14");
    px(118, 26, 6, 52, "#2b1c14");
  }
  drawPixelOutline(138, -4, 64, 48, "#46331f");
  drawPixelOutline(60, 20, 92, 70, "#46331f");
  if (dragonFrozen) {
    drawDragonFreezeEffect();
  }
  if (state.danger > 86 && !state.hidden && !dragonFrozen) {
    const fireLength = 86 + dangerProgress * 80;
    px(206, 18, fireLength, 14, "rgba(220, 74, 48, 0.7)");
    px(216, 22, fireLength - 28, 6, "rgba(255, 197, 120, 0.8)");
  }
  ctx.restore();
}

function drawKnightSprite(x, y, options = {}) {
  const hiddenOffset = options.hidden ? 18 : 0;
  const isJumping = options.isJumping;
  const runFrame = isJumping ? 0 : Math.floor(state.animClock * 8) % 2;
  const frontLegOffset = isJumping ? -12 : runFrame === 0 ? -6 : 6;
  const backLegOffset = isJumping ? 10 : runFrame === 0 ? 6 : -6;
  const frontArmOffset = isJumping ? -4 : runFrame === 0 ? -2 : 2;
  const backArmOffset = isJumping ? 2 : runFrame === 0 ? 2 : -2;
  const capeWave = Math.sin(state.animClock * 5.4) * 4;
  const eyeBlink = blinkClosed(0.95, 0.1, 0.2);
  const isMimiSkin = state.knightSkin === "mimi";
  const isWizardSkin = state.knightSkin === "wizard";
  const armorMain = "#cfd4db";
  const armorLight = "#eef1f6";
  const capeMain = "#f08a26";
  const capeLight = "#ffb062";
  const limbMetal = "#96a0b2";
  const legMetal = "#70798b";
  const bootColor = "#473b2f";
  const outlineColor = "#6a7281";

  if (isWizardSkin) {
    const robeWave = Math.sin(state.animClock * 2.8) * 2;
    px(x - 16, y - 116 + hiddenOffset, 32, 16, "#3c2e2b");
    px(x - 20, y - 98 + hiddenOffset, 40, 22, "#f0c3a4");
    px(x - 24, y - 92 + hiddenOffset, 16, 12, "#4d3c35");
    px(x + 8, y - 92 + hiddenOffset, 16, 12, "#4d3c35");
    px(x - 18, y - 88 + hiddenOffset, 10, 4, "#9dc7ff");
    px(x + 10, y - 88 + hiddenOffset, 10, 4, "#9dc7ff");
    if (eyeBlink) {
      px(x - 16, y - 84 + hiddenOffset, 4, 2, "#2b241f");
      px(x + 12, y - 84 + hiddenOffset, 4, 2, "#2b241f");
    } else {
      px(x - 16, y - 86 + hiddenOffset, 4, 4, "#2b241f");
      px(x + 12, y - 86 + hiddenOffset, 4, 4, "#2b241f");
    }
    px(x - 4, y - 80 + hiddenOffset, 8, 4, "#b56d56");
    px(x - 8, y - 74 + hiddenOffset, 16, 12, "#6a564f");
    px(x - 10, y - 62 + hiddenOffset, 20, 12, "#5d4b43");
    px(x - 24, y - 56 + hiddenOffset, 48, 54, "#f4f0e8");
    px(x - 18, y - 48 + hiddenOffset, 36, 14, "#fffaf0");
    px(x - 8, y - 56 + hiddenOffset, 6, 54, "#d6b14d");
    px(x - 2, y - 56 + hiddenOffset, 10, 54, "#fff2bf");
    px(x + 8, y - 56 + hiddenOffset, 6, 54, "#d6b14d");
    px(x - 30, y - 56 + hiddenOffset + backArmOffset, 10, 34, "#e0dbd2");
    px(x + 20, y - 54 + hiddenOffset + frontArmOffset, 10, 30, "#e0dbd2");
    px(x - 18, y - 12 + hiddenOffset + backLegOffset, 12, 14, "#d7d1c5");
    px(x + 6, y - 12 + hiddenOffset + frontLegOffset, 12, 14, "#d7d1c5");
    px(x - 18, y + 2 + hiddenOffset + backLegOffset, 12, 6, "#6a546d");
    px(x + 6, y + 2 + hiddenOffset + frontLegOffset, 12, 6, "#6a546d");
    px(x + 30, y - 90 + hiddenOffset, 6, 74, "#7a5a31");
    px(x + 24, y - 102 + hiddenOffset + robeWave, 18, 14, "#ffd861");
    px(x + 28, y - 108 + hiddenOffset + robeWave, 10, 6, "#fff1a8");
    drawPixelOutline(x - 24, y - 56 + hiddenOffset, 48, 54, "#b8b2a5");
    return;
  }

  if (options.hidden) {
    px(x - 38, y - 56, 30, 26, "#3a6f35");
    px(x - 16, y - 70, 44, 40, "#4a9442");
    px(x + 20, y - 54, 24, 22, "#3a6f35");
  }

  if (isMimiSkin) {
    const hairWave = Math.sin(state.animClock * 4.8 + 0.7) * 3;
    const blink = blinkClosed(1.05, 0.1, 1.4);
    px(x - 18, y - 108 + hiddenOffset + hairWave / 3, 36, 18, "#6c462b");
    px(x - 20, y - 92 + hiddenOffset, 40, 22, "#f4c7a5");
    if (blink) {
      px(x - 10, y - 84 + hiddenOffset, 6, 2, "#5d3c28");
      px(x + 4, y - 84 + hiddenOffset, 6, 2, "#5d3c28");
    } else {
      px(x - 10, y - 84 + hiddenOffset, 6, 4, "#5d3c28");
      px(x + 4, y - 84 + hiddenOffset, 6, 4, "#5d3c28");
    }
    px(x - 6, y - 76 + hiddenOffset, 12, 4, "#d98058");
    px(x - 14, y - 114 + hiddenOffset, 28, 8, "#d6b14d");
    px(x - 8, y - 120 + hiddenOffset, 16, 6, "#f7e49f");
    px(x - 22, y - 70 + hiddenOffset + backArmOffset, 8, 24, "#f3c1d9");
    px(x + 14, y - 68 + hiddenOffset + frontArmOffset, 8, 24, "#f3c1d9");
    px(x - 24, y - 68 + hiddenOffset, 48, 52, "#ef8fcb");
    px(x - 18, y - 60 + hiddenOffset, 36, 18, "#f7b1d7");
    px(x - 22, y - 18 + hiddenOffset + backLegOffset, 10, 20, "#ef8fcb");
    px(x + 12, y - 18 + hiddenOffset + frontLegOffset, 10, 20, "#ef8fcb");
    px(x - 22, y + 2 + hiddenOffset + backLegOffset, 10, 6, "#7a4a34");
    px(x + 12, y + 2 + hiddenOffset + frontLegOffset, 10, 6, "#7a4a34");
    drawPixelOutline(x - 24, y - 68 + hiddenOffset, 48, 52, "#a75288");
    return;
  }

  px(x - 16, y - 112 + hiddenOffset, 32, 14, "#1f1510");
  px(x - 20, y - 98 + hiddenOffset, 40, 22, "#f4c7a5");
  px(x - 26, y - 92 + hiddenOffset, 18, 12, "#1f1f24");
  px(x + 8, y - 92 + hiddenOffset, 18, 12, "#1f1f24");
  px(x - 22, y - 88 + hiddenOffset, 10, 4, "#9dc7ff");
  px(x + 12, y - 88 + hiddenOffset, 10, 4, "#9dc7ff");
  if (eyeBlink) {
    px(x - 18, y - 86 + hiddenOffset, 4, 2, "#2b241f");
    px(x + 16, y - 86 + hiddenOffset, 4, 2, "#2b241f");
  } else {
    px(x - 18, y - 86 + hiddenOffset, 4, 4, "#2b241f");
    px(x + 16, y - 86 + hiddenOffset, 4, 4, "#2b241f");
  }
  px(x - 6, y - 84 + hiddenOffset, 12, 4, "#d98058");
  px(x - 22, y - 74 + hiddenOffset, 44, 42, armorMain);
  px(x - 16, y - 68 + hiddenOffset, 32, 14, armorLight);
  px(x + 18, y - 74 + hiddenOffset + capeWave / 2, 24, 46, capeMain);
  px(x + 34, y - 68 + hiddenOffset + capeWave / 2, 8, 28, capeLight);
  px(x - 30, y - 70 + hiddenOffset + backArmOffset, 10, 28, limbMetal);
  px(x + 20, y - 70 + hiddenOffset + frontArmOffset, 10, 28, limbMetal);
  px(x - 18, y - 32 + hiddenOffset + backLegOffset, 12, 32, legMetal);
  px(x + 6, y - 32 + hiddenOffset + frontLegOffset, 12, 32, legMetal);
  px(x - 18, y - 4 + hiddenOffset + backLegOffset, 12, 6, bootColor);
  px(x + 6, y - 4 + hiddenOffset + frontLegOffset, 12, 6, bootColor);
  if (isMimiSkin) {
    px(x - 4, y - 66 + hiddenOffset, 8, 22, "#d6b14d");
  }
  drawPixelOutline(x - 22, y - 74 + hiddenOffset, 44, 42, outlineColor);
}

function drawPrincessSprite(x, y, options = {}) {
  const isJumping = options.isJumping;
  const runFrame = isJumping ? 0 : Math.floor(state.animClock * 8) % 2;
  const frontLegOffset = isJumping ? -10 : runFrame === 0 ? -5 : 5;
  const backLegOffset = isJumping ? 8 : runFrame === 0 ? 5 : -5;
  const frontArmOffset = isJumping ? -3 : runFrame === 0 ? -2 : 2;
  const backArmOffset = isJumping ? 1 : runFrame === 0 ? 2 : -2;
  const hairWave = Math.sin(state.animClock * 4.8 + 0.7) * 3;
  const eyeBlink = blinkClosed(1.05, 0.1, 1.4);
  const isValentinSkin = state.princessSkin === "valentin";
  const isSkySkin = state.princessSkin === "sky";
  const dressMain = isSkySkin ? "#7ab6ef" : "#ef8fcb";
  const dressLight = isSkySkin ? "#b9dcfb" : "#f7b1d7";
  const sleeve = isSkySkin ? "#dcecff" : "#f3c1d9";
  const shoe = isSkySkin ? "#57709c" : "#7a4a34";
  const tiara = isSkySkin ? "#fff0b8" : "#f7e49f";

  if (isValentinSkin) {
    px(x - 16, y - 112, 32, 14, "#1f1510");
    px(x - 20, y - 98, 40, 22, "#f4c7a5");
    px(x - 26, y - 92, 18, 12, "#1f1f24");
    px(x + 8, y - 92, 18, 12, "#1f1f24");
    px(x - 22, y - 88, 10, 4, "#9dc7ff");
    px(x + 12, y - 88, 10, 4, "#9dc7ff");
    if (eyeBlink) {
      px(x - 18, y - 86, 4, 2, "#2b241f");
      px(x + 16, y - 86, 4, 2, "#2b241f");
    } else {
      px(x - 18, y - 86, 4, 4, "#2b241f");
      px(x + 16, y - 86, 4, 4, "#2b241f");
    }
    px(x - 6, y - 84, 12, 4, "#d98058");
    px(x - 22, y - 74, 44, 42, "#cfd4db");
    px(x - 16, y - 68, 32, 14, "#eef1f6");
    px(x + 18, y - 74, 24, 46, "#f08a26");
    px(x + 34, y - 68, 8, 28, "#ffb062");
    px(x - 30, y - 70 + backArmOffset, 10, 28, "#96a0b2");
    px(x + 20, y - 70 + frontArmOffset, 10, 28, "#96a0b2");
    px(x - 18, y - 32 + backLegOffset, 12, 32, "#70798b");
    px(x + 6, y - 32 + frontLegOffset, 12, 32, "#70798b");
    px(x - 18, y - 4 + backLegOffset, 12, 6, "#473b2f");
    px(x + 6, y - 4 + frontLegOffset, 12, 6, "#473b2f");
    drawPixelOutline(x - 22, y - 74, 44, 42, "#6a7281");
    return;
  }

  px(x - 16, y - 104 + hairWave / 3, 32, 16, "#6c462b");
  px(x - 18, y - 90, 36, 20, "#f4c7a5");
  if (eyeBlink) {
    px(x - 10, y - 84, 6, 2, "#5d3c28");
    px(x + 4, y - 84, 6, 2, "#5d3c28");
  } else {
    px(x - 10, y - 84, 6, 4, "#5d3c28");
    px(x + 4, y - 84, 6, 4, "#5d3c28");
  }
  px(x - 6, y - 76, 12, 4, "#d98058");
  px(x - 12, y - 110, 24, 8, "#d6b14d");
  px(x - 8, y - 116, 16, 6, tiara);
  px(x - 20, y - 70 + backArmOffset, 8, 24, sleeve);
  px(x + 12, y - 68 + frontArmOffset, 8, 24, sleeve);
  px(x - 22, y - 70, 44, 50, dressMain);
  px(x - 16, y - 62, 32, 18, dressLight);
  px(x - 20, y - 20 + backLegOffset, 10, 20, dressMain);
  px(x + 10, y - 20 + frontLegOffset, 10, 20, dressMain);
  px(x - 20, y + backLegOffset, 10, 6, shoe);
  px(x + 10, y + frontLegOffset, 10, 6, shoe);
  drawPixelOutline(x - 22, y - 70, 44, 50, isSkySkin ? "#587fb1" : "#a75288");
}

function drawShieldAura(x, y, stroke, fill) {
  const pulse = 4 + Math.sin(state.animClock * 7) * 3;
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(x, y - 58, 58 + pulse, 82 + pulse, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawWizardFlightTrail(x, y) {
  const glow = 0.55 + Math.sin(state.animClock * 8) * 0.2;
  ctx.save();
  ctx.globalAlpha = glow;
  px(x - 24, y + 10, 48, 14, "rgba(255, 142, 38, 0.74)");
  px(x - 14, y + 24, 28, 16, "rgba(255, 202, 95, 0.62)");
  px(x + 28, y - 90, 16, 16, "rgba(255, 184, 72, 0.72)");
  px(x + 34, y - 84, 8, 34, "rgba(255, 112, 30, 0.56)");
  ctx.restore();
}

function drawPlayer() {
  const x = state.player.x;
  const y = state.player.y;
  const valentinShielded = isAbilityActive("valentinShield");
  const wizardFlying = isAbilityActive("wizardFlight");

  if (wizardFlying) {
    drawWizardFlightTrail(x, y);
  }

  drawKnightSprite(x, y, {
    hidden: state.hidden,
    isJumping: !state.player.onGround,
  });

  if (valentinShielded) {
    drawShieldAura(x, y, "#bde8ff", "rgba(102, 184, 255, 0.2)");
  } else if (wizardFlying) {
    drawShieldAura(x, y, "#ffb35c", "rgba(255, 126, 38, 0.24)");
  }

  if (state.gamePhase === "finalRun") {
    const princessX = x + 58;
    const princessY = state.player.onGround ? y : y + 4;
    drawPrincessSprite(princessX, princessY, {
      isJumping: !state.player.onGround,
    });
  }

  if (state.player.speech && state.gamePhase === "finalRun") {
    drawSpeechBubble(x + 28, y - 184, state.player.speech);
  }
}

function drawWizardPortrait(targetCtx, width, height, mood = "guide") {
  targetCtx.clearRect(0, 0, width, height);
  const blink = blinkClosed(0.9, 0.12, 0.45);
  const beardWave = Math.sin(state.animClock * 3.6) * 2;
  const staffGlow = 0.55 + Math.sin(state.animClock * 4.2) * 0.18;
  const robeWave = Math.sin(state.animClock * 2.8) * 2;
  fillPx(targetCtx, 0, 0, width, height, "#445b92");
  fillPx(targetCtx, 0, 150, width, 150, "#5d7d57");
  fillPx(targetCtx, 0, 0, width, 90, "rgba(255,229,176,0.18)");
  fillPx(targetCtx, 32, 208, 196, 70, "#6d563f");
  fillPx(targetCtx, 196, 74, 10, 146, "#7a5a31");
  fillPx(targetCtx, 186, 56, 30, 26, `rgba(255,214,118,${staffGlow})`);
  outlinePx(targetCtx, 186, 56, 30, 26, "#fff0ad");
  fillPx(targetCtx, 92, 52, 78, 18, "#ece8dc");
  fillPx(targetCtx, 82, 70, 98, 22, "#fffaf0");
  fillPx(targetCtx, 74, 86, 114, 18, "#d6d1c7");
  fillPx(targetCtx, 98, 74, 64, 18, "#6d544b");
  fillPx(targetCtx, 82, 96, 96, 34, "#f0c3a4");
  fillPx(targetCtx, 78, 92, 18, 14, "#4d3c35");
  fillPx(targetCtx, 162, 92, 18, 14, "#4d3c35");
  fillPx(targetCtx, 86, 106, 32, 12, "#1f2229");
  fillPx(targetCtx, 142, 106, 32, 12, "#1f2229");
  fillPx(targetCtx, 94, 110, 16, 4, "#9dc7ff");
  fillPx(targetCtx, 150, 110, 16, 4, "#9dc7ff");
  if (blink) {
    fillPx(targetCtx, 100, 118, 6, 2, "#2d241f");
    fillPx(targetCtx, 154, 118, 6, 2, "#2d241f");
  } else {
    fillPx(targetCtx, 100, 116, 6, 6, "#2d241f");
    fillPx(targetCtx, 154, 116, 6, 6, "#2d241f");
  }
  fillPx(targetCtx, 120, 128, 14, 6, "#b56d56");
  fillPx(targetCtx, 100, 136 + beardWave, 64, 28, "#7a675d");
  fillPx(targetCtx, 94, 150 + beardWave, 76, 22, "#5d4b43");
  fillPx(targetCtx, 84, 166, 96, 84, "#f4f0e8");
  fillPx(targetCtx, 96, 176, 72, 22, "#fffaf0");
  fillPx(targetCtx, 64, 178 + robeWave, 40, 56, "#e0dbd2");
  fillPx(targetCtx, 160, 174 - robeWave, 42, 52, "#e0dbd2");
  fillPx(targetCtx, 72, 214, 30, 28, "#d7d1c5");
  fillPx(targetCtx, 150, 212, 34, 30, "#d7d1c5");
  fillPx(targetCtx, 72, 150, 18, 16, "#f0c3a4");
  fillPx(targetCtx, 54, 156, 16, 74, "#e0dbd2");
  fillPx(targetCtx, 170, 194, 14, 56, "#f0c3a4");
  fillPx(targetCtx, 162, 208, 28, 38, "#e6e1d8");
  fillPx(targetCtx, 110, 170, 12, 70, "#d6b14d");
  fillPx(targetCtx, 122, 170, 18, 70, "#fff2bf");
  fillPx(targetCtx, 140, 170, 12, 70, "#d6b14d");
  outlinePx(targetCtx, 84, 166, 96, 84, "#b8b2a5");
  outlinePx(targetCtx, 82, 70, 98, 22, "#ada79c");
  if (mood === "guide") {
    fillPx(targetCtx, 206, 208, 16, 8, "#fff1a8");
  }
  if (mood === "victory") {
    fillPx(targetCtx, 38, 34, 16, 16, "#ffd861");
    fillPx(targetCtx, 42, 30, 8, 24, "#fff1a8");
  }
}

function drawTitleScene() {
  const targetCtx = titleArtCtx;
  const w = titleArtCanvas.width;
  const h = titleArtCanvas.height;
  targetCtx.clearRect(0, 0, w, h);
  fillPx(targetCtx, 0, 0, w, h, "#445a9b");
  fillPx(targetCtx, 0, 120, w, h - 120, "#7dc0f1");
  fillPx(targetCtx, 0, 230, w, 130, "#416535");
  fillPx(targetCtx, 0, 272, w, 88, "#5f8644");
  fillPx(targetCtx, 360, 68, 112, 160, "#70798f");
  fillPx(targetCtx, 378, 38, 28, 52, "#70798f");
  fillPx(targetCtx, 428, 28, 28, 62, "#70798f");
  fillPx(targetCtx, 400, 112, 38, 72, "#f0cf8a");
  outlinePx(targetCtx, 360, 68, 112, 160, "#323b53");
  const blink = blinkClosed(0.95, 0.1, 0.2);
  const wingLift = Math.sin(state.animClock * 4.4) > 0 ? -8 : 0;
  fillPx(targetCtx, 58, 190 + wingLift, 56, 42, "#775d2d");
  fillPx(targetCtx, 98, 168, 78, 52, "#7c6230");
  fillPx(targetCtx, 160, 144, 52, 42, "#9e7e45");
  fillPx(targetCtx, 34, 166 + wingLift, 40, 44, "#6a531f");
  fillPx(targetCtx, 158, 152, 8, blink ? 4 : 10, "#9fdd5b");
  fillPx(targetCtx, 182, 152, 8, blink ? 4 : 10, "#9fdd5b");
  fillPx(targetCtx, 230, 206, 34, 18, "#ffd861");
  outlinePx(targetCtx, 230, 206, 34, 18, "#8d6a1f");
  fillPx(targetCtx, 286, 194, 36, 18, "#ffd861");
  outlinePx(targetCtx, 286, 194, 36, 18, "#8d6a1f");
  fillPx(targetCtx, 112, 204, 20, 18, "#e65d3c");
  fillPx(targetCtx, 250, 188, 30, 60, "#1f1510");
  fillPx(targetCtx, 244, 208, 42, 24, "#f4c7a5");
  fillPx(targetCtx, 238, 214, 16, 12, "#1f1f24");
  fillPx(targetCtx, 276, 214, 16, 12, "#1f1f24");
  fillPx(targetCtx, 234, 232, 54, 44, "#cfd4db");
  fillPx(targetCtx, 284, 228 + Math.sin(state.animClock * 5.4) * 2, 32, 50, "#f08a26");
  fillPx(targetCtx, 244, 276, 12, 42, "#70798b");
  fillPx(targetCtx, 266, 272, 12, 46, "#70798b");
  fillPx(targetCtx, 410, 154, 22, 50, "#ef8fcb");
  fillPx(targetCtx, 404, 138, 34, 18, "#6c462b");
  fillPx(targetCtx, 406, 128, 30, 10, "#d6b14d");
  fillPx(targetCtx, 402, 204, 14, 32, "#ef8fcb");
  fillPx(targetCtx, 424, 206, 14, 32, "#ef8fcb");
}

function drawWinScene() {
  const targetCtx = winArtCtx;
  const w = winArtCanvas.width;
  const h = winArtCanvas.height;
  const blinkKnight = blinkClosed(0.95, 0.1, 0.2);
  const blinkPrincess = blinkClosed(1.05, 0.1, 1.4);
  const wizardBlink = blinkClosed(0.9, 0.12, 0.45);
  const capeWave = Math.sin(state.animClock * 5.4) * 2;
  const hairWave = Math.sin(state.animClock * 4.8 + 0.7) * 2;
  targetCtx.clearRect(0, 0, w, h);
  fillPx(targetCtx, 0, 0, w, h, "#3a4c7a");
  fillPx(targetCtx, 0, 120, w, h - 120, "#6d8a56");
  fillPx(targetCtx, 334, 52, 126, 112, "#8d9488");
  fillPx(targetCtx, 350, 80, 18, 68, "#f6ca86");
  fillPx(targetCtx, 398, 80, 18, 68, "#f6ca86");
  fillPx(targetCtx, 452, 76, 18, 72, "#f6ca86");
  fillPx(targetCtx, 320, 150, 168, 14, "#c09b5f");
  fillPx(targetCtx, 318, 164, 172, 72, "#7a8a77");
  fillPx(targetCtx, 92, 102, 30, 60, "#1f1510");
  fillPx(targetCtx, 86, 122, 42, 24, "#f4c7a5");
  fillPx(targetCtx, 80, 128, 16, 12, "#1f1f24");
  fillPx(targetCtx, 118, 128, 16, 12, "#1f1f24");
  if (blinkKnight) {
    fillPx(targetCtx, 88, 132, 4, 2, "#2b241f");
    fillPx(targetCtx, 122, 132, 4, 2, "#2b241f");
  } else {
    fillPx(targetCtx, 88, 130, 4, 4, "#2b241f");
    fillPx(targetCtx, 122, 130, 4, 4, "#2b241f");
  }
  fillPx(targetCtx, 72, 146, 54, 44, "#cfd4db");
  fillPx(targetCtx, 122, 144 + capeWave, 32, 50, "#f08a26");
  fillPx(targetCtx, 64, 150, 12, 34, "#96a0b2");
  fillPx(targetCtx, 116, 118, 10, 28, "#96a0b2");
  fillPx(targetCtx, 84, 190, 12, 36, "#70798b");
  fillPx(targetCtx, 106, 184, 12, 42, "#70798b");
  fillPx(targetCtx, 84, 226, 12, 6, "#473b2f");
  fillPx(targetCtx, 106, 226, 12, 6, "#473b2f");
  fillPx(targetCtx, 184, 110 + hairWave / 2, 32, 16, "#6c462b");
  fillPx(targetCtx, 180, 126, 36, 20, "#f4c7a5");
  if (blinkPrincess) {
    fillPx(targetCtx, 188, 132, 6, 2, "#5d3c28");
    fillPx(targetCtx, 202, 132, 6, 2, "#5d3c28");
  } else {
    fillPx(targetCtx, 188, 130, 6, 4, "#5d3c28");
    fillPx(targetCtx, 202, 130, 6, 4, "#5d3c28");
  }
  fillPx(targetCtx, 184, 116, 28, 8, "#d6b14d");
  fillPx(targetCtx, 188, 108, 20, 8, "#f7e49f");
  fillPx(targetCtx, 170, 146, 50, 56, "#ef8fcb");
  fillPx(targetCtx, 168, 154, 10, 26, "#f3c1d9");
  fillPx(targetCtx, 214, 152, 10, 26, "#f3c1d9");
  fillPx(targetCtx, 180, 202, 10, 26, "#ef8fcb");
  fillPx(targetCtx, 202, 198, 10, 30, "#ef8fcb");
  fillPx(targetCtx, 180, 228, 10, 6, "#7a4a34");
  fillPx(targetCtx, 202, 228, 10, 6, "#7a4a34");
  fillPx(targetCtx, 346, 112, 44, 18, "#ece8dc");
  fillPx(targetCtx, 340, 128, 56, 24, "#f0c3a4");
  fillPx(targetCtx, 334, 124, 12, 12, "#4d3c35");
  fillPx(targetCtx, 390, 124, 12, 12, "#4d3c35");
  fillPx(targetCtx, 340, 136, 18, 8, "#1f2229");
  fillPx(targetCtx, 376, 136, 18, 8, "#1f2229");
  fillPx(targetCtx, 344, 138, 10, 4, "#9dc7ff");
  fillPx(targetCtx, 378, 138, 10, 4, "#9dc7ff");
  if (wizardBlink) {
    fillPx(targetCtx, 348, 144, 4, 2, "#2d241f");
    fillPx(targetCtx, 382, 144, 4, 2, "#2d241f");
  } else {
    fillPx(targetCtx, 348, 142, 4, 4, "#2d241f");
    fillPx(targetCtx, 382, 142, 4, 4, "#2d241f");
  }
  fillPx(targetCtx, 360, 154, 18, 8, "#6a564f");
  fillPx(targetCtx, 350, 162, 40, 18, "#5d4b43");
  fillPx(targetCtx, 336, 180, 64, 52, "#f4f0e8");
  fillPx(targetCtx, 324, 190, 14, 44, "#e0dbd2");
  fillPx(targetCtx, 398, 190, 14, 44, "#e0dbd2");
  fillPx(targetCtx, 354, 182, 10, 44, "#d6b14d");
  fillPx(targetCtx, 364, 182, 12, 44, "#fff2bf");
  fillPx(targetCtx, 376, 182, 10, 44, "#d6b14d");
  fillPx(targetCtx, 406, 120, 10, 86, "#7a5a31");
  fillPx(targetCtx, 398, 102, 26, 18, "#ffd861");
  fillPx(targetCtx, 404, 94, 14, 8, "#fff1a8");
  for (let i = 0; i < 18; i += 1) {
    const x = (i * 28 + (state.animClock * 42) % 26) % w;
    const y = (i * 17 + state.animClock * 18) % 118;
    fillPx(targetCtx, x, y, 8, 10, i % 3 === 0 ? "#ffd861" : i % 3 === 1 ? "#ef8fcb" : "#8fd2ff");
  }
}

function drawSupplementaryArt() {
  if (state.screen === "title") {
    drawTitleScene();
    return;
  }

  if (state.screen === "castle") {
    drawWizardPortrait(wizardArtCtx, wizardArtCanvas.width, wizardArtCanvas.height, "guide");
    return;
  }

  if (state.screen === "quiz") {
    drawWizardPortrait(quizWizardArtCtx, quizWizardArtCanvas.width, quizWizardArtCanvas.height, "guide");
    return;
  }

  if (state.screen === "win") {
    drawWinScene();
  }
}

function drawSparkles() {
  for (const sparkle of state.sparkles) {
    ctx.globalAlpha = Math.max(0, sparkle.life);
    ctx.fillStyle = sparkle.hue;
    ctx.fillRect(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
  }
  ctx.globalAlpha = 1;
}

function drawWarning() {
  if (isDragonFrozen()) {
    ctx.fillStyle = "rgba(80, 179, 226, 0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e5fbff";
    ctx.font = "bold 28px Trebuchet MS";
    ctx.fillText(`${dragonName()} esta inmovilizada.`, 420, 70);
    return;
  }

  if (isProtectedByAbility()) {
    ctx.fillStyle = "rgba(255, 186, 72, 0.14)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff1bf";
    ctx.font = "bold 28px Trebuchet MS";
    ctx.fillText("El escudo te protege.", 450, 70);
    return;
  }

  if (state.danger < 82) {
    return;
  }

  ctx.fillStyle = "rgba(180, 27, 27, 0.24)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffe8e8";
  ctx.font = "bold 28px Trebuchet MS";
  ctx.fillText(`${dragonName()} ruge muy cerca.`, 420, 70);
}

function drawGame() {
  drawBackground();

  for (const key of state.keysOnField) {
    drawKey(key);
  }
  for (const tree of state.trees) {
    drawTree(tree);
  }
  for (const obstacle of state.obstacles) {
    drawObstacle(obstacle);
  }

  drawDragon();
  drawCrownProjectile();
  drawPlayer();
  drawSparkles();
  drawWarning();

  if (state.nearTree && !state.hidden && (state.gamePhase === "running" || state.gamePhase === "finalRun")) {
    ctx.fillStyle = "rgba(255, 231, 159, 0.95)";
    ctx.font = "bold 24px Trebuchet MS";
    ctx.fillText("Esconder disponible", 920, 110);
    ctx.beginPath();
    ctx.moveTo(1010, 120);
    ctx.lineTo(990, 156);
    ctx.lineTo(1030, 156);
    ctx.fill();
  }
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;

  if (state.screen !== "game") {
    state.animClock += dt * 0.8;
  }

  updateWorld(dt);
  if (state.screen === "game") {
    drawGame();
  }
  drawSupplementaryArt();

  if (state.toastTimer > 0) {
    state.toastTimer -= dt;
    if (state.toastTimer <= 0) {
      labels.toast.classList.add("hidden");
    }
  }
  if (state.subtitleTimer > 0) {
    state.subtitleTimer -= dt;
    if (state.subtitleTimer <= 0) {
      labels.subtitle.classList.add("hidden");
    }
  }

  updateDebugPanel(dt);

  requestAnimationFrame(loop);
}

updateHud();
updateButtons();
updateKnightSkinLabel();
updatePrincessSkinLabel();
updateDragonSkinLabel();
updateNarrativeText();
requestAnimationFrame(loop);
