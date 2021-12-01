const {readLinesNumeric} = require("../common/readInput");

const run = async (params) => {
    const input = await readLinesNumeric({inputPath: params.inputPath});

    const computeWindow = (previousValue, currentValue) => previousValue + currentValue;

    let increases = 0;
    let prev = input.slice(0,2).reduce(computeWindow);
    for (let i=1; i<input.length; i++){
        const window = input.slice(i,i+3).reduce(computeWindow);
        console.log(`prev: ${JSON.stringify(prev)} this: ${JSON.stringify(window)}`);
        if (window > prev){
            increases++;
        }
        prev = window;
    }
    console.log(`answer: ${increases}`);
};

module.exports = { run };
