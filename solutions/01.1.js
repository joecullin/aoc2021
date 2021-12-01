const {readLinesNumeric} = require("../common/readInput");

const run = async (params) => {
    const input = await readLinesNumeric({inputPath: params.inputPath});

    let increases = 0;
    let prev = input[0];
    for (let i=1; i<input.length; i++){
        if (input[i] > prev){
            increases++;
        }
        prev = input[i];
    }
    console.log(`answer: ${increases}`);
};

module.exports = { run };
