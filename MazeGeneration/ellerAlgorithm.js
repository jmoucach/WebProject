let grid, cols, rows;
let w, h;

let currCol, currRow;
let isGenerating = false;
let numInSet = []


function setup() {
    cnv = createCanvas(800, 800);
    cnv.parent('ellerAlgorithm');
    centerCanvas();

    textAlign(CENTER);
    
    rows = 10;
    cols = 10;
    
    w = width/cols;
    h = height/rows;
    
    grid = new Array(cols);
    currRow = 0;
    currCol = 0;
    
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(rows);
    }
    
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = new Cell(i, j);
        }
    }
}

function draw() {
    background(51);
	if (isGenerating == true) {
		if (currRow < rows) {
			createMaze()
		}
		currCol++
		if (currCol == cols - 1) {
			
			currRow++;
			currCol = 0;
		}
	}
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			grid[i][j].show();
		}
	}
}

function createMaze() {
	if (currRow < rows) {
		if (currCol == 0) {
			for (let i = 0; i < cols; i++) {
				let skipped = 0;
				if (grid[i][currRow].setId == -1) {
					grid[i][currRow].setId = i + currRow * cols + skipped;
					numInSet.push(1);
				} else {
					skipped++;
				}
			}
		}
		if (currRow == rows - 1 && grid[currCol + 1][currRow].setId != grid[currCol][currRow].setId) {
			grid[currCol][currRow].eastWall = false;
			grid[currCol][currRow].next = grid[currCol + 1][currRow];
			grid[currCol + 1][currRow].previous = grid[currCol][currRow];
			if (grid[currCol][currRow].setId < grid[currCol + 1][currRow].setId) {
				mergeSets(grid[currCol][currRow].setId, grid[currCol + 1][currRow]);
			} else {
				mergeSets(grid[currCol + 1][currRow].setId, grid[currCol][currRow]);
			}
		} else if ((random(1) < 0.5) && grid[currCol + 1][currRow].setId != grid[currCol][currRow].setId && currRow != rows - 1) {
			grid[currCol][currRow].eastWall = false;
			grid[currCol][currRow].next = grid[currCol + 1][currRow];
			grid[currCol + 1][currRow].previous = grid[currCol][currRow];
			if (grid[currCol][currRow].setId < grid[currCol + 1][currRow].setId) {
				mergeSets(grid[currCol][currRow].setId, grid[currCol + 1][currRow]);
			} else {
				mergeSets(grid[currCol + 1][currRow].setId, grid[currCol][currRow]);
				}
		} 
		if (currRow < rows - 1 && currCol == cols - 2) {
			let i = 0;
			while (i < cols) {
				let j = 0;
				while (i + j < cols && grid[i + j][currRow].setId == grid[i][currRow].setId) {
					j++;
				}
				let numDown = 0;
				let max = Math.floor(random(1, j))
				let downies = [];
				while (numDown < max) {
					let rand = Math.floor(random(j))
					if (!downies.includes(rand)) {
						downies.push(rand);
						numDown++;
						grid[i + rand][currRow + 1].setId = grid[i + rand][currRow].setId; 
						grid[i + rand][currRow].southWall = false; 
						grid[i + rand][currRow].down = grid[i + rand][currRow + 1]; 
						grid[i + rand][currRow + 1].up = grid[i + rand][currRow];
						numInSet[grid[i + rand][currRow + 1].setId]++;
					}
				}
				i += j;
			}
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

function mergeSets(setId, cell) {
	numInSet[cell.setId]--;
	numInSet[setId]++;
	cell.setId = setId;
	if (cell.previous != undefined && cell.previous.setId != setId) {
		mergeSets(setId, cell.previous)
	}
	if (cell.next != undefined && cell.next.setId != setId) {
		mergeSets(setId, cell.next)
	}
	if (cell.up != undefined && cell.up.setId != setId) {
		mergeSets(setId, cell.up)
	}
	if (cell.down != undefined && cell.down.setId != setId) {
		mergeSets(setId, cell.down)
	}
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
	currRow = 0;
	currCol = 0;

	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j].up = undefined;
			grid[i][j].previous = undefined;
			grid[i][j].next = undefined;
			grid[i][j].down = undefined;
			grid[i][j].setId = -1;
			grid[i][j].southWall = true;
			grid[i][j].eastWall = true;
		}
	}
	numInSet.splice(0, numInSet.length);
	isGenerating = false;
}

/////////////////////////////////////
function Cell(i, j) {

    this.i = i;
    this.j = j;

    this.setId = -1;

	this.eastWall = true;
	this.southWall = true;

	this.next = undefined;
	this.previous = undefined;
	this.up = undefined;
	this.down = undefined;

    this.show = function() {
		if (currRow >= this.j) {
			if (currRow == this.j) {
				stroke(255, 0, 0);
				strokeWeight(4);
			} else {
				stroke(255);
				strokeWeight(2);
			}
			if (this.eastWall == true) {
				line(i * w + w, j * h , i * w + w, j * h + h);
			}
			if (this.southWall== true) {
				line(i * w, j * h + h , i * w + w, j * h + h);
			}
			if (cols < 25 && rows < 25) {
				noStroke();
				fill(255);
				text(this.setId, this.i * w + w / 2, this.j *h + h / 2);
			}
		}
    }
} 