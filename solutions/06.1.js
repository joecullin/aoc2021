const {readLines} = require("../common/readInput");

const totalDays = 80;

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    let fishes = input[0].split(',').map(val => parseInt(val));

    const nextDay = (fishes) => {
        const newFishes = [];
        fishes = fishes.map(fish => {
            fish--;
            if (fish < 0){
                fish = 6;
                newFishes.push(8);
            }
            return fish;
        });
        return fishes.concat(newFishes);
    };

    for (let i=0; i<totalDays; i++){
        fishes = nextDay(fishes);
    }
    console.log(`after ${totalDays} days: ${fishes.length} fish`);
};

module.exports = { run };
