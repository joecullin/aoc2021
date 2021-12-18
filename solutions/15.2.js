const {readLines} = require("../common/readInput");

// from https://en.wikipedia.org/wiki/ANSI_escape_code#Escape_sequences
const CSI = "\x1B[";

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const grid = [];
    input.forEach((line, row) => {
        line.split('').forEach( (val,col) => {
            grid.push({
                id: [col,row].join(":"),
                row,
                col,
                val: parseInt(val),
                visited: false,
                tentativeRisk: (row || col) ? Number.MAX_SAFE_INTEGER : 0,
                prev: null,
                winner: false,
            });
        });
    });

    // 5x5 grid of tiles
    const tileLength = 5;
    const tileWidth = [...new Set(grid.map(o => o.row))].length;
    const tileHeight = [...new Set(grid.map(o => o.col))].length;
    for (let i=0; i<tileLength; i++){
        for (let j=0; j<tileLength; j++){
            if (i === 0 && j === 0){
                // skip first tile, it's already in the grid
                continue;
            }
            for (let origCol=0; origCol<tileWidth; origCol++){
                for (let origRow=0; origRow<tileHeight; origRow++){
                    const orig = grid.find(n => n.col === origCol && n.row === origRow);
                    const newCol = orig.col + (i*tileWidth);
                    const newRow = orig.row + (j*tileHeight);
                        
                    let newVal = orig.val + i + j;
                    if (newVal > 9){
                        newVal = newVal % 9;
                    }
                    const newNode = {
                        ...orig,
                        id: [newCol,newRow].join(":"),
                        row: newRow,
                        col: newCol,
                        val: newVal,
                        tentativeRisk: Number.MAX_SAFE_INTEGER
                    };
                    grid.push(newNode);
                }
            }
        }
    }

    const clearScreen = () => {
        process.stdout.write(CSI + "2J");
    };

    const printGrid = () => {
        if (grid.length > 2500){
            return;
        }
        clearScreen();

        // These were handy for checking the tiles with the sample data.
        // console.log("00000000001111111111222222222233333333334444444444");
        // console.log("01234567890123456789012345678901234567890123456789");

        const rowNums = [...new Set(grid.map(o => o.row))].sort((a,b) => a.col - b.col);
        rowNums.forEach(rowNum => {
            const row = grid.filter(o => o.row === rowNum).sort((a,b) => a.col - b.col);
            row.forEach(cell => {
                const endFormat = `${CSI}0m`;
                let startFormat = cell.visited
                    ? cell.winner ? `${CSI}32m` : `${CSI}31m` : `${CSI}37m`;
                process.stdout.write(`${startFormat}${cell.val}${endFormat}`); 
            });
            process.stdout.write(`   ${rowNum}`); 
            process.stdout.write("\n"); 
        });
    };

    console.log(`grid has ${grid.length} nodes`);
    printGrid();

    const getNeigbors = (node) => {
        const all = [[-1,0], [1,0], [0,-1], [0,1]]
        .map( ([i,j]) => {
            return grid.find(n => n.row === node.row+i && n.col === node.col+j);
        })
        .filter(n => n);
        return all;
    };


    let current = grid[0];
    const destination = grid[grid.length-1];

    let bubble = {};
    let i = 0;
    for (;;){
        i++;

        const unvisitedNeighbors = getNeigbors(current).filter(n => !n.visited);
        let lowestRiskNeighbor;
        unvisitedNeighbors.forEach(neighbor => {
            bubble[neighbor.id] = neighbor;
            const risk = neighbor.val + current.tentativeRisk;
            if (risk < neighbor.tentativeRisk){
                neighbor.tentativeRisk = risk;
                neighbor.prev = current.id;
            }
            if (!lowestRiskNeighbor || risk < lowestRiskNeighbor?.tentativeRisk){
                lowestRiskNeighbor = neighbor;
            }
        });
        current.visited = true;
        delete bubble[current.id];
        if (current.id === destination.id){
            break;
        }

        // This is my only optimization, the only improvement over part 1.
        // Instead of searching all nodes every time, I only search the bubble around visited nodes.
        let next;
        Object.keys(bubble).forEach(nodeId => {
            if (!next || bubble[nodeId].tentativeRisk < next.tentativeRisk){
                next = bubble[nodeId];
            }
        });
        if (!next){
            break;
        }
        current = next;

        // Show progress
        if (i % 1000 === 0){
            printGrid();
            console.log(`step ${i} bubble size: ${Object.keys(bubble).length}`);
        }
    }

    current = destination;
    while (current.prev){
        current.winner = true;
        current = grid.find(n => n.id === current.prev);
    }
    printGrid();
    console.log(`lowest risk path (took ${i} passes): ${destination.tentativeRisk}`);
};

module.exports = { run };
