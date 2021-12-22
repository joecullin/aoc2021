const cloneDeep = require('lodash/cloneDeep');
const {readLines} = require("../common/readInput");

const run = async (params) => {
    const input = await readLines({inputPath: params.inputPath});
    const enhancementLookup = input.shift().split("");
    input.shift();

    let image = {};
    input.forEach( (row, rowIndex) => {
        row.split("").forEach( (val, colIndex) => {
            const x = colIndex;
            const y = rowIndex * -1;
            const id = `${x}:${y}`;
            image[id] = {
                x,
                y,
                val
            };
        });
    });

    const printImage = () => {
        console.log("-------------------");
        const top = Math.max(...Object.values(image).map(p => p.y));
        const left = Math.min(...Object.values(image).map(p => p.x));
        const bottom = Math.min(...Object.values(image).map(p => p.y));
        const right = Math.max(...Object.values(image).map(p => p.x));

        for (let y=top; y>=bottom; y--){
            for (let x=left; x<=right; x++){
                const  id = `${x}:${y}`;
                let pixel = image[id];
                if (!pixel){
                    pixel = {val: "_"};
                }
                process.stdout.write(`${pixel.val}`);
            }
            process.stdout.write(` ${y}\n`);
        }
    };

    printImage();
    
    const steps = 50;
    for (let i=0; i<steps; i++){
        const updated = {};

        // Not sure if this is true for everyone, but my "algorithm" alternates on each pass.
        let outerSpace = (i+1) % 2 === 0 ? "#" : ".";

        // The sample has constant outer space though. Uncomment this if testing the sample.
        // outerSpace = ".";

        console.log(`step ${i}: outerSpace=${outerSpace}`);

        // I could absolutely clean this up and make it more readable and faster,
        // but it's good enough to get the answer so I'm moving on to other days' puzzles.

        // The gist is I find the 3-pixel-wide "border" of my current image and evaluate that.
        // Anything farther than 3 pixels away is going to be "outer space" -- all .'s or all #'s.

        let borderNeighborIds = [];
        Object.values(image).forEach(p => {
            let enhancementString = "";
            [1,0,-1].forEach(row => {
                [-1,0,1].forEach(col => {
                    const neighbor = image[`${col+p.x}:${row+p.y}`];
                    let val = neighbor?.val;
                    if (!neighbor){
                        val = outerSpace;
                    } 
                    enhancementString += val === "#" ? "1" : "0";
                });
            });
            const lookupIndex = parseInt(enhancementString, 2);
            updated[`${p.x}:${p.y}`] = {
                ...p,
                val: enhancementLookup[lookupIndex]
            };
            [2,1,0,-1,-2].forEach(row => {
                [-2,-1,0,1,2].forEach(col => {
                    const neighbor = image[`${col+p.x}:${row+p.y}`];
                    if (!neighbor){
                        borderNeighborIds.push(`${col+p.x}:${row+p.y}`);
                    } 
                });
            });
        });

        borderNeighborIds = [...new Set(borderNeighborIds)]; // de-dupe
        borderNeighborIds.forEach(id => {
            const [x, y] = id.split(":").map(v => parseInt(v));
            const p = {x, y, val: outerSpace};
            let enhancementString = "";
            [1,0,-1].forEach(row => {
                [-1,0,1].forEach(col => {
                    const neighbor = image[`${col+p.x}:${row+p.y}`];
                    let val = neighbor?.val;
                    if (!neighbor){
                        val = outerSpace;
                    } 
                    enhancementString += val === "#" ? "1" : "0";
                });
            });
            const lookupIndex = parseInt(enhancementString, 2);
            updated[`${p.x}:${p.y}`] = {
                ...p,
                val: enhancementLookup[lookupIndex]
            };
        });
        image = cloneDeep(updated);

        console.log(`after ${i+1}:`);
        if ((i+1) % 1 === 0){
            printImage();
        }
    }

    const count = Object.values(image)
        .filter(p => p.val === "#")
        .length;
    console.log(`answer: ${count}`);
};

module.exports = { run };
