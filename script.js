// Global variables
let balance = 1000;
let currentGame = null;

// DOM elements
const balanceElement = document.getElementById('balance');
const menBtn = document.getElementById('menBtn');
const boysBtn = document.getElementById('boysBtn');
const childrenBtn = document.getElementById('childrenBtn');
const menSection = document.getElementById('menSection');
const boysSection = document.getElementById('boysSection');
const childrenSection = document.getElementById('childrenSection');
const boysContent = document.getElementById('boysContent');
const childrenContent = document.getElementById('childrenContent');
const gameModal = document.getElementById('gameModal');
const gameContainer = document.getElementById('gameContainer');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateBalance();
    loadExternalContent('boys.html', boysContent);
    loadExternalContent('children.html', childrenContent);
    
    // Event listeners for category buttons
    menBtn.addEventListener('click', () => switchCategory('men'));
    boysBtn.addEventListener('click', () => switchCategory('boys'));
    childrenBtn.addEventListener('click', () => switchCategory('children'));
});

// Update balance display
function updateBalance() {
    balanceElement.textContent = balance;
}

// Switch between categories
function switchCategory(category) {
    menSection.style.display = 'none';
    boysSection.style.display = 'none';
    childrenSection.style.display = 'none';
    
    menBtn.classList.remove('active');
    boysBtn.classList.remove('active');
    childrenBtn.classList.remove('active');
    
    switch(category) {
        case 'men':
            menSection.style.display = 'block';
            menBtn.classList.add('active');
            break;
        case 'boys':
            boysSection.style.display = 'block';
            boysBtn.classList.add('active');
            break;
        case 'children':
            childrenSection.style.display = 'block';
            childrenBtn.classList.add('active');
            break;
    }
}

// Load external content
function loadExternalContent(url, container) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;
        })
        .catch(error => {
            container.innerHTML = `<p>Error loading content: ${error.message}</p>`;
        });
}

// Load game into modal
function loadGame(game) {
    currentGame = game;
    gameContainer.innerHTML = '';
    
    switch(game) {
        case 'slots':
            loadSlotGame();
            break;
        case 'blackjack':
            loadBlackjackGame();
            break;
        case 'roulette':
            loadRouletteGame();
            break;
        case 'dice':
            loadDiceGame();
            break;
        case 'poker':
            loadPokerGame();
            break;
    }
    
    gameModal.style.display = 'block';
}

// Close modal
function closeModal() {
    gameModal.style.display = 'none';
    gameContainer.innerHTML = '';
    currentGame = null;
}

// Adjust balance
function adjustBalance(amount) {
    balance += amount;
    updateBalance();
}

// Check if player can afford bet
function canAfford(bet) {
    return balance >= bet;
}

// Slot Machine Game
function loadSlotGame() {
    gameContainer.innerHTML = `
        <div class="slot-machine">
            <h2>Lucky Slots</h2>
            <p>Bet $10 to spin!</p>
            <div class="slot-reels">
                <div class="reel" id="reel1">🍒</div>
                <div class="reel" id="reel2">🍒</div>
                <div class="reel" id="reel3">🍒</div>
            </div>
            <button id="spinBtn" class="game-btn">SPIN</button>
            <div id="slotResult" class="game-result"></div>
        </div>
    `;
    
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.addEventListener('click', spinSlots);
    
    // Add some basic styling
    const style = document.createElement('style');
    style.textContent = `
        .slot-machine {
            text-align: center;
            padding: 1rem;
        }
        .slot-reels {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
        }
        .reel {
            width: 80px;
            height: 80px;
            background-color: #fff;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        .game-btn {
            padding: 0.8rem 2rem;
            font-size: 1.2rem;
            background-color: #ffd700;
            color: #000;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .game-btn:hover {
            background-color: #ffc800;
        }
        .game-btn:disabled {
            background-color: #666;
            cursor: not-allowed;
        }
        .game-result {
            margin-top: 1rem;
            font-size: 1.2rem;
            min-height: 2rem;
        }
    `;
    document.head.appendChild(style);
}

function spinSlots() {
    if (!canAfford(10)) {
        document.getElementById('slotResult').textContent = "Not enough money!";
        return;
    }
    
    adjustBalance(-10);
    const spinBtn = document.getElementById('spinBtn');
    spinBtn.disabled = true;
    document.getElementById('slotResult').textContent = "Spinning...";
    
    const symbols = ['🍒', '🍋', '🍊', '🍇', '🍉', '7'];
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    
    let spins = 0;
    const totalSpins = 20;
    const spinInterval = setInterval(() => {
        reels.forEach(reel => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            reel.textContent = randomSymbol;
        });
        
        spins++;
        if (spins >= totalSpins) {
            clearInterval(spinInterval);
            spinBtn.disabled = false;
            checkSlotResult();
        }
    }, 100);
}

function checkSlotResult() {
    const reel1 = document.getElementById('reel1').textContent;
    const reel2 = document.getElementById('reel2').textContent;
    const reel3 = document.getElementById('reel3').textContent;
    const resultElement = document.getElementById('slotResult');
    
    if (reel1 === '7' && reel2 === '7' && reel3 === '7') {
        resultElement.textContent = "JACKPOT! You win $500!";
        adjustBalance(500);
    } else if (reel1 === reel2 && reel2 === reel3) {
        resultElement.textContent = "Three of a kind! You win $100!";
        adjustBalance(100);
    } else if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
        resultElement.textContent = "Two of a kind! You win $20!";
        adjustBalance(20);
    } else {
        resultElement.textContent = "No win this time. Try again!";
    }
}

// Blackjack Game
function loadBlackjackGame() {
    gameContainer.innerHTML = `
        <div class="blackjack-game">
            <h2>Blackjack</h2>
            <p>Try to beat the dealer without going over 21</p>
            <div class="game-area">
                <div class="dealer-area">
                    <h3>Dealer's Cards</h3>
                    <div id="dealerCards" class="cards"></div>
                    <div id="dealerTotal" class="total"></div>
                </div>
                <div class="player-area">
                    <h3>Your Cards</h3>
                    <div id="playerCards" class="cards"></div>
                    <div id="playerTotal" class="total"></div>
                </div>
            </div>
            <div class="controls">
                <button id="dealBtn" class="game-btn">Deal ($10)</button>
                <button id="hitBtn" class="game-btn" disabled>Hit</button>
                <button id="standBtn" class="game-btn" disabled>Stand</button>
            </div>
            <div id="blackjackResult" class="game-result"></div>
        </div>
    `;
    
    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .blackjack-game {
            text-align: center;
            padding: 1rem;
        }
        .game-area {
            display: flex;
            justify-content: space-around;
            margin: 2rem 0;
        }
        .dealer-area, .player-area {
            width: 45%;
        }
        .cards {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            justify-content: center;
            min-height: 120px;
        }
        .card {
            width: 60px;
            height: 90px;
            background-color: #fff;
            color: #000;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
        .total {
            margin-top: 1rem;
            font-size: 1.2rem;
        }
        .controls {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Game logic
    let deck = [];
    let dealerHand = [];
    let playerHand = [];
    let gameOver = false;
    
    const dealBtn = document.getElementById('dealBtn');
    const hitBtn = document.getElementById('hitBtn');
    const standBtn = document.getElementById('standBtn');
    const resultElement = document.getElementById('blackjackResult');
    
    dealBtn.addEventListener('click', deal);
    hitBtn.addEventListener('click', hit);
    standBtn.addEventListener('click', stand);
    
    function createDeck() {
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        deck = [];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        
        // Simple shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    function deal() {
        if (!canAfford(10)) {
            resultElement.textContent = "Not enough money!";
            return;
        }
        
        adjustBalance(-10);
        gameOver = false;
        createDeck();
        dealerHand = [drawCard(), drawCard()];
        playerHand = [drawCard(), drawCard()];
        
        updateDisplay();
        resultElement.textContent = "";
        
        dealBtn.disabled = true;
        hitBtn.disabled = false;
        standBtn.disabled = false;
        
        // Check for blackjack
        if (calculateHandValue(playerHand) === 21) {
            stand();
        }
    }
    
    function drawCard() {
        return deck.pop();
    }
    
    function hit() {
        playerHand.push(drawCard());
        updateDisplay();
        
        if (calculateHandValue(playerHand) > 21) {
            stand();
        }
    }
    
    function stand() {
        gameOver = true;
        dealBtn.disabled = false;
        hitBtn.disabled = true;
        standBtn.disabled = true;
        
        // Dealer draws until 17 or higher
        while (calculateHandValue(dealerHand) < 17 && calculateHandValue(dealerHand) > 0) {
            dealerHand.push(drawCard());
        }
        
        updateDisplay(true);
        determineWinner();
    }
    
    function updateDisplay(showDealerCard = false) {
        const dealerCardsElement = document.getElementById('dealerCards');
        const playerCardsElement = document.getElementById('playerCards');
        const dealerTotalElement = document.getElementById('dealerTotal');
        const playerTotalElement = document.getElementById('playerTotal');
        
        // Dealer cards
        dealerCardsElement.innerHTML = '';
        if (showDealerCard) {
            dealerHand.forEach(card => {
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.textContent = `${card.value}${card.suit}`;
                dealerCardsElement.appendChild(cardElement);
            });
            dealerTotalElement.textContent = `Total: ${calculateHandValue(dealerHand)}`;
        } else {
            // Show first card and hide the second
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.textContent = `${dealerHand[0].value}${dealerHand[0].suit}`;
            dealerCardsElement.appendChild(cardElement);
            
            const hiddenCard = document.createElement('div');
            hiddenCard.className = 'card';
            hiddenCard.textContent = '🂠';
            dealerCardsElement.appendChild(hiddenCard);
            
            dealerTotalElement.textContent = '';
        }
        
        // Player cards
        playerCardsElement.innerHTML = '';
        playerHand.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.textContent = `${card.value}${card.suit}`;
            playerCardsElement.appendChild(cardElement);
        });
        playerTotalElement.textContent = `Total: ${calculateHandValue(playerHand)}`;
    }
    
    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        
        for (let card of hand) {
            if (card.value === 'A') {
                value += 11;
                aces++;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }
    
    function determineWinner() {
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);
        
        if (playerValue > 21) {
            resultElement.textContent = "You busted! Dealer wins.";
        } else if (dealerValue > 21) {
            resultElement.textContent = "Dealer busted! You win $20!";
            adjustBalance(20);
        } else if (playerValue === dealerValue) {
            resultElement.textContent = "Push! You get your $10 back.";
            adjustBalance(10);
        } else if (playerValue > dealerValue) {
            resultElement.textContent = "You win $20!";
            adjustBalance(20);
        } else {
            resultElement.textContent = "Dealer wins!";
        }
    }
}

// Roulette Game
function loadRouletteGame() {
    gameContainer.innerHTML = `
        <div class="roulette-game">
            <h2>Roulette</h2>
            <p>Bet $10 on a number or color</p>
            <div class="roulette-wheel">
                <div id="wheel" class="wheel"></div>
                <div id="ball" class="ball"></div>
            </div>
            <div class="betting-options">
                <div class="number-bets">
                    <h3>Numbers</h3>
                    <div class="numbers-grid">
                        ${Array.from({ length: 37 }, (_, i) => 
                            `<div class="number ${i === 0 ? 'green' : i % 2 === 1 ? 'red' : 'black'}" 
                                  onclick="placeRouletteBet(${i}, 'number')">${i}</div>`
                        ).join('')}
                    </div>
                </div>
                <div class="color-bets">
                    <h3>Colors</h3>
                    <button onclick="placeRouletteBet('red', 'color')" class="red-bet">Red (1:1)</button>
                    <button onclick="placeRouletteBet('black', 'color')" class="black-bet">Black (1:1)</button>
                    <button onclick="placeRouletteBet('green', 'color')" class="green-bet">Green (17:1)</button>
                </div>
            </div>
            <div class="controls">
                <button id="spinRoulette" class="game-btn">Spin</button>
            </div>
            <div id="rouletteResult" class="game-result"></div>
            <div id="currentBet" class="current-bet"></div>
        </div>
    `;
    
    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .roulette-game {
            text-align: center;
            padding: 1rem;
        }
        .roulette-wheel {
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background-color: #1a1a1a;
            margin: 1rem auto;
            position: relative;
            border: 5px solid #333;
        }
        .wheel {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
        }
        .ball {
            width: 20px;
            height: 20px;
            background-color: white;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
        }
        .betting-options {
            display: flex;
            justify-content: space-around;
            margin: 2rem 0;
            flex-wrap: wrap;
        }
        .number-bets, .color-bets {
            width: 45%;
            min-width: 300px;
        }
        .numbers-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 5px;
        }
        .number {
            padding: 0.5rem;
            border-radius: 50%;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .number:hover {
            transform: scale(1.1);
        }
        .red {
            background-color: #ff4444;
            color: white;
        }
        .black {
            background-color: #333;
            color: white;
        }
        .green {
            background-color: #44ff44;
            color: black;
        }
        .red-bet, .black-bet, .green-bet {
            padding: 0.8rem 1.5rem;
            margin: 0.5rem;
            border: none;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s;
        }
        .red-bet {
            background-color: #ff4444;
            color: white;
        }
        .black-bet {
            background-color: #333;
            color: white;
        }
        .green-bet {
            background-color: #44ff44;
            color: black;
        }
        .red-bet:hover, .black-bet:hover, .green-bet:hover {
            transform: scale(1.05);
        }
        .current-bet {
            margin-top: 1rem;
            font-size: 1.1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Game variables
    let currentBet = null;
    let spinning = false;
    
    // Place bet
    window.placeRouletteBet = function(value, type) {
        if (spinning) return;
        
        if (!canAfford(10)) {
            document.getElementById('rouletteResult').textContent = "Not enough money!";
            return;
        }
        
        currentBet = { value, type };
        document.getElementById('currentBet').textContent = 
            `Current bet: $10 on ${type === 'number' ? 'number ' + value : value}`;
    };
    
    // Spin roulette
    document.getElementById('spinRoulette').addEventListener('click', spinRoulette);
    
    function spinRoulette() {
        if (spinning || !currentBet) return;
        
        if (!canAfford(10)) {
            document.getElementById('rouletteResult').textContent = "Not enough money!";
            return;
        }
        
        adjustBalance(-10);
        spinning = true;
        const resultElement = document.getElementById('rouletteResult');
        resultElement.textContent = "Spinning...";
        
        const wheel = document.getElementById('wheel');
        const ball = document.getElementById('ball');
        
        // Reset wheel
        wheel.innerHTML = '';
        ball.style.display = 'block';
        
        // Create wheel segments
        const segments = 37; // 0-36
        const segmentAngle = 360 / segments;
        
        for (let i = 0; i < segments; i++) {
            const segment = document.createElement('div');
            segment.className = 'wheel-segment';
            segment.style.position = 'absolute';
            segment.style.width = '50%';
            segment.style.height = '50%';
            segment.style.transformOrigin = '100% 100%';
            segment.style.transform = `rotate(${i * segmentAngle}deg)`;
            segment.style.clipPath = 'polygon(0 0, 100% 100%, 100% 0)';
            
            const number = document.createElement('div');
            number.className = 'wheel-number';
            number.textContent = i;
            number.style.position = 'absolute';
            number.style.bottom = '10px';
            number.style.right = '10px';
            number.style.transform = 'rotate(90deg)';
            
            if (i === 0) {
                segment.style.backgroundColor = '#44ff44';
            } else if (i % 2 === 1) {
                segment.style.backgroundColor = '#ff4444';
            } else {
                segment.style.backgroundColor = '#333';
            }
            
            segment.appendChild(number);
            wheel.appendChild(segment);
        }
        
        // Spin animation
        const spinDuration = 3000 + Math.random() * 2000; // 3-5 seconds
        const rotations = 5 + Math.random() * 3; // 5-8 full rotations
        const totalAngle = rotations * 360;
        
        // Random winning number (0-36)
        const winningNumber = Math.floor(Math.random() * 37);
        // Calculate the final angle (offset by half segment to land in middle)
        const finalAngle = totalAngle + (winningNumber * segmentAngle + segmentAngle / 2);
        
        wheel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
        wheel.style.transform = `rotate(${-finalAngle}deg)`;
        
        // Ball animation
        setTimeout(() => {
            ball.style.transition = 'all 0.5s ease-out';
            ball.style.transform = 'translate(-50%, -50%) scale(1.5)';
            
            // Move ball to edge
            setTimeout(() => {
                ball.style.transform = 'translate(-50%, -50%) scale(1) rotate(720deg)';
                
                // Determine winner after spin completes
                setTimeout(() => {
                    spinning = false;
                    ball.style.display = 'none';
                    determineRouletteWinner(winningNumber);
                }, 500);
            }, 500);
        }, spinDuration - 1000);
    }
    
    function determineRouletteWinner(winningNumber) {
        const winningColor = winningNumber === 0 ? 'green' : winningNumber % 2 === 1 ? 'red' : 'black';
        const resultElement = document.getElementById('rouletteResult');
        
        resultElement.textContent = `Landed on: ${winningNumber} (${winningColor})`;
        
        if (currentBet.type === 'number' && currentBet.value === winningNumber) {
            resultElement.textContent += " - You win $350!";
            adjustBalance(350);
        } else if (currentBet.type === 'color' && currentBet.value === winningColor) {
            if (currentBet.value === 'green') {
                resultElement.textContent += " - You win $170!";
                adjustBalance(170);
            } else {
                resultElement.textContent += " - You win $20!";
                adjustBalance(20);
            }
        } else {
            resultElement.textContent += " - You lose!";
        }
        
        currentBet = null;
        document.getElementById('currentBet').textContent = '';
    }
}

// Dice Game
function loadDiceGame() {
    gameContainer.innerHTML = `
        <div class="dice-game">
            <h2>Dice Roll</h2>
            <p>Bet $10 on high (11-18) or low (3-10)</p>
            <div class="dice-container">
                <div class="dice" id="dice1">⚀</div>
                <div class="dice" id="dice2">⚀</div>
                <div class="dice" id="dice3">⚀</div>
            </div>
            <div class="bet-options">
                <button id="betLow" class="game-btn">Bet Low (3-10)</button>
                <button id="betHigh" class="game-btn">Bet High (11-18)</button>
            </div>
            <div id="diceResult" class="game-result"></div>
        </div>
    `;
    
    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .dice-game {
            text-align: center;
            padding: 1rem;
        }
        .dice-container {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin: 2rem 0;
        }
        .dice {
            font-size: 5rem;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.5s;
        }
        .bet-options {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Game variables
    let currentBet = null;
    
    // Event listeners
    document.getElementById('betLow').addEventListener('click', () => placeDiceBet('low'));
    document.getElementById('betHigh').addEventListener('click', () => placeDiceBet('high'));
    
    function placeDiceBet(bet) {
        if (!canAfford(10)) {
            document.getElementById('diceResult').textContent = "Not enough money!";
            return;
        }
        
        currentBet = bet;
        adjustBalance(-10);
        
        // Roll animation
        const dice = [
            document.getElementById('dice1'),
            document.getElementById('dice2'),
            document.getElementById('dice3')
        ];
        
        const resultElement = document.getElementById('diceResult');
        resultElement.textContent = "Rolling...";
        
        let rolls = 0;
        const totalRolls = 10;
        const rollInterval = setInterval(() => {
            dice.forEach(die => {
                const randomValue = Math.floor(Math.random() * 6) + 1;
                die.textContent = getDiceFace(randomValue);
            });
            
            rolls++;
            if (rolls >= totalRolls) {
                clearInterval(rollInterval);
                determineDiceWinner();
            }
        }, 100);
    }
    
    function getDiceFace(value) {
        switch(value) {
            case 1: return '⚀';
            case 2: return '⚁';
            case 3: return '⚂';
            case 4: return '⚃';
            case 5: return '⚄';
            case 6: return '⚅';
            default: return '⚀';
        }
    }
    
    function determineDiceWinner() {
        const dice1Value = getDiceValue(document.getElementById('dice1').textContent);
        const dice2Value = getDiceValue(document.getElementById('dice2').textContent);
        const dice3Value = getDiceValue(document.getElementById('dice3').textContent);
        
        const total = dice1Value + dice2Value + dice3Value;
        const resultElement = document.getElementById('diceResult');
        
        resultElement.textContent = `Total: ${total} - You bet ${currentBet}`;
        
        if ((currentBet === 'low' && total >= 3 && total <= 10) || 
            (currentBet === 'high' && total >= 11 && total <= 18)) {
            resultElement.textContent += " - You win $20!";
            adjustBalance(20);
        } else if (total === 3 || total === 18) {
            resultElement.textContent += " - Extreme win! You win $100!";
            adjustBalance(100);
        } else {
            resultElement.textContent += " - You lose!";
        }
        
        currentBet = null;
    }
    
    function getDiceValue(face) {
        switch(face) {
            case '⚀': return 1;
            case '⚁': return 2;
            case '⚂': return 3;
            case '⚃': return 4;
            case '⚄': return 5;
            case '⚅': return 6;
            default: return 0;
        }
    }
}

// Video Poker Game
function loadPokerGame() {
    gameContainer.innerHTML = `
        <div class="poker-game">
            <h2>Video Poker</h2>
            <p>Bet $10 to play. Hold cards and draw to make the best hand!</p>
            <div class="poker-hand">
                <div class="card-holder" onclick="toggleHold(0)">
                    <div class="poker-card" id="card0">🂠</div>
                    <div class="hold-indicator">HOLD</div>
                </div>
                <div class="card-holder" onclick="toggleHold(1)">
                    <div class="poker-card" id="card1">🂠</div>
                    <div class="hold-indicator">HOLD</div>
                </div>
                <div class="card-holder" onclick="toggleHold(2)">
                    <div class="poker-card" id="card2">🂠</div>
                    <div class="hold-indicator">HOLD</div>
                </div>
                <div class="card-holder" onclick="toggleHold(3)">
                    <div class="poker-card" id="card3">🂠</div>
                    <div class="hold-indicator">HOLD</div>
                </div>
                <div class="card-holder" onclick="toggleHold(4)">
                    <div class="poker-card" id="card4">🂠</div>
                    <div class="hold-indicator">HOLD</div>
                </div>
            </div>
            <div class="poker-controls">
                <button id="dealPoker" class="game-btn">Deal ($10)</button>
                <button id="drawPoker" class="game-btn" disabled>Draw</button>
            </div>
            <div id="pokerResult" class="game-result"></div>
            <div class="payouts">
                <h3>Payouts:</h3>
                <p>Royal Flush: 250x</p>
                <p>Straight Flush: 50x</p>
                <p>Four of a Kind: 25x</p>
                <p>Full House: 9x</p>
                <p>Flush: 6x</p>
                <p>Straight: 4x</p>
                <p>Three of a Kind: 3x</p>
                <p>Two Pair: 2x</p>
                <p>Jacks or Better: 1x</p>
            </div>
        </div>
    `;
    
    // Add styling
    const style = document.createElement('style');
    style.textContent = `
        .poker-game {
            text-align: center;
            padding: 1rem;
        }
        .poker-hand {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem 0;
        }
        .card-holder {
            position: relative;
            cursor: pointer;
        }
        .poker-card {
            width: 80px;
            height: 120px;
            background-color: white;
            color: black;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
            box-shadow: 0 0 5px rgba(0,0,0,0.2);
        }
        .hold-indicator {
            position: absolute;
            bottom: -20px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 0.8rem;
            color: #ffd700;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .hold-indicator.active {
            opacity: 1;
        }
        .poker-controls {
            margin-bottom: 1rem;
        }
        .payouts {
            margin-top: 2rem;
            text-align: left;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
            background-color: #1e1e1e;
            padding: 1rem;
            border-radius: 5px;
        }
        .payouts h3 {
            color: #ffd700;
            margin-top: 0;
        }
        .payouts p {
            margin: 0.5rem 0;
        }
    `;
    document.head.appendChild(style);
    
    // Game variables
    let deck = [];
    let hand = [];
    let heldCards = [false, false, false, false, false];
    let gameState = 'waiting'; // 'waiting', 'dealt', 'drawing'
    
    // Event listeners
    document.getElementById('dealPoker').addEventListener('click', dealPoker);
    document.getElementById('drawPoker').addEventListener('click', drawPoker);
    
    // Global function for card holding
    window.toggleHold = function(index) {
        if (gameState !== 'dealt') return;
        
        heldCards[index] = !heldCards[index];
        const indicator = document.querySelectorAll('.hold-indicator')[index];
        indicator.classList.toggle('active');
    };
    
    function createPokerDeck() {
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        deck = [];
        
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }
        
        // Simple shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    
    function dealPoker() {
        if (!canAfford(10)) {
            document.getElementById('pokerResult').textContent = "Not enough money!";
            return;
        }
        
        adjustBalance(-10);
        gameState = 'dealt';
        createPokerDeck();
        hand = [];
        heldCards = [false, false, false, false, false];
        
        // Deal initial hand
        for (let i = 0; i < 5; i++) {
            hand.push(deck.pop());
        }
        
        updatePokerDisplay();
        
        document.getElementById('dealPoker').disabled = true;
        document.getElementById('drawPoker').disabled = false;
        
        // Reset hold indicators
        document.querySelectorAll('.hold-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        document.getElementById('pokerResult').textContent = "Select cards to hold, then click Draw";
    }
    
    function drawPoker() {
        gameState = 'drawing';
        
        // Replace cards that aren't held
        for (let i = 0; i < 5; i++) {
            if (!heldCards[i]) {
                hand[i] = deck.pop();
            }
        }
        
        updatePokerDisplay();
        
        document.getElementById('dealPoker').disabled = false;
        document.getElementById('drawPoker').disabled = true;
        
        // Evaluate hand
        evaluatePokerHand();
    }
    
    function updatePokerDisplay() {
        for (let i = 0; i < 5; i++) {
            const cardElement = document.getElementById(`card${i}`);
            if (hand[i]) {
                cardElement.textContent = getCardSymbol(hand[i]);
                
                // Color red for hearts and diamonds
                if (hand[i].suit === '♥' || hand[i].suit === '♦') {
                    cardElement.style.color = 'red';
                } else {
                    cardElement.style.color = 'black';
                }
            } else {
                cardElement.textContent = '🂠';
                cardElement.style.color = 'black';
            }
        }
    }
    
    function getCardSymbol(card) {
        // This is a simplified version - would need more complex logic for all cards
        if (card.value === '10') return '🂺'.replace('0', '10'); // Doesn't actually work for all suits
        
        const valueMap = {
            'A': '🂡', '2': '🂢', '3': '🂣', '4': '🂤', '5': '🂥',
            '6': '🂦', '7': '🂧', '8': '🂨', '9': '🂩', '10': '🂪',
            'J': '🂫', 'Q': '🂭', 'K': '🂮'
        };
        
        // This doesn't account for suits - just a simple approximation
        return valueMap[card.value] || '🂠';
    }
    
    function evaluatePokerHand() {
        const resultElement = document.getElementById('pokerResult');
        const handValue = getPokerHandValue(hand);
        let winAmount = 0;
        
        switch(handValue) {
            case 'Royal Flush':
                winAmount = 250 * 10;
                break;
            case 'Straight Flush':
                winAmount = 50 * 10;
                break;
            case 'Four of a Kind':
                winAmount = 25 * 10;
                break;
            case 'Full House':
                winAmount = 9 * 10;
                break;
            case 'Flush':
                winAmount = 6 * 10;
                break;
            case 'Straight':
                winAmount = 4 * 10;
                break;
            case 'Three of a Kind':
                winAmount = 3 * 10;
                break;
            case 'Two Pair':
                winAmount = 2 * 10;
                break;
            case 'Jacks or Better':
                winAmount = 1 * 10;
                break;
            default:
                winAmount = 0;
        }
        
        if (winAmount > 0) {
            resultElement.textContent = `${handValue}! You win $${winAmount}!`;
            adjustBalance(winAmount);
        } else {
            resultElement.textContent = "No winning hand. Try again!";
        }
    }
    
    function getPokerHandValue(cards) {
        // Simplified evaluation - in a real game you'd need more complex logic
        const values = cards.map(card => card.value);
        const suits = cards.map(card => card.suit);
        
        // Check for flush (all same suit)
        const isFlush = suits.every(suit => suit === suits[0]);
        
        // Check for straight (would need more logic for Ace-low straight)
        const valueOrder = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const sortedValues = [...values].sort((a, b) => valueOrder.indexOf(a) - valueOrder.indexOf(b));
        let isStraight = true;
        for (let i = 1; i < sortedValues.length; i++) {
            if (valueOrder.indexOf(sortedValues[i]) !== valueOrder.indexOf(sortedValues[i-1]) + 1) {
                isStraight = false;
                break;
            }
        }
        
        // Check for royal (A, K, Q, J, 10)
        const isRoyal = ['A', 'K', 'Q', 'J', '10'].every(val => values.includes(val));
        
        // Count duplicates
        const valueCounts = {};
        values.forEach(value => {
            valueCounts[value] = (valueCounts[value] || 0) + 1;
        });
        const duplicates = Object.values(valueCounts).sort((a, b) => b - a);
        
        // Determine hand value
        if (isRoyal && isFlush) return 'Royal Flush';
        if (isStraight && isFlush) return 'Straight Flush';
        if (duplicates[0] === 4) return 'Four of a Kind';
        if (duplicates[0] === 3 && duplicates[1] === 2) return 'Full House';
        if (isFlush) return 'Flush';
        if (isStraight) return 'Straight';
        if (duplicates[0] === 3) return 'Three of a Kind';
        if (duplicates[0] === 2 && duplicates[1] === 2) return 'Two Pair';
        if (['J', 'Q', 'K', 'A'].some(face => duplicates[face] === 2)) return 'Jacks or Better';
        
        return 'No Win';
    }
}