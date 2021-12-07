const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const positions = input[0].split(',').map(digit => parseInt(digit));

    const min = Math.min( ...positions );
    const max = Math.max( ...positions );

    const computeTotal = (target) => {
        const total = positions.reduce(
            (previousValue, currentValue) => {
                const distance = Math.abs(currentValue - target);
                let fuel = 0;
                for (let i=0; i<distance; i++){
                    fuel += distance - i;
                }
                return previousValue + fuel;
            },
            0
        );
        return total;
    };

    const totals = [];
    for (let i=min; i<=max; i++){
        totals.push(computeTotal(i));
    }
    console.log(`answer = ${Math.min(...totals)}`);
};

module.exports = { run };
