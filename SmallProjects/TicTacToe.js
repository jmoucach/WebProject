let scores = {X: -10, O: 10, Tie: 0};
let grid;
let turn;
let winner;
let isIA;
let isMinMax;

function setup() {
	cnv = createCanvas(800, 800);
	cnv.parent('TicTacToe');
	centerCanvas();

	textAlign(CENTER);
	noFill();
	strokeWeight(4);
	grid = new Array(9);
	resetGrid()
}

function selectHuman() {
	isIA = false;
	isMinMax = false;
	resetGrid()
}

function selectIA() {
	isIA = true;
	isMinMax = false;
	resetGrid()
}

function selectMinMax() {
	isIA = true;
	isMinMax = true;
	resetGrid()
}

function centerCanvas() {
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x, y);
}

function mousePressed() {
	
	let gridX = -1;
	let gridY = -1;
	for (let i = 1; i <= 3; i++) {
		if (mouseX <= width * i / 3 && mouseX > 0) {
			gridX = i - 1;
			break ;
		}
	}
	
	for (let i = 1; i <= 3; i++) {
		if (mouseY <= height * i / 3 && mouseY > 0) {
			gridY = i - 1;
			break ;
		}
	}
	if (gridX != -1 && gridY != -1) {
		if (grid[gridX + 3 * gridY] == 0 && turn % 2 == 0) {
			grid[gridX + 3 * gridY] = 'O';
			turn++;
		} else if (grid[gridX + 3 * gridY] == 0 && turn % 2 == 1) {
			grid[gridX + 3 * gridY] = 'X';
			turn++;
		}
	}
	if (turn >= 5) {
		winner = checkWin();
	}
}

function checkWin() {
	for (let i = 0; i <= 6; i += 3) { // Horizontal check
		if (grid[i] == grid[i + 1] && grid[i] == grid[i + 2] && grid[i] != 0) {
			return ((grid[i] == 'X') ? 'X' : 'O');
		}
	}
	
	for (let i = 0; i <= 2; i++) { // vertical check
		if (grid[i] == grid[i + 3] && grid[i] == grid[i + 6] && grid[i] != 0) {
			return ((grid[i] == 'X') ? 'X' : 'O');
		}
	}
	
	if (((grid[0] == grid[4] && grid[0] == grid[8])
	|| (grid[2] == grid[4] && grid[2] == grid[6])) && grid[4] != 0) {
		return ((grid[4] == 'X') ? 'X' : 'O');
	}
	
	for (let i = 0; i < 9; i++) {
		if (grid[i] == 0) {
			break ;
		}
		if (i == 8) {
			return ('Tie');
		}
	}
	return null;
}

function cross(x, y, width, height) {
	line(x + width / 2, y + height / 2, x - width / 2, y - height / 2);
	line(x + width / 2, y - height / 2, x - width / 2, y + height / 2);
}

function resetGrid() {
	for (let i = 0; i < grid.length; i++) {
		grid[i] = 0;
	}
	winner = null;
	turn  = 1;
}

function nextMove() {
	let avialable = [];
	for (let i = 0; i < grid.length; i++) {
		if (grid[i] == 0) {
			avialable.push(i);
		}
	}
	let index = Math.floor(random(avialable.length));
	grid[avialable[index]] = 'O';
	turn++;
}

function minMax(depth, isMaxing) {
	let result = checkWin();
	if (result !== null) {
		return (scores[result] / (depth+1));
	}
	if (isMaxing) {
		let  bestScore = -Infinity;
		for (let i = 0; i < grid.length; i++) {
			if (grid[i] == 0) {
				grid[i] = 'O';
				let score = minMax(depth, false);
				grid[i] = 0;
				if (score > bestScore) {
					bestScore = score;
				}
			}
		}
		return (bestScore / (depth+1));
	} else {
		let  bestScore = Infinity;
		for (let i = 0; i < grid.length; i++) {
			if (grid[i] == 0) {
				grid[i] = 'X';
				let score = minMax(depth, true);
				grid[i] = 0;
				if (score < bestScore) {
					bestScore = score;
				}				
			}
		}
		return (bestScore / (depth+1));
	}
}

function nextBestMove() {

	let  bestScore = -Infinity;
	let move;
	for (let i = 0; i < grid.length; i++) {
		if (grid[i] == 0) {
			grid[i] = 'O';
			let score = minMax(0, false);
			grid[i] = 0;
			if (score > bestScore) {
				bestScore = score;
				move = i;
			}
		}
	}
	grid[move] = 'O';
	turn++;
}

function draw() {
	background(51);
	if (isIA && turn % 2 == 0) {
		if (isMinMax) {
			nextBestMove();
		} else {
			nextMove();
		}
		if (turn >= 5 && winner == null) {
			winner = checkWin();
		}
	}
	if (winner) {
		fill(255);
		textSize(100);
		if (winner == 'Tie') {
			text("Tie!", width / 2, height / 2);
		} else {
			text("The winner is " + winner, width / 2, height / 2);
		}
		noFill();
	} else {
		for (let x = 0; x < 3; x++) {
			for (let y = 0; y < 3; y++) {
				if (grid[x + 3 * y] == 'O') {
					stroke(255, 0, 0);
					ellipse(width * x / 3 + 0.5 * width / 3, height * y / 3 + 0.5 * height / 3, width / 3, height / 3)
				} else if (grid[x + 3 * y] == 'X') {
					stroke(0, 0, 255);
					cross(width * x / 3 + 0.5 * width / 3, height * y / 3 + 0.5 * height / 3, width / 3, height / 3)
				}
			}
		}
		stroke(255);
		for (let i = 0; i < 3; i++) {
			line(width * i / 3, 0, width * i / 3, height);
			line(0, height * i / 3, width, height * i / 3);
		}
	}
}