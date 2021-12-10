const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const entries = input.map(line => {
        const parts = line.split(/\|/g);
        return {
            patterns: parts[0].trim().split(" "),
            output: parts[1].trim().split(" "),
        };
    });

    let found = 0;
    entries.forEach(entry => {
        entry.output.forEach(digit => {
            if ([2,3,4,7].includes(digit.length)){
                found++;
            }
        });
    });

    console.log(`found: ${found}`);
};

module.exports = { run };
