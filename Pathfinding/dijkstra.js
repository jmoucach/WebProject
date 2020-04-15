let startPosition, endPosition;
let grid, cols, rows;
let w, h; // width and height of the grid cells

let startPosClicked = false;
let endPosClicked = false;
let isPathfinding = false;
let hasSolution = true;

let openList = [];
let closedList = [];

let path = [];

function setup() {
    cnv = createCanvas(800, 800);
    cnv.parent('dijkstra');
    centerCanvas();
    textAlign(CENTER);
    cols = 20;
    rows = 20;
    w = width / cols;
    h = height / rows;
    grid = new Array(cols); // create 1D Array
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(rows); // create 2D Array
    }
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = new Spot(i, j); // fill 2D array with spots
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].getNeighbours(grid); // get neighbours for every spot
        }
    }

    startPosition = grid[0][0];
    startPosition.isWalkable = true;
    openList.push(startPosition);
    endPosition = grid[cols - 1][rows - 1];
    endPosition.isWalkable = true;
}


function mousePressed() {
    if (mouseButton == LEFT) {
        let x = Math.floor(mouseX / w);
        let y = Math.floor(mouseY / h);


        if (x == startPosition.i && y == startPosition.j) {
            startPosClicked = true;
        } else if (x == endPosition.i && y == endPosition.j) {
            endPosClicked = true;
        } else if (endPosClicked == true) {
            if (grid[x][y].isWalkable) {
                endPosition = grid[x][y];
            }
            endPosClicked = false;
            resetPathfinding();
        } else if (x < cols && x >= 0 && y < rows && y >= 0) {
            if (grid[x][y].isWalkable == true) {
                grid[x][y].isWalkable = false;
            } else {
                grid[x][y].isWalkable = true;
            }
            resetPathfinding();
        }
    }
}

function mouseReleased() {
    if (mouseButton == LEFT) {
        let x = Math.floor(mouseX / w);
        let y = Math.floor(mouseY / h);

        if (startPosClicked == true) {
            if (grid[x][y].isWalkable) {
                startPosition = grid[x][y];
            }
            startPosClicked = false;
            resetPathfinding();
        } else if (endPosClicked == true) {
            if (grid[x][y].isWalkable) {
                endPosition = grid[x][y];
            }
            endPosClicked = false;
            resetPathfinding();
        }
    }
}

function resetPathfinding() {
    isPathfinding = false;
    hasSolution = true;
    openList.splice(0, openList.length);
    closedList.splice(0, closedList.length);
    path.splice(0, path.length);
    openList.push(startPosition);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].previous = undefined;
            grid[i][j].gCost = 0;
        }
    }
}

function playPathfinding() {
    isPathfinding = true;
}

function pausePathfinding() {
    isPathfinding = false;
}

function stepPathfinding() {
    isPathfinding = true;
    draw();
    isPathfinding = false;
}

function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function windowResized() {
    centerCanvas();
}

function draw() {
    background(51);
    strokeWeight(4);
    stroke(255);
    for (let i = 0; i < cols; i++) {
        line(i * w, 0, i * w, height);
    }
    for (let i = 0; i < rows; i++) {
        line(0, i * h, width, i * h);
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j].show(color(255, 255, 255, 150)); // show everyone
        }
    }
    for (let i = 0; i < openList.length; i++) {
        openList[i].show(color(212, 184, 25, 150));
    }
    for (let i = 0; i < closedList.length; i++) {
        closedList[i].show(color(209, 110, 10, 150));
    }
    // console.log(openList);

    startPosition.show(color(0, 0, 255, 255));
    endPosition.show(color(255, 0, 0, 255));
    if (path.length == 0 && isPathfinding == true && hasSolution == true) {
        pathfind();
    }

    noFill();
    strokeWeight(w / 2);
    stroke(255, 0, 200);
    beginShape();
    for (let i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    }
    endShape();

    if (hasSolution == false) {
        fill(31, 79, 94);
        stroke(255);
        strokeWeight(4);
        textSize(100);
        text("No solution found", width / 2, height / 2);
    }
    // for (let i = 0; i < path.length; i++) {
    // 	path[i].show(color(15, 71, 8, 255));
    // }
}

function removeFromArray(array, element) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == element) {
            array.splice(i, 1);
            break;
        }
    }
}

function pathfind() {
    if (openList.length > 0) {
        let current = openList[0];
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].fCost < current.fCost) {
                current = openList[i];
            }
        }
        removeFromArray(openList, current);
        closedList.push(current);
        if (current == endPosition) {
            let tmp = current;
            path.push(tmp);
            while (tmp.previous) {
                path.push(tmp.previous);
                tmp = tmp.previous;
            }
        }
        neighbours = current.neighbours;
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
            if (neighbour.isWalkable && !closedList.includes(neighbour)) {
                let newPath = false;
                let tempG = current.gCost + 1
                if (openList.includes(neighbour)) {
                    if (tempG < neighbour.gCost) {
                        neighbour.gCost = tempG;
                        newPath = true;
                    }
                } else {
                    neighbour.gCost = tempG;
                    newPath = true;
                    openList.push(neighbour);
                }
                if (newPath) {
                    neighbour.previous = current;
                }
            }
        }
    } else if (path.length == 0) {
        hasSolution = false;
    }
}





//#########################################
function Spot(i, j) {
    this.i = i;
    this.j = j;
    this.gCost = 0;

    this.isWalkable = true;
    if (random(1) < 0.2) {
        this.isWalkable = false;
    }

    this.previous = undefined;
    this.neighbours = [];

    this.show = function(col) {
        if (this.isWalkable == false) {
            noStroke();
            fill(0);
            rect(this.i * w, this.j * h, w, h);
        } else if (col) {
            noStroke();
            fill(col);
            rect(this.i * w, this.j * h, w, h);
            fill(255);
            textSize(10);
            text(this.gCost, this.i * w + w / 2, this.j * h + h / 2);
        }
    }

    this.getNeighbours = function(grid) {
        if (this.i < cols - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (this.i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (this.j < rows - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (this.j > 0) {
            this.neighbours.push(grid[i][j - 1]);
        }
    }
}