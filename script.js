const board = document.querySelector('.plinko-board');
const betAmountInput = document.getElementById('betAmount');
const dropButton = document.getElementById('dropButton');
const resultText = document.getElementById('resultText');

const PAYOUTS = [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6]; // Payout multipliers
const ROWS = 10; // Number of rows (increased from 9 to 10)
const PEG_SPACING = 30; // Spacing between pegs
const SLOT_WIDTH = 37.5; // Width of each slot (adjusted for 8 slots)
const BOARD_WIDTH = 300; // Width of the Plinko board

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
  const slotValues = ['5.6x', '2.1x', '1.1x', '1x', '0.5x', '1x', '1.1x', '2.1x', '5.6x'];
  slotValues.forEach((value, index) => {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.textContent = value;
    slot.style.left = `${index * SLOT_WIDTH}px`;
    slot.style.top = `${350}px`;
    board.appendChild(slot);
  });
}

// Simulate the chip falling with gravity and bouncing
function dropChip() {
  const betAmount = parseFloat(betAmountInput.value);
  if (isNaN(betAmount)) {
    alert('Please enter a valid bet amount.');
    return;
  }

  let position = 0; // Start in the middle
  let velocityY = 0; // Vertical velocity
  const gravity = 0.5; // Gravity effect
  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.style.left = `${150}px`;
  chip.style.top = `${20}px`;
  board.appendChild(chip);

  const interval = setInterval(() => {
    // Apply gravity
    velocityY += gravity;
    chip.style.top = `${parseInt(chip.style.top) + velocityY}px`;

    // Move left or right randomly
    position += Math.random() < 0.5 ? -1 : 1;
    chip.style.left = `${150 + position * 10}px`;

    // Check if the chip hits the bottom
    if (parseInt(chip.style.top) >= 350) {
      clearInterval(interval);
      const payout = getPayout(position);
      const winnings = betAmount * payout;
      resultText.textContent = `Payout: ${payout}x | You win: ${winnings.toFixed(2)}`;
      setTimeout(() => board.removeChild(chip), 1000); // Remove chip after landing
    }
  }, 20);
}

// Determine the payout based on the final position
function getPayout(position) {
  // Map the position to a slot index
  const slotIndex = Math.floor((position + 4) / (SLOT_WIDTH / 2));
  return PAYOUTS[slotIndex] || PAYOUTS[PAYOUTS.length - 1];
}

// Initialize the game
createBoard();
dropButton.addEventListener('click', dropChip);