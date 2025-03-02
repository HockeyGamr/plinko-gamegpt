const board = document.querySelector('.plinko-board');
const betAmountInput = document.getElementById('betAmount');
const dropButton = document.getElementById('dropButton');
const resultText = document.getElementById('resultText');

const PAYOUTS = [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6]; // Payout multipliers
const ROWS = 10; // Number of rows
const PEG_SPACING = 40; // Increased spacing for larger board
const SLOT_WIDTH = 40; // Adjusted for better fit
const BOARD_WIDTH = 600; // Increased board width
const CHIP_SIZE = 20; // Increased chip size
const GRAVITY = 0.2; // Slower gravity for realism
const BOUNCE_FACTOR = 0.6; // Bounce effect when hitting pegs

// Create the Plinko board with pegs and slots
function createBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= row; col++) {
      const peg = document.createElement('div');
      peg.className = 'peg';
      peg.style.left = `${300 - (row * PEG_SPACING / 2) + col * PEG_SPACING}px`;
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
    slot.style.top = `${450}px`; // Adjusted position
    board.appendChild(slot);
  });
}

// Simulate the chip falling with gravity, bouncing, and peg collisions
function dropChip() {
  const betAmount = parseFloat(betAmountInput.value);
  if (isNaN(betAmount)) {
    alert('Please enter a valid bet amount.');
    return;
  }

  let position = 0; // Start in the middle
  let velocityY = 0; // Vertical velocity
  const chip = document.createElement('div');
  chip.className = 'chip';
  chip.style.width = `${CHIP_SIZE}px`;
  chip.style.height = `${CHIP_SIZE}px`;
  chip.style.left = `${300}px`;
  chip.style.top = `${20}px`;
  board.appendChild(chip);

  const interval = setInterval(() => {
    // Apply gravity
    velocityY += GRAVITY;
    chip.style.top = `${parseInt(chip.style.top) + velocityY}px`;

    // Move left or right randomly (slower movement)
    position += (Math.random() < 0.5 ? -0.5 : 0.5);
    chip.style.left = `${300 + position * 10}px`;

    // Check for collisions with pegs
    const pegs = document.querySelectorAll('.peg');
    pegs.forEach(peg => {
      const pegRect = peg.getBoundingClientRect();
      const chipRect = chip.getBoundingClientRect();

      if (
        chipRect.left < pegRect.right &&
        chipRect.right > pegRect.left &&
        chipRect.top < pegRect.bottom &&
        chipRect.bottom > pegRect.top
      ) {
        // Bounce off the peg
        velocityY *= -BOUNCE_FACTOR;
        position += (Math.random() < 0.5 ? -1 : 1); // Random horizontal bounce
      }
    });

    // Check if the chip hits the bottom
    if (parseInt(chip.style.top) >= 450) {
      clearInterval(interval);
      const payout = getPayout(position);
      const winnings = betAmount * payout;
      resultText.textContent = `Payout: ${payout}x | You win: ${winnings.toFixed(2)}`;
      setTimeout(() => board.removeChild(chip), 1000); // Remove chip after landing
    }
  }, 30); // Slower interval for smoother movement
}

// Determine the payout based on the final position
function getPayout(position) {
  const slotIndex = Math.floor((position + 4) / (SLOT_WIDTH / 2));
  return PAYOUTS[slotIndex] || PAYOUTS[PAYOUTS.length - 1];
}

// Initialize the game
createBoard();
dropButton.addEventListener('click', dropChip);