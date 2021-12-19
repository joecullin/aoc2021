const {readLines} = require("../common/readInput");

const charValues = {
    "0": "0000", "1": "0001", "2": "0010", "3": "0011",
    "4": "0100", "5": "0101", "6": "0110", "7": "0111",
    "8": "1000", "9": "1001", "A": "1010", "B": "1011",
    "C": "1100", "D": "1101", "E": "1110", "F": "1111",
};

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const allBits = input.shift().split('').map(char => charValues[char]).join("").split("");

    const readPacket = (params) => {
        const bits = allBits.slice(params.start, params.end+1);
        parseInt(bits.splice(0,3).join(""), 2); // version. Not used.
        const type = parseInt(bits.splice(0,3).join(""), 2);

        let readBits = 6;
        let values = [];
        if (type === 4){
            // literal
            let lastGroup = false;
            let literalBinary = "";
            while (!lastGroup){
                const prefix = bits.shift();
                lastGroup = prefix === "0";
                const group = bits.splice(0,4).join("");
                literalBinary += group;
                readBits += 5;
            }
            const literal = parseInt(literalBinary, 2);
            values.push(literal);
        }
        else{
            // operator
            let result;
            const lengthTypeId = bits.shift();
            readBits++;
            if (lengthTypeId === "0"){
                const subPacketsLength = parseInt(bits.splice(0,15).join(""), 2);
                let start = params.start + 15 + 7;
                const end = start + subPacketsLength;
                while (start < end){
                    result = readPacket({
                        level: params.level + 1,
                        start,
                        end,
                    });
                    values.push(...result.values);
                    start += result.readBits;
                    readBits += result.readBits;
                }
                readBits += 15;
            }
            else if (lengthTypeId === "1"){
                const subPacketsCount = parseInt(bits.splice(0,11).join(""), 2);
                let start = params.start + 11 + 7;
                let end = params.end;
                for (let i=0; i<subPacketsCount; i++){
                    result = readPacket({
                        level: params.level + 1,
                        start,
                        end,
                    });
                    values.push(...result.values);
                    start += result.readBits;
                    readBits += result.readBits;
                }
                readBits += 11;
            }

            let computed;
            if (type === 0){ // sum
                computed = values.reduce((previousValue, currentValue) => {
                    return previousValue + currentValue
                }, 0);
            }
            else if (type === 1){ // product
                computed = values.reduce((previousValue, currentValue) => {
                    return previousValue * currentValue
                }, 1);
            }
            else if (type === 2){
                computed = Math.min(...values);
            }
            else if (type === 3){
                computed = Math.max(...values);
            }
            else if (type === 5){
                computed = values[0] > values[1] ? 1 : 0;
            }
            else if (type === 6){
                computed = values[0] < values[1] ? 1 : 0;
            }
            else if (type === 7){
                computed = values[0] === values[1] ? 1 : 0;
            }
            values = [computed];
        }
        return {
            values,
            readBits,
        };
    }

    const result = readPacket({
        level: 1,
        start: 0,
        end: allBits.length-1,
    });

    console.log(`answer = ${result.values[0]}`);
};

module.exports = { run };
