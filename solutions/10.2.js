const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});

    const closers = ")]}>";
    const mirrors = {
        "[": "]",
        "(": ")",
        "{": "}",
        "<": ">",
    };

    // After reading each new char, we'll recursively eliminate any closed expressions.
    const trim = (acc) => {
        const last = acc[acc.length-1];
        const next = acc[acc.length-2];
        if (closers.includes(last)){
            if (mirrors[next] === last){
                acc.pop();
                acc.pop();
                acc = trim(acc);
            }
            else{
                return; // corrupted
            }
        }
        return acc;
    };

    const checkLine = (chars) => {
        let acc = [];
        for (let i=0; i<chars.length; i++){
            const char = chars[i];
            acc.push(char);
            acc = trim(acc);
            if (!Array.isArray(acc)){
                return; // corrupted
            }
        }
        // find completion and score
        acc.reverse();
        const points = "_)]}>"; // _ 1 2 3 4
        let score = 0;
        acc.map(char => mirrors[char]).forEach(char => {
            score = score * 5;
            score += points.indexOf(char);
        });
        return score;
    };

    const scores = input.map(line => {
        const chars = line.split('');
        return checkLine(chars);
    })
    .filter(s => s)       // skip corrupt
    .sort((a,b) => a -b); // sort scores

    const middleIndex = Math.floor(scores.length/2);
    console.log(`answer: ${scores[middleIndex]}`);

};

module.exports = { run };
