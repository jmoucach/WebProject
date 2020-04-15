let grid, rows, cols;
let w, h;

let openList = [];
let closedList = [];

let isGenerating = false;

function setup() {
	cnv = createCanvas(800, 800);
    cnv.parent('primAlgorithm');
	centerCanvas();
	
	rows = 10;
	cols = 10;

	w = width / cols;
	h = height / rows;
	grid = new Array(cols);
	for (let i = 0; i < cols; i++) {
		grid[i] = new Array(rows);
	}

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = new Cell(i, j);
		}
	}
	openList.push(grid[Math.floor(random(cols))][Math.floor(random(rows))]);
	openList[0].isOpen = true;
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
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].isOpen = false;
			grid[i][j].isClosed = false;
			grid[i][j].walls[0] = true;
			grid[i][j].walls[1] = true;
			grid[i][j].walls[2] = true;
			grid[i][j].walls[3] = true;
			grid[i][j].closedNeighbours.splice(0, grid[i][j].closedNeighbours.length);
			grid[i][j].freeNeighbours.splice(0, grid[i][j].freeNeighbours.length);
		}
	}
	
	openList.splice(0, openList.length);
	closedList.splice(0, closedList.length);
	isGenerating = false;
	openList.push(grid[Math.floor(random(cols))][Math.floor(random(rows))]);
	openList[0].isOpen = true;
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
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].show();
		}
	}
	if (isGenerating == true) {
		createMaze();
	}
}

function createMaze() {
	if (openList.length > 0) {
		let rand = Math.floor(random(openList.length));
		let current = openList[rand];
		openList.splice(rand, 1);

		current.getFreeNeighbour();
		
		for (let i = 0; i < current.freeNeighbours.length; i++) {
			openList.push(current.freeNeighbours[i]);
			current.freeNeighbours[i].isOpen = true;
		}
		if (closedList.length > 0) {
			current.getClosedNeighbour();
			let open = current.closedNeighbours[Math.floor(random(current.closedNeighbours.length))];
			current.removeWalls(open);
		}
		closedList.push(current);
		current.isClosed = true;
	}

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
	this.isOpen = false;
	this.isClosed = false;
	this.freeNeighbours = [];
	this.closedNeighbours = [];

	this.show = function() {
		if (this.isOpen == true) {
			if (this.isClosed == true) {
				noStroke();
				fill(255);
				rect(this.i * w, this.j * h , w , h);
				stroke(0);
			} else {
				noStroke();
				fill(191, 113, 181);
				rect(this.i * w, this.j * h, w - 1, h - 1);
				stroke(255, 0, 0);
			}

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
	}

	this.getFreeNeighbour = function() {
		if (this.i + 1 < cols && grid[this.i + 1][this.j].isOpen == false) {
			this.freeNeighbours.push(grid[this.i + 1][this.j]);
		}
		if (this.i - 1 >= 0 && grid[this.i - 1][this.j].isOpen == false) {
			this.freeNeighbours.push(grid[this.i - 1][this.j]);
		}
		if (this.j + 1 < rows && grid[this.i][this.j + 1].isOpen == false) {
			this.freeNeighbours.push(grid[this.i][this.j + 1]);
		}
		if (this.j - 1 >= 0 && grid[this.i][this.j - 1].isOpen == false) {
			this.freeNeighbours.push(grid[this.i][this.j - 1]);
		}
	}

	this.getClosedNeighbour = function() {
		if (this.i + 1 < cols && grid[this.i + 1][this.j].isClosed == true) {
			this.closedNeighbours.push(grid[this.i + 1][this.j]);
		}
		if (this.i - 1 >= 0 && grid[this.i - 1][this.j].isClosed == true) {
			this.closedNeighbours.push(grid[this.i - 1][this.j]);
		}
		if (this.j + 1 < rows && grid[this.i][this.j + 1].isClosed == true) {
			this.closedNeighbours.push(grid[this.i][this.j + 1]);
		}
		if (this.j - 1 >= 0 && grid[this.i][this.j - 1].isClosed == true) {
			this.closedNeighbours.push(grid[this.i][this.j - 1]);
		}
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