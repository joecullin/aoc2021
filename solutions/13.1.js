const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const grid = [];
    const foldInstructions = [];
    input.forEach(line => {
        if (line.includes("fold")){
            const [axis, position] = line.replace("fold along ", "").split("=");
            foldInstructions.push({
                axis,
                position: parseInt(position),
            });
        }
        else if (line !== ""){
            const [x,y] = line.split(",").map(coord => parseInt(coord));
            grid.push({x,y});
        }
    });

    const printGrid = () => {
        let dotCount = 0;
        let output = "";
        const xMax = Math.max( ...grid.map(d => d.x ));
        const yMax = Math.max( ...grid.map(d => d.y) );
        for (let y=0; y <= yMax; y++){
            output += "\n";
            for (let x=0; x <= xMax; x++){
                // There might be dupes, but we only care about finding one or none.
                let dot = grid.find(d => d.x === x && d.y === y);
                if (dot){
                    dotCount++;
                    output += "#";
                }
                else{
                    output += ".";
                }
            }
            output += `  ${y+1}`;
        }
        console.log(`-------------------${output}`);
        return dotCount;
    };

    const fold = (instruction) => {
        const axis = instruction.axis;
        const position = instruction.position;
        grid.forEach(dot => {
            if (dot[axis] > position){
                dot[axis] -= (dot[axis]-position) * 2;
            }
        });
    };

    printGrid();
    fold(foldInstructions[0]);
    const answer = printGrid();
    console.log(`answer: ${answer}`);
};

module.exports = { run };
