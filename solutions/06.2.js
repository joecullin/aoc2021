const {readLines} = require("../common/readInput");

const totalDays = 256;

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const fishes = {};
    for (let i=0; i<=8; i++){ fishes[i] = 0 }
    input[0].split(',').map(val => parseInt(val)).forEach(fish => fishes[fish]++);

    const nextDay = () => {
        let startingState = {...fishes};
        Object.entries(startingState).forEach( ([day, count]) => {
            if (count > 0){
                const increment = [];
                const decrement = [day];
                if (day === "0"){
                    increment.push(6);
                    increment.push(8);
                }
                else{
                    increment.push(day-1);
                }
                increment.forEach(val => {
                    fishes[val] += count;
                });
                decrement.forEach(val => {
                    fishes[val] -= count;
                });
            }
        });
    };

    for (let i=0; i<totalDays; i++){
        nextDay();
    }

    const count = Object.values(fishes).reduce( (previousValue, currentValue) => {
        return previousValue + currentValue
    });

    console.log(`after ${totalDays} days: ${count}`);
};

module.exports = { run };
