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
    const step = () => {
        const newPolymer = [];
        for (let i=0; i<polymer.length-1; i++){ // stop at 2nd-to-last
            const pair = polymer[i] + polymer[i+1];
            const rule = rules.find(rule => rule.pair === pair);
            newPolymer.push(polymer[i]);
            newPolymer.push(rule.insert);
        }
        newPolymer.push(polymer[polymer.length-1]);
        polymer = [...newPolymer];
    };

    for (let i=0; i<10; i++){
        step();
    }

    const counts = {};
    polymer.forEach(p => {
        const current = counts[p] || 0;
        counts[p] = current + 1;
    });
    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));
    console.log(`answer = ${max - min}`);
};

module.exports = { run };
