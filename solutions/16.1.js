const {readLines} = require("../common/readInput");

// Note:
// I know there are flaws in this, but it was good enough to get the right answer for part 1.
// See part 2, and my notes in journal.md.


const charValues = {
    "0": "0000", "1": "0001", "2": "0010", "3": "0011",
    "4": "0100", "5": "0101", "6": "0110", "7": "0111",
    "8": "1000", "9": "1001", "A": "1010", "B": "1011",
    "C": "1100", "D": "1101", "E": "1110", "F": "1111"
};

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const bits = input.shift().split('').map(char => charValues[char]).join("").split("");

    let versionSum = 0;

    const decodePacket = (bits, limit) => {
        if (limit === 0){
            return;
        }
        const version = parseInt(bits.splice(0,3).join(""), 2);
        const type = parseInt(bits.splice(0,3).join(""), 2);

        versionSum += version;

        if (type === 4){
            let lastGroup = false;
            let literalBinary = "";
            while (!lastGroup){
                const prefix = bits.shift();
                lastGroup = prefix === "0";
                const group = bits.splice(0,4).join("");
                literalBinary += group;
            }
            parseInt(literalBinary, 2);
        }
        else{
            const lengthTypeId = bits.shift();
            if (lengthTypeId === "0"){
                const subPacketLength = parseInt(bits.splice(0,15).join(""), 2);
                const subPacket = bits.splice(0,subPacketLength);
                decodePacket(subPacket);
            }
            else if (lengthTypeId === "1"){
                const subPacketCount = parseInt(bits.splice(0,11).join(""), 2);
                decodePacket(bits, subPacketCount);
            }
        }
        if (bits.includes("1") && bits.length >= 11){
            const newLimit = limit ? limit-1 : null;
            decodePacket(bits, newLimit);
        }
    }
    decodePacket(bits);
    console.log(`answer = ${versionSum}`);
};

module.exports = { run };
