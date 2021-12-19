const {readLines} = require("../common/readInput");

const charValues = {
    "0": "0000", "1": "0001", "2": "0010", "3": "0011",
    "4": "0100", "5": "0101", "6": "0110", "7": "0111",
    "8": "1000", "9": "1001", "A": "1010", "B": "1011",
    "C": "1100", "D": "1101", "E": "1110", "F": "1111",
};

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const bits = input.shift().split('').map(char => charValues[char]).join("").split("");

    const decodePacket = (bits, limit) => {
        console.log(`=========================================== decodePacket\n${bits.join("")}\nlimit=${limit}\n`);
        if (limit === 0){
            console.log(`hit the limit`);
            // return;
        }

        const version = parseInt(bits.splice(0,3).join(""), 2);
        const type = parseInt(bits.splice(0,3).join(""), 2);

        console.log(`version: ${JSON.stringify(version)}`);
        console.log(`type: ${JSON.stringify(type)}`);
        console.log(`bits: ${JSON.stringify(bits.join(""))}`);


// stopping for the night.
// I'm really close, I think.



        if (type === 4){
            let lastGroup = false;
            let literalBinary = "";
            while (!lastGroup){
                const prefix = bits.shift();
                lastGroup = prefix === "0";
                const group = bits.splice(0,4).join("");
                console.log(`group: ${group}`);
                literalBinary += group;
            }
            const literal = parseInt(literalBinary, 2);
            console.log(`literal: ${literalBinary} --> ${literal}`);
            const values = [literal];

            console.log(`remaining: ${bits.join("")}`);
            if (bits.includes("1") && bits.length >= 11){
                const newLimit = limit ? limit-1 : null;
                const subValues = decodePacket(bits, newLimit);
                console.log("groups:", subValues);
                if (Array.isArray(subValues)){
                    values.push(...subValues);
                }
                else if (typeof subValues === "number"){
                    values.push(subValues);
                }
            }
            return values;
        }
        else{
            const lengthTypeId = bits.shift();
            let subValues;
            if (lengthTypeId === "0"){
                const subPacketLength = parseInt(bits.splice(0,15).join(""), 2);
                console.log(`subPacketLength: ${subPacketLength}`);
                const subPacket = bits.splice(0,subPacketLength);
                subValues = decodePacket(subPacket);
            }
            else if (lengthTypeId === "1"){
                const subPacketCount = parseInt(bits.splice(0,11).join(""), 2);
                console.log(`subPacketCount: ${subPacketCount}`);
                subValues = decodePacket(bits, subPacketCount);
            }
            console.log(`\ncomputing operator:type=${type}\nsubValues: ${JSON.stringify(subValues)}\n`);
            if (type === 0){ // sum
                console.log("computing sum of", subValues);
                return subValues.reduce((previousValue, currentValue) => {
                    return previousValue + currentValue
                }, 0);
            }
            else if (type === 1){ // product
                console.log("computing product of", subValues);
                return subValues.reduce((previousValue, currentValue) => {
                    return previousValue * currentValue
                }, 1);
            }
            else if (type === 2){
                return Math.min(...subValues);
            }
            else if (type === 3){
                return Math.max(...subValues);
            }
            else if (type === 5){
                return subValues[0] > subValues[1] ? 1 : 0;
            }
            else if (type === 6){
                return subValues[0] < subValues[1] ? 1 : 0;
            }
            else if (type === 7){
                return subValues[0] === subValues[1] ? 1 : 0;
            }
        }
    }

    const values = decodePacket(bits);

    console.log(`answer = ${JSON.stringify(values)}`);
};

module.exports = { run };
