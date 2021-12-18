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

    const clearScreen = () => {
        process.stdout.write(CSI + "2J");
    };

    const printGrid = () => {
        if (grid.length <= 100){
            // sample input
            console.log("-------------------");
        }
        else{
            clearScreen();
        }
        const rowNums = [...new Set(grid.map(o => o.row))];
        rowNums.forEach(rowNum => {
            const row = grid.filter(o => o.row === rowNum).sort((a,b) => a.col - b.col);
            row.forEach(cell => {
                const endFormat = `${CSI}0m`;
                let startFormat = cell.visited
                    ? cell.winner ? `${CSI}32m` : `${CSI}31m`
                    : `${CSI}37m`;
                process.stdout.write(`${startFormat}${cell.val}${endFormat}`); 
            });
            process.stdout.write("\n"); 
        });
    };

    const getNeigbors = (node) => {
        const all = [[-1,0], [1,0], [0,-1], [0,1]]
        .map( ([i,j]) => {
            return grid.find(n => n.row === node.row+i && n.col === node.col+j);
        })
        .filter(n => n);
        return all;
    };

    printGrid();

    let current = grid[0];
    const destination = grid[grid.length-1];

    let i = 0;
    for (;;){
        i++;
        const unvisitedNeighbors = getNeigbors(current).filter(n => !n.visited);
        let lowestRiskNeighbor;
        unvisitedNeighbors.forEach(neighbor => {
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
        if (current.id === destination.id){
            break;
        }
        let next;
        grid.filter(n => !n.visited).forEach(n => {
            if (!next || n.tentativeRisk < next.tentativeRisk){
                next = n;
            }
        });
        if (!next){
            break;
        }
        current = next;

        if (i % 500 === 0){
            printGrid();
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
