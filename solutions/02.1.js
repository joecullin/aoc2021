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
    for (let i=0; i<instructions.length; i++){
        const {direction, distance} = instructions[i];
        if (direction === "forward"){
            position += distance;
        }
        else if (direction === "up"){
            depth -= distance;
        }
        else if (direction === "down"){
            depth += distance;
        }
        console.log(`followed [${direction}, ${distance}]: now: depth=${depth} position=${position}`);
    }
    console.log(`answer: ${depth*position}`);
};

module.exports = { run };
