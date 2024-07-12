let poolCounter = 0;

// Get audio elements
const createSound = document.getElementById("createSound");
const deleteSound = document.getElementById("deleteSound");
const rollSound = document.getElementById("rollSound");
const sighSound = document.getElementById("sighSound");
const depleteSound = document.getElementById("depleteSound");

function generateRandomName() {
  const descriptions = ["Deadly", "Challenging", "Unexpected", "Mysterious", "Perilous", "Treacherous", "Grim", "Dire"];
  const nouns = ["Encounter", "Situation", "Predicament", "Quest", "Trial", "Conflict", "Mission", "Adventure"];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${randomDescription}${randomNoun}${randomSuffix}`;
}

function createPool(diceCount) {
  const poolName = generateRandomName();
  addPool(poolName, diceCount);
  playSound(createSound);  // Play create sound
}

function createCustomPool() {
  const diceCount = parseInt(document.getElementById("customDice").value, 10);
  if (diceCount > 0) {
    createPool(diceCount);
  }
}

function addPool(name, diceCount) {
  const poolContainer = document.getElementById("poolsContainer");
  const poolId = `pool${++poolCounter}`;
  
  const poolElement = document.createElement("div");
  poolElement.className = "pool";
  poolElement.id = poolId;

  const rollButton = document.createElement("button");
  rollButton.textContent = "Roll";
  rollButton.onclick = () => {
    if (isPoolDepleted(poolId)) {
      playSound(sighSound);  // Play sigh sound
    } else {
      rollPool(poolId);
      playSound(rollSound);  // Play roll sound
    }
  };

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.onclick = () => {
    deletePool(poolId);
    playSound(deleteSound);  // Play delete sound
  };

  const nameElement = document.createElement("span");
  nameElement.className = "poolName";
  nameElement.contentEditable = true;
  nameElement.textContent = name;
  nameElement.addEventListener('focus', function() {
    const range = document.createRange();
    range.selectNodeContents(nameElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });
  nameElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent newline
      nameElement.blur(); // Commit changes by blurring the element
    }
  });

  const diceElement = document.createElement("div");
  diceElement.className = "poolDice";
  diceElement.id = `${poolId}-dice`;

  for (let i = 0; i < diceCount; i++) {
    const dieElement = document.createElement("div");
    dieElement.className = "die";
    dieElement.textContent = "d6";
    diceElement.appendChild(dieElement);
  }

  poolElement.appendChild(rollButton);
  poolElement.appendChild(deleteButton);
  poolElement.appendChild(nameElement);
  poolElement.appendChild(diceElement);

  poolContainer.appendChild(poolElement);
}

function rollPool(poolId) {
  const diceElement = document.getElementById(`${poolId}-dice`);
  const dice = diceElement.children;

  for (let die of dice) {
    if (!die.classList.contains("removed")) {
      const roll = Math.floor(Math.random() * 6) + 1;
      die.textContent = roll;
      if (roll <= 3) {
        die.classList.add("removed");
      }
      die.classList.add("roll");
    }
  }

  setTimeout(() => {
    for (let die of dice) {
      die.classList.remove("roll");
    }

    const remainingDice = Array.from(dice).filter(die => !die.classList.contains("removed"));
    if (remainingDice.length === 0) {
      const poolElement = document.getElementById(poolId);
      const nameElement = poolElement.querySelector('.poolName');
      nameElement.classList.add("depleted");
      for (let die of dice) {
        die.classList.add("depleted");
      }
      playSound(depleteSound);  // Play deplete sound
    }
  }, 500);
}

function deletePool(poolId) {
  const poolElement = document.getElementById(poolId);
  poolElement.remove();
}

function isPoolDepleted(poolId) {
  const diceElement = document.getElementById(`${poolId}-dice`);
  const dice = diceElement.children;
  return Array.from(dice).every(die => die.classList.contains("removed"));
}

function playSound(audioElement) {
  const clone = audioElement.cloneNode();
  clone.play().catch(error => console.error('Error playing sound:', error));
}
