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

    const findNeighbors = (point) => {
        const neighbors = [];
        const check = [[-1,0], [1,0], [0,-1], [0,1]];
        check.forEach( ([i,j]) => {
            const neighborRow = point.row+i;
            const neighborCol = point.col+j;
            if (neighborRow >= 0 && neighborCol >= 0){
                const neighbor = map.points.find(p => p.row === neighborRow && p.col === neighborCol);
                if (neighbor){
                    neighbors.push(neighbor);
                }
            }
        });
        return neighbors;
    };
        
    const makeId = (point) => {
        return `${point.row}:${point.col}`;
    };

    const basinSize = (point) => {
        const ids = [makeId(point)];

        const traverse = (point) => {
            const neighborIds = findNeighbors(point).map(p => makeId(p));
            neighborIds.filter(id => !ids.includes(id)).forEach(id => {
                const [nRow, nCol] = id.split(':').map(x => parseInt(x));
                const val = map.points.find(p => p.col === nCol && p.row === nRow).val;
                if (val < 9){
                    ids.push(id);
                    traverse({row: nRow, col: nCol});
                }
            });
        };
        traverse(point);

        const basinIds = [...new Set(ids)]; // de-dupe
        return basinIds.length;
    };

    const lowPoints = map.points.filter(point => {
        const neighbors = findNeighbors(point);
        const min = Math.min( ...neighbors.map(p => p.val) );
        if (min > point.val){
            return point;
        }
    });

    const sizes = lowPoints.map(point => basinSize(point)).sort((a,b) => b - a);

    console.log(`answer: ${sizes[0] * sizes[1] * sizes[2]}`);
};

module.exports = { run };
