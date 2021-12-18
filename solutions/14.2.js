const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const template = input.shift().split('');
    input.shift();
    const rules = input.map(line => {
        const [pair, insert] = line.split(" -> ");
        return {pair, insert};
    });

    let polymer = [...template];
    const step = (polymer) => {
        const newPolymer = [];
        for (let i=0; i<polymer.length-1; i++){ // stop at 2nd-to-last
            const pair = polymer[i] + polymer[i+1];
            const rule = rules.find(rule => rule.pair === pair);

            newPolymer.push(polymer[i]);
            newPolymer.push(rule.insert);
        }
        newPolymer.push(polymer[polymer.length-1]);
        return newPolymer;
    };

    // Note - this works for part 1 (gets the right answer for 10 steps),
    // but it's still too slow for part 2, even on the small sample data.

    const counts = {};
    const chunkSize = 1000;
    const solve = (polymer, steps, neighbor) => {
        for (let i=1; i<=steps; i++){
            if (!neighbor){
                console.log(`step ${i} - size is ${polymer.length}, neighbor: ${neighbor}`);
            }
            if (neighbor){
                polymer.unshift(neighbor);
            }
            // console.log(`before step: ${polymer.join("")}`);
            polymer = step(polymer);
            if (neighbor){
                polymer.shift();
            }
            // console.log(` after step: ${polymer.join("")}`);
            if (polymer.length > chunkSize+2){
                const tail = polymer.splice(polymer.length-chunkSize);
                // console.log(`split to work on ${tail.join("")}, leaving ${polymer.join("")}`);
                solve(
                    [...tail],
                    steps-i,
                    polymer[polymer.length-1]  // neighbor to the left
                );
            }
        }
        polymer.forEach(p => {
            const current = counts[p] || 0;
            counts[p] = current + 1;
        });
    }
    solve(polymer, 10);

    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));
    console.log(`answer = ${max - min}`);
};

module.exports = { run };
