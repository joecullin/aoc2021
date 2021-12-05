const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const lines = input.map(inputLine => {
        const points = inputLine.split(" -> ").map(point => {
            const [x,y] = point.split(",").map(coord => parseInt(coord));
            return {x,y};
        });
        return {
            points,
            isVertical  : (points[0].x === points[1].x),
            isHorizontal: (points[0].y === points[1].y),
        };
    });

    // I'm not going to worry about making this more concise until I see part 2.
    // ... actually I'm going to leave it. See part 2 solution for a cleaner walkTheLine function.

    const walkTheLine = (line) => {
        if (!(line.isVertical || line.isHorizontal)){
            return;
        }

        const markPoint = (x,y) => {
            const id = `${x}:${y}`;
            const val = grid[id] || 0;
            grid[id] = val + 1; 
        };

        let step;
        let startPoint = line.points[0];
        let endPoint = line.points[1];
        let x = startPoint.x;
        let y = startPoint.y;
        markPoint(x,y);
        if (line.isVertical){
            step = (startPoint.y < endPoint.y) ? 1 : -1;
            while (y !== endPoint.y){
                y += step;
                markPoint(x,y);
            }
        }
        else if (line.isHorizontal){
            step = (startPoint.x < endPoint.x) ? 1 : -1;
            while (x !== endPoint.x){
                x += step;
                markPoint(x,y);
            }
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
