const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const instructions = input.map(line => {
        const parts = line.trim().split(' ');
        return {
            direction: parts[0],
            distance: parseInt(parts[1])
        };
    });

    let depth = 0;
    let position = 0;
    let aim = 0;
    for (let i=0; i<instructions.length; i++){
        const {direction, distance} = instructions[i];
        if (direction === "forward"){
            position += distance;
            depth += aim * distance;
        }
        else if (direction === "up"){
            aim -= distance;
        }
        else if (direction === "down"){
            aim += distance;
        }
        console.log(`followed [${direction}, ${distance}]: now: depth=${depth} position=${position} aim=${aim}`);
    }
    console.log(`answer: ${depth*position}`);
};

module.exports = { run };
