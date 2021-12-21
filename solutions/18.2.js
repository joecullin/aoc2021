const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    if (/[^ 0-9,\][]/.test(input.join(","))){
        console.log("Bad input?");
        return;
    }

    const combos = [];
    for (let i=0; i<input.length; i++){
        for (let j=i+1; j<input.length; j++){
            combos.push([input[i], input[j]]);
        }
    }
    let current;

    const explodeNumber = () => {
        const lines = JSON.stringify(current, null, 1).split("\n");
        const pairIndex = lines.findIndex(line => (/^\s{4}\[/).test(line));
        if (pairIndex === -1){
            return false;
        }
        const pairValues = JSON.parse(`[ ${lines[pairIndex+1]} ${lines[pairIndex+2]} ]`);

        let hadEffect = false;


        // add to left neighbor
        for (let leftIndex = pairIndex -1; leftIndex >= 0; leftIndex--){
            if (/[0-9]/.test(lines[leftIndex])){
                let val = parseInt(lines[leftIndex].replace(",", ""));
                val += pairValues[0];
                lines[leftIndex] = `${val},`;
                hadEffect = true;
                break;
            }
        }

        // add to right neighbor
        for (let rightIndex = pairIndex + 4; rightIndex < lines.length; rightIndex++){
            if (/[0-9]/.test(lines[rightIndex])){
                let val = parseInt(lines[rightIndex].replace(",", ""));
                val += pairValues[1];
                lines[rightIndex] = `${val},`;
                hadEffect = true;
                break;
            }
        }

        lines.splice(pairIndex, 4, "0,");
        current = JSON.parse(lines.join("").replace(/\s/g, '').replace(/,\]/g, "]"));

        return hadEffect;
    };
    
    const splitNumber = () => {
        const number = JSON.stringify(current);
        const updated = number.replace(/(\d\d+)/, (match, value) => {
            const half = parseInt(value) / 2;
            return `[ ${Math.floor(half)} , ${Math.ceil(half)} ]`;
        }); 
        current = JSON.parse(updated);
        return updated !== number;
    };

    const computeMagnitude = () => {
        let number = JSON.stringify(current);
        while (/,/.test(number)){
            number = number.replace(/\[(\d+),(\d+)\]/, (match, left, right) => {
                return (3 * parseInt(left)) + (2 * parseInt(right));
            });
        }
        return parseInt(number);
    };

    const reduceNumber = () => {
        for (;;){
            const exploded = explodeNumber();
            if (exploded){ continue }

            const split = splitNumber();
            if (split){ continue }

            break;
        }
    };

    const magnitudes = [];
    combos.forEach(combo => {
        process.stdout.write(".");
        current = JSON.parse(`[ ${combo[0]} , ${combo[1]} ]`);
        reduceNumber();
        magnitudes.push(computeMagnitude());
    
        current = JSON.parse(`[ ${combo[1]} , ${combo[0]} ]`);
        reduceNumber();
        magnitudes.push(computeMagnitude());
    });

    magnitudes.sort((a,b) => a - b);
    console.log(`\nanswer:\n${magnitudes.pop()}`);
};

module.exports = { run };
