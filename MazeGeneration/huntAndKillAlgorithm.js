let grid, rows, cols;
let w, h;

let isGenerating;
let mazeFinished;

let currentCell = undefined;
let maze = [];

let currRow;
let currCol;

function setup() {
	cnv = createCanvas(800, 800);
    cnv.parent('huntAndKill');
	centerCanvas();
	
	rows = 10;
	cols = 10;

	w = width / cols;
	h = height / rows;
	isGenerating = false;
	mazeFinished = false;

	currRow = 0;
	currCol = 0;

	grid = new Array(cols);
	for (let i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}

	currentCell = grid[Math.floor(random(cols))][Math.floor(random(rows))];
}

function draw() {
	background(51);
	stroke(255);
	strokeWeight(2);
	for (let i = 0; i < cols; i++) {
		line(i * w, 0, i * w, height);
	}
	for (let j = 0; j < rows; j++) {
		line(0, j * h, width, j * h);
	}
	
	for (let i = 0; i < maze.length; i++) {
		maze[i].show(255);
	}
	if (currentCell == undefined  && mazeFinished == false) {
		for (let i = 0; i < cols; i++) {
			if (i == currCol) {
				grid[i][currRow].show(color(153, 139, 15));
			} else {
				grid[i][currRow].show(color(222, 190, 49));
			}
		}
	}
	if (isGenerating == true && mazeFinished == false) {
		createMaze();
		if (currentCell == undefined) {
			currCol++;
			if (currCol == cols) {
				currCol = 0;
				currRow++;
			}
		}
	}
}

function createMaze() {
	if (currentCell != undefined) {
		maze.push(currentCell);
		currentCell.getNeighbours();
		let ancient = currentCell;
		currentCell = ancient.neighbours[Math.floor(random(ancient.neighbours.length))]
		if (currentCell != undefined) {
			ancient.removeWalls(currentCell);
		}
	} else { // HUNT MODE
		if (!maze.includes(grid[currCol][currRow])) {
			let neighbour = grid[currCol][currRow].getVisitedNeighbour();
			if (neighbour != undefined) {
				currentCell = grid[currCol][currRow];
				currentCell.removeWalls(neighbour);
				currRow = 0;
				currCol = -1;
			}
		}
		if (currentCell == undefined && currRow == rows - 1 && currCol == cols - 1) {
			mazeFinished = true;
		}
	}
}


function centerCanvas() {
	let x = (windowWidth - width) / 2;
	let y = (windowHeight - height) / 2;
	cnv.position(x, y);
}

function windowResized() {
	centerCanvas();
}

function playGeneration() {
	isGenerating = true;
}

function pauseGeneration() {
	isGenerating = false;
}

function stepGeneration() {
	isGenerating = true;
	draw();
	isGenerating = false;
}

function resetGeneration() {
	isGenerating = false;
	mazeFinished = false;
	maze.splice(0, maze.length);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].walls[0] = true;
			grid[i][j].walls[1] = true;
			grid[i][j].walls[2] = true;
			grid[i][j].walls[3] = true;
		}
	}
	currentCell = grid[Math.floor(random(cols))][Math.floor(random(rows))];
	currRow = 0;
	currCol = 0;
}

///////////////////////////////////////////



/*
** NORTH 0
** EAST 1
** SOUTH 2
** WEST 3
*/

function Cell(i, j) {
	this.i = i;
	this.j = j;

	this.walls = [true, true, true, true];
	this.neighbours = [];

	this.show = function(colour) {

		noStroke();
		fill(colour);
		rect(this.i * w, this.j * h , w , h);
		stroke(0);
			strokeWeight(2);
			if (this.walls[0] == true) {
				line(this.i * w, this.j * h, this.i * w + w, this.j * h);
			}
			if (this.walls[1] == true) {
				line(this.i * w + w, this.j * h, this.i * w + w, this.j * h + h);
			}
			if (this.walls[2] == true) {
				line(this.i * w, this.j * h + h, this.i * w + w, this.j * h + h);
			}
			if (this.walls[3] == true) {
				line(this.i * w, this.j * h, this.i * w, this.j * h + h);
			}
		}

	this.getNeighbours = function() {
		this.neighbours.splice(0, this.neighbours.length);
		if (this.i < cols - 1 && !maze.includes(grid[i + 1][j])) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (this.i > 0 && !maze.includes(grid[i - 1][j])) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (this.j < rows - 1 && !maze.includes(grid[i][j + 1])) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (this.j > 0  && !maze.includes(grid[i][j - 1])) {
            this.neighbours.push(grid[i][j - 1]);
        }
	}
	
	this.getVisitedNeighbour = function() {
		if (this.i < cols - 1 && maze.includes(grid[i + 1][j])) {
			return (grid[i + 1][j]);
		}
		if (this.i > 0 && maze.includes(grid[i - 1][j])) {
			return (grid[i - 1][j]);
		}
		if (this.j < rows - 1 && maze.includes(grid[i][j + 1])) {
			return (grid[i][j + 1]);
		}
		if (this.j > 0  && maze.includes(grid[i][j - 1])) {
			return (grid[i][j - 1]);
		}
		return (undefined);
	}

	this.removeWalls = function(neighbour) {
		let deltaX = this.i - neighbour.i;
		let deltaY = this.j - neighbour.j;

		if (deltaX == 1) {
			this.walls[3] = false;
			neighbour.walls[1] = false;
		} else if (deltaX == -1) {
			this.walls[1] = false;
			neighbour.walls[3] = false;
		} else if (deltaY == 1) {
			this.walls[0] = false;
			neighbour.walls[2] = false;
		} else {
			this.walls[2] = false;
			neighbour.walls[0] = false;
		}
	}
}