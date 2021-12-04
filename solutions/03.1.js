const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const numbers = input.map(line => {
        return line.trim().split('').map(digit => parseInt(digit));
    });

    const half = Math.floor(numbers.length / 2);
    let epsilonDigits = [];
    let gammaDigits = [];
    for (let i=0; i<numbers[0].length; i++){
        const sum = numbers.reduce(
            (previousValue, currentValue) => {
                return previousValue + currentValue[i]
            },
            0
        );
        if (sum > half){
            epsilonDigits[i] = 0;
            gammaDigits[i] = 1;
        }
        else{
            epsilonDigits[i] = 1;
            gammaDigits[i] = 0;
        }
    }
    const gammaString = gammaDigits.join('');
    const gammaDecimal = parseInt(gammaString, 2);

    const epsilonString = epsilonDigits.join('');
    const epsilonDecimal = parseInt(epsilonString, 2);

    console.log(`  gamma: ${gammaString} ${gammaDecimal}`);
    console.log(`epsilon: ${epsilonString} ${epsilonDecimal}`);
    console.log(`answer: ${gammaDecimal*epsilonDecimal}`);
};

module.exports = { run };
