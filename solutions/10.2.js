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

    const trim = (acc) => {
        if (acc.length < 2){
            return acc;
        }
        const last = acc[acc.length-1];
        const next = acc[acc.length-2];
        if (closers.includes(last)){
            if (mirrors[next] === last){
                acc.pop();
                acc.pop();
                acc = trim(acc);
            }
            else{
                return last;
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
                return;
            }
        }
        acc.reverse();
        const completion = acc.map(char => mirrors[char]);
        const values = { ")": 1, "]": 2, "}": 3, ">": 4 };
        let score = 0;
        completion.forEach(char => {
            score = score * 5;
            score += values[char];
        });
        return score;
    };

    const scores = input.map(line => {
        const chars = line.split('');
        return checkLine(chars);
    }).filter(s => s).sort((a,b) => a -b);
    const middleIndex = Math.floor(scores.length/2);
    console.log(`answer: ${scores[middleIndex]}`);

};

module.exports = { run };
