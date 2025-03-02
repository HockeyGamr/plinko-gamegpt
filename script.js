const board = document.querySelector('.plinko-board');
const betAmountInput = document.getElementById('betAmount');
const dropButton = document.getElementById('dropButton');
const resultText = document.getElementById('resultText');

const PAYOUTS = [5.6, 2.1, 0.5, 0.5]; // Payout multipliers
const ROWS = 9; // Number of rows
const PEG_SPACING = 30; // Spacing between pegs

// Create the Plinko board with pegs and slots
function createBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= row; col++) {
      const peg = document.createElement('div');
      peg.className = 'peg';
      peg.style.left = `${150 - (row * PEG_SPACING / 2) + col * PEG_SPACING}px`;
      peg.style.top = `${50 + row * PEG_SPACING}px`;
      board.appendChild(peg);
    }
  }

  // Create slots at the bottom
  const slotValues = ['5.6x', '2.1x', '0.5x', '0.5x'];
  slotValues.forEach((value, index) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.textContent = value;
    slot.style.left = `${50 + index * 75}px`;
    slot.style.top = `${350}px`;
    board.appendChild(slot);
  });
}

// Simulate the chip falling
function dropChip() {
  const betAmount = parseFloat(betAmountInput.value);
  if (isNaN(betAmount) {
    alert('Please enter a valid bet amount.');
    return;
  }

  let position = 0; // Start in the middle
  const chip = document.createElement('div');
  chip.className = 'peg';
  chip.style.backgroundColor = 'red';
  chip.style.left = `${150}px`;
  chip.style.top = `${20}px`;
  board.appendChild(chip);

  const interval = setInterval(() => {
    position += Math.random() < 0.5 ? -1 : 1; // Move left or right
    chip.style.left = `${150 + position * 10}px`;
    chip.style.top = `${parseInt(chip.style.top) + 10}px`;

    if (parseInt(chip.style.top) >= 350) {
      clearInterval(interval);
      const payout = getPayout(position);
      const winnings = betAmount * payout;
      resultText.textContent = `Payout: ${payout}x | You win: ${winnings.toFixed(2)}`;
      setTimeout(() => board.removeChild(chip), 1000); // Remove chip after landing
    }
  }, 50);
}

// Determine the payout based on the final position
function getPayout(position) {
  if (position < -2) return PAYOUTS[0];
  if (position < 0) return PAYOUTS[1];
  if (position < 2) return PAYOUTS[2];
  return PAYOUTS[3];
}

// Initialize the game
createBoard();
dropButton.addEventListener('click', dropChip);