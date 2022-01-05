// initialize grid array (8x8)
WIDTH = 8;
HEIGHT = 8;
gridArray = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

function generate() {
    let grid = document.getElementById("cells");

    // read grid from user input
    for (let i = 0; i < grid.children.length; i++) {
        for (let j = 0; j < grid.children[i].children.length; j++) {
            let inputValue = grid.children[i].children[j].value;
            (inputValue === "") ? gridArray[i][j] = -1: gridArray[i][j] = parseInt(inputValue);
        }
    }

    // parse user input to S: 0, air: -1, wall: -2, D: -3
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (gridArray[i][j] === 1)
                gridArray[i][j] = -2;
            else if (gridArray[i][j] === 2)
                gridArray[i][j] = -3;
            else if (gridArray[i][j] === 3)
                gridArray[i][j] = 1;
        }
    }
}

/**
 * function to solve a given maze based on the Lee algorithm
 * https://en.wikipedia.org/wiki/Lee_algorithm
 */
function solve() {
    generate();
    let foundEnd = false;
    let it = 1;

    while (!foundEnd) {
        let foundEmpty = false;
        for (let x=0; x < WIDTH && !foundEnd; ++x) {
            for (let y=0; y < HEIGHT; ++y) {
                if (gridArray[x][y] === it) {

                    // check east cell
                    if (x < WIDTH - 1) {
                        let east = gridArray[x + 1][y];
                        if (east === -3) {
                            foundEnd = true;
                            break;
                        }
                        else if (east === -1) {
                            gridArray[x + 1][y] = it + 1;
                            foundEmpty = true;
                        }
                    }

                    // check west cell
                    if (x > 0) {
                        let west = gridArray[x - 1][y];
                        if (west === -3) {
                            foundEnd = true;
                            break;
                        }
                        else if (west === -1) {
                            gridArray[x - 1][y] = it + 1;
                            foundEmpty = true;
                        }
                    }

                    // check south cell
                    if (y < HEIGHT - 1) {
                        let south = gridArray[x][y + 1];
                        if (south === -3) {
                            foundEnd = true;
                            break;
                        }
                        else if (south === -1) {
                            gridArray[x][y + 1] = it + 1;
                            foundEmpty = true;
                        }
                    }

                    // check north cell
                    if (y > 0) {
                        let north = gridArray[x][y - 1];
                        if (north === -3) {
                            foundEnd = true;
                            break;
                        }
                        else if (north === -1) {
                            gridArray[x][y - 1] = it + 1;
                            foundEmpty = true;
                        }
                    }
                }
            }
        }

        if (!foundEnd && !foundEmpty) {
            alert("Dieses Maze hat keine Lösung!");
            break;
        }

        it++;
    }

    // generate hex values for MIPS representation
    let text = "maze1:\n";
    for (let y = 0; y < HEIGHT; y++) {
        let line = "\t.byte ";
        for (let x = 0; x < WIDTH; x++) {
            let char = gridArray[y][x];
            if (char === 0)
                char = 'S'
            if (char === -1)
                char = 0
            else if (char === -2)
                char = 255
            else if (char === -3)
                char = "D"

            if (char !== "S" && char !== "D") {
                let hexString = parseInt(char).toString(16).toUpperCase();
                char = "0x" + hexString;
            }

            line += char + " ";
        }
        text += line + "\n";
    }

    // paste generated hex values in textarea
    let tArea = document.getElementById("tArea");
    tArea.value = text;

    // calculate dest index
    let destIndex = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (gridArray[y][x] === -3)
                destIndex = 8 * y + x
        }
    }

    // paste dest index into input
    let indexHolder = document.getElementById("index");
    indexHolder.value = destIndex;
}