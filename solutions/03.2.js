const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const allNumbers = input.map(line => {
        return line.trim().split('').map(digit => parseInt(digit));
    });

    const processList = (numbers, position, type) => {
        if (numbers.length === 1){
            const a = parseInt(numbers[0].join(''), 2);
            return a;
        }
        const half = numbers.length / 2;
        const sum = numbers.reduce(
            (previousValue, currentValue, currentIndex) => {
                return previousValue + currentValue[position]
            },
            0
        );
        let popular;
        if (sum === half){
            popular = 1;
        }
        else{
            popular = sum > half ? 1 : 0;
        }
        if (type === "co2"){
            popular = popular ? 0 : 1;
        }

        const filteredList = numbers.filter(number => number[position] === popular);

        return processList(filteredList, position+1, type);
     }

    const oxygen = processList(allNumbers, 0);
    const co2 = processList(allNumbers, 0, "co2");
    console.log(`oxygen: ${oxygen} co2: ${co2} --> ${oxygen*co2}`);
};

module.exports = { run };
