const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const map = {
        width: 0,
        height: 0,
        points: [],
    };
    input.forEach((row, i) => {
        map.height++;
        const cols = row.split('');
        cols.forEach((col, j) => {
            if (i === 0){ map.width++; }
            map.points.push({
                row: i,
                col: j,
                val: parseInt(col)
            });
        });
    });

    const lowPoints = map.points.filter(point => {
        const neighbors = [];
        const check = [[-1,0], [1,0], [0,-1], [0,1]];
        check.forEach( ([i,j]) => {
            const neighborRow = point.row+i;
            const neighborCol = point.col+j;
            if (neighborRow >= 0 && neighborCol >= 0){
                const neighbor = map.points.find(p => p.row === neighborRow && p.col === neighborCol);
                if (neighbor){
                    neighbors.push(neighbor.val);
                }
            }
        });
        const min = Math.min( ...neighbors );
        if (min > point.val){
            return point;
        }
    });
    let sum = 0;
    lowPoints.forEach(point => {
        sum += point.val + 1;
    });
    console.log(`answer: ${sum}`);
};

module.exports = { run };
