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
                return acc;
            }
        }
    };

    const values = {
        ")": 3,
        "]": 57,
        "}": 1197,
        ">": 25137,
    };
    let score = 0;
    input.forEach(line => {
        const chars = line.split('');
        const badChar = checkLine(chars);
        if (badChar){
           score += values[badChar]; 
        }
    });

    console.log(`answer: ${score}`);
};

module.exports = { run };
