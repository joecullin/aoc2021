const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const lines = input.map(inputLine => {
        const points = inputLine.split(" -> ").map(point => {
            const [x,y] = point.split(",").map(coord => parseInt(coord));
            return {x,y};
        });
        return { points };
    });

    const walkTheLine = (line) => {
        const markPoint = (x,y) => {
            const id = `${x}:${y}`;
            const val = grid[id] || 0;
            grid[id] = val + 1; 
        };

        let startPoint = line.points[0];
        let endPoint = line.points[1];
        let xStep = startPoint.x === endPoint.x
            ? 0
            : (startPoint.x < endPoint.x) ? 1 : -1;
        let yStep = startPoint.y === endPoint.y
            ? 0
            : (startPoint.y < endPoint.y) ? 1 : -1;

        let x = startPoint.x;
        let y = startPoint.y;
        markPoint(x,y);
        while (y !== endPoint.y || x !== endPoint.x){
            y += yStep;
            x += xStep;
            markPoint(x,y);
        }
    };

    const grid = {};
    lines.forEach(line => {
        walkTheLine(line);
    });
    const overlapCount = Object.values(grid).filter(val => val > 1).length;
    console.log(`answer: ${overlapCount}`);
};

module.exports = { run };
