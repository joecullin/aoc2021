const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const grid = [];
    input.forEach((line, row) => {
        line.split('').forEach( (val,col) => {
            grid.push({
                id: [row,col].join(":"),
                row,
                col,
                val: parseInt(val),
            });
        });
    });

    const printGrid = () => {
        console.log("-------------------");
        const rowNums = [...new Set(grid.map(o => o.row))];
        rowNums.forEach(rowNum => {
            const row = grid.filter(o => o.row === rowNum).sort((a,b) => a.col - b.col);
            console.log(`${row.map(o => o.val).join(' ')}`);
        });
    };

    const step = () => {
        grid.forEach(octopus => octopus.val++);

        const incrementNeighbors = (octopus) => {
            [-1,0,1].forEach(row => {
                [-1,0,1].forEach(col => {
                    const neighbor = grid.find(o => o.row === row+octopus.row && o.col === col+octopus.col);
                    if (neighbor){
                        neighbor.val++;
                    }
                });
            });
        };

        const flashedIds = [];
        const doFlashes = () => {
            const ready = grid
                .filter(octopus => octopus.val >= 10)
                .filter(octopus => !flashedIds.includes(octopus.id));
            if (!ready.length){
                return;
            }
            ready.forEach(octopus => {
                flashedIds.push(octopus.id);
                incrementNeighbors(octopus);
            });
            flashedIds.sort();
            doFlashes();
        };

        doFlashes(grid);
        flashedIds.forEach(id => {
            const octopus = grid.find(o => o.id === id);
            octopus.val = 0;
        });
        return flashedIds.length;
    };

    let stepCount = 0;
    let flashCount = 0;
    let target = grid.length;
    while (flashCount !== target){
        stepCount++;
        flashCount = step();
        console.log(`${flashCount} flashes after step ${stepCount}:`);
        printGrid();
    }
};

module.exports = { run };
